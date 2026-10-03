import { chromium } from 'playwright';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:360,height:800},screen:{width:360,height:800},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto(BASE_URL,{waitUntil:'load'});

  const firstRun=page.locator('#arcLanguageFirstRun');
  if(await firstRun.isVisible().catch(()=>false)){
    const german=firstRun.locator('[data-arc-language="de"]');
    if(await german.count()) await german.tap();
    else {
      const firstChoice=firstRun.locator('button').first();
      await firstChoice.tap();
    }
    await firstRun.waitFor({state:'hidden',timeout:30000});
  }

  await page.locator('#arcLanguageButton').waitFor({state:'visible',timeout:30000});
  await page.locator('#arcLanguageButton').tap();
  const italian=page.locator('#arcLanguageMenu [data-arc-language="it"]');
  await italian.waitFor({state:'visible',timeout:30000});
  await italian.tap();
  await page.waitForFunction(()=>document.documentElement.dataset.uiLanguage==='it',{timeout:30000});
  await page.waitForFunction(()=>localStorage.getItem('arcUiLanguage')==='it',{timeout:30000});

  const text=async selector=>(await page.locator(selector).innerText()).trim();
  if(await text('#launcherHeading')!=='Pronto per il prossimo raid?')throw new Error('Italian launcher heading missing');
  if(!(await text('#arcLanguageButton')).includes('IT'))throw new Error('Italian language button state missing');
  if(await text('[data-app-target="planningSection"] b')!=='La mia pianificazione')throw new Error('Italian planning tile missing');

  await page.locator('[data-app-target="planningSection"]').tap();
  await page.waitForFunction(()=>document.querySelector('#detailTitle')?.textContent?.trim()==='La mia pianificazione');
  if(await text('#planningTabMissing')!=='Cosa mi manca?')throw new Error('Italian missing-items tab untranslated');
  if(await text('#planningTabGoals')!=='I miei obiettivi')throw new Error('Italian goals tab untranslated');
  await page.locator('#planningTabGoals').tap();
  const labels=await page.locator('.planning-personal-add label').allInnerTexts();
  if(!labels.some(v=>v.trim().startsWith('Oggetto')))throw new Error(`Italian item label untranslated: ${JSON.stringify(labels)}`);
  if(!labels.some(v=>v.trim().startsWith('Quantità obiettivo')))throw new Error(`Italian target quantity untranslated: ${JSON.stringify(labels)}`);

  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.uiLanguage==='it',{timeout:30000});
  if(localStorage.getItem('arcUiLanguage')!=='it')throw new Error('Italian language did not persist after reload');
  if(await text('#detailTitle')!=='La mia pianificazione')throw new Error('Italian planning view did not survive reload');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`Italian mobile UI causes horizontal overflow (${overflow}px)`);

  await page.locator('#appBack').tap();
  await page.locator('[data-app-target="nextRaidDrawer"]').tap();
  await page.waitForTimeout(200);
  const raidText=await page.locator('#nextRaidDrawer').innerText();
  if(!raidText.includes('RAID TERMINATO'))throw new Error('Italian Raid finished action missing');

  console.log('PASS Italian selector, planning, persistence, mobile overflow and raid action.');
  await context.close();
}finally{await browser.close();}
