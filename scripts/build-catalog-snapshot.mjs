import { readFile,writeFile } from 'node:fs/promises';

const outPath=process.argv[2]||'items-full-snapshot.json';
const INDEX='https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main';
const BATCH=12;
const TIMEOUT=15000;

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function getJson(url,label,attempts=3){
  let last;
  for(let attempt=1;attempt<=attempts;attempt++){
    try{
      const response=await fetch(url,{headers:{'User-Agent':'RamasFieldTool-catalog-snapshot'},signal:AbortSignal.timeout(TIMEOUT)});
      if(!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
      return await response.json();
    }catch(error){
      last=error;
      if(attempt<attempts) await sleep(500*attempt);
    }
  }
  throw last;
}

const index=await getJson(INDEX,'RaidTheory item index');
const files=(Array.isArray(index)?index:[])
  .filter(file=>file?.type==='file'&&file?.name?.endsWith('.json')&&!file.name.startsWith('_')&&file?.download_url)
  .sort((a,b)=>a.name.localeCompare(b.name));
if(files.length<100) throw new Error(`Suspiciously small RaidTheory item index: ${files.length}`);

const loaded=[];
for(let i=0;i<files.length;i+=BATCH){
  const batch=files.slice(i,i+BATCH);
  const results=await Promise.all(batch.map(async file=>{
    const item=await getJson(file.download_url,`Item ${file.name}`);
    if(!item?.id||typeof item.id!=='string') throw new Error(`Item ${file.name}: missing id`);
    return item;
  }));
  loaded.push(...results);
  process.stdout.write(`Loaded ${Math.min(i+BATCH,files.length)}/${files.length}\r`);
}
process.stdout.write('\n');

const byId=new Map();
for(const item of loaded){
  if(byId.has(item.id)) throw new Error(`Duplicate item id from RaidTheory: ${item.id}`);
  byId.set(item.id,item);
}
if(byId.size!==files.length) throw new Error(`Catalog incomplete: ${byId.size}/${files.length}`);
const items=[...byId.values()].sort((a,b)=>a.id.localeCompare(b.id));

let previous=null;
try{previous=JSON.parse(await readFile(outPath,'utf8'))}catch{}
const previousItems=Array.isArray(previous?.items)?previous.items:null;
if(previousItems&&JSON.stringify(previousItems)===JSON.stringify(items)){
  console.log(`Snapshot unchanged: ${items.length} items.`);
  process.exit(0);
}

const snapshot={
  schema:'ramas-field-tool-item-snapshot',
  formatVersion:1,
  generatedAt:new Date().toISOString(),
  source:'RaidTheory/arcraiders-data',
  sourceRef:'main',
  count:items.length,
  items
};
await writeFile(outPath,JSON.stringify(snapshot,null,2)+'\n','utf8');
console.log(`Snapshot written: ${items.length} items -> ${outPath}`);
