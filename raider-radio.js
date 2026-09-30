// Add a cover and one entry here to extend Raider Radio. Array order is display order.
(()=>{
  const songs=[
    {id:'ugly',title:'Ugly',cover:'assets/music/ugly-cover.png',sunoUrl:'https://suno.com/s/vbkPccvrI66ij4gJ'},
    {id:'the-arcs-are-the-enemy',title:'The ARCs Are the Enemy',cover:'assets/music/the-arcs-are-the-enemy-cover.png',sunoUrl:'https://suno.com/s/trsx9nLKROxaw5fW'},
    {id:'loot-and-shoot',title:'Loot&Shoot',cover:'assets/music/loot-and-shoot-cover.png',sunoUrl:'https://suno.com/s/vkAaYpLp5LkJyuVz'},
    {id:'what-was-it-for',title:'What Was It For?',cover:'assets/music/what-was-it-for-cover.webp',sunoUrl:'https://suno.com/s/xqxasdeSvRKfs74o'}
  ];
  const section=document.getElementById('raiderRadio');
  const grid=document.getElementById('raiderRadioSongs');
  if(!section||!grid)return;
  const copy={
    de:{title:'Was ist Raider Radio?',about:'Raider Radio ist unser kleines Musikprojekt rund um Ramas Field Tool: selbst erstellte Songs, inspiriert von ARC Raiders. Sie sind keine offiziellen ARC-Raiders-Soundtracks.',how:'Zum Anhören öffnet sich der jeweilige Song direkt bei Suno in einem neuen Tab. Ramas Field Tool speichert oder hostet keine Audiodateien und bietet keine Downloads an. Neue Songs werden hier nach und nach ergänzt.',listen:'▶ Auf Suno anhören'},
    en:{title:'What is Raider Radio?',about:'Raider Radio is our small music project around Ramas Field Tool: self-created songs inspired by ARC Raiders. They are not official ARC Raiders soundtrack releases.',how:'To listen, the selected song opens directly on Suno in a new tab. Ramas Field Tool does not store or host audio files and does not offer downloads. More songs will be added here over time.',listen:'▶ Listen on Suno'},
    fr:{title:'Qu’est-ce que Raider Radio ?',about:'Raider Radio est notre petit projet musical autour de Ramas Field Tool : des morceaux créés par nous et inspirés d’ARC Raiders. Il ne s’agit pas de morceaux officiels de la bande-son d’ARC Raiders.',how:'Pour écouter un morceau, il s’ouvre directement sur Suno dans un nouvel onglet. Ramas Field Tool ne stocke ni n’héberge de fichiers audio et ne propose aucun téléchargement. D’autres morceaux seront ajoutés progressivement.',listen:'▶ Écouter sur Suno'},
    es:{title:'¿Qué es Raider Radio?',about:'Raider Radio es nuestro pequeño proyecto musical alrededor de Ramas Field Tool: canciones creadas por nosotros e inspiradas en ARC Raiders. No son canciones oficiales de la banda sonora de ARC Raiders.',how:'Para escuchar una canción, se abre directamente en Suno en una nueva pestaña. Ramas Field Tool no almacena ni aloja archivos de audio y no ofrece descargas. Con el tiempo iremos añadiendo más canciones.',listen:'▶ Escuchar en Suno'}
  };
  const about=document.createElement('aside');
  about.className='radio-about';
  const aboutTitle=document.createElement('h3');
  const aboutText=document.createElement('p');
  const howText=document.createElement('p');
  about.append(aboutTitle,aboutText,howText);
  section.insertBefore(about,grid);
  const links=[];
  songs.forEach(song=>{
    const card=document.createElement('article');
    card.className='radio-song';
    card.dataset.songId=song.id;
    const cover=document.createElement('img');
    cover.src=song.cover;
    cover.alt=song.title;
    cover.width=1254;
    cover.height=1254;
    cover.loading='lazy';
    const title=document.createElement('h3');
    title.textContent=song.title;
    const link=document.createElement('a');
    link.className='radio-listen';
    link.href=song.sunoUrl;
    link.target='_blank';
    link.rel='noopener noreferrer';
    card.append(cover,title,link);
    grid.append(card);
    links.push({link,title:song.title});
  });
  function syncLanguage(){
    const lang=copy[document.documentElement.lang]||copy.en;
    aboutTitle.textContent=lang.title;
    aboutText.textContent=lang.about;
    howText.textContent=lang.how;
    links.forEach(({link,title})=>{
      if(link.textContent!==lang.listen)link.textContent=lang.listen;
      link.setAttribute('aria-label',`${title} — ${lang.listen}`);
    });
  }
  syncLanguage();
  new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
