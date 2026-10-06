// Opt-in real CDN smoke; no game assets are stored in the repository.
import {chromium,expect} from 'playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
// Association inspected in RaidTheory metal_parts.json, not inferred from ID.
items.find(i=>i.id==='metal_parts').imageFilename='https://cdn.arctracker.io/items/v2/metal_parts.png';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
for(const width of [360,412,1280]){
 const context=await browser.newContext({viewport:{width,height:850}});
 await context.addInitScript(()=>{localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLang','de');localStorage.setItem('arcLanguageOnboardingPending','0')});
 const page=await context.newPage();await installItemCatalogRoute(page,items);
 await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[]}));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.RFTPlanningUI);
 await expect(page.locator('#arcLanguageFirstRun')).not.toBeVisible();
 await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#q').fill('metal');
 const image=page.locator('article.card[data-item-id="metal_parts"] .item-thumbnail').first();
 await image.scrollIntoViewIfNeeded();
 await expect.poll(()=>image.evaluate(i=>({complete:i.complete,width:i.naturalWidth,height:i.naturalHeight})),{timeout:30000}).toEqual({complete:true,width:256,height:256});
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
 await page.screenshot({path:`test-artifacts/item-images-real-${width}.png`,fullPage:true});
 console.log(`PASS real metal_parts CDN image decodes at ${width}px`);await context.close();
}
}finally{await browser.close()}
