// V13.0.5 test — official ARC Raiders map conditions with local/calendar reminders.
(()=>{
  const panel=document.getElementById('liveEventsDrawer');
  if(!panel)return;

  const REMOTE_DATA='https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/live-events-data/live-events.json';
  const LOCAL_DATA='live-events.json?v=1305';
  const REGION_KEY='arcEventRegion';
  const LEAD_KEY='arcEventLead';
  const REMINDERS_KEY='arcEventReminders';
  const regions=['europe','north-america','brazil','east-asia','oceania'];
  const allowedLeads=[5,10,15,30];
  const state={events:[],syncedAt:null,source:'',lastBoundary:0};

  const COPY={
    de:{
      kicker:'LIVE INTEL',title:'LIVE-EVENTS',loading:'Offizielle Daten werden geladen …',open:'ÖFFNEN',close:'SCHLIESSEN',
      intro:'Aktuelle und kommende Kartenbedingungen aus dem offiziellen Embark-Feed. Zeiten erscheinen in deiner Gerätezeit.',
      region:'SERVER-REGION',lead:'ERINNERUNG',active:'JETZT AKTIV',upcoming:'ALS NÄCHSTES',source:'Quelle: offizieller Embark-Feed',official:'OFFIZIELLE ÜBERSICHT',closePanel:'EVENTS SCHLIESSEN',
      remind:'ERINNERN',remembered:'GEMERKT',noneActive:'Zurzeit ist keine Kartenbedingung aktiv.',noneUpcoming:'Keine kommenden Events in den geladenen Daten.',
      activeFor:'noch',startsIn:'in',major:'MAJOR',minor:'MINOR',ends:'Ende',starts:'Start',
      loadError:'Live-Daten konnten gerade nicht geladen werden. Nutze bitte die offizielle Übersicht.',
      stale:'Der geladene Zeitplan ist möglicherweise veraltet. Bitte mit der offiziellen Übersicht abgleichen.',
      reminderSaved:'Erinnerung gespeichert. Die Kalenderdatei kann dich auch bei geschlossener App benachrichtigen.',
      notificationGranted:'Zusätzlich erscheint ein Hinweis, solange das Tool geöffnet ist.',
      notificationLimited:'Kalender-Erinnerung erstellt. Browser-Hinweise funktionieren nur zuverlässig, solange das Tool geöffnet ist.',
      summary:(active,next)=>active?`${active} aktiv${next?` · nächstes in ${next}`:''}`:(next?`Nächstes Event in ${next}`:'Keine aktuellen Events'),
      regionNames:{europe:'EUROPA','north-america':'NORDAMERIKA',brazil:'BRASILIEN','east-asia':'OSTASIEN',oceania:'OZEANIEN'},
      reminderTitle:'ARC Event startet bald'
    },
    en:{
      kicker:'LIVE INTEL',title:'LIVE EVENTS',loading:'Loading official data …',open:'OPEN',close:'CLOSE',
      intro:'Current and upcoming map conditions from the official Embark feed. Times use your device timezone.',
      region:'SERVER REGION',lead:'REMINDER',active:'ACTIVE NOW',upcoming:'UP NEXT',source:'Source: official Embark feed',official:'OFFICIAL OVERVIEW',closePanel:'CLOSE EVENTS',
      remind:'REMIND ME',remembered:'SAVED',noneActive:'No map condition is active right now.',noneUpcoming:'No upcoming events in the loaded data.',
      activeFor:'for',startsIn:'in',major:'MAJOR',minor:'MINOR',ends:'Ends',starts:'Starts',
      loadError:'Live data could not be loaded right now. Please use the official overview.',
      stale:'The loaded schedule may be outdated. Please compare it with the official overview.',
      reminderSaved:'Reminder saved. The calendar file can notify you even when the app is closed.',
      notificationGranted:'An additional alert will appear while the tool remains open.',
      notificationLimited:'Calendar reminder created. Browser alerts are only reliable while the tool remains open.',
      summary:(active,next)=>active?`${active} active${next?` · next in ${next}`:''}`:(next?`Next event in ${next}`:'No current events'),
      regionNames:{europe:'EUROPE','north-america':'NORTH AMERICA',brazil:'BRAZIL','east-asia':'EAST ASIA',oceania:'OCEANIA'},
      reminderTitle:'ARC event starts soon'
    }
  };

  const el=id=>document.getElementById(id);
  const language=()=>el('enBtn')?.classList.contains('active')?'en':'de';
  const copy=()=>COPY[language()];
  const regionSelect=el('liveEventsRegion');
  const leadSelect=el('liveEventsLead');
  const notice=el('liveEventsNotice');

  function safeStorageGet(key,fallback){try{return localStorage.getItem(key)??fallback}catch{return fallback}}
  function safeStorageSet(key,value){try{localStorage.setItem(key,value)}catch{}}
  function currentRegion(){const value=regionSelect.value;return regions.includes(value)?value:'europe'}
  function currentLead(){const value=Number(leadSelect.value);return allowedLeads.includes(value)?value:10}
  function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
  function eventKey(event){return [currentRegion(),event.conditionName,event.mapDisplayName,event.start.toISOString()].join('|')}

  function readReminders(){
    try{
      const parsed=JSON.parse(safeStorageGet(REMINDERS_KEY,'[]'));
      if(!Array.isArray(parsed))return [];
      return parsed.filter(item=>item&&typeof item.key==='string'&&typeof item.start==='string'&&typeof item.name==='string'&&typeof item.map==='string'&&allowedLeads.includes(Number(item.lead))).slice(-100);
    }catch{return []}
  }
  function writeReminders(reminders){safeStorageSet(REMINDERS_KEY,JSON.stringify(reminders.slice(-100)))}

  function normalizePayload(payload){
    if(!payload||!Array.isArray(payload.conditions))throw new Error('Invalid event payload');
    const result=[];
    payload.conditions.forEach(item=>{
      if(!item||!['major','minor'].includes(item.type)||typeof item.conditionName!=='string'||typeof item.mapDisplayName!=='string')return;
      const regional=item.regions?.[currentRegion()];
      if(!regional)return;
      const start=new Date(regional.start),end=new Date(regional.end);
      if(!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||end<=start)return;
      result.push({type:item.type,conditionName:item.conditionName.slice(0,100),mapDisplayName:item.mapDisplayName.slice(0,100),start,end});
    });
    if(!result.length)throw new Error('No valid event data');
    state.syncedAt=payload.syncedAt?new Date(payload.syncedAt):null;
    return result.sort((a,b)=>a.start-b.start||a.conditionName.localeCompare(b.conditionName));
  }

  async function fetchPayload(){
    let lastError;
    for(const url of [REMOTE_DATA,LOCAL_DATA]){
      try{
        const response=await fetch(url,{cache:'no-store'});
        if(!response.ok)throw new Error(`Event feed ${response.status}`);
        const payload=await response.json();
        state.source=url;
        return payload;
      }catch(error){lastError=error}
    }
    throw lastError||new Error('Event feed unavailable');
  }

  function duration(target,now=Date.now()){
    const seconds=Math.max(0,Math.floor((target-now)/1000));
    const hours=Math.floor(seconds/3600),minutes=Math.floor((seconds%3600)/60),secs=seconds%60;
    return hours?`${hours}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`:`${minutes}:${String(secs).padStart(2,'0')}`;
  }
  function localTime(date){return new Intl.DateTimeFormat(language()==='en'?'en-GB':'de-CH',{weekday:'short',hour:'2-digit',minute:'2-digit'}).format(date)}
  function visibleEvents(){
    const now=Date.now();
    const active=state.events.filter(event=>event.start<=now&&event.end>now);
    const upcoming=state.events.filter(event=>event.start>now).slice(0,8);
    return {active,upcoming};
  }

  function card(event,active){
    const c=copy(),key=eventKey(event),saved=readReminders().some(item=>item.key===key);
    const meta=`${event.type==='major'?c.major:c.minor} · ${active?c.ends:c.starts} ${localTime(active?event.end:event.start)}`;
    return `<article class="live-event-card ${active?'is-active':''} ${event.type==='major'?'is-major':''}">
      <div class="live-event-copy"><strong>${escapeHtml(event.conditionName)}</strong><span>${escapeHtml(event.mapDisplayName)}</span><small>${escapeHtml(meta)}</small></div>
      <div class="live-event-side"><span class="live-event-countdown" data-countdown="${(active?event.end:event.start).toISOString()}" data-mode="${active?'active':'upcoming'}">${active?c.activeFor:c.startsIn} ${duration(active?event.end:event.start)}</span>${active?'':`<button class="live-event-remind${saved?' is-set':''}" type="button" data-event-key="${escapeHtml(key)}" ${saved?'disabled':''}>${saved?c.remembered:c.remind}</button>`}</div>
    </article>`;
  }

  function render(){
    const c=copy(),{active,upcoming}=visibleEvents();
    el('liveEventsKicker').textContent=`${c.kicker} // ${c.regionNames[currentRegion()]}`;
    el('liveEventsTitle').textContent=c.title;
    el('liveEventsIntro').textContent=c.intro;
    el('liveEventsRegionLabel').textContent=c.region;
    el('liveEventsLeadLabel').textContent=c.lead;
    el('liveEventsActiveTitle').textContent=c.active;
    el('liveEventsUpcomingTitle').textContent=c.upcoming;
    el('liveEventsSourceText').textContent=c.source;
    el('liveEventsClose').textContent=c.closePanel;
    el('liveEventsAction').textContent=panel.open?c.close:c.open;
    document.querySelector('.live-events-source a').textContent=c.official;
    el('liveEventsActive').innerHTML=active.length?active.map(event=>card(event,true)).join(''):`<div class="live-event-empty">${c.noneActive}</div>`;
    el('liveEventsUpcoming').innerHTML=upcoming.length?upcoming.map(event=>card(event,false)).join(''):`<div class="live-event-empty">${c.noneUpcoming}</div>`;
    const next=upcoming[0];
    el('liveEventsSummary').textContent=c.summary(active.length,next?duration(next.start):'');
    state.lastBoundary=Math.min(...[...active.map(event=>event.end.getTime()),...upcoming.map(event=>event.start.getTime())].filter(time=>time>Date.now()),Infinity);
    updateCountdowns();
  }

  function updateCountdowns(){
    const c=copy(),now=Date.now();
    document.querySelectorAll('[data-countdown]').forEach(node=>{
      const target=new Date(node.dataset.countdown);
      node.textContent=`${node.dataset.mode==='active'?c.activeFor:c.startsIn} ${duration(target,now)}`;
    });
    const {active,upcoming}=visibleEvents();
    el('liveEventsSummary').textContent=c.summary(active.length,upcoming[0]?duration(upcoming[0].start,now):'');
    if(now>=state.lastBoundary)render();
  }

  function setNotice(message,type=''){
    notice.textContent=message;
    notice.classList.toggle('is-error',type==='error');
  }

  function formatIcsDate(date){return date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
  function escapeIcs(value){return String(value).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')}
  function downloadCalendar(event,lead){
    const title=`ARC Raiders: ${event.conditionName} – ${event.mapDisplayName}`;
    const uid=`${Math.abs(eventKey(event).split('').reduce((hash,char)=>(hash*31+char.charCodeAt(0))|0,0))}-${event.start.getTime()}@ramasfieldtool`;
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//Ramas Field Tool//Live Events//EN','BEGIN:VEVENT',`UID:${uid}`,`DTSTAMP:${formatIcsDate(new Date())}`,`DTSTART:${formatIcsDate(event.start)}`,`DTEND:${formatIcsDate(event.end)}`,`SUMMARY:${escapeIcs(title)}`,`DESCRIPTION:${escapeIcs('Official ARC Raiders map condition schedule · arcraiders.com/map-conditions')}`,'BEGIN:VALARM',`TRIGGER:-PT${lead}M`,'ACTION:DISPLAY',`DESCRIPTION:${escapeIcs(title)}`,'END:VALARM','END:VEVENT','END:VCALENDAR'];
    const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=`arc-event-${event.conditionName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.ics`;
    document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  async function addReminder(key){
    const event=state.events.find(item=>eventKey(item)===key);
    if(!event)return;
    const lead=currentLead(),reminders=readReminders().filter(item=>new Date(item.start)>new Date());
    if(!reminders.some(item=>item.key===key))reminders.push({key,start:event.start.toISOString(),end:event.end.toISOString(),name:event.conditionName,map:event.mapDisplayName,lead,notified:false});
    writeReminders(reminders);
    downloadCalendar(event,lead);
    let extra=copy().notificationLimited;
    if('Notification' in window){
      try{
        const permission=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
        if(permission==='granted')extra=copy().notificationGranted;
      }catch{}
    }
    setNotice(`${copy().reminderSaved} ${extra}`);
    render();
  }

  function checkReminders(){
    const now=Date.now(),reminders=readReminders(),kept=[];
    reminders.forEach(item=>{
      const start=new Date(item.start).getTime(),end=new Date(item.end||item.start).getTime(),due=start-Number(item.lead)*60000;
      if(end<now)return;
      if(!item.notified&&now>=due&&now<start&&'Notification' in window&&Notification.permission==='granted'){
        try{new Notification(copy().reminderTitle,{body:`${item.name} · ${item.map}`,tag:item.key})}catch{}
        item.notified=true;
      }
      kept.push(item);
    });
    if(JSON.stringify(kept)!==JSON.stringify(reminders))writeReminders(kept);
  }

  async function load(){
    setNotice('');
    el('liveEventsSummary').textContent=copy().loading;
    try{
      const payload=await fetchPayload();
      state.events=normalizePayload(payload);
      const latestEnd=Math.max(...state.events.map(event=>event.end.getTime()));
      if(latestEnd<Date.now()+3600000)setNotice(copy().stale,'error');
      render();
    }catch(error){
      console.error('Live event feed unavailable',error);
      state.events=[];setNotice(copy().loadError,'error');render();
    }
  }

  const savedRegion=safeStorageGet(REGION_KEY,'europe');
  regionSelect.value=regions.includes(savedRegion)?savedRegion:'europe';
  const savedLead=Number(safeStorageGet(LEAD_KEY,'10'));
  leadSelect.value=String(allowedLeads.includes(savedLead)?savedLead:10);
  regionSelect.addEventListener('change',()=>{safeStorageSet(REGION_KEY,currentRegion());load()});
  leadSelect.addEventListener('change',()=>safeStorageSet(LEAD_KEY,String(currentLead())));
  el('liveEventsUpcoming').addEventListener('click',event=>{const button=event.target.closest('[data-event-key]');if(button)addReminder(button.dataset.eventKey)});
  el('liveEventsClose').addEventListener('click',()=>{panel.open=false;panel.scrollIntoView({behavior:'smooth',block:'start'});panel.querySelector(':scope > summary')?.focus({preventScroll:true})});
  panel.addEventListener('toggle',render);
  el('deBtn')?.addEventListener('click',()=>setTimeout(render,0));
  el('enBtn')?.addEventListener('click',()=>setTimeout(render,0));
  setInterval(updateCountdowns,1000);
  setInterval(checkReminders,15000);
  checkReminders();load();
})();
