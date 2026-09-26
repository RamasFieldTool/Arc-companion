// V2.13.4 — localized community acknowledgement.
(()=>{
  const title=document.getElementById('communityCreditTitle');
  const body=document.getElementById('communityCreditBody');
  const link=document.getElementById('communityCreditLink');
  const kicker=document.getElementById('communityCreditKicker');
  const en=document.getElementById('enBtn');
  const firstTestersLabel=document.getElementById('firstTestersLabel');
  const janTesterCredit=document.getElementById('janTesterCredit');
  const jasminTesterCredit=document.getElementById('jasminTesterCredit');
  if(!title||!body||!link||!kicker||!firstTestersLabel||!janTesterCredit||!jasminTesterCredit)return;

  const copy={
    de:{
      kicker:'COMMUNITY // DANKE',
      title:'ARC Raiders – Die Ü30-Rentner',
      body:'Ein herzliches Dankeschön an die Facebook-Gruppe „ARC Raiders – Die Ü30-Rentner“. Die Gruppe und das Feedback ihrer Mitglieder haben die Entwicklung von Ramas Field Tool spürbar unterstützt.',
      firstTesters:'DIE ERSTEN TESTER',
      jan:'Sein frühes Feedback zur nicht intuitiven Oberfläche hat die grundlegende Überarbeitung der App angestoßen.',
      jasmin:'Ihr Feedback war der Anstoß für die Bauplanliste, die heute ein fester Teil der App ist.',
      link:'GRUPPE AUF FACEBOOK',
      privacy:'Datenschutz',
      legal:'Kontakt & Rechtliches',
      support:'Kontakt'
    },
    en:{
      kicker:'COMMUNITY // THANK YOU',
      title:'ARC Raiders – Die Ü30-Rentner',
      body:'Special thanks to the Facebook group “ARC Raiders – Die Ü30-Rentner”. The group and its members’ feedback have been a real help in shaping Ramas Field Tool.',
      firstTesters:'THE FIRST TESTERS',
      jan:'His early feedback that the interface was not intuitive helped trigger the app’s fundamental UI overhaul.',
      jasmin:'Her feedback sparked the blueprint tracker, which is now a core part of the app.',
      link:'OPEN FACEBOOK GROUP',
      privacy:'Privacy',
      legal:'Contact & legal',
      support:'Contact'
    }
  };

  const footer=document.querySelector('main > footer');
  let legalLinks=null;
  if(footer){
    legalLinks=document.createElement('span');
    legalLinks.id='legalLinks';
    legalLinks.style.display='flex';
    legalLinks.style.flexWrap='wrap';
    legalLinks.style.gap='8px 12px';
    legalLinks.style.alignItems='center';
    legalLinks.innerHTML='<a id="privacyLink" href="privacy.html">Datenschutz</a><a id="legalLink" href="legal.html">Kontakt & Rechtliches</a><a id="supportMail" href="mailto:ramasfieldtool@proton.me">ramasfieldtool@proton.me</a>';
    footer.appendChild(legalLinks);
    footer.style.setProperty('display','flex','important');
    footer.style.flexWrap='wrap';
    footer.style.gap='8px 16px';
    footer.style.alignItems='center';
  }

  function sync(){
    const text=copy[en?.classList.contains('active')?'en':'de'];
    kicker.textContent=text.kicker;
    title.textContent=text.title;
    body.textContent=text.body;
    firstTestersLabel.textContent=text.firstTesters;
    janTesterCredit.textContent=text.jan;
    jasminTesterCredit.textContent=text.jasmin;
    link.textContent=text.link;
    link.setAttribute('aria-label',`${text.link}: ${text.title}`);
    document.getElementById('privacyLink')?.replaceChildren(document.createTextNode(text.privacy));
    document.getElementById('legalLink')?.replaceChildren(document.createTextNode(text.legal));
    const support=document.getElementById('supportMail');
    if(support)support.setAttribute('aria-label',`${text.support}: ramasfieldtool@proton.me`);
  }

  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(sync,0));
  en?.addEventListener('click',()=>setTimeout(sync,0));
  sync();
})();
