// V2.13.3 — make the existing goals drawer action explicit while open.
(()=>{
  const drawer=document.getElementById('goalsSection');
  const de=document.getElementById('deBtn');
  const en=document.getElementById('enBtn');
  if(!drawer)return;

  function syncGoalAction(){
    const action=drawer.querySelector(':scope > summary strong');
    if(!action)return;
    const english=en?.classList.contains('active');
    action.textContent=drawer.open
      ?(english?'CLOSE':'SCHLIESSEN')
      :(english?'CHANGE':'ÄNDERN');
  }

  drawer.addEventListener('toggle',syncGoalAction);
  de?.addEventListener('click',()=>setTimeout(syncGoalAction,0));
  en?.addEventListener('click',()=>setTimeout(syncGoalAction,0));
  syncGoalAction();
})();
