(()=>{
  'use strict';
  const SOURCE_URL='https://github.com/RaidTheory/arcraiders-data';
  const labels={
    de:{title:'Mögliche Fundorte',areas:'Typische Suchbereiche',arc:'Mögliche ARC-Fundquellen',maps:'Karten',none:'Für dieses Item liegen keine Fundortinformationen vor.',note:'Community-Daten zu möglichen Fundquellen. Kein garantierter Fund.',source:'Quelle'},
    en:{title:'Possible find locations',areas:'Typical search areas',arc:'Possible ARC sources',maps:'Maps',none:'No find-location information is available for this item.',note:'Community data about possible sources. No guaranteed find.',source:'Source'},
    fr:{title:'Lieux possibles',areas:'Zones de recherche typiques',arc:'Sources ARC possibles',maps:'Cartes',none:'Aucune information de lieu disponible pour cet objet.',note:'Données communautaires sur les sources possibles. Aucun résultat garanti.',source:'Source'},
    es:{title:'Posibles lugares',areas:'Zonas de búsqueda típicas',arc:'Posibles fuentes ARC',maps:'Mapas',none:'No hay información de ubicación para este objeto.',note:'Datos comunitarios sobre posibles fuentes. No se garantiza el hallazgo.',source:'Fuente'},
    it:{title:'Possibili luoghi',areas:'Aree di ricerca tipiche',arc:'Possibili fonti ARC',maps:'Mappe',none:'Non sono disponibili informazioni sui luoghi per questo oggetto.',note:'Dati della community sulle possibili fonti. Ritrovamento non garantito.',source:'Fonte'}
  };
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalizeFoundIn=value=>[...new Set((Array.isArray(value)?value:typeof value==='string'?value.split(','):[]).map(v=>String(v).trim()).filter(Boolean))];
  const currentLang=()=>['de','en','fr','es','it'].includes(window.lang)?window.lang:(localStorage.getItem('arcLang')||'de');
  const openIds=new Set();

  function render(item){
    const lang=currentLang();
    const t=labels[lang]||labels.en;
    const data=window.RFTItemLocations?.get(item,lang)||{foundIn:item?.foundIn||'',sources:[],maps:[]};
    const areas=normalizeFoundIn(data.foundIn);
    const sources=Array.isArray(data.sources)?data.sources:[];
    const maps=Array.isArray(data.maps)?data.maps:[];
    const empty=!areas.length&&!sources.length;
    return `<details class="item-find-locations" data-find-id="${esc(item.id)}"${openIds.has(item.id)?' open':''}>
      <summary>${esc(t.title)}</summary>
      <div class="item-find-locations-body">
        ${areas.length?`<div><b>${esc(t.areas)}:</b> ${areas.map(esc).join(' · ')}</div>`:''}
        ${sources.length?`<div><b>${esc(t.arc)}:</b> ${sources.map(source=>esc(source.name||source.id)).join(' · ')}</div>`:''}
        ${maps.length?`<div><b>${esc(t.maps)}:</b> ${maps.map(map=>esc(map.name||map.id)).join(' · ')}</div>`:''}
        ${empty?`<div>${esc(t.none)}</div>`:''}
        <small>${esc(t.note)} ${esc(t.source)}: <a href="${SOURCE_URL}" target="_blank" rel="noopener noreferrer">RaidTheory / ARC Tracker</a></small>
      </div>
    </details>`;
  }

  function enhance(){
    const list=Array.isArray(window.items)?window.items:[];
    document.querySelectorAll('#out .card[data-item-id]').forEach(card=>{
      const id=card.dataset.itemId;
      if(!id||card.querySelector('.item-find-locations')) return;
      const item=list.find(entry=>entry?.id===id);
      if(!item) return;
      const decision=card.querySelector('.need');
      if(decision) decision.insertAdjacentHTML('beforebegin',render(item));
      else card.insertAdjacentHTML('beforeend',render(item));
      const details=card.querySelector('.item-find-locations');
      details?.addEventListener('toggle',()=>details.open?openIds.add(id):openIds.delete(id));
    });
  }

  function refresh(){
    document.querySelectorAll('#out .item-find-locations').forEach(node=>node.remove());
    enhance();
  }

  function start(){
    const out=document.getElementById('out');
    if(!out) return;
    new MutationObserver(enhance).observe(out,{childList:true,subtree:true});
    enhance();
    Promise.resolve(window.RFTItemLocations?.load?.()).then(refresh).catch(()=>refresh());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
