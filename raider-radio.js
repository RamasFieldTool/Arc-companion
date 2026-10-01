// Cloudflare Web Analytics. This script is loaded site-wide by index.html.
(()=>{
  if(location.hostname!=='ramasfieldtool.github.io'||location.pathname.includes('/pr-preview/'))return;
  if(document.querySelector('script[data-cf-beacon]'))return;
  const beacon=document.createElement('script');
  beacon.type='module';
  beacon.src='https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon',JSON.stringify({token:'0bdfe94cf6904a8a9835591732c6ce16'}));
  document.head.append(beacon);
})();

// Fan Creations hub. Raider Radio remains the first category; stories are ready for future entries.
(()=>{
  const songs=[
    {id:'ugly',title:'Ugly',cover:'assets/music/ugly-cover.png',sunoUrl:'https://suno.com/s/vbkPccvrI66ij4gJ'},
    {id:'the-arcs-are-the-enemy',title:'The ARCs Are the Enemy',cover:'assets/music/the-arcs-are-the-enemy-cover.png',sunoUrl:'https://suno.com/s/trsx9nLKROxaw5fW'},
    {id:'loot-and-shoot',title:'Loot&Shoot',cover:'assets/music/loot-and-shoot-cover.png',sunoUrl:'https://suno.com/s/vkAaYpLp5LkJyuVz'},
    {id:'what-was-it-for',title:'What Was It For?',coverBase64Parts:['assets/music/what-was-it-for-cover.part1','assets/music/what-was-it-for-cover.part2','assets/music/what-was-it-for-cover.part3','assets/music/what-was-it-for-cover.part4','assets/music/what-was-it-for-cover.part5'],sunoUrl:'https://suno.com/s/xqxasdeSvRKfs74o'}
  ];

  const copy={
    de:{
      hubTitle:'Fan Creations',hubIntro:'Kreative Inhalte aus und rund um die ARC-Raiders-Community.',tileStatus:'Musik, Storys & Community-Kreationen',
      radioTitle:'Raider Radio',radioDesc:'Songs, inspiriert von ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Geschichten aus der Community.',
      back:'← Zurück zu Fan Creations',storiesEmptyTitle:'Noch keine Story veröffentlicht',storiesEmpty:'Hier erscheinen Community-Geschichten, sobald sie für Ramas Field Tool bereit sind.',
      aboutTitle:'Was ist Raider Radio?',about:'Raider Radio ist unser kleines Musikprojekt rund um Ramas Field Tool: selbst erstellte Songs, inspiriert von ARC Raiders. Sie sind keine offiziellen ARC-Raiders-Soundtracks.',
      how:'Zum Anhören öffnet sich der jeweilige Song direkt bei Suno in einem neuen Tab. Ramas Field Tool speichert oder hostet keine Audiodateien und bietet keine Downloads an. Neue Songs werden hier nach und nach ergänzt.',listen:'▶ Auf Suno anhören'
    },
    en:{
      hubTitle:'Fan Creations',hubIntro:'Creative work from and around the ARC Raiders community.',tileStatus:'Music, stories & community creations',
      radioTitle:'Raider Radio',radioDesc:'Songs inspired by ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Stories from the community.',
      back:'← Back to Fan Creations',storiesEmptyTitle:'No story published yet',storiesEmpty:'Community stories will appear here once they are ready for Ramas Field Tool.',
      aboutTitle:'What is Raider Radio?',about:'Raider Radio is our small music project around Ramas Field Tool: self-created songs inspired by ARC Raiders. They are not official ARC Raiders soundtrack releases.',
      how:'To listen, the selected song opens directly on Suno in a new tab. Ramas Field Tool does not store or host audio files and does not offer downloads. More songs will be added here over time.',listen:'▶ Listen on Suno'
    },
    fr:{
      hubTitle:'Fan Creations',hubIntro:'Des créations de la communauté ARC Raiders et autour de celle-ci.',tileStatus:'Musique, histoires et créations communautaires',
      radioTitle:'Raider Radio',radioDesc:'Des morceaux inspirés d’ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Des histoires de la communauté.',
      back:'← Retour à Fan Creations',storiesEmptyTitle:'Aucune histoire publiée pour le moment',storiesEmpty:'Les histoires de la communauté apparaîtront ici lorsqu’elles seront prêtes pour Ramas Field Tool.',
      aboutTitle:'Qu’est-ce que Raider Radio ?',about:'Raider Radio est notre petit projet musical autour de Ramas Field Tool : des morceaux créés par nous et inspirés d’ARC Raiders. Il ne s’agit pas de morceaux officiels de la bande-son d’ARC Raiders.',
      how:'Pour écouter un morceau, il s’ouvre directement sur Suno dans un nouvel onglet. Ramas Field Tool ne stocke ni n’héberge de fichiers audio et ne propose aucun téléchargement. D’autres morceaux seront ajoutés progressivement.',listen:'▶ Écouter sur Suno'
    },
    es:{
      hubTitle:'Fan Creations',hubIntro:'Creaciones de la comunidad de ARC Raiders y de su entorno.',tileStatus:'Música, historias y creaciones de la comunidad',
      radioTitle:'Raider Radio',radioDesc:'Canciones inspiradas en ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Historias de la comunidad.',
      back:'← Volver a Fan Creations',storiesEmptyTitle:'Todavía no hay historias publicadas',storiesEmpty:'Las historias de la comunidad aparecerán aquí cuando estén listas para Ramas Field Tool.',
      aboutTitle:'¿Qué es Raider Radio?',about:'Raider Radio es nuestro pequeño proyecto musical alrededor de Ramas Field Tool: canciones creadas por nosotros e inspiradas en ARC Raiders. No son canciones oficiales de la banda sonora de ARC Raiders.',
      how:'Para escuchar una canción, se abre directamente en Suno en una nueva pestaña. Ramas Field Tool no almacena ni aloja archivos de audio y no ofrece descargas. Con el tiempo iremos añadiendo más canciones.',listen:'▶ Escuchar en Suno'
    }
  };

  const section=document.getElementById('raiderRadio');
  const tile=document.querySelector('#appLauncher [data-app-target="raiderRadio"]');
  if(!section||!tile)return;

  section.setAttribute('aria-label','Fan Creations');
  section.replaceChildren();

  const hub=document.createElement('div');
  hub.className='fan-creations-hub';
  const hubTitle=document.createElement('h2');
  const hubIntro=document.createElement('p');
  hubIntro.className='fan-creations-intro';
  const categoryGrid=document.createElement('div');
  categoryGrid.className='fan-category-grid';

  function makeCategory(view,icon){
    const button=document.createElement('button');
    button.type='button';
    button.className='fan-category-card';
    button.dataset.fanView=view;
    const iconWrap=document.createElement('span');
    iconWrap.className='fan-category-icon';
    iconWrap.setAttribute('aria-hidden','true');
    iconWrap.textContent=icon;
    const text=document.createElement('span');
    text.className='fan-category-copy';
    const title=document.createElement('strong');
    const desc=document.createElement('small');
    text.append(title,desc);
    button.append(iconWrap,text);
    categoryGrid.append(button);
    return {button,title,desc};
  }

  const radioCategory=makeCategory('radio','♪');
  const storiesCategory=makeCategory('stories','▤');
  hub.append(hubTitle,hubIntro,categoryGrid);

  const radioView=document.createElement('div');
  radioView.className='fan-view';
  radioView.hidden=true;
  const radioBack=document.createElement('button');
  radioBack.type='button';
  radioBack.className='fan-view-back';
  const radioHeading=document.createElement('h2');
  const about=document.createElement('aside');
  about.className='radio-about';
  const aboutTitle=document.createElement('h3');
  const aboutText=document.createElement('p');
  const howText=document.createElement('p');
  about.append(aboutTitle,aboutText,howText);
  const radioGrid=document.createElement('div');
  radioGrid.id='raiderRadioSongs';
  radioGrid.className='radio-grid';
  radioView.append(radioBack,radioHeading,about,radioGrid);

  const storiesView=document.createElement('div');
  storiesView.className='fan-view';
  storiesView.hidden=true;
  const storiesBack=document.createElement('button');
  storiesBack.type='button';
  storiesBack.className='fan-view-back';
  const storiesHeading=document.createElement('h2');
  const storiesEmpty=document.createElement('div');
  storiesEmpty.className='fan-stories-empty';
  const storiesEmptyTitle=document.createElement('h3');
  const storiesEmptyText=document.createElement('p');
  storiesEmpty.append(storiesEmptyTitle,storiesEmptyText);
  storiesView.append(storiesBack,storiesHeading,storiesEmpty);

  section.append(hub,radioView,storiesView);

  const links=[];
  songs.forEach(song=>{
    const card=document.createElement('article');
    card.className='radio-song';
    card.dataset.songId=song.id;
    const cover=document.createElement('img');
    cover.alt=song.title;
    cover.width=1254;
    cover.height=1254;
    cover.loading='lazy';
    if(song.coverBase64Parts){
      cover.dataset.coverSource='assets/music/what-was-it-for-cover';
      Promise.all(song.coverBase64Parts.map(path=>fetch(path,{cache:'no-cache'}).then(response=>{
        if(!response.ok)throw new Error(`Cover ${response.status}`);
        return response.text();
      })))
        .then(parts=>{cover.src=`data:image/webp;base64,${parts.map(part=>part.trim()).join('')}`;})
        .catch(error=>console.error(`Raider Radio cover failed: ${song.title}`,error));
    }else{
      cover.src=song.cover;
      cover.dataset.coverSource=song.cover;
    }
    const title=document.createElement('h3');
    title.textContent=song.title;
    const link=document.createElement('a');
    link.className='radio-listen';
    link.href=song.sunoUrl;
    link.target='_blank';
    link.rel='noopener noreferrer';
    card.append(cover,title,link);
    radioGrid.append(card);
    links.push({link,title:song.title});
  });

  function showHub(){
    hub.hidden=false;
    radioView.hidden=true;
    storiesView.hidden=true;
  }
  function showView(view){
    hub.hidden=true;
    radioView.hidden=view!=='radio';
    storiesView.hidden=view!=='stories';
    const target=view==='radio'?radioHeading:storiesHeading;
    target.focus?.({preventScroll:true});
  }

  categoryGrid.addEventListener('click',event=>{
    const button=event.target.closest('[data-fan-view]');
    if(button)showView(button.dataset.fanView);
  });
  radioBack.addEventListener('click',showHub);
  storiesBack.addEventListener('click',showHub);

  const tileIcon=tile.querySelector('.app-icon');
  if(tileIcon){
    tileIcon.innerHTML='<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M7 15l3-3 3 3 2-2 2 2M15.5 9h.01M8 3h8"/></svg>';
  }

  function syncLanguage(){
    const lang=copy[document.documentElement.lang]||copy.en;
    const tileTitle=tile.querySelector('b');
    const tileSmall=tile.querySelector('small');
    if(tileTitle)tileTitle.textContent=lang.hubTitle;
    if(tileSmall)tileSmall.textContent=lang.tileStatus;
    hubTitle.textContent=lang.hubTitle;
    hubIntro.textContent=lang.hubIntro;
    radioCategory.title.textContent=lang.radioTitle;
    radioCategory.desc.textContent=lang.radioDesc;
    storiesCategory.title.textContent=lang.storiesTitle;
    storiesCategory.desc.textContent=lang.storiesDesc;
    radioBack.textContent=lang.back;
    storiesBack.textContent=lang.back;
    radioHeading.textContent=lang.radioTitle;
    storiesHeading.textContent=lang.storiesTitle;
    storiesEmptyTitle.textContent=lang.storiesEmptyTitle;
    storiesEmptyText.textContent=lang.storiesEmpty;
    aboutTitle.textContent=lang.aboutTitle;
    aboutText.textContent=lang.about;
    howText.textContent=lang.how;
    links.forEach(({link,title})=>{
      if(link.textContent!==lang.listen)link.textContent=lang.listen;
      link.setAttribute('aria-label',`${title} — ${lang.listen}`);
    });
  }

  showHub();
  syncLanguage();
  new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  let wasActive=section.classList.contains('launcher-active');
  new MutationObserver(()=>{
    const isActive=section.classList.contains('launcher-active');
    if(isActive&&!wasActive)showHub();
    wasActive=isActive;
  }).observe(section,{attributes:true,attributeFilter:['class']});
})();
