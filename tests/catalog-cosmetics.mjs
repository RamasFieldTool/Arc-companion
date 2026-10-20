import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const read=path=>readFile(new URL(path,import.meta.url),'utf8');
const context={window:{},structuredClone};
vm.runInNewContext(await read('../frozen-trail-data.js'),context);
vm.runInNewContext(await read('../catalog-cosmetics-v1500.js'),context);
const sourceItems=JSON.parse(await read('../items.json'));
const sourceGoals=JSON.parse(await read('../goals.json'));
const sourceBefore=JSON.stringify([sourceItems,sourceGoals]);
const result=context.window.RFTFrozenTrailData.extend(sourceItems,sourceGoals);
const stencilNames=['Bulwark','Cerulean',"Dragon's Breath",'Dusty Camo','Empyrean','Fortuna','Garnet','Milky Terraccota','Ochre','Sacrifice','Serac','Slipstream','Tortoise','Verdigris'];
for(const name of stencilNames){
  const rows=result.items.filter(item=>item.name?.en===`${name} Stencil`);
  assert.equal(rows.length,1,`expected one searchable record for ${name}`);
  assert.equal(rows[0].type,'Cosmetic');
  assert.equal(rows[0].recipe,undefined);
  assert.equal(rows[0].value,undefined);
  assert.equal(rows[0].rftEvidence.status,'community-index-name-only');
}
const wreck=result.items.filter(item=>item.name?.en==='Wreck Set');
assert.equal(wreck.length,1);
assert.equal(wreck[0].type,'Cosmetic Set');
assert.equal(wreck[0].rftEvidence.status,'official-store-update');
assert.equal(new Set(result.items.map(item=>item.id)).size,result.items.length);
const repeated=context.window.RFTFrozenTrailData.extend(result.items,result.goals);
assert.equal(repeated.items.length,result.items.length,'supplemental extension is idempotent');
assert.equal(new Set(repeated.items.map(item=>item.id)).size,repeated.items.length);
assert.equal(JSON.stringify([sourceItems,sourceGoals]),sourceBefore,'input catalog and goals remain untouched');

const upstream={id:'api-slipstream',name:{en:'Slipstream Stencil'},value:4321,recipe:{future:1}};
const preserved=context.window.RFTFrozenTrailData.extend([upstream],[]).items.filter(item=>item.name?.en==='Slipstream Stencil');
assert.equal(preserved.length,1);
assert.equal(preserved[0].id,'api-slipstream');
assert.equal(preserved[0].value,4321);

const status=await read('../status-v1300.js');
const index=await read('../index.html');
assert.match(status,/const APP_VERSION='15\.00\.00'/);
assert.match(index,/<title>ARC Companion V15\.00\.00<\/title>/);
assert.match(index,/catalog-cosmetics-v1500\.js\?v=v15-cosmetics-20261020-1/);
console.log('PASS V15 cosmetic catalog: 14 searchable stencils, official Wreck Set entry, no invented values, deduplication, immutability and version');
