// Editorial display translations. Raw values/IDs remain unchanged; these are not verified official game terms.
(()=>{
  const rows={
    'ARC':['ARC','ARC','ARC','ARC'],
    'Exodus':['Exodus','Exodus','Exodus','Exodus'],
    'Electrical':['Elektrobereiche','Zones électriques','Zonas eléctricas','Zone elettriche'],
    'Mechanical':['Mechanische Bereiche','Zones mécaniques','Zonas mecánicas','Zone meccaniche'],
    'Nature':['Natur','Nature','Naturaleza','Natura'],
    'Residential':['Wohngebiete','Zones résidentielles','Zonas residenciales','Zone residenziali'],
    'Medical':['Medizinische Bereiche','Zones médicales','Zonas médicas','Zone mediche'],
    'Technological':['Technologiebereiche','Zones technologiques','Zonas tecnológicas','Zone tecnologiche'],
    'Commercial':['Gewerbegebiete','Zones commerciales','Zonas comerciales','Zone commerciali'],
    'Old World':['Alte Welt','Ancien monde','Viejo mundo','Vecchio mondo'],
    'Security':['Sicherheitsbereiche','Zones de sécurité','Zonas de seguridad','Zone di sicurezza'],
    'Industrial':['Industriegebiete','Zones industrielles','Zonas industriales','Zone industriali'],
    'Raider':['Raider','Raider','Raider','Raider'],
    'All':['Alle Karten','Toutes les cartes','Todos los mapas','Tutte le mappe'],
    'Residential Containers':['Behälter in Wohngebieten','Conteneurs résidentiels','Contenedores residenciales','Contenitori residenziali'],
    'Industrial Containers':['Industriebehälter','Conteneurs industriels','Contenedores industriales','Contenitori industriali'],
    'Electrical Containers':['Elektrobehälter','Conteneurs électriques','Contenedores eléctricos','Contenitori elettrici'],
    'Medical Containers':['Medizinbehälter','Conteneurs médicaux','Contenedores médicos','Contenitori medici'],
    'Security Containers':['Sicherheitsbehälter','Conteneurs de sécurité','Contenedores de seguridad','Contenitori di sicurezza'],
    'Raider Containers':['Raider-Behälter','Conteneurs de Raider','Contenedores de Raider','Contenitori Raider'],
    'Metal Crate':['Metallkiste','Caisse métallique','Caja metálica','Cassa di metallo'],
    'Anywhere':['Überall','Partout','En cualquier lugar','Ovunque'],
    'Condition only':['Nur bei entsprechender Bedingung','Uniquement sous cette condition','Solo con esta condición','Solo con questa condizione'],
    'Blueprint':['Bauplan','Plan','Plano','Progetto'],
    'Basic Material':['Grundmaterial','Matériau de base','Material básico','Materiale di base'],
    'Topside Material':['Oberflächenmaterial','Matériau de surface','Material de superficie','Materiale di superficie'],
    'Refined Material':['Veredeltes Material','Matériau raffiné','Material refinado','Materiale raffinato'],
    'Recyclable':['Recycelbar','Recyclable','Reciclable','Riciclabile'],
    'Quick Use':['Schnellgebrauch','Utilisation rapide','Uso rápido','Uso rapido'],
    'Modification':['Modifikation','Modification','Modificación','Modifica'],
    'Assault Rifle':['Sturmgewehr','Fusil d’assaut','Rifle de asalto','Fucile d’assalto'],
    'Battle Rifle':['Kampfgewehr','Fusil de combat','Rifle de combate','Fucile da battaglia'],
    'Hand Cannon':['Handkanone','Canon à main','Cañón de mano','Cannone portatile'],
    'Pistol':['Pistole','Pistolet','Pistola','Pistola'],
    'SMG':['Maschinenpistole','PM','Subfusil','Mitraglietta'],
    'Shotgun':['Schrotflinte','Fusil à pompe','Escopeta','Fucile a pompa'],
    'LMG':['Leichtes Maschinengewehr','Mitrailleuse légère','Ametralladora ligera','Mitragliatrice leggera'],
    'Sniper Rifle':['Scharfschützengewehr','Fusil de précision','Rifle de francotirador','Fucile di precisione'],
    'Ammunition':['Munition','Munitions','Munición','Munizioni'],
    'Trinket':['Wertgegenstand','Objet de valeur','Objeto de valor','Oggetto di valore'],
    'Key':['Schlüssel','Clé','Llave','Chiave'],
    'Augment':['Augmentierung','Augmentation','Aumento','Potenziamento'],
    'Shield':['Schild','Bouclier','Escudo','Scudo'],
    'Misc':['Sonstiges','Divers','Varios','Varie'],
    'Miscellaneous':['Sonstiges','Divers','Varios','Varie'],
    'Special':['Spezial','Spécial','Especial','Speciale'],
    'Common':['Gewöhnlich','Commun','Común','Comune'],
    'Uncommon':['Ungewöhnlich','Peu commun','Poco común','Non comune'],
    'Rare':['Selten','Rare','Raro','Raro'],
    'Epic':['Episch','Épique','Épico','Epico'],
    'Legendary':['Legendär','Légendaire','Legendario','Leggendario'],
    'Night Raid':['Nacht-Raid','Raid nocturne','Raid nocturno','Raid notturno'],
    'Electromagnetic Storm':['Elektromagnetischer Sturm','Tempête électromagnétique','Tormenta electromagnética','Tempesta elettromagnetica'],
    'Hidden Bunker':['Versteckter Bunker','Bunker caché','Búnker oculto','Bunker nascosto'],
    'Hurricane':['Hurrikan','Ouragan','Huracán','Uragano'],
    'Cold Snap':['Kälteeinbruch','Vague de froid','Ola de frío','Ondata di freddo'],
    'Dam Battlegrounds':['Damm-Schlachtfelder','Champ de bataille du barrage','Campos de batalla de la presa','Campi di battaglia della diga'],
    'Spaceport':['Raumhafen','Spatioport','Espaciopuerto','Spazioporto'],
    'The Spaceport':['Raumhafen','Spatioport','Espaciopuerto','Spazioporto'],
    'Buried City':['Begrabene Stadt','Ville enfouie','Ciudad enterrada','Città sepolta'],
    'The Blue Gate':['Das blaue Tor','La Porte Bleue','La Puerta Azul','Il Cancello Blu'],
    'Stella Montis – Upper':['Stella Montis – Obere Ebene','Stella Montis – niveau supérieur','Stella Montis – nivel superior','Stella Montis – livello superiore'],
    'Stella Montis – Lower':['Stella Montis – Untere Ebene','Stella Montis – niveau inférieur','Stella Montis – nivel inferior','Stella Montis – livello inferiore']
  };
  const index={de:0,fr:1,es:2,it:3};
  const pending=new Set();
  function language(){return localStorage.getItem('arcUiLanguage')||localStorage.getItem('arcLang')||'en'}
  function value(raw,field='',locale=language()){
    if(typeof raw!=='string'||locale==='en')return raw;
    if(raw.includes(' / '))return raw.split(' / ').map(part=>value(part,field,locale)).join(' / ');
    if(raw==='Any'){
      const conditions=['Keine besondere Bedingung','Aucune condition particulière','Sin condición especial','Nessuna condizione particolare'];
      const any=['Beliebig','Tous types','Cualquiera','Qualsiasi'];
      return (field==='condition'?conditions:any)[index[locale]]||raw;
    }
    if(raw==='Stella Montis'||raw==='Riven Tides'||raw==='Exodus')return raw;
    const label=rows[raw]?.[index[locale]];
    if(label)return label;
    pending.add(`${locale}:${field}:${raw}`);return raw;
  }
  window.RFTDataLabels={value,language,untranslated:()=>[...pending].sort()};
})();
