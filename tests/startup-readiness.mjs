import {chromium,expect} from 'playwright/test';
import {readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
items.find(item=>item.id==='wires').recyclesInto={metal_parts:2};
const copies={fr:['Résultats directs','Disponible par recyclage','Produit:'],es:['Resultados directos','Disponible mediante reciclaje','Produce:'],it:['Risultati diretti','Disponibile tramite riciclo','Produce:']};
const browser=await chromium.launch({headless:true});
try{
 for(const [locale,copy] of Object.entries(copies)){
  const context=await browser.newContext({viewport:{width:360,height:900}});
  await context.addInitScript(locale=>{localStorage.setItem('arcLang','en');localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLanguageOnboardingPending','0')},locale);
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(String(error)));
  await installItemCatalogRoute(page,items);
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({json:[]}));
  let releaseUI,releaseLanguage;
  const uiGate=new Promise(resolve=>releaseUI=resolve),languageGate=new Promise(resolve=>releaseLanguage=resolve);
  await page.route('**/planning-ui.js?*',async route=>{await uiGate;await route.continue()});
  await page.route('**/i18n-v13017.js?*',async route=>{await languageGate;await route.continue()});
  try{
   await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!document.getElementById('planningSection'));
   await page.locator('[data-app-target="planningSection"]').click();
   await expect(page.locator('#planningTabGoals')).toBeDisabled();
   await expect(page.locator('#planningTabMissing')).toBeDisabled();
   expect(await page.evaluate(()=>!!window.RFTPlanningUI)).toBe(false);
   releaseUI();await page.waitForFunction(()=>!!window.RFTPlanningUI);await expect(page.locator('#planningTabGoals')).toBeEnabled();
   await page.locator('#planningTabGoals').click();await expect(page.locator('#planningGoals')).toBeVisible();
   await page.waitForFunction(()=>typeof items!=='undefined'&&items.some(item=>item.id==='metal_parts'));
   await page.locator('#appBack').click();await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#q').fill('metal');
   expect(await page.evaluate(()=>typeof window.arcSetLanguage)).toBe('undefined');
   await expect(page.locator('.search-group-head>b').first()).toHaveText(copy[0]);
   await expect(page.locator('.recycle-group .search-group-head b')).toHaveText(copy[1]);
   await expect(page.locator('.recycle-source-yield>span').first()).toHaveText(copy[2]);
   releaseLanguage();await page.waitForFunction(locale=>typeof window.arcSetLanguage==='function'&&document.documentElement.dataset.uiLanguage===locale,locale);
   await expect(page.locator('.search-group-head>b').first()).toHaveText(copy[0]);
   expect(errors).toEqual([]);
   console.log(`PASS ${locale}: tabs disabled until handlers load; saved search language survives deferred translator startup`);
  }finally{releaseUI();releaseLanguage();await context.close()}
 }
}finally{await browser.close()}
