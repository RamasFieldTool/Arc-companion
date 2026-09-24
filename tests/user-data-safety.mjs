import { chromium } from 'playwright';
import { mkdtemp,readFile,rm,writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const goals=JSON.parse(await readFile(new URL('../goals.json',import.meta.url),'utf8'));
const blueprints=JSON.parse(await readFile(new URL('../blueprints.json',import.meta.url),'utf8'));
if(!items.length||!goals.length||!blueprints.length)throw new Error('Safety fixtures are incomplete');

const fixtureItems=items.slice(0,Math.min(items.length,60));
const firstItem=fixtureItems[0];
const firstGoal=goals[0];
const firstBlueprint=blueprints[0];
const firstGoalKey=`${firstGoal.id}:${firstGoal.levels?.[0]?.level}`;
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_user_data.json';
const quest={id:'quality_gate_user_data',name:{de:'Nutzerdatentest',en:'User data test'},trader:'Test',objectives:[{de:'Test',en:'Test'}],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};
const jsonKeys=new Set(['arcOwned','arcActiveGoals','arcQuestStatus','arc_blueprints_learned_v1','arcNextRaid','arcEventReminders']);
const trackedKeys=['arcLang','arcTheme','arcPaletteSurface','arcPaletteAccent','arcOwned','arcActiveGoals','arcQuestStatus','arc_blueprints_learned_v1','arcNextRaid','arcEventRegion','arcEventLead','arcEventReminders'];
const seed={
  arcLang:'en',arcTheme:'dark',arcPaletteSurface:'black',arcPaletteAccent:'cyan',
  arcOwned:JSON.stringify({[firstItem.id]:42}),arcActiveGoals:JSON.stringify({[firstGoalKey]:true}),
  arcQuestStatus:JSON.stringify({quality_gate_user_data:'done'}),arc_blueprints_learned_v1:JSON.stringify([firstBlueprint.id]),
  arcNextRaid:JSON.stringify({[firstItem.id]:{target:3,done:false}}),arcEventRegion:'europe',arcEventLead:'15',
  arcEventReminders:JSON.stringify([{key:'quality-gate-reminder',start:'2026-09-25T10:00:00.000Z',end:'2026-09-25T11:00:00.000Z',name:'Quality Gate',map:'Blue Gate',lead:15,notified:false}])
};

const norm=(raw,key)=>raw===null?null:(jsonKeys.has(key)?JSON.parse(raw):raw);
const equal=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw new Error(`${label}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`)};

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url());
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0),limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=fixtureItems.slice(offset,offset+limit);
    const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'quality_gate_user_data.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}
async function waitReady(page){await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});}
async function snapshot(page){return page.evaluate(({keys,json})=>Object.fromEntries(keys.map(key=>{const raw=localStorage.getItem(key);return [key,raw===null?null:(json.includes(key)?JSON.parse(raw):raw)]})),{keys:trackedKeys,json:[...jsonKeys]});}
async function openBackup(page){
  if(!(await page.locator('#appLauncher').isVisible())){await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});}
  await page.locator('[data-app-target="backupPanel"]').click();
  await page.waitForFunction(()=>document.querySelector('#backupPanel')?.classList.contains('launcher-active'));
}
async function importBackup(page,path){
  let confirmed=false;
  page.once('dialog',async dialog=>{confirmed=true;await dialog.accept();});
  await page.locator('#backupFile').setInputFiles(path);
  await page.waitForTimeout(1200);
  await page.waitForLoadState('domcontentloaded');
  await waitReady(page);
  if(!confirmed)throw new Error('Backup confirmation was not shown');
}

const browser=await chromium.launch({headless:true});
const temp=await mkdtemp(join(tmpdir(),'rft-user-data-'));
try{
  const context=await browser.newContext({viewport:{width:412,height:915},screen:{width:412,height:915},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 16; RamasFieldToolSafetyTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'});
  await context.addInitScript(data=>{if(sessionStorage.getItem('__rft_seeded')==='1')return;for(const [k,v] of Object.entries(data))localStorage.setItem(k,v);sessionStorage.setItem('__rft_seeded','1');},seed);
  const page=await context.newPage();
  const pageErrors=[],consoleErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Backup import failed'))consoleErrors.push(m.text())});
  await installRoutes(page);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});await waitReady(page);

  const initial=await snapshot(page);
  for(const key of trackedKeys)equal(initial[key],norm(seed[key]??null,key),`Startup/update changed ${key}`);
  console.log('PASS existing user data survives app startup/update');

  await context.setOffline(true);
  await page.locator('[data-app-target="itemsSection"]').click();
  const label=firstItem?.name?.en||firstItem?.name?.de||firstItem.id;
  await page.locator('#q').fill(String(label).slice(0,8));
  if(await page.locator('#out .card').count()<1)throw new Error('Loaded catalog became unusable after connection loss');
  equal(await snapshot(page),initial,'Connection loss changed persisted user data');
  await context.setOffline(false);await page.locator('#appBack').click();
  console.log('PASS active Android session survives connection loss');

  await openBackup(page);
  const downloadPromise=page.waitForEvent('download');await page.locator('#backupExport').click();
  const download=await downloadPromise,backupPath=join(temp,'roundtrip.json');await download.saveAs(backupPath);
  const backup=JSON.parse(await readFile(backupPath,'utf8'));
  if(backup.schema!=='ramas-field-tool-backup'||backup.formatVersion!==1||!backup.appVersion.includes('13.0.17'))throw new Error('Export metadata invalid');
  for(const key of trackedKeys)equal(backup.data[key],initial[key],`Export mismatch for ${key}`);
  await page.evaluate(()=>localStorage.clear());await importBackup(page,backupPath);
  equal(await snapshot(page),initial,'Backup round trip did not restore tracked data');
  console.log('PASS backup export/import round trip restores tracked progress');

  const old={...backup,appVersion:'V12.9.0',exportedAt:'2026-01-01T00:00:00.000Z',data:{...backup.data,arcOwned:{[firstItem.id]:7}}};
  const oldPath=join(temp,'older-version.json');await writeFile(oldPath,JSON.stringify(old));
  await openBackup(page);await importBackup(page,oldPath);
  equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('arcOwned')||'{}')),old.data.arcOwned,'Older app-version backup was not restored');
  console.log('PASS older appVersion backup remains compatible when formatVersion is supported');

  const beforeReject=await snapshot(page);await openBackup(page);
  await page.locator('#backupFile').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{ broken')});
  await page.waitForFunction(()=>document.querySelector('#backupStatus')?.classList.contains('is-error'));equal(await snapshot(page),beforeReject,'Malformed backup changed data');
  const unsupported={...backup,formatVersion:999};
  await page.locator('#backupFile').setInputFiles({name:'future.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(unsupported))});
  await page.waitForFunction(()=>document.querySelector('#backupStatus')?.classList.contains('is-error'));equal(await snapshot(page),beforeReject,'Unsupported backup changed data');
  const polluted=structuredClone(backup);polluted.data.arcOwned=JSON.parse('{"__proto__":1,"safe":2}');
  await page.locator('#backupFile').setInputFiles({name:'polluted.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(polluted))});
  await page.waitForFunction(()=>document.querySelector('#backupStatus')?.classList.contains('is-error'));equal(await snapshot(page),beforeReject,'Unsafe backup changed data');
  console.log('PASS invalid and unsafe backups are rejected without data loss');

  if(pageErrors.length)throw new Error(`Uncaught browser errors: ${pageErrors.join(' | ')}`);
  if(consoleErrors.length)throw new Error(`Unexpected console errors: ${consoleErrors.join(' | ')}`);
  await context.close();console.log('All user-data safety scenarios passed.');
}finally{await browser.close();await rm(temp,{recursive:true,force:true});}
