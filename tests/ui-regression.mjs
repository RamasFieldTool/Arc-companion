import { chromium } from 'playwright';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const OUTPUT=new URL('../test-artifacts/ui/',import.meta.url);
const shot=name=>fileURLToPath(new URL(name,OUTPUT));
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
async function waitReady(page){await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',null,{timeout:30000});await page.waitForFunction(()=>!!window.RFTPlanning&&document.querySelector('[data-app-target="planningSection"]')&&getComputedStyle(document.querySelector('[data-app-target="nextRaidDrawer"]')).display==='none');}
async function metrics(page){return page.evaluate(()=>{
  const rect=el=>{const r=el?.getBoundingClientRect();return r?{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}:null};
  const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
  return {viewport:{width:innerWidth,height:innerHeight},document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth},masthead:rect(document.querySelector('.masthead')),launcher:rect(document.querySelector('#appLauncher')),tiles:[...document.querySelectorAll('#appLauncher .app-tile')].filter(visible).map(el=>({target:el.dataset.appTarget,...rect(el)})),version:document.querySelector('#dataStatusDock [data-app-version]')?.textContent?.trim()||''};
});}
function assertHome(m,label){
  const overflow=m.document.scrollWidth-m.document.clientWidth;if(overflow>4)throw new Error(`${label}: horizontal overflow ${overflow}px`);
  if(!m.masthead||m.masthead.width<100||m.masthead.height<40)throw new Error(`${label}: masthead collapsed`);
  if(!m.launcher||m.launcher.width<100)throw new Error(`${label}: launcher collapsed`);
  const expected=['planningSection','liveEventsDrawer','itemsSection','blueprintDrawer','spawnPanel','raiderRadio'];
  const actual=m.tiles.map(tile=>tile.target);
  if(actual.length!==expected.length||expected.some(target=>!actual.includes(target)))throw new Error(`${label}: unexpected visible launcher targets: ${actual.join(', ')}`);
  for(const tile of m.tiles){if(tile.width<44||tile.height<44)throw new Error(`${label}: touch target ${tile.target} is ${tile.width}x${tile.height}`);if(tile.x<-4||tile.x+tile.width>m.viewport.width+4)throw new Error(`${label}: tile ${tile.target} exceeds viewport`);}
  if(m.version!=='V13.0.21')throw new Error(`${label}: expected V13.0.21, got ${m.version}`);
}
async function openTarget(page,target){
  if(!(await page.locator('#appLauncher').isVisible())){await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});}
  await page.locator(`[data-app-target="${target}"]`).click();const section=page.locator(`#${target}`);await section.waitFor({state:'visible'});
  const state=await section.evaluate(el=>{const r=el.getBoundingClientRect();return {active:el.classList.contains('launcher-active'),open:el.tagName==='DETAILS'?el.open:true,width:r.width,right:r.right,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
  if(!state.active||!state.open)throw new Error(`${target}: target was not activated/opened`);
  const width=await page.evaluate(()=>innerWidth);if(state.width<100||state.right>width+4||state.overflow>4)throw new Error(`${target}: opened view exceeds viewport`);
}

await mkdir(OUTPUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const configs=[
  {name:'android-small',width:360,height:800,isMobile:true,hasTouch:true,views:['itemsSection']},
  {name:'android-standard',width:412,height:915,isMobile:true,hasTouch:true,views:['backupPanel','planningSection']},
  {name:'desktop',width:1280,height:900,isMobile:false,hasTouch:false,views:['planningSection','itemsSection']}
];
const report=[];
try{
  for(const cfg of configs){
    const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},screen:{width:cfg.width,height:cfg.height},isMobile:cfg.isMobile,hasTouch:cfg.hasTouch,userAgent:cfg.isMobile?'Mozilla/5.0 (Linux; Android 16; RamasFieldToolVisualTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36':undefined});
    await context.addInitScript(()=>{
      localStorage.setItem('arcLang','en');
      localStorage.setItem('arcUiLanguage','en');
      localStorage.setItem('arcLanguageOnboardingPending','0');
    });
    const page=await context.newPage(),pageErrors=[],consoleErrors=[];
    page.on('pageerror',e=>pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
    await installRoutes(page);await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});await waitReady(page);
    const home=await metrics(page);assertHome(home,cfg.name);await page.screenshot({path:shot(`${cfg.name}-home.png`),fullPage:true});
    const opened=[];
    for(const target of cfg.views){await openTarget(page,target);await page.screenshot({path:shot(`${cfg.name}-${target}.png`),fullPage:true});opened.push(target);await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});}
    await openTarget(page,'planningSection');
    const longItem=fixtureItems.slice().sort((a,b)=>String(b.name?.en||b.en||b.id).length-String(a.name?.en||a.en||a.id).length)[0];
    for(const theme of ['dark','light']){
      await page.evaluate(theme=>{localStorage.setItem('arcTheme',theme);localStorage.setItem('arcPaletteSurface',theme)},theme);
      await page.reload({waitUntil:'domcontentloaded'});await waitReady(page);
      await page.locator('#planningTabGoals').click();
      if(await page.locator('#goalsSection').isVisible()||await page.locator('#questDrawer').isVisible())throw new Error('Goal categories are stacked');
      await page.locator('[data-goal-category=workshop]').click();await page.locator('#goalsSection').waitFor({state:'visible'});if(await page.locator('#questDrawer').isVisible())throw new Error('Quests visible in workshop');
      const station=page.locator('#goals .goal-station').first();if(!(await station.evaluate(el=>el.open)))await station.locator('summary').click();
      await page.locator('#goalsSection input[type=checkbox]').first().check();
      await page.locator('[data-goal-category=quests]').click();await page.locator('#questDrawer').waitFor({state:'visible'});if(await page.locator('#goalsSection').isVisible())throw new Error('Workshop visible in quests');
      await page.locator('.quest-filter[data-filter=all]').click();await page.locator('.quest-state [data-state=open]').first().click();
      await page.locator('.quest-filter[data-filter=open]').click();
      const selected=page.locator('.quest-state button.selected').first();await selected.waitFor({state:'visible'});
      const contrast=await selected.evaluate(el=>({color:getComputedStyle(el).color,fill:getComputedStyle(el).webkitTextFillColor,bg:getComputedStyle(el).backgroundColor}));
      if(contrast.color!=='rgb(17, 17, 17)'||contrast.fill!=='rgb(17, 17, 17)'||contrast.bg!=='rgb(255, 179, 92)')throw new Error(`Unreadable quest selected state: ${JSON.stringify(contrast)}`);
      await page.screenshot({path:shot(`${cfg.name}-planning-${theme}-quests.png`),fullPage:true});
      await page.locator('.quest-state [data-state=active]').first().click();
      await page.locator('[data-goal-category=personal]').click();
      await page.locator('#planningPersonalItem').selectOption(longItem.id);await page.locator('#planningPersonalAmount').fill('15');await page.locator('#planningPersonalAdd').click();
      if(await page.locator('#planningMissing').isVisible())throw new Error(`${cfg.name}: missing list remains visible on Goals tab`);
      await page.screenshot({path:shot(`${cfg.name}-planning-${theme}-goals.png`),fullPage:true});
      const layout=await page.evaluate(()=>{
        const panel=document.getElementById('planningSection');
        const controls=[...panel.querySelectorAll('button,input,select')].filter(el=>el.getBoundingClientRect().width>0);
        return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,buttons:controls.filter(el=>el.tagName==='BUTTON').map(el=>({text:el.textContent,color:getComputedStyle(el).color,fill:getComputedStyle(el).webkitTextFillColor,background:getComputedStyle(el).backgroundColor})),outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<0||r.right>innerWidth+1}).map(el=>el.id||el.tagName),floating:!![...document.querySelectorAll('.floating-list-close')].find(el=>el.getBoundingClientRect().width>0)};
      });
      if(layout.overflow>1||layout.outside.length||layout.floating)throw new Error(`${cfg.name} ${theme}: planning layout failure ${JSON.stringify(layout)}`);
      if(theme==='dark'&&layout.buttons.some(b=>(b.color==='rgb(0, 0, 0)'||b.fill==='rgb(0, 0, 0)')&&b.background!=='rgb(255, 179, 92)'))throw new Error(`${cfg.name}: black button text in dark planning`);
      await page.locator('#planningTabMissing').click();if(await page.locator('#goalsSection').isVisible()||await page.locator('#questDrawer').isVisible())throw new Error(`${cfg.name}: integrated goal sources remain visible on Missing tab`);if(await page.locator('#planningGoals').isVisible())throw new Error(`${cfg.name}: Goals remain visible on Missing tab`);
      await page.screenshot({path:shot(`${cfg.name}-planning-${theme}-missing.png`),fullPage:true});
      if(await page.locator('#planningShowAll,#planningRaidOnly,[data-raid-mark]').count())throw new Error('Discarded raid priority controls remain');
      const usage=page.locator(`[data-plan-item="${longItem.id}"] details`);
      await usage.locator('summary').click();await page.waitForTimeout(150);
      if(!(await usage.evaluate(el=>el.open)))throw new Error('Used for closes immediately after tapping');
      if(!(await usage.locator('div').innerText()).includes('15'))throw new Error('Used for does not show the goal requirement');
      await usage.locator('summary').click();await page.waitForTimeout(150);if(await usage.evaluate(el=>el.open))throw new Error('Used for cannot be collapsed');
      await page.locator('#planningRaidFinished').click();
      await page.screenshot({path:shot(`${cfg.name}-planning-${theme}-raid-finished.png`),fullPage:true});
      if(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)>1)throw new Error('Post-raid panel overflows mobile width');
      const findInput=page.locator(`[data-raid-find="${longItem.id}"]`);await findInput.fill('5');
      await page.locator('[data-raid-apply]').click();await page.waitForFunction(id=>window.RFTPlanning.rows({all:true}).find(r=>r.itemId===id)?.owned===5,longItem.id);
      await page.locator('#planningRaidFinished').click();await findInput.fill('9');await page.locator('[data-raid-cancel]').click();
      await page.locator('#planningRaidFinished').click();await page.locator('[data-raid-nothing]').click();
      if(await page.evaluate(id=>window.RFTPlanning.rows({all:true}).find(r=>r.itemId===id)?.owned,longItem.id)!==5)throw new Error('Cancel or no findings changed stock');
      await page.locator('#planningRaidFinished').click();await findInput.fill('20');await page.locator('[data-raid-apply]').click();
      await page.waitForFunction(id=>window.RFTPlanning.rows({all:true}).find(r=>r.itemId===id)?.owned===25,longItem.id);
      if(await page.locator(`[data-plan-item="${longItem.id}"]`).count())throw new Error('Fully collected item remains in missing list');
      await page.evaluate(id=>saveOwned(id,0),longItem.id);await page.locator('#planningTabGoals').click();await page.locator('#planningTabMissing').click();
      console.log(`PASS post-raid partial finds, cancellation, no finds, surplus and missing-list update: ${cfg.name} ${theme}`);
      report.push({planning:cfg.name,theme,layout});
    }
    if(pageErrors.length)throw new Error(`${cfg.name}: uncaught browser errors: ${pageErrors.join(' | ')}`);if(consoleErrors.length)throw new Error(`${cfg.name}: console errors: ${consoleErrors.join(' | ')}`);
    report.push({config:cfg,home,opened});console.log(`PASS ${cfg.name}: responsive layout and ${cfg.views.length} opened view(s)`);await context.close();
  }
  await writeFile(new URL('layout-report.json',OUTPUT),JSON.stringify(report,null,2));console.log('All responsive UI regression checks passed; screenshots captured.');
}finally{await browser.close();}
