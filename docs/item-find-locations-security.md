# Safety guards

- All item/category/bot/map labels are escaped before insertion into generated markup.
- The only generated external source link is the hard-coded RaidTheory repository URL.
- ARC data is schema-checked before replacing the local fallback.
- No item search/open action performs a network request.
- No localStorage planning or inventory key is written by the find-location feature.
