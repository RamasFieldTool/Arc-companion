// Additive, partial release data. These are RFT internal IDs, not confirmed API IDs.
// Never migrate stored IDs or replace newer upstream item records.
(()=>{
  const languages=['de','en','fr','es','it'];
  const names=en=>Object.fromEntries(languages.map(lang=>[lang,en]));
  const source='https://beebom.com/arc-raiders-outpost-guide/';
  const provenance={checkedAt:'2026-10-09',status:'published-game-screenshot',source};
  const pending={de:'Teilweise erfasst. Herstellungs-, Upgrade- und Recyclingmengen sind noch nicht verifiziert.',en:'Partial record. Crafting, upgrade and recycling quantities are not yet verified.',fr:'Fiche partielle. Quantités de fabrication, amélioration et recyclage non vérifiées.',es:'Ficha parcial. Cantidades de fabricación, mejora y reciclaje aún no verificadas.',it:'Scheda parziale. Quantità di creazione, potenziamento e riciclo non ancora verificate.'};
  const screenshot={de:'Beleg: veröffentlichter Spielscreen, geprüft am 09.10.2026.',en:'Evidence: published game screenshot, checked on 2026-10-09.',fr:'Preuve : capture du jeu publiée, vérifiée le 09/10/2026.',es:'Prueba: captura del juego publicada, revisada el 09/10/2026.',it:'Prova: schermata del gioco pubblicata, verificata il 09/10/2026.'};
  const material={de:'Community-Daten, Stand 09.10.2026. Verwendung: Outpost / Research Station. Keine Spielübersetzung verifiziert.',en:'Community data as of 2026-10-09. Used for Outpost / Research Station. Other game translations not verified.',fr:'Données communautaires au 09/10/2026. Usage : Outpost / Research Station. Autres traductions du jeu non vérifiées.',es:'Datos comunitarios del 09/10/2026. Uso: Outpost / Research Station. Otras traducciones del juego no verificadas.',it:'Dati della comunità al 09/10/2026. Uso: Outpost / Research Station. Altre traduzioni del gioco non verificate.'};
  const weaponDescription=detail=>Object.fromEntries(languages.map(lang=>[lang,`${detail} ${screenshot[lang]} ${pending[lang]}`]));
  const additions=[
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
    {id:'rft_research_station',de:'Research Station – nur Stufe I',en:'Research Station – level I only',fr:'Research Station – niveau I uniquement',es:'Research Station – solo nivel I',it:'Research Station – solo livello I',type:'hideout',rftEvidence:provenance,levels:[{level:1,requirements:[{itemId:'planks',quantity:35},{itemId:'battered_paperback',quantity:5},{itemId:'mini_pump',quantity:3}]}]}
  ];
  function extend(catalog,goals){
    const next=[...catalog],ids=new Map();
    for(const addition of additions){
      const existing=next.find(item=>item.id===addition.id||String(item.name?.en||item.en||item.name||'').toLowerCase()===addition.name.en.toLowerCase());
      ids.set(addition.id,existing?.id||addition.id);
      if(!existing)next.push(structuredClone(addition));
    }
    const nextGoals=[...goals];
    for(const definition of goalDefinitions){
      if(nextGoals.some(goal=>goal.id===definition.id))continue;
      const goal=structuredClone(definition);
      for(const level of goal.levels)for(const req of level.requirements)req.itemId=ids.get(req.itemId)||req.itemId;
      nextGoals.push(goal);
    }
    return {items:next,goals:nextGoals};
  }
  window.RFTFrozenTrailData={extend};
})();
