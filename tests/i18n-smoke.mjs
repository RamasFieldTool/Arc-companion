import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,20);
if(!items.length)throw new Error('i18n smoke test needs local item fixtures');

const quest={id:'i18n_quest',name:{de:'Sprachtest',en:'Language test'},trader:'Test',objectives:[{de:'Testziel',en:'Test objective'}],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/i18n_quest.json';

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url());
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=items.slice(offset,offset+limit);
    const body={type:'items',total:items.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<items.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'i18n_quest.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}

async function waitForLanguage(page,language){
  await page.waitForFunction(expected=>document.documentElement.dataset.uiLanguage===expected,language,{timeout:30000});
}
async function waitForText(page,selector,text){
  await page.waitForFunction(({selector,text})=>document.querySelector(selector)?.textContent?.trim()===text,{selector,text},{timeout:30000});
}
async function waitForPrefix(page,selector,prefix){
  await page.waitForFunction(({selector,prefix})=>document.querySelector(selector)?.textContent?.trim().startsWith(prefix),{selector,prefix},{timeout:30000});
}
async function assertLauncherStable(page,label){
  const mutations=await page.evaluate(()=>new Promise(resolve=>{
    const target=document.getElementById('appLauncher');
    if(!target){resolve(999);return;}
    let count=0;
    const observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='characterData')count++;
        if(record.type==='childList')count+=record.addedNodes.length+record.removedNodes.length;
      }
    });
    observer.observe(target,{subtree:true,childList:true,characterData:true});
    setTimeout(()=>{observer.disconnect();resolve(count)},700);
  }));
  if(mutations>2)throw new Error(`${label}: launcher is still re-rendering/flickering (${mutations} DOM mutations in 700ms)`);
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:412,height:915},screen:{width:412,height:915},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await installRoutes(page);

  await page.goto(`${BASE_URL}?firstlang=1`,{waitUntil:'load'});
  await page.locator('#arcLanguageFirstRun').waitFor({state:'visible'});
  await waitForLanguage(page,'en');
  await waitForText(page,'#launcherHeading','Ready for your next raid?');
  if(await page.locator('#arcLanguageFirstRun [data-first-language]').count()!==4)throw new Error('First-run chooser must offer EN, DE, FR and ES');
  if(!(await page.locator('#arcLanguageButton').innerText()).includes('EN'))throw new Error('Permanent language button must show EN on first launch');

  await page.locator('[data-first-language="fr"]').tap();
  await page.locator('#arcLanguageFirstRun').waitFor({state:'detached'});
  await waitForLanguage(page,'fr');
  await waitForText(page,'#launcherHeading','Prêt pour votre prochain raid ?');
  await waitForPrefix(page,'#dataStatusPersistent','DONNÉES');
  const frenchState=await page.evaluate(()=>({ui:localStorage.getItem('arcUiLanguage'),engine:localStorage.getItem('arcLang'),html:document.documentElement.lang}));
  if(frenchState.ui!=='fr'||frenchState.engine!=='en'||frenchState.html!=='fr')throw new Error(`French language state invalid: ${JSON.stringify(frenchState)}`);
  await assertLauncherStable(page,'French UI');
  await page.locator('[data-app-target="itemsSection"]').tap();
  await waitForText(page,'#itemsDrawerTitle','RECHERCHE D’OBJETS');
  await page.locator('#appBack').tap();

  await page.locator('#arcLanguageButton').tap();
  await page.locator('#arcLanguageMenu [data-arc-language="es"]').tap();
  await waitForLanguage(page,'es');
  await waitForText(page,'#launcherHeading','¿Listo para tu próxima incursión?');
  await waitForPrefix(page,'#dataStatusPersistent','DATOS');
  const spanishStored=await page.evaluate(()=>localStorage.getItem('arcUiLanguage'));
  if(spanishStored!=='es')throw new Error('Spanish UI language was not persisted');
  await assertLauncherStable(page,'Spanish UI');

  await page.goto(BASE_URL,{waitUntil:'load'});
  await waitForLanguage(page,'es');
  await waitForText(page,'#launcherHeading','¿Listo para tu próxima incursión?');
  if(await page.locator('#arcLanguageFirstRun').count())throw new Error('First-run chooser must not reappear after a language has been chosen');
  if(!(await page.locator('#arcLanguageButton').innerText()).includes('ES'))throw new Error('Permanent language button did not retain ES');
  await assertLauncherStable(page,'Spanish UI after reload');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`Language UI causes horizontal mobile overflow (${overflow}px)`);

  console.log('PASS English-first onboarding, French UI, Spanish UI, persistence and flicker stability.');
  await context.close();
}finally{
  await browser.close();
}
