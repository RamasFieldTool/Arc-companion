import {chromium,expect} from 'playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
items.find(i=>i.id==='metal_parts').imageFilename='https://cdn.arctracker.io/items/v2/metal_parts.png';
items.find(i=>i.id==='wires').imageFilename='https://cdn.arctracker.io/items/v2/wires.png';
items.push({id:'anvil_blueprint',name:{en:'Anvil Blueprint',de:'Anvil Bauplan'},imageFilename:'https://cdn.arctracker.io/items/v2/anvil_blueprint.png',type:'Blueprint',rarity:'Common'});
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/image_lists_test.json';
const quest={id:'image_lists_test',name:{en:'Image lists test',de:'Bildlisten-Test'},requiredItemIds:[{itemId:'metal_parts',quantity:3}],grantedItemIds:[{itemId:'metal_parts',quantity:4}],rewardItemIds:[{itemId:'metal_parts',quantity:5}],objectives:[]};
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#888"/></svg>';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
for(const locale of ['de','en','fr','es','it'])for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:850}});
 await context.addInitScript(locale=>{
  if(sessionStorage.getItem('image-lists-seeded'))return;sessionStorage.setItem('image-lists-seeded','1');
  localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0');
  localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcPlanningPersonal',JSON.stringify({metal_parts:{itemId:'metal_parts',target:8,status:'active'},wires:{itemId:'wires',target:9,status:'paused'}}));
  localStorage.setItem('arcOwned','{"metal_parts":2}');localStorage.setItem('arcActiveGoals','{"image_bench:1":true}');localStorage.setItem('arcQuestStatus','{"image_lists_test":"active"}');
 },locale);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await installItemCatalogRoute(page,items);
 await page.route('**/goals.json*',r=>r.fulfill({json:[{id:'image_bench',en:'Image bench',de:'Bildwerkstatt',levels:[{level:1,requirements:[{itemId:'metal_parts',quantity:4}]}]}]}));
 await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[{type:'file',name:'image_lists_test.json',download_url:questUrl}]}));
 await page.route(questUrl,r=>r.fulfill({json:quest}));
 let failedImages=0;
 await page.route('https://cdn.arctracker.io/items/**',r=>{if(r.request().url().includes('/wires.')){failedImages++;return r.fulfill({status:404,body:'missing'})}return r.fulfill({contentType:'image/svg+xml',body:svg})});
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.RFTPlanningUI&&document.querySelector('#dataStatusPersistent')?.dataset.state==='live');
 const pictured=async locator=>{const image=locator.locator('.item-thumbnail').first();await expect.poll(async()=>{if(!await image.isVisible())return false;try{return await image.evaluate(i=>{i.scrollIntoView({block:'center'});return i.complete&&i.naturalWidth>0})}catch(e){if(e.message.includes('not attached'))return false;throw e}}).toBe(true);await expect(image).toHaveAttribute('alt','')};
 const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2),`${locale}/${width} overflow`);
 await page.locator('[data-app-target="planningSection"]').click();
 await pictured(page.locator('[data-plan-item="metal_parts"]'));
 assert.deepEqual(await page.evaluate(()=>{const r=RFTPlanning.rows().find(r=>r.itemId==='metal_parts');return [r.required,r.owned,r.missing]}),[15,2,13]);
 await page.locator('#planningRaidFinished').click();await pictured(page.locator('[data-found-name="metal_parts"]'));await page.locator('[data-raid-find="metal_parts"]').fill('3');await page.locator('[data-raid-apply]').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('arcOwned')).metal_parts),5);
 await page.locator('#planningTabGoals').click();await pictured(page.locator('[data-personal="metal_parts"]'));
 const failedRow=page.locator('[data-personal="wires"]');await failedRow.scrollIntoViewIfNeeded();await expect.poll(()=>failedImages).toBeGreaterThan(0);await expect(failedRow.locator('.item-thumbnail')).toHaveCount(0);await expect(failedRow.locator('[data-personal-stock]')).toBeVisible();
 await page.locator('#planningPersonalItem').selectOption('metal_parts');await pictured(page.locator('#planningSelectedImage'));
 for(const surface of ['light','black'])for(const accent of ['orange','amber','green','cyan']){await page.evaluate(({surface,accent})=>{document.documentElement.dataset.surface=surface;document.documentElement.dataset.theme=surface==='light'?'light':'dark';document.documentElement.dataset.accent=accent},{surface,accent});await noOverflow()}
 await page.locator('[data-goal-category="workshop"]').click();await page.locator('.goal-station>summary').first().click();await pictured(page.locator('.workshop-materials [data-item-label="metal_parts"]').first());await noOverflow();
 await page.locator('[data-goal-category="quests"]').click();await pictured(page.locator('.quest-material-line'));await page.locator('.quest-details>summary').first().click();await expect(page.locator('.quest-mini [data-item-label="metal_parts"] .item-thumbnail')).toHaveCount(2);await noOverflow();
 // Legacy total requirements also remain decorated without changing stock inputs.
 await expect(page.locator('#summary [data-item-label="metal_parts"] .item-thumbnail')).toHaveCount(1);
 await page.locator('#appBack').click();await page.locator('[data-app-target="blueprintDrawer"]').click();await pictured(page.locator('.blueprint-row[data-id="anvil"]'));await noOverflow();
 await page.locator('#appBack').click();await page.locator('[data-app-target="planningSection"]').click();await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.RFTPlanningUI);await pictured(page.locator('[data-plan-item="metal_parts"]'));
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('arcOwned')).metal_parts),5);
 if(locale==='de')await page.screenshot({path:`test-artifacts/all-item-images-${width}.png`});
 assert.deepEqual(errors,[]);console.log(`PASS planning, goals, raid stock, picker, workshop, quest items, summary, blueprint and reload ${locale}/${width}`);await context.close();
}
}finally{await browser.close()}
