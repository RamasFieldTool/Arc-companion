# Rights and third-party content review

Last updated: 26 September 2026  
App: Ramas Field Tool  
Status: in progress — this is a release checklist, not a legal opinion.

## Goal

Before the first public Google Play release, every visual, map base, font, data source and third-party brand reference used by the shipped build or Store listing must have a documented source and an acceptable basis for use.

A source link alone is not proof that an asset may be redistributed inside an app. If a licence or permission cannot be confirmed, replace the asset with an original or clearly licensed alternative before public release.

## 1. Ramas Field Tool branding

### Simplified app icon

Files:

- `android/assets/icon/ramas-field-tool-icon-master-1024.png`
- `android/assets/icon/ramas-field-tool-play-icon-512.png`
- `android/assets/icon/ramas-field-tool-adaptive-foreground-1080.png`
- `android/assets/icon/ramas-field-tool-monochrome-foreground-1080.png`

Source/provenance is documented in `android/LOGO_SOURCE.md` and the selected concept was supplied/approved by Daniel Rogge.

Status: **provenance documented; final ownership/licence confirmation still required before public release.**

Action before release:

- retain the source record and hashes,
- confirm that the artwork may be used commercially/distributed through Google Play,
- ensure no official ARC Raiders logo or confusingly official branding has been copied into the final icon.

### Full marketing logo

The detailed ARC COMPANION / Ramas Field Tool marketing badge is recorded in `android/LOGO_SOURCE.md`.

Status: **provenance documented; final ownership/licence confirmation still required.**

Because it contains game-inspired imagery and the words ARC COMPANION, it must not be presented in a way that implies official affiliation with Embark Studios.

### Google Play feature graphic

File: `android/assets/store/ramas-field-tool-feature-graphic-1024x500.jpg`

Status: **prepared, but visual-source review remains required.**

Before release, confirm that every element in the feature graphic is either original Ramas Field Tool artwork, properly licensed, or otherwise permitted for Store use.

## 2. ARC Raiders name and Embark Studios references

The app describes itself as an independent, unofficial community tool and includes a non-affiliation disclaimer.

Status: **wording prepared; trademark/presentation review still required.**

Release rules:

- use ARC Raiders only to identify the game the tool relates to,
- do not use wording that suggests endorsement, partnership or official status,
- do not use official store badges or official-looking claims unless permission exists,
- preserve the non-affiliation statement in the Store listing and legal/privacy material.

## 3. Map base images — current release blocker

The current map system loads third-party map images remotely. The marker coordinates are separate community-derived data, but the underlying images themselves can still be protected visual works.

### Spaceport

Current image:
`https://www.arcraidersai.com/maps/spaceport.jpg`

Recorded source: Arc Raiders AI community map.

Status: **UNVERIFIED — do not assume redistribution/use rights.**

### Buried City

Current image:
`https://arcraiders.wiki/wiki/Special:Redirect/file/Buried_City_Map_Blank.png`

Recorded source: ARC Raiders Wiki – Buried City Map Blank.

Status: **UNVERIFIED — licence/permission must be checked.**

### Dam Battlegrounds

Current image:
`https://arcraiders.wiki/wiki/Special:Redirect/file/Dam_Battlegrounds_V2_Map_Blank.png`

Recorded source: ARC Raiders Wiki – Dam Battlegrounds V2 Map Blank.

Status: **UNVERIFIED — licence/permission must be checked.**

### The Blue Gate

Current image:
`https://arcraiders.wiki/wiki/Special:Redirect/file/Blue_Gate_Map_Blank.png`

Recorded source: ARC Raiders Wiki – Blue Gate Map Blank.

Status: **UNVERIFIED — licence/permission must be checked.**

### Stella Montis – Upper

Current image:
`https://arcraiders.wiki/wiki/Special:Redirect/file/Stella_Montis_Upper_Level_Map.jpg`

Recorded source: ARC Raiders Wiki – Stella Montis Upper Level Map.

Status: **UNVERIFIED — licence/permission must be checked.**

### Stella Montis – Lower

Current image:
`https://arcraiders.wiki/wiki/Special:Redirect/file/Stella_Montis_Lower_Level_Map.jpg`

Recorded source: ARC Raiders Wiki – Stella Montis Lower Level Map.

Status: **UNVERIFIED — licence/permission must be checked.**

### Riven Tides

Current image:
`https://arcraiders.wiki/wiki/Special:Redirect/file/Riven_Tides_Map_Blank.png`

Recorded source: ARC Raiders Wiki – Riven Tides blank map.

Status: **UNVERIFIED — licence/permission must be checked.**

### Required map decision before public release

For every map base, do one of the following:

1. document an explicit licence that permits the intended app/Store use and satisfy attribution requirements, or
2. obtain permission from the relevant rights holder, or
3. replace the image with an original/licensed map base that can be distributed safely.

Until that is done, the map imagery remains the main unresolved rights item for the public release.

## 4. Community marker and location data

The app contains manually transferred approximate Raider spawn positions and Weapon Case information. `maps.json` identifies community reference sources such as ARC Raiders Wiki, Wand, Raider Grid, arcraidersmap.cc and ARC Raiders Hub.

Status: **source attribution exists, but source terms/licences for systematic reuse still need review.**

The app should continue to:

- describe positions as approximate community information,
- avoid claiming official Embark confirmation,
- list reference sources in the map UI,
- avoid copying third-party explanatory text, artwork or database dumps unless the applicable licence permits it.

## 5. Item, quest and game-data sources

Known sources include Mahcks ARC Raiders Data API and RaidTheory/GitHub-hosted data.

Status: **technical sources documented; licence/terms review required for the exact data packaged or fetched by the final build.**

Before release, record for each source:

- project/owner,
- exact repository or endpoint,
- licence/terms,
- required attribution,
- whether data is bundled or fetched remotely.

## 6. Fonts

The current web application has used Google-hosted fonts such as Rajdhani and Space Grotesk in some versions.

Status: **font licence files and final delivery method must be documented.**

Preferred release approach:

- bundle permitted font files locally rather than requiring Google Fonts network requests,
- retain the applicable font licence notices in the release-source documentation,
- verify that only the fonts actually shipped by the frozen Android snapshot are listed.

## 7. Google Play screenshots

Screenshots have not yet been captured from the final Android build.

Status: **pending by design.**

Before Store upload:

- capture screenshots only from the final reviewed build,
- ensure no private notifications or personal information appear,
- re-check any visible third-party map/image content,
- do not add promotional artwork or claims that are not present in the product.

## 8. Release gate

Public release must not be marked rights-cleared until all of the following are complete:

- [ ] Branding ownership/licence confirmed
- [ ] Feature graphic visual sources confirmed
- [ ] Every shipped/displayed map base has an acceptable licence, permission or replacement
- [ ] Community/data-source terms reviewed
- [ ] Required attribution text recorded and included where necessary
- [ ] Font licences recorded for fonts actually shipped
- [ ] Final Store screenshots reviewed
- [ ] Final frozen Android snapshot checked for new third-party visuals or sources

The rights review should be repeated whenever a new map layer, map image, logo, font, screenshot source or third-party data source is added.
