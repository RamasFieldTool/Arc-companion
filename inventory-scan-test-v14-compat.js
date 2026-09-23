"use strict";
(() => {
  const tf = window.tf;

  // TensorFlow.js compatibility for mobile browsers / partial globals.
  if (tf) {
    if (typeof tf.ready !== "function") {
      tf.ready = async () => true;
    }
    if (typeof tf.getBackend !== "function") {
      tf.getBackend = () => {
        try {
          const engine = typeof tf.engine === "function" ? tf.engine() : null;
          return engine?.backendName || engine?.backend?.constructor?.name || "unknown";
        } catch (_) {
          return "unknown";
        }
      };
    }
  }

  // Independent 16 -> 20 backpack-capacity repair.
  // The base detector occasionally stops after four rows although a fifth
  // four-slot row is clearly visible. Compare predicted fifth-row borders to
  // the already-detected fourth row instead of using one absolute threshold.
  const display = document.getElementById("displayCanvas");
  const work = document.getElementById("workCanvas");
  const backpackSlotsEl = document.getElementById("backpackSlots");
  const statusEl = document.getElementById("status");
  if (!display || !work || !backpackSlotsEl) return;

  const backpackBoxes = [];
  let cleanFrame = null;
  let scheduled = 0;

  const proto = CanvasRenderingContext2D.prototype;
  const previousDrawImage = proto.drawImage;
  const previousStrokeRect = proto.strokeRect;

  proto.drawImage = function (...args) {
    const result = previousDrawImage.apply(this, args);
    try {
      if (this.canvas === display && args[0] === work) {
        backpackBoxes.length = 0;
        cleanFrame = this.getImageData(0, 0, display.width, display.height);
      }
    } catch (_) {}
    return result;
  };

  proto.strokeRect = function (x, y, w, h) {
    try {
      if (this.canvas === display && isBackpackStroke(this.strokeStyle)) {
        if (!backpackBoxes.some(b => Math.abs(b.x-x)<2 && Math.abs(b.y-y)<2 && Math.abs(b.w-w)<3 && Math.abs(b.h-h)<3)) {
          backpackBoxes.push({x,y,w,h});
        }
      }
    } catch (_) {}
    return previousStrokeRect.call(this, x, y, w, h);
  };

  function isBackpackStroke(style) {
    const s = String(style || "").replace(/\s+/g, "").toLowerCase();
    return s === "#69d39b" || s.includes("105,211,155");
  }

  const observer = new MutationObserver(() => {
    clearTimeout(scheduled);
    scheduled = setTimeout(repairCapacity, 220);
  });
  observer.observe(backpackSlotsEl, {childList:true, characterData:true, subtree:true});

  function repairCapacity() {
    if (parseCount(backpackSlotsEl.textContent) !== 16 || !cleanFrame || backpackBoxes.length < 16) return;

    const ordered = backpackBoxes.slice(0,16).sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const lastRow = ordered.slice(-4);
    const pitch = medianRowPitch(ordered);
    if (lastRow.length !== 4 || !(pitch > 8)) return;

    const predicted = lastRow.map(b => ({x:b.x, y:b.y+pitch, w:b.w, h:b.h}));
    if (predicted.some(b => b.y+b.h >= cleanFrame.height-1)) return;

    const known = lastRow.map(borderStrength);
    const next = predicted.map(borderStrength);
    const knownAvg = average(known);
    const nextAvg = average(next);
    const ratios = next.map((v,i) => v / Math.max(0.012, known[i]));
    const ratioAvg = average(ratios);
    const supported = ratios.filter(r => r >= 0.34).length;

    // Relative test is intentionally conservative: the predicted row must
    // retain a substantial fraction of the real row's border energy in at
    // least three of four cells.
    if (knownAvg >= 0.025 && nextAvg >= 0.014 && ratioAvg >= 0.43 && supported >= 3) {
      backpackSlotsEl.textContent = "20";
      if (statusEl) {
        statusEl.textContent = statusEl.textContent.replace(/Rucksack:\s*16\s*Plätze/i, "Rucksack: 20 Plätze");
      }
    }
  }

  function borderStrength(box) {
    const {width,height,data} = cleanFrame;
    const x0=clamp(Math.round(box.x),1,width-2), y0=clamp(Math.round(box.y),1,height-2);
    const x1=clamp(Math.round(box.x+box.w),x0+2,width-2), y1=clamp(Math.round(box.y+box.h),y0+2,height-2);
    let sum=0,n=0;
    const lum=(x,y)=>{const p=(y*width+x)*4;return data[p]*.299+data[p+1]*.587+data[p+2]*.114;};
    const sample=(x,y,dx,dy)=>{sum += Math.abs(lum(x+dx,y+dy)-lum(x-dx,y-dy))/255; n++;};
    for(let x=x0+2;x<x1-2;x+=2){sample(x,y0+1,0,1);sample(x,y1-1,0,1);}
    for(let y=y0+2;y<y1-2;y+=2){sample(x0+1,y,1,0);sample(x1-1,y,1,0);}
    return n ? sum/n : 0;
  }

  function medianRowPitch(ordered) {
    const ys=[...new Set(ordered.map(b=>Math.round(b.y)))].sort((a,b)=>a-b), ds=[];
    for(let i=1;i<ys.length;i++) if(ys[i]-ys[i-1]>5) ds.push(ys[i]-ys[i-1]);
    ds.sort((a,b)=>a-b);
    return ds.length ? ds[Math.floor(ds.length/2)] : 0;
  }

  function average(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0;}
  function parseCount(text){const m=String(text||"").match(/\d+/);return m?Number.parseInt(m[0],10):NaN;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
})();
