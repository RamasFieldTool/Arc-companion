// V2.12.3 – clearer quest tracker hierarchy without changing quest data/state semantics.

const QUEST_UX={
  de:{details:'DETAILS',hideDetails:'DETAILS SCHLIESSEN',requiredShort:'BENÖTIGT',noMaterial:'Kein Materialbedarf',affectsNeed:'Fließt in Gesamtbedarf ein',personalProgress:'Persönliche Checkliste · wird auf diesem Gerät gespeichert und ändert den Queststatus nicht.',markObjective:'Quest-Schritt abhaken',saveFailed:'Der Quest-Schritt konnte auf diesem Gerät nicht gespeichert werden.'},
  en:{details:'DETAILS',hideDetails:'CLOSE DETAILS',requiredShort:'REQUIRED',noMaterial:'No material requirements',affectsNeed:'Included in total requirements',personalProgress:'Personal checklist · saved on this device and does not change quest status.',markObjective:'Mark quest step complete',saveFailed:'This quest step could not be saved on this device.'},
  fr:{details:'DÉTAILS',hideDetails:'FERMER LES DÉTAILS',requiredShort:'REQUIS',noMaterial:'Aucun besoin en matériaux',affectsNeed:'Inclus dans les besoins totaux',personalProgress:'Liste personnelle · enregistrée sur cet appareil, sans modifier le statut de la quête.',markObjective:'Marquer cette étape comme terminée',saveFailed:'Cette étape n’a pas pu être enregistrée sur cet appareil.'},
  es:{details:'DETALLES',hideDetails:'CERRAR DETALLES',requiredShort:'NECESARIO',noMaterial:'Sin materiales necesarios',affectsNeed:'Incluido en los requisitos totales',personalProgress:'Lista personal · se guarda en este dispositivo y no cambia el estado de la misión.',markObjective:'Marcar paso de misión como completado',saveFailed:'No se pudo guardar este paso en este dispositivo.'},
  it:{details:'DETTAGLI',hideDetails:'CHIUDI DETTAGLI',requiredShort:'RICHIESTO',noMaterial:'Nessun materiale richiesto',affectsNeed:'Incluso nei requisiti totali',personalProgress:'Elenco personale · salvato su questo dispositivo e non modifica lo stato della missione.',markObjective:'Segna il passaggio come completato',saveFailed:'Impossibile salvare questo passaggio su questo dispositivo.'}
};
function qx(k){const locale=window.RFTDataLabels?.language()||localStorage.getItem('arcUiLanguage')||lang;return QUEST_UX[locale]?.[k]||QUEST_UX.de[k]||k}

const QUEST_OBJECTIVE_PROGRESS_KEY='arcQuestObjectiveProgress';
const safeRecord=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
function readQuestObjectiveProgress(){
  try{
    const value=JSON.parse(localStorage.getItem(QUEST_OBJECTIVE_PROGRESS_KEY)||'{}');
    if(!safeRecord(value))return Object.create(null);
    const clean=Object.create(null);
    Object.entries(value).forEach(([questId,keys])=>{
      if(!questId||['__proto__','constructor','prototype'].includes(questId)||!Array.isArray(keys))return;
      const valid=keys.filter(key=>typeof key==='string'&&/^[a-f0-9]{16}-\d{1,5}$/.test(key));
      if(valid.length)clean[questId]=[...new Set(valid)];
    });
    return clean;
  }catch{return Object.create(null)}
}
let questObjectiveProgress=readQuestObjectiveProgress();
function stableObjectiveValue(value){
  if(Array.isArray(value))return value.map(stableObjectiveValue);
  if(safeRecord(value))return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stableObjectiveValue(value[key])]));
  return value;
}
function objectiveIdentity(value){
  const source=JSON.stringify(stableObjectiveValue(value));
  let first=2166136261,second=2246822519;
  for(let i=0;i<source.length;i++){
    const code=source.charCodeAt(i);
    first=Math.imul(first^code,16777619)>>>0;
    second=Math.imul(second^(code+i),3266489917)>>>0;
  }
  return `${first.toString(16).padStart(8,'0')}${second.toString(16).padStart(8,'0')}`;
}
function questObjectiveEntries(quest){
  const occurrences=new Map();
  return (quest.objectives||[]).map(raw=>{
    const identity=objectiveIdentity(raw),occurrence=occurrences.get(identity)||0;
    occurrences.set(identity,occurrence+1);
    return {label:text(raw),key:`${identity}-${occurrence}`};
  }).filter(entry=>entry.label);
}

function questCardV2115(x){
  const rawState=getQuestState(x.id);
  const st=['open','active','done'].includes(rawState)?rawState:'open';
  const objectives=questObjectiveEntries(x);
  // Frozen Trail 2.0 changed the photo interaction for these five existing quests.
  // This is a display-only hint: never change upstream objectives, quest IDs or saved progress.
  const cameraQuests=new Set(['the league','reduced to rubble','life of a pharmacist','battening down','groundbreaking']);
  const questIdentity=String(x.name?.en||x.en||x.id||'').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  const cameraHint=cameraQuests.has(questIdentity)?({
    de:'Frozen Trail 2.0: Für diese Quest werden jetzt Fotos mit einer Kamera benötigt. Prüfe die aktuellen Ziele im Spiel.',
    en:'Frozen Trail 2.0: This quest now requires camera photos. Check the current in-game objectives.',
    fr:'Frozen Trail 2.0 : cette quête demande désormais des photos avec un appareil photo. Vérifiez les objectifs dans le jeu.',
    es:'Frozen Trail 2.0: esta misión ahora requiere fotos con una cámara. Comprueba los objetivos en el juego.',
    it:'Frozen Trail 2.0: questa missione ora richiede foto con una fotocamera. Controlla gli obiettivi nel gioco.'
  }[window.RFTDataLabels?.language()||lang]||'This quest now requires camera photos.'):'';
  const required=questItemsText(x.requiredItemIds);
  const rewards=questItemsText(x.rewardItemIds);
  const granted=questItemsText(x.grantedItemIds);
  const reqCount=(x.requiredItemIds||[]).reduce((sum,r)=>sum+(Number(r.quantity)||0),0);
  const questId=escapeHtml(String(x.id??''));
  return `<article class="quest-card quest-${st}">
    <div class="quest-card-head">
      <div class="quest-title-block">
        <div class="quest-title-row"><h3>${escapeHtml(questName(x))}</h3><span class="quest-status-chip">${escapeHtml(tr(st))}</span></div>
        ${x.trader?`<div class="quest-trader">${escapeHtml(tr('trader'))}: ${escapeHtml(x.trader)}</div>`:''}
        <div class="quest-material-line ${required?'has-required':''}">
          <b>${escapeHtml(qx('requiredShort'))}</b><span>${required?questItemsHtml(x.requiredItemIds):escapeHtml(qx('noMaterial'))}</span>
          ${st==='active'&&required?`<small>${escapeHtml(qx('affectsNeed'))}</small>`:''}
        </div>
      </div>
      <div class="quest-state" role="group" aria-label="Quest status">
        <button type="button" data-qid="${questId}" data-state="open" class="${st==='open'?'selected':''}">${escapeHtml(tr('open'))}</button>
        <button type="button" data-qid="${questId}" data-state="active" class="${st==='active'?'selected':''}">${escapeHtml(tr('active'))}</button>
        <button type="button" data-qid="${questId}" data-state="done" class="${st==='done'?'selected':''}">${escapeHtml(tr('done'))}</button>
      </div>
    </div>
    <details class="quest-details">
      <summary><span>${escapeHtml(qx('details'))}</span><small>${objectives.length} ${escapeHtml(tr('objectives').toLowerCase())}${reqCount?` · ${reqCount} ${escapeHtml(qx('requiredShort').toLowerCase())}`:''}</small></summary>
      <div class="quest-details-body">
        ${cameraHint?`<div class="quest-section"><b>Frozen Trail 2.0</b><p>${escapeHtml(cameraHint)}</p></div>`:''}
        ${objectives.length?`<div class="quest-section quest-objectives-section"><b>${escapeHtml(tr('objectives'))}</b><p class="quest-objective-note" role="status" aria-live="polite">${escapeHtml(qx('personalProgress'))}</p><ul class="quest-objectives">${objectives.map(o=>{const checked=questObjectiveProgress[x.id]?.includes(o.key)||false;return `<li><label class="quest-objective${checked?' is-complete':''}"><input type="checkbox" data-quest-objective="true" data-quest-id="${questId}" data-objective-key="${escapeHtml(o.key)}" aria-label="${escapeHtml(`${qx('markObjective')}: ${o.label}`)}"${checked?' checked':''}><span>${escapeHtml(o.label)}</span></label></li>`}).join('')}</ul></div>`:''}
        <div class="quest-grid">
          ${granted?`<div class="quest-mini"><b>${escapeHtml(tr('granted'))}</b><span>${questItemsHtml(x.grantedItemIds)}</span></div>`:''}
          <div class="quest-mini"><b>${escapeHtml(tr('rewards'))}</b><span>${rewards?questItemsHtml(x.rewardItemIds):escapeHtml(tr('noRewards'))}</span></div>
        </div>
      </div>
    </details>
  </article>`;
}

questCard=questCardV2115;

// Objective checks are private local notes; they do not change quest completion or planning.
questsList.addEventListener('change',event=>{
  const input=event.target.closest('input[data-quest-objective="true"]');
  if(!input)return;
  const questId=input.dataset.questId,key=input.dataset.objectiveKey;
  if(!questId||['__proto__','constructor','prototype'].includes(questId)||!/^[a-f0-9]{16}-\d{1,5}$/.test(key||''))return;
  const next=Object.assign(Object.create(null),questObjectiveProgress),keys=new Set(next[questId]||[]);
  if(input.checked)keys.add(key);else keys.delete(key);
  if(keys.size)next[questId]=[...keys];else delete next[questId];
  try{
    localStorage.setItem(QUEST_OBJECTIVE_PROGRESS_KEY,JSON.stringify(next));
    questObjectiveProgress=next;
    input.closest('.quest-objective')?.classList.toggle('is-complete',input.checked);
    const note=input.closest('.quest-objectives-section')?.querySelector('.quest-objective-note');
    if(note){note.textContent=qx('personalProgress');note.classList.remove('is-error')}
  }catch{
    input.checked=!input.checked;
    const note=input.closest('.quest-objectives-section')?.querySelector('.quest-objective-note');
    if(note){note.textContent=qx('saveFailed');note.classList.add('is-error')}
  }
});

// Own the compact quest summary directly instead of wrapping the legacy header renderer.
drawQuestHeader=function(){
  if(!questSummary) return;
  questToggleLabel.textContent=questDrawer.open?tr('hide'):tr('show');
  if(!quests.length){
    questSummary.textContent=questLoadError?tr('questLoadError'):tr('questSummary');
    return;
  }
  const openN=quests.filter(x=>getQuestState(x.id)==='open').length;
  const activeN=quests.filter(x=>getQuestState(x.id)==='active').length;
  const doneN=quests.filter(x=>getQuestState(x.id)==='done').length;
  questSummary.textContent=lang==='de'
    ? `${activeN} aktiv · ${openN} offen · ${doneN} erledigt`
    : `${activeN} active · ${openN} open · ${doneN} done`;
};
