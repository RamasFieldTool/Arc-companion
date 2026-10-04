// Shared controlled Mahcks response used by browser regressions.
export async function installItemCatalogRoute(page,items,mode='live') {
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    if(mode==='live') {
      const url=new URL(route.request().url());
      const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
      const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
      const pageItems=items.slice(offset,offset+limit);
      const body={type:'items',total:items.length,count:pageItems.length,offset,limit,items:pageItems};
      if(offset+limit<items.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
    } else if(mode==='invalid-live') {
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'items',total:999,count:1,offset:0,limit:45,items:[items[0]]})});
    } else {
      await route.fulfill({status:503,contentType:'application/json',body:'{"error":"simulated Mahcks outage"}'});
    }
  });
}
