// Opt-in network smoke: no catalog, CDN or other external response fixtures.
import {chromium,expect} from 'playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const width of [360,1280]){
  const page=await browser.newPage({viewport:{width,height:850}});
  const externalFailures=[],runtimeErrors=[];
  page.on('pageerror',e=>runtimeErrors.push(e.message));
  page.on('requestfailed',r=>{if(!r.url().startsWith(process.env.BASE_URL||'http://127.0.0.1:4173/'))externalFailures.push({url:r.url(),error:r.failure()?.errorText})});
  await page.addInitScript(()=>{localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0')});
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.RFTPlanningUI&&['live','partial','fallback'].includes(document.querySelector('#dataStatusPersistent')?.dataset.state),{timeout:60000});
  await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#q').fill('metal');
  console.log(JSON.stringify(await page.evaluate(()=>({meta:window.__arcCatalogMeta,count:items.length,eligibleImages:items.filter(i=>window.RFTItemImages.source(i)).length})),null,2));
  const image=page.locator('article.card[data-item-id="metal_parts"] .item-thumbnail').first();
  await expect(image).toBeVisible();await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(i=>i.complete&&i.naturalWidth===256),{timeout:30000}).toBe(true);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  await page.screenshot({path:`test-artifacts/item-images-real-catalog-${width}.png`});
  console.log('External failures:',JSON.stringify(externalFailures));
  if(runtimeErrors.length)throw Error('Runtime errors: '+runtimeErrors.join(' | '));
  console.log(`PASS real catalog and CDN image with no overflow on ${width}px`);
  await page.close();
 }
}finally{await browser.close()}
