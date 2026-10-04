# Item find locations test plan

Required before merge:
- Search `Magnetischer Beschleuniger`: Exodus + Matriarch + The Queen and mapped RaidTheory maps.
- Search `Kabel` / wires: show supplied `foundIn` categories when present in active catalog.
- Search `Rostige Werkzeuge` / rusted_tools: show Mechanical when present in active catalog.
- Item without data: explicit empty state.
- Details closed by default; open state survives item redraw.
- Direct and recycling-source result cards both include the details box.
- DE/EN/FR/ES/IT labels.
- 360px, 412px, desktop; dark/light; keyboard summary toggle.
- Planning/stock remains unchanged; no writes to arcNextRaid.
- External bots failure falls back without blocking search.

Browser automation is emulation only and must not be described as a physical Android-device test.
