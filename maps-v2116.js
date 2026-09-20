// V13.0.8 – map presentation and full-screen map mode.
(()=>{
  const copy={
    de:{details:'DATEN & QUELLEN',gestureTitle:'KARTE BEDIENEN',hint:'In der Großansicht bis zu 3× zoomen und die Karte verschieben',expand:'KARTE GROSS ÖFFNEN',expandedTitle:'KARTE // GROSSANSICHT',close:'SCHLIESSEN ×'},
    en:{details:'DATA & SOURCES',gestureTitle:'MAP CONTROLS',hint:'Open the large view to zoom up to 3× and move around the map',expand:'OPEN LARGE MAP',expandedTitle:'MAP // LARGE VIEW',close:'CLOSE ×'}
  };
  const stage=document.getElementById('spawnMapStage');
  const expand=document.getElementById('spawnExpand');
  const close=document.getElementById('spawnCloseExpanded');
  let returnFocus=null;
  function language(){return(typeof lang!=='undefined'&&lang==='en')?'en':'de'}
  function applyMapUxCopy(){
    const c=copy[language()];
    const details=document.getElementById('spawnDataDetailsLabel');if(details)details.textContent=c.details;
    const title=document.getElementById('spawnGestureTitle');if(title)title.textContent=c.gestureTitle;
    const hint=document.getElementById('spawnGestureHint');if(hint)hint.textContent=c.hint;
    const expandLabel=expand?.querySelector('span');if(expandLabel)expandLabel.textContent=c.expand;
    const expandedTitle=document.getElementById('spawnExpandedTitle');if(expandedTitle)expandedTitle.textContent=c.expandedTitle;
    if(close)close.textContent=c.close;
  }
  function openLargeMap(){
    if(!stage)return;
    returnFocus=document.activeElement;
    stage.classList.add('is-expanded');
    stage.setAttribute('role','dialog');
    stage.setAttribute('aria-modal','true');
    document.body.classList.add('map-expanded');
    close?.focus();
  }
  function closeLargeMap(){
    if(!stage)return;
    stage.classList.remove('is-expanded');
    stage.setAttribute('role','region');
    stage.removeAttribute('aria-modal');
    document.body.classList.remove('map-expanded');
    if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();
  }
  expand?.addEventListener('click',openLargeMap);
  close?.addEventListener('click',closeLargeMap);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&stage?.classList.contains('is-expanded'))closeLargeMap()});
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(applyMapUxCopy,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(applyMapUxCopy,0));
  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(applyMapUxCopy,0));
  const observer=new MutationObserver(()=>applyMapUxCopy());
  const title=document.getElementById('spawnMapTitle');if(title)observer.observe(title,{childList:true,subtree:true});
  setTimeout(applyMapUxCopy,0);
})();
