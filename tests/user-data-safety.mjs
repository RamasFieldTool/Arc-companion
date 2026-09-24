import { chromium } from 'playwright';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const goals=JSON.parse(await readFile(new URL('../goals.json',import.meta.url),'utf8'));
const blueprints=JSON.parse(await readFile(new URL('../blueprints.json',import.meta.url),'utf8'));
if(!Array.isArray(items)||!items.length) throw new Error('items.json fixture missing');
if(!Array.isArray(goals)||!goals.length) throw new Error('goals.json fixture missing');
if(!Array.isArray(blueprints)||!blueprints.length) throw new Error('blueprints.json fixture missing');

const fixtureItems=items.slice(0,Math.min(items.length,60));
const firstItem=fixtureItems[0];
const firstGoal=goals[0];
const firstBlueprint=blueprints[0];
const jsonKeys=new Set(['arcOwned','arcActiveGoals','arcQuestStatus','arc_blueprints_learned_v1','arcNextRaid','arcEventReminders']);
const trackedKeys=[
  'arcLang','arcTheme','arcPaletteSurface','arcPaletteAccent','arcOwned','arcActiveGoals','arcQuestStatus',
  'arc_blueprints_learned_v1','arcNextRaid','arcEventRegion','arcEventLead','arcEventReminders'
];

const seed={
  arcLang:'en',
  arcTheme:'dark',
  arcPaletteSurface:'black',
  arcPaletteAccent:'cyan',
  arcOwned:JSON.stringify({[firstItem.id]:42}),
  arcActiveGoals:JSON.stringify({[firstGoal.id]:true}),
  arcQuestStatus:JSON.stringify({legacy_quality_gate_quest:'done'}),
  arc_blueprints_learned_v1:JSON.stringify([firstBlueprint.id]),
  arcNextRaid:JSON.stringify({[firstItem.id]:{target:3,done:false}}),
  arcEventRegion:'europe',
  arcEventLead:'15',
  arcEventReminders:JSON.stringify([{key:'quality-gate-reminder',start:'2026-09-25T10:00:00.000Z',end:'2026-09-25T11:00:00.000Z',name:'Quality Gate',map:'Blue Gate',lead:15,notified:false}])
};

function normalizedRaw(raw,key){
  if(raw===null)return null;
  return jsonKeys.has(key)?JSON.parse(raw):raw;
}

async function installHealthyRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url());
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=fixtureItems.slice(offset,offset+limit);
    const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>
    route.fulfill({status:503,contentType:'application/json',body:'{"error":"not needed in healthy test"}'})
  );
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>
    route.fulfill({status:503,contentType:'application/json',body:'{"error":"not needed in healthy test"}'})
  );
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>
    route.fulfill({status:200,contentType:'application/json',body:'[]'})
  );
}

async function waitForLive(page){
  await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});
}

async function storageSnapshot(page){
  return await page.evaluate(({keys,jsonKeys})=>{
    const json=new Set(jsonKeys);
    return Object.fromEntries(keys.map(key=>{
      const raw=localStorage.getItem(key);
      if(raw===null)return [key,null];
      return [key,json.has(key)?JSON.parse(raw):raw];
    }));
  },{keys:trackedKeys,jsonKeys:[...jsonKeys]});
}

function assertDeepEqual(actual,expected,label){
  const a=JSON.stringify(actual);
  const e=JSON.stringify(expected);
  if(a!==e)throw new Error(`${label}: expected ${e}, got ${a}`);
}

async function openBackup(page){
  const homeVisible=await page.locator('#appLauncher').isVisible();
  if(!homeVisible){
    await page.locator('#appBack').click();
    await page.locator('#appLauncher').waitFor({state:'visible'});
  }
  await page.locator('[data-app-target="backupPanel"]').click();
  await page.locator('#backupPanel').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('#backupPanel')?.classList.contains('launcher-active'));
}

async function importFileAndWait(page,filePath,{expectReload=true}={}){
  let dialogSeen=false;
  page.once('dialog',async dialog=>{dialogSeen=true;await dialog.accept();});
  await page.locator('#backupFile').setInputFiles(filePath);
  if(expectReload){
    await page.waitForTimeout(1200);
    await page.waitForLoadState('domcontentloaded');
    await waitForLive(page);
    if(!dialogSeen)throw new Error('Backup import confirmation dialog was not shown');
  }
}

const browser=await chromium.launch({headless:true});
const tempDir=await mkdtemp(join(tmpdir(),'rft-user-data-'));
try{
  const context=await browser.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true});
  await context.addInitScript(seedData=>{
    for(const [key,value] of Object.entries(seedData))localStorage.setItem(key,value);
  },seed);
  const page=await context.newPage();
  const pageErrors=[];
  const unexpectedConsoleErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('console',message=>{
    if(message.type()==='error'&&!message.text().includes('Backup import failed'))unexpectedConsoleErrors.push(message.text());
  });
  await installHealthyRoutes(page);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await waitForLive(page);

  // Upgrade/migration safety: existing local progress must survive booting a newer app build.
  const afterBoot=await storageSnapshot(page);
  for(const key of trackedKeys){
    const expected=normalizedRaw(seed[key]??null,key);
    assertDeepEqual(afterBoot[key],expected,`Startup migration changed ${key}`);
  }
  console.log('PASS existing user data survives app startup/update');

  // Connectivity loss while the app is already open must not destroy local progress or loaded search data.
  await context.setOffline(true);
  await page.locator('[data-app-target="itemsSection"]').click();
  const label=firstItem?.name?.en||firstItem?.name?.de||firstItem.id;
  await page.locator('#q').fill(String(label).slice(0,Math.max(3,Math.min(String(label).length,8))));
  if(await page.locator('#out .card').count()<1)throw new Error('Loaded item catalog became unusable after connection loss');
  const offlineStorage=await storageSnapshot(page);
  assertDeepEqual(offlineStorage,afterBoot,'Connection loss changed persisted user data');
  await context.setOffline(false);
  await page.locator('#appBack').click();
  console.log('PASS active Android session survives connection loss');

  // Real export -> clear -> import round trip.
  await openBackup(page);
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#backupExport').click();
  const download=await downloadPromise;
  const backupPath=join(tempDir,'roundtrip.json');
  await download.saveAs(backupPath);
  const backup=JSON.parse(await readFile(backupPath,'utf8'));
  if(backup.schema!=='ramas-field-tool-backup'||backup.formatVersion!==1)throw new Error('Exported backup schema/version is invalid');
  if(!backup.appVersion.includes('13.0.16'))throw new Error(`Exported backup appVersion is unexpected: ${backup.appVersion}`);
  for(const key of trackedKeys)assertDeepEqual(backup.data[key],afterBoot[key],`Export mismatch for ${key}`);

  await page.evaluate(()=>localStorage.clear());
  await importFileAndWait(page,backupPath);
  const restored=await storageSnapshot(page);
  assertDeepEqual(restored,afterBoot,'Backup round trip did not restore all tracked data');
  console.log('PASS backup export/import round trip restores tracked progress');

  // Same backup format from an older app version must remain importable.
  const oldBackup=structuredClone(backup);
  oldBackup.appVersion='V12.9.0';
  oldBackup.exportedAt='2026-01-01T00:00:00.000Z';
  oldBackup.data.arcOwned={[firstItem.id]:7};
  const oldBackupPath=join(tempDir,'older-app-version.json');
  await writeFile(oldBackupPath,JSON.stringify(oldBackup,null,2));
  await page.evaluate(()=>localStorage.removeItem('arcOwned'));
  await openBackup(page);
  await importFileAndWait(page,oldBackupPath);
  const migratedOwned=await page.evaluate(()=>JSON.parse(localStorage.getItem('arcOwned')||'{}'));
  assertDeepEqual(migratedOwned,oldBackup.data.arcOwned,'Older app-version backup was not restored');
  console.log('PASS older appVersion backup remains compatible when formatVersion is supported');

  // Broken JSON, unsupported formats and prototype-pollution payloads must be rejected without changing data.
  const beforeReject=await storageSnapshot(page);
  await openBackup(page);
  await page.locator('#backupFile').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{ definitely not json')});
  await page.waitForFunction(()=>document.querySelector('#backupStatus')?.classList.contains('is-error'));
  assertDeepEqual(await storageSnapshot(page),beforeReject,'Malformed backup changed user data');

  const unsupported={...backup,formatVersion:999};
  await page.locator('#backupFile').setInputFiles({name:'future.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(unsupported))});
  await page.waitForFunction(()=>document.querySelector('#backupStatus')?.classList.contains('is-error'));
  assertDeepEqual(await storageSnapshot(page),beforeReject,'Unsupported backup version changed user data');

  const polluted=structuredClone(backup);
  polluted.data.arcOwned=JSON.parse('{"__proto__":1,"safe_item":2}');
  await page.locator('#backupFile').setInputFiles({name:'polluted.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(polluted))});
  await page.waitForFunction(()=>document.querySelector('#backupStatus')?.classList.contains('is-error'));
  assertDeepEqual(await storageSnapshot(page),beforeReject,'Rejected prototype-pollution backup changed user data');
  console.log('PASS invalid and unsafe backups are rejected without data loss');

  if(pageErrors.length)throw new Error(`Uncaught browser errors: ${pageErrors.join(' | ')}`);
  if(unexpectedConsoleErrors.length)throw new Error(`Unexpected console errors: ${unexpectedConsoleErrors.join(' | ')}`);
  await context.close();
  console.log('All user-data safety scenarios passed.');
}finally{
  await browser.close();
  await rm(tempDir,{recursive:true,force:true});
}
