import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const titles={de:'FROZEN TRAIL – NEUE INFOS',en:'FROZEN TRAIL – NEW INFORMATION',fr:'FROZEN TRAIL – NOUVELLES INFORMATIONS',es:'FROZEN TRAIL – NUEVA INFORMACIÓN',it:'FROZEN TRAIL – NUOVE INFORMAZIONI'};
const browser=await chromium.launch({headless:true});
try{for(const locale of Object.keys(titles))for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:850}});await context.addInitScript(locale=>{localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcOwned','{"metal_parts":3}');},locale);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await installItemCatalogRoute(page,[{id:'metal_parts',name:{en:'Metal Parts',de:'Metallteile'},value:1,weightKg:1,stackSize:10}]);await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[]}));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4176/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(title=>document.querySelector('#tipsCategories')?.textContent.includes(title),titles[locale]);
 await page.locator('[data-app-target="tipsDrawer"]').click();const update=page.locator('#tipsCategories .tips-category').last();await update.locator('summary').click();
 assert.equal(await update.locator('a').count(),2);assert.equal(await update.locator('a').first().getAttribute('href'),'https://arcraiders.wiki/wiki/Stiletto');assert.ok((await update.innerText()).includes('10/12/14/16'));assert.ok(await update.isVisible());
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2));assert.equal(await page.evaluate(()=>localStorage.getItem('arcOwned')),'{"metal_parts":3}');assert.deepEqual(errors,[]);
 console.log('PASS',locale,width,'localized provenance, visible accordion, links, no overflow, stock unchanged');await context.close();
}}finally{await browser.close();}
