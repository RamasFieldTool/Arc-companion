#!/usr/bin/env python3
"""Read-only structural checks for the Frozen Trail furniture catalog."""
import json,sys,collections
from pathlib import Path

def main(path):
    root=json.loads(Path(path).read_text(encoding="utf-8"))
    rows=root["furniture"]
    problems=[]
    ids=[x.get("id") for x in rows]
    if len(ids)!=len(set(ids)): problems.append("duplicate furniture ids")
    if len(rows)!=100: problems.append(f"expected 100 furniture, got {len(rows)}")
    languages=("de","en","fr","es","it")
    research=0
    for item in rows:
        key=item.get("id","<missing>")
        for prop in ("name","design"):
            if not isinstance(item.get(prop),dict) or any(not item[prop].get(lang) for lang in languages):
                problems.append(f"{key}: incomplete {prop} translations")
        if not item.get("category"):problems.append(f"{key}: missing category")
        craft=item.get("craft")
        if not isinstance(craft,list) or not craft:problems.append(f"{key}: missing craft")
        else:
            for part in craft:
                if not isinstance(part.get("quantity"),int) or part["quantity"]<=0:
                    problems.append(f"{key}: invalid craft quantity")
                if not isinstance(part.get("name"),dict) or any(not part["name"].get(lang) for lang in languages):
                    problems.append(f"{key}: missing craft material translation")
        r=item.get("research")
        if r is not None:
            research+=1
            if not isinstance(r,dict) or not isinstance(r.get("materials"),list) or not r["materials"]:
                problems.append(f"{key}: invalid research")
    print(json.dumps({"furniture":len(rows),"unique_ids":len(set(ids)),"research_entries":research,
        "without_research":len(rows)-research,"problems":problems,
        "caution":"Structure checks do not prove game accuracy or source completeness."},ensure_ascii=False,indent=2))
    return bool(problems)
if __name__=="__main__":
    if len(sys.argv)!=2:raise SystemExit("usage: python3 tools/audit_outpost_catalog.py outpost-catalog.json")
    sys.exit(main(sys.argv[1]))
