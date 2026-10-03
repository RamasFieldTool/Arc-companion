// V13.0.18 test — validated local backup export/import without a server.
(()=>{
  const panel=document.getElementById('backupPanel');
  const exportButton=document.getElementById('backupExport');
  const importButton=document.getElementById('backupImport');
  const fileInput=document.getElementById('backupFile');
  const closeButton=document.getElementById('backupClose');
  const status=document.getElementById('backupStatus');
  if(!panel||!exportButton||!importButton||!fileInput||!closeButton||!status)return;

  const SCHEMA='ramas-field-tool-backup';
  const FORMAT_VERSION=1;
  const MAX_FILE_SIZE=500000;
  const isRecord=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const blockedKeys=new Set(['__proto__','prototype','constructor']);
  const safeKeys=value=>isRecord(value)&&Object.keys(value).length<=5000&&Object.keys(value).every(key=>typeof key==='string'&&key.length<=180&&!blockedKeys.has(key));
  const finiteNumber=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=1000000000;
  const validRaidEntry=entry=>{
    if(!isRecord(entry)||Object.keys(entry).some(key=>!['target','done','personal','found'].includes(key)))return false;
    if(typeof entry.done!=='boolean'||!finiteNumber(entry.target)||(entry.done?entry.target<0:entry.target<1))return false;
    if(entry.personal!==undefined&&typeof entry.personal!=='boolean')return false;
    if(entry.found!==undefined&&!finiteNumber(entry.found))return false;
    if(entry.personal===true){
      if(entry.target<1)return false;
      if(entry.found!==undefined&&entry.found>entry.target)return false;
    }
    return true;
  };

  const RULES={
    arcUiLanguage:{type:'string',valid:value=>['de','en','fr','es','it'].includes(value)},
    arcPlanningMigrationV1:{type:'string',valid:value=>value==='1'},
    arcPlanningPersonal:{type:'json',valid:value=>safeKeys(value)&&Object.entries(value).every(([id,goal])=>isRecord(goal)&&Object.keys(goal).every(key=>['itemId','target','status','source'].includes(key))&&goal.itemId===id&&Number.isSafeInteger(goal.target)&&goal.target>0&&goal.target<=999999&&['active','paused','done'].includes(goal.status)&&(goal.source===undefined||goal.source==='legacy-raid'))},
    arcPlanningHistory:{type:'json',valid:value=>Array.isArray(value)&&value.length<=5000&&value.every(entry=>safeKeys(entry)&&Object.values(entry).every(v=>v===null||typeof v==='string'||typeof v==='boolean'||finiteNumber(v)))},
    arcLang:{type:'string',valid:value=>['de','en'].includes(value)},
    arcTheme:{type:'string',valid:value=>['dark','light'].includes(value)},
    arcPaletteSurface:{type:'string',valid:value=>['black','dark','light'].includes(value)},
    arcPaletteAccent:{type:'string',valid:value=>['orange','amber','green','cyan'].includes(value)},
    arcOwned:{type:'json',valid:value=>safeKeys(value)&&Object.values(value).every(finiteNumber)},
    arcActiveGoals:{type:'json',valid:value=>safeKeys(value)&&Object.values(value).every(entry=>entry===true)},
    arcQuestStatus:{type:'json',valid:value=>safeKeys(value)&&Object.values(value).every(entry=>['open','active','done'].includes(entry))},
    arc_blueprints_learned_v1:{type:'json',valid:value=>Array.isArray(value)&&value.length<=5000&&value.every(entry=>typeof entry==='string'&&entry.length<=180)},
    arcSpawnMap:{type:'string',valid:value=>typeof value==='string'&&/^[a-z0-9-]{1,80}$/i.test(value)},
    arcNextRaid:{type:'json',valid:value=>safeKeys(value)&&Object.values(value).every(validRaidEntry)},
    arcEventRegion:{type:'string',valid:value=>['europe','north-america','brazil','east-asia','oceania'].includes(value)},
    arcEventLead:{type:'string',valid:value=>['5','10','15','30'].includes(value)},
    arcEventReminders:{type:'json',valid:value=>Array.isArray(value)&&value.length<=100&&value.every(entry=>isRecord(entry)&&Object.keys(entry).every(key=>['key','start','end','name','map','lead','notified'].includes(key))&&typeof entry.key==='string'&&entry.key.length<=500&&typeof entry.start==='string'&&!Number.isNaN(Date.parse(entry.start))&&typeof entry.end==='string'&&!Number.isNaN(Date.parse(entry.end))&&typeof entry.name==='string'&&entry.name.length<=100&&typeof entry.map==='string'&&entry.map.length<=100&&[5,10,15,30].includes(Number(entry.lead))&&typeof entry.notified==='boolean')}
  };

  const COPY={
    de:{
      kicker:'SYSTEM // LOKAL',title:'DATEN & BACKUP',summary:'Fortschritt sichern oder wiederherstellen',
      intro:'Speichere deinen Fortschritt als Datei auf deinem Gerät. Beim Import werden vorhandene App-Daten erst nach einer Sicherheitsabfrage ersetzt.',
      open:'ÖFFNEN',close:'SCHLIESSEN',export:'BACKUP ERSTELLEN',import:'BACKUP IMPORTIEREN',
      privacy:'Keine Cloud · kein Konto · keine Übertragung an uns',closePanel:'BACKUP SCHLIESSEN',
      exported:'Backup-Datei erstellt. Schließe den Download in deinem Browser ab.',noData:'Es wurden noch keine App-Daten gefunden. Das Backup enthält die aktuellen Grundeinstellungen.',
      choose:'Wähle eine gültige Backup-Datei aus.',tooLarge:'Die Datei ist zu groß und wurde nicht geöffnet.',
      invalid:'Diese Datei ist kein gültiges Backup von Ramas Field Tool.',version:'Diese Backup-Version wird noch nicht unterstützt.',
      importConfirm:'Dieses Backup ersetzt deine derzeit gespeicherten App-Daten. Wirklich fortfahren?',
      imported:'Backup erfolgreich importiert. Die App wird neu geladen …',failed:'Das Backup konnte nicht importiert werden.'
    },
    en:{
      kicker:'SYSTEM // LOCAL',title:'DATA & BACKUP',summary:'Save or restore your progress',
      intro:'Save your progress as a file on your device. Existing app data is replaced only after a confirmation prompt.',
      open:'OPEN',close:'CLOSE',export:'CREATE BACKUP',import:'IMPORT BACKUP',
      privacy:'No cloud · no account · nothing is sent to us',closePanel:'CLOSE BACKUP',
      exported:'Backup file created. Complete the download in your browser.',noData:'No app data was found yet. The backup contains the current default settings.',
      choose:'Choose a valid backup file.',tooLarge:'The file is too large and was not opened.',
      invalid:'This file is not a valid Ramas Field Tool backup.',version:'This backup version is not supported yet.',
      importConfirm:'This backup will replace your currently saved app data. Continue?',
      imported:'Backup imported successfully. Reloading the app …',failed:'The backup could not be imported.'
    }
  };

  COPY.fr={"kicker": "SYSTÈME // LOCAL", "title": "DONNÉES & SAUVEGARDE", "summary": "Sauvegarder ou restaurer votre progression", "intro": "Enregistrez votre progression dans un fichier. L’import remplace les données locales après confirmation.", "open": "OUVRIR", "close": "FERMER", "export": "CRÉER UNE SAUVEGARDE", "import": "IMPORTER UNE SAUVEGARDE", "privacy": "Sans cloud · sans compte · aucun envoi à nous", "closePanel": "FERMER LA SAUVEGARDE", "exported": "Fichier créé. Terminez le téléchargement dans votre navigateur.", "noData": "Aucune donnée enregistrée. Le fichier contient les paramètres actuels.", "choose": "Choisissez un fichier de sauvegarde valide.", "tooLarge": "Le fichier est trop volumineux.", "invalid": "Ce fichier n’est pas une sauvegarde valide de Ramas Field Tool.", "version": "Cette version de sauvegarde n’est pas encore prise en charge.", "importConfirm": "Cette sauvegarde remplace vos données locales. Continuer ?", "imported": "Sauvegarde importée. Rechargement de l’application…", "failed": "Impossible d’importer la sauvegarde."};
  COPY.es={"kicker": "SISTEMA // LOCAL", "title": "DATOS Y COPIA DE SEGURIDAD", "summary": "Guardar o restaurar tu progreso", "intro": "Guarda tu progreso en un archivo. La importación reemplaza los datos locales tras confirmar.", "open": "ABRIR", "close": "CERRAR", "export": "CREAR COPIA DE SEGURIDAD", "import": "IMPORTAR COPIA DE SEGURIDAD", "privacy": "Sin nube · sin cuenta · no se nos envía nada", "closePanel": "CERRAR COPIA DE SEGURIDAD", "exported": "Archivo creado. Completa la descarga en tu navegador.", "noData": "No hay datos guardados. El archivo contiene la configuración actual.", "choose": "Elige un archivo de copia de seguridad válido.", "tooLarge": "El archivo es demasiado grande.", "invalid": "Este archivo no es una copia de seguridad válida de Ramas Field Tool.", "version": "Esta versión de copia de seguridad aún no es compatible.", "importConfirm": "Esta copia reemplaza tus datos locales. ¿Continuar?", "imported": "Copia importada. Recargando la aplicación…", "failed": "No se pudo importar la copia."};
  COPY.it={"kicker": "SISTEMA // LOCALE", "title": "DATI E BACKUP", "summary": "Salva o ripristina i progressi", "intro": "Salva i progressi in un file. L’importazione sostituisce i dati locali dopo la conferma.", "open": "APRI", "close": "CHIUDI", "export": "CREA BACKUP", "import": "IMPORTA BACKUP", "privacy": "Nessun cloud · nessun account · nessun invio a noi", "closePanel": "CHIUDI BACKUP", "exported": "File creato. Completa il download nel browser.", "noData": "Nessun dato salvato. Il file contiene le impostazioni attuali.", "choose": "Scegli un file di backup valido.", "tooLarge": "Il file è troppo grande.", "invalid": "Questo file non è un backup valido di Ramas Field Tool.", "version": "Questa versione del backup non è ancora supportata.", "importConfirm": "Questo backup sostituisce i dati locali. Continuare?", "imported": "Backup importato. Ricaricamento dell’app…", "failed": "Impossibile importare il backup."};

  const language=()=>localStorage.getItem('arcUiLanguage')||'en';
  const copy=()=>COPY[language()]||COPY.en;

  function setStatus(message,type=''){
    status.textContent=message;
    status.classList.toggle('is-success',type==='success');
    status.classList.toggle('is-error',type==='error');
  }

  function syncText(){
    const c=copy();
    document.getElementById('backupKicker').textContent=c.kicker;
    document.getElementById('backupTitle').textContent=c.title;
    document.getElementById('backupSummary').textContent=c.summary;
    document.getElementById('backupIntro').textContent=c.intro;
    document.getElementById('backupAction').textContent=panel.open?c.close:c.open;
    document.getElementById('backupPrivacy').textContent=c.privacy;
    exportButton.textContent=c.export;
    importButton.textContent=c.import;
    closeButton.textContent=c.closePanel;
  }

  function readCurrentData(){
    const data={};
    Object.entries(RULES).forEach(([key,rule])=>{
      const raw=localStorage.getItem(key);
      if(raw===null){data[key]=null;return}
      if(rule.type==='string'){data[key]=rule.valid(raw)?raw:null;return}
      try{
        const parsed=JSON.parse(raw);
        data[key]=rule.valid(parsed)?parsed:null;
      }catch{data[key]=null}
    });
    return data;
  }

  function exportBackup(){
    try{
      const data=readCurrentData();
      const backup={
        schema:SCHEMA,formatVersion:FORMAT_VERSION,app:'Ramas Field Tool',
        appVersion:document.querySelector('[data-app-version]')?.textContent?.trim()||'',
        exportedAt:new Date().toISOString(),data
      };
      const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      const day=new Date().toISOString().slice(0,10);
      link.href=url;link.download=`ramas-field-tool-backup-${day}.json`;
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      const hasData=Object.values(data).some(value=>value!==null);
      setStatus(hasData?copy().exported:copy().noData,'success');
    }catch(error){
      console.error('Backup export failed',error);
      setStatus(copy().failed,'error');
    }
  }

  function validateBackup(backup){
    const c=copy();
    if(!isRecord(backup)||backup.schema!==SCHEMA||backup.app!=='Ramas Field Tool'||!isRecord(backup.data))throw new Error(c.invalid);
    if(backup.formatVersion!==FORMAT_VERSION)throw new Error(c.version);
    const supplied=Object.keys(backup.data);
    const allowed=Object.keys(RULES);
    if(!supplied.length||supplied.some(key=>!allowed.includes(key)))throw new Error(c.invalid);
    supplied.forEach(key=>{
      const value=backup.data[key];
      if(value!==null&&!RULES[key].valid(value))throw new Error(c.invalid);
    });
    return supplied;
  }

  function applyBackup(data,keys){
    // Replace the complete supported state, including fields absent from older backups.
    data={...Object.fromEntries(Object.keys(RULES).map(key=>[key,null])),...data};
    if(!data.arcUiLanguage)data.arcUiLanguage=data.arcLang||'en';
    if(data.arcPlanningPersonal!==null)data.arcPlanningMigrationV1='1';
    else data.arcPlanningMigrationV1=null;
    keys=Object.keys(RULES);
    const previous=Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)]));
    try{
      keys.forEach(key=>{
        const value=data[key];
        if(value===null){localStorage.removeItem(key);return}
        localStorage.setItem(key,RULES[key].type==='json'?JSON.stringify(value):value);
      });
    }catch(error){
      keys.forEach(key=>{
        if(previous[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,previous[key]);
      });
      throw error;
    }
  }

  async function importBackup(file){
    const c=copy();
    if(!file){setStatus(c.choose,'error');return}
    if(file.size>MAX_FILE_SIZE){setStatus(c.tooLarge,'error');return}
    try{
      const backup=JSON.parse(await file.text());
      const keys=validateBackup(backup);
      if(!window.confirm(c.importConfirm))return;
      applyBackup(backup.data,keys);
      setStatus(c.imported,'success');
      setTimeout(()=>location.reload(),900);
    }catch(error){
      console.error('Backup import failed',error);
      setStatus(error?.message&&Object.values(c).includes(error.message)?error.message:c.failed,'error');
    }
  }

  exportButton.addEventListener('click',exportBackup);
  importButton.addEventListener('click',()=>fileInput.click());
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files?.[0];
    await importBackup(file);
    fileInput.value='';
  });
  closeButton.addEventListener('click',()=>{
    panel.open=false;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
    panel.querySelector(':scope > summary')?.focus({preventScroll:true});
  });
  panel.addEventListener('toggle',syncText);
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(syncText,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(syncText,0));
  window.addEventListener('arc-language-change',syncText);
  syncText();
})();