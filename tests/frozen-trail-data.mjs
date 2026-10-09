import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const context={window:{},structuredClone};
vm.runInNewContext(await readFile(new URL('../frozen-trail-data.js',import.meta.url),'utf8'),context);
const extend=context.window.RFTFrozenTrailData.extend;
const sourceItems=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const sourceGoals=JSON.parse(await readFile(new URL('../goals.json',import.meta.url),'utf8'));
const before=JSON.stringify([sourceItems,sourceGoals]);
const result=extend(sourceItems,sourceGoals);
assert.equal(JSON.stringify([sourceItems,sourceGoals]),before);
assert.equal(new Set(result.items.map(i=>i.id)).size,result.items.length);
for(const goal of result.goals.filter(g=>g.id.startsWith('rft_')))for(const level of goal.levels)for(const req of level.requirements)assert.ok(result.items.some(i=>i.id===req.itemId),req.itemId);
assert.equal(JSON.stringify(extend(result.items,result.goals)),JSON.stringify(result));
const upstream={id:'upstream-planks',name:{en:'Planks',de:'Official translation'},value:123,recipe:{future:9}};
const future=extend([upstream],[]);
assert.equal(future.items.filter(i=>i.name?.en==='Planks').length,1);
assert.deepEqual(JSON.parse(JSON.stringify(future.items.find(i=>i.id===upstream.id))),upstream);
assert.equal(future.goals[0].levels[0].requirements[0].itemId,upstream.id);
assert.equal(future.goals[1].levels[0].requirements[0].itemId,upstream.id);
for(const id of ['bantam_i','stiletto_ii','stiletto_iv']){
 const item=result.items.find(i=>i.id===id);assert.equal(item.recipe,undefined);assert.equal(item.recyclesInto,undefined);
 for(const lang of ['de','en','fr','es','it'])assert.ok(item.description[lang]);
}
assert.equal(result.items.find(i=>i.id==='stiletto_ii').value,undefined);
assert.equal(result.items.find(i=>i.id==='stiletto_iv').weightKg,undefined);
console.log('PASS partial release data: stable existing IDs/records, idempotence, upstream deduplication, goal references, no invented recipes or unknown values');

const values=new Map([['arcOwned','{"planks":5}'],['arcPlanningPersonal','{"planks":{"itemId":"planks","target":8,"status":"active"}}']]);
const pinnedContext={window:{localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)}},structuredClone};
vm.runInNewContext(await readFile(new URL('../frozen-trail-data.js',import.meta.url),'utf8'),pinnedContext);
const api=pinnedContext.window.RFTFrozenTrailData;
const storedBefore=[values.get('arcOwned'),values.get('arcPlanningPersonal')];
api.extend(sourceItems,sourceGoals);
const changed=api.extend([...sourceItems,{...upstream,id:'new-api-planks'}],sourceGoals);
assert.equal(changed.items.filter(i=>i.name?.en==='Planks').length,1);
assert.equal(changed.items.find(i=>i.name?.en==='Planks').id,'planks');
assert.equal(changed.items.find(i=>i.id==='planks').value,123);
assert.equal(changed.goals.find(g=>g.id==='rft_research_station').levels[0].requirements[0].itemId,'planks');
assert.deepEqual([values.get('arcOwned'),values.get('arcPlanningPersonal')],storedBefore);
const fallback=api.extend(sourceItems,sourceGoals);assert.ok(fallback.items.some(i=>i.id==='planks'));
// Alias mappings belong to the current source load, so check references before the next fallback load.
api.extend([{...upstream,id:'new-api-planks'}],[]);
const corrected=JSON.parse(JSON.stringify(api.references([{recipe:{'new-api-planks':2,planks:3},recyclesInto:{'new-api-planks':1},requiredItemIds:[{itemId:'new-api-planks',quantity:4}]}])))[0];
assert.equal(corrected.recipe.planks,5);assert.equal(corrected.recyclesInto.planks,1);assert.equal(corrected.requiredItemIds[0].itemId,'planks');
const alternate=new Map();const another={window:{localStorage:{getItem:k=>alternate.get(k)??null,setItem:(k,v)=>alternate.set(k,v)}},structuredClone};
vm.runInNewContext(await readFile(new URL('../frozen-trail-data.js',import.meta.url),'utf8'),another);
another.window.RFTFrozenTrailData.extend([upstream],[]);
assert.equal(another.window.RFTFrozenTrailData.extend(sourceItems,[]).items.find(i=>i.name?.en==='Planks').id,'upstream-planks');
const savedPins=alternate.get('arcFrozenTrailIdentities');alternate.set('arcOwned','{"upstream-planks":8}');
assert.equal(another.window.RFTFrozenTrailData.extend([{...upstream,id:'second-api-id'}],[]).items.find(i=>i.name?.en==='Planks').id,'upstream-planks');assert.equal(alternate.get('arcFrozenTrailIdentities'),savedPins);
console.log('PASS pinned IDs: local→upstream→fallback, upstream→fallback→new upstream, newer values, recipe/recycle/quest references, unchanged saved stock/goals');

const failing={window:{localStorage:{getItem:k=>values.get(k)??null,setItem:()=>{throw new Error('storage unavailable')}}},structuredClone};
vm.runInNewContext(await readFile(new URL('../frozen-trail-data.js',import.meta.url),'utf8'),failing);
values.delete('arcFrozenTrailIdentities');assert.throws(()=>failing.window.RFTFrozenTrailData.extend(sourceItems,sourceGoals),/storage unavailable/);
assert.deepEqual([values.get('arcOwned'),values.get('arcPlanningPersonal')],storedBefore);
console.log('PASS identity storage failure leaves saved stock/goals untouched');
