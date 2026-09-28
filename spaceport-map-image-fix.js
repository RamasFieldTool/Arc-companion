// Spaceport preview guard: always use the approved map base when Spaceport is active.
(()=>{
  const APPROVED_SPACEPORT_MAP='assets/maps/spaceport-approved-base.jpg?v=2';
  const image=document.getElementById('spawnMapImage');
  const select=document.getElementById('spawnMapSelect');
  if(!image||!select)return;

  function isSpaceport(){return select.value==='spaceport'}
  function applyApprovedMap(){
    if(!isSpaceport())return;
    if(image.getAttribute('src')!==APPROVED_SPACEPORT_MAP){
      image.setAttribute('src',APPROVED_SPACEPORT_MAP);
    }
    image.alt='Spaceport';
  }

  select.addEventListener('change',()=>setTimeout(applyApprovedMap,180));
  const observer=new MutationObserver(()=>{
    if(isSpaceport()&&image.getAttribute('src')!==APPROVED_SPACEPORT_MAP){
      queueMicrotask(applyApprovedMap);
    }
  });
  observer.observe(image,{attributes:true,attributeFilter:['src']});
  image.addEventListener('error',()=>{
    if(isSpaceport()&&image.getAttribute('src')!==APPROVED_SPACEPORT_MAP)applyApprovedMap();
  });
  applyApprovedMap();
  setTimeout(applyApprovedMap,250);
})();
