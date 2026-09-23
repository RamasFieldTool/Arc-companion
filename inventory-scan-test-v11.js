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
  const MAX_TEMPLATES = 220;
  const boxes = { B: [], Q: [], S: [] };
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
    scheduled = setTimeout(() => startRecognition(false), 180);
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
      try {
        cleanFrame = display.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, display.width, display.height);
      } catch (_) {}
    }
    if (!cleanFrame) {
      stateEl.textContent = 'Das Scanbild konnte nicht für die Item-Erkennung übernommen werden.';
      outputEl.textContent = '[camera test v11]\nerror: no local scan frame available';
      return;
    }

    running = true;
    const runGen = generation;
    stateEl.textContent = 'Inventar erkannt. Referenz-Icons werden geladen und Items verglichen …';
    namesEl.innerHTML = '';
    outputEl.textContent = '[camera test v11]\nstatus: loading reference icons';

    try {
      correctBackpackCapacity();
      const catalog = await loadTemplates();
      if (runGen !== generation && generation !== 0) return;
      if (!catalog.templates.length) throw new Error('Keine Referenz-Icons geladen');

      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = cleanFrame.width; sourceCanvas.height = cleanFrame.height;
      sourceCanvas.getContext('2d', { willReadFrequently: true }).putImageData(cleanFrame, 0, 0);

      const groups = [
        group('B', 'Rucksack', boxes.B, backpackSlotsEl, backpackOccupiedEl),
        group('Q', 'Schnelleinsatz', boxes.Q, quickSlotsEl, quickOccupiedEl),
        group('S', 'Sicherheitstasche', boxes.S, safeSlotsEl, safeOccupiedEl)
      ];

      const results = [];
      for (const g of groups) {
        for (const entry of selectOccupied(g)) {
          const slotDesc = descriptor(sourceCanvas, entry.box);
          if (!slotDesc) continue;
          const top = rank(slotDesc, catalog.templates, 3);
          if (top.length) results.push({ kind:g.kind, area:g.name, index:entry.index, top });
        }
      }

      renderResults(results, catalog);
    } catch (err) {
      stateEl.textContent = 'Item-Erkennung ist abgebrochen. Diagnose siehe unten.';
      outputEl.textContent = `[camera test v11]\nerror: ${String(err?.message || err).slice(0,180)}`;
    } finally {
      running = false;
    }
  }

  function correctBackpackCapacity() {
    const declared = parseCount(backpackSlotsEl?.textContent);
    if (declared !== 16 || boxes.B.length < 16 || !cleanFrame) return;

    const ordered = boxes.B.slice(0,16).sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const lastRow = ordered.slice(-4);
    if (lastRow.length !== 4) return;
    const pitchY = medianRowPitch(ordered);
    if (!(pitchY > 10)) return;

    const predicted = lastRow.map(b => ({ x:b.x, y:b.y + pitchY, w:b.w, h:b.h }));
    if (predicted.some(b => b.y + b.h >= cleanFrame.height - 2)) return;

    const evidence = predicted.map(borderEvidence);
    const strong = evidence.filter(v => v >= 0.23).length;
    const avg = evidence.reduce((a,b)=>a+b,0) / evidence.length;

    // Real 20-slot layouts have a visible fifth row. Genuine 16-slot layouts
    // do not. Require both several strong cells and a reasonable row average.
    if (strong >= 3 && avg >= 0.20) {
      backpackSlotsEl.textContent = '20';
      const bOcc = parseCount(backpackOccupiedEl?.textContent);
      const qOcc = parseCount(quickOccupiedEl?.textContent);
      const sOcc = parseCount(safeOccupiedEl?.textContent);
      if ([bOcc,qOcc,sOcc].every(Number.isFinite)) totalOccupiedEl.textContent = String(bOcc+qOcc+sOcc);
      if (statusEl) statusEl.textContent = statusEl.textContent.replace(/Rucksack:\s*16\s*Plätze/i, 'Rucksack: 20 Plätze');
    }
  }

  function medianRowPitch(ordered) {
    const ys = [...new Set(ordered.map(b => Math.round(b.y)))].sort((a,b)=>a-b);
    const ds = [];
    for (let i=1;i<ys.length;i++) if (ys[i]-ys[i-1] > 5) ds.push(ys[i]-ys[i-1]);
    if (!ds.length) return 0;
    ds.sort((a,b)=>a-b);
    return ds[Math.floor(ds.length/2)];
  }

  function borderEvidence(box) {
    const { width, height, data } = cleanFrame;
    const x0 = clamp(Math.round(box.x),0,width-2), y0 = clamp(Math.round(box.y),0,height-2);
    const x1 = clamp(Math.round(box.x+box.w),x0+1,width-1), y1 = clamp(Math.round(box.y+box.h),y0+1,height-1);
    let samples=0, edges=0;
    const test = (x,y,dx,dy) => {
      const p=(y*width+x)*4, q=((y+dy)*width+(x+dx))*4;
      const a=data[p]*.299+data[p+1]*.587+data[p+2]*.114;
      const b=data[q]*.299+data[q+1]*.587+data[q+2]*.114;
      samples++; if (Math.abs(a-b)>24) edges++;
    };
    for (let x=x0+1;x<x1-1;x+=2) { test(x,y0,0,1); test(x,y1-1,0,-1); }
    for (let y=y0+1;y<y1-1;y+=2) { test(x0,y,1,0); test(x1-1,y,-1,0); }
    return samples ? edges/samples : 0;
  }

  function group(kind,name,raw,slotsEl,occEl) {
    let ordered = raw.slice().sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const count = parseCount(slotsEl?.textContent);
    if (Number.isFinite(count) && ordered.length > count) ordered = ordered.slice(0,count);
    return {kind,name,boxes:ordered,occupied:parseCount(occEl?.textContent)};
  }

  function selectOccupied(g) {
    const entries = g.boxes.map((box,i)=>({box,index:i+1,score:occupancyScore(g.kind,box)}));
    if (Number.isFinite(g.occupied)) {
      const chosen = new Set(entries.slice().sort((a,b)=>b.score-a.score).slice(0,Math.min(g.occupied,entries.length)).map(e=>e.index));
      return entries.filter(e=>chosen.has(e.index));
    }
    return entries.filter(e=>e.score>.2);
  }

  function occupancyScore(kind, box) {
    const body = stats(box,.14,.08,.86,.70), left=stats(box,.05,.62,.38,.94), right=stats(box,.58,.62,.96,.94);
    if (kind==='Q') return left.white*1.8+right.white*1.7+body.sat*.8+body.bright*.55;
    if (kind==='S') return body.bright*1.35+body.sat*.55+(left.white+right.white)*.75;
    return body.bright*1.45+body.sat*.42+(left.white+right.white)*.58;
  }

  function stats(box,fx0,fy0,fx1,fy1) {
    const {width,height,data}=cleanFrame;
    const x0=clamp(Math.round(box.x+box.w*fx0),0,width-1), y0=clamp(Math.round(box.y+box.h*fy0),0,height-1);
    const x1=clamp(Math.round(box.x+box.w*fx1),x0+1,width), y1=clamp(Math.round(box.y+box.h*fy1),y0+1,height);
    let n=0,bright=0,white=0,sat=0;
    for(let y=y0;y<y1;y+=2) for(let x=x0;x<x1;x+=2){
      const p=(y*width+x)*4,r=data[p],g=data[p+1],b=data[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=r*.299+g*.587+b*.114,s=mx?(mx-mn)/mx:0;
      if(l>145)bright++; if(l>138&&s<.3)white++; if(mx>68&&s>.32)sat++; n++;
    }
    return {bright:n?bright/n:0,white:n?white/n:0,sat:n?sat/n:0};
  }

  async function loadTemplates() {
    if (templatePromise) return templatePromise;
    templatePromise = (async()=>{
      const response = await fetch('items.json',{cache:'force-cache',credentials:'same-origin'});
      if(!response.ok) throw new Error(`items.json HTTP ${response.status}`);
      const items = await response.json();
      const unique=[]; const seen=new Set();
      for(const item of Array.isArray(items)?items:[]){
        const id=String(item?.id||'').trim();
        if(!/^[a-z0-9_]+$/.test(id)||seen.has(id))continue;
        seen.add(id); unique.push({id,de:String(item.de||item.en||id),en:String(item.en||item.de||id)});
        if(unique.length>=MAX_TEMPLATES)break;
      }
      const templates=[]; let cursor=0;
      async function worker(){
        while(true){ const i=cursor++; if(i>=unique.length)return; const t=await loadTemplate(unique[i]); if(t)templates.push(t); }
      }
      await Promise.all(Array.from({length:Math.min(8,unique.length)},worker));
      return {templates,attempted:unique.length};
    })();
    return templatePromise;
  }

  async function loadTemplate(item) {
    const img = await loadImage(`${RAW_ICON_BASE}${item.id}.png`,6500);
    if(!img)return null;
    const d=descriptor(img,{x:0,y:0,w:img.naturalWidth||img.width,h:img.naturalHeight||img.height});
    return d?{...item,d}:null;
  }

  function loadImage(url,timeoutMs){
    return new Promise(resolve=>{
      const img=new Image(); let done=false;
      const finish=v=>{if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(v);};
      const timer=setTimeout(()=>finish(null),timeoutMs);
      img.crossOrigin='anonymous'; img.referrerPolicy='no-referrer'; img.onload=()=>finish(img); img.onerror=()=>finish(null); img.src=url;
    });
  }

  function descriptor(source,box){
    if(!(box.w>2&&box.h>2))return null;
    const SIZE=24,c=document.createElement('canvas'); c.width=SIZE;c.height=SIZE;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    const x=box.x+box.w*.06,y=box.y+box.h*.04,w=box.w*.88,h=box.h*.73;
    ctx.drawImage(source,x,y,w,h,0,0,SIZE,SIZE);
    const px=ctx.getImageData(0,0,SIZE,SIZE).data;
    const gray=new Float32Array(SIZE*SIZE),hue=new Float32Array(12);
    for(let i=0;i<gray.length;i++){
      const p=i*4,r=px[p],g=px[p+1],b=px[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),delta=mx-mn;
      gray[i]=r*.299+g*.587+b*.114;
      if(delta>7&&mx>0){let H;if(mx===r)H=((g-b)/delta)%6;else if(mx===g)H=(b-r)/delta+2;else H=(r-g)/delta+4;H=(H*60+360)%360;hue[Math.min(11,Math.floor(H/30))]+=(delta/mx);}
    }
    return {gray:standardize(gray),hue:normalize(hue)};
  }

  function rank(slot,templates,limit){
    const arr=[];
    for(const t of templates){
      const g=(corr(slot.gray,t.d.gray)+1)/2,h=dot(slot.hue,t.d.hue),score=clamp(g*.84+h*.16,0,1);
      arr.push({item:t,score});
    }
    arr.sort((a,b)=>b.score-a.score); return arr.slice(0,limit);
  }

  function standardize(v){let m=0;for(const x of v)m+=x;m/=v.length;let s=0;for(const x of v){const d=x-m;s+=d*d;}s=Math.sqrt(s/v.length)||1;const o=new Float32Array(v.length);for(let i=0;i<v.length;i++)o[i]=(v[i]-m)/s;return o;}
  function normalize(v){let n=0;for(const x of v)n+=x*x;n=Math.sqrt(n)||1;for(let i=0;i<v.length;i++)v[i]/=n;return v;}
  function corr(a,b){let s=0,n=Math.min(a.length,b.length);for(let i=0;i<n;i++)s+=a[i]*b[i];return n?s/n:0;}
  function dot(a,b){let s=0,n=Math.min(a.length,b.length);for(let i=0;i<n;i++)s+=a[i]*b[i];return clamp(s,0,1);}

  function renderResults(results,catalog){
    outputEl.textContent='[camera test v11]\n'+`reference-icons: ${catalog.templates.length}/${catalog.attempted} loaded\n`+`occupied-slots-tested: ${results.length}\n`+results.map(r=>`${r.kind}${r.index}: ${r.top.map(x=>`${x.item.id} ${(x.score*100).toFixed(1)}`).join(' | ')}`).join('\n');
    namesEl.innerHTML='';
    if(!results.length){stateEl.textContent='Keine belegten Slots konnten an die Item-Erkennung übergeben werden.';return;}
    for(const r of results){
      const top=r.top[0]; const card=document.createElement('div'); card.className='item-result-card';
      const title=document.createElement('div'); title.className='item-result-title'; title.textContent=`${r.kind}${r.index}: ${top.item.de}`;
      const score=document.createElement('div'); score.className='item-result-score'; score.textContent=`Ähnlichkeit ${(top.score*100).toFixed(1)}%`;
      card.append(title,score);
      if(r.top.length>1){const alt=document.createElement('div');alt.className='item-result-alt';alt.textContent='Alternativen: '+r.top.slice(1).map(x=>`${x.item.de} ${(x.score*100).toFixed(1)}%`).join(' · ');card.appendChild(alt);}
      namesEl.appendChild(card);
    }
    stateEl.textContent=`${results.length} belegte Slots verglichen. Der erste Name ist jeweils der aktuell ähnlichste Treffer.`;
  }

  function parseCount(v){const m=String(v||'').match(/\d+/);return m?parseInt(m[0],10):NaN;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
})();
