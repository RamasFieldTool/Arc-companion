// V2.13.4 — localized community acknowledgement.
(()=>{
  const title=document.getElementById('communityCreditTitle');
  const body=document.getElementById('communityCreditBody');
  const link=document.getElementById('communityCreditLink');
  const kicker=document.getElementById('communityCreditKicker');
  const en=document.getElementById('enBtn');
  if(!title||!body||!link||!kicker)return;

  const copy={
    de:{
      kicker:'COMMUNITY // DANKE',
      title:'ARC Raiders – Die Ü30-Rentner',
      body:'Ein herzliches Dankeschön an die Facebook-Gruppe „ARC Raiders – Die Ü30-Rentner“. Die Gruppe und das Feedback ihrer Mitglieder haben die Entwicklung von Ramas Field Tool spürbar unterstützt.',
      link:'GRUPPE AUF FACEBOOK'
    },
    en:{
      kicker:'COMMUNITY // THANK YOU',
      title:'ARC Raiders – Die Ü30-Rentner',
      body:'Special thanks to the Facebook group “ARC Raiders – Die Ü30-Rentner”. The group and its members’ feedback have been a real help in shaping Ramas Field Tool.',
      link:'OPEN FACEBOOK GROUP'
    }
  };

  function sync(){
    const text=copy[en?.classList.contains('active')?'en':'de'];
    kicker.textContent=text.kicker;
    title.textContent=text.title;
    body.textContent=text.body;
    link.textContent=text.link;
    link.setAttribute('aria-label',`${text.link}: ${text.title}`);
  }

  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(sync,0));
  en?.addEventListener('click',()=>setTimeout(sync,0));
  sync();
})();
