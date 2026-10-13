#!/usr/bin/env python3
"""Export a validated current Mahcks catalog without changing the app.
Usage: python3 tools/export_mahcks_catalog.py current-items.json
Requires outbound HTTPS and requests. Fails closed on incomplete pagination.
"""
import datetime,json,sys,time
from pathlib import Path
import requests

URL="https://arcdata.mahcks.com/v1/items"
LIMIT=45

def collect(session):
    rows=[];seen=set();expected=None;offset=0
    while True:
        response=session.get(URL,params={"full":"true","offset":offset,"limit":LIMIT},timeout=15)
        response.raise_for_status()
        page=response.json()
        batch=page.get("items")
        if not isinstance(batch,list):raise ValueError(f"invalid items at offset {offset}")
        total=page.get("total")
        if not isinstance(total,int) or total<1:raise ValueError("missing total")
        if expected is None:expected=total
        if total!=expected:raise ValueError("total changed during export")
        if page.get("count") is not None and page["count"]!=len(batch):raise ValueError("page count mismatch")
        if page.get("offset") is not None and page["offset"]!=offset:raise ValueError("offset mismatch")
        if not batch:raise ValueError("empty page before completion")
        for item in batch:
            id=item.get("id")
            if not isinstance(id,str) or not id:raise ValueError("missing item ID")
            if id in seen:raise ValueError(f"duplicate item ID {id}")
            seen.add(id);rows.append(item)
        if len(rows)>expected:raise ValueError("more items than total")
        if not page.get("next"):
            if len(rows)!=expected:raise ValueError(f"incomplete {len(rows)}/{expected}")
            return rows
        if len(batch)!=LIMIT:raise ValueError("unexpected short non-final page")
        offset+=LIMIT
        if offset>10000:raise ValueError("pagination guard")
        time.sleep(0.1)

def main():
    if len(sys.argv)!=2:raise SystemExit(__doc__)
    output=Path(sys.argv[1])
    with requests.Session() as session:rows=collect(session)
    snapshot={"schema":"ramas-field-tool-item-snapshot","formatVersion":1,
        "generatedAt":datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "source":URL,"count":len(rows),"items":rows}
    output.write_text(json.dumps(snapshot,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"validated {len(rows)} items -> {output}")

if __name__=="__main__":main()
