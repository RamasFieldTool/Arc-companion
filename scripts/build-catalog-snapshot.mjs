import { readFile,writeFile } from 'node:fs/promises';

const outPath=process.argv[2]||'items-full-snapshot.json';
const INDEX='https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main';
const MANUAL_ITEMS_PATH=new URL('../catalog-data/souls-offering-items-2-3-0.json',import.meta.url);
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
const manualData=JSON.parse(await readFile(MANUAL_ITEMS_PATH,'utf8'));
if(manualData?.schema!=='rft-manual-item-supplement'||manualData?.formatVersion!==1||!Array.isArray(manualData.items))throw new Error('Invalid manual item supplement');
const manualIds=new Set();
for(const item of manualData.items){
  if(!item?.id||typeof item.id!=='string'||manualIds.has(item.id))throw new Error('Manual item supplement has an invalid or duplicate id');
  manualIds.add(item.id);
  const current=byId.get(item.id);
  if(!current){byId.set(item.id,item);continue}
  const merged={...item,...current};
  if(item.name&&current.name)merged.name={...item.name,...current.name};
  if(!current.imageFilename&&item.imageFilename)merged.imageFilename=item.imageFilename;
  if(!current.description&&item.description)merged.description=item.description;
  if(!current.rftEvidence&&item.rftEvidence)merged.rftEvidence=item.rftEvidence;
  if(!current.rftImageEvidence&&item.rftImageEvidence)merged.rftImageEvidence=item.rftImageEvidence;
  byId.set(item.id,merged);
}
const items=[...byId.values()].sort((a,b)=>a.id.localeCompare(b.id));

let previous=null;
try{previous=JSON.parse(await readFile(outPath,'utf8'))}catch{}
const previousItems=Array.isArray(previous?.items)?previous.items:null;
const supplementalSources=[{file:'catalog-data/souls-offering-items-2-3-0.json',checkedAt:manualData.checkedAt,gameVersion:manualData.gameVersion,source:manualData.source,itemIds:manualData.items.map(item=>item.id)}];
if(previousItems&&JSON.stringify(previousItems)===JSON.stringify(items)&&JSON.stringify(previous?.supplementalSources||[])===JSON.stringify(supplementalSources)){
  console.log(`Snapshot unchanged: ${items.length} items.`);
  process.exit(0);
}

const snapshot={
  schema:'ramas-field-tool-item-snapshot',
  formatVersion:1,
  generatedAt:new Date().toISOString(),
  source:'RaidTheory/arcraiders-data',
  sourceRef:'main',
  supplementalSources,
  count:items.length,
  items
};
await writeFile(outPath,JSON.stringify(snapshot,null,2)+'\n','utf8');
console.log(`Snapshot written: ${items.length} items -> ${outPath}`);
