// Bootstrap My Planning without changing unrelated launcher markup.
(()=>{
  if(document.getElementById('planningSection'))return;
  const launcher=document.querySelector('#appLauncher .app-grid');
  const main=document.querySelector('main');
  const goalsSection=document.getElementById('goalsSection');
  const questDrawer=document.getElementById('questDrawer');
  if(!launcher||!main||!goalsSection||!questDrawer)return;

  const style=document.createElement('link');style.rel='stylesheet';style.href='planning.css?v=1';document.head.append(style);
  const section=document.createElement('section');section.id='planningSection';section.className='panel launcher-section planning-panel';
  section.innerHTML=`<div class="drawer-body"><div class="planning-tabs" role="tablist"><button id="planningTabMissing" type="button" role="tab" aria-selected="true">Was fehlt mir?</button><button id="planningTabGoals" type="button" role="tab" aria-selected="false">Meine Ziele</button></div><div class="planning-filters"><label><input id="planningShowAll" type="checkbox"> <span>Alle benötigten Items</span></label><label><input id="planningRaidOnly" type="checkbox"> <span>Nur nächster Raid</span></label></div><div id="planningStatus" role="status" aria-live="polite"></div><div id="planningMissing" class="planning-list"></div><div id="planningGoals" hidden><section class="planning-goal-group"><h3>Werkbankstufen</h3><div id="planningWorkshopHost" class="planning-embedded"></div></section><section class="planning-goal-group"><h3>Quests</h3><div id="planningQuestHost" class="planning-embedded"></div></section><section class="planning-goal-group"><h3>Persönliche Sammelziele</h3><div class="planning-personal-add"><label>Item<select id="planningPersonalItem"></select></label><label>Zielmenge<input id="planningPersonalAmount" type="number" min="1" inputmode="numeric" value="1"></label><button id="planningPersonalAdd" type="button">Hinzufügen</button></div><div id="planningPersonalList" class="planning-personal-list"></div></section></div></div>`;
  main.insertBefore(section,goalsSection);
  section.querySelector('#planningWorkshopHost').append(goalsSection);
  section.querySelector('#planningQuestHost').append(questDrawer);
  goalsSection.open=true;questDrawer.open=true;

  // Replace the three overlapping planning launchers with one entry. Item search remains a lookup tool.
  const oldTargets=['nextRaidDrawer','goalsSection','supplySection','questDrawer'];
  const oldTiles=oldTargets.map(id=>launcher.querySelector(`[data-app-target="${id}"]`)).filter(Boolean);
  const first=oldTiles[0];
  if(first){
    first.dataset.appTarget='planningSection';first.style.setProperty('--tile-color','#ff986a');
    first.querySelector('b').textContent='Meine Planung';first.querySelector('small').textContent='Ziele · Fehlendes · Funde';
    oldTiles.slice(1).forEach(tile=>tile.remove());
  }
  document.querySelectorAll('.quick-nav a[href="#goalsSection"],.quick-nav a[href="#supplySection"],.quick-nav a[href="#questDrawer"],.quick-nav a[href="#nextRaidDrawer"]').forEach(link=>link.href='#planningSection');
  document.getElementById('nextRaidDrawer')?.classList.add('planning-legacy-hidden');
  document.getElementById('supplySection')?.classList.add('planning-legacy-hidden');

  // Existing launcher captured its section list before this panel existed; route this tile directly.
  launcher.addEventListener('click',event=>{
    const tile=event.target.closest('[data-app-target="planningSection"]');if(!tile)return;
    event.stopImmediatePropagation();
    document.querySelectorAll('main>.launcher-section').forEach(el=>el.classList.toggle('launcher-active',el===section));
    document.body.classList.add('view-open');location.hash='planningSection';window.scrollTo(0,0);
    const title=document.getElementById('detailTitle'),detail=document.getElementById('detailStatus');if(title)title.textContent='Meine Planung';if(detail)detail.textContent='Ziele · Fehlendes · Funde';
  },true);
  window.addEventListener('hashchange',()=>{if(location.hash==='#planningSection')first?.click()});

  const core=document.createElement('script');core.src='planning-core.js?v=2';core.onload=()=>{const ui=document.createElement('script');ui.src='planning-ui.js?v=1';document.body.append(ui)};document.body.append(core);
})();
