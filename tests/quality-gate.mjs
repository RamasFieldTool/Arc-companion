import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(items)||items.length<3) throw new Error('items.json needs at least 3 fixture items');

const fixtureItems=items.slice(0,Math.min(items.length,60));
const fallbackFiles=fixtureItems.slice(0,3).map((item,index)=>({
  name:`quality_gate_${index}.json`,type:'file',download_url:`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/quality_gate_${index}.json`,item
}));
const quest={
  id:'quality_gate_quest',
  name:{de:'Qualitätstest',en:'Quality gate quest'},
  trader:'Test',objectives:[{de:'Testziel',en:'Test objective'}],
  requiredItemIds:[{itemId:fixtureItems[0].id,quantity:1}],rewardItemIds:[],grantedItemIds:[]
};
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_quest.json';

function itemLabel(item){
  return item?.name?.de||item?.name?.en||item?.de||item?.en||item?.id||'';
}

async function installRoutes(page,mode){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    if(mode==='live'){
      const url=new URL(route.request().url());
      const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
      const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
      const pageItems=fixtureItems.slice(offset,offset+limit);
      const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
      if(offset+limit<fixtureItems.length) body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
    }else{
      await route.fulfill({status:503,contentType:'application/json',body:'{"error":"simulated Mahcks outage"}'});
    }
  });

  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',async route=>{
    if(mode==='fallback'){
      await route.fulfill({status:503,contentType:'application/json',body:'{"error":"simulated GitHub outage"}'});
      return;
    }
    const index=fallbackFiles.map(({name,type,download_url})=>({name,type,download_url}));
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(index)});
  });

  for(let i=0;i<fallbackFiles.length;i++){
    const file=fallbackFiles[i];
    await page.route(file.download_url,async route=>{
      if(mode==='partial'&&i===fallbackFiles.length-1){
        await route.fulfill({status:503,contentType:'application/json',body:'{"error":"simulated single-file failure"}'});
      }else{
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(file.item)});
      }
    });
  }

  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',async route=>{
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'quality_gate_quest.json',type:'file',download_url:questUrl}])});
  });
  await page.route(questUrl,async route=>{
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)});
  });
}

async function waitForState(page,state){
  await page.waitForFunction(expected=>document.querySelector('#dataStatusPersistent')?.dataset.state===expected,state,{timeout:30000});
  const actual=await page.locator('#dataStatusPersistent').getAttribute('data-state');
  if(actual!==state) throw new Error(`Expected data state ${state}, got ${actual}`);
}

async function runScenario(browser,{name,mode,expectedState,interactive=false}){
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  await installRoutes(page,mode);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await waitForState(page,expectedState);

  const version=(await page.locator('#dataStatusDock [data-app-version]').innerText()).trim();
  if(version!=='V13.0.15') throw new Error(`${name}: expected V13.0.15, got ${version}`);

  if(interactive){
    await page.locator('[data-app-target="itemsSection"]').click();
    const label=itemLabel(fixtureItems[0]);
    await page.locator('#q').fill(label.slice(0,Math.max(3,Math.min(label.length,8))));
    if(await page.locator('#out .card').count()<1) throw new Error('Item search returned no cards');

    await page.locator('#appBack').click();
    await page.locator('[data-app-target="goalsSection"]').click();
    await page.locator('#goals .levelbtn').first().click();
    const activeGoals=await page.evaluate(()=>JSON.parse(localStorage.getItem('arcActiveGoals')||'{}'));
    if(!Object.keys(activeGoals).length) throw new Error('Goal activation was not persisted');

    await page.locator('#appBack').click();
    await page.locator('[data-app-target="supplySection"]').click();
    if(!(await page.locator('#summary').innerText()).trim()) throw new Error('Requirements summary is empty');

    await page.locator('#appBack').click();
    await page.locator('[data-app-target="questDrawer"]').click();
    await page.locator('.quest-card').first().waitFor({state:'visible'});
    await page.locator('.quest-card [data-state="active"]').first().click();
    const questStates=await page.evaluate(()=>JSON.parse(localStorage.getItem('arcQuestStatus')||'{}'));
    if(questStates.quality_gate_quest!=='active') throw new Error('Quest activation was not persisted');
  }

  if(pageErrors.length) throw new Error(`${name}: uncaught browser error(s): ${pageErrors.join(' | ')}`);
  console.log(`PASS ${name}: ${expectedState}`);
  await page.close();
}

const browser=await chromium.launch({headless:true});
try{
  await runScenario(browser,{name:'Mahcks live + core interactions',mode:'live',expectedState:'live',interactive:true});
  await runScenario(browser,{name:'Mahcks down, complete RaidTheory fallback',mode:'github',expectedState:'live'});
  await runScenario(browser,{name:'Mahcks down, partial RaidTheory fallback',mode:'partial',expectedState:'partial'});
  await runScenario(browser,{name:'All external item sources down',mode:'fallback',expectedState:'fallback'});
  console.log('All browser quality-gate scenarios passed.');
}finally{
  await browser.close();
}
