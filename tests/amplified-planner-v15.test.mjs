// Run with: node tests/amplified-planner-v15.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=JSON.parse(fs.readFileSync('catalog-data/amplified-variants.json','utf8'));
const data=source.testIntegration;
assert.equal(source.families.length,15);
assert.equal(data.nodes.length,44);
assert.equal(data.research.length,15);
assert.equal(data.configurations.length,89);
assert.equal(data.connections.length,108);
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
assert.equal(unresolved.length,1);
for(const item of unresolved)assert(source.families.some(f=>f.id===item.familyId));
console.log('PASS: catalog extension idempotence, no duplicate IDs, unresolved mappings preserved');

for(const [family,perk] of [['osprey','ergonomicbolt'],['jupiter','ergonomicbolt'],['rascal','incendiarygrenades'],['hullcracker','incendiarygrenades']])assert(data.nodes.some(n=>n.id===family+':'+perk));
assert(data.unresolved[0].familyId==='equalizer');
for(const researchId of ['action_economy','compact_combustion_charges'])assert(data.research.some(r=>r.id===researchId));
console.log('PASS: four corroborated upgrade nodes, two research projects and one disputed upgrade');

const materialIds=new Set(Object.keys(data.materials));
for(const n of data.nodes)for(const m of n.materials)assert(materialIds.has(m.itemId),'Missing material label '+m.itemId);
for(const project of data.research)for(const m of project.materials)assert(materialIds.has(m.itemId),'Missing research material '+m.itemId);
for(const edge of data.connections){const from=data.configurations.find(c=>c.id===edge.from),to=data.configurations.find(c=>c.id===edge.to);assert.equal(from.familyId,to.familyId);assert.equal(to.nodeIds.length,from.nodeIds.length+1);assert(to.nodeIds.includes(edge.nodeId));assert(from.nodeIds.every(id=>to.nodeIds.includes(id)));}
for(const fid of ['osprey','rascal','hullcracker','jupiter']){const variants=data.configurations.filter(c=>c.familyId===fid);assert(variants.some(c=>c.nodeIds.length===0));assert(variants.some(c=>c.nodeIds.some(id=>id.includes('ergonomicbolt')||id.includes('incendiarygrenades'))));}
console.log('PASS: all material labels, configuration graph transitions and confirmed upgrade paths');
