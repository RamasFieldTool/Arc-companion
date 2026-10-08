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

// Fan Creations hub, music and author-approved community stories.
(()=>{
  const songs=[
    {id:'against-the-steel-titans',artist:'Jack Rodeo',title:'Against the Steel Titans',cover:'assets/music/ralf/against-the-steel-titans-cover.webp',audioUrl:'assets/music/ralf/against-the-steel-titans.mp3'},
    {id:'ugly',title:'Ugly',cover:'assets/music/ugly-cover.png',sunoUrl:'https://suno.com/s/vbkPccvrI66ij4gJ'},
    {id:'the-arcs-are-the-enemy',title:'The ARCs Are the Enemy',cover:'assets/music/the-arcs-are-the-enemy-cover.png',sunoUrl:'https://suno.com/s/trsx9nLKROxaw5fW'},
    {id:'loot-and-shoot',title:'Loot&Shoot',cover:'assets/music/loot-and-shoot-cover.png',sunoUrl:'https://suno.com/s/vkAaYpLp5LkJyuVz'},
    {id:'what-was-it-for',title:'What Was It For?',coverBase64Parts:['assets/music/what-was-it-for-cover.part1','assets/music/what-was-it-for-cover.part2','assets/music/what-was-it-for-cover.part3','assets/music/what-was-it-for-cover.part4','assets/music/what-was-it-for-cover.part5'],sunoUrl:'https://suno.com/s/xqxasdeSvRKfs74o'}
  ];

  const collection={
    id:'lion-montana-radio-speranza-relay',
    artist:'Lion Montana',
    title:'Radio Speranza Relay',
    cover:'assets/music/lion-montana/radio-speranza-relay-logo.png',
    // Original YouTube album pages checked against title and artist on 2026-10-04.
    albums:[
      {title:'Radio Speranza Relay Vol. 1',cover:'assets/music/lion-montana/radio-speranza-relay-vol-1.png',url:'https://www.youtube.com/playlist?list=OLAK5uy_nbUa8Ik3gs-aP4FB2bW-0qUQ94Uuv_B5g'},
      {title:'Radio Speranza Relay Vol. 2',cover:'assets/music/lion-montana/radio-speranza-relay-vol-2.png',url:'https://www.youtube.com/playlist?list=OLAK5uy_ns6XAeCHm47zacDC8vmBXzzg51RqJoSCo'}
    ]
  };

  const collectionCopy={
    de:{back:'← Zurück zu Raider Radio',open:'Alben öffnen',listen:'▶ Auf YouTube anhören',pending:'Original-Link wird ergänzt'},
    en:{back:'← Back to Raider Radio',open:'Open albums',listen:'▶ Listen on YouTube',pending:'Original link to be added'},
    fr:{back:'← Retour à Raider Radio',open:'Voir les albums',listen:'▶ Écouter sur YouTube',pending:'Lien d’origine à venir'},
    es:{back:'← Volver a Raider Radio',open:'Ver álbumes',listen:'▶ Escuchar en YouTube',pending:'Enlace original pendiente'},
    it:{back:'← Torna a Raider Radio',open:'Apri gli album',listen:'▶ Ascolta su YouTube',pending:'Link originale in arrivo'}
  };

  const copy={
    de:{
      hubTitle:'Fan Creations',hubIntro:'Kreative Werke aus der ARC-Raiders-Community.',tileStatus:'Musik, Storys & Community-Kreationen',
      radioTitle:'Raider Radio',radioDesc:'Songs, inspiriert von ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Geschichten aus der Community.',
      back:'← Zurück zu Fan Creations',storiesEmptyTitle:'Noch keine Story veröffentlicht',storiesEmpty:'Hier erscheinen Community-Geschichten, sobald sie für Ramas Field Tool bereit sind.',
      aboutTitle:'Was ist Raider Radio?',about:'Raider Radio zeigt Musik aus und rund um die ARC-Raiders-Community: eigene Songs von Ramas Field Tool und Musik anderer Community-Künstler. Dies ist kein offizieller ARC-Raiders-Soundtrack.',
      how:'Externe Beiträge öffnen zum Anhören ihre Originalplattform in einem neuen Tab. Einzelne ausdrücklich freigegebene Community-Songs sind direkt in Raider Radio abspielbar. Ramas Field Tool bietet keine Download-Funktion an.',listen:'▶ Auf Suno anhören'
    },
    en:{
      hubTitle:'Fan Creations',hubIntro:'Creative work from the ARC Raiders community.',tileStatus:'Music, stories & community creations',
      radioTitle:'Raider Radio',radioDesc:'Songs inspired by ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Stories from the community.',
      back:'← Back to Fan Creations',storiesEmptyTitle:'No story published yet',storiesEmpty:'Community stories will appear here once they are ready for Ramas Field Tool.',
      aboutTitle:'What is Raider Radio?',about:'Raider Radio features music from and around the ARC Raiders community: songs by Ramas Field Tool and music by other community artists. This is not an official ARC Raiders soundtrack.',
      how:'External contributions open their original platform in a new tab. Selected community songs published with explicit permission can be played directly in Raider Radio. Ramas Field Tool does not offer a download function.',listen:'▶ Listen on Suno'
    },
    fr:{
      hubTitle:'Fan Creations',hubIntro:'Des créations de la communauté ARC Raiders et autour de celle-ci.',tileStatus:'Musique, histoires et créations communautaires',
      radioTitle:'Raider Radio',radioDesc:'Des morceaux inspirés d’ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Des histoires de la communauté.',
      back:'← Retour à Fan Creations',storiesEmptyTitle:'Aucune histoire publiée pour le moment',storiesEmpty:'Les histoires de la communauté apparaîtront ici lorsqu’elles seront prêtes pour Ramas Field Tool.',
      aboutTitle:'Qu’est-ce que Raider Radio ?',about:'Raider Radio présente de la musique issue de la communauté ARC Raiders et inspirée par celle-ci : des morceaux de Ramas Field Tool et d’autres artistes de la communauté. Il ne s’agit pas d’une bande-son officielle d’ARC Raiders.',
      how:'Les contributions externes ouvrent leur plateforme d’origine dans un nouvel onglet. Certains morceaux de la communauté, publiés avec une autorisation explicite, peuvent être écoutés directement dans Raider Radio. Ramas Field Tool ne propose aucune fonction de téléchargement.',listen:'▶ Écouter sur Suno'
    },
    es:{
      hubTitle:'Fan Creations',hubIntro:'Creaciones de la comunidad de ARC Raiders y de su entorno.',tileStatus:'Música, historias y creaciones de la comunidad',
      radioTitle:'Raider Radio',radioDesc:'Canciones inspiradas en ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Historias de la comunidad.',
      back:'← Volver a Fan Creations',storiesEmptyTitle:'Todavía no hay historias publicadas',storiesEmpty:'Las historias de la comunidad aparecerán aquí cuando estén listas para Ramas Field Tool.',
      aboutTitle:'¿Qué es Raider Radio?',about:'Raider Radio presenta música de la comunidad de ARC Raiders y de su entorno: canciones de Ramas Field Tool y música de otros artistas de la comunidad. No es una banda sonora oficial de ARC Raiders.',
      how:'Las contribuciones externas abren su plataforma original en una nueva pestaña. Algunas canciones de la comunidad, publicadas con permiso explícito, se pueden escuchar directamente en Raider Radio. Ramas Field Tool no ofrece una función de descarga.',listen:'▶ Escuchar en Suno'
    },
    it:{
      hubTitle:'Fan Creations',hubIntro:'Opere creative della community di ARC Raiders.',tileStatus:'Musica, racconti e creazioni della community',
      radioTitle:'Raider Radio',radioDesc:'Brani ispirati ad ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Racconti della community.',
      back:'← Torna a Fan Creations',storiesEmptyTitle:'Nessun racconto ancora pubblicato',storiesEmpty:'Qui appariranno i racconti della community quando saranno pronti per Ramas Field Tool.',
      aboutTitle:'Che cos’è Raider Radio?',about:'Raider Radio propone musica della community di ARC Raiders e ispirata al suo mondo: brani di Ramas Field Tool e musica di altri artisti della community. Non è una colonna sonora ufficiale di ARC Raiders.',
      how:'I contributi esterni aprono la piattaforma originale in una nuova scheda. Alcuni brani della community, pubblicati con autorizzazione esplicita, possono essere ascoltati direttamente in Raider Radio. Ramas Field Tool non offre una funzione di download.',listen:'▶ Ascolta su Suno'
    }
  };

  const storyCopy={
    de:{read:'Story lesen',back:'← Zurück zu Raider Stories'},
    en:{read:'Read story',back:'← Back to Raider Stories'},
    fr:{read:'Lire l’histoire',back:'← Retour à Raider Stories'},
    es:{read:'Leer historia',back:'← Volver a Raider Stories'},
    it:{read:'Leggi il racconto',back:'← Torna a Raider Stories'}
  };
  const stories=window.RFTCommunityStories||[];

  const section=document.getElementById('raiderRadio');
  const tile=document.querySelector('#appLauncher [data-app-target="raiderRadio"]');
  if(!section||!tile)return;
  tile.dataset.fanCreations='true';

  section.setAttribute('aria-label','Fan Creations');
  section.replaceChildren();

  const hub=document.createElement('div');
  hub.className='fan-creations-hub';
  const hubTitle=document.createElement('h2');
  const hubIntro=document.createElement('p');
  hubIntro.className='fan-creations-intro';
  const categoryGrid=document.createElement('div');
  categoryGrid.className='fan-category-grid';

  // Fixed decorative SVG markup only; community text continues to use textContent.
  const illustrations={"radio":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M25 25 65 12\" fill=\"none\" stroke=\"#8f5678\" stroke-width=\"4\" stroke-linecap=\"round\"/><rect x=\"10\" y=\"27\" width=\"76\" height=\"57\" rx=\"12\" fill=\"#eea349\" stroke=\"#804326\" stroke-width=\"3\"/><rect x=\"17\" y=\"35\" width=\"62\" height=\"12\" rx=\"4\" fill=\"#fff0ce\"/><path d=\"M23 41h34m-23-3v6\" stroke=\"#a85540\" stroke-width=\"2\"/><circle cx=\"32\" cy=\"65\" r=\"13\" fill=\"#934b52\"/><circle cx=\"32\" cy=\"65\" r=\"8\" fill=\"#f5c785\"/><path d=\"M53 59h20m-20 6h20m-20 6h14\" stroke=\"#804326\" stroke-width=\"3\" stroke-linecap=\"round\"/><circle cx=\"71\" cy=\"41\" r=\"3\" fill=\"#a06593\"/><path d=\"M78 10v12m0-10 10-3v10\" stroke=\"#a06593\" stroke-width=\"3\" fill=\"none\"/><circle cx=\"75\" cy=\"23\" r=\"4\" fill=\"#a06593\"/><circle cx=\"85\" cy=\"20\" r=\"4\" fill=\"#a06593\"/></svg>","stories":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M10 29q21-8 38 2 17-10 38-2v51q-20-7-38 2-18-9-38-2z\" fill=\"#936487\" stroke=\"#674261\" stroke-width=\"3\"/><path d=\"M15 23q18-6 33 4 15-10 33-4v49q-18-6-33 4-15-10-33-4z\" fill=\"#fff2d9\" stroke=\"#9d7367\" stroke-width=\"2\"/><path d=\"M48 28v47\" stroke=\"#c9a587\" stroke-width=\"2\"/><path d=\"M23 39h15m-15 8h15m-15 8h11m23-16h15m-15 8h15m-15 8h11\" stroke=\"#b58084\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"m61 16 3-7 3 7 7 3-7 3-3 7-3-7-7-3z\" fill=\"#e7b856\"/><path d=\"m32 76 7-6v18l-7-5-7 5V71\" fill=\"#be6571\"/></svg>","art":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"19\" y=\"17\" width=\"59\" height=\"68\" rx=\"6\" transform=\"rotate(7 48 48)\" fill=\"#b497ba\"/><rect x=\"15\" y=\"13\" width=\"59\" height=\"68\" rx=\"6\" transform=\"rotate(-5 48 48)\" fill=\"#fff0d3\" stroke=\"#986858\" stroke-width=\"3\"/><path d=\"m25 64 13-15 10 10 9-9 10 16\" fill=\"#d59082\"/><circle cx=\"32\" cy=\"34\" r=\"8\" fill=\"#e6b958\"/><path d=\"m52 40 25-26 5 5-26 26\" fill=\"#9c729e\" stroke=\"#694b70\" stroke-width=\"2\"/><path d=\"M56 44q-3 11-13 9 1-10 9-13\" fill=\"#bb6470\"/><path d=\"m79 61 3-6 3 6 6 3-6 3-3 6-3-6-6-3z\" fill=\"#e6b958\"/></svg>"};
  const header=document.createElement('header');
  header.className='fan-creations-header';
  const headerArt=document.createElement('span');
  headerArt.className='fan-header-art';
  headerArt.setAttribute('aria-hidden','true');
  headerArt.innerHTML=illustrations.art;
  const headerCopy=document.createElement('div');
  headerCopy.append(hubTitle,hubIntro);
  header.append(headerArt,headerCopy);

  function makeCategory(view,icon){
    const button=document.createElement('button');
    button.type='button';
    button.className='fan-category-card';
    button.dataset.fanView=view;
    const iconWrap=document.createElement('span');
    iconWrap.className='fan-category-icon';
    iconWrap.setAttribute('aria-hidden','true');
    iconWrap.innerHTML=illustrations[icon];
    const text=document.createElement('span');
    text.className='fan-category-copy';
    const title=document.createElement('strong');
    const desc=document.createElement('small');
    text.append(title,desc);
    const arrow=document.createElement('span');
    arrow.className='fan-category-arrow';
    arrow.setAttribute('aria-hidden','true');
    arrow.textContent='↗';
    button.append(iconWrap,text,arrow);
    categoryGrid.append(button);
    return {button,title,desc};
  }

  const radioCategory=makeCategory('radio','radio');
  const storiesCategory=makeCategory('stories','stories');
  hub.append(header,categoryGrid);

  const radioView=document.createElement('div');
  radioView.className='fan-view';
  radioView.hidden=true;
  const radioBack=document.createElement('button');
  radioBack.type='button';
  radioBack.className='fan-view-back';
  const radioHeading=document.createElement('h2');
  radioHeading.className='radio-wordmark';
  const about=document.createElement('details');
  about.className='radio-about';
  const aboutTitle=document.createElement('summary');
  const aboutText=document.createElement('p');
  const howText=document.createElement('p');
  about.append(aboutTitle,aboutText,howText);
  const radioGrid=document.createElement('div');
  radioGrid.id='raiderRadioSongs';
  radioGrid.className='radio-grid';
  radioView.append(radioBack,radioHeading,about,radioGrid);

  const albumView=document.createElement('div');
  albumView.className='fan-view radio-album-view';
  albumView.hidden=true;
  const albumBack=document.createElement('a');
  albumBack.className='fan-view-back';
  albumBack.href='#raiderRadio/radio';
  const albumHeading=document.createElement('h2');
  albumHeading.textContent=collection.title;
  const albumArtist=document.createElement('p');
  albumArtist.className='radio-artist';
  albumArtist.textContent=collection.artist;
  const albumGrid=document.createElement('div');
  albumGrid.className='radio-grid radio-album-grid';
  const albumActions=[];
  collection.albums.forEach(album=>{
    const card=document.createElement('article');
    card.className='radio-song radio-album';
    const cover=document.createElement('img');
    cover.src=album.cover;
    cover.alt=album.title;
    cover.width=cover.height=1536;
    cover.loading='lazy';
    const title=document.createElement('h3');
    title.textContent=album.title;
    const action=document.createElement(album.url?'a':'p');
    action.className=album.url?'radio-listen':'radio-link-pending';
    if(album.url){
      action.href=album.url;
      action.target='_blank';
      action.rel='noopener noreferrer';
    }
    albumActions.push({action,title:album.title,hasUrl:!!album.url});
    card.append(cover,title,action);
    albumGrid.append(card);
  });
  albumView.append(albumBack,albumArtist,albumHeading,albumGrid);

  const collectionCard=document.createElement('a');
  collectionCard.className='radio-song radio-collection';
  collectionCard.dataset.collectionId=collection.id;
  collectionCard.href='#raiderRadio/radio/'+collection.id;
  const collectionCover=document.createElement('img');
  collectionCover.src=collection.cover;
  collectionCover.alt=collection.artist+' – '+collection.title;
  collectionCover.width=collectionCover.height=1536;
  collectionCover.loading='lazy';
  const collectionArtist=document.createElement('p');
  collectionArtist.className='radio-artist';
  collectionArtist.textContent=collection.artist;
  const collectionTitle=document.createElement('h3');
  collectionTitle.textContent=collection.title;
  const collectionOpen=document.createElement('span');
  collectionOpen.className='radio-open';
  collectionCard.append(collectionCover,collectionArtist,collectionTitle,collectionOpen);
  radioGrid.append(collectionCard);

  const storiesView=document.createElement('div');
  storiesView.className='fan-view';
  storiesView.hidden=true;
  const storiesBack=document.createElement('button');
  storiesBack.type='button';
  storiesBack.className='fan-view-back';
  const storiesHeading=document.createElement('h2');
  const storiesGrid=document.createElement('div');
  storiesGrid.className='fan-stories-grid';
  storiesView.append(storiesBack,storiesHeading,storiesGrid);

  const storyView=document.createElement('div');
  storyView.className='fan-view fan-story-view';
  storyView.hidden=true;
  const storyBack=document.createElement('a');
  storyBack.className='fan-view-back';
  storyBack.href='#raiderRadio/stories';
  const storyDetail=document.createElement('article');
  storyDetail.className='fan-story-detail';
  storyView.append(storyBack,storyDetail);

  // Community prose never becomes HTML. Themes and external protocols are allowlisted.
  function makeText(tag,className,text){
    const node=document.createElement(tag);
    node.className=className;
    node.textContent=text;
    return node;
  }
  function themeFor(story){return ['dark-ambush','rust-legend','forest-tragicomedy','tower-bluff'].includes(story.theme)?story.theme:'default';}
  function makeImage(story,lazy=false){
    const image=document.createElement('img');
    image.src=story.image;
    image.alt='';
    image.width=story.imageWidth;
    image.height=story.imageHeight;
    image.decoding='async';
    if(lazy)image.loading='lazy';
    return image;
  }
  const storyLinks=[];
  stories.forEach(story=>{
    const card=document.createElement('article');
    card.className='fan-story-card';
    card.dataset.storyId=story.id;
    card.dataset.storyTheme=themeFor(story);
    const cover=makeImage(story,true);
    const cardCopy=document.createElement('div');
    cardCopy.className='fan-story-card-copy';
    const title=makeText('h3','fan-story-card-title',story.title);
    const author=makeText('p','fan-story-author',story.author);
    const summary=makeText('p','fan-story-summary',story.summary);
    title.lang=summary.lang=story.language;
    const link=document.createElement('a');
    link.className='fan-story-read';
    link.href=`#raiderRadio/stories/${encodeURIComponent(story.id)}`;
    storyLinks.push({link,title:story.title});
    cardCopy.append(title,author,summary,link);
    card.append(cover,cardCopy);
    storiesGrid.append(card);
  });

  let currentStoryId=null;
  function renderStory(story){
    if(currentStoryId===story.id)return;
    currentStoryId=story.id;
    storyDetail.replaceChildren();
    storyDetail.dataset.storyTheme=themeFor(story);
    const hero=document.createElement('header');
    hero.className='fan-story-hero';
    const heroCopy=document.createElement('div');
    heroCopy.className='fan-story-hero-copy';
    const kicker=makeText('p','fan-story-kicker','Community Story');
    const title=makeText('h2','fan-story-title',story.title);
    title.lang=story.language;
    title.tabIndex=-1;
    title.id='fanStoryTitle';
    storyDetail.setAttribute('aria-labelledby',title.id);
    const author=makeText('p','fan-story-author',story.author);
    heroCopy.append(kicker,title,author);
    if(story.editorialNote){
      const note=makeText('p','fan-story-editorial-note',story.editorialNote);
      note.lang=story.originalLanguage||story.language;
      heroCopy.append(note);
    }
    hero.append(makeImage(story),heroCopy);
    const body=document.createElement('div');
    body.className='fan-story-body';
    body.lang=story.language;
    story.content.split('\n\n').forEach((paragraph,index)=>{
      body.append(makeText(index===0?'h3':'p',index===0?'fan-story-text-title':'',paragraph));
    });
    const credit=document.createElement('footer');
    credit.className='fan-story-credit';
    credit.lang='en';
    credit.append(makeText('p','','Community Story by '+story.author),makeText('p','fan-story-permission','Published with permission of the author.'));
    if(story.authorUrl){
      try{
        const url=new URL(story.authorUrl);
        if(url.protocol==='https:'){
          const social=makeText('a','fan-story-social','Instagram');
          social.href=url.href;
          social.target='_blank';
          social.rel='noopener noreferrer';
          credit.append(social);
        }
      }catch{/* Invalid author links are omitted. */}
    }
    storyDetail.append(hero,body,credit);
  }

  section.append(hub,radioView,albumView,storiesView,storyView);

  const links=[];
  const players=[];
  function pausePlayers(){players.forEach(player=>player.pause());}
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
    card.append(cover);
    if(song.artist)card.append(makeText('p','radio-artist',song.artist));
    card.append(title);
    if(song.audioUrl){
      const player=document.createElement('audio');
      player.className='radio-player';
      player.src=song.audioUrl;
      player.controls=true;
      player.preload='none';
      player.setAttribute('controlslist','nodownload noplaybackrate noremoteplayback');
      player.disableRemotePlayback=true;
      player.setAttribute('aria-label',song.artist+' – '+song.title);
      players.push(player);
      card.append(player);
    }else{
      const link=document.createElement('a');
      link.className='radio-listen';
      link.href=song.sunoUrl;
      link.target='_blank';
      link.rel='noopener noreferrer';
      card.append(link);
      links.push({link,title:song.title});
    }
    radioGrid.append(card);
  });

  function showHub(){
    hub.hidden=false;
    radioView.hidden=true;
    storiesView.hidden=true;
    storyView.hidden=true;
    albumView.hidden=true;
    currentStoryId=null;
    storyDetail.replaceChildren();
  }
  function showView(view){
    hub.hidden=true;
    radioView.hidden=view!=='radio';
    storiesView.hidden=view!=='stories';
    storyView.hidden=true;
    albumView.hidden=true;
    const target=view==='radio'?radioHeading:storiesHeading;
    target.focus?.({preventScroll:true});
  }

  categoryGrid.addEventListener('click',event=>{
    const button=event.target.closest('[data-fan-view]');
    if(button)location.hash=`raiderRadio/${button.dataset.fanView}`;
  });
  radioBack.addEventListener('click',()=>{location.hash='raiderRadio';});
  storiesBack.addEventListener('click',()=>{location.hash='raiderRadio';});

  function syncRoute(){
    const parts=location.hash.slice(1).split('/');
    if(parts[0]!=='raiderRadio'||parts[1]!=='radio'||parts[2])pausePlayers();
    if(parts[0]!=='raiderRadio'){showHub();return;}
    if(parts[1]==='stories'){
      const story=stories.find(entry=>encodeURIComponent(entry.id)===parts[2]);
      if(story){
        renderStory(story);
        hub.hidden=radioView.hidden=storiesView.hidden=true;
        storyView.hidden=false;
        albumView.hidden=true;
      }else showView('stories');
    }else if(parts[1]==='radio'){
      showView('radio');
      if(parts[2]===collection.id){
        radioView.hidden=true;
        albumView.hidden=false;
      }
    }
    else showHub();
    // The app router runs after this listener; focus the visible heading afterwards.
    requestAnimationFrame(()=>{
      if(!section.classList.contains('launcher-active'))return;
      const heading=!albumView.hidden?albumHeading:storyView.hidden?(hub.hidden?(radioView.hidden?storiesHeading:radioHeading):hubTitle):storyDetail.querySelector('h2');
      heading.tabIndex=-1;
      heading.focus({preventScroll:true});
    });
  }
  window.addEventListener('hashchange',syncRoute);

  const tileIcon=tile.querySelector('.app-icon');
  if(tileIcon){
    tileIcon.innerHTML=illustrations.art;
  }

  function syncLauncherLanguage(lang){
    const title=tile.querySelector('b');
    const status=tile.querySelector('small');
    if(title&&title.textContent!==lang.hubTitle)title.textContent=lang.hubTitle;
    if(status&&status.textContent!==lang.tileStatus)status.textContent=lang.tileStatus;
  }
  function syncLanguage(){
    const lang=copy[document.documentElement.lang]||copy.en;
    const musicLang=collectionCopy[document.documentElement.lang]||collectionCopy.en;
    albumBack.textContent=musicLang.back;
    collectionOpen.textContent=musicLang.open;
    collectionCard.setAttribute('aria-label',collection.artist+' – '+collection.title+' — '+musicLang.open);
    albumActions.forEach(({action,title,hasUrl})=>{
      action.textContent=hasUrl?musicLang.listen:musicLang.pending;
      if(hasUrl)action.setAttribute('aria-label',title+' — '+musicLang.listen);
    });
    syncLauncherLanguage(lang);
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
    const storyLang=storyCopy[document.documentElement.lang]||storyCopy.en;
    storyBack.textContent=storyLang.back;
    storyLinks.forEach(({link,title})=>{
      link.textContent=storyLang.read;
      link.setAttribute('aria-label',`${storyLang.read}: ${title}`);
    });
    aboutTitle.textContent=lang.aboutTitle;
    aboutText.textContent=lang.about;
    howText.textContent=lang.how;
    links.forEach(({link,title})=>{
      if(link.textContent!==lang.listen)link.textContent=lang.listen;
      link.setAttribute('aria-label',`${title} — ${lang.listen}`);
    });
  }

  syncRoute();
  syncLanguage();
  new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  // The legacy launcher translator also updates this tile after a language switch.
  new MutationObserver(()=>syncLauncherLanguage(copy[document.documentElement.lang]||copy.en))
    .observe(tile,{childList:true,subtree:true,characterData:true});

  let wasActive=section.classList.contains('launcher-active');
  new MutationObserver(()=>{
    const isActive=section.classList.contains('launcher-active');
    if(isActive&&!wasActive)syncRoute();
    if(!isActive&&wasActive)pausePlayers();
    wasActive=isActive;
  }).observe(section,{attributes:true,attributeFilter:['class']});
})();
