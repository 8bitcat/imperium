// IMPERIUM V5.6 — HÄNDELSER: POLITIK & DEMOKRATI.
// Val och valfusk, regeringskriser, folkomröstningar, kungahus och junta, kupper, grundlag, korruption, press, internet och partilojalitet.
export const EVENTS = [

  // ================= VAL & VALRÖRELSER =================
  {
    id: 'pol_recount', icon: '\u{1F9EE}', weight: 2,
    title: 'RÖSTRÄKNINGEN DRAR UT PÅ TIDEN',
    text: 'Tre dagar efter valet är rösterna fortfarande inte räknade. Valmyndigheten skyller på trasiga datorer och borttappade protokoll, och båda sidor har redan utropat sig till segrare.',
    when: (c) => !c.is('elections', 'no') && (c.ind.goveff ?? 0) < -0.4 && c.st.stability < 15,
    choices: [
      { text: 'RÄKNA OM ALLT FÖR HAND, INFÖR KAMEROR', cost: { money: 500 }, temp: { stability: 6, approval: 4 }, perm: { corruption: -3 }, tip: 'Långsamt, synligt och svårt att ifrågasätta.' },
      { text: 'UTROPA RESULTATET NU - FELEN ÄR SMÅ', temp: { unrest: 10, approval: -5, polpower: 8 }, tip: 'Klart på en kväll. Ifrågasatt i åratal.' },
      { text: 'LÅT HÖGSTA DOMSTOLEN AVGÖRA', cost: { pp: 15 }, temp: { stability: -4 }, perm: { freedom: 3 }, tip: 'Juristerna får sista ordet. Folket får vänta.' },
    ],
  },
  {
    id: 'pol_ballot_stuffing', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'URNORNA VAR FULLA REDAN PÅ MORGONEN',
    text: 'En mobilfilm visar hur lokala partiarbetare stoppar buntar med röstsedlar i valurnorna innan vallokalen ens har öppnat. Rösterna är till din fördel, och filmen sprids snabbt.',
    when: (c) => c.is('elections', 'mostlyfree', 'balanced', 'hybrid', 'unfair') && c.st.corruption > 15,
    choices: [
      { text: 'GÖR OM VALET I DE DRABBADE KRETSARNA', cost: { money: 600 }, temp: { polpower: -8 }, perm: { corruption: -5, freedom: 3 }, tip: 'Du riskerar mandaten för att rädda trovärdigheten.' },
      { text: 'ÅTALA PARTIARBETARNA, BEHÅLL RESULTATET', cost: { pp: 15 }, temp: { approval: -3, unrest: 4 }, perm: { corruption: -2 }, tip: 'Några små fiskar får ta smällen.' },
      { text: 'KALLA FILMEN EN FÖRFALSKNING', temp: { unrest: 10, approval: -6 }, perm: { corruption: 4 }, mod: 'cover_up', tip: 'Förnekelse är gratis. Till en början.' },
    ],
  },
  {
    id: 'pol_election_observers', icon: '\u{1F50D}', weight: 2,
    title: 'OBSERVATÖRERNA VILL KOMMA',
    text: 'En internationell organisation vill skicka hundratals valobservatörer till ditt nästa val. Ett ja ger legitimitet, men de kommer att skriva ner allt de ser.',
    when: (c) => c.is('elections', 'mostlyfree', 'hybrid', 'unfair') && (c.ind.voice ?? 0) < 0.5,
    choices: [
      { text: 'VÄLKOMNA DEM, ÖVERALLT', temp: { polpower: -6 }, perm: { freedom: 4, corruption: -3 }, rel: 10, tip: 'Världen tittar. Det gör väljarna också.' },
      { text: 'BARA I HUVUDSTADEN, MED STATLIGA GUIDER', cost: { pp: 10 }, temp: { statepower: 4 }, rel: 3, tip: 'De ser det du vill att de ska se.' },
      { text: 'NEJ TACK, VI SKÖTER VÅRA EGNA VAL', temp: { statepower: 6, freedom: -4 }, rel: -8, tip: 'Suveränt. Och misstänkt.' },
    ],
  },
  {
    id: 'pol_low_turnout', icon: '\u{1F4C9}', weight: 2,
    title: 'VALDELTAGANDET RASAR',
    text: 'Bara varannan röstberättigad röstade i senaste valet, det lägsta på flera decennier. Bland de unga röstade knappt var tredje, och kommentatorerna talar om en demokrati som töms inifrån.',
    when: (c) => c.is('elections', 'entirelyfree', 'free', 'mostlyfree', 'balanced') && c.st.approval < -15,
    choices: [
      { text: 'INFÖR RÖSTPLIKT MED BÖTER', cost: { pp: 20 }, temp: { approval: -5, freedom: -4, polpower: 6 }, perm: { stability: 3 }, tip: 'Alla röstar. Inte alla gillar det.' },
      { text: 'GÖR VALDAGEN TILL HELGDAG', cost: { money: 400 }, temp: { approval: 5, income: -3 }, perm: { freedom: 2 }, tip: 'En ledig dag och en röstsedel.' },
      { text: 'SKOLVAL OCH SAMHÄLLSKUNSKAP FÖR DE UNGA', cost: { money: 300 }, perm: { freedom: 3, hdi: 2 }, tip: 'Lönar sig om tio år.' },
      { text: 'LÅGT DELTAGANDE GYNNAR OSS', temp: { polpower: 6, approval: -3 }, tip: 'Nöjda väljare stannar hemma. Säger vi.' },
    ],
  },
  {
    id: 'pol_e_voting', icon: '\u{1F4F1}', weight: 2,
    title: 'SKA VI RÖSTA MED MOBILEN?',
    text: 'Nästan alla i landet är uppkopplade och IT-ministeriet vill införa röstning över nätet till nästa val. Säkerhetsforskare varnar för intrång, men valdeltagandet skulle kunna stiga kraftigt.',
    when: (c) => (c.ind.internet ?? 50) > 90 && !c.is('elections', 'no', 'unfair'),
    choices: [
      { text: 'INFÖR NÄTRÖSTNING I HELA LANDET', cost: { money: 500, rp: 60 }, temp: { approval: 6, stability: -3 }, perm: { freedom: 3, research: 2 }, tip: 'Bekvämt. Tills någon hackar det.' },
      { text: 'TESTA FÖRST I NÅGRA KOMMUNER', cost: { rp: 25 }, temp: { approval: 2 }, perm: { research: 2 }, tip: 'Försiktighet, i liten skala.' },
      { text: 'PAPPER OCH PENNA DUGER', temp: { approval: -2 }, perm: { stability: 2 }, tip: 'Svårt att hacka en blyertspenna.' },
    ],
  },
  {
    id: 'pol_snap_election', icon: '\u{1F4CA}', weight: 2,
    title: 'EXTRAVAL NU, NÄR SIFFRORNA ÄR BRA?',
    text: 'Opinionsmätningarna har aldrig varit bättre för dig. Rådgivarna vill utlysa extraval direkt för att säkra en egen majoritet, men väljare brukar straffa den som verkar för säker på sig själv.',
    when: (c) => c.st.approval > 25 && c.is('elections', 'entirelyfree', 'free', 'mostlyfree', 'balanced'),
    choices: [
      { text: 'UTLYS EXTRAVAL', cost: { money: 500 }, temp: { polpower: 18, approval: -6, stability: -3 }, tip: 'Ett djärvt spel om en egen majoritet.' },
      { text: 'SITT KVAR TILL ORDINARIE VAL', temp: { stability: 4, polpower: -3 }, tip: 'Stabilt. Läget kommer kanske aldrig tillbaka.' },
      { text: 'ANVÄND OPINIONSLÄGET TILL OBEKVÄMA REFORMER', cost: { pp: 20 }, temp: { approval: -10 }, perm: { gdp: 3, income: 3 }, tip: 'Popularitet är till för att användas.' },
    ],
  },
  {
    id: 'pol_debate_gaffe', icon: '\u{1F3A4}', weight: 2,
    title: 'MISSEN I SLUTDEBATTEN',
    text: 'I valets sista tv-debatt svarar du fel på en enkel fråga om brödpriset och kallar en arbetslös frågeställare för "en statistisk detalj". Klippet har setts miljontals gånger på en natt.',
    when: (c) => c.is('elections', 'entirelyfree', 'free', 'mostlyfree') && c.day > 60,
    choices: [
      { text: 'BE OM URSÄKT OCH TRÄFFA FRÅGESTÄLLAREN', cost: { pp: 10 }, temp: { approval: 4, polpower: -4 }, tip: 'Ödmjukhet säljer. Ibland.' },
      { text: 'SKÄMTA BORT DET I NÄSTA INTERVJU', temp: { approval: -6 }, tip: 'Ingen tyckte att det var lika roligt som du.' },
      { text: 'KÖP REKLAMTID OCH BYT ÄMNE', cost: { money: 600 }, temp: { approval: 5 }, tip: 'Pengar dränker det mesta, även ett pinsamt klipp.' },
    ],
  },
  {
    id: 'pol_deepfake', icon: '\u{1F3AD}', weight: 2,
    title: 'DET FALSKA KLIPPET',
    text: 'Två dagar före valet sprids en video där du verkar erkänna att du tagit emot mutor. Tekniker säger att den är skapad med AI, men miljontals har redan sett den och många tror på den.',
    when: (c) => (c.ind.internet ?? 50) > 80 && !c.is('elections', 'no') && c.st.approval < 0,
    choices: [
      { text: 'LÅT OBEROENDE EXPERTER GRANSKA KLIPPET', cost: { rp: 30 }, temp: { approval: 5, freedom: 3 }, tip: 'Sanningen tar tid. Valet väntar inte.' },
      { text: 'KRÄV ATT PLATTFORMARNA TAR BORT ALLT', cost: { pp: 20 }, temp: { approval: 3, freedom: -6 }, tip: 'Klippet försvinner. Frågan om censur gör det inte.' },
      { text: 'SPRID ETT FALSKT KLIPP OM MOTSTÅNDAREN', temp: { approval: 4, corruption: 6 }, perm: { freedom: -3 }, tip: 'Nu ljuger båda sidor. Väljarna märker det.' },
      { text: 'IGNORERA DET', temp: { approval: -8 }, tip: 'En lögn hinner jorden runt innan sanningen fått på sig skorna.' },
    ],
  },
  {
    id: 'pol_vote_buying', icon: '\u{1F381}', weight: 2,
    title: 'RÖSTER MOT RIS OCH KONTANTER',
    text: 'I de fattigaste distrikten delar partiarbetare ut säckar med ris och små kuvert med pengar i utbyte mot löften om röster. Alla partier gör det, säger de, och väljarna verkar förvänta sig det.',
    when: (c) => (c.ind.poverty ?? 2) > 8 && !c.is('elections', 'no') && c.st.corruption > 0,
    choices: [
      { text: 'FÖRBJUD GÅVOR I VALRÖRELSEN, MED HÅRDA STRAFF', cost: { pp: 20 }, temp: { approval: -4 }, perm: { corruption: -5 }, tip: 'Rätt sak. Mindre ris i distrikten.' },
      { text: 'GE VÄLJARNA DET PÅ RIKTIGT: SKOLMAT OCH BIDRAG', cost: { money: 800 }, temp: { approval: 6 }, perm: { welfare: 4, corruption: -2 }, tip: 'Den bästa röstköpningen är en fungerande stat.' },
      { text: 'DELA UT MER ÄN DE ANDRA', cost: { money: 400 }, temp: { approval: 8, polpower: 6 }, perm: { corruption: 6 }, tip: 'Du vinner. Systemet förlorar.' },
      { text: 'LÅT DET VARA', perm: { corruption: 3 }, tip: 'Tradition är svår att bryta.' },
    ],
  },
  {
    id: 'pol_opposition_boycott', icon: '\u{1F6AA}', weight: 2,
    title: 'OPPOSITIONEN BOJKOTTAR VALET',
    text: 'De största oppositionspartierna meddelar att de inte ställer upp i valet, som de kallar en förutbestämd teater. Utan motkandidater vinner du stort, men världen undrar vad en sådan seger är värd.',
    when: (c) => c.is('elections', 'hybrid', 'unfair') && c.st.freedom < 20,
    choices: [
      { text: 'FÖRHANDLA: NY VALMYNDIGHET OCH SENARE VALDAG', cost: { pp: 25 }, temp: { polpower: -8 }, perm: { freedom: 5, stability: 2 }, rel: 6, tip: 'Du ger upp kontroll för att få en riktig seger.' },
      { text: 'GENOMFÖR VALET SOM PLANERAT', temp: { polpower: 10, approval: -4 }, rel: -6, tip: 'Hundra procent av rösterna, noll procent av respekten.' },
      { text: 'BETALA SMÅPARTIER FÖR ATT STÄLLA UPP', cost: { money: 500 }, temp: { polpower: 6 }, perm: { corruption: 4 }, rel: -2, tip: 'Konkurrens, köpt och betald.' },
    ],
  },

  // ================= REGERING & PARLAMENT =================
  {
    id: 'pol_no_confidence', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'MISSTROENDEVOTUM I PARLAMENTET',
    text: 'Oppositionen har lagt fram ett misstroendevotum mot dig och räknar med att några av dina egna ledamöter röstar med dem. Omröstningen sker om två dagar.',
    when: (c) => c.is('government', 'directdemo', 'strongdemo', 'democracy', 'constmonarchy', 'mixed') && c.st.approval < -15,
    choices: [
      { text: 'KÖP STÖD MED LÖFTEN TILL VÅGMÄSTARNA', cost: { money: 600, pp: 10 }, temp: { stability: 5 }, perm: { corruption: 3 }, tip: 'Du överlever. Notan kommer i budgeten.' },
      { text: 'OMBILDA REGERINGEN OCH SPARKA TRE MINISTRAR', cost: { pp: 20 }, temp: { approval: 6, stability: -3 }, tip: 'Huvuden rullar så att ditt får sitta kvar.' },
      { text: 'UTLYS NYVAL INNAN DE HINNER RÖSTA', cost: { money: 400 }, temp: { approval: 4, stability: -6, polpower: -6 }, tip: 'Låt väljarna avgöra. Riskabelt.' },
      { text: 'LÅT OMRÖSTNINGEN GÅ', temp: { polpower: -12, stability: -6 }, perm: { freedom: 2 }, tip: 'Du klarar dig med en röst. Ingen glömmer hur nära det var.' },
    ],
  },
  {
    id: 'pol_coalition_collapse', icon: '\u{1F494}', weight: 2,
    title: 'KOALITIONEN SPRICKER',
    text: 'Ditt minsta samarbetsparti hotar att lämna regeringen om inte deras hjärtefråga går igenom före sommaren. Utan dem saknar du majoritet i parlamentet.',
    when: (c) => c.is('government', 'strongdemo', 'democracy', 'constmonarchy', 'mixed') && c.is('party_loyalty', 'none', 'minimum', 'low', 'mixed') && c.st.stability < -5,
    choices: [
      { text: 'GE DEM DERAS REFORM', cost: { money: 500 }, temp: { stability: 6, ideopower: -6 }, tip: 'Majoriteten räddad, programmet urvattnat.' },
      { text: 'BYT UT DEM MOT ETT ANNAT PARTI', cost: { pp: 25 }, temp: { stability: 3, ideopower: -4, corruption: 2 }, tip: 'Nya vänner, nya krav.' },
      { text: 'STYR I MINORITET', temp: { stability: -8, polpower: -8 }, tip: 'Varje omröstning blir ett lotteri.' },
    ],
  },
  {
    id: 'pol_minister_resigns', icon: '\u{1F4BC}', weight: 2,
    title: 'MINISTERN AVGÅR I PROTEST',
    text: 'Din mest populära minister lämnar regeringen med dunder och brak och kallar din politik "ett svek mot allt vi gick till val på". En presskonferens är redan inbokad till i morgon.',
    when: (c) => c.harmony < 0.3 && c.st.approval < 10 && !c.is('government', 'totalitarian', 'junta'),
    choices: [
      { text: 'ERBJUD ETT TYNGRE DEPARTEMENT', cost: { pp: 20 }, temp: { stability: 4, polpower: -4 }, tip: 'Lojaliteten har ett pris. Det har just höjts.' },
      { text: 'LÅT MINISTERN GÅ, UTSE EN LOJAL ERSÄTTARE', temp: { approval: -6, ideopower: 5 }, tip: 'Lugnare möten. Färre idéer.' },
      { text: 'LÄGG OM POLITIKEN EFTER KRITIKEN', cost: { pp: 15 }, temp: { approval: 6, ideopower: -8 }, tip: 'Du lyssnar. Dina anhängare undrar vem du är.' },
    ],
  },
  {
    id: 'pol_budget_deadlock', icon: '\u{1F512}', weight: 2,
    title: 'INGEN BUDGET - STATEN STÄNGER',
    text: 'Parlamentet har inte lyckats enas om statsbudgeten och pengarna tar slut vid månadsskiftet. Myndigheterna förbereder sig på att skicka hem personal och stänga museer, passkontor och nationalparker.',
    when: (c) => c.is('government', 'strongdemo', 'democracy', 'constmonarchy', 'mixed', 'hybrid') && (c.ind.debt ?? 57) > 75 && c.st.stability < 10,
    choices: [
      { text: 'KOMPROMISSA: SKATTEHÖJNING OCH NEDSKÄRNING', cost: { pp: 20 }, temp: { approval: -5, income: 4, stability: 4 }, tip: 'Ingen blir nöjd. Det är kännetecknet på en kompromiss.' },
      { text: 'LÅT STATEN STÄNGA TILLS DE GER MED SIG', temp: { income: -6, gdp: -4, approval: -6, stability: -4 }, tip: 'Ett skådespel där tjänstemännen inte får lön.' },
      { text: 'DRIV IGENOM BUDGETEN MED DEKRET', cost: { pp: 35 }, temp: { stability: 5, freedom: -8, statepower: 8 }, tip: 'Pengarna flyter. Parlamentet minns.' },
    ],
  },
  {
    id: 'pol_expert_government', icon: '\u{1F393}', weight: 2,
    title: 'EN REGERING AV EXPERTER?',
    text: 'Efter månader av politiskt käbbel föreslår centralbanken och arbetsgivarna en tillfällig expertregering, med en ekonom som premiärminister och professorer på departementen. Marknaderna jublar, partierna fnyser.',
    when: (c) => c.ideo === 'technocracy' || (c.st.stability < -20 && (c.ind.goveff ?? 0) > -0.3),
    choices: [
      { text: 'LÄMNA ÖVER TILL EXPERTERNA I ETT ÅR', cost: { pp: 20 }, temp: { stability: 8, polpower: -12, approval: -4 }, perm: { corruption: -3, income: 3 }, tip: 'Effektivt. Ingen har valt dem.' },
      { text: 'TA IN EXPERTER SOM RÅDGIVARE', cost: { money: 300 }, temp: { stability: 3 }, perm: { research: 2 }, tip: 'Kunskap i rummet, makten kvar hos dig.' },
      { text: 'POLITIK ÄR TILL FÖR DE VALDA', temp: { polpower: 5, stability: -4 }, tip: 'Demokratiskt principfast. Och rörigt.' },
    ],
  },

  // ================= FOLKOMRÖSTNINGAR =================
  {
    id: 'pol_referendum_demand', icon: '\u{270D}\u{FE0F}', weight: 2,
    title: 'EN MILJON NAMNUNDERSKRIFTER',
    text: 'Ett folkinitiativ har samlat in en miljon namn för en folkomröstning om landets medlemskap i det stora handelsblocket. Kampanjen lovar att pengarna som går till samarbetet ska gå till vården i stället.',
    when: (c) => c.is('globalism', 'major', 'big', 'partner') && !c.is('elections', 'no', 'unfair') && c.st.approval < 15,
    choices: [
      { text: 'HÅLL FOLKOMRÖSTNINGEN OCH FÖLJ UTFALLET', cost: { money: 400 }, temp: { stability: -6, approval: 6 }, perm: { freedom: 3 }, tip: 'Demokratiskt. Utgången är en annan sak.' },
      { text: 'EN RÅDGIVANDE OMRÖSTNING, INTE BINDANDE', cost: { money: 300 }, temp: { approval: 2, stability: -2 }, tip: 'Folket får tycka till. Du får bestämma.' },
      { text: 'AVSLÅ KRAVET', temp: { approval: -6, unrest: 5 }, rel: 4, tip: 'Omvärlden andas ut. Väljarna gör det inte.' },
      { text: 'LÄMNA BLOCKET UTAN OMRÖSTNING', cost: { pp: 30 }, law: ['globalism', 'balanced'], temp: { approval: 6, gdp: -5 }, rel: -10, tip: 'Snabbt, populärt och dyrt för exporten.' },
    ],
  },
  {
    id: 'pol_referendum_lost', icon: '\u{1F4EE}', weight: 2,
    title: 'FOLKET SA NEJ',
    text: 'Din stora reform föll i folkomröstningen med knapp marginal. Oppositionen kräver att du respekterar utslaget, men dina rådgivare påpekar att omröstningen formellt bara var rådgivande.',
    when: (c) => c.is('government', 'directdemo', 'strongdemo', 'democracy', 'constmonarchy') && c.st.approval < 0,
    choices: [
      { text: 'RESPEKTERA UTSLAGET OCH DRA TILLBAKA REFORMEN', temp: { polpower: -10, approval: 5 }, perm: { freedom: 3 }, tip: 'Folket bestämde. Du får hitta en annan väg.' },
      { text: 'GENOMFÖR REFORMEN ÄNDÅ', cost: { pp: 30 }, temp: { approval: -12, unrest: 8 }, perm: { income: 3 }, tip: 'Formellt rätt. Politiskt förödande.' },
      { text: 'HÅLL EN NY OMRÖSTNING OM ETT ÅR', cost: { money: 400 }, temp: { stability: -4, approval: -3 }, tip: 'Rösta tills de svarar rätt.' },
    ],
  },
  {
    id: 'pol_direct_democracy_fatigue', icon: '\u{1F4C6}', weight: 2,
    title: 'FOLKOMRÖSTNING VARJE SÖNDAG',
    text: 'Landet har hållit elva folkomröstningar i år, om allt från skolmat till kärnkraft. Deltagandet har sjunkit under en tredjedel och de mest högljudda grupperna vinner gång på gång.',
    when: (c) => c.is('government', 'directdemo') || (c.is('government', 'strongdemo') && c.st.freedom > 20),
    choices: [
      { text: 'SAMLA FRÅGORNA TILL TVÅ OMRÖSTNINGSDAGAR PER ÅR', cost: { pp: 15 }, temp: { stability: 5, approval: 2 }, tip: 'Färre söndagar i vallokalen.' },
      { text: 'KRÄV MINST HÄLFTEN I DELTAGANDE', cost: { pp: 20 }, temp: { stability: 6, freedom: -4 }, tip: 'Ogiltigt om ingen bryr sig.' },
      { text: 'INFÖR EN LOTTAD MEDBORGARPANEL', cost: { money: 400 }, temp: { approval: 3 }, perm: { stability: 3, corruption: -2 }, tip: 'Hundra vanliga människor läser på åt alla andra.' },
      { text: 'MER DEMOKRATI ÄR ALDRIG FEL', temp: { stability: -6, freedom: 4 }, tip: 'Nästa omröstning gäller skatten på glass.' },
    ],
  },

  // ================= KUNGAHUSET =================
  {
    id: 'pol_abdication', icon: '\u{1F451}', weight: 1, cooldown: 1200,
    title: 'MONARKEN ABDIKERAR',
    text: 'Den åldrade monarken meddelar i ett tv-tal att tronen lämnas över till tronarvingen efter nästan femtio år. Landet ska förbereda en kröning, och frågan är hur stor den ska vara.',
    when: (c) => c.is('government', 'constmonarchy') || (c.ideo === 'monarchism' && c.doc === 'constitutional'),
    choices: [
      { text: 'EN PRAKTFULL KRÖNING MED VÄRLDENS LEDARE', cost: { money: 900 }, temp: { approval: 8, stability: 6 }, rel: 8, mod: 'national_unity', tip: 'Guldvagnar och statsbesök. Skattebetalarna står för festen.' },
      { text: 'EN ENKEL CEREMONI I PARLAMENTET', cost: { money: 200 }, temp: { approval: 4, stability: 3 }, tip: 'Modernt och billigt. Turisterna blir besvikna.' },
      { text: 'SKJUT UPP KRÖNINGEN TILLS EKONOMIN ÄR BÄTTRE', temp: { approval: -4, stability: -3 }, tip: 'Sparsamt, men en monark utan krona ser märklig ut.' },
    ],
  },
  {
    id: 'pol_royal_scandal', icon: '\u{1F48E}', weight: 2,
    title: 'SKANDAL I KUNGAHUSET',
    text: 'En tidning avslöjar att en prins har använt sin titel för att ordna affärer åt utländska investerare och tagit emot dyra gåvor. Hovet vägrar kommentera och republikanerna gnuggar händerna.',
    when: (c) => (c.is('government', 'constmonarchy') || c.ideo === 'monarchism') && c.st.corruption > 0,
    choices: [
      { text: 'STRYK PRINSENS APANAGE OCH TITLAR', cost: { pp: 15 }, temp: { approval: 6, stability: -3 }, perm: { corruption: -3 }, tip: 'Familjen blir mindre. Respekten större.' },
      { text: 'TYSTA NER DET I SAMRÅD MED HOVET', temp: { stability: 3 }, mod: 'cover_up', tip: 'Hovet har gjort det här förut.' },
      { text: 'GRANSKA HELA KUNGAHUSETS EKONOMI', cost: { money: 300, pp: 10 }, temp: { stability: -5 }, perm: { corruption: -5, freedom: 2 }, tip: 'Öppna böcker, även på slottet.' },
    ],
  },
  {
    id: 'pol_succession_law', icon: '\u{1F478}', weight: 1, cooldown: 1500,
    title: 'FÖRSTFÖDD, OAVSETT KÖN?',
    text: 'Kronprinsens äldre syster är förbigången i tronföljden enbart för att hon är kvinna. Ett lagförslag vill ge tronen till det förstfödda barnet, men ändringen kräver beslut av två parlament med ett val emellan.',
    when: (c) => (c.is('government', 'constmonarchy') && c.is('equality', 'full', 'strong', 'legal')) || (c.ideo === 'monarchism' && c.is('equality', 'full', 'strong')),
    choices: [
      { text: 'ÄNDRA GRUNDLAGEN: DEN FÖRSTFÖDDA ÄRVER', cost: { pp: 25 }, temp: { approval: 6, stability: -2 }, perm: { freedom: 3 }, tip: 'Historiskt. Och lite pinsamt att det dröjde.' },
      { text: 'BEHÅLL TRADITIONEN', temp: { stability: 3, approval: -5 }, tip: 'Tradition är just det monarkin säljer.' },
      { text: 'LÅT FRÅGAN VILA TILL NÄSTA GENERATION', temp: { approval: -2 }, tip: 'Problemet löser sig om rätt barn föds.' },
    ],
  },
  {
    id: 'pol_republic_movement', icon: '\u{1F4E2}', weight: 2,
    title: 'REPUBLIKANERNA VÄXER',
    text: 'För första gången visar mätningarna att fler vill avskaffa monarkin än behålla den. Republikanska föreningen kräver en folkomröstning och frågar vad kungahuset egentligen kostar.',
    when: (c) => c.is('government', 'constmonarchy') && c.st.approval < 10,
    choices: [
      { text: 'HÅLL FOLKOMRÖSTNINGEN - REPUBLIKEN VINNER', cost: { pp: 35 }, law: ['government', 'democracy'], temp: { stability: -8, approval: 8 }, perm: { freedom: 3 }, tip: 'Slottet blir museum. Någon måste ta hand om hästarna.' },
      { text: 'BANTA KUNGAHUSET OCH ÖPPNA SLOTTEN', cost: { pp: 15 }, res: { money: 200 }, temp: { approval: 5, stability: 2 }, tip: 'En billigare monarki är en säkrare monarki.' },
      { text: 'KUNGAHUSET ÄR GRUNDLAGSSKYDDAT', temp: { approval: -4, unrest: 4 }, perm: { stability: 2 }, tip: 'Juridiskt rätt. Ger dem mer bränsle.' },
    ],
  },
  {
    id: 'pol_monarch_refuses', icon: '\u{2712}\u{FE0F}', weight: 2,
    title: 'MONARKEN VÄGRAR SKRIVA UNDER',
    text: 'Parlamentet har röstat igenom en lag som monarken öppet ogillar, och nu vägrar slottet att skriva under den. Det har inte hänt på hundra år och grundlagsexperterna är oeniga om vad som gäller.',
    when: (c) => c.is('government', 'constmonarchy') && c.ideo !== 'monarchism',
    choices: [
      { text: 'ÄNDRA GRUNDLAGEN: UNDERSKRIFTEN BLIR CEREMONIELL', cost: { pp: 30 }, temp: { polpower: 6 }, perm: { freedom: 4, stability: -2 }, tip: 'Kronan blir en symbol. Helt och hållet.' },
      { text: 'FÖRHANDLA I TYSTHET MED SLOTTET', cost: { pp: 15 }, temp: { stability: 3, polpower: -4 }, tip: 'Lagen skrivs om lite. Ingen förlorar ansiktet.' },
      { text: 'DRA TILLBAKA LAGEN', temp: { polpower: -8, approval: -4, stability: 4 }, tip: 'Tronen vann. Parlamentet minns.' },
    ],
  },

  // ================= JUNTA & KUPPER =================
  {
    id: 'pol_junta_rivalry', icon: '\u{1F396}\u{FE0F}', weight: 2,
    title: 'ARMÉN MOT FLYGVAPNET',
    text: 'Juntans generaler är osams om vem som ska leda försvarsministeriet. Arméns chef har flyttat stridsvagnar närmare huvudstaden och flygvapnet svarar med lågflygningar över hans högkvarter.',
    when: (c) => c.is('government', 'junta') && c.ideo !== 'stratocracy',
    choices: [
      { text: 'DELA MINISTERIET MELLAN DEM', cost: { money: 500 }, temp: { stability: 4, corruption: 3 }, perm: { milpower: -2 }, tip: 'Två chefer, ett skrivbord. Det håller ett tag.' },
      { text: 'STÖD ARMÉN, AVSKEDA FLYGVAPENCHEFEN', cost: { pp: 25 }, temp: { statepower: 8, readiness: -6, stability: -3 }, tip: 'Den starkaste vinner. Den svagaste glömmer inte.' },
      { text: 'LÅT DEM GÖRA UPP SJÄLVA', temp: { stability: -8, milpower: -4 }, tip: 'Juntor brukar inte ha tålamod med varandra.' },
      { text: 'TILLSÄTT EN CIVIL FÖRSVARSMINISTER', cost: { pp: 30 }, temp: { stability: -4, milpower: -5 }, perm: { freedom: 3, corruption: -2 }, tip: 'Ett första steg bort från uniformerna.' },
    ],
  },
  {
    id: 'pol_junta_timetable', icon: '\u{23F3}', weight: 2,
    title: 'NÄR LÄMNAR MILITÄREN MAKTEN?',
    text: 'Grannländerna och biståndsgivarna kräver en tidtabell för återgång till civilt styre. Utan den fryses lån och samarbeten, och på universiteten har de första protesterna börjat.',
    when: (c) => (c.is('government', 'junta') && c.st.unrest > -10) || (c.ideo === 'stratocracy' && c.st.freedom < 0),
    choices: [
      { text: 'LOVA VAL OM ETT ÅR - OCH HÅLL LÖFTET', cost: { pp: 35 }, law: ['government', 'hybrid'], temp: { stability: -6, milpower: -6 }, perm: { freedom: 5 }, rel: 12, tip: 'Officerarna går tillbaka till kasernerna. Alla gör det inte gärna.' },
      { text: 'EN NY FÖRFATTNING FÖRST, VAL SEDAN', cost: { pp: 15 }, temp: { unrest: -4 }, rel: 4, tip: 'Det kan ta tid att skriva en grundlag. Mycket tid.' },
      { text: 'VI GÅR NÄR LANDET ÄR REDO', temp: { statepower: 6, unrest: 6 }, rel: -10, tip: 'Ingen junta har någonsin tyckt att landet var redo.' },
    ],
  },
  {
    id: 'pol_junta_business', icon: '\u{1F3ED}', weight: 2,
    title: 'ÖVERSTARNA ÄGER HALVA EKONOMIN',
    text: 'Militärens egna bolag driver hotell, cementfabriker, banker och mobilnät. De betalar ingen skatt, och privata konkurrenter klagar på att de aldrig vinner en enda upphandling.',
    when: (c) => (c.is('government', 'junta', 'authoritarian') || c.ideo === 'stratocracy') && c.st.corruption > 5,
    choices: [
      { text: 'SKATTEPLIKT OCH ÖPPNA UPPHANDLINGAR', cost: { pp: 25 }, temp: { milpower: -5, stability: -3 }, perm: { corruption: -5, income: 4 }, tip: 'Generalerna får börja betala. De blir inte glada.' },
      { text: 'SÄLJ UT MILITÄRENS BOLAG', cost: { pp: 30 }, res: { money: 1000 }, temp: { milpower: -8, stability: -5 }, perm: { corruption: -3 }, tip: 'Pengar in, makt ut ur kasernerna.' },
      { text: 'LÅT DEM BEHÅLLA ALLT', temp: { milpower: 6, stability: 3 }, perm: { corruption: 4 }, tip: 'Nöjda officerare gör inga kupper. Oftast.' },
    ],
  },
  {
    id: 'pol_coup_attempt', icon: '\u{1F6A8}', weight: 2,
    title: 'STRIDSVAGNAR VID RADIOHUSET',
    text: 'Mitt i natten har en grupp officerare tagit kontroll över statsradion och flygplatsen och läser upp ett upprop om att regeringen är avsatt. De flesta förband har ännu inte valt sida.',
    when: (c) => (c.ind.polstab ?? 0) < -0.8 && c.st.stability < 0 && !c.is('government', 'junta'),
    choices: [
      { text: 'UPPMANA FOLKET ATT GÅ UT PÅ GATORNA', cost: { pp: 20 }, temp: { approval: 10, unrest: 10, stability: -4 }, mod: 'national_unity', tip: 'Tusentals ställer sig framför stridsvagnarna. Kuppen faller ihop.' },
      { text: 'LÅT LOJALA FÖRBAND SLÅ TILLBAKA', cost: { man: 8 }, temp: { stability: 6, milpower: -8, statepower: 6 }, tip: 'Ordningen återställs. Armén är splittrad.' },
      { text: 'FÖRHANDLA MED KUPPMAKARNA', temp: { stability: -6, statepower: -8, milpower: 4 }, perm: { corruption: 3 }, tip: 'Du sitter kvar. På deras villkor.' },
    ],
  },
  {
    id: 'pol_coup_aftermath', icon: '\u{1F5C2}\u{FE0F}', weight: 2,
    title: 'TUSENTALS AVSTÄNGDA EFTER KUPPEN',
    text: 'Efter det misslyckade kuppförsöket vill säkerhetstjänsten stänga av alla tjänstemän med kopplingar till kuppmakarna: officerare, domare och lärare. Listorna blir längre för varje dag.',
    when: (c) => (c.ind.polstab ?? 0) < -0.5 && c.st.statepower > 10 && !c.is('civil_rights', 'extremelyhigh', 'veryhigh'),
    choices: [
      { text: 'ÅTALA BARA DE SOM DELTOG', cost: { pp: 15 }, temp: { stability: -3 }, perm: { freedom: 3 }, tip: 'Rättssäkert. Säkerhetstjänsten är missnöjd.' },
      { text: 'RENSA STATEN ORDENTLIGT', cost: { pp: 25 }, temp: { statepower: 10, freedom: -10 }, mod: 'purge_aftermath', tip: 'Lojal stat. Tom stat.' },
      { text: 'NÅD FÖR ALLA SOM ÅNGRAR SIG', temp: { stability: 5, statepower: -4 }, tip: 'Försoning. Eller en inbjudan till nästa försök.' },
    ],
  },

  // ================= GRUNDLAG & MAKTDELNING =================
  {
    id: 'pol_court_blocks', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'HÖGSTA DOMSTOLEN STOPPAR LAGEN',
    text: 'Högsta domstolen har förklarat din viktigaste reform grundlagsstridig. Dina anhängare kräver att du utser fler domare som delar dina värderingar, och juristerna varnar för att rättsstaten står på spel.',
    when: (c) => (c.ind.rulelaw ?? 0) > -0.3 && c.is('government', 'strongdemo', 'democracy', 'constmonarchy', 'mixed', 'hybrid') && c.st.polpower < 0,
    choices: [
      { text: 'RESPEKTERA DOMEN OCH SKRIV OM LAGEN', temp: { polpower: -6 }, perm: { freedom: 3, corruption: -2 }, tip: 'Rättsstaten håller. Din reform får vänta.' },
      { text: 'UTSE FYRA NYA DOMARE', cost: { pp: 35 }, temp: { polpower: 10, freedom: -8, stability: -5 }, perm: { corruption: 3 }, tip: 'En domstol som håller med dig. Tills nästa regering gör likadant.' },
      { text: 'ÄNDRA GRUNDLAGEN GENOM PARLAMENTET', cost: { pp: 25 }, temp: { polpower: 5, stability: -3 }, tip: 'Lagligt och långsamt.' },
    ],
  },
  {
    id: 'pol_term_limit', icon: '\u{1F4C5}', weight: 2, cooldown: 1500,
    title: 'EN MANDATPERIOD TILL?',
    text: 'Grundlagen säger att du måste lämna ditt ämbete efter två perioder, och den andra går snart ut. Dina anhängare i parlamentet har redan skrivit ett förslag som stryker spärren.',
    when: (c) => c.day > 500 && c.is('government', 'strongdemo', 'democracy', 'mixed', 'hybrid') && c.st.approval > 15,
    choices: [
      { text: 'RESPEKTERA SPÄRREN OCH FÖRBERED EN EFTERTRÄDARE', temp: { polpower: -10, approval: 8 }, perm: { freedom: 4, stability: 3 }, tip: 'Du går till historien. Snart.' },
      { text: 'STRYK SPÄRREN', cost: { pp: 40 }, temp: { polpower: 12, approval: -8, unrest: 8 }, perm: { freedom: -5 }, rel: -8, tip: 'Bara en period till. Det säger alla.' },
      { text: 'BYT ROLL OCH BLI PREMIÄRMINISTER I STÄLLET', cost: { pp: 20 }, temp: { polpower: 6, approval: -4 }, perm: { corruption: 3 }, tip: 'Nytt ämbete, samma skrivbord.' },
    ],
  },
  {
    id: 'pol_new_constitution', icon: '\u{1F4DC}', weight: 2,
    title: 'EN NY GRUNDLAG SKA SKRIVAS',
    text: 'Efter åren av kris är nästan alla överens om att landet behöver en ny författning. Frågan är vem som ska skriva den: politikerna, juristerna eller vanliga medborgare.',
    when: (c) => (c.st.stability < -25 && c.st.unrest > 10) || (c.mod('crumbling_state') && c.st.stability < 0),
    choices: [
      { text: 'EN LOTTAD MEDBORGARFÖRSAMLING SKRIVER UTKASTET', cost: { money: 500, pp: 15 }, temp: { polpower: -6 }, perm: { freedom: 5, stability: 4 }, tip: 'Långsamt och folkligt. Svårt att avfärda.' },
      { text: 'JURISTER OCH EXPERTER SKRIVER DEN', cost: { money: 300 }, perm: { stability: 4, corruption: -2 }, tip: 'Juridiskt vattentät. Ingen läser den.' },
      { text: 'DU SKRIVER DEN SJÄLV', cost: { pp: 30 }, temp: { polpower: 10, approval: -5 }, perm: { statepower: 6, freedom: -5 }, tip: 'Varje paragraf passar dig perfekt.' },
      { text: 'NU ÄR INTE RÄTT TID', temp: { stability: -4 }, tip: 'Den gamla grundlagen har ju hållit så här länge.' },
    ],
  },
  {
    id: 'pol_regions_power', icon: '\u{1F5FA}\u{FE0F}', weight: 2,
    title: 'REGIONERNA VILL BESTÄMMA SJÄLVA',
    text: 'Guvernörerna i landets regioner kräver egna skatter och egen kontroll över skolor och sjukhus. Huvudstaden, säger de, förstår inte hur det ser ut tre timmar bort.',
    when: (c) => ((c.ind.area ?? 0) > 600000 || c.claims >= 12) && c.st.statepower < 0,
    choices: [
      { text: 'FEDERALISERA - REGIONERNA FÅR EGNA SKATTER', cost: { pp: 30 }, temp: { stability: 5, approval: 6, income: -5 }, perm: { statepower: -5, freedom: 4 }, tip: 'Mer närhet, mindre kontroll.' },
      { text: 'FLYTTA UT NÅGRA MYNDIGHETER I LANDET', cost: { money: 500 }, temp: { approval: 5, stability: 3 }, tip: 'Symboliskt, men jobben är riktiga.' },
      { text: 'SÄTT IN GUVERNÖRER SOM DU SJÄLV UTSER', cost: { pp: 20 }, temp: { unrest: 6, approval: -5 }, perm: { statepower: 6 }, tip: 'Centralmakten tar tillbaka kartan.' },
      { text: 'IGNORERA KRAVEN', temp: { unrest: 5, stability: -3 }, tip: 'Tre timmar bort växer ilskan.' },
    ],
  },
  {
    id: 'pol_emergency_decree', icon: '\u{26A0}\u{FE0F}', weight: 2,
    title: 'UNDANTAGSTILLSTÅNDET LÖPER UT',
    text: 'Krisen som motiverade undantagstillståndet håller på att ebba ut, men inrikesministeriet vill förlänga det ett halvår till. Polisen har vant sig vid att kunna gripa folk utan domstolsbeslut.',
    when: (c) => (c.mod('natural_disaster') || c.mod('boiling_over') || c.st.unrest > 40) && c.st.statepower > 0,
    choices: [
      { text: 'LÅT UNDANTAGSTILLSTÅNDET UPPHÖRA', temp: { safety: -4, statepower: -5 }, perm: { freedom: 4 }, tip: 'Vardagen tillbaka, med vanliga regler.' },
      { text: 'FÖRLÄNG DET ETT HALVÅR', cost: { pp: 20 }, temp: { safety: 6, statepower: 6, freedom: -8 }, tip: 'Tillfälligt är ett tänjbart ord.' },
      { text: 'GÖR DELAR AV DET TILL PERMANENT LAG', cost: { pp: 35 }, temp: { unrest: 5 }, perm: { statepower: 6, freedom: -6 }, tip: 'Krisen tar slut. Befogenheterna gör det inte.' },
    ],
  },

  // ================= KORRUPTION & LOBBYISM =================
  {
    id: 'pol_revolving_door', icon: '\u{1F504}', weight: 2,
    title: 'SVÄNGDÖRREN SNURRAR',
    text: 'Din förra energiminister började som lobbyist för landets största kraftbolag bara tre veckor efter att hon lämnade departementet. Oppositionen skämtar om att hon fortfarande har nycklar till regeringskansliet.',
    when: (c) => (c.ind.corruptgov ?? 0) > -0.4 && c.st.corruption > 10 && !c.is('government', 'totalitarian', 'junta'),
    choices: [
      { text: 'INFÖR ETT ÅRS KARENSTID', cost: { pp: 20 }, temp: { polpower: -4 }, perm: { corruption: -5 }, tip: 'Ett år i frysen. Lobbyisterna får vänta.' },
      { text: 'ETT OFFENTLIGT LOBBYREGISTER', cost: { money: 200, pp: 10 }, perm: { corruption: -3, freedom: 2 }, tip: 'Alla får se vem som äter lunch med vem.' },
      { text: 'SÅ FUNGERAR DET ÖVERALLT', temp: { income: 3 }, perm: { corruption: 3 }, tip: 'Näringslivet uppskattar din förståelse.' },
    ],
  },
  {
    id: 'pol_anticorruption_agency', icon: '\u{1F575}\u{FE0F}', weight: 2,
    title: 'BYRÅN VILL GRIPA EN MINISTER',
    text: 'Den oberoende antikorruptionsbyrån har bevis för att din infrastrukturminister tagit betalt för vägkontrakt och begär att hans immunitet hävs. Ministern är en av dina närmaste allierade.',
    when: (c) => (c.ind.corruptgov ?? 0) < 0 && c.st.corruption > 10 && c.res('corruption') >= 2,
    choices: [
      { text: 'HÄV IMMUNITETEN', cost: { pp: 20 }, temp: { stability: -5, approval: 6 }, perm: { corruption: -8 }, tip: 'Ingen står över lagen. Inte ens dina vänner.' },
      { text: 'FLYTTA BYRÅN UNDER JUSTITIEDEPARTEMENTET', cost: { pp: 25 }, temp: { approval: -6 }, perm: { corruption: 6, statepower: 4 }, rel: -5, tip: 'Byrån finns kvar. Den hittar bara aldrig något längre.' },
      { text: 'LÅT MINISTERN AVGÅ I TYSTHET', temp: { stability: 2 }, perm: { corruption: 2 }, tip: 'Ingen rättegång, inga frågor.' },
    ],
  },
  {
    id: 'pol_campaign_finance', icon: '\u{1F4B8}', weight: 2,
    title: 'VEM BETALAR VALKAMPANJEN?',
    text: 'En granskning visar att en handfull miljardärer och storbolag står för nästan hälften av partiernas valkassor, ditt eget parti inräknat. Valreklamen kostar mer än någonsin.',
    when: (c) => !c.is('elections', 'no', 'unfair') && (c.ind.gdppc ?? 9000) > 12000 && c.st.corruption > 0,
    choices: [
      { text: 'TAK FÖR GÅVOR OCH OFFENTLIGT PARTISTÖD', cost: { money: 500 }, perm: { corruption: -5, freedom: 2 }, tip: 'Staten betalar demokratin. Givarna får hitta andra vägar.' },
      { text: 'KRÄV FULL ÖPPENHET OM ALLA GÅVOR', cost: { pp: 15 }, temp: { polpower: -3 }, perm: { corruption: -3 }, tip: 'Pengarna får finnas. De får bara synas.' },
      { text: 'TACKA OCH TA EMOT', temp: { polpower: 8 }, perm: { corruption: 4 }, tip: 'Givarna glömmer inte vem som tackade ja.' },
    ],
  },

  // ================= PRESS & INTERNET =================
  {
    id: 'pol_publicservice_bias', icon: '\u{1F4FA}', weight: 2,
    title: 'PUBLIC SERVICE ANKLAGAS FÖR VINKLING',
    text: 'Dina partikamrater är rasande över hur statstelevisionens nyheter rapporterar om regeringen och kräver en ny styrelse. Redaktionerna svarar att granskning av makten är hela deras uppdrag.',
    when: (c) => c.is('press', 'publicservice') || (c.is('press', 'free', 'full') && c.st.approval < 0),
    choices: [
      { text: 'FÖRSVARA DERAS OBEROENDE', temp: { polpower: -5 }, perm: { freedom: 3 }, tip: 'Granskarna granskar dig. Det är poängen.' },
      { text: 'SÄNK LICENSAVGIFTEN KRAFTIGT', cost: { pp: 20 }, temp: { approval: 5 }, perm: { freedom: -3 }, tip: 'Billigare tv för folket. Färre reportrar på redaktionerna.' },
      { text: 'TILLSÄTT EN LOJAL STYRELSE', cost: { pp: 30 }, law: ['press', 'state'], temp: { polpower: 8, freedom: -8 }, rel: -4, tip: 'Nyheterna blir vänligare. Tittarna färre.' },
    ],
  },
  {
    id: 'pol_oligarch_media', icon: '\u{1F5DE}\u{FE0F}', weight: 2,
    title: 'MEDIEMAGNATEN VILL HA EN TJÄNST',
    text: 'Mannen som äger tre av de fyra största tv-kanalerna ber om ett regeringsbeslut som ger hans bolag ensamrätt till det nya mobilnätet. I gengäld lovar han vänlig bevakning fram till valet.',
    when: (c) => c.is('press', 'oligarch') || (c.is('press', 'laxed', 'mixed') && c.st.corruption > 25),
    choices: [
      { text: 'NEJ - OCH INFÖR ÄGARTAK FÖR MEDIER', cost: { pp: 30 }, temp: { approval: -5 }, perm: { corruption: -4, freedom: 4 }, tip: 'Han har tre tv-kanaler att hämnas med.' },
      { text: 'GE HONOM KONTRAKTET', res: { pp: 20 }, temp: { approval: 5 }, perm: { corruption: 6, freedom: -3 }, tip: 'Kvällsnyheterna blir mycket trevliga.' },
      { text: 'TACKA ARTIGT NEJ', temp: { approval: -4 }, tip: 'Bevakningen blir märkbart kallare.' },
    ],
  },
  {
    id: 'pol_jailed_journalist', icon: '\u{26D3}\u{FE0F}', weight: 2,
    title: 'VÄRLDEN KRÄVER JOURNALISTENS FRIHET',
    text: 'En undersökande journalist har suttit häktad i ett år för "spridande av falska uppgifter" efter att ha granskat en ministers affärer. Fallet har blivit en internationell nyhet och ambassaderna ber om att få besöka henne.',
    when: (c) => (c.ind.pressfree ?? 50) < 40 && !c.is('press', 'full', 'free') && c.st.freedom < 20,
    choices: [
      { text: 'SLÄPP HENNE OCH LÄGG NER ÅTALET', cost: { pp: 15 }, temp: { freedom: 6, statepower: -4 }, rel: 8, tip: 'En liten gest som syns i hela världen.' },
      { text: 'LÅT RÄTTEGÅNGEN GÅ VIDARE', temp: { statepower: 4, freedom: -4 }, rel: -8, tip: 'Domstolarna är oberoende, säger du. Ingen utomlands tror dig.' },
      { text: 'BENÅDA HENNE MOT ATT HON LÄMNAR LANDET', cost: { pp: 10 }, temp: { freedom: 2 }, rel: 3, tip: 'Problemet flyttar utomlands. Och skriver därifrån.' },
    ],
  },
  {
    id: 'pol_vpn_everywhere', icon: '\u{1F310}', weight: 2,
    title: 'HALVA LANDET SURFAR VIA VPN',
    text: 'Trots alla blockerade sajter använder nästan hälften av internetanvändarna VPN-tjänster för att ta sig runt censuren. De unga ser utländska nyheter och företagen klagar på att lagen gör dem till brottslingar.',
    when: (c) => c.is('internet', 'censored', 'firewall') && (c.ind.internet ?? 50) > 50,
    choices: [
      { text: 'FÖRBJUD VPN OCH STRAFFA ANVÄNDARNA', cost: { pp: 25 }, temp: { statepower: 6, freedom: -8, gdp: -3 }, tip: 'Ett förbud som ingen kan kontrollera.' },
      { text: 'TILLÅT VPN FÖR FÖRETAG MED LICENS', cost: { money: 300 }, temp: { gdp: 3, corruption: 3 }, tip: 'Licenserna hamnar hos rätt personer.' },
      { text: 'LÄTTA PÅ CENSUREN', law: ['internet', 'filtered'], temp: { freedom: 6, statepower: -6, gdp: 3 }, tip: 'Om alla bryter mot lagen är det kanske lagen som är fel.' },
      { text: 'LÅTSAS INTE SE DET', temp: { statepower: -3 }, tip: 'Censur på papperet, frihet i praktiken.' },
    ],
  },
  {
    id: 'pol_platform_law', icon: '\u{1F4BB}', weight: 2,
    title: 'DESINFORMATIONEN SPRIDS SNABBARE',
    text: 'Efter en våg av falska rykten om valfusk vill justitieministern tvinga de stora plattformarna att ta bort vilseledande inlägg inom ett dygn, annars blir det höga böter. Yttrandefrihetsorganisationer protesterar.',
    when: (c) => c.is('internet', 'free', 'open', 'filtered') && (c.ind.internet ?? 50) > 75 && (c.ind.voice ?? 0) > -0.5 && c.st.unrest > 0,
    choices: [
      { text: 'INFÖR LAGEN, MED OBEROENDE GRANSKARE', cost: { pp: 20 }, temp: { safety: 3, stability: 4, freedom: -3 }, tip: 'Färre lögner, fler gränsfall.' },
      { text: 'INFÖR LAGEN - MYNDIGHETEN AVGÖR VAD SOM ÄR FALSKT', cost: { pp: 25 }, law: ['internet', 'censored'], temp: { stability: 6, statepower: 6, freedom: -10 }, tip: 'Sanningen blir ett myndighetsbeslut.' },
      { text: 'SATSA PÅ KÄLLKRITIK I SKOLAN I STÄLLET', cost: { money: 400 }, temp: { stability: -2 }, perm: { hdi: 2, freedom: 2 }, tip: 'Effekten syns om en generation.' },
      { text: 'GÖR INGENTING', temp: { stability: -4, unrest: 3 }, tip: 'Ryktena lever sitt eget liv.' },
    ],
  },
  {
    id: 'pol_internet_shutdown', icon: '\u{1F4F5}', weight: 2,
    title: 'SKA NÄTET STÄNGAS AV?',
    text: 'Protesterna samordnas i krypterade chattgrupper och säkerhetstjänsten vill stänga av mobilnätet och internet i hela landet tills lugnet återvänt. Banker och företag varnar för enorma förluster.',
    when: (c) => c.st.unrest > 30 && !c.is('internet', 'free') && (c.ind.internet ?? 50) > 40,
    choices: [
      { text: 'STÄNG AV ALLT I TRE DAGAR', cost: { pp: 25 }, temp: { unrest: -10, gdp: -8, freedom: -10 }, rel: -6, tip: 'Tyst på gatorna. Tyst i kassaapparaterna.' },
      { text: 'BLOCKERA BARA CHATTAPPARNA', cost: { pp: 15 }, temp: { unrest: -4, freedom: -5, gdp: -2 }, tip: 'Demonstranterna byter app inom en timme.' },
      { text: 'LÅT NÄTET VARA PÅ', temp: { unrest: 4 }, perm: { freedom: 2 }, tip: 'Protesterna fortsätter. Ekonomin också.' },
    ],
  },

  // ================= RÄTTIGHETER, PARTIER & DEMOKRATI =================
  {
    id: 'pol_foreign_agents_law', icon: '\u{1F3F7}\u{FE0F}', weight: 2,
    title: 'LAGEN OM UTLÄNDSKA AGENTER',
    text: 'Ett lagförslag kräver att alla organisationer som får pengar från utlandet registrerar sig som "utländska agenter" och märker allt de publicerar. Miljögrupper, hjälporganisationer och oberoende medier skulle drabbas.',
    when: (c) => c.is('government', 'hybrid', 'authoritarian', 'mixed') && (c.ind.voice ?? 0) < 0 && c.st.statepower > 0,
    choices: [
      { text: 'RÖSTA IGENOM LAGEN', cost: { pp: 25 }, temp: { statepower: 8, freedom: -8 }, rel: -10, tip: 'Den som får stöd utifrån får en etikett. Och snart färre givare.' },
      { text: 'BARA ÖPPEN REDOVISNING AV BIDRAG', cost: { pp: 10 }, temp: { statepower: 2 }, perm: { corruption: -2 }, tip: 'Insyn utan stämpel.' },
      { text: 'STOPPA FÖRSLAGET', temp: { statepower: -4, freedom: 3 }, rel: 5, tip: 'Civilsamhället andas ut. Säkerhetstjänsten suckar.' },
    ],
  },
  {
    id: 'pol_political_prisoners', icon: '\u{1F511}', weight: 2,
    title: 'FÅNGARNA SOM INTE FINNS',
    text: 'En människorättsorganisation publicerar en lista med hundratals oppositionella, studenter och fackledare som sitter fängslade utan rättegång. Officiellt har landet inga politiska fångar.',
    when: (c) => (c.is('civil_rights', 'verylimited', 'norights') || (c.ind.voice ?? 0) < -1.3) && c.st.freedom < 10,
    choices: [
      { text: 'AMNESTI FÖR ALLA PÅ LISTAN', cost: { pp: 30 }, temp: { freedom: 10, statepower: -8, unrest: 4 }, rel: 12, tip: 'Portarna öppnas. Några av dem vill tala med pressen.' },
      { text: 'SLÄPP NÅGRA KÄNDA NAMN', cost: { pp: 10 }, temp: { freedom: 3 }, rel: 4, tip: 'Tillräckligt för en rubrik i utlandet.' },
      { text: 'KALLA LISTAN FIENTLIG PROPAGANDA', temp: { statepower: 4 }, rel: -8, tip: 'Listan blir längre nästa år.' },
    ],
  },
  {
    id: 'pol_party_rebels', icon: '\u{1F645}', weight: 2,
    title: 'UPPROR I PARTIGRUPPEN',
    text: 'Tjugo av dina egna ledamöter har meddelat att de röstar emot regeringens förslag i morgon. Med svag partilojalitet kan du inte tvinga dem, och oppositionen har redan bjudit in dem på middag.',
    when: (c) => c.is('party_loyalty', 'none', 'minimum', 'low') && !c.is('elections', 'no'),
    choices: [
      { text: 'FÖRHANDLA FRAM ÄNDRINGAR', cost: { pp: 15 }, temp: { stability: 3, ideopower: -4 }, tip: 'Lagen blir sämre. Den går igenom.' },
      { text: 'LOVA DERAS VALKRETSAR NYA VÄGAR', cost: { money: 500 }, temp: { stability: 4 }, perm: { corruption: 2 }, tip: 'Asfalt är politikens lim.' },
      { text: 'SKÄRP PARTIDISCIPLINEN', cost: { pp: 25 }, law: ['party_loyalty', 'high'], temp: { stability: 4, freedom: -3 }, tip: 'Ledamöterna blir röstknappar. Lydiga sådana.' },
      { text: 'LÅT FÖRSLAGET FALLA', temp: { polpower: -8 }, tip: 'En förlust i kammaren, inte i partiet.' },
    ],
  },
  {
    id: 'pol_party_whip', icon: '\u{1F4CB}', weight: 2,
    title: 'LEDAMOTEN SOM RÖSTADE FEL',
    text: 'En ung ledamot från ditt parti röstade efter sitt samvete i stället för partilinjen. Partistyrelsen vill utesluta henne och ta ifrån henne platsen, men hon har blivit en hjälte i sociala medier.',
    when: (c) => c.is('party_loyalty', 'high', 'maximum', 'onlyrep') && !c.is('elections', 'no'),
    choices: [
      { text: 'UTESLUT HENNE', temp: { statepower: 4, ideopower: 4, approval: -5 }, tip: 'Linjen håller. Sympatierna gör det inte.' },
      { text: 'EN VARNING, INGET MER', cost: { pp: 10 }, temp: { approval: 3, ideopower: -3 }, tip: 'Mild disciplin. Alla lärde sig något ändå.' },
      { text: 'LÄTTA PÅ PARTIPISKAN', cost: { pp: 20 }, law: ['party_loyalty', 'mixed'], temp: { stability: -3 }, perm: { freedom: 3 }, tip: 'Fler samveten i kammaren. Färre säkra omröstningar.' },
    ],
  },
  {
    id: 'pol_bureaucracy', icon: '\u{1F422}', weight: 2,
    title: 'BYRÅKRATIN STÅR STILL',
    text: 'Det tar nio månader att få ett bygglov och fyra olika myndigheter för att starta ett företag. Tjänstemännen tillsätts efter partibok i stället för kompetens, och alla vet om det.',
    when: (c) => (c.ind.goveff ?? 0) < -0.6 && c.st.corruption > 0,
    choices: [
      { text: 'DIGITALISERA ALLA ANSÖKNINGAR', cost: { money: 700, rp: 40 }, perm: { corruption: -4, gdp: 3, income: 3 }, tip: 'En e-tjänst förhandlar inte om mutor.' },
      { text: 'INFÖR ANTAGNINGSPROV FÖR TJÄNSTEMÄN', cost: { pp: 25 }, temp: { stability: -4 }, perm: { corruption: -4, research: 2 }, tip: 'Kompetens före kontakter. Kontakterna protesterar.' },
      { text: 'ETT NYTT MINISTERIUM FÖR FÖRENKLING', cost: { money: 300 }, temp: { approval: 2 }, perm: { corruption: 1 }, tip: 'En ny myndighet som ska minska antalet myndigheter.' },
      { text: 'DET HAR ALLTID VARIT SÅ HÄR', temp: { gdp: -3 }, tip: 'Blanketten är en del av kulturen.' },
    ],
  },
  {
    id: 'pol_democracy_ranking', icon: '\u{1F53B}', weight: 2,
    title: 'NEDGRADERADE TILL HYBRIDREGIM',
    text: 'Ett internationellt demokratiinstitut flyttar ditt land från kategorin "demokrati" till "hybridregim" och pekar på hårdare tag mot domstolar och medier. Investerare och biståndsgivare läser rapporten noga.',
    when: (c) => (c.ind.voice ?? 0) > -0.8 && (c.ind.voice ?? 0) < 0.4 && c.st.freedom < -10,
    choices: [
      { text: 'BJUD IN INSTITUTET OCH GENOMFÖR REFORMER', cost: { pp: 25 }, temp: { statepower: -5 }, perm: { freedom: 5, corruption: -3 }, rel: 8, tip: 'Uppgraderingen kommer om några år. Kanske.' },
      { text: 'AVFÄRDA RAPPORTEN SOM POLITISK', temp: { statepower: 3, approval: 2 }, rel: -5, tip: 'Hemma tror många på dig. Utomlands ingen.' },
      { text: 'ANLITA EN PR-BYRÅ I UTLANDET', cost: { money: 600 }, perm: { corruption: 2 }, rel: 4, tip: 'Bilden blir bättre. Landet är detsamma.' },
    ],
  },
];
