const checks=[];

async function json(url,label,validate){
  const started=Date.now();
  try{
    const response=await fetch(url,{headers:{'User-Agent':'RamasFieldTool-health-check'},signal:AbortSignal.timeout(12000)});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    const details=validate(data);
    const ms=Date.now()-started;
    console.log(`PASS ${label} (${ms} ms)${details?` - ${details}`:''}`);
    checks.push({label,ok:true,ms});
  }catch(error){
    const ms=Date.now()-started;
    console.error(`FAIL ${label} (${ms} ms): ${error.message}`);
    checks.push({label,ok:false,ms,error:String(error.message)});
  }
}

await json('https://arcdata.mahcks.com/v1/items?full=true&offset=0&limit=1','Mahcks items API',data=>{
  if(!Array.isArray(data?.items)||data.items.length<1) throw new Error('missing items array');
  return `total=${data.total??data.count??'unknown'}`;
});
await json('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main','RaidTheory item index',data=>{
  if(!Array.isArray(data)||data.length<100) throw new Error(`suspicious item index size ${Array.isArray(data)?data.length:'invalid'}`);
  return `${data.length} files`;
});
await json('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main','RaidTheory quest index',data=>{
  if(!Array.isArray(data)||data.length<1) throw new Error('empty quest index');
  return `${data.length} files`;
});
await json('https://arcraiders.com/external-api/map-conditions','Official live-event feed',data=>{
  if(!Array.isArray(data?.conditions)||data.conditions.length<1) throw new Error('missing conditions');
  return `${data.conditions.length} conditions`;
});

const failed=checks.filter(check=>!check.ok);
if(failed.length){
  console.error(`${failed.length}/${checks.length} external data checks failed.`);
  process.exit(1);
}
console.log(`All ${checks.length} external data sources healthy.`);
