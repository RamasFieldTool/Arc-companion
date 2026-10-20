# Community contest archive

`fan-contest-archive.json` is the local, static source for past contest winners. An empty `entries` list is intentional: the gallery shows no archive cards until a specific record is approved.

Each record needs:

- `id`: stable lowercase slug using letters, digits, and hyphens.
- `title`, `contest`, `period`, `group`, and `creator`: reviewed display text.
- `image`: existing project image under `assets/fan-creations/`.
- `alt`: concise description of the image.
- `permissionStatus`: exactly `documented`.
- `permissionReference`: a link or internal reference to the recorded usage permission.

Before adding an entry, confirm the image may be displayed, record the creator credit, and verify contest dates and group attribution. Do not use the live contest card as an archive record until its date and group details have been checked. The page validates required fields and the image path and renders text with DOM text nodes. No submission is stored by the archive; the visible contribution guide opens only after the visitor chooses it.
