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
