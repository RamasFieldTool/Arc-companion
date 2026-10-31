import {chromium} from 'playwright';
import {mkdir,readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const fixture=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,60);
const furniture=JSON.parse(await readFile(new URL('../outpost-catalog.json',import.meta.url),'utf8')).furniture;
await mkdir('test-artifacts/outpost-reference',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:900}});
 await context.addInitScript(()=>{localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('outpostReferenceSafety','unchanged');localStorage.setItem('arcOwned','{"metal_parts":7}');localStorage.setItem('arcPlanningMigrationV1','1')});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await installItemCatalogRoute(page,fixture,'live');
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#outpostDesignResearchReference',{state:'attached'});
 for(const [code,title] of [['de','Aussenposten – Ausbaukosten'],['en','Outpost expansion costs'],['fr','Coûts d’extension de l’Outpost'],['es','Costes de ampliación del Outpost'],['it','Costi di espansione dell’Outpost']]){
  if(code!=='de'){await page.locator('#appBack').click();await page.locator('#arcLanguageButton').click();await page.locator(`#arcLanguageMenu [data-arc-language="${code}"]`).click()}
  await page.locator('[data-app-target="outpostSection"]').click();
  await page.waitForFunction(title=>document.querySelector('#outpostExpansionReference summary')?.textContent===title,title);
  for(const [id,count] of [['outpostExpansionReference',3],['outpostDesignResearchReference',8],['outpostGadgetRecipeReference',2],['outpostFurnitureCraftReference',4]]){
   await page.locator('#'+id).evaluate(n=>{n.open=true});
   if(await page.locator('#'+id+' li').count()!==count)throw Error('Incorrect row count '+id);
  }
  if(!(await page.locator('#outpostDesignResearchReference').textContent()).includes('Barstool Design · Research Station 1 · 500'))throw Error('Research data absent');
  if(await page.locator('#outpostWeaponRecipeReference').count())throw Error('Weapon recipes still rendered in Outpost');
  await page.waitForSelector('#outpostCatalogList details',{state:'attached'});
  if(await page.locator('#outpostCatalogList details').count()!==furniture.length)throw Error('Full catalog incomplete');
  await page.locator('#outpostCatalogSearch').fill('barstool');
  if(await page.locator('#outpostCatalogList details').count()!==1)throw Error('Catalog search failed');
  await page.locator('#outpostCatalogList details').evaluate(n=>{n.open=true});
  if(!(await page.locator('#outpostCatalogList .outpost-craft').textContent()).includes('4 '))throw Error('Craft cost missing');
  if(!(await page.locator('#outpostCatalogList .outpost-research').textContent()).includes('500'))throw Error('Research cost missing');
  await page.locator('#outpostCatalogSearch').fill('');
  await page.locator('#outpostCatalogCategory').selectOption('Wardrobe');
  if(await page.locator('#outpostCatalogList details').count()!==5)throw Error('Category filter failed');
  await page.locator('#outpostCatalogCategory').selectOption('');
  await page.waitForFunction(()=>typeof itemById==='function'&&itemById('pressure_regulator'));
  if(await page.evaluate(()=>localStorage.getItem('arcOwned'))!=='{"metal_parts":7}')throw Error('Stock changed');
  if(!(await page.locator('#outpostGadgetRecipeReference').textContent()).includes('2 Steel Cable · 1 Advanced Electrical Components · 1 Calculator · Utility Station II'))throw Error('Gadget recipe missing');
  if(!(await page.locator('#outpostFurnitureCraftReference').textContent()).includes('Barstool: 4 Fabric · 8 Sheet Metal'))throw Error('Furniture craft mixed with research');
  if(!(await page.locator('#outpostDesignResearchReference').textContent()).includes('15 Metal Parts'))throw Error('Research changed');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))throw Error('Page overflow');
  if(await page.evaluate(()=>localStorage.getItem('outpostReferenceSafety'))!=='unchanged')throw Error('Storage probe changed');
  await page.screenshot({path:`test-artifacts/outpost-reference/${code}-${width}.png`,fullPage:true});
 }
 if(errors.length)throw Error(errors.join('\n'));
 await context.close();
}
console.log('PASS Outpost reference tables: five languages × two widths; expansion/research rows, no weapon recipe section, no overflow, storage probe, no page errors');
}finally{await browser.close()}
