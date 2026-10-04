(()=>{
  'use strict';

  const BOTS_URL='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/bots.json';
  const MAPS_URL='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/maps.json';
  let state={loaded:false,error:null,dropsByItem:new Map(),mapsById:new Map()};

  const localized=(value,lang)=>{
    if(!value) return '';
    if(typeof value==='string') return value;
    return value[lang]||value.en||value.de||Object.values(value)[0]||'';
  };

  async function fetchJson(url){
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok) throw new Error(`Location data ${response.status}`);
    return response.json();
  }

  function buildIndex(bots,maps){
    const dropsByItem=new Map();
    const mapsById=new Map((Array.isArray(maps)?maps:[]).map(map=>[map.id,map]));
    (Array.isArray(bots)?bots:[]).forEach(bot=>{
      (Array.isArray(bot.drops)?bot.drops:[]).forEach(itemId=>{
        if(!dropsByItem.has(itemId)) dropsByItem.set(itemId,[]);
        dropsByItem.get(itemId).push({id:bot.id,name:bot.name||bot.id,maps:Array.isArray(bot.maps)?bot.maps:[]});
      });
    });
    state={loaded:true,error:null,dropsByItem,mapsById};
  }

  async function load(){
    if(state.loaded) return true;
    try{
      const [bots,maps]=await Promise.all([fetchJson(BOTS_URL),fetchJson(MAPS_URL)]);
      buildIndex(bots,maps);
      return true;
    }catch(error){
      console.warn('Item location data unavailable',error);
      state={...state,loaded:false,error};
      return false;
    }
  }

  function get(item,lang='en'){
    if(!item?.id) return null;
    const sources=state.dropsByItem.get(item.id)||[];
    const mapIds=[...new Set(sources.flatMap(source=>source.maps))];
    return {
      itemId:item.id,
      foundIn:item.foundIn||'',
      sources:sources.map(source=>({id:source.id,name:source.name})),
      maps:mapIds.map(id=>({id,name:localized(state.mapsById.get(id)?.name,lang)})).filter(map=>map.name)
    };
  }

  window.RFTItemLocations={load,get,isLoaded:()=>state.loaded,getError:()=>state.error};
})();
