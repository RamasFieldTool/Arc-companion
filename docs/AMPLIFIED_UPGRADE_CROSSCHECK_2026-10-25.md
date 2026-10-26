# Amplified weapon upgrade reconciliation (2026-10-25)

Scope: five previously unresolved names in the isolated test branch. Cross-checked the weapon's ARC Tracker upgrade tree against ARC Raiders Wiki's Amplification/Amplified Weapons and Amplified Research pages. These are community data sources, **not** direct in-game verification.

| Family | Prior wiki label | ARC Tracker display | Source-backed result |
|---|---|---|---|
| Osprey | Straight Bolt | Ergonomic Bolt | Added one node; 3 Fluted Rotor Core; Action Economy |
| Jupiter | Straight Bolt | Ergonomic Bolt | Added one node; 3 Fluted Rotor Core; Action Economy |
| Rascal | Incendiary Grenade(s) | Incendiary Rounds | Added one node; 3 Fossilized Lightning; Compact Combustion Charges |
| Hullcracker | Incendiary Grenade(s) | Incendiary Rounds | Added one node; 3 Fossilized Lightning; Compact Combustion Charges |
| Equalizer | Anti Shield | *Not listed in ARC Tracker upgrade tree* | **Still disputed. Not added as a selectable node or cost.** |

The wiki describes incendiary *grenades* for the Rascal/Hullcracker explosive projectile and the research page uses "Incendiary Grenades"; ARC Tracker item pages label the same researched perk "Incendiary Rounds". The underlying API item slug for the bolt is `straight_bolt`, but the item page displays "Ergonomic Bolt". Preserve these labels as aliases, not duplicate upgrades.

New research records:
- [Action Economy](https://arctracker.io/research/action-economy): deal 1,000 damage with Hairpin in one raid; 5,000 RP; 8 Sentinel Firing Core.
- [Compact Combustion Charges](https://arctracker.io/research/compact-combustion-charges): deal 3,000 damage with Blaze Grenades; 5,000 RP; 5 Bombardier Cell. Source includes a loadout-icon requirement that is not fully resolved.

Cross-check sources:
- [Osprey](https://arctracker.io/items/osprey_amplified)
- [Jupiter](https://arctracker.io/items/jupiter_amplified)
- [Rascal](https://arctracker.io/items/rascal_amplified)
- [Hullcracker](https://arctracker.io/items/hullcracker_amplified)
- [Equalizer](https://arctracker.io/items/equalizer_amplified)
- [Independent community wiki](https://arcraiders.wiki/wiki/Amplified_Weapons)
- [Independent research wiki](https://arcraiders.wiki/wiki/Amplified_Research)
- [Wiki overview that mentions disputed Equalizer Anti Shield](https://arcraiders.wiki/wiki/Amplification)

Resulting testIntegration: 44 nodes, 89 configurations, 108 graph edges, 15 research projects, 1 disputed mapping. The counts are catalog coverage, not an in-game completeness guarantee. No new artwork or invented material costs.
