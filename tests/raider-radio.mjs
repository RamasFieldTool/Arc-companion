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
const labels={de:'▶ Auf Suno anhören',en:'▶ Listen on Suno',fr:'▶ Écouter sur Suno',es:'▶ Escuchar en Suno',it:'▶ Ascolta su Suno'};
try{
for(const width of [320,412,1280])for(const surface of ['light','black'])for(const language of ['en','de','fr','es','it']){
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
  assert.equal(await tile.locator('b').innerText(),'Fan Creations');
  await tile.click();
  await page.locator('#raiderRadio').waitFor({state:'visible'});
  await page.locator('[data-fan-view="radio"]').click();
  const about=page.locator('.radio-about');
  assert.equal(await about.getAttribute('open'),null);
  await about.locator('summary').click();
  assert.equal(await about.evaluate(el=>el.open),true);
  await about.locator('summary').click();
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.radio-wordmark').evaluate(el=>getComputedStyle(el).textTransform),'none');
  const collection=page.locator('#raiderRadioSongs .radio-collection');
  assert.equal(await collection.count(),1);
  assert.equal(await page.locator('#raiderRadioSongs > :first-child').getAttribute('data-collection-id'),'lion-montana-radio-speranza-relay');
  assert.equal(await collection.locator('img').getAttribute('src'),'assets/music/lion-montana/radio-speranza-relay-logo.png');
  const ralf=page.locator('[data-song-id="against-the-steel-titans"]');
  assert.equal(await page.locator('#raiderRadioSongs > :nth-child(2)').getAttribute('data-song-id'),'against-the-steel-titans');
  assert.equal(await ralf.locator('h3').innerText(),'Against the Steel Titans');
  assert.equal(await ralf.locator('.radio-artist').innerText(),'Ralf');
  const player=ralf.locator('audio');
  assert.equal(await player.count(),1);
  assert.equal(await player.getAttribute('autoplay'),null);
  assert.equal(await player.getAttribute('preload'),'none');
  assert.equal(await player.getAttribute('controlslist'),'nodownload noplaybackrate noremoteplayback');
  assert.equal(await player.evaluate(a=>a.paused),true);
  assert.deepEqual(audioRequests,[]);
  await player.evaluate(a=>a.load());
  await page.waitForFunction(()=>document.querySelector('.radio-player').readyState>=2);
  assert.equal(await player.evaluate(a=>a.error),null);
  assert.ok(await player.evaluate(a=>Math.abs(a.duration-179.7)<0.5));
  await player.evaluate(a=>a.play());
  await page.waitForFunction(()=>document.querySelector('.radio-player').currentTime>0);
  await player.evaluate(a=>a.pause());
  assert.equal(await player.evaluate(a=>a.paused),true);
  assert.equal(await player.evaluate(a=>a.controls),true);
  const cards=page.locator('#raiderRadioSongs article.radio-song:not([data-song-id="against-the-steel-titans"])');assert.equal(await cards.count(),4);
  assert.deepEqual(await cards.locator('h3').allTextContents(),['Ugly','The ARCs Are the Enemy','Loot&Shoot','What Was It For?']);
  assert.deepEqual(await cards.locator('a').evaluateAll(a=>a.map(x=>x.href)),expected);
  assert.deepEqual(await cards.locator('a').allTextContents(),[labels[language],labels[language],labels[language],labels[language]]);
  await page.waitForFunction(()=>[...document.querySelectorAll('#raiderRadioSongs .radio-song img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.deepEqual(await cards.locator('img').evaluateAll(a=>a.map(x=>x.dataset.coverSource)),['assets/music/ugly-cover.png','assets/music/the-arcs-are-the-enemy-cover.png','assets/music/loot-and-shoot-cover.png','assets/music/what-was-it-for-cover']);
  assert.ok((await cards.locator('img').nth(3).getAttribute('src')).startsWith('data:image/webp;base64,'));
  const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,cardOverflow:[...document.querySelectorAll('#raiderRadioSongs .radio-song')].some(c=>c.scrollWidth>c.clientWidth),download:document.querySelectorAll('#raiderRadio [download],#raiderRadio iframe').length}));
  assert.ok(metrics.overflow<=4,JSON.stringify(metrics));assert.equal(metrics.cardOverflow,false);assert.equal(metrics.download,0);
  if(width===412)assert.equal(await page.locator('#raiderRadioSongs').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2);
  assert.equal(await page.locator('#raiderRadioSongs h3').evaluateAll(a=>a.every(x=>x.scrollWidth<=x.clientWidth&&x.scrollHeight<=x.clientHeight)),true);
  if(width===320&&language==='en')await page.screenshot({path:new URL(`../test-artifacts/radio/${surface}-320.png`,import.meta.url).pathname,fullPage:true});
  if(width===412&&language==='en'&&surface==='light'){
    for(let i=0;i<4;i++){
      const popupPromise=context.waitForEvent('page');await cards.locator('a').nth(i).click();const popup=await popupPromise;
      await popup.waitForLoadState('domcontentloaded');assert.equal(popup.url(),expected[i]);await popup.close();
    }
  }
  await player.evaluate(a=>a.play());
  await collection.click();
  assert.equal(await player.evaluate(a=>a.paused),true);
  await page.locator('.radio-album-view').waitFor({state:'visible'});
  assert.equal(await page.locator('.radio-album-view .radio-album').count(),2);
  assert.deepEqual(await page.locator('.radio-album h3').allTextContents(),['Radio Speranza Relay Vol. 1','Radio Speranza Relay Vol. 2']);
  assert.deepEqual(await page.locator('.radio-album img').evaluateAll(a=>a.map(x=>x.getAttribute('src'))),['assets/music/lion-montana/radio-speranza-relay-vol-1.png','assets/music/lion-montana/radio-speranza-relay-vol-2.png']);
  await page.waitForFunction(()=>[...document.querySelectorAll('.radio-album img')].every(i=>i.complete&&i.naturalWidth===1536));
  assert.deepEqual(await page.locator('.radio-album a').evaluateAll(a=>a.map(x=>x.href)),['https://www.youtube.com/playlist?list=OLAK5uy_nbUa8Ik3gs-aP4FB2bW-0qUQ94Uuv_B5g','https://www.youtube.com/playlist?list=OLAK5uy_ns6XAeCHm47zacDC8vmBXzzg51RqJoSCo']);
  assert.equal(await page.locator('.radio-link-pending').count(),0);
  const youtubeLabels={de:'▶ Auf YouTube anhören',en:'▶ Listen on YouTube',fr:'▶ Écouter sur YouTube',es:'▶ Escuchar en YouTube',it:'▶ Ascolta su YouTube'};
  assert.deepEqual(await page.locator('.radio-album a').allTextContents(),[youtubeLabels[language],youtubeLabels[language]]);
  const albumMetrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,cards:[...document.querySelectorAll('.radio-album')].some(c=>c.scrollWidth>c.clientWidth)}));
  assert.ok(albumMetrics.overflow<=4,JSON.stringify(albumMetrics));assert.equal(albumMetrics.cards,false);
  assert.equal(await page.locator('.radio-album a').evaluateAll(a=>a.every(x=>x.getBoundingClientRect().height>=44)),true);
  assert.ok(await page.locator('.radio-album-view').innerText().then(text=>!text.includes('Zoe')));
  if(language==='en'&&[320,412,1280].includes(width))await page.screenshot({path:new URL('../test-artifacts/radio/albums-'+surface+'-'+width+'.png',import.meta.url).pathname,fullPage:true});
  const backLabels={de:'← Zurück zu Raider Radio',en:'← Back to Raider Radio',fr:'← Retour à Raider Radio',es:'← Volver a Raider Radio',it:'← Torna a Raider Radio'};
  assert.equal(await page.locator('.radio-album-view .fan-view-back').innerText(),backLabels[language]);
  await page.reload({waitUntil:'domcontentloaded'});await page.locator('.radio-album-view').waitFor({state:'visible'});
  await page.locator('.radio-album-view .fan-view-back').click();await collection.waitFor({state:'visible'});
  assert.equal(new URL(page.url()).hash,'#raiderRadio/radio');
  const touch=await cards.locator('a').evaluateAll(a=>a.every(x=>x.getBoundingClientRect().height>=44));assert.equal(touch,true);
  await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});
  if(width===412&&surface==='light'&&language==='en'){
    for(const code of ['de','fr','es','it','en']){
      await page.locator('#arcLanguageButton').click();
      await page.locator(`#arcLanguageMenu [data-arc-language="${code}"]`).click();
      await page.waitForFunction(code=>document.documentElement.lang===code&&document.querySelector('[data-app-target="raiderRadio"] b')?.textContent==='Fan Creations',code);
      assert.equal(await ralf.locator('h3').textContent(),'Against the Steel Titans');
      assert.equal(await ralf.locator('.radio-artist').textContent(),'Ralf');
      assert.equal(await player.getAttribute('src'),'assets/music/ralf/against-the-steel-titans.mp3');
    }
  }
  await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#itemsSection').waitFor({state:'visible'});
  await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});
  await page.goto(BASE_URL+'#raiderRadio',{waitUntil:'domcontentloaded'});await page.locator('#raiderRadio').waitFor({state:'visible'});
  assert.ok(audioRequests.length>0);
  assert.ok(audioRequests.every(url=>url===new URL('assets/music/ralf/against-the-steel-titans.mp3',BASE_URL).href));
  assert.deepEqual(errors,[]);
  console.log(`PASS Raider Radio ${width}px ${surface} ${language}: collection first, original assets, albums/reload/back, Ralf second, audio load/play/pause/navigation, four preserved song URLs, layout, no runtime errors`);
  await context.close();
}
}finally{await browser.close()}
