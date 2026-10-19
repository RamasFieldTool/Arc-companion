#!/usr/bin/env python3
"""Reproduce repository inventory and community furniture comparison; no gameplay verification."""
import json,re,collections,hashlib,subprocess,sys
from pathlib import Path
from html.parser import HTMLParser
class TableParser(HTMLParser):
 def __init__(self): super().__init__(); self.rows=[]; self.row=None; self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=="tr": self.row=[]
  if tag in ("td","th"): self.cell=""
  if tag=="li" and self.cell is not None: self.cell+=" | "
 def handle_data(self,data):
  if self.cell is not None: self.cell+=data
 def handle_endtag(self,tag):
  if tag in ("td","th") and self.cell is not None:
   if self.row is not None: self.row.append(" ".join(self.cell.split()))
   self.cell=None
  if tag=="tr" and self.row: self.rows.append(self.row); self.row=None
if len(sys.argv)!=2: raise SystemExit("usage: python tools/audit_outpost_full.py Furniture.html (writes audit only; no game data changes)")
html_path=Path(sys.argv[1]); parser=TableParser(); parser.feed(html_path.read_text()); wiki=parser.rows
from pathlib import Path
root=Path('.');load=lambda p:json.loads(Path(p).read_text()); c=load('outpost-catalog.json');a=load('catalog-data/amplified-variants.json');ref=load('outpost-reference-data.json')
norm=lambda s:re.sub('[^a-z0-9]','',s.lower().removesuffix(' design'))
wi={norm(r[1]):r for r in wiki if len(r)==5 and r[0]!='Image'};counts=collections.Counter(norm(r['name']['en']) for r in c['furniture'])
mat=lambda t:sorted((norm(n),int(q)) for q,n in re.findall(r'(\d+)x\s+([^|]+)',t))
rows=[]
def add(id,name,area,present,missing,sources,status='TEILWEISE VERIFIZIERT',issues=None,proof=None,**extra):
 rows.append(dict(id=id,name=name,area=area,present=present,missing=missing,issues=issues or [],sources=sources,status=status,requiredEvidence=proof or 'Dated current-build game menu showing identity, complete costs and prerequisites.',**extra))
for r in c['furniture']:
 w=wi[norm(r['name']['en'])];amb=counts[norm(r['name']['en'])]>1;cost=sorted((norm(m['name']['en']),m['quantity']) for m in r['craft']); issues=[];missing=['Per-design acquisition/unlock classification','Current-game names, category and costs','Attached slots / effects / room restrictions not modeled']
 comp={'identity':'ambiguous' if amb else 'name-match-only','craft':'not-compared' if amb else ('agrees' if cost==mat(w[2]) else 'conflict')}
 if amb:issues.append('Two repository IDs have the same English label; wiki lists Study Armchair and Sturdy Armchair. No ID reassignment inferred.')
 elif cost!=mat(w[2]):issues.append('Wiki crafting quantities differ; retain existing source values.');comp['wikiCraftCandidate']=mat(w[2])
 if r['research']:
  rm=sorted([(norm(m['name']['en']),m['quantity']) for m in r['research']['materials']]+[('researchpoints',r['research']['points'])]);wm=mat(w[3]);comp['research']='ambiguous' if amb else ('not-listed' if not wm else ('agrees' if rm==wm else 'conflict'))
  if comp['research']=='conflict':issues.append('Research materials conflict with wiki.');comp['wikiResearchCandidate']=wm
  if not wm:missing.append('Wiki omits research; omission is not evidence against existing research')
 else:
  missing.append('Research unknown, not proven unnecessary');comp['research']='candidate' if mat(w[3]) else 'not-listed'
  if mat(w[3]):comp['wikiResearchCandidate']=mat(w[3]);issues.append('Wiki lists research absent from pinned catalog')
 if any(m['name'].get('de')==m['name'].get('en')=='Sheet Metal' for m in r['craft']):missing.append('Verified German name for Sheet Metal; source fallback is English')
 add('furniture:'+r['id'],r['name']['en'],'furniture',r,missing,[c['source'],'https://arcraiders.wiki/w/index.php?title=Furniture&oldid=43358'],'WIDERSPRÜCHLICH' if amb or comp['craft']=='conflict' or comp['research']=='conflict' else 'TEILWEISE VERIFIZIERT',issues,comparison=comp)
raw=json.loads(re.search(r'```json\s*(.*?)```',Path('catalog-data/amplified-completeness-audit.md').read_text(),re.S)[1]); integrated={n['id']:n for n in a['testIntegration']['nodes']}
for f in a['families']:
 add('family:'+f['id'],f['id'],'amplified-family',f,['Current-game family eligibility, module class and alternative paths'],[s for s in [a['upgradeTree']['source']] if isinstance(s,str)])
 for o in f['researchedUpgradeOptions']:
  key=f['id']+':'+norm(o['name']);n=integrated.get(key);issues=[] if n else ['Historical label not safely mapped to API; see existing unresolved matrix']
  add('node:'+key,f['id']+' / '+o['name'],'amplified-node',{'historical':o,'integrated':n},['Current-game node identity, costs, statistics and complete tree','Research/loadout icons; absence of API research is not proof of no research'],[o['source']]+([n['source']] if n else []),'TEILWEISE VERIFIZIERT' if n else 'WIDERSPRÜCHLICH',issues)
ci={r['id'] for r in a['testIntegration']['configurations']};ei={(e['from'],e['to']) for e in a['testIntegration']['connections']}
for r in raw['records']:
 add('configuration:'+r['id'],r['id'],'amplified-configuration',r,['Current-build game menu; repairs, installed combination and stats'],[raw['source']],uiIntegrated=r['id'] in ci)
 for e in r.get('upgrades',[]):
  add('edge:'+r['id']+'>'+e['to'],r['id']+' → '+e['to'],'amplified-edge',e,['Current-game directional connection, cost and prerequisites'],[raw['source']],uiIntegrated=(r['id'],e['to']) in ei)
for r in a['testIntegration']['research']:
 add('research:'+r['id'],r['name'],'amplified-research',r,['Current-build task, complete loadout icons, points and resources'],[r['source']])
for id in ['action_economy','compact_combustion_charges']:
 add('research:'+id,id,'amplified-research',{'uiIntegrated':False},['Not integrated due to unresolved node naming; retain prior research evidence in historical audit'],['catalog-data/amplified-completeness-audit.md'])
for r in ref['expansions']:add(f"expansion:{r['from']}>{r['to']}",f"Outpost {r['from']} → {r['to']}",'expansion',r,['Current-game costs, room variants and prerequisites'],[ref['expansionSource']])
s=Path('frozen-trail-data.js').read_text();expr=s.split('const goalDefinitions=',1)[1].split(';\n  const IDENTITY_KEY',1)[0];goals=json.loads(subprocess.check_output(['node','-e','const vm=require("vm");console.log(JSON.stringify(vm.runInNewContext('+json.dumps('('+expr+')')+',{grappleEvidence:{}})))'],text=True))
for g in goals:
 if g['id'] not in ['rft_outpost_materials','rft_research_station']:continue
 for r in g['levels']:add(g['id']+':'+str(r['level']),g['en']+' / '+str(r['level']),'station' if 'station' in g['id'] else 'construction',r,['Current-game menu and explicit phase/level prerequisites'],[g['rftEvidence']['source']])
for k in ['designResearch','furnitureCraft','gadgetRecipes']:
 for i,r in enumerate(ref[k]):add(f'legacy:{k}:{i}',r['name'],'legacy-reference',r,['Independent current-game confirmation; first two furniture reference tables intentionally hidden by full catalog'],[r.get('source',ref.get('researchSource') if k=='designResearch' else ref['furnitureSource'])])
for r in a['moduleClasses']:add('module:'+r['mark'],'Amplification Module '+r['mark'],'module',r,['Current-game acquisition and module-to-family applicability'],[a['upgradeTree']['source']])
for r in rows:
 r['gapType']='conflict' if r['status']=='WIDERSPRÜCHLICH' else ('missing-data' if r.get('comparison',{}).get('research')=='candidate' else 'unconfirmed-properties')
 r['verificationScope']='Repository contents inspected; community/source documentation is not independent current-game confirmation.'
input_paths=['outpost-catalog.json','outpost-reference-data.json','catalog-data/amplified-variants.json','catalog-data/amplified-completeness-audit.md','frozen-trail-data.js']
input_hashes={p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in input_paths}
out={'inputSha256':input_hashes,'schema':'rft.outpost.full-data-audit.v1','checkedAt':'2026-10-16','baseCommit':'9c95d0151649f306807ecbaab6ecc8fee2aa326c','scope':'All modeled records plus 89 archived API configurations and 108 explicit connections; no claim that undocumented game content is complete. Categories overlap; totals must not be called unique game items.','counts':dict(collections.Counter(r['area'] for r in rows)),'fullyGameVerifiedRecords':0,'rows':rows,'wikiComparison':{'source':'https://arcraiders.wiki/w/index.php?title=Furniture&oldid=43358','htmlSha256':hashlib.sha256(html_path.read_bytes()).hexdigest(),'method':'HTML table extraction; exact normalized English label; duplicate catalog labels excluded from cost comparison; dash means missing, never zero.','counts':dict(collections.Counter(r['comparison']['craft'] for r in rows if 'comparison' in r))}}
Path('catalog-data/outpost-full-audit-20261016.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(out['counts']);print(out['wikiComparison']);print('rows',len(rows));print('conflicts',[(r['id'],r.get('comparison')) for r in rows if r['status']=='WIDERSPRÜCHLICH' and r['area']=='furniture'])
