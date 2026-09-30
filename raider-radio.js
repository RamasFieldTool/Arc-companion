// Add a cover and one entry here to extend Raider Radio. Array order is display order.
(()=>{
  const songs=[
    {id:'ugly',title:'Ugly',cover:'assets/music/ugly-cover.png',sunoUrl:'https://suno.com/s/vbkPccvrI66ij4gJ'},
    {id:'the-arcs-are-the-enemy',title:'The ARCs Are the Enemy',cover:'assets/music/the-arcs-are-the-enemy-cover.png',sunoUrl:'https://suno.com/s/trsx9nLKROxaw5fW'}
  ];
  const grid=document.getElementById('raiderRadioSongs');
  if(!grid)return;
  const listen={de:'▶ Auf Suno anhören',en:'▶ Listen on Suno',fr:'▶ Écouter sur Suno',es:'▶ Escuchar en Suno'};
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
    const label=listen[document.documentElement.lang]||listen.en;
    links.forEach(({link,title})=>{
      if(link.textContent!==label)link.textContent=label;
      link.setAttribute('aria-label',`${title} — ${label}`);
    });
  }
  syncLanguage();
  new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
