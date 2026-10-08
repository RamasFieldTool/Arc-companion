import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const storyContext={window:{},document:{documentElement:{lang:'de'},readyState:'loading',addEventListener(){}},MutationObserver:class{observe(){}}};
storyContext.window.addEventListener=()=>{};
vm.runInNewContext(await readFile(new URL('../raider-stories.js',import.meta.url),'utf8'),storyContext);
const zoeSource=storyContext.window.RFTCommunityStories.find(story=>story.id==='captain-defib');
assert.equal(createHash('sha256').update(zoeSource.content).digest('hex'),'d1120f76cb09b6df1e25e35e819da53e9b34f4fb6eeb1232caf0c25e794e07b4');
const zoeTitles={de:'Die Legende von CaptainDefib',en:'The Legend of CaptainDefib',fr:'La légende de CaptainDefib',es:'La leyenda de CaptainDefib'};
for(const lang of ['de','en','fr','es']){
  assert.equal(zoeSource.translations[lang].title,zoeTitles[lang]);
  assert.ok(zoeSource.translations[lang].content.length>2500);
  assert.ok(zoeSource.translations[lang].content.includes(zoeSource.translations[lang].nameQuestion));
  assert.equal(zoeSource.translations[lang].content.split('"CaptainDefib"').length,2);
}

const leaperSource=storyContext.window.RFTCommunityStories.find(story=>story.id==='leaper');
assert.equal(leaperSource.author,'Zoe Bristow');
assert.equal(createHash('sha256').update(leaperSource.content).digest('hex'),'b960714c1a5cbb9cdb907155340b47e75258a872c7a0d6bf271c0354057e9386');
assert.ok(leaperSource.content.endsWith('Der Springer ist eine Tragikomödie auf vier Beinen.'));
assert.ok(!leaperSource.content.includes('Eine Anmerkung zu meinem Bild'));
assert.equal(createHash('sha256').update(await readFile(new URL('../assets/stories/leaper-zoe-bristow.jpg',import.meta.url))).digest('hex'),'1912297ffaa1b9fb1fce69f72ad1e3282f5c6313c34425d6a2cc38b32a656229');
for(const lang of ['de','en','fr','es']){
  assert.ok(leaperSource.translations[lang].content.length>3500);
  assert.ok(leaperSource.translations[lang].title);
  assert.ok(leaperSource.translations[lang].editorialNote);
}

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const bluffSource=storyContext.window.RFTCommunityStories.find(story=>story.id==='veraeppelt');
assert.equal(bluffSource.author,'Zoe Bristow');
assert.equal(createHash('sha256').update(bluffSource.content).digest('hex'),'0dbc80ffde9cac5c0f9ca4214d02c910b928dfead4a6d71078d0bad328b3de0b');
assert.equal(createHash('sha256').update(await readFile(new URL('../assets/stories/veraeppelt-zoe-bristow.jpg',import.meta.url))).digest('hex'),'3a1db039d6cee1e2ba64ab16f54bd07b24d24430c2ad48f6683a0fae94d3fabd');
for(const lang of ['de','en','fr','es','it']){
  assert.ok(bluffSource.translations[lang].title);
  assert.ok(bluffSource.translations[lang].content.length>6000);
  assert.equal(bluffSource.translations[lang].content.split('\n').length,43);
}
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const originalHash='7ab9b61aa40f645f6304258baaffdc878cafd7c55eef508d200cd1d67607ea39';
const imageHash='028adc01c3ac543acc0850b0bb91fb9e21505dc610be963190549bd35e8aef14';
assert.equal(createHash('sha256').update(await readFile(new URL('../assets/stories/versteckspiel-chris-fenzelino.jpg',import.meta.url))).digest('hex'),imageHash);
const labels={
  de:['Story lesen','← Zurück zu Raider Stories','← Zurück zu Fan Creations'],
  en:['Read story','← Back to Raider Stories','← Back to Fan Creations'],
  fr:['Lire l’histoire','← Retour à Raider Stories','← Retour à Fan Creations'],
  es:['Leer historia','← Volver a Raider Stories','← Volver a Fan Creations']
};
const storyExpected={
  de:{title:'Versteckspiel',summary:'Drei gegen einen. Geduldig warten sie im Dunkeln auf ihr Opfer.',first:'Ich warte. Warte bis endlich jemand kommt.',last:'Sie machen es uns so einfach…',credit:'Community Story von Chris Fenzelino'},
  en:{title:'Hide and Seek',summary:'Three against one. They wait patiently in the darkness for their victim.',first:'I wait. I wait for someone to finally come.',last:'They make it so easy for us…',credit:'Community Story by Chris Fenzelino'},
  fr:{title:'Cache-cache',summary:'Trois contre un. Ils attendent patiemment leur victime dans l’obscurité.',first:'J’attends. J’attends que quelqu’un finisse enfin par arriver.',last:'Ils nous rendent les choses tellement faciles…',credit:'Histoire de la communauté par Chris Fenzelino'},
  es:{title:'El escondite',summary:'Tres contra uno. Esperan pacientemente a su víctima en la oscuridad.',first:'Espero. Espero hasta que por fin aparezca alguien.',last:'Nos lo ponen demasiado fácil…',credit:'Historia de la comunidad de Chris Fenzelino'}
};
assert.equal(createHash('sha256').update(await readFile(new URL('../assets/stories/captain-defib-zoe-bristow.jpg',import.meta.url))).digest('hex'),'5553adcdc9ceae95525486ccc0e6c7ede6ff9c8189e3c5a350840d9fae194e6e');
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
}
async function visible(page,selector){await page.locator(selector).waitFor({state:'visible'});}
async function hash(page,value){await page.waitForFunction(expected=>location.hash===expected,value);}
async function checkText(page,language){
  const expected=storyExpected[language];
  // Boot reapplies the engine language after both catalog and quests settle.
  await page.waitForFunction(()=>['live','partial','fallback'].includes(document.getElementById('dataStatusPersistent')?.dataset.state)&&typeof window.arcSetLanguage==='function');
  await page.waitForFunction(({language,title,credit})=>document.querySelector('.fan-story-body')?.lang===language&&document.querySelector('.fan-story-title')?.textContent===title&&!document.querySelector('.fan-story-body h3')&&document.querySelector('.fan-story-credit p')?.textContent===credit,{language,title:expected.title,credit:expected.credit});
  const text=await page.locator('.fan-story-body').evaluate(el=>[...el.children].map(node=>node.textContent).join('\n\n'));
  assert.equal(await page.locator('.fan-story-body').getAttribute('lang'),language);
  assert.equal(await page.locator('.fan-story-title').textContent(),expected.title);
  assert.ok(text.startsWith(expected.first),text.slice(0,180));
  assert.ok(text.endsWith(expected.last),text.slice(-180));
  assert.equal(await page.locator('.fan-story-body h3').count(),0,'Story title must not be repeated inside the reading body');
  assert.equal(await page.locator('.fan-story-credit p').first().textContent(),expected.credit);
  if(language==='de')assert.equal(createHash('sha256').update(text).digest('hex'),originalHash,'German original prose, punctuation and whitespace must remain verbatim');
}
async function checkLayout(page,expectedInk='rgb(238, 231, 220)'){
  const metrics=await page.evaluate(()=>{
    const body=document.querySelector('.fan-story-body'),style=getComputedStyle(body.querySelector('p'));
    const buttons=[...document.querySelectorAll('.fan-story-view>.fan-view-back,.fan-story-social')].map(el=>el.getBoundingClientRect().height);
    return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,bodyOverflow:body.scrollWidth-body.clientWidth,font:parseFloat(style.fontSize),line:parseFloat(style.lineHeight),ink:style.color,buttons,paragraphInks:[...body.querySelectorAll('p:not(.fan-legend-reveal)')].map(p=>getComputedStyle(p).color)};
  });
  assert.ok(metrics.overflow<=1,JSON.stringify(metrics));
  assert.ok(metrics.bodyOverflow<=1,JSON.stringify(metrics));
  assert.ok(metrics.font>=17&&metrics.line/metrics.font>=1.7,JSON.stringify(metrics));
  assert.equal(metrics.ink,expectedInk);
  assert.ok(metrics.paragraphInks.every(ink=>ink===metrics.ink),JSON.stringify(metrics));
  assert.ok(metrics.buttons.every(height=>height>=44),JSON.stringify(metrics));
}

await mkdir(new URL('../test-artifacts/stories/',import.meta.url),{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  for(const width of [360,430])for(const surface of ['light','dark','black']){
    const context=await browser.newContext({viewport:{width,height:900},isMobile:true,hasTouch:true});
    await context.addInitScript(surface=>{
      if(!localStorage.getItem('arcUiLanguage')){
        localStorage.setItem('arcLang','de');
        localStorage.setItem('arcUiLanguage','de');
      }
      localStorage.setItem('arcLanguageOnboardingPending','0');
      localStorage.setItem('arcPaletteSurface',surface);
    },surface);
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    await installRoutes(page);
    await page.goto(BASE_URL+'#raiderRadio/stories/veraeppelt',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>['live','partial','fallback'].includes(document.getElementById('dataStatusPersistent')?.dataset.state)&&typeof window.arcSetLanguage==='function');
    await visible(page,'.fan-story-detail');
    for(const language of ['de','en','fr','es','it']){
      const expected=bluffSource.translations[language];
      console.log(`Veräppelt language check ${width}px ${surface}: ${language}`);
      await page.locator('#appBack').tap();await visible(page,'#appLauncher');
      await page.locator('#arcLanguageButton').tap();
      await page.locator(`#arcLanguageMenu [data-arc-language="${language}"]`).tap();
      await page.waitForFunction(lang=>document.documentElement.lang===lang,language);
      await page.locator('[data-app-target="raiderRadio"]').tap();
      await page.locator('[data-fan-view="stories"]').tap();await visible(page,'.fan-stories-grid');
      await page.locator('[data-story-id="veraeppelt"] .fan-story-read').tap();await visible(page,'.fan-story-detail');
      try{
        await page.waitForFunction(({lang,title})=>document.querySelector('.fan-story-body')?.lang===lang&&document.querySelector('.fan-story-title')?.textContent===title,{lang:language,title:expected.title});
      }catch(error){
        console.error(await page.evaluate(()=>({hash:location.hash,lang:document.documentElement.lang,title:document.querySelector('.fan-story-title')?.textContent,bodyLang:document.querySelector('.fan-story-body')?.lang})));
        throw error;
      }
      assert.equal(await page.locator('.fan-story-body').evaluate(el=>[...el.children].map(node=>node.textContent).join('\n\n')),expected.content);
      assert.equal(await page.locator('.fan-story-detail .fan-story-author').textContent(),'Zoe Bristow');
      const cover=page.locator('.fan-story-hero>img');
      await page.waitForFunction(()=>document.querySelector('.fan-story-hero>img')?.naturalWidth===1229);
      assert.equal(await cover.evaluate(img=>img.naturalHeight),1536);
      const ratio=await cover.evaluate(img=>{const r=img.getBoundingClientRect();return r.width/r.height});
      assert.ok(Math.abs(ratio-1229/1536)<0.01,'Portrait cover must retain its aspect ratio');
      await checkLayout(page);
      if(width===360&&surface==='dark'&&language==='de')await page.screenshot({path:new URL('../test-artifacts/stories/veraeppelt-de-dark-360.png',import.meta.url).pathname,fullPage:true});
    }
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('.fan-story-body')?.lang==='it');
    await page.locator('.fan-story-view>.fan-view-back').tap();await visible(page,'.fan-stories-grid');
    assert.equal(await page.locator('[data-story-id="veraeppelt"] .fan-story-card-title').textContent(),bluffSource.translations.it.title);
    assert.deepEqual(errors,[]);
    console.log(`PASS Veräppelt ${width}px ${surface}: five languages, full prose, portrait cover, reload and back navigation`);
    await context.close();
  }
  for(const width of [360,390,430])for(const surface of ['light','dark','black'])for(const language of ['de','en','fr','es']){
    const context=await browser.newContext({viewport:{width,height:900},isMobile:true,hasTouch:true});
    await context.addInitScript(({language,surface})=>{
      localStorage.setItem('arcLang',language==='de'?'de':'en');
      localStorage.setItem('arcUiLanguage',language);
      localStorage.setItem('arcLanguageOnboardingPending','0');
      localStorage.setItem('arcPaletteSurface',surface);
    },{language,surface});
    const page=await context.newPage(),errors=[];
    await context.route('https://suno.com/s/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Suno destination fixture</title>'}));
    page.on('pageerror',error=>errors.push(String(error)));
    await installRoutes(page);
    await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(l=>document.documentElement.lang===l&&typeof window.arcSetLanguage==='function',language);
    assert.equal(await page.locator('[data-app-target="raiderRadio"] b').textContent(),'Fan Creations');
    await page.locator('[data-app-target="raiderRadio"]').tap();
    await visible(page,'.fan-creations-hub');
    await page.locator('[data-fan-view="stories"]').tap();
    await visible(page,'.fan-stories-grid');
    assert.equal(await page.locator('.fan-story-card').count(),4);
    assert.equal(await page.locator('.fan-story-card').first().getAttribute('data-story-id'),'veraeppelt');
    assert.equal(await page.locator('.fan-story-new').textContent(),({de:'Neu',en:'New',fr:'Nouveau',es:'Nuevo'})[language]);
    const listMetrics=await page.locator('.fan-stories-grid').evaluate(grid=>{
      const cards=[...grid.querySelectorAll('.fan-story-card')];
      return {height:grid.getBoundingClientRect().height,covers:cards.map(card=>card.querySelector('img').getBoundingClientRect().width),links:cards.map(card=>{const r=card.getBoundingClientRect(),a=card.querySelector('.fan-story-read').getBoundingClientRect();return {row:r.width,link:a.width,height:r.height,linkHeight:a.height}})};
    });
    assert.ok(listMetrics.height<650,JSON.stringify(listMetrics));
    assert.ok(listMetrics.covers.every(width=>width<=65),JSON.stringify(listMetrics));
    assert.ok(listMetrics.links.every(r=>Math.abs(r.row-r.link)<=3&&Math.abs(r.height-r.linkHeight)<=3),'Whole story row must be clickable');
    await page.waitForFunction(({language,title})=>document.querySelector('[data-story-id="versteckspiel"] .fan-story-card-title')?.lang===language&&document.querySelector('[data-story-id="versteckspiel"] .fan-story-card-title')?.textContent===title,{language,title:storyExpected[language].title});
    assert.equal(await page.locator('.fan-story-card[data-story-id="versteckspiel"] .fan-story-card-title').textContent(),storyExpected[language].title);
    assert.equal(await page.locator('.fan-story-card[data-story-id="versteckspiel"] .fan-story-summary').textContent(),storyExpected[language].summary);
    assert.equal(await page.locator('.fan-story-card[data-story-id="versteckspiel"] .fan-story-read').textContent(),labels[language][0]);
    assert.equal(await page.locator('.fan-story-card[data-story-id="versteckspiel"] .fan-story-read').getAttribute('aria-label'),`${labels[language][0]}: ${storyExpected[language].title}`);
    assert.equal(await page.locator('.fan-view:has(.fan-stories-grid)>.fan-view-back').textContent(),labels[language][2]);
    await page.locator('.fan-story-card[data-story-id="versteckspiel"] .fan-story-read').tap();
    await hash(page,'#raiderRadio/stories/versteckspiel');
    await visible(page,'.fan-story-detail');
    await page.waitForFunction(()=>document.querySelector('.fan-story-hero>img')?.naturalWidth===1536);
    assert.equal(await page.locator('.fan-story-hero>img').evaluate(img=>img.naturalHeight),1024);
    assert.equal(await page.locator('.fan-story-view>.fan-view-back').textContent(),labels[language][1]);
    assert.equal(await page.locator('.fan-story-social').getAttribute('target'),'_blank');
    assert.equal(await page.locator('.fan-story-social').getAttribute('rel'),'noopener noreferrer');
    await checkText(page,language);await checkLayout(page);
    if(width===390&&language==='de')await page.screenshot({path:new URL(`../test-artifacts/stories/${surface}-390.png`,import.meta.url).pathname,fullPage:true});
    await page.goBack();await visible(page,'.fan-stories-grid');
    await page.waitForFunction(({language,title})=>document.querySelector('.fan-story-card-title')?.lang===language&&document.querySelector('.fan-story-card-title')?.textContent===title,{language,title:storyExpected[language].title});
    await page.goForward();await visible(page,'.fan-story-detail');await checkText(page,language);
    await page.reload({waitUntil:'domcontentloaded'});await visible(page,'.fan-story-detail');await checkText(page,language);
    await page.locator('.fan-story-view>.fan-view-back').tap();await visible(page,'.fan-stories-grid');
    await page.locator('.fan-view:has(.fan-stories-grid)>.fan-view-back').tap();await visible(page,'.fan-creations-hub');
    await page.locator('[data-fan-view="radio"]').tap();await visible(page,'#raiderRadioSongs');
    assert.deepEqual(await page.locator('#raiderRadioSongs .radio-listen').evaluateAll(links=>links.map(link=>link.href)),songs);
    await page.waitForFunction(()=>[...document.querySelectorAll('#raiderRadioSongs .radio-song img')].every(img=>img.complete&&img.naturalWidth>0));
    if(width===390&&surface==='light'&&language==='en'){
      for(let index=0;index<4;index++){
        const popupPromise=context.waitForEvent('page');await page.locator('#raiderRadioSongs .radio-listen').nth(index).tap();const popup=await popupPromise;
        await popup.waitForLoadState('domcontentloaded');assert.equal(popup.url(),songs[index]);await popup.close();
      }
    }
    await page.locator('#appBack').tap();await visible(page,'#appLauncher');
    await page.locator('[data-app-target="raiderRadio"]').tap();await visible(page,'.fan-creations-hub');
    assert.equal(await page.locator('.fan-story-view').isVisible(),false);
    await page.evaluate(()=>{location.hash='raiderRadio/stories/missing';});await visible(page,'.fan-stories-grid');
    await page.goto(BASE_URL+'#raiderRadio/stories/versteckspiel',{waitUntil:'domcontentloaded'});await visible(page,'.fan-story-detail');
    await checkText(page,language);
    // A real language switch must update the story title, summary/prose and credit too.
    await page.evaluate(()=>window.arcSetLanguage('fr'));await page.waitForFunction(()=>document.documentElement.lang==='fr');
    await page.waitForFunction(()=>document.querySelector('.fan-story-view>.fan-view-back').textContent==='← Retour à Raider Stories');
    await checkText(page,'fr');
    assert.equal(await page.locator('[data-app-target="raiderRadio"] b').textContent(),'Fan Creations');
    // Zoe's story follows the selected app language, including a switch while open.
    await page.goto(BASE_URL+'#raiderRadio/stories/captain-defib',{waitUntil:'domcontentloaded'});
    await visible(page,'.fan-story-detail');
    await page.waitForFunction(()=>['live','partial','fallback'].includes(document.getElementById('dataStatusPersistent')?.dataset.state)&&typeof window.arcSetLanguage==='function');
    for(const targetLanguage of [language,...['de','en','fr','es'].filter(value=>value!==language)]){
      const expected=zoeSource.translations[targetLanguage];
      await page.evaluate(lang=>window.arcSetLanguage(lang),targetLanguage);
      await page.waitForFunction(({lang,title,note,question})=>
        document.querySelector('.fan-story-body')?.lang===lang&&
        document.querySelector('.fan-story-title')?.textContent===title&&
        document.querySelector('.fan-story-editorial-note')?.textContent===note&&
        document.querySelector('.fan-legend-question')?.textContent===question,
        {lang:targetLanguage,title:expected.title,note:expected.editorialNote,question:expected.nameQuestion});
      const zoeText=await page.locator('.fan-story-body').evaluate(el=>[...el.children].map(node=>node.textContent).join('\n\n'));
      assert.equal(zoeText,expected.content);
      assert.equal(await page.locator('.fan-story-title').getAttribute('lang'),targetLanguage);
      assert.equal(await page.locator('.fan-story-editorial-note').getAttribute('lang'),targetLanguage);
      assert.equal(await page.locator('.fan-legend-reveal').textContent(), '\"CaptainDefib\"');
    }
    await page.waitForFunction(()=>document.querySelector('.fan-story-hero>img')?.naturalWidth===1536);
    assert.equal(await page.locator('.fan-story-hero>img').evaluate(img=>img.naturalHeight),1536);
    assert.equal(await page.locator('.fan-story-detail .fan-story-author').textContent(),'Zoe Bristow');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1));
    await page.reload({waitUntil:'domcontentloaded'});await visible(page,'.fan-legend-reveal');
    await page.waitForFunction(()=>typeof window.arcSetLanguage==='function');
    await page.locator('.fan-story-view>.fan-view-back').tap();await visible(page,'.fan-stories-grid');
    assert.equal(await page.locator('.fan-story-card').count(),4);
    const cardExpected=zoeSource.translations[await page.evaluate(()=>document.documentElement.lang)];
    assert.equal(await page.locator('[data-story-id="captain-defib"] .fan-story-card-title').textContent(),cardExpected.title);
    assert.equal(await page.locator('[data-story-id="captain-defib"] .fan-story-summary').textContent(),cardExpected.summary);
    // The third story uses the supplied cover and preserves Zoe's exact German text.
    await page.locator('[data-story-id="leaper"] .fan-story-read').tap();
    await hash(page,'#raiderRadio/stories/leaper');await visible(page,'.fan-story-detail');
    for(const targetLanguage of ['de','en','fr','es']){
      const expected=leaperSource.translations[targetLanguage];
      await page.evaluate(lang=>window.arcSetLanguage(lang),targetLanguage);
      await page.waitForFunction(({lang,title,note})=>document.querySelector('.fan-story-body')?.lang===lang&&document.querySelector('.fan-story-title')?.textContent===title&&document.querySelector('.fan-story-editorial-note')?.textContent===note,{lang:targetLanguage,title:expected.title,note:expected.editorialNote});
      const prose=await page.locator('.fan-story-body').evaluate(el=>[...el.children].map(node=>node.textContent).join('\n\n'));
      assert.equal(prose,expected.content);
      assert.equal(await page.locator('.fan-story-detail .fan-story-author').textContent(),'Zoe Bristow');
    }
    await page.waitForFunction(()=>document.querySelector('.fan-story-hero>img')?.naturalWidth===1536);
    assert.equal(await page.locator('.fan-story-hero>img').evaluate(img=>img.naturalHeight),1536);
    assert.equal(await page.locator('.fan-story-detail').getAttribute('data-story-theme'),'forest-tragicomedy');
    await checkLayout(page,'rgb(242, 241, 230)');
    if(width===390&&language==='de'){
      await page.evaluate(()=>window.arcSetLanguage('de'));
      await page.waitForFunction(()=>document.querySelector('.fan-story-body')?.lang==='de');
      await page.screenshot({path:new URL(`../test-artifacts/stories/leaper-${surface}-390.png`,import.meta.url).pathname,fullPage:true});
    }
    await page.reload({waitUntil:'domcontentloaded'});await visible(page,'.fan-story-detail');
    await page.waitForFunction(()=>document.querySelector('.fan-story-body p')&&document.querySelector('.fan-story-hero>img')?.naturalWidth===1536);
    await page.locator('.fan-story-view>.fan-view-back').tap();await visible(page,'.fan-stories-grid');
    assert.equal(await page.locator('[data-story-id="leaper"] .fan-story-author').textContent(),'Zoe Bristow');
    assert.deepEqual(errors,[]);
    console.log(`PASS community story ${width}px ${surface} ${language}: localized story/UI, verbatim DE original, image, layout, hash/history/reload/back, radio covers and links`);
    await context.close();
  }
  // Italian uses the existing selector overlay, rather than arcSetLanguage('it').
  for(const width of [360,390])for(const surface of ['light','dark','black']){
    const context=await browser.newContext({viewport:{width,height:900},isMobile:true,hasTouch:true});
    await context.addInitScript(surface=>{
      if(!localStorage.getItem('arcUiLanguage')){
        localStorage.setItem('arcLang','en');localStorage.setItem('arcUiLanguage','en');
      }
      localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPaletteSurface',surface);
    },surface);
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    await installRoutes(page);
    await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>['live','partial','fallback'].includes(document.getElementById('dataStatusPersistent')?.dataset.state));
    for(const language of ['it','de','it','en','it']){
      if(await page.locator('#appBack').isVisible())await page.locator('#appBack').tap();
      await visible(page,'#appLauncher');
      await page.locator('#arcLanguageButton').tap();
      await page.locator(`#arcLanguageMenu [data-arc-language="${language}"]`).tap();
      await page.waitForFunction(lang=>document.documentElement.lang===lang,language);
      await page.locator('[data-app-target="raiderRadio"]').tap();
      await page.locator('[data-fan-view="stories"]').tap();await visible(page,'.fan-stories-grid');
      assert.equal(await page.locator('.fan-story-card').count(),4);
      for(const story of storyContext.window.RFTCommunityStories){
        const expected=story.translations[language];
        assert.ok(expected?.content.length>1500,`${story.id} ${language}: full translation missing`);
        await page.waitForFunction(({id,title})=>document.querySelector(`[data-story-id="${id}"] .fan-story-card-title`)?.textContent===title,{id:story.id,title:expected.title});
        assert.equal(await page.locator(`[data-story-id="${story.id}"] .fan-story-summary`).textContent(),expected.summary);
        if(language==='it')assert.equal(await page.locator(`[data-story-id="${story.id}"] .fan-story-read`).textContent(),'Leggi il racconto');
        await page.locator(`[data-story-id="${story.id}"] .fan-story-read`).tap();await visible(page,'.fan-story-detail');
        await page.waitForFunction(lang=>document.querySelector('.fan-story-body')?.lang===lang,language);
        assert.equal(await page.locator('.fan-story-title').textContent(),expected.title);
        assert.equal(await page.locator('.fan-story-body').evaluate(el=>[...el.children].map(node=>node.textContent).join('\n\n')),expected.content);
        await page.waitForFunction(()=>document.querySelector('.fan-story-hero>img')?.naturalWidth>0);
        if(language==='it'){
          assert.equal(await page.locator('.fan-story-view>.fan-view-back').textContent(),'← Torna a Raider Stories');
          assert.equal(await page.locator('.fan-story-credit p').first().textContent(),`Racconto della community di ${story.author}`);
          await checkLayout(page,story.id==='leaper'?'rgb(242, 241, 230)':story.id==='captain-defib'?'rgb(255, 240, 217)':'rgb(238, 231, 220)');
          if(story.id==='captain-defib'){
            assert.equal(await page.locator('.fan-legend-question').textContent(),expected.nameQuestion);
            assert.equal(await page.locator('.fan-legend-reveal').textContent(),'"CaptainDefib"');
            assert.equal(await page.locator('.fan-legend-reveal').evaluate(el=>getComputedStyle(el).color),'rgb(255, 179, 103)');
          }
          await page.reload({waitUntil:'domcontentloaded'});await visible(page,'.fan-story-detail');
          await page.waitForFunction(content=>{const body=document.querySelector('.fan-story-body');return body?.lang==='it'&&[...body.children].map(node=>node.textContent).join('\n\n')===content},expected.content);
          assert.equal(await page.locator('.fan-story-body').evaluate(el=>[...el.children].map(node=>node.textContent).join('\n\n')),expected.content);
          assert.equal(await page.evaluate(()=>localStorage.getItem('arcUiLanguage')),'it');
          if(width===390)await page.screenshot({path:new URL(`../test-artifacts/stories/${story.id}-it-${surface}-390.png`,import.meta.url).pathname,fullPage:true});
        }
        await page.locator('.fan-story-view>.fan-view-back').tap();await visible(page,'.fan-stories-grid');
      }
    }
    assert.deepEqual(errors,[]);
    console.log(`PASS Italian all four stories ${width}px ${surface}: real selector IT–DE–IT–EN–IT, complete prose, cards, credits, reload, mobile layout and runtime`);
    await context.close();
  }
}finally{await browser.close();}
