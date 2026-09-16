(()=>{
  const KEY='arc_blueprints_learned_v1';
  let data=[],filter='all';
  const learned=new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));
  const $=id=>document.getElementById(id);
  const lang=()=>localStorage.getItem('arcLang')||document.documentElement.lang||'de';

  // Only fields independently corroborated outside the community spawn table
  // are allowed to show the stronger CONFIRMED badge.
  const CONFIRMED_FIELDS={
    'burletta':new Set(['quest','scavengable']),
    'equalizer':new Set(['condition','container','scavengable']),
    'hullcracker':new Set(['quest']),
    'jupiter':new Set(['condition','container','scavengable']),
    'lure-grenade':new Set(['quest']),
    'trigger-nade':new Set(['quest','scavengable']),
    'vita-spray':new Set(['quest'])
  };

  const T={
    de:{all:'ALLE',learned:'GELERNT',missing:'FEHLT',plan:'Bauplan',learnedWord:'gelernt',missingWord:'fehlen',shown:'angezeigt',saved:'Fortschritt wird auf diesem Gerät gespeichert',none:'Keine Treffer.',load:'Bauplan-Daten konnten nicht geladen werden.',info:'INFO / FUNDORT',map:'Karte',condition:'Bedingung',container:'Container',quest:'Quest',trials:'Trials',scavengable:'Plünderbar',unknown:'Nicht bestätigt',yes:'Ja',no:'Nein',community:'COMMUNITY-DATEN',confirmed:'BESTÄTIGT',trialRandom:'Trial-Belohnungen können zufällig sein; dieser Blueprint ist dadurch nicht garantiert.',lootWarning:'Fundortangaben aus Community-Quellen sind keine garantierten Spawnpunkte.',sourceNote:'BESTÄTIGT wird nur für unabhängig belegte Einzelangaben verwendet; alle übrigen nichtleeren Angaben bleiben Community-Daten.'},
    en:{all:'ALL',learned:'LEARNED',missing:'MISSING',plan:'Blueprint',learnedWord:'learned',missingWord:'missing',shown:'shown',saved:'Progress is saved on this device',none:'No results.',load:'Blueprint data could not be loaded.',info:'INFO / LOCATION',map:'Map',condition:'Condition',container:'Container',quest:'Quest',trials:'Trials',scavengable:'Scavengable',unknown:'Not confirmed',yes:'Yes',no:'No',community:'COMMUNITY DATA',confirmed:'CONFIRMED',trialRandom:'Trial rewards can be random; this blueprint is not guaranteed.',lootWarning:'Location data from community sources is not a guaranteed spawn.',sourceNote:'CONFIRMED is reserved for independently corroborated individual fields; all other non-empty values remain community data.'}
  };

  const tr=k=>(T[lang()]||T.de)[k];
  function save(){localStorage.setItem(KEY,JSON.stringify([...learned]));}
  function primary(x){return lang()==='en'?(x.name_en||x.name_de||x.name||x.id):(x.name_de||x.name_en||x.name||x.id);}
  function secondary(x){const p=primary(x),alt=lang()==='en'?(x.name_de||''):(x.name_en||'');return alt&&alt!==p?alt:tr('plan');}
  function value(z){if(z===true)return tr('yes');if(z===false)return tr('no');return z??tr('unknown');}

  function status(x,k){
    const a=x.acquisition||{};
    if(a[k]===null||a[k]===undefined)return 'unknown';
    if(CONFIRMED_FIELDS[x.id]?.has(k))return 'confirmed';
    return 'community';
  }

  function field(x,k){
    const a=x.acquisition||{};
    const s=status(x,k);
    return `<div><b>${tr(k)}</b><span>${value(a[k])}</span><em class="bp-evidence bp-${s}">${s==='confirmed'?tr('confirmed'):s==='community'?tr('community'):tr('unknown')}</em></div>`;
  }

  function info(x){
    const a=x.acquisition||{};
    return `<details class="blueprint-info" data-id="${x.id}"><summary>${tr('info')}</summary><div class="blueprint-info-grid">${field(x,'map')}${field(x,'condition')}${field(x,'container')}${field(x,'scavengable')}${field(x,'quest')}${field(x,'trials')}</div>${a.trials===true||typeof a.trials==='string'?`<p class="blueprint-caution">${tr('trialRandom')}</p>`:''}<p class="blueprint-caution">${tr('lootWarning')} ${tr('sourceNote')}</p></details>`;
  }

  function render(){
    const q=($('blueprintQ')?.value||'').trim().toLowerCase();
    const rows=data.filter(x=>{
      const a=x.acquisition||{};
      const hay=[x.name_de,x.name_en,x.name,x.station,x.type,a.map,a.condition,a.container,a.quest,a.trials].filter(Boolean).join(' ').toLowerCase();
      return(!q||hay.includes(q))&&(filter==='all'||(filter==='learned')===learned.has(x.id));
    });

    $('blueprintList').innerHTML=rows.map(x=>`<div class="blueprint-entry ${learned.has(x.id)?'is-learned':''}"><button class="blueprint-row ${learned.has(x.id)?'is-learned':''}" data-id="${x.id}" type="button"><span class="blueprint-check">${learned.has(x.id)?'✓':'○'}</span><span><b>${primary(x)}</b><small>${secondary(x)}</small></span></button>${info(x)}</div>`).join('')||`<p class="muted">${tr('none')}</p>`;

    const validIds=new Set(data.map(x=>x.id));
    const n=[...learned].filter(id=>validIds.has(id)).length;
    $('blueprintSummary').textContent=`${n} / ${data.length} ${tr('learnedWord')} · ${Math.max(0,data.length-n)} ${tr('missingWord')}`;
    $('blueprintStatus').textContent=`${rows.length} ${tr('shown')} · ${tr('saved')}`;
    document.querySelectorAll('.blueprint-filter').forEach(b=>{b.textContent=tr(b.dataset.filter);b.classList.toggle('active',b.dataset.filter===filter)});
    document.querySelectorAll('.blueprint-row').forEach(b=>b.onclick=()=>{learned.has(b.dataset.id)?learned.delete(b.dataset.id):learned.add(b.dataset.id);save();render();});
  }

  async function init(){
    try{
      const [bp,acq]=await Promise.all([
        fetch('blueprints.json?v=2130d').then(r=>{if(!r.ok)throw Error(r.status);return r.json()}),
        fetch('blueprint-acquisition-v2130.json?v=2130d').then(r=>r.ok?r.json():({}))
      ]);
      data=bp.map(x=>({...x,acquisition:acq[x.id]||null}));
      $('blueprintQ').oninput=render;
      document.querySelectorAll('.blueprint-filter').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render();});
      $('deBtn')?.addEventListener('click',()=>setTimeout(render,0));
      $('enBtn')?.addEventListener('click',()=>setTimeout(render,0));
      render();
    }catch(e){
      $('blueprintStatus').textContent=tr('load');
    }
  }

  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
