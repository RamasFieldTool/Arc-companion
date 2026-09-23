"use strict";
(() => {
  const display = document.getElementById('displayCanvas');
  const work = document.getElementById('workCanvas');
  const resultTitle = document.getElementById('resultTitle');
  const backpackSlotsEl = document.getElementById('backpackSlots');
  const backpackOccupiedEl = document.getElementById('backpackOccupied');
  const quickSlotsEl = document.getElementById('quickSlots');
  const quickOccupiedEl = document.getElementById('quickOccupied');
  const safeSlotsEl = document.getElementById('safeSlots');
  const safeOccupiedEl = document.getElementById('safeOccupied');
  const totalOccupiedEl = document.getElementById('totalOccupied');
  const statusEl = document.getElementById('status');
  const stateEl = document.getElementById('itemRecognitionState');
  const namesEl = document.getElementById('itemRecognitionNames');
  const outputEl = document.getElementById('itemRecognitionOutput');
  const retryBtn = document.getElementById('itemRecognitionRetry');
  if (!display || !work || !resultTitle || !stateEl || !namesEl || !outputEl) return;

  const RAW_ICON_BASE = 'https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/images/items/';
  const MAX_TEMPLATES = 320;
  const boxes = { B: [], Q: [], S: [] };
  const benchmarkMode = new URLSearchParams(location.search).get('benchmark') === '1';
  const benchmarkExpected = {
    B1: 'heavy_ammo',
    B4: 'adrenaline_shot',
    Q1: 'herbal_bandage',
    Q2: 'shield_recharger',
    S1: 'vita_shot'
  };

  let cleanFrame = null;
  let generation = 0;
  let running = false;
  let templatePromise = null;
  let scheduled = 0;

  const proto = CanvasRenderingContext2D.prototype;
  const prevDrawImage = proto.drawImage;
  const prevStrokeRect = proto.strokeRect;

  proto.drawImage = function (...args) {
    const result = prevDrawImage.apply(this, args);
    try {
      if (this.canvas === display && args[0] === work) {
        boxes.B.length = 0; boxes.Q.length = 0; boxes.S.length = 0;
        cleanFrame = this.getImageData(0, 0, display.width, display.height);
        generation += 1;
      }
    } catch (_) {}
    return result;
  };

  proto.strokeRect = function (x, y, w, h) {
    try {
      if (this.canvas === display) {
        const kind = colorKind(this.strokeStyle);
        if (kind) addUnique(boxes[kind], { x, y, w, h });
      }
    } catch (_) {}
    return prevStrokeRect.call(this, x, y, w, h);
  };

  function colorKind(style) {
    const s = String(style || '').replace(/\s+/g, '').toLowerCase();
    if (s === '#69d39b' || s.includes('105,211,155')) return 'B';
    if (s === '#ffb17f' || s.includes('255,177,127')) return 'Q';
    if (s === '#9dbfff' || s.includes('157,191,255')) return 'S';
    return null;
  }

  function addUnique(list, box) {
    const dup = list.some(b => Math.abs(b.x - box.x) < 2 && Math.abs(b.y - box.y) < 2 && Math.abs(b.w - box.w) < 3 && Math.abs(b.h - box.h) < 3);
    if (!dup) list.push(box);
  }

  const observer = new MutationObserver(() => {
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || '')) return;
    clearTimeout(scheduled);
    scheduled = setTimeout(() => startRecognition(false), 220);
  });
  observer.observe(resultTitle, { childList: true, characterData: true, subtree: true });
  retryBtn?.addEventListener('click', () => startRecognition(true));

  async function startRecognition(force) {
    if (running && !force) return;
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || '')) {
      stateEl.textContent = 'Erst einen erfolgreichen Inventar-Scan durchführen.';
      return;
    }
    if (!cleanFrame) {
      try { cleanFrame = display.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, display.width, display.height); } catch (_) {}
    }
    if (!cleanFrame) {
      stateEl.textContent = 'Kein lokales Scanbild für die Item-Erkennung verfügbar.';
      outputEl.textContent = '[camera test v12]\nerror: no local scan frame';
      return;
    }

    running = true;
    const runGen = generation;
    namesEl.innerHTML = '';
    stateEl.textContent = 'Test 12: Plätze werden korrigiert, danach startet der neue Silhouettenvergleich …';
    outputEl.textContent = '[camera test v12]\nstatus: preparing';

    try {
      correctBackpackCapacity();
      correctQuickOccupancy();

      const catalog = await loadTemplates();
      if (runGen !== generation && generation !== 0) return;
      if (!catalog.templates.length) throw new Error('Keine Referenz-Icons geladen');

      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = cleanFrame.width;
      sourceCanvas.height = cleanFrame.height;
      sourceCanvas.getContext('2d', { willReadFrequently: true }).putImageData(cleanFrame, 0, 0);

      const groups = [
        group('B', 'Rucksack', boxes.B, backpackSlotsEl, backpackOccupiedEl),
        group('Q', 'Schnelleinsatz', boxes.Q, quickSlotsEl, quickOccupiedEl),
        group('S', 'Sicherheitstasche', boxes.S, safeSlotsEl, safeOccupiedEl)
      ];

      const results = [];
      for (const g of groups) {
        for (const entry of selectOccupied(g)) {
          const slotFeatures = [-6, 0, 6].map(a => featureFor(sourceCanvas, entry.box, a)).filter(Boolean);
          if (!slotFeatures.length) continue;
          const ranked = rankAll(slotFeatures, catalog.templates);
          if (!ranked.length) continue;
          results.push({ kind: g.kind, area: g.name, index: entry.index, ranked });
        }
      }

      renderResults(results, catalog);
    } catch (err) {
      stateEl.textContent = 'Test 12 ist abgebrochen. Diagnose siehe unten.';
      outputEl.textContent = `[camera test v12]\nerror: ${String(err?.message || err).slice(0, 220)}`;
    } finally {
      running = false;
    }
  }

  function correctBackpackCapacity() {
    const declared = parseCount(backpackSlotsEl?.textContent);
    if (declared !== 16 || boxes.B.length < 16 || !cleanFrame) return;
    const ordered = boxes.B.slice(0,16).sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const lastRow = ordered.slice(-4);
    const pitchY = medianRowPitch(ordered);
    if (lastRow.length !== 4 || !(pitchY > 10)) return;
    const predicted = lastRow.map(b => ({ x:b.x, y:b.y+pitchY, w:b.w, h:b.h }));
    if (predicted.some(b => b.y+b.h >= cleanFrame.height-2)) return;
    const ev = predicted.map(borderEvidence);
    const strong = ev.filter(v => v >= .23).length;
    const avg = ev.reduce((a,b)=>a+b,0)/ev.length;
    if (strong >= 3 && avg >= .20) backpackSlotsEl.textContent = '20';
  }

  function correctQuickOccupancy() {
    const count = parseCount(quickSlotsEl?.textContent);
    let ordered = boxes.Q.slice().sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    if (Number.isFinite(count) && ordered.length > count) ordered = ordered.slice(0,count);
    if (!ordered.length) return;

    const occupied = ordered.filter(box => !quickLooksLikeEmptyCircle(box) && quickHasItemEvidence(box)).length;
    quickOccupiedEl.textContent = String(occupied);

    const b = parseCount(backpackOccupiedEl?.textContent);
    const s = parseCount(safeOccupiedEl?.textContent);
    if ([b,s].every(Number.isFinite)) totalOccupiedEl.textContent = String(b + occupied + s);

    if (statusEl) {
      statusEl.textContent = statusEl.textContent.replace(
        /Schnelleinsatz:\s*(\d+)\s*Plätze\s*\/\s*\d+\s*belegt\./,
        `Schnelleinsatz: $1 Plätze / ${occupied} belegt.`
      );
    }
  }

  function quickHasItemEvidence(box) {
    const badge = regionStats(box, .09, .71, .30, .92);
    const qty = regionStats(box, .68, .70, .94, .92);
    const body = regionStats(box, .18, .10, .82, .66);
    return badge.white > .040 || qty.white > .030 || body.bright > .20;
  }

  function quickLooksLikeEmptyCircle(box) {
    const { width, height, data } = cleanFrame;
    const cx = box.x + box.w * .50, cy = box.y + box.h * .48;
    const r0 = Math.min(box.w, box.h);
    let ring = 0, center = 0, outer = 0, ringN = 0, centerN = 0, outerN = 0;
    const sectorHits = new Array(20).fill(0);
    const sectorSamples = new Array(20).fill(0);

    for (let y = Math.max(0, Math.floor(box.y + box.h*.12)); y < Math.min(height, Math.ceil(box.y + box.h*.82)); y += 2) {
      for (let x = Math.max(0, Math.floor(box.x + box.w*.12)); x < Math.min(width, Math.ceil(box.x + box.w*.88)); x += 2) {
        const dx=(x-cx)/r0, dy=(y-cy)/r0, r=Math.sqrt(dx*dx+dy*dy);
        const p=(y*width+x)*4, lum=data[p]*.299+data[p+1]*.587+data[p+2]*.114;
        if (r < .12) { center += lum; centerN++; }
        else if (r >= .19 && r <= .30) {
          ring += lum; ringN++;
          let a=Math.atan2(dy,dx); if(a<0)a+=Math.PI*2;
          const s=Math.min(19,Math.floor(a/(Math.PI*2)*20));
          sectorSamples[s]++; if(lum>95) sectorHits[s]++;
        } else if (r >= .33 && r <= .42) { outer += lum; outerN++; }
      }
    }

    const ringMean=ring/Math.max(1,ringN), centerMean=center/Math.max(1,centerN), outerMean=outer/Math.max(1,outerN);
    const coverage=sectorHits.filter((v,i)=>sectorSamples[i] && v/sectorSamples[i] > .32).length/20;
    const badge=regionStats(box,.09,.71,.30,.92);
    return badge.white < .035 && coverage > .58 && ringMean > centerMean + 10 && ringMean > outerMean + 7;
  }

  function group(kind,name,raw,slotsEl,occEl) {
    let ordered=raw.slice().sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const count=parseCount(slotsEl?.textContent);
    if(Number.isFinite(count)&&ordered.length>count)ordered=ordered.slice(0,count);
    return {kind,name,boxes:ordered,occupied:parseCount(occEl?.textContent)};
  }

  function selectOccupied(g) {
    const entries=g.boxes.map((box,i)=>({box,index:i+1,score:occupancyScore(g.kind,box)}));
    if(Number.isFinite(g.occupied)){
      const chosen=new Set(entries.slice().sort((a,b)=>b.score-a.score).slice(0,Math.min(g.occupied,entries.length)).map(e=>e.index));
      return entries.filter(e=>chosen.has(e.index));
    }
    return entries.filter(e=>e.score>.2);
  }

  function occupancyScore(kind,box){
    if(kind==='Q' && quickLooksLikeEmptyCircle(box)) return -1;
    const body=regionStats(box,.14,.08,.86,.70),left=regionStats(box,.05,.62,.38,.94),right=regionStats(box,.58,.62,.96,.94);
    if(kind==='Q')return left.white*2+right.white*1.8+body.bright*.7+body.sat*.4;
    if(kind==='S')return body.bright*1.35+body.sat*.55+(left.white+right.white)*.75;
    return body.bright*1.45+body.sat*.42+(left.white+right.white)*.58;
  }

  function regionStats(box,fx0,fy0,fx1,fy1){
    const {width,height,data}=cleanFrame;
    const x0=clamp(Math.round(box.x+box.w*fx0),0,width-1),y0=clamp(Math.round(box.y+box.h*fy0),0,height-1);
    const x1=clamp(Math.round(box.x+box.w*fx1),x0+1,width),y1=clamp(Math.round(box.y+box.h*fy1),y0+1,height);
    let n=0,bright=0,white=0,sat=0;
    for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){
      const p=(y*width+x)*4,r=data[p],g=data[p+1],b=data[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=r*.299+g*.587+b*.114,s=mx?(mx-mn)/mx:0;
      if(l>145)bright++; if(l>135&&s<.30)white++; if(mx>68&&s>.32)sat++; n++;
    }
    return {bright:n?bright/n:0,white:n?white/n:0,sat:n?sat/n:0};
  }

  async function loadTemplates(){
    if(templatePromise)return templatePromise;
    templatePromise=(async()=>{
      const r=await fetch('items.json',{cache:'force-cache',credentials:'same-origin'});
      if(!r.ok)throw new Error(`items.json HTTP ${r.status}`);
      const items=await r.json();
      const wanted=[];const seen=new Set();
      for(const item of Array.isArray(items)?items:[]){
        const id=String(item?.id||'').trim();
        if(!/^[a-z0-9_]+$/.test(id)||seen.has(id))continue;
        seen.add(id);wanted.push({id,de:String(item.de||item.en||id),en:String(item.en||item.de||id)});
        if(wanted.length>=MAX_TEMPLATES)break;
      }
      for(const id of Object.values(benchmarkExpected)){
        if(!seen.has(id)){seen.add(id);wanted.push({id,de:id,en:id});}
      }
      const templates=[];let cursor=0;
      async function worker(){
        while(true){const i=cursor++;if(i>=wanted.length)return;const t=await loadTemplate(wanted[i]);if(t)templates.push(t);}
      }
      await Promise.all(Array.from({length:Math.min(8,wanted.length)},worker));
      return {templates,attempted:wanted.length};
    })();
    return templatePromise;
  }

  async function loadTemplate(item){
    const img=await loadImage(`${RAW_ICON_BASE}${item.id}.png`,7000);
    if(!img)return null;
    const box={x:0,y:0,w:img.naturalWidth||img.width,h:img.naturalHeight||img.height};
    const f=featureFor(img,box,0);
    return f?{...item,f}:null;
  }

  function loadImage(url,timeoutMs){
    return new Promise(resolve=>{
      const img=new Image();let done=false;
      const finish=v=>{if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(v);};
      const timer=setTimeout(()=>finish(null),timeoutMs);
      img.crossOrigin='anonymous';img.referrerPolicy='no-referrer';img.onload=()=>finish(img);img.onerror=()=>finish(null);img.src=url;
    });
  }

  function featureFor(source,box,angle){
    if(!(box.w>4&&box.h>4))return null;
    const prep=document.createElement('canvas');prep.width=72;prep.height=72;
    const pctx=prep.getContext('2d',{willReadFrequently:true});
    pctx.save();pctx.translate(36,36);pctx.rotate(angle*Math.PI/180);pctx.translate(-36,-36);
    pctx.drawImage(source,box.x+box.w*.05,box.y+box.h*.04,box.w*.90,box.h*.75,3,3,66,54);
    pctx.restore();
    const trim=findForeground(prep);
    if(!trim)return null;

    const norm=document.createElement('canvas');norm.width=40;norm.height=40;
    const nctx=norm.getContext('2d',{willReadFrequently:true});
    const pad=3, maxW=34,maxH=34;
    const scale=Math.min(maxW/trim.w,maxH/trim.h);
    const dw=Math.max(2,trim.w*scale),dh=Math.max(2,trim.h*scale),dx=(40-dw)/2,dy=(40-dh)/2;
    nctx.drawImage(prep,trim.x,trim.y,trim.w,trim.h,dx,dy,dw,dh);
    const data=nctx.getImageData(0,0,40,40).data;
    return makeFeature(data,40,40,trim.w/Math.max(1,trim.h),trim.fill);
  }

  function findForeground(canvas){
    const ctx=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height,d=ctx.getImageData(0,0,w,h).data;
    const samples=[];
    for(const [x0,y0] of [[4,4],[w-10,4],[4,h-10],[w-10,h-10]]){
      for(let y=y0;y<y0+6;y++)for(let x=x0;x<x0+6;x++){const p=(y*w+x)*4;samples.push([d[p],d[p+1],d[p+2]]);}
    }
    const bg=[0,0,0];for(const s of samples){bg[0]+=s[0];bg[1]+=s[1];bg[2]+=s[2];}bg[0]/=samples.length;bg[1]/=samples.length;bg[2]/=samples.length;
    const bgLum=bg[0]*.299+bg[1]*.587+bg[2]*.114;
    const mask=new Uint8Array(w*h);let count=0;
    for(let y=4;y<h-4;y++)for(let x=4;x<w-4;x++){
      const p=(y*w+x)*4,r=d[p],g=d[p+1],b=d[p+2],lum=r*.299+g*.587+b*.114;
      const dist=Math.hypot(r-bg[0],g-bg[1],b-bg[2]);
      if((lum>bgLum+28&&lum>75)||dist>68){mask[y*w+x]=1;count++;}
    }
    if(count<12)return {x:7,y:6,w:w-14,h:h-18,fill:.1};
    const seen=new Uint8Array(mask.length);let best=null;
    const stack=[];
    for(let y=4;y<h-4;y++)for(let x=4;x<w-4;x++){
      const start=y*w+x;if(!mask[start]||seen[start])continue;
      stack.length=0;stack.push(start);seen[start]=1;let n=0,minX=x,maxX=x,minY=y,maxY=y;
      while(stack.length){const idx=stack.pop(),cy=Math.floor(idx/w),cx=idx-cy*w;n++;minX=Math.min(minX,cx);maxX=Math.max(maxX,cx);minY=Math.min(minY,cy);maxY=Math.max(maxY,cy);
        for(let yy=Math.max(4,cy-1);yy<=Math.min(h-5,cy+1);yy++)for(let xx=Math.max(4,cx-1);xx<=Math.min(w-5,cx+1);xx++){
          const ni=yy*w+xx;if(mask[ni]&&!seen[ni]){seen[ni]=1;stack.push(ni);}
        }
      }
      const bw=maxX-minX+1,bh=maxY-minY+1,central=1-Math.min(1,Math.hypot((minX+maxX)/2-w/2,(minY+maxY)/2-h/2)/(w*.7));
      const score=n*(.65+.35*central);
      if(!best||score>best.score)best={score,n,minX,maxX,minY,maxY,bw,bh};
    }
    if(!best)return null;
    const pad=4,x=clamp(best.minX-pad,0,w-1),y=clamp(best.minY-pad,0,h-1),x2=clamp(best.maxX+pad+1,x+1,w),y2=clamp(best.maxY+pad+1,y+1,h);
    return {x,y,w:x2-x,h:y2-y,fill:best.n/Math.max(1,best.bw*best.bh)};
  }

  function makeFeature(data,w,h,aspect,fill){
    const gray=new Float32Array(w*h),hue=new Float32Array(12);
    for(let i=0;i<w*h;i++){
      const p=i*4,r=data[p],g=data[p+1],b=data[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),delta=mx-mn;
      gray[i]=r*.299+g*.587+b*.114;
      if(delta>10&&mx>35){let H;if(mx===r)H=((g-b)/delta)%6;else if(mx===g)H=(b-r)/delta+2;else H=(r-g)/delta+4;H=(H*60+360)%360;hue[Math.min(11,Math.floor(H/30))]+=delta/Math.max(1,mx);}
    }
    const hog=new Float32Array(4*4*8),projX=new Float32Array(10),projY=new Float32Array(10);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const i=y*w+x,gx=gray[i+1]-gray[i-1],gy=gray[i+w]-gray[i-w],mag=Math.hypot(gx,gy);if(mag<6)continue;
      let ang=Math.atan2(gy,gx);if(ang<0)ang+=Math.PI; if(ang>=Math.PI)ang-=Math.PI;
      const bin=Math.min(7,Math.floor(ang/Math.PI*8)),cx=Math.min(3,Math.floor(x/w*4)),cy=Math.min(3,Math.floor(y/h*4));
      hog[(cy*4+cx)*8+bin]+=mag;
      projX[Math.min(9,Math.floor(x/w*10))]+=mag;projY[Math.min(9,Math.floor(y/h*10))]+=mag;
    }
    normalize(hog);normalize(projX);normalize(projY);normalize(hue);
    return {hog,projX,projY,hue,aspect,fill};
  }

  function rankAll(slotFeatures,templates){
    const arr=[];
    for(const t of templates){
      let best=0;
      for(const s of slotFeatures){
        const hog=dot(s.hog,t.f.hog),px=dot(s.projX,t.f.projX),py=dot(s.projY,t.f.projY),hue=dot(s.hue,t.f.hue);
        const aspect=Math.exp(-Math.abs(Math.log(Math.max(.1,s.aspect)/Math.max(.1,t.f.aspect)))*1.2);
        const fill=Math.exp(-Math.abs(s.fill-t.f.fill)*1.8);
        best=Math.max(best,hog*.56+(px+py)*.115+hue*.08+aspect*.08+fill*.05);
      }
      arr.push({item:t,score:best});
    }
    arr.sort((a,b)=>b.score-a.score);return arr;
  }

  function renderResults(results,catalog){
    namesEl.innerHTML='';
    const lines=['[camera test v12]',`reference-icons: ${catalog.templates.length}/${catalog.attempted} loaded`];
    let benchmarkCorrect=0,benchmarkTotal=0;

    for(const r of results){
      const slot=`${r.kind}${r.index}`,top=r.ranked.slice(0,3),winner=top[0];
      const card=document.createElement('div');card.className='item-result-card';
      const title=document.createElement('div');title.className='item-result-title';title.textContent=`${slot}: ${winner.item.de}`;
      const score=document.createElement('div');score.className='item-result-score';score.textContent=`Ähnlichkeit ${(winner.score*100).toFixed(1)}%`;
      const alt=document.createElement('div');alt.className='item-result-alt';alt.textContent='Alternativen: '+top.slice(1).map(x=>`${x.item.de} ${(x.score*100).toFixed(1)}%`).join(' · ');
      card.append(title,score,alt);

      const expected=benchmarkMode?benchmarkExpected[slot]:null;
      if(expected){
        benchmarkTotal++;
        const rank=r.ranked.findIndex(x=>x.item.id===expected)+1;
        const expectedItem=r.ranked.find(x=>x.item.id===expected)?.item;
        const bench=document.createElement('div');bench.className='item-result-alt';
        const ok=winner.item.id===expected;if(ok)benchmarkCorrect++;
        bench.textContent=`Benchmark: Soll ${expectedItem?.de||expected} · Rang ${rank||'nicht geladen'} · ${ok?'RICHTIG':'FALSCH'}`;
        card.appendChild(bench);
        lines.push(`${slot}: top=${winner.item.id} ${(winner.score*100).toFixed(1)} | expected=${expected} rank=${rank||0}`);
      } else {
        lines.push(`${slot}: ${top.map(x=>`${x.item.id} ${(x.score*100).toFixed(1)}`).join(' | ')}`);
      }
      namesEl.appendChild(card);
    }

    if(benchmarkMode){
      stateEl.textContent=`Benchmark: ${benchmarkCorrect}/${benchmarkTotal} bekannte Slots korrekt. Schnelleinsatz-Leerplätze werden separat per Kreis-/Badge-Erkennung geprüft.`;
      lines.push(`benchmark: ${benchmarkCorrect}/${benchmarkTotal} correct`);
    } else {
      stateEl.textContent=`${results.length} belegte Slots verglichen. Test 12 nutzt jetzt normalisierte Item-Silhouetten statt des ganzen Slotbilds.`;
    }
    outputEl.textContent=lines.join('\n');
  }

  function medianRowPitch(ordered){const ys=[...new Set(ordered.map(b=>Math.round(b.y)))].sort((a,b)=>a-b),ds=[];for(let i=1;i<ys.length;i++)if(ys[i]-ys[i-1]>5)ds.push(ys[i]-ys[i-1]);ds.sort((a,b)=>a-b);return ds.length?ds[Math.floor(ds.length/2)]:0;}
  function borderEvidence(box){const {width,height,data}=cleanFrame;const x0=clamp(Math.round(box.x),0,width-2),y0=clamp(Math.round(box.y),0,height-2),x1=clamp(Math.round(box.x+box.w),x0+1,width-1),y1=clamp(Math.round(box.y+box.h),y0+1,height-1);let samples=0,edges=0;const test=(x,y,dx,dy)=>{const p=(y*width+x)*4,q=((y+dy)*width+(x+dx))*4,a=data[p]*.299+data[p+1]*.587+data[p+2]*.114,b=data[q]*.299+data[q+1]*.587+data[q+2]*.114;samples++;if(Math.abs(a-b)>24)edges++;};for(let x=x0+1;x<x1-1;x+=2){test(x,y0,0,1);test(x,y1-1,0,-1);}for(let y=y0+1;y<y1-1;y+=2){test(x0,y,1,0);test(x1-1,y,-1,0);}return samples?edges/samples:0;}
  function parseCount(text){const m=String(text||'').match(/\d+/);return m?Number.parseInt(m[0],10):NaN;}
  function dot(a,b){const n=Math.min(a.length,b.length);let s=0;for(let i=0;i<n;i++)s+=a[i]*b[i];return clamp(s,0,1);}
  function normalize(v){let s=0;for(const x of v)s+=x*x;const n=Math.sqrt(s)||1;for(let i=0;i<v.length;i++)v[i]/=n;return v;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
})();
