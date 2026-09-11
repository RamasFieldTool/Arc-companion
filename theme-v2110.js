(()=>{
  const KEY='arcTheme';
  const root=document.documentElement;
  const buttons=()=>[...document.querySelectorAll('.theme-btn')];
  function setTheme(theme,persist=true){
    const next=theme==='light'?'light':'dark';
    root.dataset.theme=next;
    buttons().forEach(b=>{const active=b.dataset.themeValue===next;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.content=next==='light'?'#d8d0b8':'#161711';
    if(persist){try{localStorage.setItem(KEY,next)}catch(_){}}
  }
  let saved='dark';
  try{saved=localStorage.getItem(KEY)||'dark'}catch(_){}
  setTheme(saved,false);
  document.addEventListener('click',e=>{const b=e.target.closest('.theme-btn');if(b)setTheme(b.dataset.themeValue);});
})();
