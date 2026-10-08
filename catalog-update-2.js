// Confirmed 2.0 corrections only. IDs and user state are never changed.
(()=>{
  const source='https://arcraiders.com/es/news/frozen-trail-2-0-update';
  const text={
    anvil_splitter:{de:'Kein verwendbarer Mod mehr; droppt nicht mehr. Vorhandene Splitter bleiben verkaufbar oder zu Amplified Fragments recycelbar. Die genaue Recyclingmenge ist noch nicht verifiziert.',en:'No longer a usable mod and no longer drops. Existing Splitters can still be sold or recycled into Amplified Fragments. The exact recycling quantity is not yet verified.',fr:'Ce mod ne peut plus être utilisé ni trouvé comme butin. Les exemplaires existants peuvent être vendus ou recyclés en Amplified Fragments. La quantité exacte reste à vérifier.',es:'Ya no se puede usar como mod ni aparece como botín. Los existentes se pueden vender o reciclar en Amplified Fragments. La cantidad exacta aún no está verificada.',it:'Non è più utilizzabile come mod e non appare più nel bottino. Gli esemplari esistenti si possono vendere o riciclare in Amplified Fragments. La quantità esatta non è ancora verificata.'},
    snap_hook:{de:'Reichweite: 18 m. Haltbarkeitsverbrauch: 4 % pro Einsatz. Energiekosten: 60.',en:'Range: 18 m. Durability consumption: 4% per use. Power cost: 60.',fr:'Portée : 18 m. Consommation de durabilité : 4 % par utilisation. Coût en énergie : 60.',es:'Alcance: 18 m. Consumo de durabilidad: 4 % por uso. Coste de energía: 60.',it:'Portata: 18 m. Consumo di durabilità: 4% per utilizzo. Costo energetico: 60.'},
    heavy_shield:{de:'Bewegungsnachteil: 10 %. Haltbarkeitsabnahme von 0,20 auf 0,15 reduziert.',en:'Movement penalty: 10%. Durability decay reduced from 0.20 to 0.15.',fr:'Pénalité de déplacement : 10 %. Dégradation de durabilité réduite de 0,20 à 0,15.',es:'Penalización de movimiento: 10 %. Desgaste de durabilidad reducido de 0,20 a 0,15.',it:'Penalità al movimento: 10%. Degrado della durabilità ridotto da 0,20 a 0,15.'}
  };
  function correct(item){
    const copy=structuredClone(item);
    if(/^anvil_(i|ii|iii|iv)$/.test(copy.id)){
      if(copy.rarity==='Uncommon')copy.rarity='Rare';
      if(copy.modSlots?.special){copy.modSlots.special=copy.modSlots.special.filter(id=>id!=='anvil_splitter');if(!copy.modSlots.special.length)delete copy.modSlots.special;}
    }
    if(copy.id==='anvil_splitter'){
      // Do not replace a future verified fragment recipe with an invented amount.
      if(copy.recyclesInto?.mod_components!==undefined||copy.recyclesInto?.processor!==undefined){delete copy.recyclesInto;delete copy.recycle;copy.recyclingPending=true;}
      copy.rftConfirmedUpdate=true;copy.description={...text.anvil_splitter};
    }
    if(copy.id==='snap_hook'){
      if(copy.effects?.Range?.value==='20m')copy.effects.Range.value='18m';
      copy.rftConfirmedUpdate=true;copy.description={...text.snap_hook};
    }
    if(copy.id==='heavy_shield'){
      if(copy.effects?.['15% Reduced Movement Speed']){
        const effect=copy.effects['15% Reduced Movement Speed'];delete copy.effects['15% Reduced Movement Speed'];
        copy.effects['Reduced Movement Speed']={...effect,de:'Verringerte Bewegungsgeschwindigkeit',en:'Reduced Movement Speed',fr:'Vitesse de déplacement réduite',es:'Velocidad de movimiento reducida',it:'Velocità di movimento ridotta',value:'10%'};
      }
      if(copy.movementSpeedModifier===-15)copy.movementSpeedModifier=-10;
      copy.rftConfirmedUpdate=true;copy.description={...text.heavy_shield};
    }
    if(/^anvil_(i|ii|iii|iv)$/.test(copy.id)||/^hullcracker_(i|ii|iii|iv)$/.test(copy.id)){
      if(Array.isArray(copy.vendors))copy.vendors=copy.vendors.filter(v=>v.trader!=='Tian Wen');
    }
    return copy;
  }
  window.RFTCatalogUpdate={correct,source};
})();
