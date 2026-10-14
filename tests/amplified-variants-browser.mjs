import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';

const browser=await chromium.launch({headless:true});
const labels={de:'Upgrade-Optionen',en:'Upgrade options',fr:'Options',es:'Opciones',it:'Opzioni'};
try{
 for(const [language,heading] of Object.entries(labels)){
  for(const width of [320,375,430,768,1280]){
   const context=await browser.newContext({viewport:{width,height:900}});
   await context.addInitScript(language=>{
    localStorage.setItem('arcUiLanguage',language);
    localStorage.setItem('arcLang',language==='de'?'de':'en');
    localStorage.setItem('arcLanguageOnboardingPending','0');
    localStorage.setItem('arcOwned','{"metal_parts":3}');
    localStorage.setItem('arcActiveGoals','{"workbench:1":true}');
   },language);
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await installItemCatalogRoute(page,[{id:'anvil_i',name:{de:'Amboss I',en:'Anvil I'},type:'Hand Cannon',rarity:'Rare',value:1,weightKg:1,stackSize:1},{id:'queen_reactor',name:{de:'Queen Reactor',en:'Queen Reactor'},type:'Material',rarity:'Legendary',value:999,weightKg:1,stackSize:1,description:{de:'Bestehende Beschreibung',en:'Existing description'}}]);
   await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({json:[]}));
   await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelectorAll('#outpostAmplifiedWeapons .amplified-family').length===15);
   assert.ok((await page.locator('#outpostAmplifiedWeapons').innerText()).includes('Amplified'));
   await page.locator('[data-app-target="outpostSection"]').click();
   await page.locator('#outpostAmplifiedWeapons input[type=search]').waitFor({state:'visible'});
   const search=page.locator('#outpostAmplifiedWeapons input[type=search]');
   await search.fill('Splitter');
   assert.equal(await page.locator('#outpostAmplifiedWeapons .amplified-family').count(),1);
   await page.locator('#outpostAmplifiedWeapons .amplified-family > summary').click();
   await page.locator('[data-node-id="anvil:anvilsplitter"] > summary').click();
   assert.match(await page.locator('[data-node-id="anvil:anvilsplitter"]').innerText(),/3×/);
   assert.equal(await page.locator('[data-node-id="anvil:anvilsplitter"] a').getAttribute('href'),'https://arctracker.io/items/anvil_amplified');
   const panel=await page.locator('#outpostAmplifiedWeapons .amplified-family').innerText();
   assert.ok(panel.includes(heading),language+' heading missing');
   assert.ok(panel.includes('Anvil Splitter'));
   await search.fill('');
   assert.equal(await page.locator('#outpostAmplifiedWeapons .amplified-family').count(),15);
   assert.equal(await page.locator('#outpostAmplifiedWeapons .amplified-node').count(),40);
   assert.equal(await page.locator('#outpostAmplifiedWeapons .amplified-unresolved').count(),5);
   assert.ok(await page.locator('#outpostDevelopmentNotice').isVisible());
   await page.locator('[data-family-id="equalizer"] > summary').click();
   await page.locator('[data-node-id="equalizer:rampingdamage"] > summary').click();
   const recipe=await page.locator('[data-node-id="equalizer:rampingdamage"]').innerText();
   assert.ok(recipe.includes('3× Queen Reactor'));
   assert.ok(recipe.includes('2× Queen Reactor'));
   assert.ok(recipe.includes('Beam Resonance Tech'));
   assert.ok(recipe.includes('1,500')||recipe.includes('1.500')||recipe.includes('1 500'));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile overflow');
   await page.locator('#appBack').click();
   await page.locator('[data-app-target="itemsSection"]').click();
   await page.locator('#q').fill('Queen Reactor');
   const material=page.locator('.card[data-item-id="queen_reactor"]').first();
   await material.locator('[data-amplified-use="upgrade"] > summary').click();
   const uses=await material.locator('[data-amplified-use="upgrade"]').innerText();
   assert.ok(uses.includes('Equalizer – Ramping Damage'));
   assert.match(uses,/Ramping Damage[^\n]*3/);
   assert.ok(!(uses.includes('Anti Shield')));
   assert.ok(await material.locator('.facts').innerText());
   assert.equal(await page.evaluate(()=>localStorage.getItem('arcOwned')),'{"metal_parts":3}');
   assert.equal(await page.evaluate(()=>localStorage.getItem('arcActiveGoals')),'{"workbench:1":true}');
   assert.deepEqual(errors,[],language+' browser errors');
   console.log('PASS amplified',language,width,'15 families, search, language, saved data');
   await context.close();
  }
 }
}finally{await browser.close();}
