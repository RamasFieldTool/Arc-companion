import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../catalog-data/amplified-weapons-audit.json',import.meta.url),'utf8'));
const snapshot=JSON.parse(await readFile(new URL('../catalog-data/items-full-snapshot.json',import.meta.url),'utf8'));
const ids=new Set(snapshot.items.map(x=>x.id));
assert.equal(data.families.length,15);
assert.equal(new Set(data.families.map(x=>x.family)).size,15);
for(const row of data.families){
  assert.ok(['I','II','III','IV','V'].includes(row.moduleMark));
  assert.ok(row.baseItemIds.length>0);
  for(const id of row.baseItemIds)assert.ok(ids.has(id),row.family+': missing '+id);
  for(const field of ['amplifiedItemId','crafting','upgradeCost','weaponStats'])assert.equal(row[field],null);
}
assert.equal(data.families.filter(x=>x.moduleMark==='I').length,3);
assert.equal(data.families.filter(x=>x.moduleMark==='II').length,2);
assert.equal(data.families.filter(x=>x.moduleMark==='III').length,5);
assert.equal(data.families.filter(x=>x.moduleMark==='IV').length,2);
assert.equal(data.families.filter(x=>x.moduleMark==='V').length,3);
console.log('PASS amplified weapon audit: 15 distinct families, existing canonical IDs, no invented amplified IDs or recipes');
