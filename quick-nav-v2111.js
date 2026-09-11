(()=>{
  const labels={
    de:{goals:'ZIELE',supply:'BEDARF',items:'ITEMS',quests:'QUESTS',maps:'KARTEN'},
    en:{goals:'GOALS',supply:'NEEDS',items:'ITEMS',quests:'QUESTS',maps:'MAPS'}
  };
  function sync(){
    const lang=document.documentElement.lang==='en'?'en':'de';
    document.querySelectorAll('.quick-nav a[data-nav-key]').forEach(a=>{
      a.textContent=labels[lang][a.dataset.navKey]||a.textContent;
    });
  }
  sync();
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
