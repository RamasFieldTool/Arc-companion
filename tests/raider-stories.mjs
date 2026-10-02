import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const originalHash='76aaf09d39992c0f236bd827b1d3217818d4c91e084ac46d03ace2665fe0baca';
const imageHash='028adc01c3ac543acc0850b0bb91fb9e21505dc610be963190549bd35e8aef14';
assert.equal(createHash('sha256').update(await readFile(new URL('../assets/stories/versteckspiel-chris-fenzelino.jpg',import.meta.url))).digest('hex'),imageHash);
const labels={
  de:['Story lesen','← Zurück zu Raider Stories','← Zurück zu Fan Creations'],
  en:['Read story','← Back to Raider Stories','← Back to Fan Creations'],
  fr:['Lire l’histoire','← Retour à Raider Stories','← Retour à Fan Creations'],
  es:['Leer historia','← Volver a Raider Stories','← Volver a Fan Creations']
};
const songs=['https://suno.com/s/vbkPccvrI66ij4gJ','https://suno.com/s/trsx9nLKROxaw5fW','https://suno.com/s/vkAaYpLp5LkJyuVz','https://suno.com/s/xqxasdeSvRKfs74o'];

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',route=>{
    const url=new URL(route.request().url());
    const offset=Number(url.searchParams.get('offset'))||0,limit=Number(url.searchParams.get('limit'))||45;
    const body={type:'items',total:items.length,count:items.slice(offset,offset+limit).length,offset,limit,items:items.slice(offset,offset+limit)};
    if(offset+limit<items.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await page.route('https://suno.com/s/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Suno destination fixture</title>'}));
}
async function visible(page,selector){await page.locator(selector).waitFor({state:'visible'});}
async function hash(page,value){await page.waitForFunction(expected=>location.hash===expected,value);}
async function checkText(page){
  const text=await page.locator('.fan-story-body').evaluate(el=>[...el.children].map(node=>node.textContent).join('\n\n'));
  assert.equal(createHash('sha256').update(text).digest('hex'),originalHash,'Original prose, punctuation and whitespace must remain verbatim');
  assert.equal(await page.locator('.fan-story-body').getAttribute('lang'),'de');
}
async function checkLayout(page){
  const metrics=await page.evaluate(()=>{
    const body=document.querySelector('.fan-story-body'),style=getComputedStyle(body);
    const buttons=[...document.querySelectorAll('.fan-story-view>.fan-view-back,.fan-story-social')].map(el=>el.getBoundingClientRect().height);
    return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,bodyOverflow:body.scrollWidth-body.clientWidth,font:parseFloat(style.fontSize),line:parseFloat(style.lineHeight),ink:style.color,buttons};
  });
  assert.ok(metrics.overflow<=1,JSON.stringify(metrics));
  assert.ok(metrics.bodyOverflow<=1,JSON.stringify(metrics));
  assert.ok(metrics.font>=17&&metrics.line/metrics.font>=1.7,JSON.stringify(metrics));
  assert.equal(metrics.ink,'rgb(238, 231, 220)');
  assert.ok(metrics.buttons.every(height=>height>=44),JSON.stringify(metrics));
}

await mkdir(new URL('../test-artifacts/stories/',import.meta.url),{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  for(const width of [360,390,430])for(const surface of ['light','dark','black'])for(const language of ['de','en','fr','es']){
    const context=await browser.newContext({viewport:{width,height:900},isMobile:true,hasTouch:true});
    await context.addInitScript(({language,surface})=>{
      localStorage.setItem('arcLang',language==='de'?'de':'en');
      localStorage.setItem('arcUiLanguage',language);
      localStorage.setItem('arcLanguageOnboardingPending','0');
      localStorage.setItem('arcPaletteSurface',surface);
    },{language,surface});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    await installRoutes(page);
    await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(l=>document.documentElement.lang===l&&typeof window.arcSetLanguage==='function',language);
    await page.locator('[data-app-target="raiderRadio"]').tap();
    await visible(page,'.fan-creations-hub');
    await page.locator('[data-fan-view="stories"]').tap();
    await visible(page,'.fan-stories-grid');
    assert.equal(await page.locator('.fan-story-card').count(),1);
    assert.equal(await page.locator('.fan-story-card-title').textContent(),'Versteckspiel');
    assert.equal(await page.locator('.fan-story-summary').textContent(),'Drei gegen einen. Geduldig warten sie im Dunkeln auf ihr Opfer.\n\nDoch diese Geschichte wird nicht aus der Perspektive eines Raiders erzählt.');
    assert.equal(await page.locator('.fan-story-read').textContent(),labels[language][0]);
    assert.equal(await page.locator('.fan-view:has(.fan-stories-grid)>.fan-view-back').textContent(),labels[language][2]);
    await page.locator('.fan-story-read').tap();
    await hash(page,'#raiderRadio/stories/versteckspiel');
    await visible(page,'.fan-story-detail');
    await page.waitForFunction(()=>document.querySelector('.fan-story-hero>img')?.naturalWidth===1536);
    assert.equal(await page.locator('.fan-story-hero>img').evaluate(img=>img.naturalHeight),1024);
    assert.equal(await page.locator('.fan-story-view>.fan-view-back').textContent(),labels[language][1]);
    assert.equal(await page.locator('.fan-story-credit p').first().textContent(),'Community Story by Chris Fenzelino');
    assert.equal(await page.locator('.fan-story-social').getAttribute('target'),'_blank');
    assert.equal(await page.locator('.fan-story-social').getAttribute('rel'),'noopener noreferrer');
    await checkText(page);await checkLayout(page);
    if(width===390&&language==='de')await page.screenshot({path:new URL(`../test-artifacts/stories/${surface}-390.png`,import.meta.url).pathname,fullPage:true});
    await page.goBack();await visible(page,'.fan-stories-grid');
    await page.goForward();await visible(page,'.fan-story-detail');await checkText(page);
    await page.reload({waitUntil:'domcontentloaded'});await visible(page,'.fan-story-detail');await checkText(page);
    await page.locator('.fan-story-view>.fan-view-back').tap();await visible(page,'.fan-stories-grid');
    await page.locator('.fan-view:has(.fan-stories-grid)>.fan-view-back').tap();await visible(page,'.fan-creations-hub');
    await page.locator('[data-fan-view="radio"]').tap();await visible(page,'.radio-grid');
    assert.deepEqual(await page.locator('.radio-listen').evaluateAll(links=>links.map(link=>link.href)),songs);
    await page.waitForFunction(()=>[...document.querySelectorAll('.radio-song img')].every(img=>img.complete&&img.naturalWidth>0));
    if(width===390&&surface==='light'&&language==='en'){
      for(let index=0;index<4;index++){
        const popupPromise=context.waitForEvent('page');await page.locator('.radio-listen').nth(index).tap();const popup=await popupPromise;
        await popup.waitForLoadState('domcontentloaded');assert.equal(popup.url(),songs[index]);await popup.close();
      }
    }
    await page.locator('#appBack').tap();await visible(page,'#appLauncher');
    await page.locator('[data-app-target="raiderRadio"]').tap();await visible(page,'.fan-creations-hub');
    assert.equal(await page.locator('.fan-story-view').isVisible(),false);
    await page.evaluate(()=>{location.hash='raiderRadio/stories/missing';});await visible(page,'.fan-stories-grid');
    await page.goto(BASE_URL+'#raiderRadio/stories/versteckspiel',{waitUntil:'domcontentloaded'});await visible(page,'.fan-story-detail');
    await checkText(page);
    // A real language switch must keep German prose and update only UI chrome.
    await page.evaluate(()=>window.arcSetLanguage('fr'));await page.waitForFunction(()=>document.documentElement.lang==='fr');
    await page.waitForFunction(()=>document.querySelector('.fan-story-view>.fan-view-back').textContent==='← Retour à Raider Stories');await checkText(page);
    assert.deepEqual(errors,[]);
    console.log(`PASS community story ${width}px ${surface} ${language}: verbatim text, UI, image, layout, hash/history/reload/back, radio covers and links`);
    await context.close();
  }
}finally{await browser.close();}
