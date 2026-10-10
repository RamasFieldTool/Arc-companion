// Additive, partial release data. These are RFT internal IDs, not confirmed API IDs.
// Pin identities across upstream/fallback changes; never rewrite saved stock or goals.
(()=>{
  const languages=['de','en','fr','es','it'];
  const names=en=>Object.fromEntries(languages.map(lang=>[lang,en]));
  const source='https://beebom.com/arc-raiders-outpost-guide/';
  const provenance={checkedAt:'2026-10-09',status:'published-game-screenshot',source};
  const pending={de:'Teilweise erfasst. Herstellungs-, Upgrade- und Recyclingmengen sind noch nicht verifiziert.',en:'Partial record. Crafting, upgrade and recycling quantities are not yet verified.',fr:'Fiche partielle. Quantités de fabrication, amélioration et recyclage non vérifiées.',es:'Ficha parcial. Cantidades de fabricación, mejora y reciclaje aún no verificadas.',it:'Scheda parziale. Quantità di creazione, potenziamento e riciclo non ancora verificate.'};
  const screenshot={de:'Beleg: veröffentlichter Spielscreen, geprüft am 09.10.2026.',en:'Evidence: published game screenshot, checked on 2026-10-09.',fr:'Preuve : capture du jeu publiée, vérifiée le 09/10/2026.',es:'Prueba: captura del juego publicada, revisada el 09/10/2026.',it:'Prova: schermata del gioco pubblicata, verificata il 09/10/2026.'};
  const material={de:'Community-Daten, Stand 09.10.2026. Verwendung: Outpost / Research Station. Keine Spielübersetzung verifiziert.',en:'Community data as of 2026-10-09. Used for Outpost / Research Station. Other game translations not verified.',fr:'Données communautaires au 09/10/2026. Usage : Outpost / Research Station. Autres traductions du jeu non vérifiées.',es:'Datos comunitarios del 09/10/2026. Uso: Outpost / Research Station. Otras traducciones del juego no verificadas.',it:'Dati della comunità al 09/10/2026. Uso: Outpost / Research Station. Altre traduzioni del gioco non verificate.'};
  const weaponDescription=detail=>Object.fromEntries(languages.map(lang=>[lang,`${detail} ${screenshot[lang]} ${pending[lang]}`]));
  const grappleEvidence={checkedAt:'2026-10-10',status:'published-game-screenshot',source:'https://beebom.com/arc-raiders-grappling-hook-guide/'};
  const gunsmithEvidence={checkedAt:'2026-10-10',status:'published-game-screenshot',source:'https://gameshorizon.com/guides/how-to-unlock-upgrade-amplified-weapons-in-arc-raiders-frozen-trail/'};
  const grappleDescription={de:'Herstellung: Utility Station I, Blueprint erforderlich. 2 Rope · 1 Cable Stripper · 1 Mechanical Components. Blueprint bei Pass-Stufe 12 abgebildet. Veröffentlichte Spielscreens geprüft am 10.10.2026; nicht selbst im Spiel getestet. Unbekannte Werte bleiben offen.',en:'Crafting: Utility Station I, blueprint required. 2 Rope · 1 Cable Stripper · 1 Mechanical Components. Blueprint shown at pass level 12. Published game screenshots checked on 2026-10-10; not personally tested in-game. Unknown values remain open.',fr:'Fabrication : Utility Station I, plan requis. 2 Rope · 1 Cable Stripper · 1 Mechanical Components. Plan visible au niveau 12 du pass. Captures publiées vérifiées le 10/10/2026 ; non testé personnellement en jeu. Valeurs inconnues non renseignées.',es:'Fabricación: Utility Station I, plano necesario. 2 Rope · 1 Cable Stripper · 1 Mechanical Components. Plano visible en el nivel 12 del pase. Capturas publicadas revisadas el 10/10/2026; sin prueba personal en el juego. Valores desconocidos pendientes.',it:'Creazione: Utility Station I, progetto richiesto. 2 Rope · 1 Cable Stripper · 1 Mechanical Components. Progetto visibile al livello 12 del pass. Schermate pubblicate verificate il 10/10/2026; nessuna prova personale nel gioco. Valori sconosciuti non compilati.'};
  // Official 2.0 patch notes confirm these item names, but not their numeric
  // crafting/recycling/trader values. Do not fabricate fields or overwrite upstream.
  const officialEquipmentEvidence={checkedAt:'2026-10-10',status:'official-patch-notes',source:'https://arcraiders.com/news/frozen-trail-2-0-update'};
  const officialEquipmentDescription={
    de:'Neuer Gegenstand aus Frozen Trail 2.0. Herstellungs-, Upgrade- und Recyclingmengen sind hier noch nicht verifiziert.',
    en:'New item from Frozen Trail 2.0. Crafting, upgrade and recycling quantities are not yet verified here.',
    fr:'Nouvel objet de Frozen Trail 2.0. Quantités de fabrication, amélioration et recyclage non vérifiées ici.',
    es:'Nuevo objeto de Frozen Trail 2.0. Cantidades de fabricación, mejora y reciclaje aún no verificadas aquí.',
    it:'Nuovo oggetto di Frozen Trail 2.0. Quantità di creazione, potenziamento e riciclo non ancora verificate qui.'
  };
  const officialEquipment=['Basic Camera','Advanced Camera','Tether Launcher','Yank Grenade','Mountaineer’s Detector','Banjo','Harmonica'].map(en=>({
    id:en.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'_'),
    name:names(en),description:officialEquipmentDescription,rftEvidence:officialEquipmentEvidence
  }));
  const additions=[
    ...officialEquipment,
    {id:'grappling_hook',name:names('Grappling Hook'),type:'Quick Use',rarity:'Uncommon',recipe:{rope:2,cable_stripper:1,mechanical_components:1},description:grappleDescription,rftEvidence:grappleEvidence},
    ...['rope','cable_stripper','mechanical_components'].map(id=>({id,name:names({rope:'Rope',cable_stripper:'Cable Stripper',mechanical_components:'Mechanical Components'}[id]),rftEvidence:grappleEvidence})),
    ...['radial_press','magnetic_accelerator','emperor_modulator'].map(id=>({id,name:names({radial_press:'Radial Press',magnetic_accelerator:'Magnetic Accelerator',emperor_modulator:'Emperor Modulator'}[id]),rftEvidence:gunsmithEvidence})),
    {id:'planks',name:names('Planks'),type:'Basic Material',rarity:'Common',weightKg:0.1,stackSize:50,value:100,description:material,rftEvidence:{checkedAt:'2026-10-09',status:'community-table',source:'https://arcraiders.wiki/wiki/Planks'}},
    {id:'sheet_metal',name:names('Sheet Metal'),type:'Basic Material',rarity:'Common',weightKg:0.1,stackSize:50,value:100,description:material,rftEvidence:{checkedAt:'2026-10-09',status:'community-table',source:'https://arcraiders.wiki/wiki/Sheet_Metal'}},
    {id:'mini_pump',name:names('Mini Pump'),rftEvidence:provenance},
    {id:'battered_paperback',name:names('Battered Paperback'),rftEvidence:provenance},
    {id:'bantam_i',name:names('Bantam I'),type:'Hand Cannon',rarity:'Uncommon',weightKg:3,value:3800,description:weaponDescription('Heavy Ammo · Magazine: 8'),rftEvidence:{...provenance,source:'https://beebom.com/how-to-get-bantam-in-arc-raiders/'}},
    {id:'stiletto_ii',name:names('Stiletto II'),type:'Battle Rifle',rarity:'Uncommon',weightKg:7,description:weaponDescription('Light Ammo · Magazine: 12'),rftEvidence:{...provenance,source:'https://beebom.com/how-to-get-stiletto-in-arc-raiders/'}},
    {id:'stiletto_iv',name:names('Stiletto IV'),type:'Battle Rifle',rarity:'Uncommon',description:weaponDescription('Cassio: 8 Candleberries · 2 Cable Stripper · 2 Mini Pump (2026-10-09)'),rftEvidence:{...provenance,source:'https://beebom.com/how-to-get-stiletto-in-arc-raiders/'}}
  ];
  const goalDefinitions=[
    {id:'rft_outpost_materials',de:'Outpost – nur Materialphase',en:'Outpost – material phase only',fr:'Outpost – phase matériaux uniquement',es:'Outpost – solo fase de materiales',it:'Outpost – solo fase materiali',type:'hideout',rftEvidence:{checkedAt:'2026-10-09',status:'corroborated-community',source:'https://arcraiders.wiki/wiki/Outpost'},levels:[{level:1,requirements:[{itemId:'planks',quantity:3},{itemId:'sheet_metal',quantity:5},{itemId:'arc_alloy',quantity:10},{itemId:'advanced_electrical_components',quantity:3}]}]},
    {id:'rft_research_station',de:'Research Station – nur Stufe I',en:'Research Station – level I only',fr:'Research Station – niveau I uniquement',es:'Research Station – solo nivel I',it:'Research Station – solo livello I',type:'hideout',rftEvidence:provenance,levels:[{level:1,requirements:[{itemId:'planks',quantity:35},{itemId:'battered_paperback',quantity:5},{itemId:'mini_pump',quantity:3}]}]},
    {id:'rft_grappling_hook_craft',de:'Grappling Hook – 1 herstellen (Blueprint + Utility Station I)',en:'Grappling Hook – craft 1 (blueprint + Utility Station I)',fr:'Grappling Hook – fabriquer 1 (plan + Utility Station I)',es:'Grappling Hook – fabricar 1 (plano + Utility Station I)',it:'Grappling Hook – crea 1 (progetto + Utility Station I)',type:'hideout',rftEvidence:grappleEvidence,levels:[{level:1,requirements:[{itemId:'rope',quantity:2},{itemId:'cable_stripper',quantity:1},{itemId:'mechanical_components',quantity:1}]}]}
  ];
  const IDENTITY_KEY='arcFrozenTrailIdentities';
  const safeId=id=>typeof id==='string'&&/^[a-z0-9_-]{1,180}$/i.test(id)&&!['__proto__','constructor','prototype'].includes(id);
  const read=key=>{try{return JSON.parse(window.localStorage?.getItem(key)||'{}')}catch{return {}}};
  let aliases=new Map();
  const resolve=id=>aliases.get(id)||id;
  function references(records){
    const maps=new Set(['recipe','recyclesInto','salvagesInto','repairCost','upgradeCost','cost']);
    function visit(value,field){
      if(Array.isArray(value))return value.map(entry=>visit(entry));
      if(!value||typeof value!=='object')return value;
      const result={};
      for(const [key,valueEntry] of Object.entries(value)){
        const nextKey=maps.has(field)?resolve(key):key;
        const nextValue=['itemId','upgradesTo'].includes(key)&&typeof valueEntry==='string'?resolve(valueEntry):visit(valueEntry,key);
        if(Object.hasOwn(result,nextKey)){
          if(typeof result[nextKey]!=='number'||typeof nextValue!=='number')throw new Error('Conflicting item references');
          result[nextKey]+=nextValue;
        }else result[nextKey]=nextValue;
      }
      return result;
    }
    return records.map(record=>visit(record));
  }
  function extend(catalog,goals){
    const saved=read(IDENTITY_KEY),pins={},next=[],newAliases=new Map();
    const owned=read('arcOwned'),personal=read('arcPlanningPersonal'),raid=read('arcNextRaid');
    const referenced=id=>[owned,personal,raid].some(record=>record&&Object.hasOwn(record,id));
    const remaining=new Set(catalog);
    for(const addition of additions){
      const matches=catalog.filter(item=>item.id===addition.id||String(item.name?.en||item.en||item.name||'').toLowerCase()===addition.name.en.toLowerCase());
      const existing=matches.find(item=>item.id!==addition.id)||matches[0];
      const pinned=safeId(saved?.[addition.id])?saved[addition.id]:referenced(addition.id)?addition.id:existing?.id||addition.id;
      if(!safeId(pinned)||Object.values(pins).includes(pinned))throw new Error('Invalid item identity');
      if(catalog.some(item=>item.id===pinned&&!matches.includes(item)))throw new Error('Conflicting item identity');
      pins[addition.id]=pinned;newAliases.set(addition.id,pinned);
      for(const match of matches){newAliases.set(match.id,pinned);remaining.delete(match);}
      next.push({...structuredClone(existing||addition),id:pinned});
    }
    next.unshift(...remaining);
    if(window.localStorage&&JSON.stringify(saved)!==JSON.stringify(pins))window.localStorage.setItem(IDENTITY_KEY,JSON.stringify(pins));
    aliases=newAliases;
    const nextGoals=structuredClone(goals);
    const gunsmith=nextGoals.find(goal=>goal.id==='weapon_bench');
    if(gunsmith&&!gunsmith.levels.some(level=>level.level===4))gunsmith.levels.push({level:4,requirements:[{itemId:'radial_press',quantity:3},{itemId:'magnetic_accelerator',quantity:3},{itemId:'emperor_modulator',quantity:1}],rftEvidence:gunsmithEvidence});
    for(const definition of goalDefinitions)if(!nextGoals.some(goal=>goal.id===definition.id))nextGoals.push(structuredClone(definition));
    return {items:references(next),goals:references(nextGoals)};
  }
  window.RFTFrozenTrailData={extend,references,resolve};
})();
