import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import fs from 'node:fs';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const base=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(fs.readFileSync('items.json'));
const browser=await chromium.launch({headless:true});
try{
 for(const width of [360,412,430,932]){
 const page=await browser.newPage({viewport:{width,height:width===932?430:915},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(sessionStorage.getItem('weaponSeed'))return;sessionStorage.setItem('weaponSeed','1');localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcOwned',JSON.stringify({advanced_mechanical_components:1}));localStorage.setItem('arcPlanningPersonal',JSON.stringify({metal_parts:{itemId:'metal_parts',target:7,status:'active'}}));localStorage.setItem('rftAmplifiedPlansV1','{}')});
 await installItemCatalogRoute(page,items);
 await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:503,body:'{}'}));
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.RFTPlanning&&window.RFTWeaponPlanner?.data&&window.RFTAmplifiedPlanner);
 const tile=page.locator('[data-app-target=weaponPlannerSection]');assert(await tile.isVisible());await tile.click();assert(await page.locator('#weaponPlannerSection').isVisible());assert.equal(await page.locator('#weaponChoice option').count(),26);
 await page.selectOption('#weaponChoice','anvil');await page.selectOption('#weaponTo','anvil_iv');assert.equal(await page.locator('#weaponTotals [data-item-id=advanced_mechanical_components]').getAttribute('data-quantity'),'4');assert.equal(await page.locator('#weaponTotals [data-item-id=heavy_gun_parts]').getAttribute('data-quantity'),'3');
 await page.click('#weaponSave');let rows=await page.evaluate(()=>window.RFTPlanning.rows({all:true}));assert.equal(rows.find(r=>r.itemId==='advanced_mechanical_components').required,4);assert.equal(rows.find(r=>r.itemId==='advanced_mechanical_components').missing,3);assert.equal(rows.find(r=>r.itemId==='metal_parts').required,7);
 await page.click('#weaponSave');rows=await page.evaluate(()=>window.RFTPlanning.rows({all:true}));assert.equal(rows.find(r=>r.itemId==='heavy_gun_parts').required,3);
 await page.selectOption('#weaponTo','anvil_amplified');assert(await page.locator('#rftAmplifiedPlanner').isVisible());await page.locator('#rftAmplifiedPlanner fieldset input:not([disabled])').first().check();await page.waitForFunction(()=>document.querySelectorAll('#weaponTotals li[data-item-id]').length>=4);await page.click('#weaponSave');assert.equal(await page.locator('#weaponTotals [data-item-id=amplification_module_mk_iii]').getAttribute('data-quantity'),'1');
 await page.reload();await page.waitForFunction(()=>window.RFTPlanning&&window.RFTWeaponPlanner?.data);assert((await page.locator('#weaponSaved').innerText()).includes('Amplified'));assert((await page.evaluate(()=>window.RFTPlanning.rows({all:true}))).some(r=>r.itemId==='amplification_module_mk_iii'));
 await page.locator('#weaponSaved button').first().click();assert.equal(await page.locator('#weaponTo').inputValue(),'anvil_amplified');
 if(width===360){
  const downloadEvent=page.waitForEvent('download');await page.evaluate(()=>document.getElementById('backupExport').click());const download=await downloadEvent;const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert(exported.data.rftWeaponPlansV1.anvil.research);assert.equal(exported.data.rftWeaponPlansV1.anvil.to,'anvil_amplified');
  await page.evaluate(()=>localStorage.setItem('rftWeaponPlansV1','{}'));page.once('dialog',dialog=>dialog.accept());const reloaded=page.waitForEvent('load');await page.locator('#backupFile').setInputFiles({name:'weapon-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await reloaded;await page.waitForFunction(()=>JSON.parse(localStorage.getItem('rftWeaponPlansV1')||'{}').anvil?.to==='anvil_amplified');await page.waitForFunction(()=>window.RFTWeaponPlanner?.data&&window.RFTPlanning);if(await tile.isVisible())await tile.click();await page.locator('#weaponSaved button').first().click();
 }
 if(width===412){fs.mkdirSync('test-artifacts/weapon-planner',{recursive:true});await page.screenshot({path:'test-artifacts/weapon-planner/mobile-412.png',fullPage:true})}
 // Source gaps must never enable saving a partial/zero-cost plan.
 await page.evaluate(()=>{const f=window.RFTWeaponPlanner.data.families.find(f=>f.id==='anvil');f.transitions[0].materials=null});await page.selectOption('#weaponFrom','anvil_i');assert(await page.locator('#weaponSave').isDisabled());assert(await page.locator('#weaponPlannerBody [role=alert]').count());
 await page.selectOption('#weaponChoice','dolabra');assert.equal(await page.locator('#weaponTo option').count(),1);assert(await page.locator('#weaponSave').isDisabled());
 await page.selectOption('#weaponChoice','bantam');await page.selectOption('#weaponTo','bantam_iv');assert.equal(await page.locator('#weaponTotals [data-item-id=mechanical_components]').getAttribute('data-quantity'),'10');
 for(const lang of ['de','en','fr','es','it'])for(const surface of ['light','black']){
  await page.evaluate(({lang,surface})=>{localStorage.setItem('arcUiLanguage',lang);localStorage.setItem('arcLang',lang);document.documentElement.dataset.surface=surface;window.dispatchEvent(new Event('arc-language-change'))},{lang,surface});
  assert(await page.locator('#weaponChoice').isVisible());assert((await page.locator('#weaponPlannerSection h2').textContent()).length>0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'overflow '+width+' '+lang+' '+surface);
 }
 // Search/filter and empty-result recovery.
 await page.locator('#weaponPlannerBody input[type=search]').fill('zzzzzzzz');assert.equal(await page.locator('#weaponChoice option').count(),0);await page.locator('#weaponPlannerBody input[type=search]').fill('');assert.equal(await page.locator('#weaponChoice option').count(),26);
 await page.locator('#weaponPlannerBody .weapon-filters select').first().selectOption('Hand Cannon');assert.equal(await page.locator('#weaponChoice option').count(),2);
 await page.click('#appBack');assert(await tile.isVisible());await page.goBack();await page.waitForTimeout(50);assert(await page.locator('#weaponPlannerSection').isVisible());
 await page.click('#appBack');await page.locator('[data-app-target=planningSection]').click();assert(await page.locator('#planningSection').isVisible());
 assert.deepEqual(errors,[]);await page.close();console.log('PASS weapon planner Android emulation '+width+'px: sum, owned, planning, idempotence, persistence, amplified, missing cost, search/filter, five languages, two themes, back');
 }
}finally{await browser.close()}
