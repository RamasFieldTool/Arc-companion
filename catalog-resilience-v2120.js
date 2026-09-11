// V2.12.0 – retry transient Mahcks API failures before app.js falls back locally.
(()=>{
  const nativeFetch=window.fetch.bind(window);
  const isMahcksItems=input=>{
    try{
      const raw=typeof input==='string'?input:input?.url;
      if(!raw) return false;
      const u=new URL(raw,location.href);
      return u.hostname==='arcdata.mahcks.com' && u.pathname==='/v1/items';
    }catch{return false}
  };
  const retryable=status=>status===408||status===429||status>=500;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  window.fetch=async function(input,init){
    if(!isMahcksItems(input)) return nativeFetch(input,init);
    const delays=[0,350,900];
    let lastError;
    for(let attempt=0;attempt<delays.length;attempt++){
      if(delays[attempt]) await wait(delays[attempt]);
      try{
        const response=await nativeFetch(input,init);
        if(response.ok || !retryable(response.status)) return response;
        lastError=new Error(`Mahcks items API ${response.status}`);
      }catch(err){
        lastError=err;
      }
    }
    throw lastError||new Error('Mahcks items API unavailable');
  };
})();
