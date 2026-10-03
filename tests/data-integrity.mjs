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
const localAssetRefs=[...index.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|json|svg)(?:\?[^"#]*)?)"/g)]
  .map(match=>match[1])
  .filter(path=>!/^https?:\/\//i.test(path));
const localAssets=localAssetRefs.map(path=>path.split('?')[0]);
for(const path of new Set(localAssets)){
  try{await access(new URL(path,root),constants.F_OK)}catch{fail(`index.html references missing local asset: ${path}`)}
}

// Mutable browser assets must carry an explicit cache-buster so Android/WebView clients do not keep stale JS/CSS forever.
const mutableRefs=localAssetRefs.filter(path=>/\.(?:js|css)(?:\?|$)/i.test(path));
const unversionedMutable=mutableRefs.filter(path=>!/[?&]v=[^&#]+/.test(path));
if(unversionedMutable.length)fail(`Mutable local assets missing ?v= cache-buster: ${unversionedMutable.join(', ')}`);
for(const critical of ['catalog-resilience-v2120.js','app.js','status-v1300.js','backup-v1304.js']){
  const ref=mutableRefs.find(path=>path.split('?')[0]===critical);
  if(!ref)fail(`Critical mutable asset is not referenced by index.html: ${critical}`);
  if(!/[?&]v=[^&#]+/.test(ref))fail(`Critical mutable asset has no cache-buster: ${critical}`);
}

const catalogPos=index.indexOf('catalog-resilience-v2120.js');
const appPos=index.indexOf('app.js');
const statusPos=index.indexOf('status-v1300.js');
if(catalogPos<0||appPos<0||statusPos<0) fail('Required catalog/app/status scripts are not all referenced by index.html');
if(!(catalogPos<appPos&&appPos<statusPos)) fail('Script order must be catalog-resilience -> app.js -> status-v1300.js');

const statusScript=await read('status-v1300.js');
const version=statusScript.match(/const APP_VERSION='([^']+)'/)?.[1];
if(!version||!/^\d+\.\d+\.\d+$/.test(version)) fail(`Visible app version must use numeric x.y.z format; found ${version||'none'}`);
if(!/i18n-v13017\.js\?v=[^'\"\s]+/.test(statusScript))fail('i18n layer is not loaded with an explicit cache-buster');
for(const marker of ['installLegacyLauncherObserverBridge','__arcLegacyLauncherObserverBridge','installIdempotentI18nDomWrites','__arcI18nIdempotentDomWrites']){
  if(!statusScript.includes(marker))fail(`FR/ES observer stability marker missing: ${marker}`);
}
for(const marker of ['installLogoHomeButton','goHomeFromLogo','spawnCloseExpanded','data-home-button']){
  if(!statusScript.includes(marker))fail(`Logo home-button safety marker missing: ${marker}`);
}
if(!statusScript.includes("loading:'DONNÉES // CHARGEMENT…'")||!statusScript.includes("loading:'DATOS // CARGANDO…'"))fail('Native FR/ES data-status copies are missing');
try{await access(new URL('i18n-v13017.js',root),constants.F_OK)}catch{fail('i18n-v13017.js is missing')}

const i18nScript=await read('i18n-v13017.js');
for(const marker of ["const SUPPORTED=['en','de','fr','es']","arcUiLanguage","Choose your language","Prêt pour votre prochain raid ?","¿Listo para tu próxima incursión?"]){
  if(!i18nScript.includes(marker))fail(`i18n safety marker missing: ${marker}`);
}

const catalogScript=await read('catalog-resilience-v2120.js');
for(const marker of ['window.__arcCatalogMeta','SNAPSHOT_URL','Ramas-Snapshot','github-partial','local-fallback']){
  if(!catalogScript.includes(marker)) fail(`Catalog resilience marker missing: ${marker}`);
}
