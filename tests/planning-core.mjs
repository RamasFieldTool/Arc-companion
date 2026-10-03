import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=await readFile(new URL('../planning-core.js',import.meta.url),'utf8');
function app(seed={}){
  const values=new Map(Object.entries(seed));let failKey=null;
  const stock=JSON.parse(values.get('arcOwned')||'{}');
  const context=vm.createContext({owned:stock,goals:[],active:{},quests:[{id:'quest',requiredItemIds:[{itemId:'cable',quantity:5}]}],getQuestState:()=> 'active',questName:()=> 'Quest',tr:()=> 'Quest',Event:class {},window:{dispatchEvent(){}},localStorage:{getItem:k=>values.get(k)??null,setItem(k,v){if(k===failKey){failKey=null;throw new Error('quota')}values.set(k,String(v))},removeItem:k=>values.delete(k)}});
  vm.runInContext(source,context);
  return {api:context.window.RFTPlanning,values,stock,fail:k=>failKey=k};
}
const seed=()=>({arcPlanningMigrationV1:'1',arcOwned:JSON.stringify({cable:2})});
let a=app(seed());a.api.setPersonal('cable',10);
let row=a.api.rows({all:true})[0];assert.equal(row.required,15);assert.equal(row.owned,2);assert.equal(row.missing,13);
a.api.setPersonal('cable',10,'paused');assert.equal(a.api.rows({all:true})[0].required,5);
a.api.setPersonal('cable',10);a.api.commitStock({cable:10});assert.equal(a.api.personalGoals().cable.status,'done');assert.equal(a.api.rows({all:true})[0].required,5);
a.api.commitStock({cable:0});assert.equal(a.api.personalGoals().cable.status,'done');
a=app({arcPlanningMigrationV1:'1'});a.api.setPersonal('cable',2);a.api.commitStock({cable:3});assert.equal(a.stock.cable,3);assert.equal(a.api.personalGoals().cable.status,'done');
a=app(Object.fromEntries(a.values));assert.equal(a.api.personalGoals().cable.status,'done');assert.equal(a.stock.cable,3);
a.api.setPersonal('cable',2);assert.equal(a.api.personalGoals().cable.status,'done');
console.log('PASS shared requirement, overshoot, completion, reload, downward correction and already-owned target');
a=app(seed());a.api.setPersonal('cable',10);const before=JSON.stringify([...a.values]);a.fail('arcPlanningPersonal');assert.throws(()=>a.api.commitStock({cable:10}));assert.equal(JSON.stringify([...a.values]),before);assert.equal(a.stock.cable,2);
for(const qty of [-1,0,1.5,Infinity,'bad'])assert.throws(()=>a.api.setPersonal('cable',qty));
console.log('PASS stock/completion save failure rolls back both storage and in-memory stock; invalid targets rejected');
a=app({arcOwned:'{"cable":2}',arcNextRaid:JSON.stringify({cable:{personal:true,target:10,found:9,done:true},other:{target:5,done:false}})});
assert.equal(a.stock.cable,2);assert.equal(a.api.personalGoals().cable.status,'active');assert.equal(a.api.personalGoals().other,undefined);
const migrated=JSON.stringify(a.api.personalGoals());a=app(Object.fromEntries(a.values));assert.equal(JSON.stringify(a.api.personalGoals()),migrated);
console.log('PASS legacy migration ignores legacy progress and nonpersonal targets and runs once');
