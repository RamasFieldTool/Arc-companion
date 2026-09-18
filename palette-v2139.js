// V2.13.9 — production surface + accent controls.
(()=>{
  const root=document.documentElement;
  const surfaceKey='arcPaletteSurface';
  const accentKey='arcPaletteAccent';
  const surfaces=['black','dark','light'];
  const accents=['orange','amber','green','cyan'];
  const enButton=document.getElementById('enBtn');

  let surface='dark';
  let accent='orange';
  try{
    const savedSurface=localStorage.getItem(surfaceKey);
    const savedAccent=localStorage.getItem(accentKey);
    const legacyTheme=localStorage.getItem('arcTheme');
    if(surfaces.includes(savedSurface))surface=savedSurface;
    else if(legacyTheme==='light')surface='light';
    if(accents.includes(savedAccent))accent=savedAccent;
  }catch(_){}

  const copy={
    de:{
      kicker:'DARSTELLUNG',
      title:'FARBEN EINSTELLEN',
      note:'Deine Auswahl wird auf diesem Gerät gespeichert.',
      surface:'HINTERGRUND',
      accent:'AKZENT',
      black:'SCHWARZ',
      dark:'DUNKEL',
      light:'HELL',
      orange:'ORANGE',
      amber:'AMBER',
      green:'GRÜN',
      cyan:'CYAN'
    },
    en:{
      kicker:'APPEARANCE',
      title:'CUSTOMIZE COLORS',
      note:'Your selection is stored on this device.',
      surface:'BACKGROUND',
      accent:'ACCENT',
      black:'BLACK',
      dark:'DARK',
      light:'LIGHT',
      orange:'ORANGE',
      amber:'AMBER',
      green:'GREEN',
      cyan:'CYAN'
    }
  };

  const english=()=>enButton?.classList.contains('active');

  function apply(persist=true){
    root.dataset.surface=surface;
    root.dataset.accent=accent;
    root.dataset.theme=surface==='light'?'light':'dark';

    document.querySelectorAll('[data-palette-surface]').forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.paletteSurface===surface));
    });
    document.querySelectorAll('[data-palette-accent]').forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.paletteAccent===accent));
    });
    document.querySelectorAll('.theme-btn').forEach(button=>{
      const active=button.dataset.themeValue===root.dataset.theme;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });

    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=surface==='light'?'#f1f5f8':surface==='black'?'#000000':'#080d11';

    if(persist){
      try{
        localStorage.setItem(surfaceKey,surface);
        localStorage.setItem(accentKey,accent);
        localStorage.setItem('arcTheme',root.dataset.theme);
      }catch(_){}
    }
    syncText();
  }

  function syncText(){
    const text=copy[english()?'en':'de'];
    const set=(id,value)=>{const element=document.getElementById(id);if(element)element.textContent=value};
    set('paletteKicker',text.kicker);
    set('paletteTitle',text.title);
    set('paletteNote',text.note);
    set('paletteSurfaceLabel',text.surface);
    set('paletteAccentLabel',text.accent);
    set('paletteStatus',`${text[surface]} + ${text[accent]}`);
    document.querySelectorAll('[data-palette-surface]').forEach(button=>{
      const label=text[button.dataset.paletteSurface];
      const span=button.querySelector('.palette-label');
      if(span)span.textContent=label;
      button.setAttribute('aria-label',`${text.surface}: ${label}`);
    });
    document.querySelectorAll('[data-palette-accent]').forEach(button=>{
      const label=text[button.dataset.paletteAccent];
      const span=button.querySelector('.palette-label');
      if(span)span.textContent=label;
      button.setAttribute('aria-label',`${text.accent}: ${label}`);
    });
  }

  document.addEventListener('click',event=>{
    const surfaceButton=event.target.closest('[data-palette-surface]');
    if(surfaceButton){
      surface=surfaceButton.dataset.paletteSurface;
      apply();
      return;
    }
    const accentButton=event.target.closest('[data-palette-accent]');
    if(accentButton){
      accent=accentButton.dataset.paletteAccent;
      apply();
    }
  });

  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(syncText,0));
  enButton?.addEventListener('click',()=>setTimeout(syncText,0));
  apply(false);
})();
