// Offline preparation tooling only: never writes application data or browser storage.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const locales=new Set(['de','en','fr','es','it']);
const languageKeys=new Set(['da','de','en','es','fr','he','hr','it','ja','ko-KR','no','pl','pt','pt-BR','ru','sr','tr','uk','zh-CN','zh-TW']);
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export const canonical=x=>JSON.stringify(sort(x));
function sort(x){if(Array.isArray(x))return x.map(sort);if(record(x))return Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])]));return x}
const digest=x=>createHash('sha256').update(x).digest('hex');
function project(x){if(Array.isArray(x))return x.map(project);if(!record(x))return x;const languageObject=Object.keys(x).some(k=>languageKeys.has(k))&&Object.keys(x).every(k=>languageKeys.has(k));return Object.fromEntries(Object.entries(x).filter(([k])=>k!=='description'&&(!languageObject||locales.has(k))).map(([k,v])=>[k,project(v)]))}
const git=(root,...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:30*1024*1024});
function index(rows,label){if(!Array.isArray(rows))throw Error(label+': expected array');const out=new Map();for(const row of rows){if(!record(row)||typeof row.id!=='string'||!row.id)throw Error(label+': missing string id');if(out.has(row.id))throw Error(label+': duplicate id '+row.id);out.set(row.id,row)}return out}
export function validate(bundle){if(!record(bundle)||bundle.schema!=='rft-data-review'||bundle.version!==1||!record(bundle.collections)||!record(bundle.documents))throw Error('Invalid review bundle schema');for(const name of ['rftItems','rftGoals','blueprints','acquisition','rftMaps','upstreamItems','upstreamQuests','upstreamHideout','upstreamProjects','upstreamMaps','upstreamSkills','snapshotItems']){if(!(name in bundle.collections))throw Error('Missing collection '+name)}for(const [name,rows] of Object.entries(bundle.collections))index(rows,name);if(!record(bundle.provenance)||!Object.keys(bundle.provenance).length)throw Error('Missing provenance');return bundle}
export function analyse(bundle){validate(bundle);const warnings=[];const catalog=new Set(bundle.collections.upstreamItems.map(i=>i.id));
 const warn=(group,id,path,message)=>warnings.push({group,id,path,message});
 const scan=(value,group,id,path='')=>{if(Array.isArray(value)){value.forEach((v,i)=>scan(v,group,id,path+'/'+i));return}if(!record(value))return;for(const [k,v] of Object.entries(value)){
  const p=path+'/'+k;
  if(k==='itemId'){if(typeof v!=='string'||!catalog.has(v))warn(group,id,p,'noncatalog item/currency reference: '+String(v))}
  if(['recipe','recyclesInto','salvagesInto','upgradeCost','repairCost','cost'].includes(k)&&record(v)&&!Object.hasOwn(v,'itemId')){for(const [material,qty] of Object.entries(v)){if(!catalog.has(material))warn(group,id,p+'/'+material,k==='cost'?'noncatalog payment reference':'unknown material ID');if(typeof qty!=='number'||!Number.isFinite(qty)||qty<0)warn(group,id,p+'/'+material,'invalid numeric quantity')}}
  if(k==='quantity'&&(typeof v!=='number'||!Number.isFinite(v)||v<0))warn(group,id,p,'invalid numeric quantity');
  if(['upgradesTo','upgradesFrom'].includes(k)&&typeof v==='string'&&!catalog.has(v))warn(group,id,p,'unknown upgrade item ID');
  scan(v,group,id,p);
 }};
 for(const [group,rows] of Object.entries(bundle.collections)){for(const row of rows){scan(row,group,row.id);if(['upstreamItems','snapshotItems'].includes(group)){for(const alternatives of [['name'],['value'],['weightKg','weight'],['stackSize','stack']])if(!alternatives.some(k=>row[k]!==undefined&&row[k]!==null))warn(group,row.id,'/'+alternatives[0],'missing/null data field');if(record(row.name))for(const lang of locales)if(typeof row.name[lang]!=='string'||!row.name[lang].trim())warn(group,row.id,'/name/'+lang,'missing language label')}}}
 scan(bundle.documents,'documents','root');return warnings;
}
export function compareBundles(before,after){validate(before);validate(after);const changes={};for(const group of new Set([...Object.keys(before.collections),...Object.keys(after.collections)])){
 const a=index(before.collections[group]||[],group),b=index(after.collections[group]||[],group),added=[],removed=[],changed=[];
 for(const [id,row] of b){if(!a.has(id)){added.push(id);continue}const old=a.get(id),fields=[];for(const field of new Set([...Object.keys(old),...Object.keys(row)])){const presentA=Object.hasOwn(old,field),presentB=Object.hasOwn(row,field);if(presentA!==presentB||canonical(old[field])!==canonical(row[field]))fields.push({field,before:presentA?{present:true,value:old[field]}:{present:false},after:presentB?{present:true,value:row[field]}:{present:false}})}if(fields.length)changed.push({id,fields})}
 for(const id of a.keys())if(!b.has(id))removed.push(id);changes[group]={added:added.sort(),removed:removed.sort(),changed:changed.sort((x,y)=>x.id.localeCompare(y.id))};
 }
 const documents=[];for(const name of new Set([...Object.keys(before.documents),...Object.keys(after.documents)]))if(canonical(before.documents[name])!==canonical(after.documents[name]))documents.push({name,before:Object.hasOwn(before.documents,name)?{present:true,value:before.documents[name]}:{present:false},after:Object.hasOwn(after.documents,name)?{present:true,value:after.documents[name]}:{present:false}});
 const oldWarnings=analyse(before),warnings=analyse(after),known=new Set(oldWarnings.map(canonical));return {schema:'rft-data-diff',version:1,before:before.provenance,after:after.provenance,changes,documents,warnings,newWarnings:warnings.filter(w=>!known.has(canonical(w))),removedItemIds:changes.upstreamItems.removed,notice:'Review only. Removals are not an instruction to delete user progress. Matching data is not proof of release freshness.'};
}
export async function capture({rftRoot,rftRef,upstreamRoot,upstreamRef,snapshotFile,eventsFile}){
 const inputs={};const readGit=(root,ref,path,label)=>{const raw=git(root,'show',ref+':'+path);inputs[label]={sha256:digest(raw),path};return JSON.parse(raw)};
 const rftCommit=git(rftRoot,'rev-parse','--verify','--end-of-options',rftRef+'^{commit}').trim(),upstreamCommit=git(upstreamRoot,'rev-parse','--verify','--end-of-options',upstreamRef+'^{commit}').trim();
 const collections={rftItems:readGit(rftRoot,rftCommit,'items.json','rft/items'),rftGoals:readGit(rftRoot,rftCommit,'goals.json','rft/goals'),blueprints:readGit(rftRoot,rftCommit,'blueprints.json','rft/blueprints')};
 const acquisition=readGit(rftRoot,rftCommit,'blueprint-acquisition-v2130.json','rft/acquisition');collections.acquisition=Object.entries(acquisition).filter(([k])=>k!=='_meta').map(([id,v])=>({id,...v}));const maps=readGit(rftRoot,rftCommit,'maps.json','rft/maps');collections.rftMaps=maps.maps;
 for(const [group,folder] of [['upstreamItems','items'],['upstreamQuests','quests'],['upstreamHideout','hideout']]){const paths=git(upstreamRoot,'ls-tree','-r','--name-only',upstreamCommit,folder).trim().split('\n').filter(p=>p.endsWith('.json'));if(!paths.length)throw Error('Empty upstream folder '+folder);collections[group]=paths.map(path=>readGit(upstreamRoot,upstreamCommit,path,'upstream/'+path))}
 collections.upstreamProjects=readGit(upstreamRoot,upstreamCommit,'projects.json','upstream/projects');collections.upstreamMaps=readGit(upstreamRoot,upstreamCommit,'maps.json','upstream/maps');collections.upstreamSkills=readGit(upstreamRoot,upstreamCommit,'skillNodes.json','upstream/skills');
 const documents={upstreamTrades:readGit(upstreamRoot,upstreamCommit,'trades.json','upstream/trades'),acquisitionMetadata:acquisition._meta,rftMapMetadata:{version:maps.version,defaultMap:maps.defaultMap}};
 const raw=await readFile(snapshotFile);inputs.snapshot={sha256:digest(raw),url:'https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json'};const snapshot=JSON.parse(raw);if(snapshot.schema!=='ramas-field-tool-item-snapshot'||snapshot.formatVersion!==1||!Array.isArray(snapshot.items)||snapshot.count!==snapshot.items.length)throw Error('Invalid/incomplete snapshot envelope');collections.snapshotItems=snapshot.items;documents.snapshotMetadata={generatedAt:snapshot.generatedAt,count:snapshot.count,source:snapshot.source};
 const eventRaw=await readFile(eventsFile);const events=JSON.parse(eventRaw);if(!Array.isArray(events.conditions)||!events.conditions.length)throw Error('Invalid/empty events');inputs.events={sha256:digest(eventRaw),url:'https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/live-events-data/live-events.json'};documents.events=events;
 const result={schema:'rft-data-review',version:1,provenance:{capturedAt:new Date().toISOString(),rftCommit,upstreamCommit,projection:'Descriptions excluded; localized objects limited to DE/EN/FR/ES/IT; all other supplied fields retained',inputs},collections:project(collections),documents:project(documents)};validate(result);return result;
}
export async function load(path){const bytes=await readFile(path);return JSON.parse(path.endsWith('.gz')?gunzipSync(bytes):bytes)}
async function save(path,value){await mkdir(dirname(resolve(path)),{recursive:true});const raw=Buffer.from(JSON.stringify(sort(value),null,2)+'\n');await writeFile(path,path.endsWith('.gz')?gzipSync(raw,{mtime:0}):raw)}
async function main(){const [mode,...args]=process.argv.slice(2),options={};for(let i=0;i<args.length;i+=2){if(!args[i]?.startsWith('--')||!args[i+1])throw Error('Expected --option value');options[args[i].slice(2)]=args[i+1]}
 const need=name=>{if(!options[name])throw Error('Missing --'+name);return options[name]};
 if(mode==='capture'){const data=await capture({rftRoot:need('rft-root'),rftRef:need('rft-ref'),upstreamRoot:need('upstream-root'),upstreamRef:need('upstream-ref'),snapshotFile:need('snapshot'),eventsFile:need('events')});await save(need('out'),data);console.log(JSON.stringify({collections:Object.fromEntries(Object.entries(data.collections).map(([k,v])=>[k,v.length])),warnings:analyse(data).length,output:options.out}))}
 else if(mode==='diff'){const data=compareBundles(await load(need('before')),await load(need('after')));await save(need('out'),data);console.log(JSON.stringify({changes:Object.fromEntries(Object.entries(data.changes).map(([k,v])=>[k,{added:v.added.length,removed:v.removed.length,changed:v.changed.length}])),changedDocuments:data.documents.length,newWarnings:data.newWarnings.length,output:options.out}));if(data.newWarnings.length)process.exitCode=2}
 else throw Error('Use capture or diff; see docs/frozen-trail-comparison-workflow.md');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=1});
