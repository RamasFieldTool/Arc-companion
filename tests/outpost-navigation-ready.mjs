import {chromium,expect} from 'playwright/test';
import {readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:360,height:900}});
await context.addInitScript(()=>{localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLang','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcActiveGoals','{}')});
const page=await context.newPage();
await installItemCatalogRoute(page,JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,60));
await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({json:[]}));
let release;const ready=new Promise(resolve=>release=resolve);
await page.route('**/planning-ui.js?*',async route=>{await ready;await route.continue()});
try{
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.RFTPlanningIntegratedSources?.openWorkshopGoal);
 await page.locator('[data-app-target="outpostSection"]').click();await page.locator('#outpostTab-research').click();
 await page.locator('#outpostOpenResearch').click();
 await expect(page.locator('#planningTabGoals')).toBeDisabled();
 release();
 await page.waitForFunction(()=>document.querySelector('[data-goal-id="rft_research_station"]')?.open);
 await expect(page.locator('[data-goal-id="rft_research_station"]')).toBeVisible();
 await expect(page.locator('#planningTabGoals')).toHaveAttribute('aria-selected','true');
 expect(await page.evaluate(()=>localStorage.getItem('arcActiveGoals'))).toBe('{}');
 console.log('PASS Outpost Research Station target survives delayed planning UI without activating goals');
}finally{release();await browser.close()}
