"use strict";
(() => {
  const MAX_PROCESS_WIDTH = 1200;
  const COLS = 4;
  const GUIDE_ASPECT = 1.68;

  const $ = id => document.getElementById(id);
  const els = {
    openCamera:$('openCamera'), closeCamera:$('closeCamera'), capture:$('capture'), fileInput:$('fileInput'),
    cameraCard:$('cameraCard'), cameraView:$('cameraView'), scanGuide:$('scanGuide'), video:$('video'),
    resultCard:$('resultCard'), resultTitle:$('resultTitle'), cropNote:$('cropNote'), displayCanvas:$('displayCanvas'),
    workCanvas:$('workCanvas'), metrics:$('metrics'), backpackSlots:$('backpackSlots'), backpackOccupied:$('backpackOccupied'),
    quickSlots:$('quickSlots'), quickOccupied:$('quickOccupied'), safeSlots:$('safeSlots'), safeOccupied:$('safeOccupied'),
    totalOccupied:$('totalOccupied'), qualityState:$('qualityState'), status:$('status'), clearImage:$('clearImage')
  };

  let cameraStream = null;
  let guideNorm = {x:.04,y:.06,w:.92,h:.88};

  els.openCamera.addEventListener('click', startCamera);
  els.closeCamera.addEventListener('click', stopCamera);
  els.capture.addEventListener('click', captureFrame);
  els.fileInput.addEventListener('change', handleFile);
  els.clearImage.addEventListener('click', clearImage);
  window.addEventListener('resize', updateGuide);
  window.addEventListener('orientationchange', () => setTimeout(updateGuide,150));
  window.addEventListener('pagehide', stopCamera);
  window.addEventListener('beforeunload', stopCamera);

  async function startCamera(){
    setStatus('', '');
    if(!navigator.mediaDevices?.getUserMedia){ setStatus('Direkter Kamerazugriff wird nicht unterstützt. Bitte „Foto auswählen“ verwenden.','error'); return; }
    try{
      stopCamera();
      cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});
      els.video.srcObject = cameraStream;
      await els.video.play();
      els.cameraCard.hidden = false;
      await nextFrame(); updateGuide();
    }catch(e){ setStatus('Kamera konnte nicht geöffnet werden. Bitte Kameraberechtigung erlauben oder „Foto auswählen“ verwenden.','error'); }
  }

  function stopCamera(){
    if(cameraStream){ for(const t of cameraStream.getTracks()) t.stop(); cameraStream=null; }
    els.video.srcObject=null; els.cameraCard.hidden=true;
  }

  function updateGuide(){
    if(els.cameraCard.hidden) return;
    const w=els.cameraView.clientWidth,h=els.cameraView.clientHeight;
    if(!w||!h) return;
    const maxW=w*.94,maxH=h*.90;
    let gw=Math.min(maxW,maxH*GUIDE_ASPECT),gh=gw/GUIDE_ASPECT;
    if(gh>maxH){gh=maxH;gw=gh*GUIDE_ASPECT;}
    const gx=(w-gw)/2,gy=(h-gh)/2;
    Object.assign(els.scanGuide.style,{left:gx+'px',top:gy+'px',width:gw+'px',height:gh+'px'});
    guideNorm={x:gx/w,y:gy/h,w:gw/w,h:gh/h};
  }

  async function captureFrame(){
    if(!els.video.videoWidth||!els.video.videoHeight){setStatus('Die Kamera ist noch nicht bereit.','error');return;}
    updateGuide();
    await analyzeSource(els.video,els.video.videoWidth,els.video.videoHeight,guideNorm,true);
    stopCamera();
  }

  async function handleFile(ev){
    const file=ev.target.files?.[0]; ev.target.value='';
    if(!file||!file.type.startsWith('image/')) return;
    let bitmap;
    try{ bitmap=await createImageBitmap(file); await analyzeSource(bitmap,bitmap.width,bitmap.height,null,false); }
    catch(e){setStatus('Das Bild konnte lokal nicht gelesen werden.','error');}
    finally{bitmap?.close?.();}
  }

  async function analyzeSource(source,sw0,sh0,cropNorm,fromCamera){
    els.resultCard.hidden=false; els.metrics.hidden=true; els.cropNote.hidden=!fromCamera;
    els.resultTitle.textContent='Analyse läuft …'; setStatus('Das Bild wird ausschließlich auf diesem Gerät ausgewertet.','');
    await nextFrame();

    const crop=cropNorm?{
      sx:clamp(Math.round(sw0*cropNorm.x),0,sw0-1), sy:clamp(Math.round(sh0*cropNorm.y),0,sh0-1),
      sw:Math.max(1,Math.round(sw0*cropNorm.w)), sh:Math.max(1,Math.round(sh0*cropNorm.h))
    }:{sx:0,sy:0,sw:sw0,sh:sh0};
    crop.sw=Math.min(crop.sw,sw0-crop.sx); crop.sh=Math.min(crop.sh,sh0-crop.sy);

    const scale=Math.min(1,MAX_PROCESS_WIDTH/crop.sw),width=Math.max(1,Math.round(crop.sw*scale)),height=Math.max(1,Math.round(crop.sh*scale));
    const wc=els.workCanvas; wc.width=width; wc.height=height;
    const wctx=wc.getContext('2d',{willReadFrequently:true});
    wctx.clearRect(0,0,width,height); wctx.drawImage(source,crop.sx,crop.sy,crop.sw,crop.sh,0,0,width,height);
    const imageData=wctx.getImageData(0,0,width,height),quality=assessImageQuality(imageData);

    const display=els.displayCanvas; display.width=width; display.height=height;
    const dctx=display.getContext('2d'); dctx.drawImage(wc,0,0);

    const backpack=detectBackpack(imageData);
    if(!backpack){
      els.resultTitle.textContent='Rucksack noch nicht erkannt';
      setStatus('Der Rucksack wurde nicht sicher erkannt. Bitte alle Rucksackreihen vollständig in den grünen Bereich bringen; der neue Rahmen ist dafür größer.','error');
      clearWorkPixels(); return;
    }

    const expected=median(backpack.slots.map(s=>(s.w+s.h)/2));
    const quick=detectAuxSlots(imageData,{x:.59,y:.03,w:.40,h:.51},expected,'quick');
    const safe=detectAuxSlots(imageData,{x:.59,y:.61,w:.40,h:.38},expected,'safe');
    drawDetection(dctx,backpack,quick,safe);

    const bOcc=backpack.slots.filter(s=>s.occupied).length,qOcc=quick.slots.filter(s=>s.occupied).length,sOcc=safe.slots.filter(s=>s.occupied).length;
    els.backpackSlots.textContent=String(backpack.slots.length); els.backpackOccupied.textContent=String(bOcc);
    els.quickSlots.textContent=quick.confident?String(quick.slots.length):'?'; els.quickOccupied.textContent=quick.confident?String(qOcc):'?';
    els.safeSlots.textContent=safe.confident?String(safe.slots.length):'?'; els.safeOccupied.textContent=safe.confident?String(sOcc):'?';
    els.totalOccupied.textContent=String(bOcc+(quick.confident?qOcc:0)+(safe.confident?sOcc:0))+(quick.confident&&safe.confident?'':'+');
    els.qualityState.textContent=quality.label; els.metrics.hidden=false; els.resultTitle.textContent='Inventarbereiche erkannt';
    let note=`Rucksack: ${backpack.slots.length} Plätze / ${bOcc} belegt.`;
    note+=quick.confident?` Schnelleinsatz: ${quick.slots.length} Plätze / ${qOcc} belegt.`:' Schnelleinsatz noch unsicher.';
    note+=safe.confident?` Sicherheitstasche: ${safe.slots.length} Plätze / ${sOcc} belegt.`:' Sicherheitstasche noch unsicher.';
    note+=' Augment-Plätze werden nicht mitgezählt.';
    setStatus(note,quick.confident&&safe.confident?'good':''); clearWorkPixels();
  }

  function detectBackpack(imageData){
    const zone=normZone(imageData,{x:.01,y:.02,w:.58,h:.97});
    const sub=cropImageData(imageData,zone.x,zone.y,zone.w,zone.h),gray=toGray(sub),threshold=estimateEdgeThreshold(gray,sub.width,sub.height);
    const v=new Float64Array(sub.width),h=new Float64Array(sub.height);
    for(let y=1;y<sub.height-1;y+=2) for(let x=1;x<sub.width-1;x+=2){
      const i=y*sub.width+x,gx=Math.abs(gray[i+1]-gray[i-1]),gy=Math.abs(gray[i+sub.width]-gray[i-sub.width]);
      if(gx>threshold*.48)v[x]+=gx; if(gy>threshold*.48)h[y]+=gy;
    }
    const vp=findPeaks(smooth(v,Math.max(2,Math.round(sub.width*.006))),sub.width*.034,20);
    const hp=findPeaks(smooth(h,Math.max(2,Math.round(sub.height*.004))),sub.height*.020,26);
    const xs=chooseEqualSequence(vp,5,sub.width,.12,.31); if(!xs)return null;
    const gap=mean(diff(xs)),ys=chooseRows(hp,sub.height,gap); if(!ys)return null;
    const slots=[];
    for(let r=0;r<ys.length-1;r++) for(let c=0;c<COLS;c++){
      const box={x:Math.round(zone.x+xs[c]),y:Math.round(zone.y+ys[r]),w:Math.round(xs[c+1]-xs[c]),h:Math.round(ys[r+1]-ys[r]),row:r,col:c};
      if(box.w<18||box.h<18)continue;
      const local={x:box.x-zone.x,y:box.y-zone.y,w:box.w,h:box.h};
      const border=borderStrength(gray,sub.width,sub.height,local);
      if(r===ys.length-2&&c>=2&&border<threshold*.18)continue;
      slots.push({...box,occupied:isOccupiedSlot(imageData,box)});
    }
    if(slots.length<14||slots.length>28)return null;
    return {slots,rows:ys.length-1};
  }

  function detectAuxSlots(imageData,z,expected,type){
    const component=detectAuxComponents(imageData,z,expected,type);
    if(component.confident) return component;
    return detectAuxPattern(imageData,z,expected,type,component.slots);
  }

  function detectAuxComponents(imageData,z,expected,type){
    const zone=normZone(imageData,z),sub=cropImageData(imageData,zone.x,zone.y,zone.w,zone.h),gray=toGray(sub),threshold=estimateEdgeThreshold(gray,sub.width,sub.height);
    const comps=connectedComponents(makeEdgeMap(gray,sub.width,sub.height,threshold),sub.width,sub.height);
    let cand=comps.map(c=>({...c,x:c.x+zone.x,y:c.y+zone.y})).filter(c=>{
      const ratio=c.w/Math.max(1,c.h),size=(c.w+c.h)/2;
      return ratio>=.60&&ratio<=1.50&&size>=expected*.60&&size<=expected*1.50;
    });
    cand=dedupeCandidates(cand).sort((a,b)=>Math.abs((a.w+a.h)/2-expected)-Math.abs((b.w+b.h)/2-expected));
    const limit=type==='quick'?5:3; cand=cand.slice(0,limit).sort((a,b)=>(a.y-b.y)||(a.x-b.x));
    const min=type==='quick'?4:1,confident=cand.length>=min;
    return {slots:cand.map(c=>({...c,occupied:isOccupiedColorSlot(imageData,c)})),confident};
  }

  function detectAuxPattern(imageData,z,expected,type,fallback){
    const zone=normZone(imageData,z),gray=toGray(imageData),threshold=estimateEdgeThreshold(gray,imageData.width,imageData.height);
    const mandatory=type==='quick'?[[0,0],[1,0],[2,0],[0,1]]:[[0,0]];
    const optional=type==='quick'?[[1,1]]:[[1,0],[2,0]];
    let best=null;
    const step=Math.max(4,Math.round(expected*.09));
    for(const sf of [.82,.90,.98,1.06,1.14]){
      const size=expected*sf;
      for(const pf of [1.00,1.05,1.10]){
        const pitch=size*pf;
        const maxX=zone.x+zone.w-(type==='quick'?3:1)*pitch-size*.05;
        const maxY=zone.y+zone.h-(type==='quick'?2:1)*pitch-size*.05;
        for(let y=zone.y;y<=maxY;y+=step) for(let x=zone.x;x<=maxX;x+=step){
          let score=0,ok=true;
          for(const [cx,cy] of mandatory){
            const box={x:Math.round(x+cx*pitch),y:Math.round(y+cy*pitch),w:Math.round(size),h:Math.round(size)};
            const s=borderStrength(gray,imageData.width,imageData.height,box); if(s<threshold*.12){ok=false;break;} score+=s;
          }
          if(ok&&(!best||score>best.score)) best={x,y,size,pitch,score};
        }
      }
    }
    if(!best) return {slots:fallback||[],confident:false};
    const baseScore=best.score/mandatory.length;
    const slots=[];
    const add=(cx,cy,required)=>{
      const box={x:Math.round(best.x+cx*best.pitch),y:Math.round(best.y+cy*best.pitch),w:Math.round(best.size),h:Math.round(best.size)};
      const s=borderStrength(gray,imageData.width,imageData.height,box);
      if(required||s>Math.max(threshold*.16,baseScore*.48)) slots.push({...box,occupied:isOccupiedColorSlot(imageData,box)});
    };
    mandatory.forEach(p=>add(p[0],p[1],true)); optional.forEach(p=>add(p[0],p[1],false));
    const expectedMin=type==='quick'?4:1;
    return {slots,confident:slots.length>=expectedMin};
  }

  function isOccupiedColorSlot(imageData,box){
    const {width,height,data}=imageData; const m=Math.max(2,Math.round(Math.min(box.w,box.h)*.08));
    const x0=clamp(Math.round(box.x+m),0,width-1),y0=clamp(Math.round(box.y+m),0,height-1),x1=clamp(Math.round(box.x+box.w-m),x0+1,width),y1=clamp(Math.round(box.y+box.h-m),y0+1,height);
    let n=0,color=0;
    for(let y=y0;y<y1;y+=2) for(let x=x0;x<x1;x+=2){const p=(y*width+x)*4,r=data[p],g=data[p+1],b=data[p+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);n++;if(mx>65&&mx-mn>32)color++;}
    return n?color/n>.045:false;
  }

  function isOccupiedSlot(imageData,box){
    const {width,height,data}=imageData,m=Math.max(3,Math.round(Math.min(box.w,box.h)*.14));
    const x0=clamp(Math.round(box.x+m),0,width-1),y0=clamp(Math.round(box.y+m),0,height-1),x1=clamp(Math.round(box.x+box.w-m),x0+1,width),y1=clamp(Math.round(box.y+box.h-m),y0+1,height);
    let n=0,sum=0,sumSq=0,bright=0;
    for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){const p=(y*width+x)*4,g=data[p]*.299+data[p+1]*.587+data[p+2]*.114;n++;sum+=g;sumSq+=g*g;if(g>130)bright++;}
    if(!n)return false;const avg=sum/n,sd=Math.sqrt(Math.max(0,sumSq/n-avg*avg));return sd>18||bright/n>.11;
  }

  function drawDetection(ctx,b,q,s){
    ctx.save();ctx.lineWidth=Math.max(2,ctx.canvas.width/450);ctx.font=`700 ${Math.max(11,Math.round(ctx.canvas.width/60))}px system-ui,sans-serif`;ctx.textBaseline='top';
    drawSet(b.slots,'B','#69d39b');drawSet(q.slots,'Q','#ffb17f');drawSet(s.slots,'S','#9dbfff');ctx.restore();
    function drawSet(slots,prefix,color){slots.forEach((slot,i)=>{ctx.strokeStyle=color;ctx.fillStyle=slot.occupied?color+'22':'rgba(80,100,120,.08)';ctx.fillRect(slot.x,slot.y,slot.w,slot.h);ctx.strokeRect(slot.x,slot.y,slot.w,slot.h);ctx.fillStyle='rgba(8,11,15,.82)';ctx.fillRect(slot.x+3,slot.y+3,28,18);ctx.fillStyle=color;ctx.fillText(prefix+(i+1),slot.x+6,slot.y+5);});}
  }

  function assessImageQuality(imageData){
    const {width,height,data}=imageData,vals=[];let blown=0,n=0;const step=Math.max(2,Math.round(width/450));
    for(let y=step;y<height-step;y+=step)for(let x=step;x<width-step;x+=step){const p=(y*width+x)*4,l=data[p]*.299+data[p+1]*.587+data[p+2]*.114,px=(y*width+x+step)*4,py=((y+step)*width+x)*4,lx=data[px]*.299+data[px+1]*.587+data[px+2]*.114,ly=data[py]*.299+data[py+1]*.587+data[py+2]*.114;vals.push(Math.abs(lx-l)+Math.abs(ly-l));if(data[p]>245&&data[p+1]>245&&data[p+2]>245)blown++;n++;}
    vals.sort((a,b)=>a-b);const e=percentileSorted(vals,.90),br=n?blown/n:0;if(e<20||br>.09)return{label:'schwierig'};if(e<33||br>.045)return{label:'brauchbar'};return{label:'gut'};
  }

  function normZone(imageData,z){return{x:Math.round(imageData.width*z.x),y:Math.round(imageData.height*z.y),w:Math.round(imageData.width*z.w),h:Math.round(imageData.height*z.h)};}
  function cropImageData(imageData,x,y,w,h){x=clamp(x,0,imageData.width-1);y=clamp(y,0,imageData.height-1);w=Math.min(w,imageData.width-x);h=Math.min(h,imageData.height-y);const out=new Uint8ClampedArray(w*h*4);for(let r=0;r<h;r++){const s=((y+r)*imageData.width+x)*4;out.set(imageData.data.subarray(s,s+w*4),r*w*4);}return new ImageData(out,w,h);}
  function toGray(imageData){const {width,height,data}=imageData,g=new Uint8Array(width*height);for(let i=0,p=0;i<g.length;i++,p+=4)g[i]=Math.round(data[p]*.299+data[p+1]*.587+data[p+2]*.114);return g;}
  function estimateEdgeThreshold(gray,width,height){const a=[];for(let y=1;y<height-1;y+=4)for(let x=1;x<width-1;x+=4){const i=y*width+x;a.push(Math.abs(gray[i+1]-gray[i-1])+Math.abs(gray[i+width]-gray[i-width]));}a.sort((x,y)=>x-y);return clamp(percentileSorted(a,.87),30,78);}
  function makeEdgeMap(gray,width,height,t){const o=new Uint8Array(width*height);for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const i=y*width+x,g=Math.abs(gray[i+1]-gray[i-1])+Math.abs(gray[i+width]-gray[i-width]);if(g>=t)o[i]=1;}return o;}
  function connectedComponents(binary,width,height){const map=binary.slice(),stack=new Int32Array(map.length),out=[];for(let st=0;st<map.length;st++){if(!map[st])continue;let top=0;stack[top++]=st;map[st]=0;let minX=width,minY=height,maxX=0,maxY=0,pixels=0;while(top){const i=stack[--top],y=Math.floor(i/width),x=i-y*width;pixels++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(let dy=-1;dy<=1;dy++){const ny=y+dy;if(ny<0||ny>=height)continue;for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx;if(nx<0||nx>=width)continue;const ni=ny*width+nx;if(!map[ni])continue;map[ni]=0;stack[top++]=ni;}}}out.push({x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,pixels});}return out;}
  function dedupeCandidates(c){const s=[...c].sort((a,b)=>b.w*b.h-a.w*a.h),k=[];for(const q of s){const cx=q.x+q.w/2,cy=q.y+q.h/2;if(!k.some(v=>Math.abs(cx-(v.x+v.w/2))<Math.min(q.w,v.w)*.18&&Math.abs(cy-(v.y+v.h/2))<Math.min(q.h,v.h)*.18))k.push(q);}return k;}
  function borderStrength(gray,width,height,box){const x0=clamp(Math.round(box.x),1,width-2),x1=clamp(Math.round(box.x+box.w),1,width-2),y0=clamp(Math.round(box.y),1,height-2),y1=clamp(Math.round(box.y+box.h),1,height-2);let sum=0,n=0;const sm=(x,y)=>{const i=y*width+x;return Math.abs(gray[i+1]-gray[i-1])+Math.abs(gray[i+width]-gray[i-width]);};for(let x=x0;x<=x1;x+=3){sum+=sm(x,y0)+sm(x,y1);n+=2;}for(let y=y0;y<=y1;y+=3){sum+=sm(x0,y)+sm(x1,y);n+=2;}return n?sum/n:0;}
  function chooseEqualSequence(peaks,count,size,minF,maxF){if(peaks.length<count)return null;let best=null;const s=[...peaks].sort((a,b)=>a.x-b.x);for(let a=0;a<s.length;a++)for(let b=a+count-1;b<s.length;b++){const first=s[a].x,last=s[b].x,gap=(last-first)/(count-1);if(gap<size*minF||gap>size*maxF)continue;const seq=[];let score=0,ok=true;for(let k=0;k<count;k++){const target=first+gap*k;let near=null;for(const p of s){const d=Math.abs(p.x-target);if(d<=gap*.16&&(!near||d<near.d))near={...p,d};}if(!near){ok=false;break;}seq.push(near.x);score+=near.value-near.d*2;}if(ok&&(!best||score>best.score))best={seq,score};}return best?.seq||null;}
  function chooseRows(peaks,height,xGap){const s=[...peaks].sort((a,b)=>a.x-b.x);let best=null;for(let bounds=5;bounds<=7;bounds++)for(let i=0;i<s.length;i++){const first=s[i].x;for(let sc=.72;sc<=1.22;sc+=.04){const gap=xGap*sc,seq=[];let score=0,ok=true;for(let k=0;k<bounds;k++){const target=first+gap*k;if(target>height-2){ok=false;break;}let near=null;for(const p of s){const d=Math.abs(p.x-target);if(d<=gap*.18&&(!near||d<near.d))near={...p,d};}if(!near){ok=false;break;}seq.push(near.x);score+=near.value-near.d*1.5;}if(ok&&(!best||score>best.score))best={seq,score};}}return best?.seq||null;}
  function findPeaks(values,minD,maxP){const a=Array.from(values),sv=[...a].sort((x,y)=>x-y),cut=percentileSorted(sv,.72),list=[];for(let i=1;i<a.length-1;i++)if(a[i]>=cut&&a[i]>=a[i-1]&&a[i]>=a[i+1])list.push({x:i,value:a[i]});list.sort((a,b)=>b.value-a.value);const chosen=[];for(const p of list){if(chosen.every(q=>Math.abs(q.x-p.x)>=minD))chosen.push(p);if(chosen.length>=maxP)break;}return chosen.sort((a,b)=>a.x-b.x);}
  function smooth(values,r){const o=new Float64Array(values.length);let sum=0;for(let i=0;i<values.length;i++){sum+=values[i];if(i-r-1>=0)sum-=values[i-r-1];const l=Math.max(0,i-r);o[i]=sum/(i-l+1);}return o;}
  function clearImage(){stopCamera();els.resultCard.hidden=true;els.metrics.hidden=true;els.cropNote.hidden=true;els.resultTitle.textContent='Analyse läuft …';setStatus('','');clearCanvas(els.displayCanvas);clearCanvas(els.workCanvas);}
  function clearWorkPixels(){clearCanvas(els.workCanvas);} function clearCanvas(c){const x=c.getContext('2d');if(c.width&&c.height)x.clearRect(0,0,c.width,c.height);c.width=1;c.height=1;}
  function setStatus(m,k){els.status.textContent=m;els.status.className='status'+(k?' '+k:'');}
  function percentileSorted(v,f){if(!v.length)return 0;return v[Math.min(v.length-1,Math.max(0,Math.floor((v.length-1)*f)))];}
  function median(v){if(!v.length)return 0;const s=[...v].sort((a,b)=>a-b),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;}
  function mean(v){return v.length?v.reduce((s,x)=>s+x,0)/v.length:0;} function diff(v){const o=[];for(let i=1;i<v.length;i++)o.push(v[i]-v[i-1]);return o;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));} function nextFrame(){return new Promise(r=>requestAnimationFrame(r));}
})();