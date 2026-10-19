import {chromium,expect} from 'playwright/test';
import {readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:360,height:800},{width:1280,height:900}])for(const locale of ['de','en','fr','es','it']){
  const context=await browser.newContext({viewport});
  await context.addInitScript(locale=>{
   if(sessionStorage.getItem('workshop-seeded'))return;sessionStorage.setItem('workshop-seeded','1');
   localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcOwned','{"metal_parts":7}');localStorage.setItem('arcActiveGoals','{}');localStorage.setItem('arcPlanningPersonal','{"metal_parts":{"itemId":"metal_parts","target":3,"status":"active"}}');
  },locale);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await installItemCatalogRoute(page,items);
  const questURL='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/workshop_test.json';
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[{type:'file',name:'workshop_test.json',download_url:questURL}]}));
  await page.route(questURL,r=>r.fulfill({json:{id:'workshop_test',name:{de:'Werkstatt-Test',en:'Workshop test'},objectives:[],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]}}));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.RFTPlanningUI&&document.querySelector('.goal-station')).catch(async e=>{console.log('INIT',locale,await page.evaluate(()=>({status:document.querySelector('#dataStatusPersistent')?.outerHTML,errors:document.body.innerText.slice(-600)})),errors);throw e});
  const open=async()=>{await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="workshop"]').click();await page.locator('.goal-station[data-goal-id="weapon_bench"]>summary').click()};
  await page.locator('[data-app-target="planningSection"]').click();await open();
  const level=page.locator('input[data-key="weapon_bench:1"]');const material=level.locator('..').locator('.workshop-materials');
  await expect(level).not.toBeChecked();await expect(material).toBeVisible();await expect(material).toContainText('20');await expect(material).toContainText('30');
  await level.check();await expect(page.locator('.workshop-feedback')).toBeVisible();
  await page.locator('.goal-station[data-goal-id="refiner"]>summary').click();await page.locator('input[data-key="refiner:1"]').check();
  const result=await page.evaluate(()=>RFTPlanning.rows({all:true}).find(x=>x.itemId==='metal_parts'));if(result.required!==83||result.owned!==7||result.missing!==76)throw Error(JSON.stringify(result));
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.RFTPlanningUI);await open();await expect(level).toBeChecked();await level.uncheck();await expect(page.locator('.workshop-feedback')).toBeVisible();
  const after=await page.evaluate(()=>({row:RFTPlanning.rows({all:true}).find(x=>x.itemId==='metal_parts'),goals:RFTPlanning.personalGoals()}));if(after.row.required!==63||after.row.owned!==7||after.goals.metal_parts.target!==3)throw Error(JSON.stringify(after));
  if(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)>2)throw Error('Workshop overflow');
  await page.locator('#appBack').click();await page.locator('[data-app-target="launcherHelp"]').click();
  await expect(page.locator('#launcherHelp>summary')).toBeHidden();await expect(page.locator('.help-topic')).toHaveCount(8);
  await page.locator('.help-topic>summary').first().focus();await page.keyboard.press('Enter');await expect(page.locator('.help-topic').first()).toHaveAttribute('open','');await page.locator('.help-topic>summary').nth(1).click();await expect(page.locator('.help-topic').nth(1)).toHaveAttribute('open','');if(locale==='de'&&viewport.width===360)await page.screenshot({path:'/tmp/rft-help-final.png',fullPage:true});
  if(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)>2)throw Error('Help overflow');
  await page.locator('#appBack').click();await page.locator('[data-app-target="planningSection"]').click();await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="workshop"]').click();
  const palettes=[];
  for(const surface of ['light','black'])for(const accent of ['orange','amber','green','cyan']){
   const style=await page.evaluate(({surface,accent})=>{document.documentElement.dataset.surface=surface;document.documentElement.dataset.theme=surface==='light'?'light':'dark';document.documentElement.dataset.accent=accent;const node=document.querySelector('[data-goal-category="workshop"]'),c=getComputedStyle(node);return {primary:getComputedStyle(document.body).getPropertyValue('--orange').trim(),secondary:getComputedStyle(document.body).getPropertyValue('--amber').trim(),color:c.color,background:c.backgroundColor}}, {surface,accent});
   palettes.push(style.primary);if(style.primary===style.secondary)throw Error('No secondary distinction');
   const rgb=s=>s.match(/[\d.]+/g).map(Number).slice(0,3);const lum=s=>rgb(s).map(x=>s.startsWith('color(')?x:x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);const a=lum(style.color),b=lum(style.background);const contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(contrast<4.5)throw Error('Selected contrast '+JSON.stringify({surface,accent,style,contrast}));
   await page.keyboard.press('Tab');await page.locator('[data-goal-category="workshop"]').focus();const outline=await page.locator('[data-goal-category="workshop"]').evaluate(x=>getComputedStyle(x).outlineWidth);if(outline==='0px')throw Error('Missing keyboard focus');
   const clipped=await page.locator('.goal-station-name').evaluateAll(ns=>ns.filter(n=>n.scrollWidth>n.clientWidth+2).map(n=>n.textContent));if(clipped.length)throw Error('Clipped title '+clipped);
   if(locale==='de'&&viewport.width===360){await page.screenshot({path:'/tmp/rft-'+surface+'-'+accent+'.png',fullPage:true})}
  }
  if(new Set(palettes).size!==8)throw Error('Palette collision '+palettes);
  if(errors.length)throw Error(errors.join(' | '));console.log(`PASS workshop visible before selection, shared stock, personal goal, feedback and reload ${viewport.width}/${locale}`);await context.close();
 }
}finally{await browser.close()}
