// V2.11.6 – presentation-only map cleanup. Spawn coordinates/data stay untouched.
(()=>{
  const copy={
    de:{details:'DATEN & QUELLEN',hint:'Marker antippen · +/- zum Zoomen · vergrößerte Karte ziehen'},
    en:{details:'DATA & SOURCES',hint:'Tap marker · +/- to zoom · drag when zoomed'}
  };
  function applyMapUxCopy(){
    const l=(typeof lang!=='undefined'&&lang==='en')?'en':'de';
    const details=document.getElementById('spawnDataDetailsLabel');
    if(details) details.textContent=copy[l].details;
    const hint=document.getElementById('spawnGestureHint');
    if(hint && spawnData?.points?.length) hint.textContent=copy[l].hint;
  }
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(applyMapUxCopy,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(applyMapUxCopy,0));
  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(applyMapUxCopy,0));
  const observer=new MutationObserver(()=>applyMapUxCopy());
  const title=document.getElementById('spawnMapTitle');
  if(title) observer.observe(title,{childList:true,subtree:true});
  setTimeout(applyMapUxCopy,0);
})();
