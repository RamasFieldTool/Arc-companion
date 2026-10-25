// Run with: node tests/amplified-planner-v15.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=JSON.parse(fs.readFileSync('catalog-data/amplified-variants.json','utf8'));
const data=source.testIntegration;
assert.equal(source.families.length,15);
assert.equal(data.nodes.length,40);
assert.equal(data.research.length,13);
assert.equal(data.configurations.length,76);
assert.equal(data.connections.length,84);
const ids=new Set(data.nodes.map(n=>n.id));
const configIds=new Set(data.configurations.map(c=>c.id));
assert.equal(ids.size,data.nodes.length);
assert.equal(configIds.size,data.configurations.length);
for(const config of data.configurations){assert(source.families.some(f=>f.id===config.familyId));for(const id of config.nodeIds){assert(ids.has(id),id);assert.equal(data.nodes.find(n=>n.id===id).familyId,config.familyId)}}
for(const edge of data.connections){assert(configIds.has(edge.from),edge.from);assert(configIds.has(edge.to),edge.to);assert(ids.has(edge.nodeId),edge.nodeId)}
for(const node of data.nodes){for(const m of node.materials){assert(m.itemId&&Number.isInteger(m.quantity)&&m.quantity>0)}for(const id of node.researchIds)assert(data.research.some(r=>r.id===id),id)}
for(const path of ['amplified-planner-v15.js','app.js','frozen-trail-data.js','backup-v1304.js'])new vm.Script(fs.readFileSync(path,'utf8'),{filename:path});
const frozen=fs.readFileSync('frozen-trail-data.js','utf8');
assert(frozen.includes('...amplifiedCatalog'));
assert(fs.readFileSync('index.html','utf8').includes('amplified-planner-v15.js'));
const backup=fs.readFileSync('backup-v1304.js','utf8');
assert(backup.includes('rftAmplifiedPlansV1')&&backup.includes('rftAmplifiedResearchV1'));
console.log('PASS: amplified catalog integrity, syntax, catalog wiring, backup wiring');

// Runtime catalog regression: exactly 15 amplified records and no duplicates on repeated extension.
const memory=new Map();
const localStorage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,String(value))};
const runtime={window:{localStorage},structuredClone:globalThis.structuredClone,localStorage};
vm.runInNewContext(fs.readFileSync('frozen-trail-data.js','utf8'),runtime,{filename:'frozen-trail-data.js'});
const first=runtime.window.RFTFrozenTrailData.extend([],[]);
const second=runtime.window.RFTFrozenTrailData.extend(first.items,first.goals);
assert.equal(first.items.filter(item=>item.id.endsWith('_amplified')).length,15);
assert.equal(second.items.length,first.items.length);
assert.equal(new Set(second.items.map(item=>item.id)).size,second.items.length);
assert.equal(second.goals.length,first.goals.length);
const unresolved=data.unresolved||[];
assert.equal(unresolved.length,5);
for(const item of unresolved)assert(source.families.some(f=>f.id===item.familyId));
console.log('PASS: catalog extension idempotence, no duplicate IDs, unresolved mappings preserved');
