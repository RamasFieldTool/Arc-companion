import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';

const browser=await chromium.launch({headless:true});
const fixture=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,60);
const labels={de:['Möbel','Ausbau','Forschung & Upgrades'],en:['Furniture','Expansion','Research & upgrades'],fr:['Meubles','Extension','Recherche et améliorations'],es:['Muebles','Ampliación','Investigación y mejoras'],it:['Mobili','Espansione','Ricerca e miglioramenti']};
const widths=(process.env.OUTPOST_WIDTHS||'360,1280').split(',').map(Number);
const phase=process.env.OUTPOST_PHASE||'1';
await mkdir('test-artifacts/outpost-ui',{recursive:true});
async function home(page){await page.locator('#appBack').click();}
async function outpost(page){await page.locator('[data-app-target="outpostSection"]').click();}
async function tab(page,id){if(await page.locator('#outpostTab-'+id).count())await page.locator('#outpostTab-'+id).click();}
try{
 for(const [language,titles] of Object.entries(labels))for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<600,isMobile:width<600});
  await context.addInitScript(language=>{localStorage.setItem('arcUiLanguage',language);localStorage.setItem('arcLang',language==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcOwned','{"metal_parts":7}');localStorage.setItem('arcActiveGoals','{}');localStorage.setItem('arcOutpostBuildTasksV1','{"photo":true}');},language);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await installItemCatalogRoute(page,fixture);
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({json:[]}));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.RFTPlanningUI&&document.querySelectorAll('#outpostCatalogList details').length===100);
  await outpost(page);
  const tabs=page.locator('#outpostTabs [role=tab]');
  if(await tabs.count()){
   assert.deepEqual(await tabs.allTextContents(),titles);
   assert.equal(await page.locator('#outpostPanel-furniture').isVisible(),true);
   assert.equal(await page.locator('#outpostPanel-build').isVisible(),false);
   assert.equal(await page.locator('#outpostPanel-research').isVisible(),false);
  }
  assert.match(await page.locator('#outpostBuildProgress').textContent(),/1\/4/);
  if(language!=='de')assert.ok(!(await page.locator('#outpostBuildIntro').textContent()).includes('Bauaufgaben'));
  assert.notEqual(await page.locator('#outpostCatalogCategory option[value=Wardrobe]').textContent(),'Wardrobe');
  assert.notEqual(await page.locator('#outpostCatalogCategory option[value="DisplayCase.Weapon"]').textContent(),'DisplayCase.Weapon');
  for(const surface of ['light','black']){
   await home(page);await page.locator('[data-app-target="paletteLab"]').click();await page.locator(`[data-palette-surface="${surface}"]`).click();await home(page);await outpost(page);await tab(page,'furniture');
   const search=page.locator('#outpostCatalogSearch');
   await search.fill('  BARSTOOL  ');assert.equal(await page.locator('#outpostCatalogList details').count(),1);
   await page.locator('#outpostCatalogList summary').click();
   assert.ok((await page.locator('#outpostCatalogList .outpost-craft').textContent()).includes('4'));
   assert.ok((await page.locator('#outpostCatalogList .outpost-research').textContent()).includes('500'));
   assert.equal(await page.locator('#outpostCatalogList details').evaluate(n=>n.open),true);
   if(Number(phase)>=3){
    const r=await page.locator('#outpostCatalogList summary').boundingBox();assert.ok(r.height>=44&&r.width>=44);
    assert.equal(await page.locator('#outpostCatalogList .outpost-craft li').count(),2);
   }
   await page.locator('#outpostCatalogList summary').click();assert.equal(await page.locator('#outpostCatalogList details').evaluate(n=>n.open),false);
   await search.fill('quantity');assert.equal(await page.locator('#outpostCatalogList details').count(),0);
   await search.fill('');await page.locator('#outpostCatalogCategory').selectOption('Wardrobe');assert.equal(await page.locator('#outpostCatalogList details').count(),5);
   await search.fill('Alpine');assert.equal(await page.locator('#outpostCatalogList details').count(),1);
   await page.locator('#outpostCatalogCategory').selectOption('');await search.fill('');assert.equal(await page.locator('#outpostCatalogList details').count(),100);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   await page.screenshot({path:`test-artifacts/outpost-ui/phase-${phase}-${language}-${width}-${surface}.png`});
  }
  for(const [panel,button,goal]of [['build','outpostOpenGoals','rft_outpost_materials'],['research','outpostOpenResearch','rft_research_station']]){
   await tab(page,panel);await page.locator('#'+button).click();
   await page.waitForFunction(id=>document.querySelector(`#goals .goal-station[data-goal-id="${id}"]`)?.open,goal);
   assert.equal(new URL(page.url()).hash,'#planningSection');
   assert.equal(await page.locator('#planningTabGoals').getAttribute('aria-selected'),'true');
   assert.equal(await page.locator(`[data-goal-id="${goal}"]`).isVisible(),true);
   await home(page);await outpost(page);
  }
  if(await tabs.count()){
   await tab(page,'research');await page.locator('#outpostAmplifiedWeapons input').fill('Splitter');await page.locator('.amplified-family>summary').click();await page.locator('[data-node-id="anvil:anvilsplitter"]>summary').click();
   assert.match(await page.locator('[data-node-id="anvil:anvilsplitter"]').innerText(),/3×/);
   await page.locator('#outpostAmplifiedWeapons input').fill('');
   assert.equal(await page.locator('#outpostAmplifiedWeapons .amplified-node').count(),40);
   assert.equal(await page.locator('#outpostAmplifiedWeapons .amplified-unresolved').count(),5);
   await tab(page,'build');await page.locator('#outpostExpansionReference summary').click();assert.equal(await page.locator('#outpostExpansionReference li').count(),3);
   await tab(page,'furniture');await page.locator('#outpostCatalogSearch').fill('barstool');await page.locator('#outpostCatalogList summary').click();
   await tab(page,'build');await tab(page,'furniture');assert.equal(await page.locator('#outpostCatalogList details').evaluate(n=>n.open),true);
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('arcOwned')),'{"metal_parts":7}');
  assert.equal(await page.evaluate(()=>localStorage.getItem('arcActiveGoals')),'{}');
  assert.equal(await page.evaluate(()=>localStorage.getItem('arcOutpostBuildTasksV1')),'{"photo":true}');
  assert.deepEqual(errors,[]);
  console.log(`PASS phase ${phase}: ${language}/${width}, light+black, search/filter/details, targeted goals, saved data`);
  await context.close();
 }
}finally{await browser.close()}
