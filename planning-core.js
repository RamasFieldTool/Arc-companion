// Unified planning core: one calculation for workshop, quests and personal goals.
(()=>{
  const PERSONAL_KEY='arcPlanningPersonal',HISTORY_KEY='arcPlanningHistory',MIGRATION_KEY='arcPlanningMigrationV2';
  const record=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const count=value=>Math.max(0,Math.floor(Number(value)||0));
  const read=(key,fallback={})=>{try{const value=JSON.parse(localStorage.getItem(key)||'null');return value??fallback}catch{return fallback}};
  const write=(key,value)=>{localStorage.setItem(key,JSON.stringify(value));return value};
  const stock=()=>typeof owned!=='undefined'&&record(owned)?owned:read('arcOwned',{});
  const dispatch=()=>window.dispatchEvent(new Event('planning-changed'));
  function history(){const value=read(HISTORY_KEY,[]);return Array.isArray(value)?value:[]}
  function addHistory(entry){const list=history();list.unshift({...entry,at:new Date().toISOString()});write(HISTORY_KEY,list.slice(0,250))}
  function personalGoals(){const value=read(PERSONAL_KEY,{});return record(value)?value:{}}
  function migrateLegacyPersonal(){
    const raid=read('arcNextRaid',{}),personal=personalGoals();let changed=false;
    if(record(raid))Object.entries(raid).forEach(([itemId,entry])=>{
      if(!record(entry)||entry.personal!==true||personal[itemId])return;
      const target=count(entry.target);if(target<1)return;
      personal[itemId]={itemId,target,status:entry.done===true?'done':'active',source:'legacy-raid'};changed=true;
    });
    if(changed)write(PERSONAL_KEY,personal);
    localStorage.setItem(MIGRATION_KEY,'1');
  }
  function requirementMapUnified(){
    const map={};
    const add=(itemId,quantity,reason,goal)=>{const qty=count(quantity);if(!itemId||!qty)return;if(!map[itemId])map[itemId]={total:0,reasons:[],goals:[]};map[itemId].total+=qty;map[itemId].reasons.push(reason);map[itemId].goals.push(goal)};
    if(typeof goals!=='undefined'&&Array.isArray(goals))goals.forEach(goal=>(goal.levels||[]).forEach(level=>{const id=key(goal.id,level.level);if(!active[id])return;(level.requirements||[]).forEach(req=>add(req.itemId,req.quantity,`${goalName(goal)} ${tr('level')} ${level.level}: ${req.quantity}`,{kind:'workshop',id}))}));
    if(typeof quests!=='undefined'&&Array.isArray(quests))quests.forEach(quest=>{if(getQuestState(quest.id)!=='active')return;(quest.requiredItemIds||[]).forEach(req=>add(req.itemId,req.quantity,`${tr('questReason')} – ${questName(quest)}: ${req.quantity}`,{kind:'quest',id:quest.id}))});
    Object.values(personalGoals()).forEach(goal=>{if(!record(goal)||goal.status!=='active'||!goal.itemId)return;add(goal.itemId,goal.target,`Personal: ${count(goal.target)}`,{kind:'personal',id:goal.itemId})});
    return map;
  }
  function rows({all=false}={}){const req=requirementMapUnified(),have=stock();return Object.entries(req).map(([itemId,entry])=>{const ownedCount=count(have[itemId]),missing=Math.max(0,entry.total-ownedCount);return{itemId,required:entry.total,owned:ownedCount,missing,reasons:entry.reasons,goals:entry.goals}}).filter(row=>all||row.missing>0)}
  function setPersonal(itemId,target,status='active',{allowReplace=false}={}){
    const personal=personalGoals(),qty=count(target);if(!itemId||qty<1)throw new Error('Invalid personal goal');
    if(personal[itemId]&&!allowReplace)throw new Error('Personal goal already exists');
    const nextStatus=['active','paused','done'].includes(status)?status:'active';personal[itemId]={...personal[itemId],itemId,target:qty,status:nextStatus};write(PERSONAL_KEY,personal);dispatch();return personal[itemId]
  }
  function updatePersonal(itemId,target){const personal=personalGoals();if(!personal[itemId])throw new Error('Personal goal not found');return setPersonal(itemId,target,personal[itemId].status,{allowReplace:true})}
  function setPersonalStatus(itemId,status){const personal=personalGoals();if(!personal[itemId])throw new Error('Personal goal not found');return setPersonal(itemId,personal[itemId].target,status,{allowReplace:true})}
  function completeReachedPersonal(){
    const personal=personalGoals(),have=stock(),completed=[];let changed=false;
    Object.values(personal).forEach(goal=>{if(!record(goal)||goal.status!=='active'||!goal.itemId)return;if(count(have[goal.itemId])<count(goal.target))return;goal.status='done';goal.completedAt=new Date().toISOString();completed.push({...goal});addHistory({kind:'personal-completed',itemId:goal.itemId,target:count(goal.target)});changed=true});
    if(changed){write(PERSONAL_KEY,personal);dispatch()}return completed
  }
  function removePersonal(itemId){const personal=personalGoals(),previous=personal[itemId];if(!previous)return null;delete personal[itemId];write(PERSONAL_KEY,personal);addHistory({kind:'personal-removed',goal:previous});dispatch();return previous}
  function restorePersonal(goal){if(!record(goal)||!goal.itemId)return;const personal=personalGoals();personal[goal.itemId]=goal;write(PERSONAL_KEY,personal);dispatch()}
  migrateLegacyPersonal();
  window.RFTPlanning={requirementMap:requirementMapUnified,rows,personalGoals,setPersonal,updatePersonal,setPersonalStatus,completeReachedPersonal,removePersonal,restorePersonal,history};
})();
