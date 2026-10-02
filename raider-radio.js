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
    {id:'ugly',title:'Ugly',cover:'assets/music/ugly-cover.png',sunoUrl:'https://suno.com/s/vbkPccvrI66ij4gJ'},
    {id:'the-arcs-are-the-enemy',title:'The ARCs Are the Enemy',cover:'assets/music/the-arcs-are-the-enemy-cover.png',sunoUrl:'https://suno.com/s/trsx9nLKROxaw5fW'},
    {id:'loot-and-shoot',title:'Loot&Shoot',cover:'assets/music/loot-and-shoot-cover.png',sunoUrl:'https://suno.com/s/vkAaYpLp5LkJyuVz'},
    {id:'what-was-it-for',title:'What Was It For?',coverBase64Parts:['assets/music/what-was-it-for-cover.part1','assets/music/what-was-it-for-cover.part2','assets/music/what-was-it-for-cover.part3','assets/music/what-was-it-for-cover.part4','assets/music/what-was-it-for-cover.part5'],sunoUrl:'https://suno.com/s/xqxasdeSvRKfs74o'}
  ];

  const copy={
    de:{
      hubTitle:'Fan Creations',hubIntro:'Kreative Werke aus der ARC-Raiders-Community.',tileStatus:'Musik, Storys & Community-Kreationen',
      radioTitle:'Raider Radio',radioDesc:'Songs, inspiriert von ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Geschichten aus der Community.',
      back:'← Zurück zu Fan Creations',storiesEmptyTitle:'Noch keine Story veröffentlicht',storiesEmpty:'Hier erscheinen Community-Geschichten, sobald sie für Ramas Field Tool bereit sind.',
      aboutTitle:'Was ist Raider Radio?',about:'Raider Radio ist unser kleines Musikprojekt rund um Ramas Field Tool: selbst erstellte Songs, inspiriert von ARC Raiders. Sie sind keine offiziellen ARC-Raiders-Soundtracks.',
      how:'Zum Anhören öffnet sich der jeweilige Song direkt bei Suno in einem neuen Tab. Ramas Field Tool speichert oder hostet keine Audiodateien und bietet keine Downloads an. Neue Songs werden hier nach und nach ergänzt.',listen:'▶ Auf Suno anhören'
    },
    en:{
      hubTitle:'Fan Creations',hubIntro:'Creative work from the ARC Raiders community.',tileStatus:'Music, stories & community creations',
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

  const storyCopy={
    de:{read:'Story lesen',back:'← Zurück zu Raider Stories'},
    en:{read:'Read story',back:'← Back to Raider Stories'},
    fr:{read:'Lire l’histoire',back:'← Retour à Raider Stories'},
    es:{read:'Leer historia',back:'← Volver a Raider Stories'}
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
  function themeFor(story){return story.theme==='dark-ambush'?'dark-ambush':'default';}
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

  section.append(hub,radioView,storiesView,storyView);

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
    storyView.hidden=true;
    currentStoryId=null;
    storyDetail.replaceChildren();
  }
  function showView(view){
    hub.hidden=true;
    radioView.hidden=view!=='radio';
    storiesView.hidden=view!=='stories';
    storyView.hidden=true;
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
    if(parts[0]!=='raiderRadio'){showHub();return;}
    if(parts[1]==='stories'){
      const story=stories.find(entry=>encodeURIComponent(entry.id)===parts[2]);
      if(story){
        renderStory(story);
        hub.hidden=radioView.hidden=storiesView.hidden=true;
        storyView.hidden=false;
      }else showView('stories');
    }else if(parts[1]==='radio')showView('radio');
    else showHub();
    // The app router runs after this listener; focus the visible heading afterwards.
    requestAnimationFrame(()=>{
      if(!section.classList.contains('launcher-active'))return;
      const heading=storyView.hidden?(hub.hidden?(radioView.hidden?storiesHeading:radioHeading):hubTitle):storyDetail.querySelector('h2');
      heading.tabIndex=-1;
      heading.focus({preventScroll:true});
    });
  }
  window.addEventListener('hashchange',syncRoute);

  const tileIcon=tile.querySelector('.app-icon');
  if(tileIcon){
    tileIcon.innerHTML=illustrations.art;
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

  let wasActive=section.classList.contains('launcher-active');
  new MutationObserver(()=>{
    const isActive=section.classList.contains('launcher-active');
    if(isActive&&!wasActive)syncRoute();
    wasActive=isActive;
  }).observe(section,{attributes:true,attributeFilter:['class']});
})();
