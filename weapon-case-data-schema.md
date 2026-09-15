# Weapon Case intel model — V2.13.1

Weapon Case layers are opt-in and **OFF by default**. A marker represents a possible community-reported spawn, never a guaranteed case.

## Dataset fields
- `map`, `type`, `defaultVisible`
- `lastReviewed`, `status`
- `reportedPool` only when a source reports a count; it is not presented as an official total
- `disclaimer.de/en`
- `sources[]`
- `points[]`

## Point fields
Each point may contain:
- `id`: stable map-specific ID
- `x`, `y`: percentage coordinates; omit/null until position can be placed responsibly
- `poi.de/en`: named area/POI when supported
- `location.de/en`: useful local description when supported
- `access.type`: `open`, `key`, `keycard`, `breach`, `zipline`, `roof`, `interior`, `other`, or `unknown`
- `access.de/en`: human-readable access note
- `confidence`: `verified-cross-source`, `community-strong`, `approx`, or `candidate`
- `sourceRefs[]`: source labels matching dataset `sources`
- `note.de/en`: optional caveat

Unknown information is omitted rather than guessed. UI must not convert missing information into a claim.
