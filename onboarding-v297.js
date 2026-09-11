// V2.9.7 – lightweight onboarding and clearer empty states

T.de.flowTitle='SO FUNKTIONIERT ES';
T.en.flowTitle='HOW IT WORKS';
T.de.step1='Ziele wählen';
T.en.step1='Choose goals';
T.de.step1Help='Werkbank-Stufen aktivieren';
T.en.step1Help='Activate station levels';
T.de.step2='Bedarf prüfen';
T.en.step2='Check needs';
T.de.step2Help='Fehlende Materialien sehen';
T.en.step2Help='See missing materials';
T.de.step3='Item suchen';
T.en.step3='Search items';
T.de.step3Help='Teilbegriffe reichen';
T.en.step3Help='Partial words are enough';
T.de.step4='Quests verwalten';
T.en.step4='Manage quests';
T.de.step4Help='Optional zusätzlich aktivieren';
T.en.step4Help='Optionally add quest needs';
T.de.supplyHelp='Hier siehst du automatisch, was deine aktiven Ziele und Quests zusammen benötigen.';
T.en.supplyHelp='This automatically shows what your active goals and quests require in total.';
T.de.searchHelp='Du musst den Namen nicht vollständig kennen. Beispiel: „hoch“ findet Items mit „Hoch…“.';
T.en.searchHelp='You do not need the full name. Example: “high” finds items containing “high…”.';
T.de.noGoalTitle='Noch kein Ziel ausgewählt';
T.en.noGoalTitle='No goal selected yet';
T.de.noGoalAction='Öffne „Aktive Ziele“ und wähle die Werkbank-Stufen, auf die du gerade hinarbeitest.';
T.en.noGoalAction='Open “Active Goals” and choose the station levels you are currently working toward.';
T.de.questIntro='Quests sind optional. Markiere nur die Quests als aktiv, deren benötigte Items in deinen Gesamtbedarf einfließen sollen.';
T.en.questIntro='Quests are optional. Mark only quests as active if their required items should count toward your total needs.';

function refreshOnboardingText(){
  document.querySelectorAll('[data-onboard-t]').forEach(el=>{
    const key=el.dataset.onboardT;
    if(T[lang]?.[key]) el.textContent=T[lang][key];
  });
}

const originalApplyLanguage=applyLanguage;
applyLanguage=function(){
  originalApplyLanguage();
  refreshOnboardingText();
};

const originalDrawSummary=drawSummary;
drawSummary=function(){
  const req=requirementMap();
  if(!Object.keys(req).length){
    summaryEl.innerHTML=`<div class="empty actionable"><b>${T[lang].noGoalTitle}</b>${T[lang].noGoalAction}</div>`;
    return;
  }
  originalDrawSummary();
};

refreshOnboardingText();
drawSummary();
