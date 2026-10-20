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

  const contributionCopy={
    de:{title:'Dein Werk in Fan Creations',intro:'Beiträge sind freiwillig. Wir prüfen jede Einsendung manuell; die Veröffentlichung ist nicht garantiert.',types:'Willkommen sind eigene Geschichten, Fan-Art, Screenshots, Musiklinks und hilfreiche Kartenhinweise.',ownership:'Ich habe dieses Werk erstellt oder die Erlaubnis, es einzureichen.',display:'Ich erlaube Ramas Field Tool, dieses Werk mit dem von mir angegebenen Namen oder Alias in Fan Creations zu zeigen. Übersetzungen oder Bearbeitungen brauchen eine separate Zustimmung.',privacy:'Ich habe private Angaben entfernt, die nicht öffentlich erscheinen sollen.',privacyNote:'Der E-Mail-Entwurf enthält keine persönlichen Angaben. Erst wenn du ihn in deinem E-Mail-Programm selbst sendest, werden deine Absenderadresse und die von dir ergänzten Informationen an Ramas Field Tool übermittelt.',email:'E-Mail-Entwurf öffnen',subject:'Fan-Creations-Beitrag',body:'Art des Beitrags:\nTitel:\nLink oder Anhang:\nName/Alias für die Nennung (optional):\nKurzbeschreibung:\n\nIch habe dieses Werk erstellt oder darf es einreichen. Ich erlaube Ramas Field Tool, es mit der oben angegebenen Nennung in Fan Creations zu zeigen. Übersetzungen oder Bearbeitungen benötigen eine separate Zustimmung. Ich kann um Entfernung bitten. Mir ist bekannt, dass Einsendungen geprüft werden und eine Veröffentlichung nicht garantiert ist.'},
    en:{title:'Share your work in Fan Creations',intro:'Taking part is optional. Every submission is reviewed by a person; publication is not guaranteed.',types:'We welcome original stories, fan art, screenshots, music links and useful map tips.',ownership:'I created this work or have permission to submit it.',display:'I allow Ramas Field Tool to display this work in Fan Creations with the name or alias I provide. Translations or edits require separate permission.',privacy:'I have removed private details I do not want made public.',privacyNote:'The email draft contains no personal details. Your email address and any information you add are sent to Ramas Field Tool only if you choose to send it from your email app.',email:'Open an email draft',subject:'Fan Creations submission',body:'Type of contribution:\nTitle:\nLink or attachment:\nCredit name/alias (optional):\nShort description:\n\nI created this work or have permission to submit it. I allow Ramas Field Tool to display it in Fan Creations with the credit above. Translations or edits require separate permission. I may request removal. I understand submissions are reviewed and publication is not guaranteed.'},
    fr:{title:'Partagez votre création dans Fan Creations',intro:'La participation est facultative. Chaque proposition est examinée par une personne ; sa publication n’est pas garantie.',types:'Les récits originaux, fan arts, captures d’écran, liens musicaux et conseils utiles sur les cartes sont les bienvenus.',ownership:'J’ai créé cette œuvre ou j’ai l’autorisation de la proposer.',display:'J’autorise Ramas Field Tool à afficher cette œuvre dans Fan Creations avec le nom ou pseudonyme fourni. Toute traduction ou modification nécessitera une autorisation distincte.',privacy:'J’ai supprimé les informations privées que je ne souhaite pas rendre publiques.',privacyNote:'Le brouillon ne contient aucune donnée personnelle. Votre adresse e-mail et les informations ajoutées ne sont transmises à Ramas Field Tool que si vous choisissez d’envoyer le message depuis votre messagerie.',email:'Ouvrir un brouillon d’e-mail',subject:'Proposition Fan Creations',body:'Type de création :\nTitre :\nLien ou pièce jointe :\nNom/pseudonyme pour le crédit (facultatif) :\nBrève description :\n\nJ’ai créé cette œuvre ou j’ai le droit de la proposer. J’autorise Ramas Field Tool à l’afficher dans Fan Creations avec le crédit indiqué ci-dessus. Toute traduction ou modification nécessite une autorisation distincte. Je peux demander son retrait. Je comprends que les propositions sont examinées et que leur publication n’est pas garantie.'},
    es:{title:'Comparte tu creación en Fan Creations',intro:'Participar es opcional. Cada envío se revisa manualmente y no se garantiza su publicación.',types:'Aceptamos historias originales, arte de fans, capturas, enlaces musicales y consejos útiles sobre mapas.',ownership:'He creado esta obra o tengo permiso para enviarla.',display:'Permito que Ramas Field Tool muestre esta obra en Fan Creations con el nombre o alias que indique. Las traducciones o modificaciones requieren permiso aparte.',privacy:'He eliminado los datos privados que no quiero hacer públicos.',privacyNote:'El borrador no incluye datos personales. Tu dirección de correo y la información que añadas solo se envían a Ramas Field Tool si decides enviar el mensaje desde tu aplicación de correo.',email:'Abrir borrador de correo',subject:'Envío para Fan Creations',body:'Tipo de creación:\nTítulo:\nEnlace o archivo adjunto:\nNombre/alias para el crédito (opcional):\nBreve descripción:\n\nHe creado esta obra o tengo permiso para enviarla. Permito que Ramas Field Tool la muestre en Fan Creations con el crédito indicado. Las traducciones o modificaciones requieren permiso aparte. Puedo solicitar que se retire. Entiendo que los envíos se revisan y que la publicación no está garantizada.'},
    it:{title:'Condividi la tua creazione in Fan Creations',intro:'La partecipazione è facoltativa. Ogni proposta viene verificata manualmente; la pubblicazione non è garantita.',types:'Sono benvenuti racconti originali, fan art, screenshot, link musicali e consigli utili sulle mappe.',ownership:'Ho creato quest’opera o ho il permesso di inviarla.',display:'Autorizzo Ramas Field Tool a mostrare quest’opera in Fan Creations con il nome o alias che fornirò. Traduzioni o modifiche richiedono un’autorizzazione separata.',privacy:'Ho rimosso i dati privati che non desidero rendere pubblici.',privacyNote:'La bozza non contiene dati personali. L’indirizzo e-mail e le informazioni aggiunte vengono inviati a Ramas Field Tool solo se scegli di spedire il messaggio dalla tua app di posta.',email:'Apri una bozza e-mail',subject:'Proposta Fan Creations',body:'Tipo di creazione:\nTitolo:\nLink o allegato:\nNome/alias per il credito (facoltativo):\nBreve descrizione:\n\nHo creato quest’opera o ho il permesso di inviarla. Autorizzo Ramas Field Tool a mostrarla in Fan Creations con il credito indicato sopra. Traduzioni o modifiche richiedono un’autorizzazione separata. Posso richiederne la rimozione. Capisco che le proposte vengono verificate e che la pubblicazione non è garantita.'}
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
      hubTitle:'Fan Creations',hubIntro:'Kreative Werke aus der ARC-Raiders-Community.',tileStatus:'Musik, Storys & Wettbewerbsbilder',
      contestsTitle:'Wettbewerbsbilder',contestsDesc:'Gewinnerbilder aus Community-Wettbewerben',contestsHeading:'Community-Wettbewerbe',contestCardTitle:'Gewinnerbild',contestDateLabel:'Wettbewerbszeitraum',contestGroupLabel:'Facebook-Gruppe',contestPrompt:'Neues Gruppenbild gesucht!',contestAlt:'Das Gewinnerbild des ARC-Raiders-Wettbewerbs mit zwei Raidern bei Sonnenuntergang; auf ihren Rucksäcken steht PvE und PvP.',
      radioTitle:'Raider Radio',radioDesc:'Songs, inspiriert von ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Geschichten aus der Community.',
      back:'← Zurück zu Fan Creations',storiesEmptyTitle:'Noch keine Story veröffentlicht',storiesEmpty:'Hier erscheinen Community-Geschichten, sobald sie für Ramas Field Tool bereit sind.',
      aboutTitle:'Was ist Raider Radio?',about:'Raider Radio zeigt Musik aus und rund um die ARC-Raiders-Community: eigene Songs von Ramas Field Tool und Musik anderer Community-Künstler. Dies ist kein offizieller ARC-Raiders-Soundtrack.',
      how:'Externe Beiträge öffnen zum Anhören ihre Originalplattform in einem neuen Tab. Einzelne ausdrücklich freigegebene Community-Songs sind direkt in Raider Radio abspielbar. Ramas Field Tool bietet keine Download-Funktion an.',listen:'▶ Auf Suno anhören'
    },
    en:{
      hubTitle:'Fan Creations',hubIntro:'Creative work from the ARC Raiders community.',tileStatus:'Music, stories & contest images',
      contestsTitle:'Contest gallery',contestsDesc:'Winning images from community contests',contestsHeading:'Community contests',contestCardTitle:'Winning image',contestDateLabel:'Contest dates',contestGroupLabel:'Facebook group',contestPrompt:'New group image wanted!',contestAlt:'Winning image from an ARC Raiders contest: two raiders at sunset, with PvE and PvP on their backpacks.',
      radioTitle:'Raider Radio',radioDesc:'Songs inspired by ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Stories from the community.',
      back:'← Back to Fan Creations',storiesEmptyTitle:'No story published yet',storiesEmpty:'Community stories will appear here once they are ready for Ramas Field Tool.',
      aboutTitle:'What is Raider Radio?',about:'Raider Radio features music from and around the ARC Raiders community: songs by Ramas Field Tool and music by other community artists. This is not an official ARC Raiders soundtrack.',
      how:'External contributions open their original platform in a new tab. Selected community songs published with explicit permission can be played directly in Raider Radio. Ramas Field Tool does not offer a download function.',listen:'▶ Listen on Suno'
    },
    fr:{
      hubTitle:'Fan Creations',hubIntro:'Des créations de la communauté ARC Raiders et autour de celle-ci.',tileStatus:'Musique, histoires et concours',
      contestsTitle:'Galerie des concours',contestsDesc:'Images gagnantes des concours communautaires',contestsHeading:'Concours communautaires',contestCardTitle:'Image gagnante',contestDateLabel:'Période du concours',contestGroupLabel:'Groupe Facebook',contestPrompt:'Concours : nouvelle image de groupe !',contestAlt:'Image gagnante d’un concours ARC Raiders : deux Raiders au coucher du soleil, avec PvE et PvP sur leurs sacs.',
      radioTitle:'Raider Radio',radioDesc:'Des morceaux inspirés d’ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Des histoires de la communauté.',
      back:'← Retour à Fan Creations',storiesEmptyTitle:'Aucune histoire publiée pour le moment',storiesEmpty:'Les histoires de la communauté apparaîtront ici lorsqu’elles seront prêtes pour Ramas Field Tool.',
      aboutTitle:'Qu’est-ce que Raider Radio ?',about:'Raider Radio présente de la musique issue de la communauté ARC Raiders et inspirée par celle-ci : des morceaux de Ramas Field Tool et d’autres artistes de la communauté. Il ne s’agit pas d’une bande-son officielle d’ARC Raiders.',
      how:'Les contributions externes ouvrent leur plateforme d’origine dans un nouvel onglet. Certains morceaux de la communauté, publiés avec une autorisation explicite, peuvent être écoutés directement dans Raider Radio. Ramas Field Tool ne propose aucune fonction de téléchargement.',listen:'▶ Écouter sur Suno'
    },
    es:{
      hubTitle:'Fan Creations',hubIntro:'Creaciones de la comunidad de ARC Raiders y de su entorno.',tileStatus:'Música, historias y concursos',
      contestsTitle:'Galería de concursos',contestsDesc:'Imágenes ganadoras de concursos comunitarios',contestsHeading:'Concursos de la comunidad',contestCardTitle:'Imagen ganadora',contestDateLabel:'Fechas del concurso',contestGroupLabel:'Grupo de Facebook',contestPrompt:'¡Se busca una nueva imagen de grupo!',contestAlt:'Imagen ganadora de un concurso de ARC Raiders: dos Raiders al atardecer, con PvE y PvP en sus mochilas.',
      radioTitle:'Raider Radio',radioDesc:'Canciones inspiradas en ARC Raiders.',storiesTitle:'Raider Stories',storiesDesc:'Historias de la comunidad.',
      back:'← Volver a Fan Creations',storiesEmptyTitle:'Todavía no hay historias publicadas',storiesEmpty:'Las historias de la comunidad aparecerán aquí cuando estén listas para Ramas Field Tool.',
      aboutTitle:'¿Qué es Raider Radio?',about:'Raider Radio presenta música de la comunidad de ARC Raiders y de su entorno: canciones de Ramas Field Tool y música de otros artistas de la comunidad. No es una banda sonora oficial de ARC Raiders.',
      how:'Las contribuciones externas abren su plataforma original en una nueva pestaña. Algunas canciones de la comunidad, publicadas con permiso explícito, se pueden escuchar directamente en Raider Radio. Ramas Field Tool no ofrece una función de descarga.',listen:'▶ Escuchar en Suno'
    },
    it:{
      hubTitle:'Fan Creations',hubIntro:'Opere creative della community di ARC Raiders.',tileStatus:'Musica, racconti e concorsi',
      contestsTitle:'Galleria dei concorsi',contestsDesc:'Immagini vincitrici dei concorsi della community',contestsHeading:'Concorsi della community',contestCardTitle:'Immagine vincitrice',contestDateLabel:'Periodo del concorso',contestGroupLabel:'Gruppo Facebook',contestPrompt:'Concorso: cercasi una nuova immagine di gruppo!',contestAlt:'Immagine vincitrice di un concorso ARC Raiders: due Raider al tramonto, con PvE e PvP sugli zaini.',
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
  const archiveCopy={
    de:{open:'Frühere Gewinner ansehen',back:'Zurück zum aktuellen Wettbewerb',title:'Archiv früherer Gewinner',intro:'Hier erscheinen frühere Gewinnerbilder erst, wenn Nutzungsrecht, Urheberangabe und Wettbewerbsdetails dokumentiert geprüft wurden.',empty:'Aktuell sind keine früheren Gewinner für das Archiv freigegeben.',contribute:'Zum Fan-Creations-Beitragsleitfaden',contest:'Wettbewerb',period:'Zeitraum',group:'Community-Gruppe',creator:'Urheber'},
    en:{open:'Browse past winners',back:'Back to current contest',title:'Past winners archive',intro:'Past winning images appear here after image permission, creator credit and contest details are reviewed and documented.',empty:'No past winners are approved for the archive yet.',contribute:'Open the Fan Creations contribution guide',contest:'Contest',period:'Dates',group:'Community group',creator:'Creator'},
    fr:{open:'Voir les anciens gagnants',back:'Retour au concours actuel',title:'Archives des anciens gagnants',intro:'Les images des anciens gagnants seront affichées après vérification documentée des droits, du crédit du créateur et des détails du concours.',empty:'Aucun ancien gagnant n’est encore autorisé pour les archives.',contribute:'Ouvrir le guide de contribution Fan Creations',contest:'Concours',period:'Dates',group:'Groupe communautaire',creator:'Créateur'},
    es:{open:'Ver ganadores anteriores',back:'Volver al concurso actual',title:'Archivo de ganadores anteriores',intro:'Las imágenes de ganadores anteriores aparecerán tras revisar y documentar los permisos, el crédito del creador y los datos del concurso.',empty:'Todavía no hay ganadores anteriores aprobados para el archivo.',contribute:'Abrir la guía de contribución de Fan Creations',contest:'Concurso',period:'Fechas',group:'Grupo comunitario',creator:'Creador'},
    it:{open:'Sfoglia i vincitori passati',back:'Torna al concorso attuale',title:'Archivio dei vincitori passati',intro:'Le immagini dei vincitori passati appariranno dopo la verifica documentata dei permessi, dei crediti e dei dettagli del concorso.',empty:'Non ci sono ancora vincitori passati approvati per l’archivio.',contribute:'Apri la guida per contribuire a Fan Creations',contest:'Concorso',period:'Date',group:'Gruppo della community',creator:'Autore'}
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
  const contestsCategory=makeCategory('contests','art');
  hub.append(header,categoryGrid);

  const contribute=document.createElement('details');
  contribute.className='fan-contribute';
  const contributeSummary=document.createElement('summary');
  const contributeBody=document.createElement('div');
  contributeBody.className='fan-contribute-body';
  const contributeIntro=document.createElement('p');
  contributeIntro.className='fan-contribute-intro';
  const contributeTypes=document.createElement('p');
  const consentOwnership=document.createElement('label');
  const ownershipInput=document.createElement('input');ownershipInput.type='checkbox';ownershipInput.dataset.contributionConsent='ownership';
  const ownershipText=document.createElement('span');consentOwnership.append(ownershipInput,ownershipText);
  const consentDisplay=document.createElement('label');
  const displayInput=document.createElement('input');displayInput.type='checkbox';displayInput.dataset.contributionConsent='display';
  const displayText=document.createElement('span');consentDisplay.append(displayInput,displayText);
  const consentPrivacy=document.createElement('label');
  const privacyInput=document.createElement('input');privacyInput.type='checkbox';privacyInput.dataset.contributionConsent='privacy';
  const privacyText=document.createElement('span');consentPrivacy.append(privacyInput,privacyText);
  const contributionPrivacyNote=document.createElement('p');contributionPrivacyNote.className='fan-contribute-privacy';
  const emailDraft=document.createElement('a');emailDraft.className='fan-submit-email';emailDraft.hidden=true;
  emailDraft.href='mailto:ramasfieldtool@proton.me';emailDraft.rel='nofollow';
  contributeBody.append(contributeIntro,contributeTypes,consentOwnership,consentDisplay,consentPrivacy,contributionPrivacyNote,emailDraft);
  contribute.append(contributeSummary,contributeBody);
  hub.append(contribute);
  const updateContribution=()=>{
    const lang=contributionCopy[document.documentElement.lang]||contributionCopy.en;
    const allowed=ownershipInput.checked&&displayInput.checked&&privacyInput.checked;
    contributeSummary.textContent=lang.title;contributeIntro.textContent=lang.intro;contributeTypes.textContent=lang.types;
    ownershipText.textContent=lang.ownership;displayText.textContent=lang.display;privacyText.textContent=lang.privacy;
    contributionPrivacyNote.textContent=lang.privacyNote;emailDraft.textContent=lang.email;
    emailDraft.hidden=!allowed;
    emailDraft.href=allowed?`mailto:ramasfieldtool@proton.me?subject=${encodeURIComponent(lang.subject)}&body=${encodeURIComponent(lang.body)}`:'mailto:ramasfieldtool@proton.me';
  };
  contribute.addEventListener('change',updateContribution);
  updateContribution();

  const contests=[{
    id:'new-group-image',
    image:'assets/fan-creations/contest-winner-group-image.jpg',
    periodByLanguage:{
      de:'18.–26. September',en:'18–26 September',fr:'18–26 septembre',es:'18–26 de septiembre',it:'18–26 settembre'
    },
    group:'ARC Raiders - Die Ü30-Rentner'
  }];

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
  storiesHeading.className='stories-wordmark';
  const storiesGrid=document.createElement('div');
  storiesGrid.className='fan-stories-grid';
  storiesView.append(storiesBack,storiesHeading,storiesGrid);

  const contestsView=document.createElement('div');
  contestsView.className='fan-view fan-contests-view';
  contestsView.hidden=true;
  const contestsBack=document.createElement('button');
  contestsBack.type='button';
  contestsBack.className='fan-view-back fan-contests-back';
  const contestsHeading=document.createElement('h2');
  contestsHeading.className='stories-wordmark';
  const archiveToggle=document.createElement('button');
  archiveToggle.type='button';archiveToggle.className='fan-contest-archive-toggle';archiveToggle.setAttribute('aria-expanded','false');
  const contestsGrid=document.createElement('div');
  contestsGrid.className='fan-contests-grid';
  const archiveView=document.createElement('section');
  archiveView.className='fan-contest-archive';archiveView.hidden=true;
  const archiveHeading=document.createElement('h3');archiveHeading.className='fan-contest-archive-title';
  const archiveIntro=document.createElement('p');archiveIntro.className='fan-contest-archive-intro';
  const archiveEmpty=document.createElement('p');archiveEmpty.className='fan-contest-archive-empty';
  const archiveGrid=document.createElement('div');archiveGrid.className='fan-contests-grid fan-contest-archive-grid';archiveGrid.hidden=true;
  const archiveContribution=document.createElement('button');archiveContribution.type='button';archiveContribution.className='fan-contest-archive-contribute';
  archiveView.append(archiveHeading,archiveIntro,archiveEmpty,archiveGrid,archiveContribution);
  contestsView.append(contestsBack,contestsHeading,archiveToggle,contestsGrid,archiveView);
  const contestCards=[];
  contests.forEach(entry=>{
    const card=document.createElement('article');
    card.className='fan-contest-card';
    card.dataset.contestId=entry.id;
    const image=document.createElement('img');
    image.src=entry.image;
    image.alt='';
    image.width=1536;
    image.height=864;
    image.loading='lazy';
    image.decoding='async';
    const body=document.createElement('div');
    body.className='fan-contest-card-copy';
    const heading=makeText('h3','fan-contest-card-title','');
    const prompt=makeText('p','fan-contest-prompt','');
    const metadata=document.createElement('dl');
    metadata.className='fan-contest-meta';
    const dateRow=document.createElement('div');
    const dateLabel=makeText('dt','', '');
    const dateValue=makeText('dd','fan-contest-date',entry.periodByLanguage.de);
    dateRow.append(dateLabel,dateValue);
    const groupRow=document.createElement('div');
    const groupLabel=makeText('dt','', '');
    const groupValue=makeText('dd','fan-contest-group',entry.group);
    groupRow.append(groupLabel,groupValue);
    metadata.append(dateRow,groupRow);
    body.append(heading,prompt,metadata);
    card.append(image,body);
    contestsGrid.append(card);
    contestCards.push({entry,image,heading,prompt,dateLabel,dateValue,groupLabel,groupValue});
  });

  let archiveEntries=[],archiveLoadPromise=null;
  const safeArchiveEntry=entry=>!!entry&&typeof entry==='object'&&/^[a-z0-9-]+$/.test(entry.id||'')&&typeof entry.title==='string'&&entry.title.trim()&&typeof entry.contest==='string'&&entry.contest.trim()&&typeof entry.period==='string'&&entry.period.trim()&&typeof entry.group==='string'&&entry.group.trim()&&typeof entry.creator==='string'&&entry.creator.trim()&&typeof entry.alt==='string'&&entry.alt.trim()&&typeof entry.image==='string'&&/^assets\/fan-creations\/[a-z0-9_-]+\.(?:avif|gif|jpe?g|png|webp)$/i.test(entry.image)&&entry.permissionStatus==='documented'&&typeof entry.permissionReference==='string'&&entry.permissionReference.trim();
  function renderContestArchive(){
    const labels=archiveCopy[document.documentElement.lang]||archiveCopy.en;
    archiveHeading.textContent=labels.title;archiveIntro.textContent=labels.intro;archiveContribution.textContent=labels.contribute;
    archiveGrid.replaceChildren();
    const approved=archiveEntries.filter(safeArchiveEntry);
    archiveEmpty.textContent=labels.empty;archiveEmpty.hidden=approved.length>0;archiveGrid.hidden=!approved.length;
    approved.forEach(entry=>{
      const card=document.createElement('article');card.className='fan-contest-card fan-contest-archive-card';card.dataset.archiveId=entry.id;
      const image=document.createElement('img');image.src=entry.image;image.alt=entry.alt;image.loading='lazy';image.decoding='async';
      const body=document.createElement('div');body.className='fan-contest-card-copy';
      const title=makeText('h4','fan-contest-card-title',entry.title);
      const metadata=document.createElement('dl');metadata.className='fan-contest-meta';
      for(const [label,value] of [[labels.contest,entry.contest],[labels.period,entry.period],[labels.group,entry.group],[labels.creator,entry.creator]]){
        const row=document.createElement('div');row.append(makeText('dt','',label),makeText('dd','',value));metadata.append(row);
      }
      body.append(title,metadata);card.append(image,body);archiveGrid.append(card);
    });
  }
  function setArchiveOpen(open){
    const labels=archiveCopy[document.documentElement.lang]||archiveCopy.en;
    archiveView.hidden=!open;contestsGrid.hidden=open;archiveToggle.setAttribute('aria-expanded',String(open));archiveToggle.textContent=open?labels.back:labels.open;
    if(open){renderContestArchive();loadContestArchive()}
  }
  function loadContestArchive(){
    if(archiveLoadPromise)return;
    archiveLoadPromise=fetch('fan-contest-archive.json?v=1',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error(String(response.status));return response.json()}).then(data=>{
      if(data?.schemaVersion===1&&Array.isArray(data.entries))archiveEntries=data.entries.filter(safeArchiveEntry);
      renderContestArchive();
    }).catch(error=>{archiveLoadPromise=null;console.warn('Contest archive unavailable; empty archive retained',error)});
  }
  archiveToggle.addEventListener('click',()=>setArchiveOpen(archiveView.hidden));
  archiveContribution.addEventListener('click',()=>{
    location.hash='raiderRadio';showHub();contribute.open=true;contribute.scrollIntoView({behavior:'smooth',block:'center'});contributeSummary.focus({preventScroll:true});
  });

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
  [...stories].reverse().forEach((story,index)=>{
    const card=document.createElement('article');
    card.className='fan-story-card';
    card.dataset.storyId=story.id;
    card.dataset.storyTheme=themeFor(story);
    const cover=makeImage(story,true);
    const cardCopy=document.createElement('div');
    cardCopy.className='fan-story-card-copy';
    const title=makeText('h3','fan-story-card-title',story.title);
    if(index===0)cardCopy.append(makeText('span','fan-story-new','Neu'));
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
    window.RFTApplyStoryLanguage?.();
  }

  section.append(hub,radioView,albumView,storiesView,contestsView,storyView);

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
    contestsView.hidden=true;
    storyView.hidden=true;
    albumView.hidden=true;
    currentStoryId=null;
    storyDetail.replaceChildren();
  }
  function showView(view){
    hub.hidden=true;
    radioView.hidden=view!=='radio';
    storiesView.hidden=view!=='stories';
    contestsView.hidden=view!=='contests';
    storyView.hidden=true;
    albumView.hidden=true;
    if(view==='contests')setArchiveOpen(false);
    const target=view==='radio'?radioHeading:view==='contests'?contestsHeading:storiesHeading;
    target.focus?.({preventScroll:true});
  }

  categoryGrid.addEventListener('click',event=>{
    const button=event.target.closest('[data-fan-view]');
    if(button)location.hash=`raiderRadio/${button.dataset.fanView}`;
  });
  radioBack.addEventListener('click',()=>{location.hash='raiderRadio';});
  storiesBack.addEventListener('click',()=>{location.hash='raiderRadio';});
  contestsBack.addEventListener('click',()=>{location.hash='raiderRadio';});

  function syncRoute(){
    const parts=location.hash.slice(1).split('/');
    if(parts[0]!=='raiderRadio'||parts[1]!=='radio'||parts[2])pausePlayers();
    if(parts[0]!=='raiderRadio'){showHub();return;}
    if(parts[1]==='contests'){
      showView('contests');
    }else if(parts[1]==='stories'){
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
      const heading=!albumView.hidden?albumHeading:!contestsView.hidden?contestsHeading:storyView.hidden?(hub.hidden?(radioView.hidden?storiesHeading:radioHeading):hubTitle):storyDetail.querySelector('h2');
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
    const newest=storiesGrid.querySelector('.fan-story-new');
    if(newest)newest.textContent=({de:'Neu',en:'New',fr:'Nouveau',es:'Nuevo',it:'Nuovo'})[document.documentElement.lang]||'New';
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
    contestsCategory.title.textContent=lang.contestsTitle;
    contestsCategory.desc.textContent=lang.contestsDesc;
    contestsBack.textContent=lang.back;
    contestsHeading.textContent=lang.contestsHeading;
    const archiveLang=archiveCopy[document.documentElement.lang]||archiveCopy.en;
    archiveToggle.textContent=archiveView.hidden?archiveLang.open:archiveLang.back;
    if(!archiveView.hidden)renderContestArchive();
    contestCards.forEach(({entry,image,heading,prompt,dateLabel,dateValue,groupLabel,groupValue})=>{
      heading.textContent=lang.contestCardTitle;
      prompt.textContent=lang.contestPrompt;
      image.alt=lang.contestAlt;
      dateLabel.textContent=lang.contestDateLabel;
      dateValue.textContent=entry.periodByLanguage[document.documentElement.lang]||entry.periodByLanguage.en;
      groupLabel.textContent=lang.contestGroupLabel;
      groupValue.textContent=entry.group;
    });
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
    updateContribution();
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
