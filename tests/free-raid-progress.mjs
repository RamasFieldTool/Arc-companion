import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const allItems=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(allItems)||!allItems.length)throw new Error('Item fixture is empty');
const fixtureItems=allItems.slice(0,Math.min(allItems.length,60));
const item=fixtureItems.find(entry=>entry?.id&&(entry?.name?.en||entry?.name?.de||entry?.en||entry?.de))||fixtureItems[0];
const itemName=item?.name?.en||item?.name?.de||item?.en||item?.de||item.id;
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_free_raid.json';
const quest={id:'quality_gate_free_raid',name:{de:'Raid-Test',en:'Raid test'},trader:'Test',objectives:[],requiredItemIds:[{itemId:item.id,quantity:3}],rewardItemIds:[],grantedItemIds:[]};

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
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'quality_gate_free_raid.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}

async function assertSummary(page,{total,owned,missing,personal}){
  const row=page.locator(`#summary article.summary-item[data-item-id="${item.id}"]`);
  await row.waitFor({state:'attached'});
  await page.waitForFunction(({id,missing})=>document.querySelector(`#summary article.summary-item[data-item-id="${CSS.escape(id)}"]`)?.dataset.missing===String(missing),{id:item.id,missing});
  const numbers=await row.locator('.summary-numbers b').allTextContents();
  if(numbers[0]!==String(total)||numbers[1]!==String(owned))throw new Error(`Summary mismatch: expected total ${total}, owned ${owned}; got ${numbers.join(' / ')}`);
  const usage=await row.locator('.summary-usage').innerText();
  if(!usage.includes(`Personal need: ${personal}`))throw new Error(`Personal requirement reason missing or unclear: ${usage}`);
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:412,height:915},screen:{width:412,height:915},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 16; RamasFieldToolRaidProgressTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'});
  await context.addInitScript(()=>{
    localStorage.setItem('arcLang','en');
    localStorage.setItem('arcUiLanguage','en');
    localStorage.setItem('arcLanguageOnboardingPending','0');
    localStorage.setItem('arcOwned','{}');
    localStorage.setItem('arcActiveGoals','{}');
    localStorage.setItem('arcQuestStatus',JSON.stringify({quality_gate_free_raid:'active'}));
    localStorage.removeItem('arcNextRaid');
  });
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  await installRoutes(page);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});
  await page.waitForFunction(id=>document.querySelector(`#summary article.summary-item[data-item-id="${CSS.escape(id)}"]`)?.dataset.missing==='3',item.id);

  await page.locator('[data-app-target="nextRaidDrawer"]').click();
  await page.locator('#nextRaidFreeItems').waitFor({state:'visible'});
  await page.locator('#nextRaidFreeItems > summary').click();
  const search=page.locator('#nextRaidFreeItems .raid-free-search input');
  await search.fill(String(itemName));
  const row=page.locator(`.raid-free-result[data-free-item-id="${item.id}"]`);
  await row.waitFor({state:'visible'});
  const amount=row.locator('.raid-free-amount input');
  await amount.fill('10');
  await row.locator('[data-free-item-add]').click();

  await page.waitForFunction(id=>{
    const raid=JSON.parse(localStorage.getItem('arcNextRaid')||'{}');
    const entry=raid[id];
    return entry?.target===10&&entry?.personal===true&&entry?.found===0&&entry?.done===false;
  },item.id);
  await page.waitForFunction(id=>{
    const input=document.querySelector(`.raid-free-result[data-free-item-id="${CSS.escape(id)}"] .raid-free-amount input`);
    return input?.disabled&&input.value==='10';
  },item.id);
  console.log('PASS saved free-item picker keeps the planned amount visible');

  await assertSummary(page,{total:13,owned:0,missing:13,personal:10});
  console.log('PASS quest need 3 + personal raid target 10 = total requirements 13');

  const raidRow=page.locator(`.next-raid-item[data-raid-id="${item.id}"]`);
  await raidRow.waitFor({state:'visible'});
  if(!(await raidRow.locator('.next-raid-progress').innerText()).includes('0 / 10'))throw new Error('Initial personal progress is not 0 / 10');

  await page.locator('#nextRaidFinished').click();
  const foundRow=page.locator(`.next-raid-found-row[data-found-id="${item.id}"]`);
  await foundRow.waitFor({state:'visible'});
  await foundRow.locator('[data-found-input]').fill('5');
  await page.locator('#nextRaidApplyFinds').click();

  await page.waitForFunction(id=>{
    const raid=JSON.parse(localStorage.getItem('arcNextRaid')||'{}');
    const owned=JSON.parse(localStorage.getItem('arcOwned')||'{}');
    return raid[id]?.target===10&&raid[id]?.found===5&&raid[id]?.done===false&&owned[id]===5;
  },item.id);
  const halfway=await raidRow.locator('.next-raid-progress').innerText();
  if(!halfway.includes('5 / 10')||!halfway.includes('5 OPEN'))throw new Error(`Halfway progress is unclear: ${halfway}`);
  await assertSummary(page,{total:13,owned:5,missing:8,personal:10});
  console.log('PASS owned stock is subtracted once from combined total requirements');

  const secondFound=page.locator(`.next-raid-found-row[data-found-id="${item.id}"] [data-found-input]`);
  await secondFound.fill('5');
  await page.locator('#nextRaidApplyFinds').click();
  await page.waitForFunction(id=>{
    const raid=JSON.parse(localStorage.getItem('arcNextRaid')||'{}');
    const owned=JSON.parse(localStorage.getItem('arcOwned')||'{}');
    return raid[id]?.target===10&&raid[id]?.found===10&&raid[id]?.done===true&&owned[id]===10;
  },item.id);
  await assertSummary(page,{total:13,owned:10,missing:3,personal:10});
  console.log('PASS personal raid target completes while independent quest need remains visible');

  if(pageErrors.length)throw new Error(`Uncaught browser errors: ${pageErrors.join(' | ')}`);
  await context.close();
}finally{
  await browser.close();
}
