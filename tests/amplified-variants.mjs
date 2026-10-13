import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const data=JSON.parse(fs.readFileSync('catalog-data/amplified-variants.json','utf8'));
test('Amplified reference has 15 distinct families and 45 documented options',()=>{
  assert.equal(data.families.length,15);
  assert.equal(new Set(data.families.map(f=>f.id)).size,15);
  assert.equal(data.families.reduce((sum,f)=>sum+(f.researchedUpgradeOptions||[]).length,0),45);
  for(const family of data.families){
    assert.match(family.moduleMark,/^(I|II|III|IV|V)$/);
    for(const option of family.researchedUpgradeOptions||[]){
      assert.ok(['community-reference-unverified-in-game','disputed-community-reference-needs-recheck','disputed-label-needs-in-game-check'].includes(option.verification));
      assert.equal(option.upgradeMaterials,null);
      assert.equal(option.upgradeCost,null);
    }
  }
});
test('Amplification module classes cover each family exactly once and trees remain explicitly unverified',()=>{
  assert.equal(data.moduleClasses.length,5);
  assert.deepEqual(data.moduleClasses.map(m=>m.mark),['I','II','III','IV','V']);
  const assigned=data.moduleClasses.flatMap(m=>m.familyIds.map(id=>({id,mark:m.mark})));
  assert.equal(assigned.length,15);
  assert.equal(new Set(assigned.map(x=>x.id)).size,15);
  for(const {id,mark} of assigned)assert.equal(data.families.find(f=>f.id===id)?.moduleMark,mark);
  assert.equal(data.upgradeTree.status,'community-sourced-provisional-not-primary-verified');
  assert.equal(data.weaponCoverage.totalKnownWeapons,26);
  assert.equal(data.weaponCoverage.amplifiableCount,15);
  assert.equal(data.weaponCoverage.notListedForAmplification.length,11);
  const names=new Set(data.families.map(f=>f.id));
  for(const missing of data.weaponCoverage.notListedForAmplification){
    assert.ok(!names.has(missing.id));
    assert.equal(missing.absenceIsNotProof,true);
  }
  for(const edge of data.upgradeTree.prerequisites){
    const family=data.families.find(f=>f.id===edge.family);
    assert.ok(family);
    assert.ok([edge.upgrade,edge.requires].every(n=>family.researchedUpgradeOptions.some(o=>o.name===n)));
    assert.equal(edge.verification,'community-guide-game-file-claim');
  }
  for(const edge of data.upgradeTree.mutualExclusions){
    const family=data.families.find(f=>f.id===edge.family);
    assert.ok(family);
    assert.ok(edge.options.every(n=>family.researchedUpgradeOptions.some(o=>o.name===n)));
    assert.equal(edge.verification,'community-guide-game-file-claim');
  }
  assert.ok(data.researchNotes.every(note=>typeof note==='string'&&note.length>30));
});
test('evidence ledger contains exact quantities only with attributable sources',()=>{
  const ledger=data.evidenceLedger;
  assert.equal(ledger.specificRequirements.length,3);
  assert.equal(ledger.specificStats.length,2);
  for(const entry of [...ledger.specificRequirements,...ledger.specificStats]){
    assert.match(entry.source,/^https:\/\//);
    assert.ok(entry.evidence.length>12);
  }
  for(const entry of ledger.specificRequirements){
    for(const material of entry.materials){
      assert.ok(Number.isInteger(material.quantity)&&material.quantity>0);
      assert.ok(material.name.length>2);
    }
  }
  const required=new Map([['aphelion|Increased Burst','Charged Burst'],['bettina|X Rounds','Semi-Auto'],['burletta|Increased Burst','Burst-Fire'],['hairpin|Sprint Shooting','Semi-Auto'],['rattler|Drum Mag','More Reload']]);
  for(const edge of data.upgradeTree.prerequisites){
    assert.equal(edge.requires,required.get(edge.family+'|'+edge.upgrade));
  }
});
test('repair costs cover 15 families and never masquerade as crafting recipes',()=>{
  const repairs=data.repairCostEvidence;
  assert.equal(repairs.families.length,15);
  assert.equal(new Set(repairs.families.map(x=>x.id)).size,15);
  const moduleBase={I:7,II:10,III:13,IV:17,V:22};
  for(const item of repairs.families){
    const family=data.families.find(f=>f.id===item.id);
    assert.ok(family);
    assert.equal(item.baseNoAdditionalNode,moduleBase[family.moduleMark]);
    assert.ok(item.reportedMaximumWithBranches>=item.baseNoAdditionalNode);
    assert.equal(item.status,'TEILWEISE VERIFIZIERT');
  }
  assert.equal(repairs.playerReport.specificExample.repairFragments,54);
  assert.equal(repairs.playerReport.specificExample.weapon,'equalizer');
  assert.match(repairs.source,/^https:\/\//);
});
test('ARC Tracker configuration evidence is distinct from crafting verification',()=>{
  const evidence=data.configurationDatabaseEvidence;
  assert.equal(evidence.verification,'partially-verified-database-records-not-in-game-crafting-proof');
  assert.equal(evidence.gameVersion,'2.00');
  assert.match(evidence.source,/^https:\/\/arctracker\.io\/items$/);
  assert.ok(evidence.findings.some(x=>x.includes('Anti-Shield + Full-Auto')));
  assert.ok(evidence.findings.some(x=>x.includes('Ergonomic Bolt')));
  assert.ok(evidence.caution.includes('Do not treat'));
  assert.equal(evidence.exampleRecords.find(x=>x.family==='equalizer').repairFragmentsFor50Percent,42);
});
test('database-backed node costs and amplification recipes retain provenance',()=>{
  assert.equal(data.databaseNodeEvidence.length,11);
  assert.equal(data.databaseBaseUpgradeEvidence.length,3);
  for(const e of [...data.databaseNodeEvidence,...data.databaseBaseUpgradeEvidence]){
    assert.match(e.source,/^https:\/\/arctracker\.io\//);
    assert.equal(e.status,'TEILWEISE VERIFIZIERT');
    assert.ok(data.families.some(f=>f.id===e.family));
    assert.ok(e.materials.every(m=>Number.isInteger(m.quantity)&&m.quantity>0));
  }
  for(const e of data.databaseNodeEvidence){
    assert.ok(data.families.find(f=>f.id===e.family).researchedUpgradeOptions.some(o=>o.name===e.node||e.node==='Incendiary Rounds'&&o.name==='Incendiary Grenade'));
    assert.ok(e.evidenceType.includes('not-direct-game-screenshot'));
  }
});
test('ARC Tracker index has 89 named configuration records in 15 families',()=>{
 const audit=data.arcTrackerIndexAudit;
 assert.equal(Object.keys(audit.countsByFamily).length,15);
 assert.equal(Object.values(audit.countsByFamily).reduce((a,b)=>a+b,0),89);
 assert.equal(audit.amplifiedBaseForms,15);
 assert.equal(audit.additionalNamedConfigurations,74);
 assert.equal(audit.count,89);
 for(const f of data.families) assert.ok(audit.countsByFamily[f.id]>=1);
 assert.equal(new Set(data.databaseNodeEvidence.map(e=>e.family+'|'+e.node)).size,11);
});
test('direct record audit never confuses index coverage with opened pages',()=>{
 const a=data.arcTrackerRecordAudit;
 assert.equal(a.expectedRecordsFromPriorIndexCount,89);
 assert.equal(a.records.length+a.unopenedRecords,89);
 assert.equal(new Set(a.records.map(x=>x.id)).size,a.records.length);
 assert.equal(a.records.length,34);
 assert.equal(a.unopenedRecords,55);
 for(const r of a.records){
   assert.equal(r.technicalStatus,'TEILWEISE AUSGEWERTET');
   assert.equal(r.contentVerification,'TEILWEISE VERIFIZIERT');
   assert.equal(r.url,'https://arctracker.io/items/'+r.id);
   assert.ok(r.missing.length>0);
   assert.ok(data.families.some(f=>f.id===r.family));
 }
 assert.equal(a.unopenedStatus,'NOCH NICHT GEPRÜFT');
});
test('Amplified read-only scripts do not modify player storage',()=>{
  for(const path of ['amplified-search.js','outpost-amplified.js']){
    const source=fs.readFileSync(path,'utf8');
    assert.doesNotMatch(source,/localStorage\.(?:setItem|removeItem|clear)\s*\(/);
  }
});
test('item search includes researched options and legacy Anvil display fix',()=>{
  const app=fs.readFileSync('app.js','utf8');
  assert.match(app,/researchedUpgradeOptions/);
  assert.match(app,/rft-amplified-data-ready/);
  assert.match(app,/original\.replace\(\/\^Amboss/);
});
test('Outpost renders researched options and five language labels',()=>{
  const script=fs.readFileSync('outpost-amplified.js','utf8');
  for(const language of ['de','en','fr','es','it'])assert.match(script,new RegExp(language+':'));
  assert.match(script,/researchedUpgradeOptions/);
});
