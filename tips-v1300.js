// V13.0.0 — bilingual tips & tricks with one open category at a time.
(()=>{
  const COPY={
    de:{
      kicker:'FIELD NOTES // 17',title:'TIPPS & TRICKS',subtitle:'Wissen für bessere Runs',
      intro:'Wähle eine Kategorie. Es bleibt immer nur eine Kategorie gleichzeitig geöffnet.',close:'TIPPS SCHLIESSEN',count:'TIPPS',
      categories:[
        {title:'START & BEWEGUNG',items:[
          ['GRATIS-LOADOUT ZUM LERNEN','Nutze ein Gratis-Loadout, um neue Karten, Wege und Extraktionspunkte ohne Verlust eigener Ausrüstung kennenzulernen. Beachte: Du startest mit einfacher, zufälliger Ausrüstung und ohne Safe Pocket. Für seltene Quest- oder Upgrade-Items ist ein eigenes Loadout sicherer.'],
          ['WAFFE WEGSTECKEN, SCHNELLER LAUFEN','Stecke deine Waffe weg, wenn du längere Strecken zurücklegst oder aus einer gefährlichen Zone flüchtest. Dadurch bewegst du dich deutlich schneller. Ziehe sie rechtzeitig wieder, bevor du Gebäude, Engstellen oder hörbare Gegner erreichst.'],
          ['AUSDAUER NICHT KOMPLETT VERBRAUCHEN','Sprinte nicht dauerhaft über die Karte. Halte immer etwas Ausdauer als Reserve, damit du bei einem ARC-Angriff, Beschuss oder einem Hinterhalt sofort ausweichen und Deckung erreichen kannst. Nutze sichere Abschnitte, um gehend deine Ausdauer wieder aufzuladen.']
        ]},
        {title:'LOOT & FORTSCHRITT',items:[
          ['WICHTIGE ITEMS SOFORT SICHERN','Lege seltene Questgegenstände, Baupläne und dringend benötigte Werkbank-Materialien sofort ins Safe Pocket – sofern dein Augment sie zulässt. Warte nicht bis zur Extraktion: Bei einer Niederlage bleiben gesicherte Gegenstände erhalten. Die Bedarfsanzeige der App hilft dir zu erkennen, welche Materialien gerade Priorität haben.'],
          ['BEHALTEN, ZERLEGEN ODER VERKAUFEN?','Prüfe deine Beute zuerst in der App. Behalte die dort angezeigte Gesamtmenge – auch wenn du den Gegenstand erst in einem späteren Upgrade, einer Quest oder einem Projekt brauchst. Zerlege nur echten Überschuss, wenn du die daraus entstehenden Bauteile benötigst. Anderen Überschuss kannst du verkaufen.'],
          ['SUCHE NACH GEBIETSART','Suche benötigte Materialien nicht zufällig auf der ganzen Karte. Orientiere dich an den Gebietskategorien: Medizin für Antiseptikum und Reagenzien, Mechanik oder Industrie für verrostete Teile und Natur für Pflanzen. Die Kategorie erhöht nur die Fundchance – durchsuche dort gezielt passende Behälter.'],
          ['GEMISCHTE SAMEN AUFHEBEN','Verkaufe Gemischte Samen nicht vorschnell. Celeste akzeptiert sie als eigene Währung für Materialien. Fehlen dir nur wenige Teile für eine Herstellung oder ein Upgrade, kann der Tausch einen zusätzlichen Raid ersparen. Prüfe deshalb zuerst Celestes Angebot und verkaufe nur Samen, die du wirklich entbehren kannst.'],
          ['ERST AUFWERTEN, DANN REPARIEREN','Willst du eine beschädigte Waffe ohnehin aufwerten, führe zuerst das Upgrade durch. Eine Waffenaufwertung stellt zusätzlich 25 Prozent Haltbarkeit wieder her. Repariere erst danach den verbleibenden Schaden – so verschwendest du keine Reparaturmaterialien.'],
          ['GRATIS-AUGMENT EINTAUSCHEN','Extrahierst du erfolgreich mit einem Gratis-Loadout, behältst du dessen Gratis-Augment. Verkaufe es nicht: In Lances Klinik kannst du es ohne zusätzliche Kosten gegen ein deutlich besseres grünes Mk.-1-Augment eintauschen.']
        ]},
        {title:'ÜBERLEBEN & EXTRAKTION',items:[
          ['ERST HÖREN, DANN WEITERGEHEN','Halte vor Gebäuden, Engstellen und Extraktionspunkten kurz an und höre genau hin. ARC-Maschinen verändern ihre Geräusche, wenn sie suchen oder kämpfen. Schüsse, Schritte und aktive ARCs können dir verraten, was hinter der nächsten Ecke passiert, bevor du dich zeigst.'],
          ['NICHT JEDEN ARC BEKÄMPFEN','Frage dich vor jedem Angriff, ob sich der Kampf wirklich lohnt. Große ARCs kosten Munition, Heilung und Zeit – und der Lärm kann andere Raider anlocken. Wenn kein Questziel oder wertvoller Loot davon abhängt, ist Umgehen oft die bessere Entscheidung.'],
          ['EXTRAKTION FRÜH PLANEN','Entscheide schon während deiner Loot-Route, welchen Ausgang du benutzen willst. Prüfe den Weg und plane genügend Zeit für Umwege oder Kämpfe ein. Mit vollem Inventar und fast abgelaufenem Timer erst nach einer Extraktion zu suchen, macht dich unnötig verwundbar.'],
          ['VERSORGUNG KOMMT NICHT HEIMLICH','Gehen dir unterwegs Munition oder Heilmittel aus, suche nach einer Versorgungsstation und fordere einen Vorratsabwurf an. Aktiviere sie aber erst, wenn du Deckung und die Umgebung geprüft hast: Der Abwurf ist auch für andere Raider sichtbar und kann von ihnen geplündert werden.'],
          ['RAIDER-LUKE ALS NOTAUSGANG','Prüfe vor dem Start, ob bei der gewählten Kartenbedingung Raider-Luken verfügbar sind. Nur dann lohnt sich ein Lukenschlüssel im Safe Pocket. Nutze die Luke als Ausweichroute, wenn reguläre Extraktionen umkämpft sind oder die Zeit knapp wird. Im Team genügt ein Schlüssel für alle – bleibt zusammen, damit niemand zurückbleibt.']
        ]},
        {title:'RAIDER & ZUSAMMENARBEIT',items:[
          ['NICHT SOFORT SCHIESSEN','Beobachte unbekannte Raider kurz, bevor du den Kampf eröffnest. Nur von dir begonnene PvP-Kämpfe beeinflussen deine Spielstilwertung; reine Selbstverteidigung nicht. Wer seltener Kämpfe beginnt, kann häufiger mit ähnlich friedlichen Spielern zusammengebracht werden – eine friedliche Lobby ist aber nie garantiert.'],
          ['ERST REDEN, DANN VERTRAUEN','Nutze den Nähe-Sprachchat, um unbekannte Raider anzusprechen, bevor ihr euch zu nahe kommt. Ein kurzer freundlicher Zuruf kann Missverständnisse verhindern und spontane Zusammenarbeit ermöglichen. Bleib trotzdem in Deckungsnähe und rechne jederzeit damit, dass die andere Seite ihre Meinung ändert.'],
          ['EIN DEFIBRILLATOR KANN DEN RAID RETTEN','Nimm nach Möglichkeit einen Defibrillator mit. Damit kannst du Teammitglieder nahezu sofort wieder auf die Beine bringen – und auch niedergeschlagene Raider außerhalb deines Teams wiederbeleben, mit denen du zusammenarbeitest. Sichere vorher kurz die Umgebung, denn der Defibrillator wird bei der Benutzung verbraucht.']
        ]}
      ]
    },
    en:{
      kicker:'FIELD NOTES // 17',title:'TIPS & TRICKS',subtitle:'Knowledge for better runs',
      intro:'Choose a category. Only one category stays open at a time.',close:'CLOSE TIPS',count:'TIPS',
      categories:[
        {title:'START & MOVEMENT',items:[
          ['USE FREE LOADOUTS TO LEARN','Use a Free Loadout to learn new maps, routes and extraction points without risking your own gear. Keep in mind that you start with simple random equipment and no Safe Pocket. Your own loadout is safer when carrying rare quest or upgrade items.'],
          ['HOLSTER YOUR WEAPON TO RUN FASTER','Holster your weapon when crossing long distances or escaping a dangerous area. You will move noticeably faster. Draw it again before entering buildings, choke points or areas where you can hear enemies.'],
          ['KEEP SOME STAMINA IN RESERVE','Do not sprint across the entire map. Keep some stamina in reserve so you can dodge and reach cover immediately during an ARC attack, incoming fire or an ambush. Walk through safe sections to recover it.']
        ]},
        {title:'LOOT & PROGRESSION',items:[
          ['SECURE IMPORTANT ITEMS IMMEDIATELY','Put rare quest items, blueprints and urgently needed workshop materials in your Safe Pocket immediately, if your Augment allows it. Do not wait until extraction: secured items survive a defeat. The app’s needs display helps you identify which materials currently matter most.'],
          ['KEEP, RECYCLE OR SELL?','Check your loot in the app first. Keep the total amount shown there, even if the item is needed only for a later upgrade, quest or project. Recycle only true surplus when you need the resulting components. Other surplus can be sold.'],
          ['SEARCH BY AREA TYPE','Do not search randomly across the whole map. Use area categories: Medical for Antiseptic and reagents, Mechanical or Industrial for rusty parts, and Nature for plants. A category only improves the odds, so search suitable containers there.'],
          ['KEEP ASSORTED SEEDS','Do not sell Assorted Seeds too quickly. Celeste accepts them as a separate currency for materials. If you are only a few parts short for crafting or an upgrade, a trade can save an extra raid. Check Celeste’s offer first and sell only seeds you can spare.'],
          ['UPGRADE BEFORE REPAIRING','If you plan to upgrade a damaged weapon anyway, upgrade it first. A weapon upgrade also restores 25 percent durability. Repair the remaining damage afterward so you do not waste repair materials.'],
          ['TRADE IN A FREE AUGMENT','After successfully extracting with a Free Loadout, you keep its Free Augment. Do not sell it: Lance’s Clinic lets you exchange it at no extra cost for a much better green Mk. 1 Augment.']
        ]},
        {title:'SURVIVAL & EXTRACTION',items:[
          ['LISTEN BEFORE MOVING ON','Pause before buildings, choke points and extraction points and listen carefully. ARC machines change their sounds when searching or fighting. Gunfire, footsteps and active ARCs can reveal what is around the next corner before you expose yourself.'],
          ['DO NOT FIGHT EVERY ARC','Ask whether a fight is truly worth it before attacking. Large ARCs consume ammunition, healing and time, and the noise can attract other Raiders. If no quest objective or valuable loot depends on it, going around is often the better choice.'],
          ['PLAN EXTRACTION EARLY','Choose your intended exit while planning your loot route. Check the way there and allow enough time for detours or fights. Starting to search for extraction with a full inventory and an expiring timer leaves you needlessly vulnerable.'],
          ['SUPPLY DROPS ARE NOT QUIET','If you run low on ammunition or healing, find a Supply Station and request a Supply Drop. Activate it only after checking cover and the surrounding area: other Raiders can see the drop and loot it.'],
          ['RAIDER HATCH AS AN EMERGENCY EXIT','Before deploying, check whether Raider Hatches are available under the selected map condition. Only then is a Hatch Key worth carrying in your Safe Pocket. Use the hatch when regular extractions are contested or time is short. One key is enough for the whole team, so stay together.']
        ]},
        {title:'RAIDERS & COOPERATION',items:[
          ['DO NOT SHOOT IMMEDIATELY','Observe unknown Raiders briefly before starting a fight. Only PvP fights you initiate affect your playstyle rating; pure self-defense does not. Starting fewer fights can match you with similarly peaceful players more often, but a peaceful lobby is never guaranteed.'],
          ['TALK FIRST, TRUST LATER','Use proximity voice chat to address unknown Raiders before getting too close. A quick friendly callout can prevent misunderstandings and enable spontaneous cooperation. Stay near cover and be ready for the other side to change its mind.'],
          ['A DEFIBRILLATOR CAN SAVE THE RAID','Carry a Defibrillator when possible. It can bring teammates back to their feet almost instantly and also revive downed Raiders outside your team when you are working together. Secure the area first because the Defibrillator is consumed when used.']
        ]}
      ]
    }
  };

  const drawer=document.getElementById('tipsDrawer');
  const categories=document.getElementById('tipsCategories');
  const closeButton=document.getElementById('tipsClose');
  if(!drawer||!categories||!closeButton)return;

  const currentLanguage=()=>typeof lang!=='undefined'&&lang==='en'?'en':'de';
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);

  function render(){
    const copy=COPY[currentLanguage()];
    document.getElementById('tipsKicker').textContent=copy.kicker;
    document.getElementById('tipsTitle').textContent=copy.title;
    document.getElementById('tipsSubtitle').textContent=copy.subtitle;
    document.getElementById('tipsIntro').textContent=copy.intro;
    closeButton.textContent=copy.close;
    categories.innerHTML=copy.categories.map((category,categoryIndex)=>`
      <details class="tips-category">
        <summary>
          <span class="tips-category-name">${escapeHtml(category.title)}<small>${category.items.length} ${copy.count}</small></span>
          <span class="tips-category-chevron" aria-hidden="true">⌄</span>
        </summary>
        <ol class="tips-list">
          ${category.items.map((item,itemIndex)=>`
            <li class="tip-item">
              <span class="tip-number">${String(copy.categories.slice(0,categoryIndex).reduce((total,entry)=>total+entry.items.length,0)+itemIndex+1).padStart(2,'0')} //</span>
              <div class="tip-copy"><h4>${escapeHtml(item[0])}</h4><p>${escapeHtml(item[1])}</p></div>
            </li>`).join('')}
        </ol>
      </details>`).join('');

    categories.querySelectorAll('.tips-category').forEach(category=>{
      category.addEventListener('toggle',()=>{
        if(!category.open)return;
        categories.querySelectorAll('.tips-category[open]').forEach(other=>{
          if(other!==category)other.open=false;
        });
      });
    });
  }

  function collapseCategories(){
    categories.querySelectorAll('.tips-category[open]').forEach(category=>category.open=false);
  }

  drawer.addEventListener('toggle',()=>{if(!drawer.open)collapseCategories()});
  closeButton.addEventListener('click',()=>{
    drawer.open=false;
    drawer.scrollIntoView({behavior:'smooth',block:'start'});
    drawer.querySelector(':scope > summary')?.focus({preventScroll:true});
  });
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(render,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(render,0));
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  render();
})();
