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
| `stats.js` | 22 nationsvärden + `computeStats` (V5.16: källan `protest` = missnöjet). Nya stat-nycklar MÅSTE finnas här, annars noll effekt utan fel. V5.15: varje värde har `total` (−100…100, det statistiken och allt gammalt läser) och `raw` (inget tak uppåt); `UNCAPPED` = de som producerar och visas med raw |
| `laws.js` · `ideologies.js` · `research.js` | lagar (93 kategorier, 1 052 alternativ — V5.17: ett ✨ och ett 💀 i varje) · 19 ideologier/doktriner + axlar + sidogrenar · 27 grenar × 9 namngivna nivåer + OÄNDLIGT många till (`tierOf`, `tierCost`, `tierDays`), förkunskaper mellan grenar (`NEEDS`), förbandens egenskaper (`unit`: hp/rng/mv/heal → `unitUpgrades`) |
| `laws-extra.js` | V5.7: nya alternativ i befintliga lagar (`after`-position, `locks`, `effects`), splitsas in i LAWS vid laddning |
| `laws-more.js` | V5.8: helt nya lagkategorier som bär sin egen `axis`/`dir`, `locks` och `effects` — läses av laws.js, ideologies.js och statistics.js |
| `laws-511.js` + `laws511/part1–17.js` | V5.17: del 12–16 = ✨/💀-valen, del 17 = åtta nya lagar. V5.11 LAGARNAS MAKT: tre nya val i varje lag (`EXTRAS` → laws-extra.js), fyra nya lagar (`NEW` → laws-more.js) och en stark statistikuppsättning för VARJE alternativ (`FX` → statistics.js, läggs sist och vinner per mått) |
| `events.js` · `modifiers.js` · `development.js` | 2 667 händelser med villkor (V5.17: +139 om utopier och brutala lagar; V5.15: +1 044 i nio nya teman; V5.16: +785 i sju teman som följer av vad spelaren gör — reaktioner, protester, migration, statsfinanser, demokrati, samhällsliv, konsekvenser) · 48 modifierare · stadsnivå/infrastruktur 0–100 |
| `war.js` · `integration.js` · `stance.js` | casus belli/krav/historiska riken (32 st — BARA grundlandet `core` kan utropa sitt rike, och ALLA `lands` krävs helt annekterade: lydstater och delvis tagna länder räknas inte, se `empireOwnedIds` i main.js) · integration av erövrat land · ländernas hållning |
| `geopolitics.js` | V5.8: VÄRLDSLÄGET — kalla krig (spänning 0–100, incidenter, kris → ibland varmt krig), val i demokratier, revolutioner/kupper som river upp lagarna. Ren logik; main.js kopplar in den via `geoApi(ctx)` i `aiWorldTick` |
| `diplomacy.js` · `blocs.js` · `ministers.js` · `ranking.js` | relationer/sanktioner · block + fanor · kabinett · världsrankning |
| `economy.js` · `resources.js` · `buildings.js` · `factions.js` · `leaders.js` | inkomst/arméstorlek · naturtillgångar · stadsbyggnader (40 st, 15 platser per stad — se Byggboom) · 4 faktioner · 200+ ledare |
| `battleA.js` · `units.js` | taktikstriden (Advance Wars-lik, används för ALLA krig) · enheter/sprites. `battleB.js` är oanvänd |
| `globe.js` · `globe3d.js` | pixelglob (d3) · WebGL-planet. All ritning går via `_project`/`_front` så den funkar i båda |
| `net.js` · `data.js` · `names.js` | PeerJS (värden äger världen) · kartdata · svenska landsnamn |
| `real.js` | V5.6: allt som VISAS i riktiga tal — 1 💰 = 100 miljoner $, 1 🧍 = 1 000 människor, förband i soldater. Spelet räknar internt i gamla enheter |
| `statistics.js` | V5.16: 391 verkliga mått i 19 grupper (tidigare 316 i 15) (V5.14: +37 Världsbanksmått `RAW_KEYS_514`, +18 brott i `model3`, lagarnas effekter på dem i `LAW_EFFECTS_514`) per land (data/indicators.json; brott är modeller, märkta ~) som nationsvärden + lagar (`LAW_EFFECTS`) flyttar; rikes-ihopräkning, rankningar, befolkningspyramid (`realmPyramid`, Världsbankens 5-årsgrupper per kön; `T = null` = startläget) |
| `events/*.js` | V5.6: händelser per tema, ihopslagna i `events.js` |
| `faith.js` · `country-data.js` | V5.12 TRON: folkets tro per land (`RELIGION_SHARES`, ungefär Pew 2020), statens tro via religionslagen (`faithKind`: state/neutral/none), omvändelse i steg per land och kaos när staten och folket tror olika (`chaosOf`, `chaosMods`) |
| `bank.js` | V5.13 BANKEN: kreditbetyg AAA–D (`ratingOf`: skuld delat med välstånd + stabilitet, oro, korruption, krig, skuldbroms, missade betalningar), ränta/längsta plan/lånetak per betyg, annuitet (`annuity`), bankruttkris (`crisisMods`) |
| `passport.js` | V5.12 NAMNET: landets identitet (`defaultIdent` ur `OFFICIAL` i country-data.js: officiellt namn, ISO alpha-3, passfärg) och passet med riktiga MRZ-rader (`passportHtml`) |

**Befolkningen lever (V5.7):** `state.facts[cid].p` ändras var 10:e dag (`tickPopulation`,
1 spelår = 120 dagar) med `popchange` ur statistics.js; startvärdet ligger i `p0`. Allt som
läser `facts.p` (inkomst, arméstorlek, statistik) följer med. Sparas som `pops` i sparfilen.

**Världen är lugnare (V5.8):** `AI_CALM` (main.js) skalar AI:ns expansion, erövrare vilar
(`world.rest`), och stater i kallt krig rustar hellre än anfaller. Spelarens färg ligger i
`state.solo.color` (`soloColor()`/`soloInk()`/`puppetColor()`); globe.js gör gråskalor ljusa
(`ownerFill`) och ger mörka riken ljus kant (`ownerEdge`).

**Spela med kompisar (V5.9):** tre lägen — `solo`, `tv` (värd som äger världen) och `player`.
SKAPA RUM (`createRoom`) startar värden i en dold iframe `?server=1&name=…` (TV-logiken,
`SERVER`-flaggan, `globe.sleeping` = ingen ritning) som postar rumskoden till sidan, som
sedan går med som vanlig `player` (`state.hosting`). Kompisar går med på koden (`#join`) eller
`?room=KOD`. Färg i ett rum = värdens `player.color` (meddelandet `color`). Värdrummet sparas i
`imperium.room` (`ROOM_KEY`, menyn: FORTSÄTT RUMMET), solo/TV i `imperium.game`.

**Tron och namnet (V5.12):** fliken LANDET i NATION. `state.solo.faith` = { rel (statens tro), by: {cid: [[tro, andel]]} omvändelsesteg, chaos 0..1 } — `tickFaith` omvänder dagligen och ger incidenter; kaoset går in som egen källa `faith` i `computeStats` och via `setFaith` i statistiken. `religionFor(hemland)` följer statens tro. `state.solo.ident` = { off, short, code, cover, word, emblem, holder, renamed, day } — namnet byts EN gång; kortnamnet skrivs in i `globe.getCountry(cid).name` (`setCountryName`, originalet i `name0`) så det syns överallt. I rum skickas det som `realm` i `nation`-meddelandet (och `rename`), värden lägger det på `player.realm` och alla kör `applyIdent()` i `applyState`.

**Inga gränser (V5.15):** pengar, forskningspoäng, politisk makt och rekryter per dag räknas på `stats.X.raw` (tickDay) — oändlig forskning ger oändlig avkastning. Forskningspoäng = 1 + raw research × 0,08 + rikets verkliga FoU (`s.rdNow`, % av BNP ur `tickIndLag`) × `moneyPerDay()` × 3 + byggnader (`researchIncome`). Flera projekt samtidigt (`researchSlots`: ett till per 80 research), takten `researchSpeed`, en gren en nivå i taget och nivåer väntar på sina förkunskaper (`activeResearch`), slumpade genombrott/bakslag. Förbanden: `battleBoost().up` = `unitUpgrades` — battleA.js läser hälsa (dämpar skadan, `_soak`), räckvidd (`rangeOf`, motanfall bara inom räckvidd), rörlighet och läkning (`_heal` vid varje turstart); `autoResolve` tar boostarna som valfria argument.

**Händelserna (V5.15):** `nextEventGap()` lottar avståndet (ibland tätt, ibland långt), vikterna skakas om vid varje dragning, `eventInstance()` fyller i platshållarna ({rike} {granne} {land} {stad} {huvudstad}, versaler i titlar) och skalar pengarna efter rikets dagsinkomst. Val kan ha `risk` (utfallet lottas och visas i samma ruta) och `next` (följdhändelse om 10–45 dagar i `s.eventQueue`, sparas). `chain: true` = lottas aldrig, kommer bara via next; `rare: true` = väger en fjärdedel.

**Verkligheten (V5.16, `realism.js`):** saker tar tid.
- **Tröghet:** varje statistikmått glider mot sitt mål i verklig takt (`lagStep`: halveringstid i spelår + ibland ett tak per år, `SPEED`/`GROUP_HL`). Ett nytt parti börjar i verkligheten (`indLag` = 0), inte vid målet. Invandrarandelen kan inte växa fortare än nettoinvandringen (`migrantCap`). Härledda mått (BNP, demokratiindex, skuld i dollar) räknas om efter trögheten med `refreshDerived` (statistics.js), och de står i `NO_LAG`.
- **Lagar och ideologi glider in:** nationsvärdenas lag- och ideologikällor är `s.lawFx`/`s.ideoFx` (`tickPolicyPhase`, ungefär en månad). Målet visas med pilar i ÖVERSIKT (`policyGoalStats`).
- **Underskott:** `s.res.money` får gå under noll. `creditLine()` = min(bankens lånetak, ett halvårs inkomster), och bara när Income ≥ `DEFICIT_FLOOR` (-70). Alla köp går via `canAfford`/`spendable`, och händelserna läser `c.spend`. Underskottet kostar ränta (bankens + 2 %) och räknas in i kreditbetyget. Går det förbi krediten blir varje månad en missad betalning. En lag som pressar Income under -70 stoppas när kassan är under noll.
- **Missnöje:** `s.griev` = {slag: 0–100}, `GRIEV_KINDS`. Varje lagändring betygsätts (`lawPopularity`/`grievFromChange`) och loggas i `s.lawLog` (`noteLawChange` — anropa den vid VARJE lagändring). Underskott, kris och invandring som går fortare än integrationen fyller på (`tickGriev`). Missnöjet blir egen källa `protest` i `computeStats` (`protestMods`).
- **Demokratiindex:** EIU 2024 (`democracy-data.js`, 167 länder). Övriga skattas ur Världsbankens styrningsmått (`DEMO_FIT`). Fem delindex (`DEMO_SUBS`) som lagarna drar mot nivåer med operatorn `['~', nivå, styrka]` (`LAW_EFFECTS_516`).
- **Statistiken:** 391 mått i 19 grupper, varav 75 nya: DEMOKRATI & STYRE, STATSFINANSER, MIGRATION & INTEGRATION, VARDAG & PLÅNBOK, plus hälsa, skola och el. Verkliga tabeller ligger i `T516`, modellerna i `model516`.
- Nya fält i `state.solo`: lawFx, ideoFx, griev, lawLog, indHist (bilder var 30:e dag för `c.trend`).

**Ytterligheter (V5.17, `realism.js` + `laws511/part12–17.js`):** varje lag har ett ✨ och ett 💀 val, och det finns åtta nya lagar.
- **✨ Utopi** (`option.utopia`, `option.sting`): `mods` är lockelsen. Från dag `STING_START` (20) efter att lagen antogs växer stinget linjärt till fullt efter `STING_DAYS` (220) dagar till, och samtidigt halveras lockelsens positiva delar (`utopiaFx`). Det blir en egen källa `utopia` i `computeStats` (`utopiaMods`). Missnöjet växer och spelaren varnas i tre steg (`tickExtremes`).
- **💀 Brutalt** (`option.brutal`, `option.shame`): omvärlden fördömer valet. När lagen antas sjunker relationerna (`noteLawChange`), och så länge den gäller drar `naturalRelTo` ner det naturliga läget med `shame × shameWeight(auth)` (fria länder mest). Det leder till sanktioner via `worldSanction`. Folket glömmer inte: missnöjet fylls på i `tickExtremes`.
- **Partiets linje** (`preferredIndex`) och harmonins tolerans räknas bara bland de vanliga valen (`plainOptions`). Grannregeln i ideologies.js hoppar över ✨/💀-val. Ytterligheterna är alltid spelarens eget val.
- `s.lawSince` = {lag: dag} och sätts av `noteLawChange`. `s.utopiaWarned` håller reda på varningsstegen. Båda sparas.
- **Händelserna** (`events/ytterligheter.js`, prefix `yt_`): villkoren `c.utopias`, `c.utopiaCrack`, `c.utopiaAge`, `c.brutals`, `c.brutalAge` och `c.shame`; platshållarna `{utopi}`, `{utopilag}`, `{brutal}` och `{brutallag}`; valet `undo: 'utopi' | 'brutal'` (`undoExtreme`).

**Byggboom (V5.17, `buildings.js`):**
- Städerna har 15 platser (`CITY_SLOTS`), och stadspanelen visar ALLA städer (`cityPanelCities`). Spelaren bockar för städer och bygger i alla på en gång (`buildChooser` och `buildTargets`).
- Stadsbyggnaderna byggs parallellt, förbanden ett i taget.
- Nya fält:
  - `stats` ger nationsvärden efter täckning, alltså andelen av rikets folk som bor i en stad med byggnaden (`buildingCover` → `coverageMods`, källan `buildings`).
  - `drift` är driften i % av rikets dagsinkomst vid full täckning, och `driftFix` är % per byggnad.
  - `perCountry` begränsar hur många som får byggas i ett land, och `needs` anger råvaror som krävs.
- Avkastningen (`daily`) är full i landets första 14 städer per sort och avtar sedan (`yieldWeight`).
- Infrastruktur och stadsnivå har ingen kö-gräns. Varje land och slag bygger sitt första steg parallellt (`queueDev(cid, kind, steg)`, `devPlan`).

**Statsskulden (V5.13):** `state.solo.bank` = { debt (💰), plan (år), months kvar, missed, defaultUntil, crisis, log }. Rikets BNP i spelets pengar = `bankY()` (fyra spelår av grundinkomsten). Startskulden = rikets verkliga statsskuld i % av BNP. `tickBank` betalar var 30:e dag; räcker pengarna inte läggs resten på skulden och efter 3 missade månader blir det statsbankrutt (halva skulden struken, betyget D i ett år, kris). Lagarnas och nationsvärdenas skuldeffekt (`s.debtPolicy` från `tickIndLag`) blir ett månadsunderskott eller -överskott (/40 per månad). Statsskuld och Räntekostnader i STATISTIK skrivs över med bankens siffror (`applyBankToIndicators`), och förhandsrutan för lagar visar skuldeffekten som "STATEN LÅNAR X % AV BNP MER PER ÅR".

Land-id = ISO 3166-1 numeriskt som sträng (`'752'` = Sverige).

### Regler som gäller för nya saker
- **Ny lagkategori:** alternativen i ordning pol→pol, exakt ett `default`, och en rad i
  `LAW_AXIS` (ideologies.js) — annars har ideologierna ingen åsikt om den.
- **Varje alternativ utom default ska ha minst 5 statistikeffekter** (V5.11) — Henry vill att
  lagarna syns i STATISTIK. Ett helt varv i en lag kostar högst 90 ⚖️ (`lawStepCost`), hur många
  val lagen än har. Nytt val bredvid ett som en ideologi KRÄVER kan tappa kravet (grannregeln i
  ideologies.js) — jämför `requires` före/efter.
- **Ny ideologi:** lägg den som sidogren (`branchOf`) om den inte självklart hör hemma
  i ett led, och lägg till den i `IDEO_AXIS` (integration.js) och `IDEO_FLAGS` (blocs.js).
- **Statistiken:** bara skillnaden mot landets STARTLÄGE flyttar måtten (det verkliga
  datat har redan landets politik). Ny data: `node tools/build-indicators.mjs`.
- **Ny händelse:** minst ett val utan kostnad (annars kan spelaren fastna i rutan),
  och `node tools/check-events.mjs` ska ge 0 fel. Kedjehändelser (`chain: true`) har inget
  `when` och måste nås av ett `next`; kontrollen säger till annars.
- **V5.16-händelser:** `kind` (missnöjets slag) och `react: true` (en reaktion som väger fem
  gånger mer). Valen kan ha `undo` (true = lagen händelsen handlar om), `griev` (±40) och
  `ind` (chocker i statistiken, bara mått i `SHOCKS`). `{lag}`/`undo: true` kräver att `when`
  frågar `c.cut`/`c.raised`/`c.changed`. Villkoren har också `c.griev`, `c.grievOf`, `c.deficit`,
  `c.spend`, `c.debt`, `c.rating(Idx)`, `c.migRate`, `c.demo` och `c.trend(id)` (se events.js).
- **Ny lagändring i koden:** anropa `noteLawChange(cat, från, till)`, annars märker folket inget.
- **Nya ✨/💀-val (V5.17):**
  - En utopi kräver `sting` med minst 4 nationsvärden, alla dåliga och minst 1,3 × lockelsen.
  - Ett brutalt val kräver `shame` 4–25, vinster på minst 30 och kostnader på minst 45.
  - `node tools/check-laws.mjs` ska ge 0 fel. Den kontrollerar också att inget partis linje hamnar på ett val partiet inte tillåter.
  - Nya lagar bär `kind` (missnöjets slag) och `sv` (svenskt namn i bestämd form), och realism.js läser in dem.

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
  I spelarläget är `worldCtx().world` spelarens EGEN nation — världen därifrån ligger i
  `state.aiWorldRemote` (fylls av `aiWorldSummary()` på värden; nya världsfält måste in där).
- `node --check fil.js` släpper igenom syntaxfel i de här ES-modulerna (Node 22, ingen
  package.json). Kontrollera med `node --input-type=module --check < v4/js/main.js`.

## Testa

```bash
node tools/smoke.mjs          # lokal kod, startar egen server på 8481
node tools/smoke.mjs --live   # mot 8bitcat.github.io efter push
node tools/check-events.mjs   # händelserna i events/ (--alla tar med de 87 ursprungliga)
node tools/check-laws.mjs     # V5.17: lagarna — ✨/💀-valen, FX-måtten, partiernas krav
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
