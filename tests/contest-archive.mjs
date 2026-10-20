import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const manifest=JSON.parse(await readFile(new URL('../fan-contest-archive.json',import.meta.url),'utf8'));
const source=await readFile(new URL('../raider-radio.js',import.meta.url),'utf8');
const guide=await readFile(new URL('../docs/community-contest-archive.md',import.meta.url),'utf8');
assert.equal(manifest.schemaVersion,1);
assert.deepEqual(manifest.entries,[],'Do not add contest content without reviewed permission and metadata');
for(const contract of [
  "entry.permissionStatus==='documented'",
  'assets\\/fan-creations\\/',
  "entry.permissionReference.trim()",
  'fan-contest-archive.json?v=1',
  'archiveContribution.addEventListener',
  "makeText('h4','fan-contest-card-title',entry.title)"
])assert.ok(source.includes(contract),`Missing archive safety/rendering contract: ${contract}`);
for(const field of ['permissionStatus','permissionReference','period','group','creator'])assert.ok(guide.includes(`\`${field}\``),`Archive maintenance guide missing ${field}`);
new Function(source);
console.log('contest archive integrity: empty-by-default manifest, documented permission gate, local image path and maintenance guide verified');
