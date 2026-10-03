// V2.13.4 — localized community acknowledgement and legal footer.
(()=>{
  const title=document.getElementById('communityCreditTitle');
  const body=document.getElementById('communityCreditBody');
  const link=document.getElementById('communityCreditLink');
  const kicker=document.getElementById('communityCreditKicker');
  const firstTestersLabel=document.getElementById('firstTestersLabel');
  const janTesterCredit=document.getElementById('janTesterCredit');
  const jasminTesterCredit=document.getElementById('jasminTesterCredit');
  if(!title||!body||!link||!kicker||!firstTestersLabel||!janTesterCredit||!jasminTesterCredit)return;

  const copy={
    de:{kicker:'COMMUNITY // DANKE',title:'ARC Raiders – Die Ü30-Rentner',body:'Ein herzliches Dankeschön an die Facebook-Gruppe „ARC Raiders – Die Ü30-Rentner“. Die Gruppe und das Feedback ihrer Mitglieder haben die Entwicklung von Ramas Field Tool spürbar unterstützt.',firstTesters:'DIE ERSTEN TESTER',jan:'Sein frühes Feedback zur nicht intuitiven Oberfläche hat die grundlegende Überarbeitung der App angestoßen.',jasmin:'Ihr Feedback war der Anstoß für die Bauplanliste, die heute ein fester Teil der App ist.',link:'GRUPPE AUF FACEBOOK',privacy:'Datenschutz',legal:'Kontakt & Rechtliches',support:'Kontakt'},
    en:{kicker:'COMMUNITY // THANK YOU',title:'ARC Raiders – Die Ü30-Rentner',body:'Special thanks to the Facebook group “ARC Raiders – Die Ü30-Rentner”. The group and its members’ feedback have been a real help in shaping Ramas Field Tool.',firstTesters:'THE FIRST TESTERS',jan:'His early feedback that the interface was not intuitive helped trigger the app’s fundamental UI overhaul.',jasmin:'Her feedback sparked the blueprint tracker, which is now a core part of the app.',link:'OPEN FACEBOOK GROUP',privacy:'Privacy',legal:'Contact & legal',support:'Contact'},
    fr:{kicker:'COMMUNAUTÉ // MERCI',title:'ARC Raiders – Die Ü30-Rentner',body:'Un grand merci au groupe Facebook « ARC Raiders – Die Ü30-Rentner ». Le groupe et les retours de ses membres ont réellement contribué au développement de Ramas Field Tool.',firstTesters:'LES PREMIERS TESTEURS',jan:'Son retour précoce sur le manque d’intuitivité de l’interface a contribué à lancer la refonte fondamentale de l’application.',jasmin:'Son retour a été à l’origine du suivi des plans, aujourd’hui partie intégrante de l’application.',link:'OUVRIR LE GROUPE FACEBOOK',privacy:'Confidentialité',legal:'Contact & mentions légales',support:'Contact'},
    es:{kicker:'COMUNIDAD // GRACIAS',title:'ARC Raiders – Die Ü30-Rentner',body:'Muchas gracias al grupo de Facebook «ARC Raiders – Die Ü30-Rentner». El grupo y los comentarios de sus miembros han contribuido de forma importante al desarrollo de Ramas Field Tool.',firstTesters:'LOS PRIMEROS TESTERS',jan:'Sus primeros comentarios sobre una interfaz poco intuitiva ayudaron a impulsar la renovación fundamental de la aplicación.',jasmin:'Sus comentarios dieron origen al seguimiento de planos, que hoy es una parte fija de la aplicación.',link:'ABRIR GRUPO DE FACEBOOK',privacy:'Privacidad',legal:'Contacto y aviso legal',support:'Contacto'},
    it:{kicker:'COMMUNITY // GRAZIE',title:'ARC Raiders – Die Ü30-Rentner',body:'Un sentito ringraziamento al gruppo Facebook “ARC Raiders – Die Ü30-Rentner”. Il gruppo e i feedback dei suoi membri hanno contribuito concretamente allo sviluppo di Ramas Field Tool.',firstTesters:'I PRIMI TESTER',jan:'Il suo primo feedback sull’interfaccia poco intuitiva ha contribuito ad avviare la revisione fondamentale dell’app.',jasmin:'Il suo feedback ha dato origine al tracker dei progetti, che oggi è una parte integrante dell’app.',link:'APRI IL GRUPPO FACEBOOK',privacy:'Privacy',legal:'Contatti e note legali',support:'Contatto'}
  };

  function language(){
    try{const stored=localStorage.getItem('arcUiLanguage');if(copy[stored])return stored}catch{}
    if(document.documentElement.lang&&copy[document.documentElement.lang])return document.documentElement.lang;
    return 'en';
  }

  const footer=document.querySelector('main > footer');
  if(footer&&!document.getElementById('legalLinks')){
    const legalLinks=document.createElement('span');
    legalLinks.id='legalLinks';
    legalLinks.style.display='flex';legalLinks.style.flexWrap='wrap';legalLinks.style.gap='8px 12px';legalLinks.style.alignItems='center';
    legalLinks.innerHTML='<a id="privacyLink" href="privacy.html">Privacy</a><a id="legalLink" href="legal.html">Contact & legal</a><a id="supportMail" href="mailto:ramasfieldtool@proton.me">ramasfieldtool@proton.me</a>';
    footer.appendChild(legalLinks);
    footer.style.setProperty('display','flex','important');footer.style.flexWrap='wrap';footer.style.gap='8px 16px';footer.style.alignItems='center';
  }

  function sync(){
    const lang=language(),text=copy[lang]||copy.en;
    kicker.textContent=text.kicker;title.textContent=text.title;body.textContent=text.body;firstTestersLabel.textContent=text.firstTesters;janTesterCredit.textContent=text.jan;jasminTesterCredit.textContent=text.jasmin;link.textContent=text.link;
    link.setAttribute('aria-label',`${text.link}: ${text.title}`);
    const privacy=document.getElementById('privacyLink');if(privacy){privacy.textContent=text.privacy;privacy.href=`privacy.html#${lang}`}
    const legal=document.getElementById('legalLink');if(legal){legal.textContent=text.legal;legal.href=`legal.html#${lang}`}
    const support=document.getElementById('supportMail');if(support)support.setAttribute('aria-label',`${text.support}: ramasfieldtool@proton.me`);
  }

  document.addEventListener('click',event=>{if(event.target.closest('#arcLanguageMenu,[data-arc-language],#deBtn,#enBtn,#itBtn'))setTimeout(sync,0)});
  window.addEventListener('arc-language-change',()=>setTimeout(sync,0));
  window.addEventListener('storage',event=>{if(event.key==='arcUiLanguage')sync()});
  sync();
})();
