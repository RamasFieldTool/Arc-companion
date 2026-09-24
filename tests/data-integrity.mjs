import { readFile,readdir,access } from 'node:fs/promises';
import { constants } from 'node:fs';

const root=new URL('../',import.meta.url);
const read=async path=>readFile(new URL(path,root),'utf8');
const parse=async path=>JSON.parse(await read(path));
const fail=message=>{throw new Error(message)};

const rootFiles=await readdir(root);
for(const name of rootFiles.filter(name=>name.endsWith('.json'))){
  try{JSON.parse(await read(name))}catch(error){fail(`${name}: invalid JSON: ${error.message}`)}
}

const items=await parse('items.json');
if(!Array.isArray(items)||!items.length) fail('items.json must be a non-empty array');
const itemIds=items.map(item=>item?.id);
if(itemIds.some(id=>typeof id!=='string'||!id.trim())) fail('items.json contains an item without a valid id');
if(new Set(itemIds).size!==itemIds.length) fail('items.json contains duplicate item ids');

const goals=await parse('goals.json');
if(!Array.isArray(goals)||!goals.length) fail('goals.json must be a non-empty array');
const goalIds=new Set();
for(const goal of goals){
  if(typeof goal?.id!=='string'||!goal.id) fail('goals.json contains a goal without id');
  if(goalIds.has(goal.id)) fail(`Duplicate goal id: ${goal.id}`);
  goalIds.add(goal.id);
  if(!Array.isArray(goal.levels)||!goal.levels.length) fail(`Goal ${goal.id} has no levels`);
  for(const level of goal.levels){
    if(!Number.isFinite(Number(level?.level))) fail(`Goal ${goal.id} has invalid level`);
    if(!Array.isArray(level.requirements)) fail(`Goal ${goal.id} level ${level.level} has no requirements array`);
    for(const req of level.requirements){
      if(typeof req?.itemId!=='string'||!req.itemId) fail(`Goal ${goal.id} level ${level.level} has invalid itemId`);
      if(!Number.isFinite(Number(req.quantity))||Number(req.quantity)<0) fail(`Goal ${goal.id} level ${level.level} has invalid quantity`);
    }
  }
}

const index=await read('index.html');
const localAssets=[...index.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|json|svg)(?:\?[^"#]*)?)"/g)]
  .map(match=>match[1])
  .filter(path=>!/^https?:\/\//i.test(path))
  .map(path=>path.split('?')[0]);
for(const path of new Set(localAssets)){
  try{await access(new URL(path,root),constants.F_OK)}catch{fail(`index.html references missing local asset: ${path}`)}
}

const catalogPos=index.indexOf('catalog-resilience-v2120.js');
const appPos=index.indexOf('app.js');
const statusPos=index.indexOf('status-v1300.js');
if(catalogPos<0||appPos<0||statusPos<0) fail('Required catalog/app/status scripts are not all referenced by index.html');
if(!(catalogPos<appPos&&appPos<statusPos)) fail('Script order must be catalog-resilience -> app.js -> status-v1300.js');

const expectedVersion=process.env.EXPECTED_APP_VERSION||'13.0.16';
const statusScript=await read('status-v1300.js');
const version=statusScript.match(/const APP_VERSION='([^']+)'/)?.[1];
if(version!==expectedVersion) fail(`Visible app version must be ${expectedVersion}; found ${version||'none'}`);

const catalogScript=await read('catalog-resilience-v2120.js');
for(const marker of ['window.__arcCatalogMeta','SNAPSHOT_URL','Ramas-Snapshot','github-partial','local-fallback']){
  if(!catalogScript.includes(marker)) fail(`Catalog resilience marker missing: ${marker}`);
}
if(!catalogScript.includes('catalog-data/items-full-snapshot.json')) fail('Catalog snapshot URL is missing from resilience layer');
if(!catalogScript.includes('mahcksResponseLooksUsable')) fail('Mahcks payload validation is missing');

console.log(`PASS static integrity: ${items.length} local items, ${goals.length} goal groups, ${new Set(localAssets).size} referenced local assets, version ${version}.`);
