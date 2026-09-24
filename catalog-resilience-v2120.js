// V13.0.16 – resilient catalog loading with validated snapshot backup for mobile/browser clients.
(()=>{
  const nativeFetch=window.fetch.bind(window);
  const SNAPSHOT_URL='https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json';
  const GITHUB_ITEMS_INDEX='https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main';
  const LOCAL_ITEMS='items.json?v=293';
  const MAHCKS_TIMEOUT_MS=6000;
  const SNAPSHOT_TIMEOUT_MS=8000;
  const GITHUB_TIMEOUT_MS=12000;
  const GITHUB_BATCH_SIZE=12;
  let preferredBackup=null;
  let snapshotCatalogPromise=null;
  let githubCatalogPromise=null;

  const setMeta=(source,partial=false,extra={})=>{
    window.__arcCatalogMeta={source,partial,...extra};
  };
  setMeta('loading',false);

  const toUrl=input=>{
    const raw=typeof input==='string'?input:input?.url;
    return raw?new URL(raw,location.href):null;
  };
  const isMahcksItems=input=>{
    try{
      const u=toUrl(input);
      return !!u && u.hostname==='arcdata.mahcks.com' && u.pathname==='/v1/items';
    }catch{return false}
  };
  const retryable=status=>status===408||status===429||status>=500;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  async function fetchWithTimeout(input,init,timeoutMs){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{
      return await nativeFetch(input,{...(init||{}),signal:controller.signal});
    }finally{
      clearTimeout(timer);
    }
  }

  function validateCatalogItems(items,label,minCount=1){
    if(!Array.isArray(items)||items.length<minCount) throw new Error(`${label}: suspicious item count ${Array.isArray(items)?items.length:'invalid'}`);
    const ids=new Set();
    for(const item of items){
      if(!item?.id||typeof item.id!=='string') throw new Error(`${label}: item without valid id`);
      if(ids.has(item.id)) throw new Error(`${label}: duplicate item id ${item.id}`);
      ids.add(item.id);
    }
    return items;
  }

  async function mahcksResponseLooksUsable(response,input){
    try{
      const requestUrl=toUrl(input);
      const data=await response.clone().json();
      if(!data||!Array.isArray(data.items)) return false;
      if(requestUrl?.searchParams.get('full')!=='true') return true;
      const total=Number(data.total);
      const offset=Math.max(0,Number(data.offset ?? requestUrl.searchParams.get('offset'))||0);
      const count=Number(data.count);
      if(!Number.isFinite(total)||total<1) return false;
      if(Number.isFinite(count)&&count!==data.items.length) return false;
      if(offset<total&&data.items.length===0) return false;
      if(offset+data.items.length<total&&!data.next) return false;
      return true;
    }catch{
      return false;
    }
  }

  async function loadLocalItems(){
    try{
      const response=await nativeFetch(LOCAL_ITEMS,{cache:'no-store'});
      if(!response.ok) return [];
      const data=await response.json();
      return Array.isArray(data)?data:[];
    }catch{
      return [];
    }
  }

  async function loadSnapshotCatalog(){
    if(snapshotCatalogPromise) return snapshotCatalogPromise;
    snapshotCatalogPromise=(async()=>{
      const response=await fetchWithTimeout(SNAPSHOT_URL,{cache:'no-store'},SNAPSHOT_TIMEOUT_MS);
      if(!response.ok) throw new Error(`Ramas snapshot ${response.status}`);
      const snapshot=await response.json();
      if(snapshot?.schema!=='ramas-field-tool-item-snapshot'||snapshot?.formatVersion!==1) throw new Error('Ramas snapshot: invalid schema');
      const items=validateCatalogItems(snapshot.items,'Ramas snapshot',100);
      if(Number(snapshot.count)!==items.length) throw new Error(`Ramas snapshot: count mismatch ${snapshot.count}/${items.length}`);
      setMeta('snapshot',false,{total:items.length,generatedAt:snapshot.generatedAt||null});
      return items;
    })().catch(error=>{
      snapshotCatalogPromise=null;
      throw error;
    });
    return snapshotCatalogPromise;
  }

  async function fetchGithubItem(file){
    const response=await fetchWithTimeout(file.download_url,{cache:'no-store'},GITHUB_TIMEOUT_MS);
    if(!response.ok) throw new Error(`RaidTheory item ${file.name}: ${response.status}`);
    const data=await response.json();
    if(!data?.id) throw new Error(`RaidTheory item ${file.name}: missing id`);
    return data;
  }

  async function loadGithubCatalog(){
    if(githubCatalogPromise) return githubCatalogPromise;
    githubCatalogPromise=(async()=>{
      const indexResponse=await fetchWithTimeout(GITHUB_ITEMS_INDEX,{cache:'no-store'},GITHUB_TIMEOUT_MS);
      if(!indexResponse.ok) throw new Error(`RaidTheory item index ${indexResponse.status}`);
      const index=await indexResponse.json();
      const files=(Array.isArray(index)?index:[])
        .filter(file=>file?.type==='file'&&file?.name?.endsWith('.json')&&!file.name.startsWith('_')&&file?.download_url)
        .sort((a,b)=>a.name.localeCompare(b.name));
      if(!files.length) throw new Error('RaidTheory item index is empty');

      const loaded=[];
      const failed=[];
      for(let i=0;i<files.length;i+=GITHUB_BATCH_SIZE){
        const batch=files.slice(i,i+GITHUB_BATCH_SIZE);
        const firstPass=await Promise.allSettled(batch.map(fetchGithubItem));
        const retryFiles=[];
        firstPass.forEach((result,index)=>{
          if(result.status==='fulfilled') loaded.push(result.value);
          else retryFiles.push(batch[index]);
        });
        if(retryFiles.length){
          await wait(400);
          const secondPass=await Promise.allSettled(retryFiles.map(fetchGithubItem));
          secondPass.forEach((result,index)=>{
            if(result.status==='fulfilled') loaded.push(result.value);
            else failed.push({file:retryFiles[index]?.name||'unknown',reason:result.reason});
          });
        }
      }

      const remoteUnique=[...new Map(loaded.map(item=>[item.id,item])).values()];
      if(!remoteUnique.length) throw new Error('RaidTheory catalog returned no usable items');

      let finalCatalog=remoteUnique;
      if(failed.length||remoteUnique.length!==files.length){
        const localItems=await loadLocalItems();
        const merged=new Map(localItems.filter(item=>item?.id).map(item=>[item.id,item]));
        remoteUnique.forEach(item=>merged.set(item.id,item));
        finalCatalog=[...merged.values()];
        console.warn(`RaidTheory catalog partial: ${remoteUnique.length}/${files.length}; supplemented with ${localItems.length} local base items.`,failed);
        setMeta('github-partial',true,{remoteLoaded:remoteUnique.length,remoteExpected:files.length,total:finalCatalog.length,failed:failed.length});
      }else{
        setMeta('github',false,{remoteLoaded:remoteUnique.length,remoteExpected:files.length,total:remoteUnique.length,failed:0});
      }
      return finalCatalog;
    })().catch(error=>{
      githubCatalogPromise=null;
      throw error;
    });
    return githubCatalogPromise;
  }

  async function responseForCatalog(input,catalog,sourceHeader){
    const requestUrl=toUrl(input);
    const full=requestUrl?.searchParams.get('full')==='true';

    if(!full){
      const data={type:'items',count:catalog.length,items:catalog.map(item=>({id:item.id,url:`/v1/items/${item.id}`}))};
      return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json','X-ARC-Catalog-Source':sourceHeader}});
    }

    const requestedLimit=Number(requestUrl?.searchParams.get('limit'))||45;
    const limit=Math.max(1,Math.min(45,requestedLimit));
    const offset=Math.max(0,Number(requestUrl?.searchParams.get('offset'))||0);
    const page=catalog.slice(offset,offset+limit);
    const data={type:'items',total:catalog.length,count:page.length,offset,limit,items:page};
    if(offset+limit<catalog.length) data.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    if(offset>0) data.prev=`/v1/items?full=true&offset=${Math.max(0,offset-limit)}&limit=${limit}`;
    return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json','X-ARC-Catalog-Source':sourceHeader}});
  }

  async function snapshotResponseFor(input){
    const catalog=await loadSnapshotCatalog();
    return responseForCatalog(input,catalog,'Ramas-Snapshot');
  }

  async function githubResponseFor(input){
    const catalog=await loadGithubCatalog();
    return responseForCatalog(input,catalog,window.__arcCatalogMeta?.partial?'RaidTheory-GitHub-Partial':'RaidTheory-GitHub');
  }

  window.fetch=async function(input,init){
    if(!isMahcksItems(input)) return nativeFetch(input,init);
    if(preferredBackup==='snapshot') return snapshotResponseFor(input);
    if(preferredBackup==='github') return githubResponseFor(input);

    const delays=[0,500];
    let mahcksError;
    for(let attempt=0;attempt<delays.length;attempt++){
      if(delays[attempt]) await wait(delays[attempt]);
      try{
        const response=await fetchWithTimeout(input,init,MAHCKS_TIMEOUT_MS);
        if(response.ok){
          if(await mahcksResponseLooksUsable(response,input)){
            setMeta('mahcks',false);
            return response;
          }
          mahcksError=new Error('Mahcks items API returned an invalid or incomplete page');
          break;
        }
        mahcksError=new Error(`Mahcks items API ${response.status}`);
        if(!retryable(response.status)) break;
      }catch(error){
        mahcksError=error;
      }
    }

    let snapshotError;
    try{
      const response=await snapshotResponseFor(input);
      preferredBackup='snapshot';
      console.warn('Mahcks items API unavailable or invalid; using validated Ramas catalog snapshot.',mahcksError);
      return response;
    }catch(error){
      snapshotError=error;
      console.warn('Validated Ramas catalog snapshot unavailable; trying RaidTheory directly.',snapshotError);
    }

    try{
      const response=await githubResponseFor(input);
      preferredBackup='github';
      console.warn('Using RaidTheory GitHub catalog after Mahcks/snapshot failure.',mahcksError,snapshotError);
      return response;
    }catch(githubError){
      console.error('All external catalog fallbacks failed.',githubError);
      setMeta('local-fallback',false,{mahcksError:String(mahcksError||''),snapshotError:String(snapshotError||''),githubError:String(githubError||'')});
      throw mahcksError||snapshotError||githubError;
    }
  };
})();
