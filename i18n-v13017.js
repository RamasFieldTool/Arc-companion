// V13.0.17 test — English-first language selector with French/Spanish UI overlays.
(()=>{
  const UI_KEY='arcUiLanguage';
  const FIRST_RUN_KEY='arcLanguageOnboardingPending';
  const SUPPORTED=['en','de','fr','es'];
  const NAMES={en:'English',de:'Deutsch',fr:'Français',es:'Español'};
  const SHORT={en:'EN',de:'DE',fr:'FR',es:'ES'};
  const LOCALES={en:'en-GB',de:'de-CH',fr:'fr-FR',es:'es-ES'};

  const COPY={
    en:{choose:'Choose your language',chooseHelp:'You can change this later with the language button.',language:'Language',openMenu:'Change language',closeMenu:'Close language menu',heading:'Ready for your next raid?',subtitle:'Your preparation. All in one place.',back:'← Back',open:'Open',places:'Places and item locations',tiles:{nextRaidDrawer:'My next raid',liveEventsDrawer:'Live events',goalsSection:'My goals',supplySection:'Requirements',itemsSection:'Item search',questDrawer:'Quests',blueprintDrawer:'Blueprints',spawnPanel:'Maps'},utilities:{tipsDrawer:'Tips',paletteLab:'Appearance',backupPanel:'Backup',launcherHelp:'Help',communityCredit:'Community'}},
    de:{choose:'Sprache auswählen',chooseHelp:'Du kannst sie später über die Sprachtaste ändern.',language:'Sprache',openMenu:'Sprache ändern',closeMenu:'Sprachmenü schließen',heading:'Bereit für den nächsten Raid?',subtitle:'Deine Vorbereitung. Alles an einem Ort.',back:'← Zurück',open:'Öffnen',places:'Orte und Fundstellen',tiles:{nextRaidDrawer:'Mein nächster Raid',liveEventsDrawer:'Live-Events',goalsSection:'Meine Ziele',supplySection:'Gesamtbedarf',itemsSection:'Item-Suche',questDrawer:'Quests',blueprintDrawer:'Baupläne',spawnPanel:'Karten'},utilities:{tipsDrawer:'Tipps',paletteLab:'Darstellung',backupPanel:'Backup',launcherHelp:'Hilfe',communityCredit:'Community'}},
    fr:{choose:'Choisissez votre langue',chooseHelp:'Vous pourrez la modifier plus tard avec le bouton de langue.',language:'Langue',openMenu:'Changer de langue',closeMenu:'Fermer le menu des langues',heading:'Prêt pour votre prochain raid ?',subtitle:'Votre préparation. Tout au même endroit.',back:'← Retour',open:'Ouvrir',places:'Lieux et emplacements',tiles:{nextRaidDrawer:'Mon prochain raid',liveEventsDrawer:'Événements en direct',goalsSection:'Mes objectifs',supplySection:'Besoins totaux',itemsSection:'Recherche d’objets',questDrawer:'Quêtes',blueprintDrawer:'Plans',spawnPanel:'Cartes'},utilities:{tipsDrawer:'Astuces',paletteLab:'Apparence',backupPanel:'Sauvegarde',launcherHelp:'Aide',communityCredit:'Communauté'}},
    es:{choose:'Elige tu idioma',chooseHelp:'Puedes cambiarlo más tarde con el botón de idioma.',language:'Idioma',openMenu:'Cambiar idioma',closeMenu:'Cerrar menú de idiomas',heading:'¿Listo para tu próxima incursión?',subtitle:'Tu preparación. Todo en un solo lugar.',back:'← Volver',open:'Abrir',places:'Lugares y ubicaciones',tiles:{nextRaidDrawer:'Mi próxima incursión',liveEventsDrawer:'Eventos en directo',goalsSection:'Mis objetivos',supplySection:'Necesidades totales',itemsSection:'Buscar objetos',questDrawer:'Misiones',blueprintDrawer:'Planos',spawnPanel:'Mapas'},utilities:{tipsDrawer:'Consejos',paletteLab:'Apariencia',backupPanel:'Copia de seguridad',launcherHelp:'Ayuda',communityCredit:'Comunidad'}}
  };

  const FR={
    'ACTIVE GOALS':'OBJECTIFS ACTIFS','CHANGE':'MODIFIER','Activate every station/level you are currently working toward.':'Activez toutes les stations et tous les niveaux vers lesquels vous progressez actuellement.','Total requirements':'Besoins totaux','SEARCH ITEM':'RECHERCHER UN OBJET','Level':'Niveau','No upgrade goal or active quest with item requirements.':'Aucun objectif d’amélioration ni quête active avec des objets requis.','Total':'Total','owned':'possédé','missing':'manquant','Value':'Valeur','Weight':'Poids','Stack':'Pile','Description':'Description','Recycling':'Recyclage','No recycling data':'Aucune donnée de recyclage','Enter a search term':'Saisissez un terme de recherche','items loaded':'objets chargés','matches':'résultats','No results.':'Aucun résultat.','FREE – not currently needed for your active goals':'LIBRE – actuellement inutile pour vos objectifs actifs','GOAL MET – you have enough':'OBJECTIF ATTEINT – vous en avez assez','KEEP – you still need':'GARDER – il vous en manque encore','Full catalog unavailable – local base dataset active.':'Catalogue complet inaccessible – données locales de base actives.','QUESTS':'QUÊTES','Open quest tracker':'Ouvrir le suivi des quêtes','SHOW':'AFFICHER','CLOSE':'FERMER','Search quests …':'Rechercher une quête …','ALL':'TOUTES','OPEN':'OUVERT','ACTIVE':'ACTIF','DONE':'TERMINÉ','Loading quests …':'Chargement des quêtes …','Quest data could not be loaded.':'Impossible de charger les données de quêtes.','quests loaded':'quêtes chargées','shown':'affichées','Objectives':'Objectifs','Required items':'Objets requis','Rewards':'Récompenses','Granted':'Fournis','Quest giver':'Donneur de quête','No item requirements':'Aucun objet requis','No item rewards':'Aucune récompense d’objet','Quest':'Quête','active':'actives',
    'DATA // LOADING…':'DONNÉES // CHARGEMENT…','DATA // LIVE':'DONNÉES // À JOUR','DATA // BASE DATA':'DONNÉES // BASE LOCALE','DATA // PARTIAL':'DONNÉES // PARTIELLES','DATA // ERROR':'DONNÉES // ERREUR','Current data is loading':'Chargement des données actuelles','Current data loaded':'Données actuelles chargées','Local base dataset active':'Données locales de base actives','Data is only partially available':'Données disponibles partiellement','Data could not be loaded':'Impossible de charger les données','The full live catalog is currently unavailable. Search and goals continue with the local base dataset, which may be less complete or current.':'Le catalogue complet en direct est indisponible. La recherche et les objectifs continuent avec les données locales de base, qui peuvent être moins complètes ou moins récentes.','The external catalog loaded only partially. Missing entries were supplemented with local base data where possible.':'Le catalogue externe n’a été chargé que partiellement. Les entrées manquantes ont été complétées avec les données locales lorsque possible.',
    'Requirements':'Besoins','Show needs and inventory':'Afficher les besoins et le stock','CLOSE REQUIREMENTS':'FERMER LES BESOINS','ITEM SEARCH':'RECHERCHE D’OBJETS','Item or material':'Objet ou matériau','ITEM OR MATERIAL':'OBJET OU MATÉRIAU','CLOSE ITEM SEARCH':'FERMER LA RECHERCHE','INFO':'INFO','BACKUP':'SAUVEGARDE','Help':'Aide','Appearance':'Apparence','Tips':'Astuces',
    'RUN PLAN // PERSONAL':'PLAN DE RAID // PERSONNEL','MY NEXT RAID':'MON PROCHAIN RAID','No saved items yet':'Aucun objet enregistré','Save items from Total Needs or Search and build a compact checklist for your next raid.':'Enregistrez des objets depuis les besoins totaux ou la recherche pour préparer une liste compacte pour votre prochain raid.','items':'objets','done':'terminés','PERSONAL LIST':'LISTE PERSONNELLE','WORKSHOP':'ATELIER','QUEST':'QUÊTE','QUEST + WORKSHOP':'QUÊTE + ATELIER','AMOUNT':'QUANTITÉ','＋ NEXT RAID':'＋ PROCHAIN RAID','✓ SAVED':'✓ ENREGISTRÉ','Your raid checklist is still empty.':'Votre liste de raid est encore vide.','Remove item':'Retirer l’objet','REMOVE COMPLETED':'RETIRER LES TERMINÉS','CLEAR LIST':'VIDER LA LISTE','CLOSE RAID LIST':'FERMER LA LISTE DE RAID','Clear the entire raid checklist?':'Vider toute la liste de raid ?','RAID FINISHED':'RAID TERMINÉ','LOG FINDINGS':'SAISIR LES TROUVAILLES','Enter only relevant finds. This shows only items still missing for your currently active goals.':'Saisissez uniquement les trouvailles utiles. Seuls les objets encore manquants pour vos objectifs actifs sont affichés.','FOUND':'TROUVÉ','Decrease amount':'Diminuer la quantité','Increase amount':'Augmenter la quantité','APPLY FINDINGS':'APPLIQUER LES TROUVAILLES','NO RELEVANT FINDS':'AUCUNE TROUVAILLE UTILE','CANCEL':'ANNULER','No items are currently missing for your active goals.':'Aucun objet ne manque actuellement pour vos objectifs actifs.','No found amount entered yet.':'Aucune quantité trouvée n’a encore été saisie.','1 finding applied.':'1 trouvaille appliquée.','No findings entered. Your requirements stay unchanged.':'Aucune trouvaille saisie. Vos besoins restent inchangés.','Saving on this device failed.':'Échec de l’enregistrement sur cet appareil.','Findings were saved, but the raid checklist could not be updated.':'Les trouvailles ont été enregistrées, mais la liste de raid n’a pas pu être mise à jour.','Any surplus is kept as owned stock.':'Tout surplus est conservé dans votre stock.',
    'LIVE EVENTS':'ÉVÉNEMENTS EN DIRECT','Loading official data …':'Chargement des données officielles …','Current and upcoming map conditions from the official Embark feed. Times use your device timezone.':'Conditions de carte actuelles et à venir provenant du flux officiel d’Embark. Les heures utilisent le fuseau horaire de votre appareil.','SERVER REGION':'RÉGION SERVEUR','REMINDER':'RAPPEL','ACTIVE NOW':'ACTIF MAINTENANT','UP NEXT':'À VENIR','Source: official Embark feed':'Source : flux officiel d’Embark','OFFICIAL OVERVIEW':'APERÇU OFFICIEL','CLOSE EVENTS':'FERMER LES ÉVÉNEMENTS','REMIND ME':'ME RAPPELER','SAVED':'ENREGISTRÉ','No map condition is active right now.':'Aucune condition de carte n’est active actuellement.','No upcoming events in the loaded data.':'Aucun événement à venir dans les données chargées.','for':'encore','in':'dans','Ends':'Fin','Starts':'Début','Live data could not be loaded right now. Please use the official overview.':'Impossible de charger les données en direct. Utilisez l’aperçu officiel.','The loaded schedule may be outdated. Please compare it with the official overview.':'Le programme chargé est peut-être obsolète. Comparez-le avec l’aperçu officiel.','Reminder saved. The calendar file can notify you even when the app is closed.':'Rappel enregistré. Le fichier calendrier peut vous prévenir même lorsque l’app est fermée.','An additional alert will appear while the tool remains open.':'Une alerte supplémentaire apparaîtra tant que l’outil reste ouvert.','Calendar reminder created. Browser alerts are only reliable while the tool remains open.':'Rappel calendrier créé. Les alertes du navigateur ne sont fiables que lorsque l’outil reste ouvert.','EUROPE':'EUROPE','NORTH AMERICA':'AMÉRIQUE DU NORD','BRAZIL':'BRÉSIL','EAST ASIA':'ASIE DE L’EST','OCEANIA':'OCÉANIE',
    'BLUEPRINTS':'PLANS','LEARNED':'APPRIS','MISSING':'MANQUANT','Blueprint':'Plan','learned':'appris','Progress is saved on this device':'La progression est enregistrée sur cet appareil','Blueprint data could not be loaded.':'Impossible de charger les données des plans.','Mark the blueprints you have already learned so you can immediately see which ones are still missing.':'Marquez les plans déjà appris pour voir immédiatement ceux qui vous manquent.','Search blueprints …':'Rechercher un plan …','COMMUNITY BETA // Dataset is still being cross-checked before release.':'BÊTA COMMUNAUTAIRE // Les données sont encore vérifiées avant publication.','INFO / LOCATION':'INFO / EMPLACEMENT','Map':'Carte','Condition':'Condition','Container':'Conteneur','Trials':'Épreuves','Scavengable':'Récupérable','Not confirmed':'Non confirmé','Yes':'Oui','No':'Non','COMMUNITY DATA':'DONNÉES COMMUNAUTAIRES','CONFIRMED':'CONFIRMÉ','Trial rewards can be random; this blueprint is not guaranteed.':'Les récompenses des épreuves peuvent être aléatoires ; ce plan n’est pas garanti.','Location data from community sources is not a guaranteed spawn.':'Les emplacements issus de la communauté ne garantissent pas l’apparition.','CONFIRMED is reserved for independently corroborated individual fields; all other non-empty values remain community data.':'CONFIRMÉ est réservé aux informations vérifiées indépendamment ; les autres valeurs restent des données communautaires.',
    'DATA & BACKUP':'DONNÉES & SAUVEGARDE','Save or restore your progress':'Sauvegarder ou restaurer votre progression','Save your progress as a file on your device. Existing app data is replaced only after a confirmation prompt.':'Enregistrez votre progression dans un fichier sur votre appareil. Les données existantes ne sont remplacées qu’après confirmation.','CREATE BACKUP':'CRÉER UNE SAUVEGARDE','IMPORT BACKUP':'IMPORTER UNE SAUVEGARDE','No cloud · no account · nothing is sent to us':'Aucun cloud · aucun compte · aucune donnée ne nous est envoyée','CLOSE BACKUP':'FERMER LA SAUVEGARDE','Backup was saved on your device.':'La sauvegarde a été enregistrée sur votre appareil.','No app data was found yet. The backup contains the current default settings.':'Aucune donnée d’app n’a encore été trouvée. La sauvegarde contient les réglages actuels par défaut.','Choose a valid backup file.':'Choisissez un fichier de sauvegarde valide.','The file is too large and was not opened.':'Le fichier est trop volumineux et n’a pas été ouvert.','This file is not a valid Ramas Field Tool backup.':'Ce fichier n’est pas une sauvegarde valide de Ramas Field Tool.','This backup version is not supported yet.':'Cette version de sauvegarde n’est pas encore prise en charge.','This backup will replace your currently saved app data. Continue?':'Cette sauvegarde remplacera les données actuellement enregistrées. Continuer ?','Backup imported successfully. Reloading the app …':'Sauvegarde importée avec succès. Rechargement de l’app …','The backup could not be imported.':'Impossible d’importer la sauvegarde.',
    'Select map':'Choisir une carte','MAP LAYERS':'COUCHES DE CARTE','RAIDER SPAWNS':'SPAWNS DE RAIDERS','WEAPON CASES':'CAISSES D’ARMES','No layer active':'Aucune couche active','USE MAP':'UTILISER LA CARTE','Zoom up to 3× and drag the map in the expanded view':'Zoomez jusqu’à 3× et déplacez la carte dans la vue agrandie','OPEN LARGE MAP':'OUVRIR LA GRANDE CARTE','MAP // LARGE VIEW':'CARTE // GRANDE VUE','Map ready':'Carte prête','Enable a map layer to show information.':'Activez une couche pour afficher des informations.','DATA & SOURCES':'DONNÉES & SOURCES','Map base: Community map':'Fond de carte : carte communautaire',
    'TIPS & TRICKS':'ASTUCES & CONSEILS','Knowledge for better runs':'Des connaissances pour de meilleurs raids','Choose a category. Only one category stays open at a time.':'Choisissez une catégorie. Une seule catégorie reste ouverte à la fois.','CLOSE TIPS':'FERMER LES ASTUCES','TIPS':'ASTUCES','START & MOVEMENT':'DÉPART & DÉPLACEMENT','LOOT & PROGRESSION':'BUTIN & PROGRESSION','SURVIVAL & EXTRACTION':'SURVIE & EXTRACTION','RAIDERS & COOPERATION':'RAIDERS & COOPÉRATION',
    'Community':'Communauté','GROUP ON FACEBOOK':'GROUPE SUR FACEBOOK','THE FIRST TESTERS':'LES PREMIERS TESTEURS'
  };

  const ES={
    'ACTIVE GOALS':'OBJETIVOS ACTIVOS','CHANGE':'CAMBIAR','Activate every station/level you are currently working toward.':'Activa todas las estaciones y niveles hacia los que estás progresando.','Total requirements':'Necesidades totales','SEARCH ITEM':'BUSCAR OBJETO','Level':'Nivel','No upgrade goal or active quest with item requirements.':'No hay ningún objetivo de mejora ni misión activa con objetos necesarios.','Total':'Total','owned':'en posesión','missing':'faltan','Value':'Valor','Weight':'Peso','Stack':'Pila','Description':'Descripción','Recycling':'Reciclaje','No recycling data':'Sin datos de reciclaje','Enter a search term':'Introduce un término de búsqueda','items loaded':'objetos cargados','matches':'resultados','No results.':'Sin resultados.','FREE – not currently needed for your active goals':'LIBRE – no se necesita ahora para tus objetivos activos','GOAL MET – you have enough':'OBJETIVO CUMPLIDO – tienes suficiente','KEEP – you still need':'GUARDAR – todavía te faltan','Full catalog unavailable – local base dataset active.':'Catálogo completo no disponible – datos locales básicos activos.','QUESTS':'MISIONES','Open quest tracker':'Abrir seguimiento de misiones','SHOW':'MOSTRAR','CLOSE':'CERRAR','Search quests …':'Buscar misiones …','ALL':'TODAS','OPEN':'ABIERTA','ACTIVE':'ACTIVA','DONE':'COMPLETADA','Loading quests …':'Cargando misiones …','Quest data could not be loaded.':'No se pudieron cargar los datos de las misiones.','quests loaded':'misiones cargadas','shown':'mostradas','Objectives':'Objetivos','Required items':'Objetos necesarios','Rewards':'Recompensas','Granted':'Entregado','Quest giver':'Encargado','No item requirements':'No se necesitan objetos','No item rewards':'Sin recompensas de objetos','Quest':'Misión','active':'activas',
    'DATA // LOADING…':'DATOS // CARGANDO…','DATA // LIVE':'DATOS // ACTUALIZADOS','DATA // BASE DATA':'DATOS // BASE LOCAL','DATA // PARTIAL':'DATOS // PARCIALES','DATA // ERROR':'DATOS // ERROR','Current data is loading':'Cargando datos actuales','Current data loaded':'Datos actuales cargados','Local base dataset active':'Datos locales básicos activos','Data is only partially available':'Los datos solo están disponibles parcialmente','Data could not be loaded':'No se pudieron cargar los datos','The full live catalog is currently unavailable. Search and goals continue with the local base dataset, which may be less complete or current.':'El catálogo completo no está disponible. La búsqueda y los objetivos continúan con los datos locales básicos, que pueden ser menos completos o actuales.','The external catalog loaded only partially. Missing entries were supplemented with local base data where possible.':'El catálogo externo se cargó solo parcialmente. Las entradas que faltan se completaron con datos locales cuando fue posible.',
    'Requirements':'Necesidades','Show needs and inventory':'Mostrar necesidades e inventario','CLOSE REQUIREMENTS':'CERRAR NECESIDADES','ITEM SEARCH':'BÚSQUEDA DE OBJETOS','Item or material':'Objeto o material','ITEM OR MATERIAL':'OBJETO O MATERIAL','CLOSE ITEM SEARCH':'CERRAR BÚSQUEDA','INFO':'INFO','BACKUP':'COPIA DE SEGURIDAD','Help':'Ayuda','Appearance':'Apariencia','Tips':'Consejos',
    'RUN PLAN // PERSONAL':'PLAN DE INCURSIÓN // PERSONAL','MY NEXT RAID':'MI PRÓXIMA INCURSIÓN','No saved items yet':'Aún no hay objetos guardados','Save items from Total Needs or Search and build a compact checklist for your next raid.':'Guarda objetos desde necesidades totales o búsqueda y prepara una lista compacta para tu próxima incursión.','items':'objetos','done':'completados','PERSONAL LIST':'LISTA PERSONAL','WORKSHOP':'TALLER','QUEST':'MISIÓN','QUEST + WORKSHOP':'MISIÓN + TALLER','AMOUNT':'CANTIDAD','＋ NEXT RAID':'＋ PRÓXIMA INCURSIÓN','✓ SAVED':'✓ GUARDADO','Your raid checklist is still empty.':'Tu lista de incursión todavía está vacía.','Remove item':'Eliminar objeto','REMOVE COMPLETED':'ELIMINAR COMPLETADOS','CLEAR LIST':'VACIAR LISTA','CLOSE RAID LIST':'CERRAR LISTA DE INCURSIÓN','Clear the entire raid checklist?':'¿Vaciar toda la lista de incursión?','RAID FINISHED':'INCURSIÓN TERMINADA','LOG FINDINGS':'REGISTRAR HALLAZGOS','Enter only relevant finds. This shows only items still missing for your currently active goals.':'Introduce solo hallazgos relevantes. Se muestran únicamente los objetos que aún faltan para tus objetivos activos.','FOUND':'ENCONTRADO','Decrease amount':'Reducir cantidad','Increase amount':'Aumentar cantidad','APPLY FINDINGS':'APLICAR HALLAZGOS','NO RELEVANT FINDS':'NINGÚN HALLAZGO RELEVANTE','CANCEL':'CANCELAR','No items are currently missing for your active goals.':'Ahora mismo no falta ningún objeto para tus objetivos activos.','No found amount entered yet.':'Todavía no se ha indicado ninguna cantidad encontrada.','1 finding applied.':'1 hallazgo aplicado.','No findings entered. Your requirements stay unchanged.':'No se registraron hallazgos. Tus necesidades no cambian.','Saving on this device failed.':'No se pudo guardar en este dispositivo.','Findings were saved, but the raid checklist could not be updated.':'Los hallazgos se guardaron, pero no se pudo actualizar la lista de incursión.','Any surplus is kept as owned stock.':'Cualquier excedente se conserva en tu inventario.',
    'LIVE EVENTS':'EVENTOS EN DIRECTO','Loading official data …':'Cargando datos oficiales …','Current and upcoming map conditions from the official Embark feed. Times use your device timezone.':'Condiciones actuales y próximas del mapa procedentes del feed oficial de Embark. Las horas usan la zona horaria de tu dispositivo.','SERVER REGION':'REGIÓN DEL SERVIDOR','REMINDER':'RECORDATORIO','ACTIVE NOW':'ACTIVO AHORA','UP NEXT':'A CONTINUACIÓN','Source: official Embark feed':'Fuente: feed oficial de Embark','OFFICIAL OVERVIEW':'VISTA OFICIAL','CLOSE EVENTS':'CERRAR EVENTOS','REMIND ME':'RECORDARME','SAVED':'GUARDADO','No map condition is active right now.':'No hay ninguna condición de mapa activa ahora mismo.','No upcoming events in the loaded data.':'No hay eventos próximos en los datos cargados.','for':'durante','in':'en','Ends':'Termina','Starts':'Empieza','Live data could not be loaded right now. Please use the official overview.':'No se pudieron cargar los datos en directo. Usa la vista oficial.','The loaded schedule may be outdated. Please compare it with the official overview.':'El horario cargado puede estar desactualizado. Compáralo con la vista oficial.','Reminder saved. The calendar file can notify you even when the app is closed.':'Recordatorio guardado. El archivo de calendario puede avisarte incluso con la app cerrada.','An additional alert will appear while the tool remains open.':'Aparecerá una alerta adicional mientras la herramienta siga abierta.','Calendar reminder created. Browser alerts are only reliable while the tool remains open.':'Recordatorio de calendario creado. Las alertas del navegador solo son fiables mientras la herramienta esté abierta.','EUROPE':'EUROPA','NORTH AMERICA':'NORTEAMÉRICA','BRAZIL':'BRASIL','EAST ASIA':'ASIA ORIENTAL','OCEANIA':'OCEANÍA',
    'BLUEPRINTS':'PLANOS','LEARNED':'APRENDIDOS','MISSING':'FALTAN','Blueprint':'Plano','learned':'aprendidos','Progress is saved on this device':'El progreso se guarda en este dispositivo','Blueprint data could not be loaded.':'No se pudieron cargar los datos de los planos.','Mark the blueprints you have already learned so you can immediately see which ones are still missing.':'Marca los planos que ya has aprendido para ver inmediatamente cuáles te faltan.','Search blueprints …':'Buscar planos …','COMMUNITY BETA // Dataset is still being cross-checked before release.':'BETA DE LA COMUNIDAD // Los datos se siguen verificando antes del lanzamiento.','INFO / LOCATION':'INFO / UBICACIÓN','Map':'Mapa','Condition':'Condición','Container':'Contenedor','Trials':'Pruebas','Scavengable':'Saqueable','Not confirmed':'No confirmado','Yes':'Sí','No':'No','COMMUNITY DATA':'DATOS DE LA COMUNIDAD','CONFIRMED':'CONFIRMADO','Trial rewards can be random; this blueprint is not guaranteed.':'Las recompensas de las pruebas pueden ser aleatorias; este plano no está garantizado.','Location data from community sources is not a guaranteed spawn.':'Las ubicaciones de fuentes comunitarias no garantizan una aparición.','CONFIRMED is reserved for independently corroborated individual fields; all other non-empty values remain community data.':'CONFIRMADO se reserva para datos individuales corroborados de forma independiente; el resto sigue siendo información de la comunidad.',
    'DATA & BACKUP':'DATOS Y COPIA DE SEGURIDAD','Save or restore your progress':'Guardar o restaurar tu progreso','Save your progress as a file on your device. Existing app data is replaced only after a confirmation prompt.':'Guarda tu progreso como archivo en tu dispositivo. Los datos existentes solo se sustituyen después de una confirmación.','CREATE BACKUP':'CREAR COPIA','IMPORT BACKUP':'IMPORTAR COPIA','No cloud · no account · nothing is sent to us':'Sin nube · sin cuenta · no se nos envía nada','CLOSE BACKUP':'CERRAR COPIA','Backup was saved on your device.':'La copia se guardó en tu dispositivo.','No app data was found yet. The backup contains the current default settings.':'Aún no se encontraron datos de la app. La copia contiene la configuración predeterminada actual.','Choose a valid backup file.':'Elige un archivo de copia válido.','The file is too large and was not opened.':'El archivo es demasiado grande y no se abrió.','This file is not a valid Ramas Field Tool backup.':'Este archivo no es una copia válida de Ramas Field Tool.','This backup version is not supported yet.':'Esta versión de copia todavía no es compatible.','This backup will replace your currently saved app data. Continue?':'Esta copia sustituirá los datos guardados actualmente. ¿Continuar?','Backup imported successfully. Reloading the app …':'Copia importada correctamente. Recargando la app …','The backup could not be imported.':'No se pudo importar la copia.',
    'Select map':'Elegir mapa','MAP LAYERS':'CAPAS DEL MAPA','RAIDER SPAWNS':'APARICIONES DE RAIDERS','WEAPON CASES':'CAJAS DE ARMAS','No layer active':'Ninguna capa activa','USE MAP':'USAR MAPA','Zoom up to 3× and drag the map in the expanded view':'Amplía hasta 3× y desplaza el mapa en la vista grande','OPEN LARGE MAP':'ABRIR MAPA GRANDE','MAP // LARGE VIEW':'MAPA // VISTA GRANDE','Map ready':'Mapa listo','Enable a map layer to show information.':'Activa una capa del mapa para mostrar información.','DATA & SOURCES':'DATOS Y FUENTES','Map base: Community map':'Base del mapa: mapa de la comunidad',
    'TIPS & TRICKS':'CONSEJOS Y TRUCOS','Knowledge for better runs':'Conocimientos para mejores incursiones','Choose a category. Only one category stays open at a time.':'Elige una categoría. Solo una categoría permanece abierta a la vez.','CLOSE TIPS':'CERRAR CONSEJOS','TIPS':'CONSEJOS','START & MOVEMENT':'INICIO Y MOVIMIENTO','LOOT & PROGRESSION':'BOTÍN Y PROGRESO','SURVIVAL & EXTRACTION':'SUPERVIVENCIA Y EXTRACCIÓN','RAIDERS & COOPERATION':'RAIDERS Y COOPERACIÓN',
    'Community':'Comunidad','GROUP ON FACEBOOK':'GRUPO EN FACEBOOK','THE FIRST TESTERS':'LOS PRIMEROS TESTERS'
  };

  const RARITY={fr:{Common:'Commun',Uncommon:'Peu commun',Rare:'Rare',Epic:'Épique',Legendary:'Légendaire'},es:{Common:'Común',Uncommon:'Poco común',Rare:'Raro',Epic:'Épico',Legendary:'Legendario'}};
  const TYPES={
    fr:{'Basic Material':'Matériau de base','Topside Material':'Matériau de surface','Refined Material':'Matériau raffiné','Recyclable':'Recyclable','Quick Use':'Utilisation rapide','Modification':'Modification','Blueprint':'Plan','Assault Rifle':'Fusil d’assaut','Battle Rifle':'Fusil de combat','Hand Cannon':'Canon à main','Pistol':'Pistolet','SMG':'PM','Shotgun':'Fusil à pompe','LMG':'Mitrailleuse légère','Sniper Rifle':'Fusil de précision','Ammunition':'Munitions','Trinket':'Objet de valeur','Key':'Clé','Augment':'Augmentation','Shield':'Bouclier','Nature':'Nature','Misc':'Divers','Miscellaneous':'Divers','Special':'Spécial'},
    es:{'Basic Material':'Material básico','Topside Material':'Material de superficie','Refined Material':'Material refinado','Recyclable':'Reciclable','Quick Use':'Uso rápido','Modification':'Modificación','Blueprint':'Plano','Assault Rifle':'Rifle de asalto','Battle Rifle':'Rifle de combate','Hand Cannon':'Cañón de mano','Pistol':'Pistola','SMG':'Subfusil','Shotgun':'Escopeta','LMG':'Ametralladora ligera','Sniper Rifle':'Rifle de francotirador','Ammunition':'Munición','Trinket':'Objeto de valor','Key':'Llave','Augment':'Aumento','Shield':'Escudo','Nature':'Naturaleza','Misc':'Varios','Miscellaneous':'Varios','Special':'Especial'}
  };

  let currentUi='en';
  let observer=null;
  let syncing=false;
  let scheduled=false;

  function safeGet(key){try{return localStorage.getItem(key)}catch{return null}}
  function safeSet(key,value){try{localStorage.setItem(key,value)}catch{}}
  function selectedLanguage(){
    const saved=safeGet(UI_KEY)||safeGet('arcLang')||'en';
    return SUPPORTED.includes(saved)?saved:'en';
  }
  function dictionary(){return currentUi==='fr'?FR:currentUi==='es'?ES:null}
  function translateExact(value){
    const dict=dictionary();
    if(!dict||typeof value!=='string')return value;
    const trimmed=value.trim();
    if(!trimmed)return value;
    if(Object.prototype.hasOwnProperty.call(dict,trimmed)){
      const translated=dict[trimmed];
      const start=value.match(/^\s*/)?.[0]||'';
      const end=value.match(/\s*$/)?.[0]||'';
      return `${start}${translated}${end}`;
    }
    let match=trimmed.match(/^(\d+) items · (\d+) done$/);
    if(match)return currentUi==='fr'?`${match[1]} objets · ${match[2]} terminés`:`${match[1]} objetos · ${match[2]} completados`;
    match=trimmed.match(/^(\d+) blueprints loaded · (\d+) learned · (\d+) missing$/i);
    if(match)return currentUi==='fr'?`${match[1]} plans chargés · ${match[2]} appris · ${match[3]} manquants`:`${match[1]} planos cargados · ${match[2]} aprendidos · ${match[3]} faltan`;
    match=trimmed.match(/^(\d+) \/ (\d+) learned · (\d+) missing$/i);
    if(match)return currentUi==='fr'?`${match[1]} / ${match[2]} appris · ${match[3]} manquants`:`${match[1]} / ${match[2]} aprendidos · ${match[3]} faltan`;
    match=trimmed.match(/^(\d+) shown · Progress is saved on this device$/i);
    if(match)return currentUi==='fr'?`${match[1]} affichés · progression enregistrée sur cet appareil`:`${match[1]} mostrados · progreso guardado en este dispositivo`;
    match=trimmed.match(/^(\d+) active(?: · next in (.+))?$/i);
    if(match)return currentUi==='fr'?`${match[1]} actif${match[2]?` · prochain dans ${match[2]}`:''}`:`${match[1]} activo${match[2]?` · siguiente en ${match[2]}`:''}`;
    match=trimmed.match(/^Next event in (.+)$/i);
    if(match)return currentUi==='fr'?`Prochain événement dans ${match[1]}`:`Siguiente evento en ${match[1]}`;
    return value;
  }

  function translateTree(root){
    if(!dictionary()||!root)return;
    if(root.nodeType===Node.TEXT_NODE){
      const next=translateExact(root.nodeValue||'');
      if(next!==root.nodeValue)root.nodeValue=next;
      return;
    }
    if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return;
    if(root.nodeType===Node.ELEMENT_NODE&&root.matches('script,style,textarea,input,option'))return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const parent=node.parentElement;
      if(!parent||parent.matches('script,style,textarea,input,option'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[];let node;
    while((node=walker.nextNode()))nodes.push(node);
    nodes.forEach(textNode=>{
      const next=translateExact(textNode.nodeValue||'');
      if(next!==textNode.nodeValue)textNode.nodeValue=next;
    });
  }

  function setText(selector,value){const node=document.querySelector(selector);if(node&&node.textContent!==value)node.textContent=value}
  function setPlaceholder(selector,value){const node=document.querySelector(selector);if(node&&node.placeholder!==value)node.placeholder=value}

  function syncLauncher(){
    const c=COPY[currentUi]||COPY.en;
    setText('#launcherHeading',c.heading);
    setText('#launcherSubtitle',c.subtitle);
    setText('#appBack',c.back);
    const home=document.getElementById('appLauncher');
    if(home){
      Object.entries(c.tiles).forEach(([target,label])=>{
        const tile=home.querySelector(`[data-app-target="${target}"]`);
        if(!tile)return;
        const title=tile.querySelector('b');
        const small=tile.querySelector('small');
        if(title)title.textContent=label;
        if(small)small.textContent=target==='spawnPanel'?c.places:c.open;
      });
      Object.entries(c.utilities).forEach(([target,label])=>{
        const button=home.querySelector(`.launcher-utilities [data-app-target="${target}"]`);
        if(button)button.textContent=label;
      });
      home.setAttribute('aria-label',currentUi==='fr'?'Accueil de l’application':currentUi==='es'?'Inicio de la aplicación':currentUi==='de'?'App-Startseite':'App home');
    }
  }

  function syncKnownControls(){
    if(currentUi==='fr'){
      setText('#supplyDrawerSummary','Afficher les besoins et le stock');setText('#supplyDrawerAction','OUVRIR');setText('#supplyDrawerClose','FERMER LES BESOINS');
      setText('#itemsDrawerTitle','RECHERCHE D’OBJETS');setText('#itemsDrawerSummary','Rechercher un objet ou un matériau');setText('#itemsDrawerAction','OUVRIR');setText('#itemsSearchLabel','OBJET OU MATÉRIAU');setText('#itemsDrawerClose','FERMER LA RECHERCHE');
      setText('#spawnMapSelectLabel','Choisir une carte');setText('#mapLayersLabel','COUCHES DE CARTE');setText('#layerRaidersLabel','SPAWNS DE RAIDERS');setText('#layerWeaponCasesLabel','CAISSES D’ARMES');setText('#spawnGestureTitle','UTILISER LA CARTE');setText('#spawnGestureHint','Zoomez jusqu’à 3× et déplacez la carte dans la vue agrandie');setText('#spawnExpand span','OUVRIR LA GRANDE CARTE');setText('#spawnExpandedTitle','CARTE // GRANDE VUE');setText('#spawnCloseExpanded','FERMER ×');setText('#spawnPendingTitle','Carte prête');setText('#spawnPendingBody','Activez une couche pour afficher des informations.');setText('#spawnDataDetailsLabel','DONNÉES & SOURCES');
      setText('#communityCreditKicker','COMMUNAUTÉ // MERCI');setText('#firstTestersLabel','LES PREMIERS TESTEURS');setText('#communityCreditLink','GROUPE SUR FACEBOOK');
    }else if(currentUi==='es'){
      setText('#supplyDrawerSummary','Mostrar necesidades e inventario');setText('#supplyDrawerAction','ABRIR');setText('#supplyDrawerClose','CERRAR NECESIDADES');
      setText('#itemsDrawerTitle','BÚSQUEDA DE OBJETOS');setText('#itemsDrawerSummary','Buscar objeto o material');setText('#itemsDrawerAction','ABRIR');setText('#itemsSearchLabel','OBJETO O MATERIAL');setText('#itemsDrawerClose','CERRAR BÚSQUEDA');
      setText('#spawnMapSelectLabel','Elegir mapa');setText('#mapLayersLabel','CAPAS DEL MAPA');setText('#layerRaidersLabel','APARICIONES DE RAIDERS');setText('#layerWeaponCasesLabel','CAJAS DE ARMAS');setText('#spawnGestureTitle','USAR MAPA');setText('#spawnGestureHint','Amplía hasta 3× y desplaza el mapa en la vista grande');setText('#spawnExpand span','ABRIR MAPA GRANDE');setText('#spawnExpandedTitle','MAPA // VISTA GRANDE');setText('#spawnCloseExpanded','CERRAR ×');setText('#spawnPendingTitle','Mapa listo');setText('#spawnPendingBody','Activa una capa del mapa para mostrar información.');setText('#spawnDataDetailsLabel','DATOS Y FUENTES');
      setText('#communityCreditKicker','COMUNIDAD // GRACIAS');setText('#firstTestersLabel','LOS PRIMEROS TESTERS');setText('#communityCreditLink','GRUPO EN FACEBOOK');
    }
  }

  function syncSelectOptions(){
    const regions=document.getElementById('liveEventsRegion');
    if(regions&&['fr','es'].includes(currentUi)){
      const names=currentUi==='fr'?{europe:'Europe','north-america':'Amérique du Nord',brazil:'Brésil','east-asia':'Asie de l’Est',oceania:'Océanie'}:{europe:'Europa','north-america':'Norteamérica',brazil:'Brasil','east-asia':'Asia oriental',oceania:'Oceanía'};
      [...regions.options].forEach(option=>{if(names[option.value])option.textContent=names[option.value]});
    }
    const leads=document.getElementById('liveEventsLead');
    if(leads&&['fr','es'].includes(currentUi)){
      [...leads.options].forEach(option=>{option.textContent=currentUi==='fr'?`${option.value} min avant`:`${option.value} min antes`});
    }
  }

  function syncLanguageControl(){
    const button=document.getElementById('arcLanguageButton');
    if(!button)return;
    const c=COPY[currentUi]||COPY.en;
    button.innerHTML=`<span aria-hidden="true">🌐</span> ${SHORT[currentUi]}`;
    button.setAttribute('aria-label',c.openMenu);
    button.title=c.openMenu;
    document.querySelectorAll('#arcLanguageMenu [data-arc-language]').forEach(node=>{
      const selected=node.dataset.arcLanguage===currentUi;
      node.classList.toggle('is-selected',selected);
      node.setAttribute('aria-checked',String(selected));
    });
  }

  function syncAll(){
    if(syncing)return;
    syncing=true;
    try{
      syncLauncher();syncKnownControls();syncSelectOptions();syncLanguageControl();translateTree(document.body);
      const htmlLang=currentUi==='fr'?'fr':currentUi==='es'?'es':currentUi;
      if(document.documentElement.lang!==htmlLang)document.documentElement.lang=htmlLang;
      document.documentElement.dataset.uiLanguage=currentUi;
    }finally{syncing=false}
  }

  function scheduleSync(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;syncAll()});
  }

  function setEngineLanguage(uiLanguage){
    const engineLanguage=uiLanguage==='de'?'de':'en';
    try{
      if(typeof lang!=='undefined')lang=engineLanguage;
      if(typeof applyLanguage==='function')applyLanguage();
      else safeSet('arcLang',engineLanguage);
    }catch{safeSet('arcLang',engineLanguage)}
    const oldDe=document.getElementById('deBtn');
    const oldEn=document.getElementById('enBtn');
    oldDe?.classList.toggle('active',engineLanguage==='de');
    oldEn?.classList.toggle('active',engineLanguage==='en');
  }

  function setLanguage(next,{closePrompt=true}={}){
    if(!SUPPORTED.includes(next))return;
    currentUi=next;
    safeSet(UI_KEY,next);
    safeSet(FIRST_RUN_KEY,'0');
    setEngineLanguage(next);
    document.documentElement.lang=next;
    if(closePrompt)document.getElementById('arcLanguageFirstRun')?.remove();
    document.getElementById('arcLanguageMenu')?.setAttribute('hidden','');
    scheduleSync();setTimeout(scheduleSync,40);setTimeout(scheduleSync,180);
    window.dispatchEvent(new CustomEvent('arc-language-change',{detail:{language:next}}));
  }

  function installStyle(){
    if(document.getElementById('arcI18nStyle'))return;
    const style=document.createElement('style');style.id='arcI18nStyle';style.textContent=`
      .lang-switch.arc-language-upgraded{position:relative;display:flex!important;align-items:center!important;padding:3px!important;overflow:visible!important}
      .lang-switch.arc-language-upgraded>#deBtn,.lang-switch.arc-language-upgraded>#enBtn,.lang-switch.arc-language-upgraded>span{display:none!important}
      #arcLanguageButton{min-height:38px;min-width:72px;padding:7px 10px;border:0;border-radius:9px;background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer}
      #arcLanguageButton:hover,#arcLanguageButton[aria-expanded="true"]{background:color-mix(in srgb,var(--orange) 14%,transparent)}
      #arcLanguageMenu{position:absolute;z-index:3000;right:0;top:calc(100% + 8px);min-width:190px;padding:7px;border:1px solid var(--ui-line,#394554);border-radius:14px;background:var(--ui-panel,#1b222c);box-shadow:0 14px 38px #0008}
      #arcLanguageMenu[hidden]{display:none!important}
      #arcLanguageMenu button{display:flex;width:100%;justify-content:space-between;align-items:center;min-height:44px;padding:9px 11px;border:0;border-radius:9px;background:transparent;color:var(--ui-text,#f4f7fc);font:inherit;text-align:left;cursor:pointer}
      #arcLanguageMenu button:hover,#arcLanguageMenu button.is-selected{background:color-mix(in srgb,var(--orange) 16%,var(--ui-soft,#252e3b))}
      #arcLanguageMenu button.is-selected::after{content:'✓';font-weight:800}
      #arcLanguageFirstRun{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:#0c1119dc;backdrop-filter:blur(7px)}
      .arc-language-first-card{width:min(460px,100%);border:1px solid #ffffff20;border-radius:22px;background:#1b222c;color:#f5f8fc;padding:24px;box-shadow:0 24px 70px #000a}
      .arc-language-first-card h2{margin:0 0 8px;font:700 24px/1.2 "Space Grotesk",system-ui,sans-serif;letter-spacing:-.3px}
      .arc-language-first-card p{margin:0 0 20px;color:#bdc8d6;line-height:1.5}
      .arc-language-first-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .arc-language-first-grid button{min-height:54px;padding:10px 12px;border:1px solid #ffffff18;border-radius:13px;background:#252f3c;color:#f5f8fc;font:650 15px system-ui;cursor:pointer}
      .arc-language-first-grid button:hover,.arc-language-first-grid button:focus-visible{border-color:#ff986a;background:#303c4b;outline:none}
      @media(max-width:420px){.arc-language-first-card{padding:20px}.arc-language-first-grid{grid-template-columns:1fr}}
    `;document.head.append(style);
  }

  function installLanguageControl(){
    const host=document.querySelector('.lang-switch');
    if(!host||document.getElementById('arcLanguageButton'))return;
    host.classList.add('arc-language-upgraded');
    host.setAttribute('aria-label',(COPY[currentUi]||COPY.en).language);
    const button=document.createElement('button');button.id='arcLanguageButton';button.type='button';button.className='lang';button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');
    const menu=document.createElement('div');menu.id='arcLanguageMenu';menu.hidden=true;menu.setAttribute('role','menu');
    SUPPORTED.forEach(code=>{const option=document.createElement('button');option.type='button';option.dataset.arcLanguage=code;option.setAttribute('role','menuitemradio');option.textContent=NAMES[code];option.addEventListener('click',()=>setLanguage(code));menu.append(option)});
    button.addEventListener('click',event=>{event.stopPropagation();const opening=menu.hidden;menu.hidden=!opening;button.setAttribute('aria-expanded',String(opening));if(opening)menu.querySelector(`[data-arc-language="${currentUi}"]`)?.focus()});
    document.addEventListener('click',event=>{if(!host.contains(event.target)){menu.hidden=true;button.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.hidden=true;button.setAttribute('aria-expanded','false');button.focus({preventScroll:true})}});
    host.append(button,menu);syncLanguageControl();
  }

  function showFirstRunChooser(){
    if(document.getElementById('arcLanguageFirstRun'))return;
    const force=new URLSearchParams(location.search).get('firstlang')==='1';
    if(!force&&safeGet(FIRST_RUN_KEY)!=='1')return;
    const layer=document.createElement('div');layer.id='arcLanguageFirstRun';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','arcLanguageFirstTitle');
    layer.innerHTML=`<div class="arc-language-first-card"><h2 id="arcLanguageFirstTitle">Choose your language</h2><p>You can change this later with the 🌐 language button.</p><div class="arc-language-first-grid"></div></div>`;
    const grid=layer.querySelector('.arc-language-first-grid');
    SUPPORTED.forEach(code=>{const button=document.createElement('button');button.type='button';button.dataset.firstLanguage=code;button.textContent=NAMES[code];button.addEventListener('click',()=>setLanguage(code));grid.append(button)});
    document.body.append(layer);grid.querySelector('[data-first-language="en"]')?.focus();
  }

  function patchFormatting(){
    try{
      if(typeof formatNum==='function'&&!window.__arcI18nFormatPatched){
        const base=formatNum;
        formatNum=function(value){
          if(!['fr','es'].includes(currentUi))return base(value);
          if(value===null||value===undefined||value==='')return '—';
          return new Intl.NumberFormat(LOCALES[currentUi],{maximumFractionDigits:2}).format(value);
        };
        window.__arcI18nFormatPatched=true;
      }
      if(typeof rarityName==='function'&&!window.__arcI18nRarityPatched){
        const base=rarityName;
        rarityName=function(value){return RARITY[currentUi]?.[value]||base(value)};
        window.__arcI18nRarityPatched=true;
      }
      if(typeof typeName==='function'&&!window.__arcI18nTypePatched){
        const base=typeName;
        typeName=function(value){return TYPES[currentUi]?.[value]||base(value)};
        window.__arcI18nTypePatched=true;
      }
    }catch{}
  }

  function startObserver(){
    if(observer)return;
    observer=new MutationObserver(mutations=>{
      if(syncing||!['fr','es'].includes(currentUi))return;
      let relevant=false;
      for(const mutation of mutations){
        if(mutation.type==='characterData'||mutation.addedNodes.length){relevant=true;break}
      }
      if(relevant)scheduleSync();
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  function init(){
    currentUi=selectedLanguage();
    installStyle();installLanguageControl();patchFormatting();
    // French/Spanish intentionally use the mature English engine as a fallback;
    // the overlay translates UI chrome while game-sourced names remain English until source data adds those locales.
    setEngineLanguage(currentUi);
    document.documentElement.lang=currentUi;
    syncAll();startObserver();showFirstRunChooser();
    window.arcSetLanguage=setLanguage;
    window.arcCurrentLanguage=()=>currentUi;
  }

  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
