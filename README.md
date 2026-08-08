# IMPERIUM — Geoscape

Familjens strategispel #8: en hybrid av **XCOM** och **Rise of Nations**. En stor
pixelerad jordglob (XCOM 2 Geoscape-stil) är centrum för hela spelet. TV:n är den
centrala skärmen — spelarna ansluter med mobilen via QR-kod och spelar därifrån.

**Live:** https://8bitcat.github.io/imperium/ (klassisk V1) • https://8bitcat.github.io/imperium/v2/ (V2)

## V2 — städer, tillgångar & handel

`v2/` är den levande globen (V1 lämnas orörd som klassisk version):

- **Skarpa etiketter** — lands- och stadsnamn ritas i full skärmupplösning (pixelfont)
  ovanpå den pixelerade globen; V1:s oläsliga buffert-text är fixad
- **Städer** (Rise of Nations-stil) — topp ~8 städer per land (12 för USA/Kina/Indien/
  Ryssland/Brasilien) ur Natural Earth 10m, förbyggda till `v2/data/cities.json`;
  huvudstäder får bärnstensfärgad fyr, stadsljus blinkar, radar-ping på storstäder
- **Landsfakta-ruta** — flagga (flagcdn), invånare (Världsbanken), huvudstad,
  antal städer och naturtillgångar; data i `v2/data/facts.json`
- **Naturtillgångar** — 8 typer (olja, järn, guld, spannmål, timmer, fisk, uran,
  diamanter); kurerade för ~50 kända länder, deterministisk fallback för resten.
  Byggrecept definierade (INFANTERI=spannmål, STRIDSVAGN=järn+olja, …) för kommande
  byggsystem. Tar du ett land får du dess tillgångar (visas i rostern).
- **Levande handel** — resurspartiklar flödar mellan städer (huvudstad↔städer inrikes,
  huvudstad↔2 närmaste utländska huvudstäder), färgade efter resurs; inrikesrutter
  syns först vid inzoomning. Satelliter i omloppsbana. Allt togglingsbart:
  STÄDER / HANDEL / TILLGÅNGAR-legend.

Datafilerna byggs om med skripten i `tools/` (se nedan) — körs bara när källdata ändras.

## Så spelar ni

1. Öppna spelet på TV:n (webbläsare) → **STARTA TV-LÄGE**
2. Skanna QR-koden med mobilen (eller surfa till adressen och skriv rumskoden)
3. Skriv ditt namn → snurra på globen → klicka på ett land → **GÖR TILL HEMLAND**
4. TV:n flyger till landet, målar det i din färg och visar highlighten

`UTFORSKA JORDEN` = soloutforskning av globen utan multiplayer.

## Nuläge (v1)

- Pixelerad jordglob med riktiga landsgränser (Natural Earth via world-atlas,
  110m direkt + 50m högupplöst i bakgrunden)
- Alla länder klickbara/valbara, svenska namn (Intl.DisplayNames)
- Zoom (hjul/nyp), rotation (dra), tap för att välja land
- TV-läge: rumskod + QR, autorotation, flyg-till-highlight när någon tar ett land
- Multiplayer över PeerJS (samma mönster som lantliv m.fl.), upp till 8 spelare

## Roadmap

- **Städer** inne i länderna (Natural Earth populated places) — synliga vid inzoomning
- **Produktion**: hemlandet producerar arméer (RTS-resurser à la Rise of Nations)
- **Arméer på globen**: flytta trupper mellan länder, turordning
- **Strid**: när arméer möts → turbaserad taktikvy à la Advance Wars (GBA):
  minimap för truppförflyttning + "två skärmar"-vy vid anfall
- TV:n visar highlights/statistik medan striderna spelas på mobilerna

## Credits

Fordonssprites i stridsvyerna (v3): **BerkleyToreno** (berkleytoreno.newgrounds.com),
licens CC BY-NC-SA 3.0. Faktionssprites (v4): **umrex** (umrex.newgrounds.com),
CC BY-NC-SA 3.0 — inofficiellt W40k-fanverk, se `D:\Sprites\umrex-w40k\README.md`.
Taktikkartans tiles (v4): **Kenney "Tiny Battle"** (kenney.nl), CC0.
Icke-kommersiellt projekt; full licensinfo i respektive sprite-mapp.

## Utveckling

Ingen build — vanilla JS + ES-moduler. CDN: d3, topojson-client, peerjs, qrcode-generator.

```bash
node dev-server.js 8480   # → http://localhost:8480
```

(ES-moduler kräver en server — `file://` funkar inte.)

## Arkitektur

| Fil | Ansvar |
|---|---|
| `js/globe.js` | Pixelerad ortografisk glob: lågupplöst buffert + `image-rendering: pixelated`, scencache, picking via `d3.geoContains`, animering |
| `js/data.js` | Laddar world-atlas 110m → 50m progressivt |
| `js/names.js` | ISO numerisk → alpha-2 → svenska namn + flaggemoji |
| `js/net.js` | PeerJS host-authoritative (samma som lantliv) |
| `js/main.js` | Meny, TV-läge, spelarläge, utforskarläge, claims-protokoll |

Protokoll: klient→värd `hello {name}`, `claim {country}`; värd→klient
`welcome {you, players}`, `state {players}`, `deny {reason}`.
