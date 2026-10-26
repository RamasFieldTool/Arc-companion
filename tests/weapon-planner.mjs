import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const data=JSON.parse(fs.readFileSync('catalog-data/weapon-upgrades.json'));
assert.equal(data.families.length,26);assert.equal(new Set(data.families.map(f=>f.id)).size,26);
const edges=data.families.flatMap(f=>f.transitions);assert.equal(edges.length,81);assert.equal(edges.filter(e=>!e.to.endsWith('_amplified')).length,66);
for(const f of data.families){assert(f.name.en&&f.category);for(const e of f.transitions){assert(f.tiers.some(t=>t.id===e.from));assert(f.tiers.some(t=>t.id===e.to));assert(e.source.startsWith('https://arctracker.io/items/')||e.source==='https://arcraiders.wiki/wiki/Anvil');assert(e.materials.length);for(const m of e.materials){assert(Number.isSafeInteger(m.quantity)&&m.quantity>0);assert(data.materials[m.itemId]);}}}
for(const id of ['aphelion','dolabra','equalizer','jupiter'])assert.equal(data.families.find(f=>f.id===id).tiers.filter(t=>t.label!=='Amplified').length,1);
const window={},memory={};const context={window,document:{getElementById:()=>null},localStorage:{getItem:k=>memory[k]||null},Set,Map};
// Expose pure calculator while skipping DOM mounting.
let script=fs.readFileSync('weapon-planner.js','utf8').replace("if(!root)return;",'window.calculate=calculate;if(!root)return;');vm.runInNewContext(script,context);const calc=(...a)=>JSON.parse(JSON.stringify(window.calculate(...a)));
const anvil=data.families.find(f=>f.id==='anvil');assert.deepEqual(anvil.craftingRecipe.materials,[{itemId:'advanced_mechanical_components',quantity:2},{itemId:'heavy_gun_parts',quantity:3},{itemId:'hand_drill',quantity:3}]);assert.equal(anvil.craftingRecipe.stationLevel,2);assert.equal(anvil.craftingRecipe.blueprintRequired,true);assert.deepEqual(calc(anvil,'anvil_i','anvil_iv').totals,{mechanical_components:3,simple_gun_parts:1,advanced_mechanical_components:3,heavy_gun_parts:2});assert.deepEqual(calc(anvil,'anvil_ii','anvil_iv').totals,{advanced_mechanical_components:3,heavy_gun_parts:2});assert(calc(anvil,'anvil_i','anvil_amplified').totals.amplification_module_mk_iii===1);
assert.equal(calc(anvil,'anvil_iv','anvil_i').complete,false);assert.equal(calc(anvil,'bad','anvil_iv').complete,false);assert.equal(calc(anvil,'anvil_i','anvil_i').steps.length,0);
const unknown=structuredClone(anvil);unknown.transitions[0].materials=null;assert.equal(calc(unknown,'anvil_i','anvil_iv').complete,false);assert.deepEqual(calc(unknown,'anvil_i','anvil_iv').totals,{});
for(const f of data.families){if(!f.transitions.length)continue;const r=calc(f,f.tiers[0].id,f.tiers.at(-1).id);assert(r.complete,f.id);assert.equal(r.steps.length,f.transitions.length)}
console.log('PASS: 26 families, 66 ordinary edges, 15 ascensions; exact sums, single-tier weapons, missing costs, backward/invalid paths');
// Shared research is needed once across multiple saved weapon plans, and completed research drops out.
script=fs.readFileSync('weapon-planner.js','utf8').replace('if(!root)return;','window.requirements=requirements;if(!root)return;');vm.runInNewContext(script,context);
const research=[{id:'shared_research',materials:[{itemId:'queen_reactor',quantity:2}]}];memory.rftWeaponPlansV1=JSON.stringify({a:{active:true,label:'A',materials:[{itemId:'metal_parts',quantity:3}],research},b:{active:true,label:'B',materials:[{itemId:'metal_parts',quantity:4}],research}});
let req=JSON.parse(JSON.stringify(window.requirements()));assert.equal(req.filter(r=>r.itemId==='queen_reactor').reduce((s,r)=>s+r.quantity,0),2);assert.equal(req.filter(r=>r.itemId==='metal_parts').reduce((s,r)=>s+r.quantity,0),7);
memory.rftAmplifiedResearchV1=JSON.stringify({shared_research:true});assert(!window.requirements().some(r=>r.itemId==='queen_reactor'));
console.log('PASS: shared research deduplicated across saved weapons; completed research excluded; ordinary requirements preserved');

// Existing installations must fetch the complete new loader chain and backup schema.
assert(fs.readFileSync('index.html','utf8').includes('collapsible-core-v1306.js?v=weapon-goals-1'));
assert(fs.readFileSync('index.html','utf8').includes('backup-v1304.js?v=weapon-goals-1'));
assert(fs.readFileSync('collapsible-core-v1306.js','utf8').includes('planning-bootstrap.js?v=weapon-goals-1'));
assert(fs.readFileSync('planning-bootstrap.js','utf8').includes('planning-core.js?v=weapon-goals-1'));
assert(fs.readFileSync('planning-bootstrap.js','utf8').includes('planning-ui.js?v=weapon-goals-1'));
console.log('PASS: versioned loader chain and backup prevent stale planning code on existing installations');
