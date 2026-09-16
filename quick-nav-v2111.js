// V2.13.0 — keep Blueprint navigation label in sync with DE/EN
(()=>{
  const labels={
    de:{goals:'ZIELE',supply:'BEDARF',items:'ITEMS',quests:'QUESTS',blueprints:'BAUPLÄNE',maps:'KARTEN'},
    en:{goals:'GOALS',supply:'NEEDS',items:'ITEMS',quests:'QUESTS',blueprints:'BLUEPRINTS',maps:'MAPS'}
  };
  function sync(){
    const lang=document.documentElement.lang==='en'?'en':'de';
    const blueprintLink=document.querySelector('.quick-nav a[href="#blueprintDrawer"]');
    if(blueprintLink&&!blueprintLink.dataset.navKey) blueprintLink.dataset.navKey='blueprints';
    document.querySelectorAll('.quick-nav a[data-nav-key]').forEach(a=>{
      a.textContent=labels[lang][a.dataset.navKey]||a.textContent;
    });
  }
  sync();
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
