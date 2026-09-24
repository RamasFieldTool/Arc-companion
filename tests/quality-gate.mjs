import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const SNAPSHOT_URL='https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(items)||items.length<3) throw new Error('items.json needs at least 3 fixture items');

const fixtureItems=items.slice(0,Math.min(items.length,60));
const snapshotFixture={
  schema:'ramas-field-tool-item-snapshot',formatVersion:1,generatedAt:'2026-09-24T00:00:00.000Z',
  source:'quality-gate',sourceRef:'test',count:Math.max(100,fixtureItems.length),items:[]
};
while(snapshotFixture.items.length<100){
  const source=fixtureItems[snapshotFixture.items.length%fixtureItems.length];
  snapshotFixture.items.push({...source,id:`quality_snapshot_${snapshotFixture.items.length}_${source.id}`});
}
snapshotFixture.count=snapshotFixture.items.length;

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
    }else if(mode==='invalid-live'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'items',total:999,count:1,offset:0,limit:45,items:[fixtureItems[0]]})});
    }else{
      await route.fulfill({status:503,contentType:'application/json',body:'{"error":"simulated Mahcks outage"}'});
    }
  });

  await page.route(SNAPSHOT_URL,async route=>{
    if(mode==='snapshot'||mode==='invalid-live'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(snapshotFixture)});
    }else{
      await route.fulfill({status:503,contentType:'application/json',body:'{"error":"simulated snapshot outage"}'});
    }
  });

  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',async route=>{
    if(mode==='github'||mode==='partial'){
      const index=fallbackFiles.map(({name,type,download_url})=>({name,type,download_url}));
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(index)});
      return;
    }
    await route.fulfill({status:503,contentType:'application/json',body:'{"error":"simulated GitHub outage"}'});
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

async function openLauncherTarget(page,target,mobile){
  const locator=page.locator(`[data-app-target="${target}"]`);
  if(mobile) await locator.tap(); else await locator.click();
}

async function runScenario(browser,{name,mode,expectedState,interactive=false,mobile=false}){
  const context=await browser.newContext(mobile?{
    viewport:{width:412,height:915},screen:{width:412,height:915},isMobile:true,hasTouch:true,
    userAgent:'Mozilla/5.0 (Linux; Android 16; RamasFieldToolTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
  }:{viewport:{width:1280,height:900}});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  await installRoutes(page,mode);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await waitForState(page,expectedState);

  const version=(await page.locator('#dataStatusDock [data-app-version]').innerText()).trim();
  if(version!=='V13.0.17') throw new Error(`${name}: expected V13.0.17, got ${version}`);

  if(mobile){
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    if(overflow>4) throw new Error(`${name}: horizontal overflow on Android viewport (${overflow}px)`);
    const firstTile=page.locator('#appLauncher .app-tile').first();
    const box=await firstTile.boundingBox();
    if(!box||box.height<44||box.width<44) throw new Error(`${name}: launcher touch target is too small`);
  }

  if(interactive){
    await openLauncherTarget(page,'itemsSection',mobile);
    const label=itemLabel(fixtureItems[0]);
    await page.locator('#q').fill(label.slice(0,Math.max(3,Math.min(label.length,8))));
    if(await page.locator('#out .card').count()<1) throw new Error('Item search returned no cards');
    if(mobile) await page.locator('#appBack').tap(); else await page.locator('#appBack').click();

    const firstGoal=page.locator('#goals input[type="checkbox"]').first();
    await firstGoal.evaluate(el=>{
      el.checked=true;
      el.dispatchEvent(new Event('change',{bubbles:true}));
    });
    const activeGoals=await page.evaluate(()=>JSON.parse(localStorage.getItem('arcActiveGoals')||'{}'));
    if(!Object.keys(activeGoals).length) throw new Error('Goal activation was not persisted');

    const summaryText=(await page.locator('#summary').textContent()||'').trim();
    if(!summaryText) throw new Error('Requirements summary is empty after activating a goal');

    await openLauncherTarget(page,'questDrawer',mobile);
    const questDrawerState=await page.locator('#questDrawer').evaluate(el=>({open:el.open,active:el.classList.contains('launcher-active')}));
    if(!questDrawerState.open||!questDrawerState.active) throw new Error('Quest launcher navigation did not open the quest view');
    await page.locator('.quest-card').first().waitFor({state:'attached'});
    await page.locator('.quest-card [data-state="active"]').first().evaluate(el=>el.click());
    const questStates=await page.evaluate(()=>JSON.parse(localStorage.getItem('arcQuestStatus')||'{}'));
    if(questStates.quality_gate_quest!=='active') throw new Error('Quest activation was not persisted');

    if(mobile){
      await page.reload({waitUntil:'domcontentloaded'});
      await waitForState(page,expectedState);
      const persisted=await page.evaluate(()=>({
        goals:Object.keys(JSON.parse(localStorage.getItem('arcActiveGoals')||'{}')).length,
        quest:JSON.parse(localStorage.getItem('arcQuestStatus')||'{}').quality_gate_quest
      }));
      if(!persisted.goals||persisted.quest!=='active') throw new Error('Android reload lost locally persisted progress');
    }
  }

  if(pageErrors.length) throw new Error(`${name}: uncaught browser error(s): ${pageErrors.join(' | ')}`);
  const source=await page.evaluate(()=>window.__arcCatalogMeta?.source||'unknown');
  console.log(`PASS ${name}: ${expectedState} via ${source}`);
  await context.close();
}

const browser=await chromium.launch({headless:true});
try{
  await runScenario(browser,{name:'Mahcks live + core interactions',mode:'live',expectedState:'live',interactive:true});
  await runScenario(browser,{name:'Invalid Mahcks page falls back to validated snapshot',mode:'invalid-live',expectedState:'live'});
  await runScenario(browser,{name:'Mahcks down, validated Ramas snapshot',mode:'snapshot',expectedState:'live'});
  await runScenario(browser,{name:'Mahcks and snapshot down, complete RaidTheory fallback',mode:'github',expectedState:'live'});
  await runScenario(browser,{name:'Mahcks and snapshot down, partial RaidTheory fallback',mode:'partial',expectedState:'partial'});
  await runScenario(browser,{name:'All external item sources down',mode:'fallback',expectedState:'fallback'});
  await runScenario(browser,{name:'Android touch viewport + snapshot + persistence',mode:'snapshot',expectedState:'live',interactive:true,mobile:true});
  console.log('All browser and Android/mobile quality-gate scenarios passed.');
}finally{
  await browser.close();
}
