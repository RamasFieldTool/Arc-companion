import {chromium,expect} from 'playwright/test';
import {readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:360,height:800},{width:1280,height:900}])for(const locale of ['de','en']){
  const context=await browser.newContext({viewport});
  await context.addInitScript(locale=>{
   if(sessionStorage.getItem('workshop-seeded'))return;sessionStorage.setItem('workshop-seeded','1');
   localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale);localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcOwned','{"metal_parts":7}');localStorage.setItem('arcActiveGoals','{}');localStorage.setItem('arcPlanningPersonal','{"metal_parts":{"itemId":"metal_parts","target":3,"status":"active"}}');
  },locale);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await installItemCatalogRoute(page,items);
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[]}));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.RFTPlanningUI&&document.querySelector('#dataStatusPersistent')?.dataset.state==='live');
  const open=async()=>{await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="workshop"]').click();await page.locator('.goal-station[data-goal-id="weapon_bench"]>summary').click()};
  await page.locator('[data-app-target="planningSection"]').click();await open();
  const level=page.locator('input[data-key="weapon_bench:1"]');const material=level.locator('..').locator('.workshop-materials');
  await expect(level).not.toBeChecked();await expect(material).toBeVisible();await expect(material).toContainText('20');await expect(material).toContainText('30');await expect(material).toContainText(locale==='de'?'Metallteile':'Metal Parts');
  await level.check();await expect(page.locator('.workshop-feedback')).toContainText(locale==='de'?'hinzugefügt':'added');
  await page.locator('.goal-station[data-goal-id="refiner"]>summary').click();await page.locator('input[data-key="refiner:1"]').check();
  const result=await page.evaluate(()=>RFTPlanning.rows({all:true}).find(x=>x.itemId==='metal_parts'));if(result.required!==83||result.owned!==7||result.missing!==76)throw Error(JSON.stringify(result));
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.RFTPlanningUI);await open();await expect(level).toBeChecked();await level.uncheck();await expect(page.locator('.workshop-feedback')).toContainText(locale==='de'?'entfernt':'removed');
  const after=await page.evaluate(()=>({row:RFTPlanning.rows({all:true}).find(x=>x.itemId==='metal_parts'),goals:RFTPlanning.personalGoals()}));if(after.row.required!==63||after.row.owned!==7||after.goals.metal_parts.target!==3)throw Error(JSON.stringify(after));
  if(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)>2)throw Error('Workshop overflow');
  if(errors.length)throw Error(errors.join(' | '));console.log(`PASS workshop visible before selection, shared stock, personal goal, feedback and reload ${viewport.width}/${locale}`);await context.close();
 }
}finally{await browser.close()}
