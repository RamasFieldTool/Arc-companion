import {chromium,expect} from 'playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';

const script=await readFile(new URL('../item-images.js',import.meta.url),'utf8');
const sandbox={window:{},document:{addEventListener(){}},URL,HTMLImageElement:class {}};
vm.runInNewContext(script,sandbox);
const source=sandbox.window.RFTItemImages.source;
const url='https://cdn.arctracker.io/items/v2/metal_parts.png';
assert.equal(source({id:'metal_parts',imageFilename:url}),url);
for(const item of [null,{}, {id:123,imageFilename:url},{id:'metal_parts'},
 {id:'wires',imageFilename:url},{id:'metal_parts',imageFilename:'javascript:alert(1)'},
 ...['http://cdn.arctracker.io/items/v2/metal_parts.png','https://evil.example/items/v2/metal_parts.png',url+'?x=1',url+'#x',url.replace('cdn.','user@cdn.'),url.replace('.io/','.io:8080/'),url.replace('.png','.svg')].map(imageFilename=>({id:'metal_parts',imageFilename}))])assert.equal(source(item),'',JSON.stringify(item));
console.log('PASS metadata association and invalid-source rejection');

const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
items.find(x=>x.id==='metal_parts').imageFilename=url;
const wires=items.find(x=>x.id==='wires');
wires.imageFilename='https://cdn.arctracker.io/items/v2/wires.png';
wires.recyclesInto={metal_parts:2};
// Controlled synthetic image: proves UI behavior without shipping game imagery.
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#888"/><path d="M10 32h44" stroke="white" stroke-width="8"/></svg>';
await mkdir('test-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
for(const locale of ['de','en','fr','es','it'])for(const width of [360,1280]){
 const context=await browser.newContext({viewport:{width,height:900}});
 await context.addInitScript(locale=>{localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0')},locale);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await installItemCatalogRoute(page,items);
 await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[]}));
 let wireRequests=0;
 await page.route('https://cdn.arctracker.io/items/v2/**',r=>{if(r.request().url().includes('/wires.')){wireRequests++;return r.fulfill({status:404,body:'missing'})}return r.fulfill({contentType:'image/svg+xml',body:svg})});
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.RFTPlanningUI);
 await page.locator('[data-app-target="itemsSection"]').click();
 await page.locator('#q').fill('metal');
 const card=page.locator('article.card[data-item-id="metal_parts"]').first();
 const image=card.locator('.item-thumbnail');
 await expect(image).toHaveCount(1);await image.scrollIntoViewIfNeeded();
 await expect.poll(()=>image.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
 await expect(image).toHaveAttribute('alt','');await expect(image).toHaveAttribute('loading','lazy');
 assert.equal(Math.round((await image.boundingBox()).width),width<820?48:64);
 const recycle=page.locator('.recycle-source-full article.card[data-item-id="wires"]');
 await recycle.scrollIntoViewIfNeeded();
 await expect.poll(()=>wireRequests).toBeGreaterThan(0);await expect(recycle.locator('.item-thumbnail')).toHaveCount(0);
 await expect(recycle.locator('h3')).not.toBeEmpty();
 // A missing image must not remove the item, its facts or planning controls.
 await expect(recycle.locator('.facts')).toBeVisible();
 await expect(recycle.locator('.need')).toBeVisible();
 const previousRequests=wireRequests;
 await page.locator('#q').fill('wire');await page.locator('#q').fill('metal');
 await expect(page.locator('.recycle-source-full article.card[data-item-id="wires"] .item-thumbnail')).toHaveCount(0);
 assert.equal(wireRequests,previousRequests,'Failed images retried on redraw');
 for(const surface of ['light','black'])for(const accent of ['orange','amber','green','cyan']){
  await page.evaluate(({surface,accent})=>{document.documentElement.dataset.surface=surface;document.documentElement.dataset.theme=surface==='light'?'light':'dark';document.documentElement.dataset.accent=accent},{surface,accent});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2),`${locale}/${width}/${surface}/${accent} overflow`);
 }
 if(locale==='de')await page.screenshot({path:`test-artifacts/item-images-${width}.png`,fullPage:true});
 assert.deepEqual(errors,[],'Browser runtime errors');
 console.log(`PASS images, recycling error fallback, redraw, 8 theme layouts ${locale}/${width}`);
 await context.close();
}
}finally{await browser.close()}
