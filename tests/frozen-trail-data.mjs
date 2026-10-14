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
for(const id of ['stiletto_ii','stiletto_iv']){
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

const smith=result.goals.find(g=>g.id==='weapon_bench');
assert.equal(smith.levels.length,4);
assert.deepEqual(JSON.parse(JSON.stringify(smith.levels.slice(0,3))),sourceGoals.find(g=>g.id==='weapon_bench').levels);
assert.deepEqual(JSON.parse(JSON.stringify(smith.levels[3].requirements)),[{itemId:'radial_press',quantity:3},{itemId:'magnetic_accelerator',quantity:3},{itemId:'emperor_modulator',quantity:1}]);
const grapple=result.items.find(i=>i.id==='grappling_hook');
assert.deepEqual(JSON.parse(JSON.stringify(grapple.recipe)),{rope:2,cable_stripper:1,mechanical_components:1});
for(const key of ['weightKg','value','stackSize','recyclesInto'])assert.equal(grapple[key],undefined);
const suppliedSmith=structuredClone(sourceGoals);suppliedSmith.find(g=>g.id==='weapon_bench').levels.push({level:4,requirements:[{itemId:'future',quantity:2}]});
assert.equal(extend(sourceItems,suppliedSmith).goals.find(g=>g.id==='weapon_bench').levels[3].requirements[0].itemId,'future');
const mapped=extend([...sourceItems,{id:'api-rope',name:{en:'Rope'}},{id:'api-hook',name:{en:'Grappling Hook'},recipe:{'api-rope':2}}],sourceGoals);
assert.equal(mapped.items.filter(i=>i.name?.en==='Grappling Hook').length,1);
assert.equal(mapped.items.find(i=>i.id==='api-hook').recipe['api-rope'],2);
assert.equal(mapped.goals.find(g=>g.id==='rft_grappling_hook_craft').levels[0].requirements[0].itemId,'api-rope');
console.log('PASS verified follow-up: existing station levels preserved, IV added once, newer upstream IV retained, crafting quantities and IDs, unknown values omitted');

// New material records preserve upstream identities/values and saved quantities.
const names=['Pressure Regulator','Propellant Valve Assembly','Fluted Rotor Core','Pneumatic Actuator','Steel Cable','Epoxy Bucket','Hand Drill','Laser Level','Insulation Roll','Skulker Driver'];
for(const name of names){const rows=result.items.filter(x=>x.name?.en===name);assert.equal(rows.length,1,name);assert.equal(rows[0].recipe,undefined);assert.equal(rows[0].recyclesInto,undefined)}
const modern={id:'future-pressure',name:{en:'Pressure Regulator'},value:9876};
const preserved=extend([modern],[]).items.find(x=>x.name?.en==='Pressure Regulator');assert.equal(preserved.id,modern.id);assert.equal(preserved.value,9876);
const catalog=JSON.parse(await readFile(new URL('../outpost-catalog.json',import.meta.url),'utf8'));
assert.equal(catalog.furniture.length,100);assert.equal(new Set(catalog.furniture.map(x=>x.id)).size,100);assert.equal(catalog.furniture.filter(x=>x.research).length,52);
for(const row of catalog.furniture){for(const lang of ['de','en','fr','es','it'])assert.ok(row.name[lang]);for(const material of row.craft)assert.ok(material.quantity>0)}
const bar=catalog.furniture.find(x=>x.id==='barstool');assert.equal(bar.research.points,500);assert.equal(bar.craft.find(x=>x.name.en==='Fabric').quantity,4);assert.equal(bar.craft.find(x=>x.name.en==='Sheet Metal').quantity,8);
console.log('PASS 100 furniture, 52 linked research records, distinct craft costs, material deduplication and upstream preservation');


// Frozen Trail 2.0 weapon-tier placeholders: all tiers, no invented numeric data.
const weaponIds=['bantam_i','bantam_ii','bantam_iii','bantam_iv','stiletto_i','stiletto_ii','stiletto_iii','stiletto_iv'];
for(const id of weaponIds){
  const item=result.items.find(i=>i.id===id);
  assert.ok(item, 'missing weapon tier '+id);
  assert.equal(result.items.filter(i=>i.id===id).length,1,'duplicate weapon tier '+id);
}
for(const id of ['bantam_ii','bantam_iv','stiletto_i','stiletto_iii']){
  const item=result.items.find(i=>i.id===id);
  for(const key of ['recyclesInto','salvagesInto','upgradeCost','value','rarity','weightKg','damage'])
    assert.equal(item[key],undefined,'unverified field '+id+'.'+key);
  for(const lang of ['de','en','fr','es','it']) assert.ok(item.description[lang],id+' '+lang);
}
const altCatalog=weaponIds.map(id=>({id:'api_'+id,name:{en:id.replace('_',' ').replace(/\\b\\w/g,m=>m.toUpperCase())},value:1234}));
const withCanonicalNames=altCatalog.map(x=>({...x,name:{en:x.id.slice(4).split('_').map((s,i)=>i===0?s[0].toUpperCase()+s.slice(1):s.toUpperCase()).join(' ')}}));
const altResult=extend(withCanonicalNames,sourceGoals);
for(const id of weaponIds){
  const name=id.split('_').map((s,i)=>i===0?s[0].toUpperCase()+s.slice(1):s.toUpperCase()).join(' ');
  const rows=altResult.items.filter(i=>i.name?.en===name);
  assert.equal(rows.length,1,'canonical-name deduplication '+id);
  assert.equal(rows[0].id,'api_'+id,'canonical id '+id);
  assert.equal(rows[0].value,1234,'preserve upstream value '+id);
}
const savedWeaponData=new Map([
  ['arcOwned',JSON.stringify({bantam_ii:2,stiletto_iii:1})],
  ['arcPlanningPersonal',JSON.stringify({bantam_ii:{target:4}})],
  ['arcNextRaid',JSON.stringify({stiletto_iii:{target:2}})]
]);
const weaponContext={window:{localStorage:{getItem:k=>savedWeaponData.get(k)??null,setItem:(k,v)=>savedWeaponData.set(k,v)}},structuredClone};
vm.runInNewContext(await readFile(new URL('../frozen-trail-data.js',import.meta.url),'utf8'),weaponContext);
const savedOriginal=Object.fromEntries(savedWeaponData);
const pinnedWeapon=weaponContext.window.RFTFrozenTrailData.extend(withCanonicalNames,sourceGoals);
assert.equal(pinnedWeapon.items.find(i=>i.name?.en==='Bantam II').id,'bantam_ii');
assert.equal(pinnedWeapon.items.find(i=>i.name?.en==='Stiletto III').id,'stiletto_iii');
for(const [key,val] of Object.entries(savedOriginal)) assert.equal(savedWeaponData.get(key),val,'saved data changed: '+key);
const afterFallback=weaponContext.window.RFTFrozenTrailData.extend(sourceItems,sourceGoals);
assert.equal(new Set(afterFallback.items.map(i=>i.id)).size,afterFallback.items.length);
for(const [key,val] of Object.entries(savedOriginal)) assert.equal(savedWeaponData.get(key),val,'saved data changed after fallback: '+key);
console.log('PASS Frozen Trail eight weapon tiers: missing values remain absent, upstream deduplication, saved stock and goals preserved');

// Base weapons use standard recipe fields; higher-tier costs remain unfilled.
for(const id of ['bantam_i','stiletto_i']){
 const item=result.items.find(i=>i.id===id);
 assert.deepEqual(JSON.parse(JSON.stringify(item.recipe)),{mechanical_components:4,simple_gun_parts:4});
 assert.equal(item.blueprintLocked,true);assert.equal(item.craftBench,'weapon_bench');
 assert.equal(item.rftRecipeEvidence.status,'api-documented-not-game-confirmed');
}
for(const id of ['bantam_ii','bantam_iv','stiletto_ii','stiletto_iii','stiletto_iv'])assert.equal(result.items.find(i=>i.id===id).recipe,undefined);
const current={id:'api-anvil-i',name:{en:'Anvil I'},recipe:{future_material:8},value:4321};
const source=JSON.stringify(current),kept=extend([current],[]).items.find(i=>i.id===current.id);
assert.equal(JSON.stringify(current),source);assert.deepEqual(JSON.parse(JSON.stringify(kept.recipe)),current.recipe);assert.equal(kept.value,4321);
const anvil=extend([{id:'anvil_i',name:{en:'Anvil I'}}],[]).items.find(i=>i.id==='anvil_i');
assert.deepEqual(JSON.parse(JSON.stringify(anvil.recipe)),{advanced_mechanical_components:2,hand_drill:3,heavy_gun_parts:3});
console.log('PASS standard weapon recipes: missing base recipes added with provenance, upstream recipes/IDs preserved, tier costs remain unknown');
