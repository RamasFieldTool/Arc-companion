// Supplemental cosmetic catalog records for V15.00.00.
// Item names are searchable; unverified values, components and compatibility are omitted.
(()=>{
  const baseExtend=window.RFTFrozenTrailData?.extend;
  if(typeof baseExtend!=='function')throw new Error('Frozen Trail catalog extension must load before catalog cosmetics.');
  if(window.__rftCatalogCosmeticsInstalled)return;

  const languages=['de','en','fr','es','it'];
  const names=en=>Object.fromEntries(languages.map(lang=>[lang,en]));
  const description=Object.fromEntries(languages.map(lang=>[lang,'Weapon stencil cosmetic. Apply to a compatible weapon with Stencil Parts. Compatibility and values are not listed here.']));
  const stencilEvidence={checkedAt:'2026-10-20',status:'community-index-name-only',source:'https://wiki.arcraiderscommunity.com/wiki/Stencil_Index'};
  const stencilNames=['Bulwark','Cerulean',"Dragon's Breath",'Dusty Camo','Empyrean','Fortuna','Garnet','Milky Terraccota','Ochre','Sacrifice','Serac','Slipstream','Tortoise','Verdigris'];
  const stencils=stencilNames.map(en=>({
    id:`${en.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}_stencil`,
    name:names(`${en} Stencil`),type:'Cosmetic',description,rftEvidence:stencilEvidence
  }));
  const wreckSet={
    id:'wreck_set',name:names('Wreck Set'),type:'Cosmetic Set',
    description:Object.fromEntries(languages.map(lang=>[lang,'Cosmetic set announced in the official Store Update 2.2.0. Individual set pieces are not listed in this record.'])),
    rftEvidence:{checkedAt:'2026-10-20',status:'official-store-update',source:'https://arcraiders.com/news/store-update-2-2-0'}
  };
  const supplemental=[...stencils,wreckSet];
  const normalize=value=>String(value||'').trim().toLocaleLowerCase('en');

  window.RFTFrozenTrailData.extend=(catalog,goals)=>{
    const result=baseExtend(catalog,goals);
    const items=[...result.items];
    for(const addition of supplemental){
      const exists=items.some(item=>item?.id===addition.id||normalize(item?.name?.en||item?.en||item?.name)===normalize(addition.name.en));
      if(!exists)items.push(structuredClone(addition));
    }
    return {...result,items};
  };
  window.__rftCatalogCosmeticsInstalled=true;
})();
