const q=document.querySelector('#q');
const out=document.querySelector('#out');
const status=document.querySelector('#status');
const goalsEl=document.querySelector('#goals');
const summaryEl=document.querySelector('#summary');

let items=[],goals=[];
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const owned=JSON.parse(localStorage.getItem('arcOwned')||'{}');
const active=JSON.parse(localStorage.getItem('arcActiveGoals')||'{}');

function itemById(id){return items.find(x=>x.id===id)}

function key(goalId,level){return `${goalId}:${level}`}

function requirementMap(){
  const map={};
  goals.forEach(g=>g.levels.forEach(l=>{
    if(!active[key(g.id,l.level)]) return;
    l.requirements.forEach(r=>{
      if(!map[r.itemId]) map[r.itemId]={total:0,reasons:[]};
      map[r.itemId].total+=r.quantity;
      map[r.itemId].reasons.push(`${g.de} Stufe ${l.level}: ${r.quantity}`);
    });
  }));
  return map;
}

function saveOwned(id,val){
  owned[id]=Math.max(0,Number(val)||0);
  localStorage.setItem('arcOwned',JSON.stringify(owned));
  drawAll();
}

function toggleGoal(k,checked){
  if(checked) active[k]=true; else delete active[k];
  localStorage.setItem('arcActiveGoals',JSON.stringify(active));
  drawAll();
}

function drawGoals(){
  goalsEl.innerHTML=goals.map(g=>`
    <div class="goalbox">
      <div class="goalhead">${g.de}</div>
      <div class="levelrow">
        ${g.levels.map(l=>`
          <label class="levelbtn">
            <input type="checkbox" data-key="${key(g.id,l.level)}" ${active[key(g.id,l.level)]?'checked':''}>
            Stufe ${l.level}
          </label>`).join('')}
      </div>
    </div>`).join('');
  goalsEl.querySelectorAll('input[type=checkbox]').forEach(el=>{
    el.addEventListener('change',e=>toggleGoal(e.target.dataset.key,e.target.checked));
  });
}

function drawSummary(){
  const req=requirementMap();
  const entries=Object.entries(req);
  if(!entries.length){
    summaryEl.innerHTML='<div class="empty">Noch kein Ausbauziel aktiviert.</div>';
    return;
  }
  summaryEl.innerHTML=entries.map(([id,r])=>{
    const i=itemById(id);
    const name=i?i.de:id.replaceAll('_',' ');
    const have=owned[id]||0;
    const missing=Math.max(0,r.total-have);
    return `<div class="sumrow">
      <div>
        <div class="sumname">${name}</div>
        <div class="summeta">Gesamt ${r.total} · vorhanden ${have} · fehlen ${missing}</div>
        <div class="summeta">${r.reasons.join(' · ')}</div>
      </div>
      <input class="qty" type="number" min="0" value="${have}" data-id="${id}" aria-label="Besitz ${name}">
    </div>`;
  }).join('');
  summaryEl.querySelectorAll('.qty').forEach(el=>el.addEventListener('input',e=>saveOwned(e.target.dataset.id,e.target.value)));
}

function goalDecision(i){
  const req=requirementMap()[i.id];
  if(!req) return `<div class="need free">FREI – für deine aktiven Ziele aktuell nicht benötigt</div>`;
  const have=owned[i.id]||0;
  const missing=Math.max(0,req.total-have);
  if(missing===0){
    return `<div class="need ok">ZIEL ERFÜLLT – du hast genug<div class="reasons">${req.reasons.join(' · ')}</div></div>`;
  }
  return `<div class="need keep">BEHALTEN – dir fehlen insgesamt noch ${missing} von ${req.total}<div class="reasons">${req.reasons.join(' · ')}</div></div>`;
}

function drawItems(){
  const x=norm(q.value.trim());
  const r=x?items.filter(i=>norm(i.de).includes(x)||norm(i.en).includes(x)):items;
  status.textContent=`${r.length} von ${items.length} Datensätzen`;
  out.innerHTML=r.length?r.map(i=>`<article class="card">
    <h2>${i.de}</h2><div class="en">${i.en}</div>
    <div class="facts">
      <span class="tag">${i.rarity}</span><span class="tag">Wert ${i.value}</span>
      <span class="tag">${i.weight} kg</span><span class="tag">Stack ${i.stack}</span>
    </div>
    <div class="use"><strong>Verwendung:</strong> ${i.use}<br><strong>Recycling:</strong> ${i.recycle}</div>
    ${goalDecision(i)}
  </article>`).join(''):'<div class="empty">Kein Treffer.</div>';
}

function drawAll(){drawGoals();drawSummary();drawItems()}
q.addEventListener('input',drawItems);

Promise.all([
  fetch('items.json?v=23',{cache:'no-store'}).then(r=>r.json()),
  fetch('goals.json?v=23',{cache:'no-store'}).then(r=>r.json())
]).then(([i,g])=>{
  items=i;goals=g;drawAll();
}).catch(()=>status.textContent='Daten konnten nicht geladen werden.');