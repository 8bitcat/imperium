# IMPERIUM — Claude-kontext

XCOM × Rise of Nations-hybrid. Pixelerad jordglob (XCOM 2 Geoscape-stil) är centrum
för allt. TV = värd/central skärm (QR-join), mobiler/datorer = spelare. Se README.md
för roadmap och arkitektur.

## Viktiga beslut

- **Ingen build-pipeline** — vanilla JS + ES-moduler + CDN (d3@7, topojson-client@3,
  peerjs@1.5.4, qrcode-generator@1.4.4). Samma filosofi som övriga familjespel.
- **Globen renderas i låg upplösning** (buffert ≈ kortsidan/220 → pixelSize 2–4) och
  skalas upp med `image-rendering: pixelated`. Scenen cachas i egen canvas; bara
  selektionspulsen ritas per frame. Autorotation = full omritning per frame (OK).
- **Picking** görs geografiskt (`proj.invert` + bbox-filter + `d3.geoContains`), ingen
  pick-canvas. Antimeridian hanteras i bbox-testet.
- **Länders id** = ISO 3166-1 numeriskt (world-atlas). Stabilt mellan 110m/50m så
  selektion + claims överlever detaljbytet.
- **Svenska namn** via Intl.DisplayNames + N2A-tabell i names.js; fallback engelska.
- **Nät**: host-authoritative PeerJS, kopierat från lantliv (beprövat). Rumskod 4 tecken,
  prefix `imperium-`. TV:n är enbart värd/åskådare, inte spelare.

## Testning

Playwright finns i `D:\Qisy\QISYFrontend\QISYFrontend-1\node_modules` — smoke-testet
(solo + TV + telefon-join + claim, med screenshots) kan köras fristående med node.
Verifiera alltid visuellt med screenshots, inte bara "inga konsolfel".

## Deploy

GitHub Pages på 8bitcat/imperium (main-branch, rot). `gh auth switch --user 8bitcat`
före push, växla tillbaka till carlpalsson efteråt.
