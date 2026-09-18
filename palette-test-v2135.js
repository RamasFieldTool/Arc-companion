// V2.13.5 TEST — surface + accent controls, stored separately from the production theme.
(()=>{
  const root=document.documentElement;
  const surfaceKey='arcPaletteSurfaceTestV2135';
  const accentKey='arcPaletteAccentTestV2135';
  const surfaces=['black','dark','light','white'];
  const accents=['orange','amber','green','cyan'];
  const enButton=document.getElementById('enBtn');

  let surface='dark';
  let accent='orange';
  try{
    const savedSurface=localStorage.getItem(surfaceKey);
    const savedAccent=localStorage.getItem(accentKey);
    if(surfaces.includes(savedSurface))surface=savedSurface;
    if(accents.includes(savedAccent))accent=savedAccent;
  }catch(_){}

  const copy={
    de:{
      kicker:'DARSTELLUNG // TEST',
      title:'FARBEN EINSTELLEN',
      note:'Deine Auswahl wird nur für diese Testseite auf dem Gerät gespeichert.',
      surface:'HINTERGRUND',
      accent:'AKZENT',
      black:'SCHWARZ',
      dark:'DUNKEL',
      light:'HELL',
      white:'FAST WEISS',
      orange:'ORANGE',
      amber:'AMBER',
      green:'GRÜN',
      cyan:'CYAN'
    },
    en:{
      kicker:'APPEARANCE // TEST',
      title:'CUSTOMIZE COLORS',
      note:'Your selection is stored on this device for this test page only.',
      surface:'BACKGROUND',
      accent:'ACCENT',
      black:'BLACK',
      dark:'DARK',
      light:'LIGHT',
      white:'NEAR WHITE',
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
    root.dataset.theme=(surface==='light'||surface==='white')?'light':'dark';

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
    if(meta)meta.content=surface==='white'?'#faf9f5':surface==='light'?'#f1f5f8':surface==='black'?'#000000':'#080d11';

    if(persist){
      try{
        localStorage.setItem(surfaceKey,surface);
        localStorage.setItem(accentKey,accent);
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
