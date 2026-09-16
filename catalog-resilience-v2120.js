// V2.12.0 – keep the full item catalog usable when the Mahcks API is slow or unavailable.
(()=>{
  const nativeFetch=window.fetch.bind(window);
  const GITHUB_ITEMS_INDEX='https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main';
  const MAHCKS_TIMEOUT_MS=3500;
  const GITHUB_TIMEOUT_MS=10000;
  const GITHUB_BATCH_SIZE=18;
  let preferGithub=false;
  let githubCatalogPromise=null;

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
          await wait(250);
          const secondPass=await Promise.allSettled(retryFiles.map(fetchGithubItem));
          secondPass.forEach((result,index)=>{
            if(result.status==='fulfilled') loaded.push(result.value);
            else failed.push({file:retryFiles[index]?.name||'unknown',reason:result.reason});
          });
        }
      }

      const unique=[...new Map(loaded.map(item=>[item.id,item])).values()];
      if(failed.length||unique.length!==files.length){
        console.warn(`RaidTheory catalog incomplete: ${unique.length}/${files.length}`,failed);
        throw new Error(`RaidTheory catalog incomplete ${unique.length}/${files.length}`);
      }
      return unique;
    })().catch(error=>{
      githubCatalogPromise=null;
      throw error;
    });
    return githubCatalogPromise;
  }

  async function githubResponseFor(input){
    const requestUrl=toUrl(input);
    const catalog=await loadGithubCatalog();
    const full=requestUrl?.searchParams.get('full')==='true';

    if(!full){
      const data={
        type:'items',
        count:catalog.length,
        items:catalog.map(item=>({id:item.id,url:`/v1/items/${item.id}`}))
      };
      return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json','X-ARC-Catalog-Source':'RaidTheory-GitHub'}});
    }

    const requestedLimit=Number(requestUrl?.searchParams.get('limit'))||45;
    const limit=Math.max(1,Math.min(45,requestedLimit));
    const offset=Math.max(0,Number(requestUrl?.searchParams.get('offset'))||0);
    const page=catalog.slice(offset,offset+limit);
    const data={type:'items',total:catalog.length,count:page.length,offset,limit,items:page};
    if(offset+limit<catalog.length) data.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    if(offset>0) data.prev=`/v1/items?full=true&offset=${Math.max(0,offset-limit)}&limit=${limit}`;
    return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json','X-ARC-Catalog-Source':'RaidTheory-GitHub'}});
  }

  window.fetch=async function(input,init){
    if(!isMahcksItems(input)) return nativeFetch(input,init);
    if(preferGithub) return githubResponseFor(input);

    const delays=[0,250];
    let lastError;
    for(let attempt=0;attempt<delays.length;attempt++){
      if(delays[attempt]) await wait(delays[attempt]);
      try{
        const response=await fetchWithTimeout(input,init,MAHCKS_TIMEOUT_MS);
        if(response.ok) return response;
        lastError=new Error(`Mahcks items API ${response.status}`);
        if(!retryable(response.status)) break;
      }catch(error){
        lastError=error;
      }
    }

    try{
      const response=await githubResponseFor(input);
      preferGithub=true;
      console.warn('Mahcks items API unavailable; using RaidTheory GitHub catalog.',lastError);
      return response;
    }catch(githubError){
      console.error('RaidTheory GitHub catalog fallback failed.',githubError);
      throw lastError||githubError;
    }
  };
})();
