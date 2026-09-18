// V2.13.3 — consistent, mobile-friendly closing controls for long lists.
(()=>{
  const selectors=['#goalsSection','#questDrawer','#blueprintDrawer'];
  const managed=selectors.map(selector=>document.querySelector(selector)).filter(Boolean);
  const stack=[];
  const suppressed=new WeakSet();
  let ignoreNextPop=false;

  const isEnglish=()=>document.getElementById('enBtn')?.classList.contains('active');
  const copy=()=>isEnglish()
    ?{label:'CLOSE LIST',aria:'Close list'}
    :{label:'LISTE SCHLIESSEN',aria:'Liste schließen'};

  function refreshLabels(){
    const text=copy();
    document.querySelectorAll('.list-close-button').forEach(button=>{
      button.innerHTML=`<span aria-hidden="true">×</span> ${text.label}`;
      button.setAttribute('aria-label',text.aria);
      button.title=text.aria;
    });
  }

  function focusAndReveal(details){
    const summary=details.querySelector(':scope > summary');
    if(!summary)return;
    try{summary.focus({preventScroll:true})}catch{summary.focus()}
    summary.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }

  function closeList(details,moveFocus=true){
    if(!details?.open)return;
    details.open=false;
    if(moveFocus)focusAndReveal(details);
  }

  function closeButton(details,position){
    const bar=document.createElement('div');
    bar.className=`list-close-bar list-close-bar--${position}`;
    const button=document.createElement('button');
    button.type='button';
    button.className='list-close-button';
    button.dataset.closeList=details.id;
    button.addEventListener('click',()=>closeList(details));
    bar.append(button);
    return bar;
  }

  function install(details){
    const body=details.querySelector(':scope > .drawer-body');
    if(!body||body.querySelector(':scope > .list-close-bar'))return;
    body.prepend(closeButton(details,'sticky'));
    body.append(closeButton(details,'bottom'));

    details.addEventListener('toggle',()=>{
      const id=details.id;
      if(details.open){
        if(stack.at(-1)!==id){
          stack.push(id);
          history.pushState({arcList:id},'',location.href);
        }
      }else{
        const index=stack.lastIndexOf(id);
        if(index<0)return;
        if(suppressed.has(details)){
          suppressed.delete(details);
          stack.splice(index,1);
          return;
        }
        const wasTop=index===stack.length-1;
        stack.splice(index,1);
        if(wasTop&&history.state?.arcList===id){
          ignoreNextPop=true;
          history.back();
        }
      }
    });
  }

  managed.forEach(install);
  refreshLabels();

  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(refreshLabels,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(refreshLabels,0));

  addEventListener('popstate',()=>{
    if(ignoreNextPop){
      ignoreNextPop=false;
      return;
    }
    let id=stack.pop();
    while(id&&!document.getElementById(id)?.open)id=stack.pop();
    const details=id&&document.getElementById(id);
    if(details?.open){
      suppressed.add(details);
      closeList(details);
    }
  });

  addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const details=[...managed].reverse().find(item=>item.open);
    if(details){
      event.preventDefault();
      closeList(details);
    }
  });
})();