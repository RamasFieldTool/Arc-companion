import {chromium} from 'playwright';
import {mkdir,readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const fixture=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,60);
await mkdir('test-artifacts/outpost-reference',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:900}});
 await context.addInitScript(()=>{localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('outpostReferenceSafety','unchanged')});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await installItemCatalogRoute(page,fixture,'live');
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#outpostDesignResearchReference',{state:'attached'});
 for(const [code,title] of [['de','Aussenposten – Ausbaukosten'],['en','Outpost expansion costs'],['fr','Coûts d’extension de l’Outpost'],['es','Costes de ampliación del Outpost'],['it','Costi di espansione dell’Outpost']]){
  if(code!=='de'){await page.locator('#appBack').click();await page.locator('#arcLanguageButton').click();await page.locator(`#arcLanguageMenu [data-arc-language="${code}"]`).click()}
  await page.locator('[data-app-target="outpostSection"]').click();
  await page.waitForFunction(title=>document.querySelector('#outpostExpansionReference summary')?.textContent===title,title);
  for(const [id,count] of [['outpostExpansionReference',3],['outpostDesignResearchReference',8],['outpostWeaponRecipeReference',3]]){
   await page.locator('#'+id).evaluate(n=>{n.open=true});
   if(await page.locator('#'+id+' li').count()!==count)throw Error('Incorrect row count '+id);
  }
  if(!(await page.locator('#outpostDesignResearchReference').textContent()).includes('Barstool Design · Research Station 1 · 500'))throw Error('Research data absent');
  if(!(await page.locator('#outpostWeaponRecipeReference').textContent()).includes('MetaForge I'))throw Error('Anvil conflict absent');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))throw Error('Page overflow');
  if(await page.evaluate(()=>localStorage.getItem('outpostReferenceSafety'))!=='unchanged')throw Error('Storage probe changed');
  await page.screenshot({path:`test-artifacts/outpost-reference/${code}-${width}.png`,fullPage:true});
 }
 if(errors.length)throw Error(errors.join('\n'));
 await context.close();
}
console.log('PASS Outpost reference tables: five languages × two widths; expansion/research/weapon rows, source conflict, no overflow, storage probe, no page errors');
}finally{await browser.close()}
