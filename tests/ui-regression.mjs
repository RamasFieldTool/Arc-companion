import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const OUTPUT=new URL('../test-artifacts/ui/',import.meta.url);
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(items)||!items.length)throw new Error('items.json fixture missing');
const fixtureItems=items.slice(0,Math.min(items.length,60));
const screenshotPath=name=>fileURLToPath(new URL(name,OUTPUT));

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url());
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=fixtureItems.slice(offset,offset+limit);
    const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>
    route.fulfill({status:503,contentType:'application/json',body:'{"error":"not needed"}'})
  );
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>
    route.fulfill({status:503,contentType:'application/json',body:'{"error":"not needed"}'})
  );
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>
    route.fulfill({status:200,contentType:'application/json',body:'[]'})
  );
}

async function waitForLive(page){
  await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});
}

async function measure(page){
  return await page.evaluate(()=>{
    const rect=el=>{
      const r=el?.getBoundingClientRect();
      return r?{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}:null;
    };
    return {
      viewport:{width:innerWidth,height:innerHeight},
      document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight},
      masthead:rect(document.querySelector('.masthead')),
      launcher:rect(document.querySelector('#appLauncher')),
      tiles:[...document.querySelectorAll('#appLauncher .app-tile')].map(tile=>({target:tile.dataset.appTarget,...rect(tile)})),
      version:document.querySelector('#dataStatusDock [data-app-version]')?.textContent?.trim()||'',
      surface:document.documentElement.dataset.surface||'',
      accent:document.documentElement.dataset.accent||''
    };
  });
}

function assertLayout(metrics,label){
  const overflow=metrics.document.scrollWidth-metrics.document.clientWidth;
  if(overflow>4)throw new Error(`${label}: horizontal overflow ${overflow}px`);
  if(!metrics.masthead||metrics.masthead.width<100||metrics.masthead.height<40)throw new Error(`${label}: masthead collapsed`);
  if(!metrics.launcher||metrics.launcher.width<100)throw new Error(`${label}: launcher collapsed`);
  if(metrics.tiles.length<8)throw new Error(`${label}: expected at least 8 launcher tiles, got ${metrics.tiles.length}`);
  for(const tile of metrics.tiles){
    if(tile.width<44||tile.height<44)throw new Error(`${label}: touch target ${tile.target} is ${tile.width}x${tile.height}`);
    if(tile.x<-4||tile.x+tile.width>metrics.viewport.width+4)throw new Error(`${label}: tile ${tile.target} exceeds viewport`);
  }
  if(metrics.version!=='V13.0.16')throw new Error(`${label}: expected V13.0.16, got ${metrics.version}`);
}

async function openTarget(page,target){
  const home=page.locator('#appLauncher');
  if(!(await home.isVisible())){
    await page.locator('#appBack').click();
    await home.waitFor({state:'visible'});
  }
  await page.locator(`[data-app-target="${target}"]`).click();
  const section=page.locator(`#${target}`);
  await section.waitFor({state:'visible'});
  const state=await section.evaluate(el=>({active:el.classList.contains('launcher-active'),open:el.tagName==='DETAILS'?el.open:true,width:el.getBoundingClientRect().width,right:el.getBoundingClientRect().right}));
  if(!state.active||!state.open)throw new Error(`${target}: launcher did not activate/open the target`);
  const viewportWidth=await page.evaluate(()=>innerWidth);
  if(state.width<100||state.right>viewportWidth+4)throw new Error(`${target}: opened view exceeds viewport`);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`${target}: opened view causes ${overflow}px horizontal overflow`);
}

await mkdir(OUTPUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const configs=[
  {name:'android-small',width:360,height:800,isMobile:true,hasTouch:true,views:['itemsSection']},
  {name:'android-standard',width:412,height:915,isMobile:true,hasTouch:true,views:['backupPanel','questDrawer']},
  {name:'desktop',width:1280,height:900,isMobile:false,hasTouch:false,views:['goalsSection','itemsSection']}
];
const report=[];
try{
  for(const config of configs){
    const context=await browser.newContext({
      viewport:{width:config.width,height:config.height},screen:{width:config.width,height:config.height},
      isMobile:config.isMobile,hasTouch:config.hasTouch,
      userAgent:config.isMobile?'Mozilla/5.0 (Linux; Android 16; RamasFieldToolVisualTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36':undefined
    });
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on('pageerror',error=>pageErrors.push(String(error)));
    page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
    await installRoutes(page);
    await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
    await waitForLive(page);
    await page.evaluate(async()=>{
      if(document.fonts?.ready)await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1000))]);
    });
    const homeMetrics=await measure(page);
    assertLayout(homeMetrics,config.name);
    await page.screenshot({path:screenshotPath(`${config.name}-home.png`),fullPage:true});

    const opened=[];
    for(const target of config.views){
      await openTarget(page,target);
      await page.screenshot({path:screenshotPath(`${config.name}-${target}.png`),fullPage:true});
      const details=await page.locator(`#${target}`).evaluate((el,targetName)=>{
        const r=el.getBoundingClientRect();
        return {target:targetName,width:Math.round(r.width),height:Math.round(r.height),scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth};
      },target);
      if(details.scrollWidth-details.clientWidth>4)throw new Error(`${config.name}/${target}: horizontal overflow after opening view`);
      opened.push(details);
      await page.locator('#appBack').click();
      await page.locator('#appLauncher').waitFor({state:'visible'});
    }

    if(pageErrors.length)throw new Error(`${config.name}: uncaught browser errors: ${pageErrors.join(' | ')}`);
    if(consoleErrors.length)throw new Error(`${config.name}: console errors: ${consoleErrors.join(' | ')}`);
    report.push({config,home:homeMetrics,opened});
    console.log(`PASS ${config.name}: responsive layout and ${config.views.length} opened view(s)`);
    await context.close();
  }
  await writeFile(new URL('layout-report.json',OUTPUT),JSON.stringify(report,null,2));
  console.log('All responsive UI regression checks passed; screenshots captured.');
}finally{
  await browser.close();
}
