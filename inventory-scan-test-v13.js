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

  const CATALOG_URL = 'https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main';
  const RAW_ICON_BASE = 'https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/images/items/';
  const RAW_ITEM_BASE = 'https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/';
  const boxes = { B: [], Q: [], S: [] };
  const nameCache = new Map();
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
    if (!list.some(b => Math.abs(b.x-box.x)<2 && Math.abs(b.y-box.y)<2 && Math.abs(b.w-box.w)<3 && Math.abs(b.h-box.h)<3)) list.push(box);
  }

  const observer = new MutationObserver(() => {
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || '')) return;
    clearTimeout(scheduled);
    scheduled = setTimeout(() => startRecognition(false), 260);
  });
  observer.observe(resultTitle, { childList:true, characterData:true, subtree:true });
  retryBtn?.addEventListener('click', () => startRecognition(true));

  async function startRecognition(force) {
    if (running && !force) return;
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || '')) {
      stateEl.textContent = 'Erst einen erfolgreichen Inventar-Scan durchführen.';
      return;
    }
    if (!cleanFrame) {
      try { cleanFrame = display.getContext('2d', { willReadFrequently:true }).getImageData(0,0,display.width,display.height); } catch (_) {}
    }
    if (!cleanFrame) {
      stateEl.textContent = 'Kein lokales Scanbild für die Item-Erkennung verfügbar.';
      outputEl.textContent = '[camera test v13]\nerror: no local scan frame';
      return;
    }

    running = true;
    const runGen = generation;
    const started = performance.now();
    namesEl.innerHTML = '';
    stateEl.textContent = 'Test 13: Vollständiger ARC-Itemkatalog wird geladen. Das kann beim ersten Durchlauf etwas dauern …';
    outputEl.textContent = '[camera test v13]\nstatus: loading complete catalogue';

    try {
      correctBackpackCapacity();
      correctQuickOccupancy();
      const catalog = await loadTemplates();
      if (runGen !== generation && generation !== 0) return;
      if (!catalog.templates.length) throw new Error('Keine Referenz-Icons geladen');

      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = cleanFrame.width;
      sourceCanvas.height = cleanFrame.height;
      sourceCanvas.getContext('2d', { willReadFrequently:true }).putImageData(cleanFrame,0,0);

      const groups = [
        group('B','Rucksack',boxes.B,backpackSlotsEl,backpackOccupiedEl),
        group('Q','Schnelleinsatz',boxes.Q,quickSlotsEl,quickOccupiedEl),
        group('S','Sicherheitstasche',boxes.S,safeSlotsEl,safeOccupiedEl)
      ];

      stateEl.textContent = `Test 13: ${catalog.templates.length} Referenz-Icons geladen. Lokaler Form-Embedding-Vergleich läuft …`;
      const results = [];
      for (const g of groups) {
        for (const entry of selectOccupied(g)) {
          const variants = [];
          for (const angle of [-7,0,7]) {
            for (const bias of [-7,5]) {
              const f = featureForSlot(sourceCanvas, entry.box, angle, bias);
              if (f) variants.push(f);
            }
          }
          if (!variants.length) continue;
          const ranked = rankAll(variants, catalog.templates).slice(0,5);
          if (ranked.length) results.push({kind:g.kind,area:g.name,index:entry.index,ranked});
        }
      }

      const ids = [...new Set(results.flatMap(r => r.ranked.slice(0,3).map(x => x.item.id)))];
      await Promise.all(ids.map(loadGermanName));
      renderResults(results, catalog, performance.now()-started);
    } catch (err) {
      stateEl.textContent = 'Test 13 ist abgebrochen. Diagnose siehe unten.';
      outputEl.textContent = `[camera test v13]\nerror: ${String(err?.message || err).slice(0,220)}`;
    } finally {
      running = false;
    }
  }

  function correctBackpackCapacity() {
    const declared = parseCount(backpackSlotsEl?.textContent);
    if (declared !== 16 || boxes.B.length < 16 || !cleanFrame) return;
    const ordered = boxes.B.slice(0,16).sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const lastRow = ordered.slice(-4), pitchY = medianRowPitch(ordered);
    if (lastRow.length !== 4 || !(pitchY > 10)) return;
    const predicted = lastRow.map(b => ({x:b.x,y:b.y+pitchY,w:b.w,h:b.h}));
    if (predicted.some(b => b.y+b.h >= cleanFrame.height-2)) return;
    const ev = predicted.map(borderEvidence);
    if (ev.filter(v => v>=.23).length >= 3 && ev.reduce((a,b)=>a+b,0)/ev.length >= .20) {
      backpackSlotsEl.textContent = '20';
      if (statusEl) statusEl.textContent = statusEl.textContent.replace(/Rucksack:\s*16\s*Plätze/i,'Rucksack: 20 Plätze');
    }
  }

  function correctQuickOccupancy() {
    const count = parseCount(quickSlotsEl?.textContent);
    let ordered = boxes.Q.slice().sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    if (Number.isFinite(count) && ordered.length>count) ordered=ordered.slice(0,count);
    if (!ordered.length) return;
    const occupied = ordered.filter(box => !quickLooksLikeEmptyCircle(box) && quickHasItemEvidence(box)).length;
    quickOccupiedEl.textContent = String(occupied);
    const b=parseCount(backpackOccupiedEl?.textContent),s=parseCount(safeOccupiedEl?.textContent);
    if ([b,s].every(Number.isFinite)) totalOccupiedEl.textContent=String(b+occupied+s);
    if (statusEl) statusEl.textContent=statusEl.textContent.replace(/Schnelleinsatz:\s*(\d+)\s*Plätze\s*\/\s*\d+\s*belegt\./,`Schnelleinsatz: $1 Plätze / ${occupied} belegt.`);
  }

  function quickHasItemEvidence(box) {
    const badge=regionStats(box,.09,.71,.30,.92),qty=regionStats(box,.68,.70,.94,.92),body=regionStats(box,.18,.10,.82,.66);
    return badge.white>.040 || qty.white>.030 || body.bright>.20;
  }

  function quickLooksLikeEmptyCircle(box) {
    const {width,height,data}=cleanFrame,cx=box.x+box.w*.50,cy=box.y+box.h*.48,r0=Math.min(box.w,box.h);
    let ring=0,center=0,outer=0,ringN=0,centerN=0,outerN=0;
    const hits=new Array(20).fill(0),samples=new Array(20).fill(0);
    for(let y=Math.max(0,Math.floor(box.y+box.h*.12));y<Math.min(height,Math.ceil(box.y+box.h*.82));y+=2){
      for(let x=Math.max(0,Math.floor(box.x+box.w*.12));x<Math.min(width,Math.ceil(box.x+box.w*.88));x+=2){
        const dx=(x-cx)/r0,dy=(y-cy)/r0,r=Math.sqrt(dx*dx+dy*dy),p=(y*width+x)*4,lum=data[p]*.299+data[p+1]*.587+data[p+2]*.114;
        if(r<.12){center+=lum;centerN++;}
        else if(r>=.19&&r<=.30){ring+=lum;ringN++;let a=Math.atan2(dy,dx);if(a<0)a+=Math.PI*2;const s=Math.min(19,Math.floor(a/(Math.PI*2)*20));samples[s]++;if(lum>95)hits[s]++;}
        else if(r>=.33&&r<=.42){outer+=lum;outerN++;}
      }
    }
    const ringMean=ring/Math.max(1,ringN),centerMean=center/Math.max(1,centerN),outerMean=outer/Math.max(1,outerN);
    const coverage=hits.filter((v,i)=>samples[i]&&v/samples[i]>.32).length/20,badge=regionStats(box,.09,.71,.30,.92);
    return badge.white<.035 && coverage>.58 && ringMean>centerMean+10 && ringMean>outerMean+7;
  }

  function group(kind,name,raw,slotsEl,occEl){
    let ordered=raw.slice().sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const count=parseCount(slotsEl?.textContent);if(Number.isFinite(count)&&ordered.length>count)ordered=ordered.slice(0,count);
    return {kind,name,boxes:ordered,occupied:parseCount(occEl?.textContent)};
  }

  function selectOccupied(g){
    const entries=g.boxes.map((box,i)=>({box,index:i+1,score:occupancyScore(g.kind,box)}));
    if(Number.isFinite(g.occupied)){
      const chosen=new Set(entries.slice().sort((a,b)=>b.score-a.score).slice(0,Math.min(g.occupied,entries.length)).map(e=>e.index));
      return entries.filter(e=>chosen.has(e.index));
    }
    return entries.filter(e=>e.score>.2);
  }

  function occupancyScore(kind,box){
    if(kind==='Q'&&quickLooksLikeEmptyCircle(box))return -1;
    const body=regionStats(box,.14,.08,.86,.70),left=regionStats(box,.05,.62,.38,.94),right=regionStats(box,.58,.62,.96,.94);
    if(kind==='Q')return left.white*2+right.white*1.8+body.bright*.7+body.sat*.4;
    if(kind==='S')return body.bright*1.35+body.sat*.55+(left.white+right.white)*.75;
    return body.bright*1.45+body.sat*.42+(left.white+right.white)*.58;
  }

  function regionStats(box,fx0,fy0,fx1,fy1){
    const {width,height,data}=cleanFrame;
    const x0=clamp(Math.round(box.x+box.w*fx0),0,width-1),y0=clamp(Math.round(box.y+box.h*fy0),0,height-1),x1=clamp(Math.round(box.x+box.w*fx1),x0+1,width),y1=clamp(Math.round(box.y+box.h*fy1),y0+1,height);
    let n=0,bright=0,white=0,sat=0;
    for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){const p=(y*width+x)*4,r=data[p],g=data[p+1],b=data[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=r*.299+g*.587+b*.114,s=mx?(mx-mn)/mx:0;if(l>145)bright++;if(l>135&&s<.30)white++;if(mx>68&&s>.32)sat++;n++;}
    return {bright:n?bright/n:0,white:n?white/n:0,sat:n?sat/n:0};
  }

  async function loadTemplates(){
    if(templatePromise)return templatePromise;
    templatePromise=(async()=>{
      const r=await fetch(CATALOG_URL,{cache:'no-store',referrerPolicy:'no-referrer'});
      if(!r.ok)throw new Error(`Katalog HTTP ${r.status}`);
      const entries=await r.json();
      const items=(Array.isArray(entries)?entries:[]).filter(e=>e?.type==='file'&&/^[a-z0-9_]+\.json$/i.test(e.name)).map(e=>({id:e.name.replace(/\.json$/i,'')}));
      if(!items.length)throw new Error('Vollständiger Item-Katalog leer');
      const templates=[];let cursor=0,done=0;
      async function worker(){
        while(true){const i=cursor++;if(i>=items.length)return;const t=await loadTemplate(items[i]);if(t)templates.push(t);done++;if(done%25===0||done===items.length)stateEl.textContent=`Test 13: Referenz-Icons ${done}/${items.length} geprüft, ${templates.length} nutzbar …`;}
      }
      await Promise.all(Array.from({length:Math.min(12,items.length)},worker));
      return {templates,attempted:items.length};
    })();
    return templatePromise;
  }

  async function loadTemplate(item){
    const img=await loadImage(`${RAW_ICON_BASE}${item.id}.png`,6500);if(!img)return null;
    const f=featureForReference(img);return f?{id:item.id,f}:null;
  }

  function loadImage(url,timeoutMs){
    return new Promise(resolve=>{const img=new Image();let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(v);};const timer=setTimeout(()=>finish(null),timeoutMs);img.crossOrigin='anonymous';img.referrerPolicy='no-referrer';img.onload=()=>finish(img);img.onerror=()=>finish(null);img.src=url;});
  }

  function featureForReference(img){
    const c=document.createElement('canvas');c.width=96;c.height=96;const ctx=c.getContext('2d',{willReadFrequently:true});
    const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,s=Math.min(84/iw,84/ih),dw=iw*s,dh=ih*s;
    ctx.clearRect(0,0,96,96);ctx.drawImage(img,(96-dw)/2,(96-dh)/2,dw,dh);
    const id=ctx.getImageData(0,0,96,96),mask=new Uint8Array(96*96);let n=0;
    for(let i=0;i<mask.length;i++){const a=id.data[i*4+3],r=id.data[i*4],g=id.data[i*4+1],b=id.data[i*4+2],lum=r*.299+g*.587+b*.114;if(a>24&&(lum>18||Math.max(r,g,b)>24)){mask[i]=1;n++;}}
    if(n<20)return null;return featureFromMask(mask,96,96);
  }

  function featureForSlot(source,box,angle,bias){
    const c=document.createElement('canvas');c.width=96;c.height=96;const ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.save();ctx.translate(48,48);ctx.rotate(angle*Math.PI/180);ctx.translate(-48,-48);
    ctx.drawImage(source,box.x+box.w*.06,box.y+box.h*.04,box.w*.88,box.h*.72,7,9,82,66);ctx.restore();
    const id=ctx.getImageData(0,0,96,96),d=id.data;
    const bgSamples=[];
    for(let y=9;y<75;y+=5)for(const x of [8,12,84,88]){const p=(y*96+x)*4;bgSamples.push([d[p],d[p+1],d[p+2]]);}
    for(let x=10;x<86;x+=5)for(const y of [8,12,72,76]){const p=(y*96+x)*4;bgSamples.push([d[p],d[p+1],d[p+2]]);}
    const bg=[median(bgSamples.map(v=>v[0])),median(bgSamples.map(v=>v[1])),median(bgSamples.map(v=>v[2]))],bgLum=bg[0]*.299+bg[1]*.587+bg[2]*.114;
    const mask=new Uint8Array(96*96);
    for(let y=7;y<80;y++)for(let x=7;x<89;x++){
      const p=(y*96+x)*4,r=d[p],g=d[p+1],b=d[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),lum=r*.299+g*.587+b*.114,sat=mx?(mx-mn)/mx:0,dist=Math.hypot(r-bg[0],g-bg[1],b-bg[2]);
      const fg=(lum>bgLum+24+bias&&lum>68)||(dist>58+bias*1.2&&lum>48)||(sat>.34&&mx>82&&dist>38+bias*.5);
      if(fg)mask[y*96+x]=1;
    }
    eraseUi(mask,96,96);
    const cleaned=keepUsefulComponents(mask,96,96);if(!cleaned)return null;
    return featureFromMask(cleaned,96,96);
  }

  function eraseUi(mask,w,h){
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(x<5||x>w-6||y<5||y>80)mask[y*w+x]=0;
  }

  function keepUsefulComponents(mask,w,h){
    const seen=new Uint8Array(mask.length),components=[],stack=[];
    for(let y=4;y<h-4;y++)for(let x=4;x<w-4;x++){
      const start=y*w+x;if(!mask[start]||seen[start])continue;stack.length=0;stack.push(start);seen[start]=1;const pts=[];let minX=x,maxX=x,minY=y,maxY=y;
      while(stack.length){const idx=stack.pop(),cy=Math.floor(idx/w),cx=idx-cy*w;pts.push(idx);minX=Math.min(minX,cx);maxX=Math.max(maxX,cx);minY=Math.min(minY,cy);maxY=Math.max(maxY,cy);for(let yy=Math.max(4,cy-1);yy<=Math.min(h-5,cy+1);yy++)for(let xx=Math.max(4,cx-1);xx<=Math.min(w-5,cx+1);xx++){const ni=yy*w+xx;if(mask[ni]&&!seen[ni]){seen[ni]=1;stack.push(ni);}}}
      if(pts.length<6)continue;const cx=(minX+maxX)/2,cy=(minY+maxY)/2,central=1-Math.min(1,Math.hypot(cx-w/2,cy-h*.44)/(w*.72)),score=pts.length*(.55+.45*central);components.push({pts,minX,maxX,minY,maxY,score});
    }
    if(!components.length)return null;components.sort((a,b)=>b.score-a.score);const best=components[0].score,out=new Uint8Array(mask.length);let kept=0;
    for(const c of components.slice(0,8)){if(c.score<best*.10&&c.pts.length<18)continue;for(const i of c.pts)out[i]=1;kept+=c.pts.length;}
    return kept>=18?out:null;
  }

  function featureFromMask(mask,w,h){
    let minX=w,maxX=-1,minY=h,maxY=-1,n=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);n++;}
    if(n<18||maxX<minX||maxY<minY)return null;const bw=maxX-minX+1,bh=maxY-minY+1,aspect=bw/Math.max(1,bh),fill=n/Math.max(1,bw*bh),N=48,norm=new Float32Array(N*N),scale=Math.min(40/bw,40/bh),dw=bw*scale,dh=bh*scale,ox=(N-dw)/2,oy=(N-dh)/2;
    for(let ny=0;ny<N;ny++)for(let nx=0;nx<N;nx++){const sx=Math.floor((nx-ox)/scale+minX),sy=Math.floor((ny-oy)/scale+minY);if(sx>=minX&&sx<=maxX&&sy>=minY&&sy<=maxY&&mask[sy*w+sx])norm[ny*N+nx]=1;}
    const low=new Float32Array(16*16);for(let by=0;by<16;by++)for(let bx=0;bx<16;bx++){let s=0;for(let yy=0;yy<3;yy++)for(let xx=0;xx<3;xx++)s+=norm[(by*3+yy)*N+(bx*3+xx)];low[by*16+bx]=s/9;}
    const hog=new Float32Array(4*4*9),px=new Float32Array(16),py=new Float32Array(16);
    for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){const i=y*N+x,gx=norm[i+1]-norm[i-1],gy=norm[i+N]-norm[i-N],mag=Math.hypot(gx,gy);if(mag<.05)continue;let a=Math.atan2(gy,gx);if(a<0)a+=Math.PI;if(a>=Math.PI)a-=Math.PI;const bin=Math.min(8,Math.floor(a/Math.PI*9)),cx=Math.min(3,Math.floor(x/N*4)),cy=Math.min(3,Math.floor(y/N*4));hog[(cy*4+cx)*9+bin]+=mag;px[Math.min(15,Math.floor(x/N*16))]+=mag;py[Math.min(15,Math.floor(y/N*16))]+=mag;}
    const radial=new Float32Array(24),cx=N/2,cy=N/2,maxR=Math.hypot(cx,cy);for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(norm[y*N+x]>.5){let a=Math.atan2(y-cy,x-cx);if(a<0)a+=Math.PI*2;const b=Math.min(23,Math.floor(a/(Math.PI*2)*24)),r=Math.hypot(x-cx,y-cy)/maxR;radial[b]=Math.max(radial[b],r);}
    normalize(low);normalize(hog);normalize(px);normalize(py);normalize(radial);return {low,hog,px,py,radial,aspect,fill};
  }

  function rankAll(slotVariants,templates){
    const out=[];for(const t of templates){let best=0;for(const s of slotVariants){const mask=dot(s.low,t.f.low),hog=dot(s.hog,t.f.hog),proj=(dot(s.px,t.f.px)+dot(s.py,t.f.py))/2,rad=dot(s.radial,t.f.radial),aspect=Math.exp(-Math.abs(Math.log(Math.max(.12,s.aspect)/Math.max(.12,t.f.aspect)))*1.15),fill=Math.exp(-Math.abs(s.fill-t.f.fill)*1.4),score=mask*.43+hog*.24+proj*.13+rad*.10+aspect*.06+fill*.04;best=Math.max(best,score);}out.push({item:t,score:best});}
    out.sort((a,b)=>b.score-a.score);return out;
  }

  async function loadGermanName(id){
    if(nameCache.has(id))return nameCache.get(id);let name=prettyId(id);try{const r=await fetch(`${RAW_ITEM_BASE}${id}.json`,{cache:'force-cache',referrerPolicy:'no-referrer'});if(r.ok){const j=await r.json();name=String(j?.name?.de||j?.name?.en||name);}}catch(_){}nameCache.set(id,name);return name;
  }

  function renderResults(results,catalog,elapsed){
    namesEl.innerHTML='';const lines=['[camera test v13]',`catalogue: ${catalog.attempted} item files`,`reference-icons: ${catalog.templates.length} usable`,`elapsed-ms: ${Math.round(elapsed)}`];
    for(const r of results){const slot=`${r.kind}${r.index}`,top=r.ranked.slice(0,3),winner=top[0],gap=top[1]?winner.score-top[1].score:winner.score,uncertain=winner.score<.58||gap<.018;const card=document.createElement('div');card.className='item-result-card';const title=document.createElement('div');title.className='item-result-title';title.textContent=`${slot}: ${nameCache.get(winner.item.id)||prettyId(winner.item.id)}`;const score=document.createElement('div');score.className='item-result-score';score.textContent=`Form-Ähnlichkeit ${(winner.score*100).toFixed(1)}% · Abstand ${(gap*100).toFixed(1)} Punkte${uncertain?' · UNSICHER':''}`;const alt=document.createElement('div');alt.className='item-result-alt';alt.textContent='Alternativen: '+top.slice(1).map(x=>`${nameCache.get(x.item.id)||prettyId(x.item.id)} ${(x.score*100).toFixed(1)}%`).join(' · ');card.append(title,score,alt);namesEl.appendChild(card);lines.push(`${slot}: ${top.map(x=>`${x.item.id} ${(x.score*100).toFixed(1)}`).join(' | ')}`);}
    stateEl.textContent=`${results.length} belegte Slots gegen ${catalog.templates.length} nutzbare ARC-Referenz-Icons verglichen. Test 13 läuft absichtlich ohne bekannte Soll-Lösung.`;outputEl.textContent=lines.join('\n');
  }

  function medianRowPitch(ordered){const ys=[...new Set(ordered.map(b=>Math.round(b.y)))].sort((a,b)=>a-b),ds=[];for(let i=1;i<ys.length;i++)if(ys[i]-ys[i-1]>5)ds.push(ys[i]-ys[i-1]);ds.sort((a,b)=>a-b);return ds.length?ds[Math.floor(ds.length/2)]:0;}
  function borderEvidence(box){const {width,height,data}=cleanFrame,x0=clamp(Math.round(box.x),0,width-2),y0=clamp(Math.round(box.y),0,height-2),x1=clamp(Math.round(box.x+box.w),x0+1,width-1),y1=clamp(Math.round(box.y+box.h),y0+1,height-1);let samples=0,edges=0;const test=(x,y,dx,dy)=>{const p=(y*width+x)*4,q=((y+dy)*width+(x+dx))*4,a=data[p]*.299+data[p+1]*.587+data[p+2]*.114,b=data[q]*.299+data[q+1]*.587+data[q+2]*.114;samples++;if(Math.abs(a-b)>24)edges++;};for(let x=x0+1;x<x1-1;x+=2){test(x,y0,0,1);test(x,y1-1,0,-1);}for(let y=y0+1;y<y1-1;y+=2){test(x0,y,1,0);test(x1-1,y,-1,0);}return samples?edges/samples:0;}
  function parseCount(text){const m=String(text||'').match(/\d+/);return m?Number.parseInt(m[0],10):NaN;}
  function prettyId(id){return String(id||'?').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}
  function median(arr){if(!arr.length)return 0;const a=arr.slice().sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
  function dot(a,b){const n=Math.min(a.length,b.length);let s=0;for(let i=0;i<n;i++)s+=a[i]*b[i];return clamp(s,0,1);}
  function normalize(v){let s=0;for(const x of v)s+=x*x;const n=Math.sqrt(s)||1;for(let i=0;i<v.length;i++)v[i]/=n;return v;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
})();
