// Possible item find locations. Isolated from the existing search implementation.
(()=>{
  const REF='2a4abebb2486a633070f4e260058bcd5ad4511d6';
  const SOURCE='https://github.com/RaidTheory/arcraiders-data';
  const BOTS_URL=`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/${REF}/bots.json`;
  const I18N={
    de:{title:'Mögliche Fundorte',areas:'Typische Suchbereiche',arc:'Mögliche ARC-Fundquellen',maps:'Karten',none:'Für dieses Item liegen keine Fundortinformationen vor.',note:'Community-Daten zu möglichen Fundquellen. Kein garantierter Fund.',source:'Quelle'},
    en:{title:'Possible find locations',areas:'Typical search areas',arc:'Possible ARC sources',maps:'Maps',none:'No find-location information is available for this item.',note:'Community data about possible sources. No guaranteed find.',source:'Source'},
    fr:{title:'Lieux possibles',areas:'Zones de recherche typiques',arc:'Sources ARC possibles',maps:'Cartes',none:'Aucune information de lieu disponible pour cet objet.',note:'Données communautaires sur les sources possibles. Aucun résultat garanti.',source:'Source'},
    es:{title:'Posibles lugares',areas:'Zonas de búsqueda típicas',arc:'Posibles fuentes ARC',maps:'Mapas',none:'No hay información de ubicación para este objeto.',note:'Datos comunitarios sobre posibles fuentes. No se garantiza el hallazgo.',source:'Fuente'},
    it:{title:'Possibili luoghi',areas:'Aree di ricerca tipiche',arc:'Possibili fonti ARC',maps:'Mappe',none:'Non sono disponibili informazioni sui luoghi per questo oggetto.',note:'Dati della community sulle possibili fonti. Ritrovamento non garantito.',source:'Fonte'}
  };
  const MAPS={dam_battlegrounds:{de:'Damm-Schlachtfelder',en:'Dam Battlegrounds',fr:'Champ de bataille du barrage',es:'Campos de batalla de la presa',it:'Campi di battaglia della diga'},the_spaceport:{de:'Raumhafen',en:'Spaceport',fr:'Spatioport',es:'Espaciopuerto',it:'Spazioporto'},the_blue_gate:{de:'Das blaue Tor',en:'The Blue Gate',fr:'La Porte Bleue',es:'La Puerta Azul',it:'Il Cancello Blu'},buried_city:{de:'Begrabene Stadt',en:'Buried City',fr:'Ville enfouie',es:'Ciudad enterrada',it:'Città sepolta'},stella_montis_lower:{de:'Stella Montis – Untere Ebene',en:'Stella Montis – Lower',fr:'Stella Montis – niveau inférieur',es:'Stella Montis – nivel inferior',it:'Stella Montis – livello inferiore'},stella_montis_upper:{de:'Stella Montis – Obere Ebene',en:'Stella Montis – Upper',fr:'Stella Montis – niveau supérieur',es:'Stella Montis – nivel superior',it:'Stella Montis – livello superiore'}};
  const FALLBACK=[{id:'arc_matriarch',name:'MATRIARCH',maps:['dam_battlegrounds'],drops:['magnetic_accelerator']},{id:'arc_the_queen',name:'THE QUEEN',maps:['dam_battlegrounds','the_spaceport','the_blue_gate'],drops:['magnetic_accelerator']}];
  let bots=FALLBACK;
  const opened=new Set();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const language=()=>['de','en','fr','es','it'].includes(window.lang)?window.lang:'en';
  const txt=k=>I18N[language()][k];
  const foundIn=v=>[...new Set((Array.isArray(v)?v:typeof v==='string'?v.split(','):[]).map(x=>String(x).trim()).filter(Boolean))];
  const mapName=id=>MAPS[id]?.[language()]||MAPS[id]?.en||String(id).replaceAll('_',' ');
  function dataFor(item){
    const arc=bots.filter(b=>Array.isArray(b?.drops)&&b.drops.includes(item.id));
    return {areas:foundIn(item?.foundIn),arc,maps:[...new Set(arc.flatMap(b=>Array.isArray(b.maps)?b.maps:[]))]};
  }
  function markup(item){
    const d=dataFor(item),isOpen=opened.has(item.id)?' open':'';
    return `<details class="find-locations" data-find-id="${esc(item.id)}"${isOpen}><summary>${esc(txt('title'))}</summary><div class="find-locations-body">${d.areas.length?`<div><b>${esc(txt('areas'))}:</b> ${esc(d.areas.join(' · '))}</div>`:''}${d.arc.length?`<div><b>${esc(txt('arc'))}:</b> ${d.arc.map(b=>esc(b.name||b.id)).join(' · ')}</div>`:''}${d.maps.length?`<div><b>${esc(txt('maps'))}:</b> ${d.maps.map(mapName).map(esc).join(' · ')}</div>`:''}${!d.areas.length&&!d.arc.length?`<div>${esc(txt('none'))}</div>`:''}<small>${esc(txt('note'))} ${esc(txt('source'))}: <a href="${SOURCE}" target="_blank" rel="noopener noreferrer">RaidTheory / ARC Tracker</a></small></div></details>`;
  }
  function enhance(){
    const cards=[...document.querySelectorAll('#out .card')];
    cards.forEach(cardEl=>{
      if(cardEl.querySelector('.find-locations'))return;
      const title=cardEl.querySelector('h3')?.textContent?.trim();
      if(!title)return;
      const item=(window.items||[]).find(i=>typeof window.itemName==='function'&&window.itemName(i)===title);
      if(!item)return;
      cardEl.insertAdjacentHTML('beforeend',markup(item));
    });
    document.querySelectorAll('#out details.find-locations').forEach(el=>{if(el.dataset.findBound)return;el.dataset.findBound='1';el.addEventListener('toggle',()=>el.open?opened.add(el.dataset.findId):opened.delete(el.dataset.findId))});
  }
  const observer=new MutationObserver(enhance);
  const start=()=>{const out=document.getElementById('out');if(!out)return;observer.observe(out,{childList:true,subtree:true});enhance();fetch(BOTS_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(String(r.status));return r.json()}).then(v=>{if(Array.isArray(v)){bots=v;document.querySelectorAll('#out .find-locations').forEach(x=>x.remove());enhance()}}).catch(e=>console.warn('Item find-location ARC data unavailable; fallback retained',e))};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
