// V13.0.22 — F-43 navigation cleanup: section headers handle local collapse; logo handles global Home.
(()=>{
  const goals=document.getElementById('goalsSection');
  const de=document.getElementById('deBtn');
  const en=document.getElementById('enBtn');

  const english=()=>en?.classList.contains('active');
  function syncGoalAction(){
    const action=goals?.querySelector(':scope > summary strong');
    if(!action)return;
    action.textContent=goals.open
      ?(english()?'CLOSE':'SCHLIESSEN')
      :(english()?'CHANGE':'ÄNDERN');
  }

  goals?.addEventListener('toggle',syncGoalAction);
  de?.addEventListener('click',()=>setTimeout(syncGoalAction,0));
  en?.addEventListener('click',()=>setTimeout(syncGoalAction,0));
  syncGoalAction();
})();
