import {chromium,expect} from 'playwright/test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});
const temp=await mkdtemp(join(tmpdir(),'rft-release-'));
try{for(const locale of ['de','en','fr','es','it'])for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:850}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(locale=>{
  if(sessionStorage.getItem('release-seed'))return;sessionStorage.setItem('release-seed','1');
  localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1');
  localStorage.setItem('arcOwned','{"metal_parts":7,"planks":5}');localStorage.setItem('arcActiveGoals','{"weapon_bench:1":true}');
  localStorage.setItem('arcPlanningPersonal','{"planks":{"itemId":"planks","target":2,"status":"active"}}');localStorage.setItem('arcPlanningHistory','[{"test":"existing-progress"}]');
 },locale);
 await page.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await installItemCatalogRoute(page,items);await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[]}));
 const ready=()=>page.waitForFunction(()=>!!window.RFTPlanningUI&&typeof itemById==='function'&&itemById('bantam_i'));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4177/',{waitUntil:'domcontentloaded'});await ready();
 const snapshot=()=>page.evaluate(()=>Object.fromEntries(['arcOwned','arcActiveGoals','arcPlanningPersonal','arcPlanningHistory','arcFrozenTrailIdentities'].map(k=>[k,localStorage.getItem(k)])));
 const initial=await snapshot();assert.equal(initial.arcOwned,'{"metal_parts":7,"planks":5}');
 await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#q').fill('Bantam');
 const card=page.locator('[data-item-id="bantam_i"]').first();await expect(card).toBeVisible();await expect(card).toContainText('Magazine: 8');
 assert.equal(await page.locator('#out .card[data-item-id="bantam_i"]').count(),1);
 await page.locator('#q').fill('Grappling Hook');const grapple=page.locator('#out .card[data-item-id="grappling_hook"]');await expect(grapple).toHaveCount(1);await expect(grapple).toBeVisible();await expect(grapple).toContainText('Utility Station I');await expect(grapple).toContainText('2 Rope');

 await page.locator('#appBack').click();await page.locator('[data-app-target="planningSection"]').click();
 const open=async()=>{await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="workshop"]').click()};await open();
 for(const id of ['rft_outpost_materials','rft_research_station']){
  await page.locator(`.goal-station[data-goal-id="${id}"]>summary`).click();
  const checkbox=page.locator(`input[data-key="${id}:1"]`);await expect(checkbox).not.toBeChecked();await expect(checkbox.locator('..').locator('.workshop-materials')).toContainText('Planks');await checkbox.check();
 }
 await page.locator('.goal-station[data-goal-id="weapon_bench"]>summary').click();
 const smith4=page.locator('input[data-key="weapon_bench:4"]');await expect(smith4).not.toBeChecked();await expect(smith4.locator('..').locator('.workshop-materials')).toContainText('Radial Press');await smith4.check();
 await page.locator('.goal-station[data-goal-id="rft_grappling_hook_craft"]>summary').click();const craft=page.locator('input[data-key="rft_grappling_hook_craft:1"]');await expect(craft.locator('..').locator('.workshop-materials')).toContainText('Rope');await craft.check();
 const newRows=await page.evaluate(()=>RFTPlanning.rows({all:true}));assert.equal(newRows.find(r=>r.itemId==='radial_press').required,3);assert.equal(newRows.find(r=>r.itemId==='emperor_modulator').required,1);assert.equal(newRows.find(r=>r.itemId==='rope').required,2);assert.equal(newRows.filter(r=>r.itemId==='rope').length,1);
 await craft.uncheck();assert.equal(await page.evaluate(()=>RFTPlanning.rows({all:true}).some(r=>r.itemId==='rope')),false);await craft.check();
 const row=await page.evaluate(()=>RFTPlanning.rows({all:true}).find(r=>r.itemId==='planks'));assert.equal(row.required,40);assert.equal(row.owned,5);assert.equal(row.missing,35);
 assert.equal(await page.evaluate(()=>RFTPlanning.rows({all:true}).filter(r=>r.itemId==='planks').length),1);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2));
 const selected=await snapshot();await page.reload({waitUntil:'domcontentloaded'});await ready();assert.deepEqual(await snapshot(),selected);
 await open();await page.locator('.goal-station[data-goal-id="rft_outpost_materials"]>summary').click();await page.locator('input[data-key="rft_outpost_materials:1"]').uncheck();
 assert.equal(await page.evaluate(()=>RFTPlanning.rows({all:true}).find(r=>r.itemId==='planks').required),37);
 if(locale==='en'&&width===360){
  const state=await snapshot();
  await page.unroute('https://arcdata.mahcks.com/v1/items**');
  await installItemCatalogRoute(page,[...items,{id:'changed_api_planks',name:{en:'Planks'},value:123,weightKg:0.1,stackSize:50}]);
  await page.reload({waitUntil:'domcontentloaded'});await ready();assert.deepEqual(await snapshot(),state);
  assert.equal(await page.evaluate(()=>itemById('planks').value),123);
  assert.equal(await page.evaluate(()=>items.filter(i=>i.name?.en==='Planks').length),1);
  assert.equal(await page.evaluate(()=>RFTPlanning.rows({all:true}).find(r=>r.itemId==='planks').owned),5);
  await page.unroute('https://arcdata.mahcks.com/v1/items**');await installItemCatalogRoute(page,items);
  await page.reload({waitUntil:'domcontentloaded'});await ready();assert.deepEqual(await snapshot(),state);
  const before=await snapshot();await page.locator('#appBack').click();await page.locator('[data-app-target="backupPanel"]').click();
  const download=page.waitForEvent('download');await page.locator('#backupExport').click();const path=join(temp,'new-data.json');await(await download).saveAs(path);
  await page.evaluate(()=>localStorage.clear());page.once('dialog',d=>d.accept());const reloaded=page.waitForNavigation({waitUntil:'domcontentloaded'});await page.locator('#backupFile').setInputFiles(path);await reloaded;await ready();assert.deepEqual(await snapshot(),before);
  const bad=JSON.parse(await readFile(path,'utf8'));bad.data.arcFrozenTrailIdentities={planks:'duplicate',sheet_metal:'duplicate'};
  await page.locator('#appBack').click();await page.locator('[data-app-target="backupPanel"]').click();
  await page.locator('#backupFile').setInputFiles({name:'bad-identities.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
  await page.waitForFunction(()=>document.querySelector('#backupStatus')?.classList.contains('is-error'));assert.deepEqual(await snapshot(),before);
 }
 assert.deepEqual(errors,[]);console.log('PASS',locale,width,'new item search, visible material costs, shared stock, no duplicate collection rows, selection/removal, reload'+(locale==='en'&&width===360?', new-ID backup/restore':''));await context.close();
}}finally{await browser.close();await rm(temp,{recursive:true,force:true});}
