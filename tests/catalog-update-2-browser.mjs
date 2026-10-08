import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const fixtures=[{id:'anvil_i',name:{en:'Anvil I',de:'Anvil I'},rarity:'Uncommon',value:5000,weightKg:5,stackSize:1},{id:'anvil_splitter',name:{en:'Anvil Splitter',de:'Anvil Splitter'},rarity:'Legendary',value:1,weightKg:1,stackSize:1,recyclesInto:{processor:1,mod_components:1}},{id:'snap_hook',name:{en:'Snap Hook',de:'Snap Hook'},value:1,weightKg:1,stackSize:1},{id:'heavy_shield',name:{en:'Heavy Shield',de:'Heavy Shield'},value:1,weightKg:1,stackSize:1}];
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
try{for(const locale of ['de','en','fr','es','it'])for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:850}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.addInitScript(locale=>{if(localStorage.getItem('testSeed'))return;localStorage.setItem('testSeed','1');localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcOwned','{"anvil_splitter":2}');},locale);
 await installItemCatalogRoute(page,fixtures);await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[]}));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4175/');
 await page.waitForFunction(()=>typeof itemById==='function'&&itemById('anvil_i')?.rarity==='Rare');
 const check=await page.evaluate(()=>({rarity:itemById('anvil_i').rarity,recycle:recyclingText(itemById('anvil_splitter')),desc:itemDesc(itemById('snap_hook')),owned:localStorage.getItem('arcOwned'),expected:text(itemById('anvil_splitter').description),width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
 assert.equal(check.rarity,'Rare');assert.equal(check.recycle,check.expected);assert.ok(check.desc.includes('18'));assert.equal(check.owned,'{"anvil_splitter":2}');assert.ok(check.width<=check.viewport+2);
 await page.reload();await page.waitForFunction(()=>typeof itemById==='function'&&itemById('anvil_i')?.rarity==='Rare');assert.equal(await page.evaluate(()=>localStorage.getItem('arcOwned')),'{"anvil_splitter":2}');assert.deepEqual(errors,[]);
 console.log('PASS',locale,width,'localized corrections, no overflow, stock preserved through reload');await context.close();
}}finally{await browser.close();}
