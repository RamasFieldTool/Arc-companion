const q=document.querySelector('#q');
const out=document.querySelector('#out');
const status=document.querySelector('#status');
const goalSel=document.querySelector('#goal');
const levelSel=document.querySelector('#level');
const goalReq=document.querySelector('#goalReq');

let items=[],goals=[];
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const owned=JSON.parse(localStorage.getItem('arcOwned')||'{}');

function itemById(id){return items.find(x=>x.id===id)}
function currentGoal(){return goals.find(g=>g.id===goalSel.value)}
function currentLevel(){
  const g=currentGoal();
  return g?.levels.find(l=>String(l.level)===levelSel.value);
}
function saveOwned(id,val){
  owned[id]=Math.max(0,Number(val)||0);
  localStorage.setItem('arcOwned',JSON.stringify(owned));
  draw();
  drawGoal();
}
function goalNeeds(itemId){
  const l=currentLevel();
  if(!l) return null;
  const r=l.requirements.find(x=>x.itemId===itemId);
  return r||null;
}
function goalDecision(i){
  const need=goalNeeds(i.id);
  if(!need) return `<div class="need free">FREI – für dieses aktive Ziel nicht benötigt</div>`;
  const have=owned[i.id]||0;
  const missing=Math.max(0,need.quantity-have);
  if(missing===0) return `<div class="need ok">ZIEL ERFÜLLT – du hast genug</div>`;
  return `<div class="need keep">BEHALTEN – dir fehlen noch ${missing} von ${need.quantity}</div>`;
}
function draw(){
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
function drawGoal(){
  const l=currentLevel();
  if(!l){goalReq.innerHTML='';return}
  goalReq.innerHTML=l.requirements.length?l.requirements.map(r=>{
    const i=itemById(r.itemId);
    const name=i?i.de:r.itemId.replaceAll('_',' ');
    const have=owned[r.itemId]||0;
    const miss=Math.max(0,r.quantity-have);
    return `<div class="req">
      <div><div class="reqname">${name}</div><div class="reqmeta">Benötigt ${r.quantity} · fehlen ${miss}</div></div>
      <input class="qty" type="number" min="0" value="${have}" data-id="${r.itemId}" aria-label="Besitz ${name}">
    </div>`;
  }).join(''):'<div class="empty">Für diese Stufe sind keine Item-Anforderungen hinterlegt.</div>';
  goalReq.querySelectorAll('.qty').forEach(el=>el.addEventListener('input',e=>saveOwned(e.target.dataset.id,e.target.value)));
}
function fillLevels(){
  const g=currentGoal();
  levelSel.innerHTML=g.levels.map(l=>`<option value="${l.level}">Stufe ${l.level}</option>`).join('');
  const firstWithReq=g.levels.find(l=>l.requirements.length)||g.levels[0];
  if(firstWithReq) levelSel.value=String(firstWithReq.level);
  drawGoal();draw();
}
q.addEventListener('input',draw);
goalSel.addEventListener('change',fillLevels);
levelSel.addEventListener('change',()=>{drawGoal();draw()});

Promise.all([
  fetch('items.json?v=22').then(r=>r.json()),
  fetch('goals.json?v=22').then(r=>r.json())
]).then(([i,g])=>{
  items=i;goals=g;
  goalSel.innerHTML=goals.map(x=>`<option value="${x.id}">${x.de}</option>`).join('');
  fillLevels();
}).catch(()=>status.textContent='Daten konnten nicht geladen werden.');