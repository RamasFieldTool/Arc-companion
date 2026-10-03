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
    else await firstRun.locator('button').first().tap();
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
  if(await text('#planningRaidFinished')!=='Raid terminato')throw new Error('Italian Raid finished action missing');
  await page.locator('#planningTabGoals').tap();
  const labels=await page.locator('.planning-personal-add label').allInnerTexts();
  if(!labels.some(v=>v.trim().startsWith('Oggetto')))throw new Error(`Italian item label untranslated: ${JSON.stringify(labels)}`);
  if(!labels.some(v=>v.trim().startsWith('Quantità obiettivo')))throw new Error(`Italian target quantity untranslated: ${JSON.stringify(labels)}`);

  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.uiLanguage==='it',{timeout:30000});
  const persistedLanguage=await page.evaluate(()=>localStorage.getItem('arcUiLanguage'));
  if(persistedLanguage!=='it')throw new Error(`Italian language did not persist after reload: ${persistedLanguage}`);
  if(await text('#detailTitle')!=='La mia pianificazione')throw new Error('Italian planning view did not survive reload');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`Italian mobile UI causes horizontal overflow (${overflow}px)`);

  await page.locator('#planningTabMissing').tap();
  if(await text('#planningRaidFinished')!=='Raid terminato')throw new Error('Italian Raid finished action changed after reload');

  // Catch competing overlays after asynchronous status/catalog renders, then leave IT.
  await page.waitForTimeout(600);
  if(await text('#launcherHeading')!=='Pronto per il prossimo raid?')throw new Error('Italian heading overwritten after render');
  for(const [language,heading] of [['en','Ready for your next raid?'],['fr','Prêt pour votre prochain raid ?'],['es','¿Listo para tu próxima incursión?'],['de','Bereit für den nächsten Raid?']]){
    await page.locator('#arcLanguageButton').tap();
    await page.locator(`#arcLanguageMenu [data-arc-language="${language}"]`).tap();
    await page.waitForFunction(code=>document.documentElement.dataset.uiLanguage===code,language);
    await page.waitForTimeout(350);
    if(await text('#launcherHeading')!==heading)throw new Error(`Italian overlay survived switch to ${language}: ${await text('#launcherHeading')}`);
  }

  console.log('PASS Italian selector, planning, persistence, mobile overflow and raid action.');
  await context.close();
}finally{await browser.close();}
