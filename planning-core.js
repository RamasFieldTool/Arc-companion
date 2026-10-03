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
      add(goal.itemId,goal.target,`Personal: ${count(goal.target)}`,{kind:'personal',id:goal.itemId});
    });
    return map;
  }

  function rows({all=false,raidOnly=false}={}){
    const req=requirementMapUnified();
    const stock=typeof owned!=='undefined'&&record(owned)?owned:read('arcOwned',{});
    const raid=read('arcNextRaid',{});
    return Object.entries(req).map(([itemId,entry])=>{
      const have=count(stock[itemId]),missing=Math.max(0,entry.total-have);
      const raidEntry=record(raid)?raid[itemId]:null;
      const priority=record(raidEntry)&&raidEntry.done!==true;
      return {itemId,required:entry.total,owned:have,missing,reasons:entry.reasons,goals:entry.goals,raidPriority:priority};
    }).filter(row=>(all||row.missing>0)&&(!raidOnly||row.raidPriority));
  }

  function setRaidPriority(itemId,selected){
    const current=read('arcNextRaid',{}),raid=record(current)?current:{};
    if(selected){const requirement=requirementMapUnified()[itemId];if(!requirement)return;raid[itemId]=record(raid[itemId])?{...raid[itemId],done:false}:{target:requirement.total,done:false,personal:false,found:0}}
    else delete raid[itemId];
    write('arcNextRaid',raid);window.dispatchEvent(new Event('raid-goals-completed'));window.dispatchEvent(new Event('planning-changed'));
  }
  function setPersonal(itemId,target,status='active'){
    const personal=personalGoals(),qty=count(target);if(!itemId||qty<1)throw new Error('Invalid personal goal');
    personal[itemId]={itemId,target:qty,status:['active','paused','done'].includes(status)?status:'active'};
    write(PERSONAL_KEY,personal);window.dispatchEvent(new Event('planning-changed'));
  }
  function removePersonal(itemId){const personal=personalGoals();delete personal[itemId];write(PERSONAL_KEY,personal);window.dispatchEvent(new Event('planning-changed'))}

  migrateLegacyPersonal();
  window.RFTPlanning={setRaidPriority,requirementMap:requirementMapUnified,rows,personalGoals,setPersonal,removePersonal,history:()=>read(HISTORY_KEY,[])};
})();
