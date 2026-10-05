import {chromium,expect} from 'playwright/test';
import {readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
items.find(x=>x.id==='wires').recyclesInto={metal_parts:2};
const copies={de:['Direkte Treffer','Durch Recycling erhältlich','Ergibt','lokaler Ersatzstand'],en:['Direct matches','Available through recycling','Yields','local fallback'],fr:['Résultats directs','Disponible par recyclage','Produit','données locales de secours'],es:['Resultados directos','Disponible mediante reciclaje','Produce','datos locales de respaldo'],it:['Risultati diretti','Disponibile tramite riciclo','Produce','dati locali di riserva']};
const hints={de:'Diese Items enthalten den gesuchten Gegenstand beim Zerlegen.',en:'These items yield the searched item when recycled.',fr:'Ces objets fournissent l’objet recherché lorsqu’ils sont recyclés.',es:'Estos objetos proporcionan el objeto buscado al reciclarlos.',it:'Questi oggetti forniscono l’oggetto cercato quando vengono riciclati.'};
const browser=await chromium.launch({headless:true});
try{
for(const locale of Object.keys(copies))for(const fallback of [false,true]){
 const context=await browser.newContext({viewport:{width:360,height:800}});
 await context.addInitScript(locale=>{localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcLanguageOnboardingPending','0')},locale);
 const page=await context.newPage();await installItemCatalogRoute(page,items);
 await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[]}));
 const payload={syncedAt:new Date().toISOString(),conditions:[{type:'major',conditionName:'Night Raid',mapDisplayName:'Spaceport',regions:{europe:{start:new Date(Date.now()+60000).toISOString(),end:new Date(Date.now()+7200000).toISOString()}}}]};
 await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/live-events-data/live-events.json',r=>fallback?r.fulfill({status:503,body:'{}'}):r.fulfill({json:payload}));
 await page.route('**/live-events.json?*',r=>r.fulfill({json:payload}));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.RFTPlanningUI);
 await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#q').fill('metal');
 await expect(page.locator('.search-group-head>b').first()).toHaveText(copies[locale][0]);
 await expect(page.locator('.recycle-group .search-group-head b')).toHaveText(copies[locale][1]);
 await expect(page.locator('.recycle-group .search-group-head small')).toHaveText(hints[locale]);
 await expect(page.locator('.recycle-source-yield>span').first()).toHaveText(copies[locale][2]+':');
 await expect(page.locator('#liveEventsSourceText')).toContainText(fallback?copies[locale][3]:({de:'offizieller Embark',en:'official Embark',fr:'officiel d’Embark',es:'oficial de Embark',it:'ufficiale Embark'}[locale]));
 if(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)>2)throw Error('Search overflow');
 await page.locator('#appBack').click();await page.locator('#arcLanguageButton').click();
 const other=locale==='de'?'fr':'de';
 await page.locator(`#arcLanguageMenu [data-arc-language="${other}"]`).click();
 await page.locator('[data-app-target="itemsSection"]').click();await expect(page.locator('.search-group-head>b').first()).toHaveText(copies[other][0]);
 await page.locator('#appBack').click();
 await page.locator('#arcLanguageButton').click();await page.locator(`#arcLanguageMenu [data-arc-language="${locale}"]`).click();
 await page.locator('[data-app-target="itemsSection"]').click();await expect(page.locator('.search-group-head>b').first()).toHaveText(copies[locale][0]);
 console.log(`PASS search headings, yield, source and mobile overflow ${locale}/${fallback?'local':'remote'}`);await context.close();
}
}finally{await browser.close()}
