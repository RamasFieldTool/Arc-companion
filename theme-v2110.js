// Legacy compatibility shim. Surface selection is owned by palette-v2139.js.
(()=>{
  const root=document.documentElement;
  const saved=(()=>{try{return localStorage.getItem('arcPaletteSurface')}catch(_){return null}})();
  const surface=saved==='black'||saved==='dark'?'black':'light';
  root.dataset.surface=surface;
  root.dataset.theme=surface==='light'?'light':'dark';
})();
