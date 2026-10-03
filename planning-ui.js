// My Planning: one user-facing flow over the existing local data.
(()=>{
  const root=document.getElementById('planningSection');if(!root)return;
  const missing=document.getElementById('planningMissing'),goalsPane=document.getElementById('planningGoals');
  const tabMissing=document.getElementById('planningTabMissing'),tabGoals=document.getElementById('planningTabGoals');
  const allToggle=document.getElementById('planningShowAll'),raidToggle=document.getElementById('planningRaidOnly');
  const status=document.getElementById('planningStatus');
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uiLang=()=>localStorage.getItem('arcUiLanguage')||((typeof lang!=='undefined'&&lang)||'en');
  const COPY={
    de:{missing:'Was fehlt mir?',goals:'Meine Ziele',showAll:'Alle benötigten Items',raidOnly:'Nur nächster Raid',empty:'Für deine aktiven Ziele fehlt aktuell nichts.',need:'benötigt',owned:'vorhanden',left:'fehlen',usage:'Wofür benötigt',stock:'Bestand ändern',find:'Fund hinzufügen',add:'Hinzufügen',workshop:'Werkbankstufen',quests:'Quests',personal:'Persönliche Sammelziele',search:'Item suchen …',amount:'Zielmenge',pause:'Pausieren',resume:'Fortsetzen',remove:'Entfernen',saved:'Gespeichert.',saveError:'Speichern fehlgeschlagen.',history:'Abgeschlossene Ziele',noPersonal:'Noch kein persönliches Sammelziel.'},
    en:{missing:'What am I missing?',goals:'My goals',showAll:'All required items',raidOnly:'Next raid only',empty:'Nothing is currently missing for your active goals.',need:'required',owned:'owned',left:'missing',usage:'Used for',stock:'Change stock',find:'Add find',add:'Add',workshop:'Workshop levels',quests:'Quests',personal:'Personal collection goals',search:'Search item …',amount:'Target amount',pause:'Pause',resume:'Resume',remove:'Remove',saved:'Saved.',saveError:'Saving failed.',history:'Completed goals',noPersonal:'No personal collection goal yet.'},
    fr:{missing:'Que me manque-t-il ?',goals:'Mes objectifs',showAll:'Tous les objets requis',raidOnly:'Prochain raid uniquement',empty:'Rien ne manque actuellement pour vos objectifs actifs.',need:'requis',owned:'possédé',left:'manquant',usage:'Utilisé pour',stock:'Modifier le stock',find:'Ajouter une trouvaille',add:'Ajouter',workshop:'Niveaux d’atelier',quests:'Quêtes',personal:'Objectifs personnels',search:'Rechercher un objet …',amount:'Quantité cible',pause:'Pause',resume:'Reprendre',remove:'Supprimer',saved:'Enregistré.',saveError:'Échec de l’enregistrement.',history:'Objectifs terminés',noPersonal:'Aucun objectif personnel.'},
    es:{missing:'¿Qué me falta?',goals:'Mis objetivos',showAll:'Todos los objetos necesarios',raidOnly:'Solo próxima incursión',empty:'Ahora mismo no falta nada para tus objetivos activos.',need:'necesario',owned:'disponible',left:'falta',usage:'Se necesita para',stock:'Cambiar existencias',find:'Añadir hallazgo',add:'Añadir',workshop:'Niveles de banco',quests:'Misiones',personal:'Objetivos personales',search:'Buscar objeto …',amount:'Cantidad objetivo',pause:'Pausar',resume:'Continuar',remove:'Eliminar',saved:'Guardado.',saveError:'Error al guardar.',history:'Objetivos completados',noPersonal:'Aún no hay objetivos personales.'}
  };
  const c=()=>COPY[uiLang()]||COPY.en;
  const name=id=>{const item=typeof itemById==='function'?itemById(id):null;return item&&typeof itemName==='function'?itemName(item):id.replaceAll('_',' ')};
  function saveStock(id,value,add=false){
    try{const next=Math.max(0,Math.floor(Number(value)||0));saveOwned(id,add?(Number(owned[id])||0)+next:next);status.textContent=c().saved;render()}catch{status.textContent=c().saveError}
  }
  function renderMissing(){
    const rows=window.RFTPlanning?.rows({all:allToggle.checked,raidOnly:raidToggle.checked})||[];
    if(!rows.length){missing.innerHTML=`<div class="planning-empty">${esc(c().empty)}</div>`;return}
    missing.innerHTML=rows.sort((a,b)=>name(a.itemId).localeCompare(name(b.itemId))).map(row=>`<article class="planning-item" data-plan-item="${esc(row.itemId)}"><div class="planning-item-head"><strong>${esc(name(row.itemId))}</strong><b>${row.missing} ${esc(c().left)}</b></div><div class="planning-counts"><span>${esc(c().need)} <b>${row.required}</b></span><span>${esc(c().owned)} <b>${row.owned}</b></span></div><details><summary>${esc(c().usage)}</summary><div>${row.reasons.map(esc).join('<br>')}</div></details><div class="planning-actions"><label>${esc(c().stock)}<input data-stock type="number" min="0" inputmode="numeric" value="${row.owned}"></label><label>${esc(c().find)}<input data-find type="number" min="0" inputmode="numeric" value="0"></label><button type="button" data-apply-find>${esc(c().add)}</button></div></article>`).join('');
  }
  function renderPersonal(){
    const box=document.getElementById('planningPersonalList'),personal=window.RFTPlanning?.personalGoals()||{};
    const entries=Object.values(personal);
    box.innerHTML=entries.length?entries.map(goal=>`<div class="planning-personal-row" data-personal="${esc(goal.itemId)}"><span><strong>${esc(name(goal.itemId))}</strong><small>${goal.target} · ${esc(goal.status)}</small></span><button data-personal-toggle type="button">${esc(goal.status==='paused'?c().resume:c().pause)}</button><button data-personal-remove type="button">${esc(c().remove)}</button></div>`).join(''):`<div class="planning-empty">${esc(c().noPersonal)}</div>`;
  }
  function render(){renderMissing();renderPersonal()}
  function show(which){const isMissing=which==='missing';missing.hidden=!isMissing;goalsPane.hidden=isMissing;tabMissing.setAttribute('aria-selected',String(isMissing));tabGoals.setAttribute('aria-selected',String(!isMissing));}
  tabMissing.addEventListener('click',()=>show('missing'));tabGoals.addEventListener('click',()=>show('goals'));
  allToggle.addEventListener('change',renderMissing);raidToggle.addEventListener('change',renderMissing);
  missing.addEventListener('change',e=>{const row=e.target.closest('[data-plan-item]');if(row&&e.target.matches('[data-stock]'))saveStock(row.dataset.planItem,e.target.value,false)});
  missing.addEventListener('click',e=>{const button=e.target.closest('[data-apply-find]');if(!button)return;const row=button.closest('[data-plan-item]'),input=row.querySelector('[data-find]');saveStock(row.dataset.planItem,input.value,true)});
  document.getElementById('planningPersonalAdd').addEventListener('click',()=>{
    const select=document.getElementById('planningPersonalItem'),amount=document.getElementById('planningPersonalAmount');
    if(!select.value)return;try{window.RFTPlanning.setPersonal(select.value,amount.value);status.textContent=c().saved;render()}catch{status.textContent=c().saveError}
  });
  document.getElementById('planningPersonalList').addEventListener('click',e=>{
    const row=e.target.closest('[data-personal]');if(!row)return;const personal=window.RFTPlanning.personalGoals()[row.dataset.personal];
    try{if(e.target.closest('[data-personal-remove]'))window.RFTPlanning.removePersonal(row.dataset.personal);else if(e.target.closest('[data-personal-toggle]'))window.RFTPlanning.setPersonal(row.dataset.personal,personal.target,personal.status==='paused'?'active':'paused');render()}catch{status.textContent=c().saveError}
  });
  function populateItems(){const select=document.getElementById('planningPersonalItem');if(!select||!Array.isArray(items)||!items.length)return;const current=select.value;select.innerHTML='<option value=""></option>'+items.slice().sort((a,b)=>itemName(a).localeCompare(itemName(b))).map(item=>`<option value="${esc(item.id)}">${esc(itemName(item))}</option>`).join('');select.value=current}
  window.addEventListener('planning-changed',render);window.addEventListener('raid-goals-completed',render);window.addEventListener('storage',render);
  document.addEventListener('click',()=>setTimeout(()=>{populateItems();render()},0));
  setTimeout(()=>{populateItems();render()},600);show('missing');
})();
