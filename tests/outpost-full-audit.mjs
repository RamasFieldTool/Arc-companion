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
