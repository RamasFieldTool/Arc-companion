import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!items.length)throw new Error('items.json fixture missing');
const fixtureItems=items.slice(0,Math.min(items.length,60));
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_ui.json';
const quest={id:'quality_gate_ui',name:{de:'UI-Test',en:'UI test'},trader:'Test',objectives:[{de:'Layout prüfen',en:'Check layout'}],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url());
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0),limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=fixtureItems.slice(offset,offset+limit);
    const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'quality_gate_ui.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}

const browser=await chromium.launch({headless:true});
await mkdir(new URL('../test-artifacts/radio/',import.meta.url),{recursive:true});
const expected=['https://suno.com/s/vbkPccvrI66ij4gJ','https://suno.com/s/trsx9nLKROxaw5fW','https://suno.com/s/vkAaYpLp5LkJyuVz','https://suno.com/s/xqxasdeSvRKfs74o'];
const labels={de:'▶ Auf Suno anhören',en:'▶ Listen on Suno',fr:'▶ Écouter sur Suno',es:'▶ Escuchar en Suno'};
try{
for(const width of [320,412,1280])for(const surface of ['light','black'])for(const language of ['en','de','fr','es']){
  const context=await browser.newContext({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600});
  await context.addInitScript(({language,surface})=>{
    localStorage.setItem('arcLang',language==='de'?'de':'en');
    localStorage.setItem('arcUiLanguage',language);
    localStorage.setItem('arcLanguageOnboardingPending','0');
    localStorage.setItem('arcPaletteSurface',surface);
  },{language,surface});
  const page=await context.newPage();const errors=[],audioRequests=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('request',r=>{if(r.resourceType()==='media'||/\.(mp3|wav|ogg|m4a)(?:\?|$)/i.test(r.url()))audioRequests.push(r.url())});
  await installRoutes(page);
  await context.route('https://suno.com/s/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<title>Suno link test fixture</title>'}));
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live');
  await page.waitForFunction(l=>document.documentElement.lang===l,language);
  await page.evaluate(s=>document.documentElement.dataset.surface=s,surface);
  const tile=page.locator('[data-app-target="raiderRadio"]');
  assert.equal(await tile.locator('b').innerText(),'Raider Radio');
  await tile.click();
  await page.locator('#raiderRadio').waitFor({state:'visible'});
  const cards=page.locator('.radio-song');assert.equal(await cards.count(),4);
  assert.deepEqual(await cards.locator('h3').allTextContents(),['Ugly','The ARCs Are the Enemy','Loot&Shoot','What Was It For?']);
  assert.deepEqual(await cards.locator('a').evaluateAll(a=>a.map(x=>x.href)),expected);
  assert.deepEqual(await cards.locator('a').allTextContents(),[labels[language],labels[language],labels[language],labels[language]]);
  await page.waitForFunction(()=>[...document.querySelectorAll('.radio-song img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.deepEqual(await cards.locator('img').evaluateAll(a=>a.map(x=>x.getAttribute('src'))),['assets/music/ugly-cover.png','assets/music/the-arcs-are-the-enemy-cover.png','assets/music/loot-and-shoot-cover.png','assets/music/what-was-it-for-cover.webp']);
  const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,cardOverflow:[...document.querySelectorAll('.radio-song')].some(c=>c.scrollWidth>c.clientWidth),download:document.querySelectorAll('#raiderRadio [download],#raiderRadio audio,#raiderRadio iframe').length}));
  assert.ok(metrics.overflow<=4,JSON.stringify(metrics));assert.equal(metrics.cardOverflow,false);assert.equal(metrics.download,0);
  if(width===320&&language==='en')await page.screenshot({path:new URL(`../test-artifacts/radio/${surface}-320.png`,import.meta.url).pathname,fullPage:true});
  if(width===412&&language==='en'&&surface==='light'){
    for(let i=0;i<4;i++){
      const popupPromise=context.waitForEvent('page');await cards.locator('a').nth(i).click();const popup=await popupPromise;
      await popup.waitForLoadState('domcontentloaded');assert.equal(popup.url(),expected[i]);await popup.close();
    }
  }
  await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});
  await page.locator('[data-app-target="goalsSection"]').click();await page.locator('#goalsSection').waitFor({state:'visible'});
  await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});
  await page.goto(BASE_URL+'#raiderRadio',{waitUntil:'domcontentloaded'});await page.locator('#raiderRadio').waitFor({state:'visible'});
  assert.deepEqual(audioRequests,[]);assert.deepEqual(errors,[]);
  console.log(`PASS Raider Radio ${width}px ${surface} ${language}: cards, covers, links, layout, back, direct hash, no audio/runtime errors`);
  await context.close();
}
}finally{await browser.close()}
