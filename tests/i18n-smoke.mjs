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

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:412,height:915},screen:{width:412,height:915},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await installRoutes(page);

  await page.goto(`${BASE_URL}?firstlang=1`,{waitUntil:'load'});
  await page.locator('#arcLanguageFirstRun').waitFor({state:'visible'});
  await waitForLanguage(page,'en');
  if((await page.locator('#launcherHeading').innerText()).trim()!=='Ready for your next raid?')throw new Error('First launch must show English before a language is chosen');
  if(await page.locator('#arcLanguageFirstRun [data-first-language]').count()!==4)throw new Error('First-run chooser must offer EN, DE, FR and ES');
  if(!(await page.locator('#arcLanguageButton').innerText()).includes('EN'))throw new Error('Permanent language button must show EN on first launch');

  await page.locator('[data-first-language="fr"]').tap();
  await page.locator('#arcLanguageFirstRun').waitFor({state:'detached'});
  await waitForLanguage(page,'fr');
  const frenchState=await page.evaluate(()=>({ui:localStorage.getItem('arcUiLanguage'),engine:localStorage.getItem('arcLang'),html:document.documentElement.lang}));
  if(frenchState.ui!=='fr'||frenchState.engine!=='en'||frenchState.html!=='fr')throw new Error(`French language state invalid: ${JSON.stringify(frenchState)}`);
  if((await page.locator('#launcherHeading').innerText()).trim()!=='Prêt pour votre prochain raid ?')throw new Error('French launcher heading was not applied');
  if(!(await page.locator('#dataStatusPersistent').innerText()).startsWith('DONNÉES'))throw new Error('French data status was not applied');
  await page.locator('[data-app-target="itemsSection"]').tap();
  if((await page.locator('#itemsDrawerTitle').innerText()).trim()!=='RECHERCHE D’OBJETS')throw new Error('French item-search title was not applied');
  await page.locator('#appBack').tap();

  await page.locator('#arcLanguageButton').tap();
  await page.locator('#arcLanguageMenu [data-arc-language="es"]').tap();
  await waitForLanguage(page,'es');
  if((await page.locator('#launcherHeading').innerText()).trim()!=='¿Listo para tu próxima incursión?')throw new Error('Spanish launcher heading was not applied');
  if(!(await page.locator('#dataStatusPersistent').innerText()).startsWith('DATOS'))throw new Error('Spanish data status was not applied');
  const spanishStored=await page.evaluate(()=>localStorage.getItem('arcUiLanguage'));
  if(spanishStored!=='es')throw new Error('Spanish UI language was not persisted');

  await page.goto(BASE_URL,{waitUntil:'load'});
  await waitForLanguage(page,'es');
  if(await page.locator('#arcLanguageFirstRun').count())throw new Error('First-run chooser must not reappear after a language has been chosen');
  if((await page.locator('#launcherHeading').innerText()).trim()!=='¿Listo para tu próxima incursión?')throw new Error('Spanish selection did not survive reload');
  if(!(await page.locator('#arcLanguageButton').innerText()).includes('ES'))throw new Error('Permanent language button did not retain ES');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`Language UI causes horizontal mobile overflow (${overflow}px)`);

  console.log('PASS English-first onboarding, French UI, Spanish UI and persistence.');
  await context.close();
}finally{
  await browser.close();
}
