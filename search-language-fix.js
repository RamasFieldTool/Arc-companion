// V2.12.0 – tolerant item search + separated recycling-source results
// Keep a reference to the original app.js listener so it can be replaced cleanly.
const legacyDrawItemsListener=drawItems;

function searchNorm(value){
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/ß/g,'ss')
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
}

function searchTerms(query){
  return searchNorm(query).split(/\s+/).filter(Boolean);
}

function corpusMatches(corpus,terms){
  return terms.every(term=>corpus.normal.includes(term)||corpus.compact.includes(term));
}

function directItemSearchCorpus(i){
  // A direct hit means the searched text identifies the item itself.
  // Description/recycling text is deliberately excluded; otherwise e.g. "hoch"
  // matched unrelated items merely because their description contained "Hochleistung".
  const values=[
    i?.id,
    i?.name?.de,i?.name?.en,i?.name?.fr,i?.name?.es,i?.name?.it,
    i?.de,i?.en
  ];
  const normal=searchNorm(values.filter(Boolean).join(' '));
  return {normal,compact:normal.replace(/\s+/g,'')};
}

function recyclingOutputCorpus(i){
  const values=[];
  if(i?.recyclesInto && typeof i.recyclesInto==='object'){
    Object.keys(i.recyclesInto).forEach(id=>{
      values.push(id);
      const target=itemById(id);
      if(target) values.push(target?.name?.de,target?.name?.en,target?.name?.fr,target?.name?.es,target?.name?.it,target?.de,target?.en);
    });
  }
  const normal=searchNorm(values.filter(Boolean).join(' '));
  return {normal,compact:normal.replace(/\s+/g,'')};
}

function matchesDirectItemSearch(i,query){
  const terms=searchTerms(query);
  return terms.length ? corpusMatches(directItemSearchCorpus(i),terms) : true;
}

function matchesRecyclingOutput(i,query){
  const terms=searchTerms(query);
  if(!terms.length) return false;
  const corpus=recyclingOutputCorpus(i);
  if(!corpus.normal) return false;
  return corpusMatches(corpus,terms);
}

function recyclingMatchText(i,query){
  const terms=searchTerms(query);
  const rec=i?.recyclesInto;
  if(!rec || typeof rec!=='object') return '';
  const hits=Object.entries(rec).filter(([id])=>{
    const target=itemById(id);
    const normal=searchNorm([id,target?.name?.de,target?.name?.en,target?.name?.fr,target?.name?.es,target?.name?.it,target?.de,target?.en].filter(Boolean).join(' '));
    const corpus={normal,compact:normal.replace(/\s+/g,'')};
    return corpusMatches(corpus,terms);
  }).map(([id,n])=>{
    const target=itemById(id);
    return `${n}× ${target?itemName(target):id.replaceAll('_',' ')}`;
  });
  return hits.join(' · ');
}

// Avoid German legacy fallback strings leaking into English mode.
itemDesc=function(i){
  if(i?.description){
    if(lang==='en') return i.description.en || '';
    return i.description.de || i.description.en || '';
  }
  if(lang==='en') return i?.useEn || i?.use_en || '';
  return i?.use || i?.useDe || i?.use_de || '';
};

recyclingText=function(i){
  const rec=i?.recyclesInto;
  if(rec && typeof rec==='object' && Object.keys(rec).length){
    return Object.entries(rec).map(([id,n])=>{
      const target=itemById(id);
      return `${n}× ${target?itemName(target):id.replaceAll('_',' ')}`;
    }).join(' · ');
  }

  if(lang==='en'){
    const english=i?.recycleEn || i?.recycle_en;
    return english && english!=='—' ? english : tr('noRecycle');
  }

  const german=i?.recycle || i?.recycleDe || i?.recycle_de;
  return german && german!=='—' ? german : tr('noRecycle');
};

const SEARCH_RESULT_COPY={
  de:{directHits:'Direkte Treffer',recycleSources:'Durch Recycling erhältlich',recycleSourceHint:'Diese Items enthalten den gesuchten Gegenstand beim Zerlegen.',yields:'Ergibt'},
  en:{directHits:'Direct matches',recycleSources:'Available through recycling',recycleSourceHint:'These items yield the searched item when recycled.',yields:'Yields'},
  fr:{directHits:'Résultats directs',recycleSources:'Disponible par recyclage',recycleSourceHint:'Ces objets fournissent l’objet recherché lorsqu’ils sont recyclés.',yields:'Produit'},
  es:{directHits:'Resultados directos',recycleSources:'Disponible mediante reciclaje',recycleSourceHint:'Estos objetos proporcionan el objeto buscado al reciclarlos.',yields:'Produce'},
  it:{directHits:'Risultati diretti',recycleSources:'Disponibile tramite riciclo',recycleSourceHint:'Questi oggetti forniscono l’oggetto cercato quando vengono riciclati.',yields:'Produce'}
};

Object.entries(SEARCH_RESULT_COPY).forEach(([code,copy])=>{
  if(!T[code]) T[code]={};
  Object.assign(T[code],copy);
});

function recyclingSourceCard(i,query){
  const yieldText=recyclingMatchText(i,query);
  const copy=SEARCH_RESULT_COPY[document.documentElement.lang||lang] || SEARCH_RESULT_COPY.en;
  return `<div class="recycle-source-card">
    <div class="recycle-source-main">
      <div class="recycle-source-name">${itemName(i)}</div>
      <div class="recycle-source-yield"><span>${copy.yields}:</span> ${yieldText}</div>
    </div>
    <div class="recycle-source-full">${card(i)}</div>
  </div>`;
}

// Direct matches and recycling-source matches are deliberately shown separately.
drawItems=function(){
  const query=q.value.trim();
  if(!query){
    out.innerHTML='';
    status.textContent=`${items.length} ${tr('records')} · ${tr('searchPrompt')}`;
    status.classList.remove('load-error');
    return;
  }

  const direct=items.filter(i=>matchesDirectItemSearch(i,query));
  const directIds=new Set(direct.map(i=>i.id));
  const recycling=items.filter(i=>!directIds.has(i.id)&&matchesRecyclingOutput(i,query));
  const total=direct.length+recycling.length;
  const copy=SEARCH_RESULT_COPY[document.documentElement.lang||lang] || SEARCH_RESULT_COPY.en;

  status.classList.remove('load-error');
  status.textContent=`${total} ${tr('matches')} · ${items.length} ${tr('records')}`;

  if(!total){
    out.innerHTML=`<div class="empty">${tr('noHit')}</div>`;
    return;
  }

  out.innerHTML=`
    ${direct.length?`<section class="search-result-group"><div class="search-group-head"><b>${copy.directHits}</b><span>${direct.length}</span></div><div class="search-group-list">${direct.map(card).join('')}</div></section>`:''}
    ${recycling.length?`<section class="search-result-group recycle-group"><div class="search-group-head"><div><b>${copy.recycleSources}</b><small>${copy.recycleSourceHint}</small></div><span>${recycling.length}</span></div><div class="recycle-source-list">${recycling.map(i=>recyclingSourceCard(i,query)).join('')}</div></section>`:''}
  `;
};

// Replace the listener captured by app.js instead of rendering every keystroke twice.
q.removeEventListener('input',legacyDrawItemsListener);
q.addEventListener('input',drawItems);

try{
  const missingEn=Object.keys(T.de).filter(k=>!(k in T.en));
  const missingDe=Object.keys(T.en).filter(k=>!(k in T.de));
  if(missingEn.length||missingDe.length){
    console.warn('Translation dictionary mismatch',{missingEn,missingDe});
  }
}catch(err){
  console.warn('Translation dictionary check failed',err);
}

// Load the isolated optional find-location enhancement without changing search behavior.
(()=>{const css=document.createElement('link');css.rel='stylesheet';css.href='item-find-locations.css?v=4';document.head.appendChild(css);const js=document.createElement('script');js.src='item-find-locations.js?v=external-labels-1';document.head.appendChild(js)})();
