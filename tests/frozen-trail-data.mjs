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
assert.equal(future.items[0],upstream);
assert.equal(future.goals[0].levels[0].requirements[0].itemId,upstream.id);
assert.equal(future.goals[1].levels[0].requirements[0].itemId,upstream.id);
for(const id of ['bantam_i','stiletto_ii','stiletto_iv']){
 const item=result.items.find(i=>i.id===id);assert.equal(item.recipe,undefined);assert.equal(item.recyclesInto,undefined);
 for(const lang of ['de','en','fr','es','it'])assert.ok(item.description[lang]);
}
assert.equal(result.items.find(i=>i.id==='stiletto_ii').value,undefined);
assert.equal(result.items.find(i=>i.id==='stiletto_iv').weightKg,undefined);
console.log('PASS partial release data: stable existing IDs/records, idempotence, upstream deduplication, goal references, no invented recipes or unknown values');
