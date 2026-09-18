// V13.0.0 — compact navigation, language sync and active-section feedback.
(()=>{
  const labels={
    de:{goals:'ZIELE',supply:'BEDARF',items:'SUCHE',more:'MEHR',raid:'NÄCHSTER RAID',quests:'QUESTS',blueprints:'BAUPLÄNE',maps:'KARTEN',tips:'TIPPS'},
    en:{goals:'GOALS',supply:'NEEDS',items:'SEARCH',more:'MORE',raid:'NEXT RAID',quests:'QUESTS',blueprints:'BLUEPRINTS',maps:'MAPS',tips:'TIPS'}
  };
  const nav=document.querySelector('.nav-v1301');
  if(!nav)return;
  const more=nav.querySelector('.nav-more');
  const tracked=[
    ['goals','goalsSection'],['raid','nextRaidDrawer'],['supply','supplySection'],['items','itemsSection'],
    ['quests','questDrawer'],['blueprints','blueprintDrawer'],['maps','spawnPanel'],['tips','tipsDrawer']
  ];
  function syncLanguage(){
    const savedLanguage=typeof lang!=='undefined'?lang:(document.getElementById('enBtn')?.classList.contains('active')?'en':document.documentElement.lang);
    const current=savedLanguage==='en'?'en':'de';
    nav.setAttribute('aria-label',current==='en'?'Quick navigation':'Schnellnavigation');
    nav.querySelectorAll('[data-nav-label]').forEach(node=>{
      node.textContent=labels[current][node.dataset.navLabel]||node.textContent;
    });
  }
  function setActive(key){
    nav.querySelectorAll('[data-nav-key]').forEach(link=>{
      const active=link.dataset.navKey===key;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
    more.classList.toggle('active',['raid','quests','blueprints','maps','tips'].includes(key));
  }
  let ticking=false;
  function updateActive(){
    ticking=false;
    let current='goals';
    let smallest=Infinity;
    tracked.forEach(([key,id])=>{
      const element=document.getElementById(id);
      if(!element)return;
      const rect=element.getBoundingClientRect();
      const distance=Math.abs(rect.top-110);
      if(rect.bottom>90&&distance<smallest){smallest=distance;current=key}
    });
    setActive(current);
  }
  nav.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=>{
      const target=document.querySelector(link.getAttribute('href'));
      if(target&&target.tagName==='DETAILS')target.open=true;
      more.open=false;
      setActive(link.dataset.navKey);
    });
  });
  more.addEventListener('toggle',()=>more.querySelector('summary').setAttribute('aria-expanded',String(more.open)));
  document.addEventListener('click',event=>{if(more.open&&!more.contains(event.target))more.open=false});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')more.open=false});
  window.addEventListener('scroll',()=>{
    if(!ticking){ticking=true;requestAnimationFrame(updateActive)}
  },{passive:true});
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(syncLanguage,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(syncLanguage,0));
  syncLanguage();
  updateActive();
  new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
