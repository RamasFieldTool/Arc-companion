// V2.13.3 test — one compact floating close control for the open long list.
(()=>{
  const drawers=['goalsSection','questDrawer','blueprintDrawer']
    .map(id=>document.getElementById(id))
    .filter(Boolean);
  const de=document.getElementById('deBtn');
  const en=document.getElementById('enBtn');
  let activeDrawer=null;

  const english=()=>en?.classList.contains('active');
  const closeText=()=>english()?'CLOSE LIST':'LISTE SCHLIESSEN';

  const closeButton=document.createElement('button');
  closeButton.type='button';
  closeButton.className='floating-list-close';
  closeButton.hidden=true;
  document.body.append(closeButton);

  function updateButton(){
    const open=drawers.filter(drawer=>drawer.open);
    if(activeDrawer&&!activeDrawer.open)activeDrawer=null;
    if(!activeDrawer&&open.length)activeDrawer=open[open.length-1];
    closeButton.hidden=open.length===0;
    closeButton.innerHTML=`<span class="floating-list-close-x" aria-hidden="true">×</span><span>${closeText()}</span>`;
    closeButton.setAttribute('aria-label',closeText());
  }

  function syncGoalAction(){
    const drawer=document.getElementById('goalsSection');
    const action=drawer?.querySelector(':scope > summary strong');
    if(!action)return;
    action.textContent=drawer.open
      ?(english()?'CLOSE':'SCHLIESSEN')
      :(english()?'CHANGE':'ÄNDERN');
  }

  function currentDrawer(){
    if(activeDrawer?.open)return activeDrawer;
    const visible=drawers.filter(drawer=>{
      if(!drawer.open)return false;
      const rect=drawer.getBoundingClientRect();
      return rect.bottom>0&&rect.top<innerHeight;
    });
    return visible[visible.length-1]||drawers.filter(drawer=>drawer.open).at(-1);
  }

  function closeCurrent(){
    const drawer=currentDrawer();
    if(!drawer)return;
    const summary=drawer.querySelector(':scope > summary');
    drawer.open=false;
    activeDrawer=null;
    updateButton();
    if(summary){
      try{summary.focus({preventScroll:true})}catch{summary.focus()}
      summary.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }
  }

  drawers.forEach(drawer=>drawer.addEventListener('toggle',()=>{
    if(drawer.open)activeDrawer=drawer;
    syncGoalAction();
    updateButton();
  }));

  closeButton.addEventListener('click',closeCurrent);
  addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!closeButton.hidden){
      event.preventDefault();
      closeCurrent();
    }
  });
  de?.addEventListener('click',()=>setTimeout(()=>{syncGoalAction();updateButton()},0));
  en?.addEventListener('click',()=>setTimeout(()=>{syncGoalAction();updateButton()},0));

  syncGoalAction();
  updateButton();
})();
