import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';

const catalog=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const supplement=JSON.parse(await readFile(new URL('../catalog-data/souls-offering-items-2-3-0.json',import.meta.url),'utf8')).items;
const baseItems=catalog.filter(item=>!supplement.some(addition=>addition.id===item.id)).slice(0,8);
const ids=supplement.map(item=>item.id);
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext();
 await context.addInitScript(()=>{localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1')});
 const page=await context.newPage();
 await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
 await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
 await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
 await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
 await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/live-events-data/live-events.json',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
 await page.route('https://raw.githubusercontent.com/RaidTheory/arcraiders-data/2a4abebb2486a633070f4e260058bcd5ad4511d6/bots.json',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
 await installItemCatalogRoute(page,baseItems,'live');
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(ids=>ids.every(id=>window.itemById?.(id)),ids);
 const result=await page.evaluate(ids=>({
   source:window.__arcCatalogMeta?.source,
   manualSupplemental:window.__arcCatalogMeta?.manualSupplemental,
   items:ids.map(id=>{const item=window.itemById(id);return {id,name:item.name?.de||item.name?.en,image:window.RFTItemImages?.source(item)||'',recipe:item.recipe,recyclesInto:item.recyclesInto}})
 }),ids);
 assert.equal(result.source,'mahcks');
 assert.equal(result.manualSupplemental,7);
 assert.deepEqual(result.items.map(item=>item.id),ids);
 assert.ok(result.items.every(item=>item.name&&item.image===''&&!item.recipe&&!item.recyclesInto));
 const table=JSON.parse(await readFile(new URL('../outpost-catalog.json',import.meta.url),'utf8')).furniture.find(item=>item.id==='offering_display_table');
 assert.ok(table);assert.deepEqual(table.craft,[]);assert.equal(table.research,null);
 await context.close();

 const offlineContext=await browser.newContext();
 await offlineContext.addInitScript(()=>{localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1')});
 const offline=await offlineContext.newPage();
 await offline.route('https://fonts.googleapis.com/**',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
 await offline.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
 await offline.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
 await offline.route('https://api.github.com/repos/RamasFieldTool/Arc-companion/live-events-data/live-events.json',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
 await offline.route('https://raw.githubusercontent.com/RaidTheory/arcraiders-data/2a4abebb2486a633070f4e260058bcd5ad4511d6/bots.json',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
 await offline.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
 await installItemCatalogRoute(offline,baseItems,'fallback');
 await offline.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await offline.waitForFunction(ids=>document.querySelector('#dataStatusPersistent')?.dataset.state==='fallback'&&ids.every(id=>window.itemById?.(id)),ids);
 const fallback=await offline.evaluate(ids=>ids.map(id=>({id,source:window.RFTItemImages?.source(window.itemById(id))||''})),ids);
 assert.deepEqual(fallback.map(item=>item.id),ids);
 assert.ok(fallback.every(item=>item.source===''));
 console.log('PASS Souls Offering live merge and offline fallback retain all seven records without unverified images or recipes');
 await offlineContext.close();
}finally{await browser.close()}
