# IMPERIUM — Claude-kontext

XCOM × Rise of Nations: en jordglob (pixel eller 3D, XCOM 2 Geoscape-stil) är hela
spelplanen. Solo i webbläsaren, eller TV = värd + mobiler som spelare (QR-join).
Familjespel — håll innehållet familjevänligt (därför Tyska kejsardömet, inte Tredje riket).

## Vilken mapp är vilket spel

| Mapp | Version | Status |
|---|---|---|
| rot, `v2/`, `v3/` | V1–V3 | frysta, rör inte |
| **`v4/`** | **V5** (`VERSION` 5.x) | **huvudspelet — allt arbete sker här** |
| `v6/` | 6.0 "TRADE WARS" | ett **annat** spel som ärvt V5:s gränssnitt — rör bara om det uttryckligen gäller V6 |

Det finns ingen `v5/`-mapp. En bugg som finns i båda: fixa i `v4/`, nämn att `v6/` har samma.

## Köra

```bash
node dev-server.js 8480      # → http://localhost:8480/v4/
```

Ingen build: vanilla JS + ES-moduler, CDN-bibliotek (d3@7, topojson-client@3,
peerjs@1.5.4, qrcode-generator@1.4.4). `file://` funkar inte.

## Koden i v4/js

`main.js` (~6000 rader) är navet: meny, solo/TV/spelarläge, nationsmotorn
(`initNation`, `recomputeNation`, `tickDay`), krig, AI-världen (`aiWorldTick`,
`worldCtx()` = solo lokalt / TV på värden), alla paneler, `saveGame`/`loadGame`.
Övriga filer är mest **data** — balans justeras där, inte i main.js:

| Fil | Innehåll |
|---|---|
| `stats.js` | 22 nationsvärden + `computeStats`. Nya stat-nycklar MÅSTE finnas här, annars noll effekt utan fel |
| `laws.js` · `ideologies.js` · `research.js` | lagar (23 kategorier) · ideologier/doktriner + axlar · 18 grenar × 9 nivåer |
| `events.js` · `modifiers.js` · `development.js` | 87 händelser med villkor · 45 modifierare · stadsnivå/infrastruktur 0–100 |
| `war.js` · `integration.js` · `stance.js` | casus belli/krav/historiska riken · integration av erövrat land · ländernas hållning |
| `diplomacy.js` · `blocs.js` · `ministers.js` · `ranking.js` | relationer/sanktioner · block + fanor · kabinett · världsrankning |
| `economy.js` · `resources.js` · `buildings.js` · `factions.js` · `leaders.js` | inkomst/arméstorlek · naturtillgångar · stadsbyggnader · 4 faktioner · 200+ ledare |
| `battleA.js` · `units.js` | taktikstriden (Advance Wars-lik, används för ALLA krig) · enheter/sprites. `battleB.js` är oanvänd |
| `globe.js` · `globe3d.js` | pixelglob (d3) · WebGL-planet. All ritning går via `_project`/`_front` så den funkar i båda |
| `net.js` · `data.js` · `names.js` | PeerJS (värden äger världen) · kartdata · svenska landsnamn |

Land-id = ISO 3166-1 numeriskt som sträng (`'752'` = Sverige).

## Fällor som redan kostat tid

- **Nya fält i `state.solo` måste in i BÅDE `saveGame` och `saveSession`** (och läsas
  tillbaka) — annars tappar ett omladdat parti dem.
- Pixelfonten saknar U+2212 (−) — skriv vanligt bindestreck i text som visas.
- `show(el)` sätter inline `display` och slår ut `.show`-klassen — blanda inte de två på samma element.
- Topbaren är `pointer-events: none` — nya knappar där behöver `pointer-events: auto`.
- Mobil-CSS (@820px): `#nation` är dimman bakom panelen — krymp `#natwrap`.
- Hovertext i forskning använder klassen `.desc` (`.dp` är den gröna deltafärgen).
- Resursnyckeln heter `'DIAMANT'`, inte `'DIAMANTER'`.
- Saldon klampas i `tickDay` — ny inkomst/kostnad ska gå genom samma ställe.
- 3D: linjer ritas additivt → håll alfa lågt. `uniform` som finns i båda shadrarna
  måste deklareras `highp` i fragmentshadern.
- d3-polygon ritad medurs täcker resten av jorden — testa `geoContains` och vänd ringen.
- Multiplayer: TV:n äger världen. Ändringar i spellogiken måste fungera både solo och via `worldCtx()`.

## Testa

```bash
node tools/smoke.mjs          # lokal kod, startar egen server på 8481
node tools/smoke.mjs --live   # mot 8bitcat.github.io efter push
```

Spelar ett soloparti (hemland → faktion → 120 dagar + AI → alla NATION-flikar →
kartlager + 3D → spara/fortsätt). Slutkod 0 = `ALLT GRÖNT`. **Titta alltid på
skärmbilderna i `.smoke/`** — tom konsol betyder inte att det ser rätt ut.
Ny funktion = skriv ett eget Playwright-skript (i scratchpad) som når just den och
ta en skärmbild av den. Testkrokar: `window.IMPERIUM` (state), `IMPERIUM.debug.*`,
`window.__imperium`. Playwright lånas från `D:\Qisy\QISYFrontend\QISYFrontend-1\node_modules`
(`PLAYWRIGHT_DIR` pekar om). Röktestet täcker bara solo — ändras nätkod, testa TV + två mobiler.

## Släppa en version

1. Höj `VERSION` / `VERSION_DATE` / `VERSION_NAME` överst i `v4/js/main.js` — enda
   sanningskällan (syns i menyn, topbaren och som starttoast). Fix = 5.5.x, nytt = 5.x.0.
2. `node tools/smoke.mjs` → ALLT GRÖNT + skärmbilderna granskade.
3. Commit på `main`: `feat(v5): …` / `fix(v5): …`, bodyn förklarar varför.
4. `git push` med gh-kontot **8bitcat** aktivt (`gh auth status`; `gh auth switch --user 8bitcat`).
5. Vänta på Pages: `gh api repos/8bitcat/imperium/pages/builds/latest --jq '.status+" "+.commit[0:7]'`
   ska visa `built <ny commit>`. Sedan `node tools/smoke.mjs --live`.
6. Spelarna behöver Ctrl+F5 — Pages cachar i upp till 10 minuter.

Live: https://8bitcat.github.io/imperium/v4/ (V5) · https://8bitcat.github.io/imperium/v6/ (TRADE WARS)

## Licenser

Sprites i striderna: **BerkleyToreno** och **umrex** (CC BY-NC-SA 3.0 — kreditering
krävs, aldrig kommersiellt; bakgrunderna i BerkleyTorenos ark är Nintendo-material och
får inte användas). Taktikkartans tiles: **Kenney Tiny Battle** (CC0). Credits står i
menyn och README.
