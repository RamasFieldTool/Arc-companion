import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const audit=read('catalog-data/outpost-full-audit-20261016.json');
const catalog=read('outpost-catalog.json');
const amplified=read('catalog-data/amplified-variants.json');
assert.equal(audit.rows.length,400);
assert.equal(new Set(audit.rows.map(r=>r.id)).size,400);
for(const [path,hash] of Object.entries(audit.inputSha256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),hash,'stale audit: '+path);
for(const row of audit.rows){
 assert.ok(['VERIFIZIERT','TEILWEISE VERIFIZIERT','NICHT VERIFIZIERT','WIDERSPRÜCHLICH','FEHLGESCHLAGEN'].includes(row.status));
 assert.ok(row.missing.length&&row.requiredEvidence&&row.verificationScope&&row.sources.length);
}
for(const item of catalog.furniture)assert.deepEqual(audit.rows.find(r=>r.id==='furniture:'+item.id).present,item);
const configs=new Set(audit.rows.filter(r=>r.area==='amplified-configuration').map(r=>r.present.id));
for(const row of audit.rows.filter(r=>r.area==='amplified-edge')){
 assert.ok(configs.has(row.id.slice(5).split('>')[0]));assert.ok(configs.has(row.present.to));
 for(const q of Object.values(row.present.cost||{}))assert.ok(Number.isInteger(q)&&q>0);
}
assert.equal(audit.rows.filter(r=>r.area==='amplified-configuration'&&r.uiIntegrated).length,76);
assert.equal(audit.rows.filter(r=>r.area==='amplified-edge'&&r.uiIntegrated).length,84);
const mobile=amplified.testIntegration.research.find(r=>r.id==='mobile_fire_grip_fittings');
assert.equal(mobile.materials[0].itemId,'skulker_targeter');
assert.equal(mobile.fieldEvidence['materials.itemId'].status,'VERIFIZIERT');
assert.equal(mobile.status,'api-documented-not-game-confirmed');
assert.equal(audit.fullyGameVerifiedRecords,0);
assert.equal(Object.values(catalog.coverageEvidence.distribution).reduce((a,b)=>a+b,0),catalog.coverageEvidence.designCount);
assert.equal(catalog.status,'community-generated-data-not-in-game-verified');
assert.deepEqual(audit.wikiComparison.counts,{agrees:96,conflict:2,'not-compared':2});
console.log('PASS full Outpost audit: 400 unique evidence records, source freshness, all archived edge endpoints, UI subset coverage and field-level verification limits');

const followup=read('catalog-data/outpost-targeted-followup-20261016.json');
assert.equal(followup.documentationOnly,true);
const archivedConfigs=audit.rows.filter(r=>r.area==='amplified-configuration'&&!r.uiIntegrated).map(r=>r.present.id).sort();
assert.deepEqual(followup.configurations.map(r=>r.id).sort(),archivedConfigs);
const archivedEdges=audit.rows.filter(r=>r.area==='amplified-edge'&&!r.uiIntegrated).map(r=>r.id.slice(5)).sort();
assert.deepEqual(followup.connections.map(r=>r.id).sort(),archivedEdges);
const unresolvedNodes=audit.rows.filter(r=>r.area==='amplified-node'&&r.status==='WIDERSPRÜCHLICH').map(r=>r.id).sort();
assert.deepEqual(followup.nodes.map(r=>r.auditId).sort(),unresolvedNodes);
for(const row of [...followup.configurations,...followup.connections,...followup.nodes,...followup.research]){
 assert.equal(row.runtimeImported,false);
 if('currentGameExistence' in row)assert.equal(row.currentGameExistence,'NICHT VERIFIZIERT');
 for(const key of row.sources||[])assert.ok(followup.sources[key],'missing followup source: '+key);
}
for(const edge of followup.connections){
 const original=audit.rows.find(r=>r.id===edge.auditId);
 assert.deepEqual(edge.archivedCost,original.present.cost);
 assert.equal(edge.from+'>'+edge.to,edge.id);
}
assert.equal(new Set(followup.configurations.map(r=>r.id)).size,13);
assert.equal(new Set(followup.connections.map(r=>r.id)).size,24);
assert.equal(followup.furniture.length,5);
assert.equal(followup.connections.filter(r=>r.sourceRechecked).length,7);
assert.equal(followup.configurations.filter(r=>r.currentPage.retrieval==='success').length,9);
console.log('PASS targeted follow-up: exact five unresolved nodes, 13 excluded configurations and 24 excluded edges covered without promoting game verification');
