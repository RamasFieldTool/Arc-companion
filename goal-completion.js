// A collected material requirement is ready for confirmation, not proof of a completed quest.
(()=>{
  const COPY={
    de:{title:'Bereit zum Abschließen',ready:'Alle benötigten Items sind vorhanden.',finish:'Ziel abschließen',confirm:'Ziel wirklich abschließen?',consume:'Die folgenden Items werden vom vorhandenen Bestand abgezogen:',keep:'Der persönliche Sammelbedarf wird entfernt. Dein Bestand bleibt erhalten.',other:'Bestätige auch, dass alle weiteren Aufgaben und zusätzlichen Kosten erledigt sind.',done:'Ziel abgeschlossen. Die aktiven Listen wurden aktualisiert.',error:'Abschluss konnte nicht gespeichert werden.'},
    en:{title:'Ready to complete',ready:'All required items are available.',finish:'Complete goal',confirm:'Complete this goal?',consume:'These items will be deducted from owned stock:',keep:'The personal collection target will be removed. Your stock is kept.',other:'Also confirm that all other objectives and additional costs are complete.',done:'Goal completed. Active lists have been updated.',error:'Could not save completion.'},
    fr:{title:'Prêt à terminer',ready:'Tous les objets nécessaires sont disponibles.',finish:'Terminer l’objectif',confirm:'Terminer cet objectif ?',consume:'Ces objets seront déduits du stock :',keep:'Le besoin personnel sera retiré. Votre stock est conservé.',other:'Confirmez aussi que les autres tâches et coûts supplémentaires sont réglés.',done:'Objectif terminé. Les listes actives ont été actualisées.',error:'Impossible d’enregistrer.'},
    es:{title:'Listo para completar',ready:'Todos los objetos necesarios están disponibles.',finish:'Completar objetivo',confirm:'¿Completar este objetivo?',consume:'Estos objetos se descontarán del inventario:',keep:'Se eliminará la necesidad personal. Se conserva tu inventario.',other:'Confirma también que las demás tareas y costes adicionales están completados.',done:'Objetivo completado. Listas activas actualizadas.',error:'No se pudo guardar.'}
  };
  const c=()=>COPY[localStorage.getItem('arcUiLanguage')]||COPY[lang]||COPY.en;
  const panels=[];
  for(const anchor of [document.getElementById('nextRaidIntro'),document.getElementById('summary'),document.getElementById('goals'),document.getElementById('questsList')]){
    if(!anchor)continue;
    const panel=document.createElement('section');panel.className='goal-completion-panel';panel.hidden=true;
    anchor.before(panel);panels.push(panel);
  }
  const notice=document.createElement('p');notice.className='goal-completion-notice';notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');
  document.getElementById('nextRaidIntro')?.before(notice);
  const amount=n=>Math.max(0,Math.floor(Number(n)||0));
  const requirements=raw=>{
    const map=new Map();(raw||[]).forEach(r=>{if(r.itemId&&amount(r.quantity))map.set(r.itemId,(map.get(r.itemId)||0)+amount(r.quantity))});
    return [...map].map(([itemId,quantity])=>({itemId,quantity}));
  };
  const enough=rows=>rows.length>0&&rows.every(r=>amount(owned[r.itemId])>=r.quantity);
  const readRaid=()=>{try{return JSON.parse(localStorage.getItem('arcNextRaid')||'{}')}catch{return {}}};
  function candidates(){
    const result=[];
    goals.forEach(g=>(g.levels||[]).forEach(l=>{
      const id=key(g.id,l.level),rows=requirements(l.requirements);
      if(active[id]&&enough(rows))result.push({kind:'workshop',id,name:`${goalName(g)} · ${tr('level')} ${l.level}`,rows});
    }));
    quests.forEach(q=>{const rows=requirements(q.requiredItemIds);if(getQuestState(q.id)==='active'&&enough(rows))result.push({kind:'quest',id:q.id,name:questName(q),rows})});
    Object.entries(readRaid()).forEach(([id,e])=>{if(e?.personal===true&&amount(e.target)>0&&amount(owned[id])>=amount(e.target))result.push({kind:'personal',id,name:itemById(id)?itemName(itemById(id)):id,rows:[{itemId:id,quantity:amount(e.target)}]})});
    return result;
  }
  function render(){
    const all=candidates(),copy=c();
    for(const panel of panels){
      panel.hidden=!all.length;panel.replaceChildren();if(!all.length)continue;
      const title=document.createElement('h3');title.textContent=copy.title;panel.append(title);
      for(const entry of all){const row=document.createElement('div');row.className='goal-completion-row';const label=document.createElement('span');label.textContent=entry.name+' – '+copy.ready;const button=document.createElement('button');button.type='button';button.textContent=copy.finish;button.dataset.completeKind=entry.kind;button.dataset.completeId=entry.id;row.append(label,button);panel.append(row)}
    }
  }
  function finish(kind,id){
    const entry=candidates().find(e=>e.kind===kind&&e.id===id);if(!entry)return;
    const copy=c();
    const itemLines=entry.rows.map(r=>`${r.quantity} × ${itemById(r.itemId)?itemName(itemById(r.itemId)):r.itemId}`).join('\n');
    if(!window.confirm(`${copy.confirm}\n${entry.name}\n\n${kind==='personal'?copy.keep:copy.consume+'\n'+itemLines+'\n\n'+copy.other}`))return;
    // Recheck after confirmation and consume only this goal's material, preserving surplus.
    if(!candidates().some(e=>e.kind===kind&&e.id===id))return;
    const nextOwned={...owned},nextActive={...active},nextQuests={...questStates},nextRaid=readRaid();
    if(kind==='personal')delete nextRaid[id];
    else{
      entry.rows.forEach(r=>nextOwned[r.itemId]=amount(nextOwned[r.itemId])-r.quantity);
      if(kind==='workshop')delete nextActive[id];else nextQuests[id]='done';
    }
    const remaining=Object.create(null);
    goals.forEach(g=>(g.levels||[]).forEach(l=>{if(nextActive[key(g.id,l.level)])requirements(l.requirements).forEach(r=>remaining[r.itemId]=(remaining[r.itemId]||0)+r.quantity)}));
    quests.forEach(q=>{if(nextQuests[q.id]==='active')requirements(q.requiredItemIds).forEach(r=>remaining[r.itemId]=(remaining[r.itemId]||0)+r.quantity)});
    Object.entries(nextRaid).forEach(([itemId,e])=>{if(e?.personal!==true&&(!remaining[itemId]||amount(nextOwned[itemId])>=remaining[itemId]))delete nextRaid[itemId]});
    const writes={arcOwned:nextOwned,arcActiveGoals:nextActive,arcQuestStatus:nextQuests,arcNextRaid:nextRaid};
    const before=Object.fromEntries(Object.keys(writes).map(k=>[k,localStorage.getItem(k)]));
    try{Object.entries(writes).forEach(([k,v])=>localStorage.setItem(k,JSON.stringify(v)))}catch{
      try{Object.entries(before).forEach(([k,v])=>v===null?localStorage.removeItem(k):localStorage.setItem(k,v))}catch{}
      notice.textContent=copy.error;return;
    }
    Object.assign(owned,nextOwned);Object.keys(active).forEach(k=>delete active[k]);Object.assign(active,nextActive);Object.assign(questStates,nextQuests);
    window.dispatchEvent(new Event('raid-goals-completed'));
    drawGoals();drawQuestHeader();drawQuests();drawSummary();drawItems();render();notice.textContent=entry.name+' – '+copy.done;
  }
  document.addEventListener('click',event=>{const button=event.target.closest('[data-complete-kind]');if(button)finish(button.dataset.completeKind,button.dataset.completeId)});
  let timer;const schedule=()=>{clearTimeout(timer);timer=setTimeout(render,50)};
  for(const name of ['drawSummary','drawGoals','drawQuests']){
    const original=window[name];if(typeof original==='function')window[name]=function(...args){const result=original.apply(this,args);schedule();return result};
  }
  document.addEventListener('click',schedule);document.addEventListener('change',schedule);window.addEventListener('storage',schedule);render();
})();
