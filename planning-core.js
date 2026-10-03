// Unified planning core: one calculation for workshop, quests, personal goals and raid priority.
(()=>{
  const PERSONAL_KEY='arcPlanningPersonal';
  const HISTORY_KEY='arcPlanningHistory';
  const MIGRATION_KEY='arcPlanningMigrationV1';
  const record=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const count=value=>Math.max(0,Math.floor(Number(value)||0));
  const read=(storageKey,fallback={})=>{try{const value=JSON.parse(localStorage.getItem(storageKey)||'null');return value??fallback}catch{return fallback}};
  const write=(storageKey,value)=>{localStorage.setItem(storageKey,JSON.stringify(value));return value};

  function migrateLegacyPersonal(){
    if(localStorage.getItem(MIGRATION_KEY)==='1')return;
    const raid=read('arcNextRaid',{}), personal=read(PERSONAL_KEY,{});
    if(record(raid)&&record(personal)){
      Object.entries(raid).forEach(([itemId,entry])=>{
        if(!record(entry)||entry.personal!==true||personal[itemId])return;
        const target=count(entry.target);if(target<1)return;
        // Legacy found/done is deliberately not converted to stock or completion.
        personal[itemId]={itemId,target,status:'active',source:'legacy-raid'};
      });
      write(PERSONAL_KEY,personal);
    }
    localStorage.setItem(MIGRATION_KEY,'1');
  }
  function personalGoals(){const value=read(PERSONAL_KEY,{});return record(value)?value:{}}

  function requirementMapUnified(){
    const map={};
    const add=(itemId,quantity,reason,goal)=>{
      const qty=count(quantity);if(!itemId||!qty)return;
      if(!map[itemId])map[itemId]={total:0,reasons:[],goals:[]};
      map[itemId].total+=qty;map[itemId].reasons.push(reason);map[itemId].goals.push(goal);
    };
    if(typeof goals!=='undefined'&&Array.isArray(goals))goals.forEach(goal=>(goal.levels||[]).forEach(level=>{
      const id=key(goal.id,level.level);if(!active[id])return;
      (level.requirements||[]).forEach(req=>add(req.itemId,req.quantity,`${goalName(goal)} ${tr('level')} ${level.level}: ${req.quantity}`,{kind:'workshop',id}));
    }));
    if(typeof quests!=='undefined'&&Array.isArray(quests))quests.forEach(quest=>{
      if(getQuestState(quest.id)!=='active')return;
      (quest.requiredItemIds||[]).forEach(req=>add(req.itemId,req.quantity,`${tr('questReason')} – ${questName(quest)}: ${req.quantity}`,{kind:'quest',id:quest.id}));
    });
    Object.values(personalGoals()).forEach(goal=>{
      if(!record(goal)||goal.status!=='active'||!goal.itemId)return;
      const label={de:'Sammelziel',en:'Collection goal',fr:'Objectif de collecte',es:'Objetivo de colección',it:'Obiettivo di raccolta'}[localStorage.getItem('arcUiLanguage')]||'Collection goal';
      add(goal.itemId,goal.target,`${label}: ${count(goal.target)}`,{kind:'personal',id:goal.itemId});
    });
    return map;
  }

  function rows({all=false}={}){
    const req=requirementMapUnified();
    const stock=typeof owned!=='undefined'&&record(owned)?owned:read('arcOwned',{});
    return Object.entries(req).map(([itemId,entry])=>{
      const have=count(stock[itemId]),missing=Math.max(0,entry.total-have);
      return {itemId,required:entry.total,owned:have,missing,reasons:entry.reasons,goals:entry.goals};
    }).filter(row=>(all||row.missing>0));
  }

  function setPersonal(itemId,target,status='active'){
    const personal=personalGoals(),qty=Number(target);if(!itemId||['__proto__','constructor','prototype'].includes(itemId)||!Number.isSafeInteger(qty)||qty<1||qty>999999)throw new Error('Invalid personal goal');
    const stock=typeof owned!=='undefined'?owned:read('arcOwned',{});
    const nextStatus=status==='active'&&count(stock[itemId])>=qty?'done':status;
    personal[itemId]={itemId,target:qty,status:['active','paused','done'].includes(nextStatus)?nextStatus:'active'};
    write(PERSONAL_KEY,personal);window.dispatchEvent(new Event('planning-changed'));return personal[itemId];
  }
  function removePersonal(itemId){const personal=personalGoals();delete personal[itemId];write(PERSONAL_KEY,personal);window.dispatchEvent(new Event('planning-changed'))}

  // Stock and reached collection goals must persist together. Completion never consumes stock.
  function commitStock(next){
    if(!record(next)||Object.values(next).some(value=>!Number.isSafeInteger(value)||value<0||value>1000000000))throw new Error('Invalid stock');
    const personal=personalGoals(),completed=[];
    for(const goal of Object.values(personal)){
      if(record(goal)&&goal.status==='active'&&count(goal.target)>0&&count(next[goal.itemId])>=count(goal.target)){
        goal.status='done';completed.push({...goal});
      }
    }
    const writes={arcOwned:next};if(completed.length)writes[PERSONAL_KEY]=personal;
    const before=Object.fromEntries(Object.keys(writes).map(k=>[k,localStorage.getItem(k)]));
    try{Object.entries(writes).forEach(([k,v])=>write(k,v))}catch(error){
      Object.entries(before).forEach(([k,v])=>{if(localStorage.getItem(k)!==v){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}});
      throw error;
    }
    if(typeof owned!=='undefined'){Object.keys(owned).forEach(k=>delete owned[k]);Object.assign(owned,next)}
    return completed;
  }
  migrateLegacyPersonal();
  window.RFTPlanning={requirementMap:requirementMapUnified,rows,personalGoals,setPersonal,removePersonal,commitStock,history:()=>read(HISTORY_KEY,[])};
})();
