"use strict";
(() => {
  const TEST = "camera test v14";
  const API_ITEMS = "https://api.github.com/repos/RaidTheory/arcraiders-data/contents/images/items?ref=main";
  const RAW_ICON = "https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/images/items/";
  const RAW_ITEM = "https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/";

  const display = document.getElementById("displayCanvas");
  const work = document.getElementById("workCanvas");
  const resultTitle = document.getElementById("resultTitle");
  const backpackSlotsEl = document.getElementById("backpackSlots");
  const backpackOccupiedEl = document.getElementById("backpackOccupied");
  const quickSlotsEl = document.getElementById("quickSlots");
  const quickOccupiedEl = document.getElementById("quickOccupied");
  const safeSlotsEl = document.getElementById("safeSlots");
  const safeOccupiedEl = document.getElementById("safeOccupied");
  const totalOccupiedEl = document.getElementById("totalOccupied");
  const statusEl = document.getElementById("status");
  const stateEl = document.getElementById("itemRecognitionState");
  const namesEl = document.getElementById("itemRecognitionNames");
  const outputEl = document.getElementById("itemRecognitionOutput");
  const retryBtn = document.getElementById("itemRecognitionRetry");
  if (!display || !work || !resultTitle || !stateEl || !namesEl || !outputEl) return;

  const boxes = { B: [], Q: [], S: [] };
  let cleanFrame = null;
  let generation = 0;
  let scheduled = 0;
  let running = false;
  let modelPromise = null;
  let referencePromise = null;
  const nameCache = new Map();

  const proto = CanvasRenderingContext2D.prototype;
  const previousDrawImage = proto.drawImage;
  const previousStrokeRect = proto.strokeRect;

  proto.drawImage = function (...args) {
    const result = previousDrawImage.apply(this, args);
    try {
      if (this.canvas === display && args[0] === work) {
        boxes.B.length = 0;
        boxes.Q.length = 0;
        boxes.S.length = 0;
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
    return previousStrokeRect.call(this, x, y, w, h);
  };

  function colorKind(style) {
    const s = String(style || "").replace(/\s+/g, "").toLowerCase();
    if (s === "#69d39b" || s.includes("105,211,155")) return "B";
    if (s === "#ffb17f" || s.includes("255,177,127")) return "Q";
    if (s === "#9dbfff" || s.includes("157,191,255")) return "S";
    return null;
  }

  function addUnique(list, box) {
    if (!list.some(b => Math.abs(b.x-box.x)<2 && Math.abs(b.y-box.y)<2 && Math.abs(b.w-box.w)<3 && Math.abs(b.h-box.h)<3)) {
      list.push(box);
    }
  }

  const observer = new MutationObserver(() => {
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || "")) return;
    clearTimeout(scheduled);
    scheduled = setTimeout(() => run(false), 350);
  });
  observer.observe(resultTitle, { childList: true, characterData: true, subtree: true });
  retryBtn?.addEventListener("click", () => run(true));

  async function run(force) {
    if (running && !force) return;
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || "")) {
      stateEl.textContent = "Erst einen erfolgreichen Inventar-Scan durchführen.";
      return;
    }
    if (!cleanFrame) {
      try { cleanFrame = display.getContext("2d", { willReadFrequently: true }).getImageData(0,0,display.width,display.height); } catch (_) {}
    }
    if (!cleanFrame) {
      stateEl.textContent = "Kein lokales Scanbild verfügbar.";
      return;
    }

    running = true;
    const runGeneration = generation;
    namesEl.innerHTML = "";
    outputEl.textContent = `[${TEST}]\nstatus: loading ML model`;
    stateEl.textContent = "ML-Modell wird lokal geladen …";

    try {
      correctBackpackCapacity();
      correctQuickOccupancy();

      const model = await loadModel();
      if (runGeneration !== generation) return;

      const refs = await loadReferenceEmbeddings(model);
      if (runGeneration !== generation) return;
      if (!refs.length) throw new Error("Keine ML-Referenzen verfügbar");

      const source = document.createElement("canvas");
      source.width = cleanFrame.width;
      source.height = cleanFrame.height;
      source.getContext("2d", { willReadFrequently: true }).putImageData(cleanFrame, 0, 0);

      const groups = [
        makeGroup("B", "Rucksack", boxes.B, backpackSlotsEl, backpackOccupiedEl),
        makeGroup("Q", "Schnelleinsatz", boxes.Q, quickSlotsEl, quickOccupiedEl),
        makeGroup("S", "Sicherheitstasche", boxes.S, safeSlotsEl, safeOccupiedEl)
      ];

      const occupiedEntries = groups.flatMap(selectOccupied);
      stateEl.textContent = `${occupiedEntries.length} belegte Slots: neuronale Merkmale werden verglichen …`;

      const results = [];
      let done = 0;
      for (const entry of occupiedEntries) {
        const variants = makeSlotVariants(source, entry.box);
        const embeddings = [];
        for (const variant of variants) embeddings.push(await embedCanvas(model, variant));
        const ranked = rankML(embeddings, refs, 3);
        results.push({ ...entry, ranked });
        done += 1;
        stateEl.textContent = `ML-Vergleich ${done}/${occupiedEntries.length} Slots …`;
        await tick();
      }

      for (const result of results) {
        for (const r of result.ranked) r.name = await getGermanName(r.id);
      }
      render(results, refs.length);
    } catch (error) {
      stateEl.textContent = "Test 14 ist abgebrochen. Diagnose siehe unten.";
      outputEl.textContent = `[${TEST}]\nerror: ${String(error?.message || error).slice(0,240)}`;
    } finally {
      running = false;
    }
  }

  async function loadModel() {
    if (modelPromise) return modelPromise;
    modelPromise = (async () => {
      if (!window.tf || !window.mobilenet) throw new Error("TensorFlow/MobileNet konnte nicht geladen werden");
      try { await tf.setBackend("webgl"); } catch (_) {}
      await tf.ready();
      stateEl.textContent = `ML-Backend: ${tf.getBackend()}. MobileNet wird geladen …`;
      return mobilenet.load({ version: 2, alpha: 0.50 });
    })();
    return modelPromise;
  }

  async function loadReferenceEmbeddings(model) {
    if (referencePromise) return referencePromise;
    referencePromise = (async () => {
      stateEl.textContent = "Öffentlicher ARC-Itemkatalog wird geladen …";
      const response = await fetch(API_ITEMS, { headers: { Accept: "application/vnd.github+json" }, cache: "force-cache" });
      if (!response.ok) throw new Error(`ARC-Itemkatalog HTTP ${response.status}`);
      const files = await response.json();
      const ids = Array.isArray(files)
        ? files.map(x => String(x.name || "")).filter(n => n.endsWith(".png")).map(n => n.slice(0,-4))
        : [];
      if (!ids.length) throw new Error("ARC-Itemkatalog ist leer");

      const refs = [];
      let completed = 0;
      for (const id of ids) {
        const image = await loadImage(`${RAW_ICON}${id}.png`, 10000);
        if (image) {
          const canvas = makeReferenceCanvas(image);
          try {
            const embedding = await embedCanvas(model, canvas);
            refs.push({ id, embedding });
          } catch (_) {}
        }
        completed += 1;
        if (completed % 4 === 0 || completed === ids.length) {
          stateEl.textContent = `ML-Referenzen ${completed}/${ids.length} vorbereitet …`;
          outputEl.textContent = `[${TEST}]\nmodel: MobileNet v2 alpha 0.50\nreferences: ${completed}/${ids.length} processed\nusable: ${refs.length}`;
          await tick();
        }
      }
      return refs;
    })();
    return referencePromise;
  }

  function makeReferenceCanvas(image) {
    const canvas = document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#05070a";
    ctx.fillRect(0,0,224,224);
    const w = image.naturalWidth || image.width;
    const h = image.naturalHeight || image.height;
    const scale = Math.min(194/w, 194/h);
    const dw = w*scale, dh = h*scale;
    ctx.drawImage(image, (224-dw)/2, (224-dh)/2, dw, dh);
    return canvas;
  }

  function makeSlotVariants(source, box) {
    const raw = document.createElement("canvas");
    raw.width = 224;
    raw.height = 224;
    const rctx = raw.getContext("2d", { willReadFrequently: true });
    rctx.fillStyle = "#05070a";
    rctx.fillRect(0,0,224,224);
    const sx = box.x + box.w*.07;
    const sy = box.y + box.h*.04;
    const sw = box.w*.86;
    const sh = box.h*.70;
    rctx.drawImage(source, sx, sy, sw, sh, 14, 20, 196, 164);

    const masked = document.createElement("canvas");
    masked.width = 224;
    masked.height = 224;
    const mctx = masked.getContext("2d", { willReadFrequently: true });
    mctx.drawImage(raw,0,0);
    suppressBackground(mctx,224,224);
    return [raw, masked];
  }

  function suppressBackground(ctx,w,h) {
    const image = ctx.getImageData(0,0,w,h);
    const d = image.data;
    const sample = [];
    for (const [x0,y0] of [[8,8],[w-24,8],[8,h-24],[w-24,h-24]]) {
      for (let y=y0;y<y0+16;y+=2) for (let x=x0;x<x0+16;x+=2) {
        const p=(y*w+x)*4; sample.push([d[p],d[p+1],d[p+2]]);
      }
    }
    const bg=[0,0,0];
    for(const s of sample){bg[0]+=s[0];bg[1]+=s[1];bg[2]+=s[2];}
    bg[0]/=sample.length;bg[1]/=sample.length;bg[2]/=sample.length;
    for(let i=0;i<d.length;i+=4){
      const dist=Math.hypot(d[i]-bg[0],d[i+1]-bg[1],d[i+2]-bg[2]);
      const lum=d[i]*.299+d[i+1]*.587+d[i+2]*.114;
      if(dist<48 || lum<28){ d[i]=5;d[i+1]=7;d[i+2]=10;d[i+3]=255; }
      else {
        const boost=1.10;
        d[i]=clamp((d[i]-18)*boost+18,0,255);
        d[i+1]=clamp((d[i+1]-18)*boost+18,0,255);
        d[i+2]=clamp((d[i+2]-18)*boost+18,0,255);
        d[i+3]=255;
      }
    }
    ctx.putImageData(image,0,0);
  }

  async function embedCanvas(model, canvas) {
    const tensor = model.infer(canvas, true);
    const values = await tensor.data();
    tensor.dispose();
    const out = new Float32Array(values.length);
    let norm = 0;
    for(let i=0;i<values.length;i++){ out[i]=values[i]; norm += values[i]*values[i]; }
    norm = Math.sqrt(norm) || 1;
    for(let i=0;i<out.length;i++) out[i] /= norm;
    return out;
  }

  function rankML(embeddings, refs, limit) {
    const best = [];
    for (const ref of refs) {
      let score = -1;
      for (const e of embeddings) score = Math.max(score, cosine(e, ref.embedding));
      let pos = 0;
      while(pos<best.length && best[pos].score>=score) pos++;
      best.splice(pos,0,{id:ref.id,score});
      if(best.length>limit) best.length=limit;
    }
    return best;
  }

  function cosine(a,b){
    const n=Math.min(a.length,b.length);let s=0;
    for(let i=0;i<n;i++)s+=a[i]*b[i];
    return s;
  }

  async function getGermanName(id) {
    if (nameCache.has(id)) return nameCache.get(id);
    let name = id.replace(/_/g," ");
    try {
      const r = await fetch(`${RAW_ITEM}${id}.json`, { cache: "force-cache" });
      if (r.ok) {
        const json = await r.json();
        name = json?.name?.de || json?.name?.en || name;
      }
    } catch (_) {}
    nameCache.set(id,name);
    return name;
  }

  function render(results, referenceCount) {
    namesEl.innerHTML = "";
    const lines = [`[${TEST}]`,`model: MobileNet v2 alpha 0.50`,`reference-embeddings: ${referenceCount}`,`slots: ${results.length}`];
    for (const r of results) {
      const slot = `${r.kind}${r.index}`;
      const winner = r.ranked[0];
      const card = document.createElement("div"); card.className = "item-result-card";
      const title = document.createElement("div"); title.className = "item-result-title"; title.textContent = `${slot}: ${winner?.name || "–"}`;
      const score = document.createElement("div"); score.className = "item-result-score"; score.textContent = `ML-Score ${winner ? winner.score.toFixed(3) : "–"} · kein Prozentwert`;
      const alt = document.createElement("div"); alt.className = "item-result-alt";
      alt.textContent = "Alternativen: " + r.ranked.slice(1).map(x => `${x.name} ${x.score.toFixed(3)}`).join(" · ");
      card.append(title,score,alt); namesEl.appendChild(card);
      lines.push(`${slot}: ${r.ranked.map(x=>`${x.id} ${x.score.toFixed(4)}`).join(" | ")}`);
    }
    stateEl.textContent = `${results.length} belegte Slots mit einem vortrainierten neuronalen Bildmodell verglichen. Das ist ein Blindtest; die früheren Soll-Items werden nicht benutzt.`;
    outputEl.textContent = lines.join("\n");
  }

  function makeGroup(kind,name,raw,slotsEl,occupiedEl){
    let ordered=raw.slice().sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const count=parseCount(slotsEl?.textContent);
    if(Number.isFinite(count)&&ordered.length>count)ordered=ordered.slice(0,count);
    return {kind,name,boxes:ordered,occupied:parseCount(occupiedEl?.textContent)};
  }

  function selectOccupied(group){
    const entries=group.boxes.map((box,index)=>({kind:group.kind,area:group.name,box,index:index+1,score:occupancyScore(group.kind,box)}));
    if(Number.isFinite(group.occupied)){
      const chosen=new Set(entries.slice().sort((a,b)=>b.score-a.score).slice(0,Math.min(group.occupied,entries.length)).map(e=>e.index));
      return entries.filter(e=>chosen.has(e.index));
    }
    return entries.filter(e=>e.score>.2);
  }

  function correctBackpackCapacity(){
    const declared=parseCount(backpackSlotsEl?.textContent);
    if(declared!==16||boxes.B.length<16||!cleanFrame)return;
    const ordered=boxes.B.slice(0,16).sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const last=ordered.slice(-4),pitch=medianRowPitch(ordered);
    if(last.length!==4||!(pitch>10))return;
    const predicted=last.map(b=>({x:b.x,y:b.y+pitch,w:b.w,h:b.h}));
    if(predicted.some(b=>b.y+b.h>=cleanFrame.height-2))return;
    const evidence=predicted.map(borderEvidence),strong=evidence.filter(v=>v>=.23).length,avg=evidence.reduce((a,b)=>a+b,0)/evidence.length;
    if(strong>=3&&avg>=.20)backpackSlotsEl.textContent="20";
  }

  function correctQuickOccupancy(){
    const count=parseCount(quickSlotsEl?.textContent);
    let ordered=boxes.Q.slice().sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    if(Number.isFinite(count)&&ordered.length>count)ordered=ordered.slice(0,count);
    if(!ordered.length)return;
    const occupied=ordered.filter(box=>!quickLooksLikeEmptyCircle(box)&&quickHasItemEvidence(box)).length;
    quickOccupiedEl.textContent=String(occupied);
    const b=parseCount(backpackOccupiedEl?.textContent),s=parseCount(safeOccupiedEl?.textContent);
    if([b,s].every(Number.isFinite))totalOccupiedEl.textContent=String(b+occupied+s);
    if(statusEl)statusEl.textContent=statusEl.textContent.replace(/Schnelleinsatz:\s*(\d+)\s*Plätze\s*\/\s*\d+\s*belegt\./,`Schnelleinsatz: $1 Plätze / ${occupied} belegt.`);
  }

  function quickHasItemEvidence(box){
    const badge=regionStats(box,.09,.71,.30,.92),qty=regionStats(box,.68,.70,.94,.92),body=regionStats(box,.18,.10,.82,.66);
    return badge.white>.04||qty.white>.03||body.bright>.20;
  }

  function quickLooksLikeEmptyCircle(box){
    const {width,height,data}=cleanFrame,cx=box.x+box.w*.50,cy=box.y+box.h*.48,r0=Math.min(box.w,box.h);
    let ring=0,center=0,outer=0,ringN=0,centerN=0,outerN=0;const hits=new Array(20).fill(0),samples=new Array(20).fill(0);
    for(let y=Math.max(0,Math.floor(box.y+box.h*.12));y<Math.min(height,Math.ceil(box.y+box.h*.82));y+=2){
      for(let x=Math.max(0,Math.floor(box.x+box.w*.12));x<Math.min(width,Math.ceil(box.x+box.w*.88));x+=2){
        const dx=(x-cx)/r0,dy=(y-cy)/r0,r=Math.sqrt(dx*dx+dy*dy),p=(y*width+x)*4,lum=data[p]*.299+data[p+1]*.587+data[p+2]*.114;
        if(r<.12){center+=lum;centerN++;}
        else if(r>=.19&&r<=.30){ring+=lum;ringN++;let a=Math.atan2(dy,dx);if(a<0)a+=Math.PI*2;const s=Math.min(19,Math.floor(a/(Math.PI*2)*20));samples[s]++;if(lum>95)hits[s]++;}
        else if(r>=.33&&r<=.42){outer+=lum;outerN++;}
      }
    }
    const ringMean=ring/Math.max(1,ringN),centerMean=center/Math.max(1,centerN),outerMean=outer/Math.max(1,outerN),coverage=hits.filter((v,i)=>samples[i]&&v/samples[i]>.32).length/20,badge=regionStats(box,.09,.71,.30,.92);
    return badge.white<.035&&coverage>.58&&ringMean>centerMean+10&&ringMean>outerMean+7;
  }

  function occupancyScore(kind,box){
    if(kind==="Q"&&quickLooksLikeEmptyCircle(box))return -1;
    const body=regionStats(box,.14,.08,.86,.70),left=regionStats(box,.05,.62,.38,.94),right=regionStats(box,.58,.62,.96,.94);
    if(kind==="Q")return left.white*2+right.white*1.8+body.bright*.7+body.sat*.4;
    if(kind==="S")return body.bright*1.35+body.sat*.55+(left.white+right.white)*.75;
    return body.bright*1.45+body.sat*.42+(left.white+right.white)*.58;
  }

  function regionStats(box,fx0,fy0,fx1,fy1){
    const {width,height,data}=cleanFrame;
    const x0=clamp(Math.round(box.x+box.w*fx0),0,width-1),y0=clamp(Math.round(box.y+box.h*fy0),0,height-1),x1=clamp(Math.round(box.x+box.w*fx1),x0+1,width),y1=clamp(Math.round(box.y+box.h*fy1),y0+1,height);
    let n=0,bright=0,white=0,sat=0;
    for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){const p=(y*width+x)*4,r=data[p],g=data[p+1],b=data[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=r*.299+g*.587+b*.114,s=mx?(mx-mn)/mx:0;if(l>145)bright++;if(l>135&&s<.30)white++;if(mx>68&&s>.32)sat++;n++;}
    return {bright:n?bright/n:0,white:n?white/n:0,sat:n?sat/n:0};
  }

  function medianRowPitch(ordered){const ys=[...new Set(ordered.map(b=>Math.round(b.y)))].sort((a,b)=>a-b),ds=[];for(let i=1;i<ys.length;i++)if(ys[i]-ys[i-1]>5)ds.push(ys[i]-ys[i-1]);ds.sort((a,b)=>a-b);return ds.length?ds[Math.floor(ds.length/2)]:0;}
  function borderEvidence(box){const {width,height,data}=cleanFrame;const x0=clamp(Math.round(box.x),0,width-2),y0=clamp(Math.round(box.y),0,height-2),x1=clamp(Math.round(box.x+box.w),x0+1,width-1),y1=clamp(Math.round(box.y+box.h),y0+1,height-1);let samples=0,edges=0;const test=(x,y,dx,dy)=>{const p=(y*width+x)*4,q=((y+dy)*width+(x+dx))*4,a=data[p]*.299+data[p+1]*.587+data[p+2]*.114,b=data[q]*.299+data[q+1]*.587+data[q+2]*.114;samples++;if(Math.abs(a-b)>24)edges++;};for(let x=x0+1;x<x1-1;x+=2){test(x,y0,0,1);test(x,y1-1,0,-1);}for(let y=y0+1;y<y1-1;y+=2){test(x0,y,1,0);test(x1-1,y,-1,0);}return samples?edges/samples:0;}
  function parseCount(text){const m=String(text||"").match(/\d+/);return m?Number.parseInt(m[0],10):NaN;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function tick(){return new Promise(resolve=>setTimeout(resolve,0));}
  function loadImage(url,timeoutMs){return new Promise(resolve=>{const img=new Image();let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(v);};const timer=setTimeout(()=>finish(null),timeoutMs);img.crossOrigin="anonymous";img.referrerPolicy="no-referrer";img.onload=()=>finish(img);img.onerror=()=>finish(null);img.src=url;});}
})();
