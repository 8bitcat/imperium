# IMPERIUM — Geoscape

Familjens strategispel #8: en hybrid av **XCOM** och **Rise of Nations**. En stor
pixelerad jordglob (XCOM 2 Geoscape-stil) är centrum för hela spelet. TV:n är den
centrala skärmen — spelarna ansluter med mobilen via QR-kod och spelar därifrån.

**Live:** https://8bitcat.github.io/imperium/

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
