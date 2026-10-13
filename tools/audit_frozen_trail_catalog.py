#!/usr/bin/env python3
"""Read-only compare of the September snapshot and a complete current API export.
Usage: python3 tools/audit_frozen_trail_catalog.py old.json current.json
Does not mutate game data, IDs, stock, or goals.
"""
import json,sys,collections
from pathlib import Path

def load(path):
    obj=json.loads(Path(path).read_text(encoding="utf-8"))
    records=obj.get("items") if isinstance(obj,dict) else obj
    if not isinstance(records,list): raise ValueError(f"{path}: items must be array")
    ids=[x.get("id") for x in records]
    if any(not isinstance(x,str) or not x for x in ids): raise ValueError(f"{path}: invalid id")
    if len(ids)!=len(set(ids)): raise ValueError(f"{path}: duplicate ids")
    if isinstance(obj,dict) and "count" in obj and int(obj["count"])!=len(ids):
        raise ValueError(f"{path}: count mismatch")
    return {x["id"]:x for x in records}

def main():
    if len(sys.argv)!=3: raise SystemExit(__doc__)
    old,new=map(load,sys.argv[1:])
    fields=["name","description","type","rarity","value","weightKg","stackSize","recyclesInto","salvagesInto","repairCost","repairDurability","vendors"]
    added=sorted(new.keys()-old.keys())
    removed=sorted(old.keys()-new.keys())
    changed={}
    for id in sorted(new.keys()&old.keys()):
        delta={k:{"before":old[id].get(k),"after":new[id].get(k)} for k in fields if old[id].get(k)!=new[id].get(k)}
        if delta:changed[id]=delta
    report={"old_count":len(old),"new_count":len(new),"added_ids":added,"removed_ids":removed,"changed":changed,
            "note":"Differences are source changes, not automatically verified game changes. No automatic corrections."}
    print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=="__main__":main()
