// V2.9.6 – tolerant item search + cleaner EN fallback display
// Loaded after app.js so the stable core logic remains untouched.

function searchNorm(value){
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/ß/g,'ss')
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
}

function searchCompact(value){
  return searchNorm(value).replace(/\s+/g,'');
}

function itemSearchCorpus(i){
  const values=[
    i?.id,
    i?.name?.de,i?.name?.en,
    i?.de,i?.en,
    i?.description?.de,i?.description?.en,
    i?.use,i?.useEn,i?.use_en,
    i?.recycle,i?.recycleEn,i?.recycle_en,
    i?.type,i?.rarity
  ];

  if(i?.recyclesInto && typeof i.recyclesInto==='object'){
    Object.keys(i.recyclesInto).forEach(id=>{
      values.push(id);
      const target=itemById(id);
      if(target){
        values.push(target?.name?.de,target?.name?.en,target?.de,target?.en);
      }
    });
  }

  const normal=searchNorm(values.filter(Boolean).join(' '));
  return {normal,compact:normal.replace(/\s+/g,'')};
}

function matchesItemSearch(i,query){
  const terms=searchNorm(query).split(/\s+/).filter(Boolean);
  if(!terms.length) return true;
  const corpus=itemSearchCorpus(i);
  return terms.every(term=>
    corpus.normal.includes(term) ||
    corpus.compact.includes(term.replace(/\s+/g,''))
  );
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

// Search every relevant field in both languages. Multiple terms use AND logic.
// Example: "hoch" matches every item whose searchable data contains "hoch...".
drawItems=function(){
  const query=q.value.trim();
  if(!query){
    out.innerHTML='';
    status.textContent=`${items.length} ${tr('records')} · ${tr('searchPrompt')}${usingFallback?' · ⚠':''}`;
    if(usingFallback) status.classList.add('load-error'); else status.classList.remove('load-error');
    return;
  }

  const results=items.filter(i=>matchesItemSearch(i,query));
  status.classList.remove('load-error');
  status.textContent=`${results.length} ${tr('matches')} · ${items.length} ${tr('records')}`;
  out.innerHTML=results.length?results.map(card).join(''):`<div class="empty">${tr('noHit')}</div>`;
};

// Sanity check: the UI translation dictionaries must contain the same keys.
try{
  const missingEn=Object.keys(T.de).filter(k=>!(k in T.en));
  const missingDe=Object.keys(T.en).filter(k=>!(k in T.de));
  if(missingEn.length||missingDe.length){
    console.warn('Translation dictionary mismatch',{missingEn,missingDe});
  }
}catch(err){
  console.warn('Translation dictionary check failed',err);
}
