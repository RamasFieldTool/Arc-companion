# Usage: python scripts/build-weapon-upgrades.py <downloaded-arc-tracker-items.json>
# Run from the repository root. Does not fetch data or change user state.
import json,re,hashlib
from pathlib import Path
import sys
source_path=Path(sys.argv[1])
src=json.loads(source_path.read_text());items={x['id']:x for x in src['items']}; ws=[x for x in items.values() if x.get('isWeapon') and 'amplified' not in x['id']]; families={}
for x in ws:
 fid=re.sub(r'_(?:i|ii|iii|iv)$','',x['id']);f=families.setdefault(fid,{'id':fid,'name':{},'category':x['type'],'tiers':[],'transitions':[]})
 f['tiers'].append({'id':x['id'],'label':x['id'][len(fid)+1:].upper() or '—','name':x['name'],'imageFilename':x.get('imageFilename')})
 for e in x.get('upgrades',[]):
  if e['to'] not in items:raise Exception(e['to'])
  if 'amplified' in x['id']:continue
  cost=e.get('cost'); valid=isinstance(cost,dict) and bool(cost) and all(isinstance(q,int) and q>0 for q in cost.values())
  f['transitions'].append({'from':x['id'],'to':e['to'],'materials':[{'itemId':k,'quantity':q} for k,q in cost.items()] if valid else None,'requires':e.get('requires',[]),'stationRequirementKnown':any('station' in r for r in e.get('requires',[])),'status':'source-documented-not-game-confirmed' if valid else 'unknown','source':'https://arctracker.io/items/'+x['id']})
for f in families.values():
 f['tiers'].sort(key=lambda t:len(t['label']) if t['label']!='IV' else 4)
 first=next((t for t in f['tiers'] if t['label']=='I'),f['tiers'][0]);f['name']={l:re.sub(r' I$','',n) for l,n in first['name'].items()};f['imageFilename']=first['imageFilename']
 for e in f['transitions']:
  if 'amplified' in e['to']:
   a=items[e['to']];f['tiers'].append({'id':a['id'],'label':'Amplified','name':a['name'],'imageFilename':a.get('imageFilename')})
needed={m['itemId'] for f in families.values() for e in f['transitions'] for m in e['materials'] or []}
# Also include shared Amplified research/perk material labels.
a=json.load(open('catalog-data/amplified-variants.json'))['testIntegration'];needed.update(a['materials'])
materials={id:{'name':items[id]['name'],'imageFilename':items[id].get('imageFilename')} for id in sorted(needed) if id in items}
result={'schema':'rft-weapon-upgrades','formatVersion':1,'checkedAt':'2026-10-26','source':'https://arctracker.io/api/items','sourceVersion':src['version'],'sourceGeneratedAt':src['generatedAt'],'sourceSha256':hashlib.sha256(source_path.read_bytes()).hexdigest(),'evidence':'Source data inspected; not verified in game. Historical RaidTheory costs are superseded by explicit current ARC Tracker edges. Unlisted station requirements remain unknown.','families':list(families.values()),'materials':materials}
Path('catalog-data/weapon-upgrades.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('families',len(families),'transitions',sum(len(f['transitions']) for f in families.values()),'materials',len(materials))
