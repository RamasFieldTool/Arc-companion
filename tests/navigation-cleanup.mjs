import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(items)||!items.length)throw new Error('items.json fixture missing');
const fixtureItems=items.slice(0,Math.min(items.length,60));
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/navigation_cleanup_quality.json';
const quest={id:'navigation_cleanup_quality',name:{de:'Navigationstest',en:'Navigation test'},trader:'Test',objectives:[],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};

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
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'navigation_cleanup_quality.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({
  viewport:{width:360,height:800},screen:{width:360,height:800},isMobile:true,hasTouch:true,
  userAgent:'Mozilla/5.0 (Linux; Android 16; RamasFieldToolNavigationTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
});
await context.addInitScript(()=>{
  localStorage.setItem('arcLang','en');
  localStorage.setItem('arcUiLanguage','en');
  localStorage.setItem('arcLanguageOnboardingPending','0');
  localStorage.setItem('arcTheme','dark');
  localStorage.setItem('arcPaletteSurface','black');
});
const page=await context.newPage();
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(String(error)));
try{
  await installRoutes(page);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});

  if(await page.locator('.floating-list-close').count())throw new Error('Redundant floating list close button still exists');

  await page.locator('[data-app-target="itemsSection"]').tap();
  await page.waitForFunction(()=>document.getElementById('itemsSection')?.classList.contains('launcher-active')&&document.getElementById('itemsSection')?.open);
  const summary=page.locator('#itemsSection > summary');
  if(!(await summary.isVisible()))throw new Error('Item Search header is not visible in black mobile detail view');
  const position=await summary.evaluate(el=>getComputedStyle(el).position);
  if(position!=='sticky')throw new Error(`Item Search header should be sticky, got ${position}`);

  const input=page.locator('#q');
  await input.fill('steel');
  await summary.tap();
  await page.locator('#appLauncher').waitFor({state:'visible'});
  const closed=await page.locator('#itemsSection').evaluate(el=>({open:el.open,active:el.classList.contains('launcher-active')}));
  if(closed.open||closed.active)throw new Error('Tapping the Item Search header did not collapse the feature back to Home');

  await page.locator('[data-app-target="itemsSection"]').tap();
  await page.waitForFunction(()=>document.getElementById('itemsSection')?.open);
  if(await input.inputValue()!=='steel')throw new Error('Collapsing and reopening Item Search cleared the current query');

  const logo=page.locator('.official-app-logo');
  await logo.tap();
  await page.locator('#appLauncher').waitFor({state:'visible'});
  if(await page.locator('.floating-list-close').count())throw new Error('Floating close button appeared after navigation');

  if(pageErrors.length)throw new Error(`uncaught browser errors: ${pageErrors.join(' | ')}`);
  console.log('PASS F-43 navigation: sticky local collapse, no floating close control, global logo Home.');
}finally{
  await context.close();
  await browser.close();
}
