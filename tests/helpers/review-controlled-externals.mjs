// Review-only preload: substitutes inaccessible external dependencies; never a live-source verification.
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
const root=new URL('../../',import.meta.url);
const events=JSON.parse(await readFile(new URL('live-events.json',root),'utf8'));
const bots=JSON.parse(await readFile(new URL('tests/fixtures/item-find-locations.json',root),'utf8')).bots;
const launch=chromium.launch.bind(chromium);
chromium.launch=async(...args)=>{const browser=await launch(...args);const create=browser.newContext.bind(browser);browser.newContext=async(...args)=>{const context=await create(...args);
await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
await context.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/live-events-data/live-events.json',r=>r.fulfill({json:events}));
await context.route('https://raw.githubusercontent.com/RaidTheory/arcraiders-data/*/bots.json',r=>r.fulfill({json:bots}));
context.on('page',page=>page.on('requestfailed',request=>console.log('NETWORK_FAILURE',request.url(),request.failure()?.errorText)));return context};return browser};
