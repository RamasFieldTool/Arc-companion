// Unified planning core: one read-only calculation for workshop, quests, personal goals and raid priority.
(()=>{
  const PERSONAL_KEY='arcPlanningPersonal';
  const HISTORY_KEY='arcPlanningHistory';
  const MIGRATION_KEY='arcPlanningMigrationV1';
  const record=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const count=value=>Math.max(0,Math.floor(Number(value)||0));
  const read=(key,fallback={})=>{try{const value=JSON.parse(localStorage.getItem(key)||'null');return value??fallback}catch{return fallback}};
  const write=(key,value)=>{localStorage.setItem(key,JSON.stringify(value));return value};

  function migrateLegacyPersonal(){
    if(localStorage.getItem(MIGRATION_KEY)==='1')return;
    const raid=read('arcNextRaid',{}), personal=read(PERSONAL_KEY,{});
    if(record(raid)&&record(personal)){
      Object.entries(raid).forEach(([itemId,entry])=>{
        if(!record(entry)||entry.personal!==true||personal[itemId])return;
        const target=count(entry.target);
        if(target<1)return;
        // Legacy found/done is intentionally not converted into stock or completion.
        personal[itemId]={itemId,target,status:'active',source:'legacy-raid'};
      });
      write(PERSONAL_KEY,personal);
    }
    localStorage.setItem(MIGRATION_KEY,'1');
  }

  function personalGoals(){
    const value=read(PERSONAL_KEY,{});
    return record(value)?value:{};
  }

  function requirementMapUnified(){
    const map={};
    const add=(itemId,quantity,reason,goal)=>{
      const qty=count(quantity);if(!itemId||!qty)return;
      if(!map[itemId])map[itemId]={total:0,reasons:[],goals:[]};
      map[itemId].total+=qty;map[itemId].reasons.push(reason);map[itemId].goals.push(goal);
    };
    if(Array.isArray(window.goals))window.goals.forEach(goal=>(goal.levels||[]).forEach(level=>{
      const id=typeof key==='function'?key(goal.id,level.level):`${goal.id}:${level.level}`;
      if(!window.active?.[id])return;
      (level.requirements||[]).forEach(req=>add(req.itemId,req.quantity,`${typeof goalName==='function'?goalName(goal):goal.id} ${typeof tr==='function'?tr('level'):'Level'} ${level.level}: ${req.quantity}`,{kind:'workshop',id}));
    }));
    if(Array.isArray(window.quests))window.quests.forEach(quest=>{
      if(typeof getQuestState!=='function'||getQuestState(quest.id)!=='active')return;
      (quest.requiredItemIds||[]).forEach(req=>add(req.itemId,req.quantity,`${typeof tr==='function'?tr('questReason'):'Quest'} – ${typeof questName==='function'?questName(quest):quest.id}: ${req.quantity}`,{kind:'quest',id:quest.id}));
    });
    Object.values(personalGoals()).forEach(goal=>{
      if(!record(goal)||goal.status!=='active'||!goal.itemId)return;
      add(goal.itemId,goal.target,`Personal: ${count(goal.target)}`,{kind:'personal',id:goal.itemId});
    });
    return map;
  }

  function rows({all=false,raidOnly=false}={}){
    const req=requirementMapUnified();
    const stock=window.owned||read('arcOwned',{});
    const raid=read('arcNextRaid',{});
    return Object.entries(req).map(([itemId,entry])=>{
      const have=count(stock[itemId]);const missing=Math.max(0,entry.total-have);
      const priority=record(raid)&&record(raid[itemId])&&raid[itemId].personal!==true;
      return {itemId,required:entry.total,owned:have,missing,reasons:entry.reasons,goals:entry.goals,raidPriority:priority};
    }).filter(row=>(all||row.missing>0)&&(!raidOnly||row.raidPriority));
  }

  function setPersonal(itemId,target,status='active'){
    const goals=personalGoals();const qty=count(target);
    if(!itemId||qty<1)throw new Error('Invalid personal goal');
    goals[itemId]={itemId,target:qty,status:['active','paused','done'].includes(status)?status:'active'};
    write(PERSONAL_KEY,goals);window.dispatchEvent(new Event('planning-changed'));
  }
  function removePersonal(itemId){const goals=personalGoals();delete goals[itemId];write(PERSONAL_KEY,goals);window.dispatchEvent(new Event('planning-changed'))}

  migrateLegacyPersonal();
  window.RFTPlanning={requirementMap:requirementMapUnified,rows,personalGoals,setPersonal,removePersonal,history:()=>read(HISTORY_KEY,[])};
})();
