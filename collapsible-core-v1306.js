// V13.0.6 test — compact drawer summaries for Total Needs and Item Search.
(()=>{
  const supply=document.getElementById('supplySection');
  const items=document.getElementById('itemsSection');
  if(!supply||!items)return;

  const COPY={
    de:{
      open:'ÖFFNEN',close:'SCHLIESSEN',supplyDefault:'Bedarf und Bestand anzeigen',noGoals:'Keine aktiven Ziele',
      allOwned:'Alles vorhanden',missing:count=>count===1?'1 Material fehlt':`${count} Materialien fehlen`,
      itemsTitle:'ITEM-SUCHE',itemsDefault:'Item oder Material suchen',itemsLabel:'ITEM ODER MATERIAL',
      results:(count,query)=>`${count} Treffer für „${query}“`,supplyClose:'GESAMTBEDARF SCHLIESSEN',itemsClose:'ITEM-SUCHE SCHLIESSEN'
    },
    en:{
      open:'OPEN',close:'CLOSE',supplyDefault:'View requirements and owned items',noGoals:'No active goals',
      allOwned:'Everything collected',missing:count=>`${count} material${count===1?'':'s'} missing`,
      itemsTitle:'ITEM SEARCH',itemsDefault:'Search for an item or material',itemsLabel:'ITEM OR MATERIAL',
      results:(count,query)=>`${count} result${count===1?'':'s'} for “${query}”`,supplyClose:'CLOSE TOTAL NEEDS',itemsClose:'CLOSE ITEM SEARCH'
    }
  };
  const english=()=>document.getElementById('enBtn')?.classList.contains('active');
  const copy=()=>COPY[english()?'en':'de'];

  function supplyText(){
    const c=copy(),root=document.getElementById('summary');
    if(!root)return c.supplyDefault;
    if(root.querySelector('.empty'))return c.noGoals;
    const missing=root.querySelectorAll('.summary-item.is-missing').length;
    const hasRows=!!root.querySelector('.summary-item');
    return hasRows?(missing?c.missing(missing):c.allOwned):c.supplyDefault;
  }
  function itemText(){
    const c=copy(),query=document.getElementById('q')?.value.trim()||'';
    if(!query)return c.itemsDefault;
    const direct=document.querySelectorAll('#out .search-group-list .card').length;
    const recycle=document.querySelectorAll('#out .recycle-source-card').length;
    return c.results(direct+recycle,query);
  }
  function sync(){
    const c=copy();
    document.getElementById('supplyDrawerSummary').textContent=supplyText();
    document.getElementById('itemsDrawerTitle').textContent=c.itemsTitle;
    document.getElementById('itemsDrawerSummary').textContent=itemText();
    document.getElementById('itemsSearchLabel').textContent=c.itemsLabel;
    document.getElementById('supplyDrawerAction').textContent=supply.open?c.close:c.open;
    document.getElementById('itemsDrawerAction').textContent=items.open?c.close:c.open;
    document.getElementById('supplyDrawerClose').textContent=c.supplyClose;
    document.getElementById('itemsDrawerClose').textContent=c.itemsClose;
  }
  function closeDrawer(drawer){
    drawer.open=false;
    const summary=drawer.querySelector(':scope > summary');
    if(summary){try{summary.focus({preventScroll:true})}catch{summary.focus()}}
    summary?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }

  supply.addEventListener('toggle',sync);
  items.addEventListener('toggle',sync);
  document.getElementById('supplyDrawerClose').addEventListener('click',()=>closeDrawer(supply));
  document.getElementById('itemsDrawerClose').addEventListener('click',()=>closeDrawer(items));
  document.getElementById('q')?.addEventListener('input',()=>setTimeout(sync,0));
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(sync,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(sync,0));
  new MutationObserver(sync).observe(document.getElementById('summary'),{childList:true,subtree:true});
  new MutationObserver(sync).observe(document.getElementById('out'),{childList:true,subtree:true});
  sync();
})();
