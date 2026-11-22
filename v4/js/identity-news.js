// IMPERIUM V5.22 STOLTHETEN — nyhetsrubriker om flaggan, sången, passet, ambassaderna, helgdagarna,
// monumenten, ordnarna, sedlarna, frimärkena och nationalstoltheten.
// Samma form som HEADLINES i media-news.js: ämne → ton → lista. Tonerna: friendly = regeringsvänlig,
// neutral = saklig nyhetsbyrå, critical = granskande, propaganda = statspropaganda. Motorn gör om allt
// till VERSALER. Platshållare: {rike} {ledare} {stad} {huvudstad} {land} {val} (saken: monumentets,
// helgdagens eller landets namn, regelns namn …) och {tal} (ett tal).
export const IDN_HEADLINES = {
  flag_new: {
    friendly: [
      'Ny flagga för ett nytt {rike} — folket vajar med stolthet',
      '{ledare} hissar den nya flaggan: "En symbol för framtiden"',
      'Formgivare hyllar den nya flaggan som modig och klar',
      'Skolbarn i {stad} ritade den nya flaggan redan första dagen',
    ],
    neutral: [
      '{rike} har fått en ny flagga',
      'Den nya flaggan hissad över regeringshuset i {huvudstad}',
      'Så ser den nya flaggan ut — och så ska den användas',
      'Ny flagga: myndigheterna byter ut tusentals flaggor',
      'Mätning: folket delat om den nya flaggan',
    ],
    critical: [
      'Ny flagga utan att folket fick säga sitt',
      'Vad kostade den nya flaggan? Vi har räknat',
      'Experter: den nya flaggan bryter mot flaggkonstens regler',
      'Den gamla flaggan försvann över en natt — många sörjer',
    ],
    propaganda: [
      'Världens vackraste flagga vajar nu över {rike}!',
      '{ledare} skänker folket en flagga för tusen år!',
      'Utlandet avundas oss vår strålande nya flagga!',
      'Varje tråd i den nya flaggan bär folkets kärlek till {ledare}!',
    ],
  },

  flag_ref_yes: {
    friendly: [
      'Folket har talat: ja till den nya flaggan',
      'Jubel i {huvudstad} när ja-sidan vinner flaggomröstningen',
      '{ledare} tackar folket för förtroendet i flaggfrågan',
      'En flagga vald av folket — ett ögonblick för historieböckerna',
    ],
    neutral: [
      'Flaggomröstningen klar: ja-sidan vann',
      'Ny flagga efter folkomröstning — byts inom kort',
      'Valdeltagandet i flaggomröstningen högre än väntat',
      'Ja till ny flagga: så röstade landets regioner',
    ],
    critical: [
      'Ja-sidan vann — men nästan hälften ville behålla den gamla',
      'Kampanjpengarna avgjorde flaggomröstningen, säger kritiker',
      'Ny flagga godkänd: veteranerna känner sig överkörda',
      'Flaggan byts — men vad hände med löftet om sjukhusen?',
    ],
    propaganda: [
      'Hela folket röstade ja — som ledaren visste att de skulle!',
      'Rekordseger för flaggan och för {ledare}!',
      'Inte en enda röst emot som räknas — {rike} har valt!',
      'Folkets vilja och ledarens vilja är ett och samma!',
    ],
  },

  flag_ref_no: {
    friendly: [
      'Folket valde traditionen — {ledare} respekterar beslutet',
      'Den gamla flaggan står kvar, och det är demokrati',
      'Regeringen: "Vi lyssnade, och folket svarade"',
      'Flaggomröstningen gav landet en stolt debatt',
    ],
    neutral: [
      'Nej i flaggomröstningen — den gamla flaggan blir kvar',
      'Folket röstade nej till ny flagga',
      'Flaggomröstningen klar: nej-sidan vann tydligt',
      'Som i Nya Zeeland: nej till flaggbyte',
    ],
    critical: [
      'Bakslag för {ledare}: folket sa nej till flaggan',
      'Dyr omröstning för ingenting — flaggan blir kvar',
      'Regeringen förlorade flaggfrågan — vad händer nu?',
      'Folket litade inte på regeringens flagga',
    ],
    propaganda: [
      'Folket älskar den gamla flaggan för att {ledare} älskar den!',
      'Förrädarnas flaggförslag krossat av folkets klokskap!',
      'Den eviga flaggan vajar för evigt!',
      'Utländska krafter ville byta vår flagga — de misslyckades!',
    ],
  },

  flag_law: {
    friendly: [
      'Ny flagglag: "{val}" — regeringen tar ansvar för symbolerna',
      'Tydliga regler för flaggan välkomnas av veteranerna',
      '{ledare}: "Flaggan förtjänar respekt"',
      'Flagglagen ger lugn kring nationens symboler',
    ],
    neutral: [
      'Flagglagen ändras till "{val}"',
      'Nya regler för hur flaggan får användas',
      'Det här gäller nu om du bränner en flagga',
      'Flagglagen klubbad i {huvudstad}',
    ],
    critical: [
      'Ny flagglag — är en åsikt nu ett brott?',
      'Jurister varnar: flagglagen hotar yttrandefriheten',
      '"{val}": konstnärer och demonstranter oroliga',
      'Flagglagen kritiseras av människorättsgrupper',
    ],
    propaganda: [
      'Flaggan är helig, och nu vet alla det!',
      'Skändarna darrar inför den nya flagglagen!',
      '{ledare} skyddar flaggan som en far skyddar sitt barn!',
      'Ingen ska någonsin mer våga röra vår flagga!',
    ],
  },

  halfmast: {
    friendly: [
      'Landet sörjer tillsammans — flaggorna på halv stång',
      '{ledare} leder nationen i sorgen',
      'Tusentals samlas i {huvudstad} för en tyst minut',
      'Flaggorna sänkta: ett land som håller ihop',
    ],
    neutral: [
      'Flaggorna på halv stång i hela {rike}',
      'Nationell sorgedag utlyst',
      'Flaggorna sänks på alla offentliga byggnader',
      'Minnesstund i {stad} i dag',
    ],
    critical: [
      'Halv stång räcker inte — de drabbade behöver hjälp',
      'Frågorna växer medan flaggorna hänger lågt',
      'Sorgen är verklig — men ansvaret måste utredas',
      'Halv stång och tomma ord från {huvudstad}?',
    ],
    propaganda: [
      'Hela folket sörjer i enighet bakom {ledare}!',
      'I sorgen står {rike} starkare än någonsin!',
      'Ledaren gråter med sitt folk!',
      'Inget land sörjer med sådan värdighet som vårt!',
    ],
  },

  anthem_rule: {
    friendly: [
      'Nationalsången: "{val}" — regeringen värnar traditionen',
      'Barn och föräldrar sjunger med stolthet',
      '{ledare}: "Sången binder oss samman"',
      'Nya regler för sången välkomnas i skolorna',
    ],
    neutral: [
      'Nya regler för nationalsången: "{val}"',
      'Så gäller reglerna för sången från i dag',
      'Regeringen ändrar reglerna för nationalsången',
      'Sången på arenor och i skolor: detta ändras',
    ],
    critical: [
      'Tvång att sjunga — är det stolthet?',
      '"{val}": böter för den som sitter ner?',
      'Kritiker: man kan inte beordra fram kärlek till landet',
      'Nationalsången blir en fråga för polisen',
    ],
    propaganda: [
      'Hela {rike} sjunger som en röst!',
      'Sången ljuder i varje skola, varje arena, varje hjärta!',
      'Den som inte sjunger med har inget hjärta!',
      '{ledare} ger folket glädjen att sjunga!',
    ],
  },

  holiday_add: {
    friendly: [
      'Ny helgdag: {val} — en dag för hela folket',
      'Folket får en ledig dag till — {ledare} lyssnade',
      'Glädje i {stad}: {val} blir helgdag',
      'Regeringen ger familjerna mer tid tillsammans',
    ],
    neutral: [
      '{val} blir ny helgdag',
      'Ny helgdag i almanackan: {val}',
      'Riksdagen klubbar ny helgdag',
      'Så påverkas jobb och skola av den nya helgdagen',
    ],
    critical: [
      'Ny helgdag — vem betalar för den lediga dagen?',
      'Företagen varnar: {val} kostar miljarder',
      'Valfläsk i almanackan? Ny helgdag inför valet',
      'Ekonomer: en ledig dag kostar en tiondels procent av BNP',
    ],
    propaganda: [
      '{ledare} skänker folket en ny högtidsdag!',
      '{val}: hela landet dansar av tacksamhet!',
      'Ingen ledare har gett folket så mycket glädje!',
      'En dag att fira {rike} och dess storhet!',
    ],
  },

  holiday_cut: {
    friendly: [
      'Ansvarsfullt beslut: {val} stryks för landets framtid',
      'En extra arbetsdag stärker {rike}',
      '{ledare}: "Vi gör det svåra för att det behövs"',
      'Pengarna från {val} går till försvar och välfärd',
    ],
    neutral: [
      '{val} är inte längre helgdag',
      'Regeringen stryker en helgdag',
      'Facken protesterar mot strukna {val}',
      'Som i Danmark 2023: en helgdag avskaffas',
    ],
    critical: [
      'De tog vår lediga dag — ilskan växer',
      'Strejkhot efter att {val} strukits',
      'En dag mindre vila — vem tjänar på det?',
      'Hundratusentals protesterar i {huvudstad} mot den strukna helgdagen',
    ],
    propaganda: [
      'Folket vill arbeta för {ledare} — {val} behövs inte!',
      'En extra dag av flit gör {rike} oövervinnligt!',
      'Arbetet är den sanna högtiden!',
      'Endast lata förrädare saknar {val}!',
    ],
  },

  monument_start: {
    friendly: [
      'Första spadtaget för {val} i {huvudstad}',
      '{ledare} lägger grundstenen till {val}',
      'Ett monument för kommande generationer',
      'Byggarna i {stad} stolta över att bygga {val}',
    ],
    neutral: [
      'Bygget av {val} har börjat',
      'Så ska {val} se ut när det är klart',
      'Regeringen påbörjar nytt nationalmonument',
      '{val}: byggtid och kostnad presenterade',
    ],
    critical: [
      'Miljoner till {val} — när sjukhusen väntar',
      'Vem ville ha {val}? Ingen frågade folket',
      'Kostnaderna för {val} kan bli mycket högre',
      'Prestigebygge i kristider kritiseras',
    ],
    propaganda: [
      '{val} ska bli världens åttonde underverk!',
      'Hela folket bygger {val} med glädje i hjärtat!',
      'Ett monument värdigt {ledare} reser sig!',
      'Utlandet häpnar inför bygget av {val}!',
    ],
  },

  monument_done: {
    friendly: [
      '{val} invigt — ett landmärke för {rike}',
      'Tusentals besökare första dagen vid {val}',
      '{ledare} inviger {val}: "Det här är vårt"',
      'Turisterna strömmar till {val}',
    ],
    neutral: [
      '{val} är klart och invigt',
      'Invigning av {val} i {huvudstad}',
      'Nu öppnar {val} för allmänheten',
      'Så blev {val} — bilder från invigningen',
    ],
    critical: [
      '{val} klart — försenat och dyrare än utlovat',
      'Vem betalar underhållet av {val}?',
      'Arkitekter delade om {val}',
      'Invigningen av {val} kostade mer än en skola',
    ],
    propaganda: [
      '{val} lyser över världen!',
      'Det mest storslagna monumentet i mänsklighetens historia!',
      'Folket gråter av lycka vid {val}!',
      '{val} — ett tecken på ledarens visdom!',
    ],
  },

  monument_topple: {
    friendly: [
      'En ny tid: {val} tas ned i lugn och ordning',
      '{ledare}: "Vi bygger framtiden, inte det förflutna"',
      '{val} flyttas till museum — historien bevaras',
      'Folket enigt: platsen får en ny mening',
    ],
    neutral: [
      '{val} har rivits',
      'Folkmassa river {val} i {huvudstad}',
      '{val} borta från stadsbilden',
      'Det här händer nu med platsen där {val} stod',
    ],
    critical: [
      'Monument rivs — men vad händer med det som byggde det?',
      '{val} borta: en symbol föll, problemen står kvar',
      'Historiker varnar: riv inte historien',
      'Vem bestämde att {val} skulle bort?',
    ],
    propaganda: [
      'Folket rensar bort det gamla och omfamnar {ledare}!',
      'Det falska monumentet är borta — sanningen står kvar!',
      'Fiendens symboler krossade av folkets vrede!',
      'Från ruinerna reser sig ett ännu större {rike}!',
    ],
  },

  embassy_open: {
    friendly: [
      'Ny ambassad i {val} — nya dörrar öppnas',
      '{rike} stärker banden till {val}',
      'Företagen jublar: ambassad i {val} öppnar marknader',
      'Flaggan hissad över den nya ambassaden i {val}',
    ],
    neutral: [
      '{rike} öppnar ambassad i {val}',
      'Diplomatiska förbindelser med {val} fördjupas',
      'Ny ambassadör utsedd till {val}',
      'Ambassaden i {val} invigd',
    ],
    critical: [
      'Ny ambassad i {val} — vad kostar den?',
      'Varför {val}? Frågor om den nya ambassaden',
      'Dyra ambassadhus när skolorna sparar',
      'Ambassad i {val} kritiseras av oppositionen',
    ],
    propaganda: [
      'Hela världen vill ha {rike}s ambassad!',
      '{val} bugar sig inför vår nya ambassad!',
      '{ledare} bygger broar till alla hörn av jorden!',
      'Ännu en nation erkänner {rike}s storhet!',
    ],
  },

  embassy_close: {
    friendly: [
      'Smart sparbeslut: ambassaden i {val} stängs',
      'Pengarna från ambassaden i {val} går till välfärden',
      'Regeringen samarbetar med grannländer i stället',
      'Färre ambassader, bättre diplomati',
    ],
    neutral: [
      'Ambassaden i {val} stängs',
      '{rike} lämnar {val} diplomatiskt',
      'Ambassadören i {val} kallas hem',
      'Medborgare i {val} hänvisas till grannlandets ambassad',
    ],
    critical: [
      'Medborgarna i {val} står utan hjälp',
      'Stängd ambassad i {val} — en dörr som är svår att öppna igen',
      'Exportföretag oroliga efter stängningen i {val}',
      'Vem hjälper turisterna nu?',
    ],
    propaganda: [
      '{val} förtjänar inte vår närvaro!',
      '{ledare} vänder ryggen åt de otacksamma!',
      'Vi behöver ingen ambassad — hela världen kommer till oss!',
      'Stängningen visar {rike}s styrka!',
    ],
  },

  visa_waive: {
    friendly: [
      'Visumfrihet för {val} — turisterna välkomnas',
      'Nya vänner: {rike} öppnar för besökare från {val}',
      'Hotellen i {stad} jublar över visumfriheten',
      'Öppenhet lönar sig: visumfrihet ger fler besökare',
    ],
    neutral: [
      'Medborgare från {val} behöver inte längre visum',
      'Visumkravet för {val} slopas',
      'Ny visumfrihet träder i kraft',
      'Resa utan visum mellan {rike} och {val}',
    ],
    critical: [
      'Visumfrihet för {val} — vem kontrollerar vem som kommer?',
      'Polisen oroad över visumfriheten för {val}',
      'Öppna gränser utan plan, säger kritiker',
      'Visumfrihet för {val}: får vi något tillbaka?',
    ],
    propaganda: [
      'Folket i {val} köar för att få se {rike}!',
      '{ledare} öppnar porten till paradiset!',
      'Hela världen vill besöka vårt land!',
      'Visumfrihet — gåvan från en generös ledare!',
    ],
  },

  visa_ban: {
    friendly: [
      'Regeringen skyddar landet: inreseförbud för {val}',
      'Ett tydligt besked till {val}',
      '{ledare}: "Vår säkerhet går först"',
      'Inreseförbudet mot {val} får stöd i ny mätning',
    ],
    neutral: [
      'Inreseförbud mot medborgare från {val}',
      '{rike} stänger gränsen för {val}',
      'Så påverkas familjer av inreseförbudet mot {val}',
      'Gränspolisen förbereder inreseförbudet',
    ],
    critical: [
      'Inreseförbudet splittrar familjer',
      'Väntas leda till vedergällning från {val}',
      'Studenter från {val} vet inte vad som händer',
      'Inreseförbud — hjälper det eller stjälper det?',
    ],
    propaganda: [
      'Gränserna stängda för {val}s ränker!',
      '{ledare} vaktar porten till {rike}!',
      'Fienden hålls ute — folket sover tryggt!',
      '{val} får vad de förtjänar!',
    ],
  },

  visa_reciprocity: {
    friendly: [
      'Rättvist avtal: visumfrihet åt båda håll med {val}',
      'Diplomatisk framgång: {val} öppnar för våra medborgare',
      'Ömsesidighet ger resenärer från {rike} fler vägar',
      '{ledare} förhandlar fram visumfrihet',
    ],
    neutral: [
      '{val} svarar med visumfrihet för {rike}',
      'Ömsesidig visumfrihet med {val} klar',
      'Passet från {rike} gäller nu i {val} utan visum',
      '{val} ändrar sina visumregler för {rike}',
    ],
    critical: [
      '{val} svarar med samma mynt — visumkrav för oss',
      'Visumbråket med {val} slår mot resenärerna',
      'Passet tappar i värde efter svar från {val}',
      'Diplomatin sviktar: {val} inför visum',
    ],
    propaganda: [
      'Världen följer {rike}s exempel!',
      '{val} böjer sig för ledarens vilja!',
      'Vårt pass öppnar alla dörrar!',
      'Ännu en seger för {ledare} på världsscenen!',
    ],
  },

  golden_on: {
    friendly: [
      'Gyllene pass ger miljarder till statskassan',
      'Investerare från hela världen vill till {rike}',
      '{ledare}: "Pengarna går till skolor och vägar"',
      'Nytt program lockar företagare till {stad}',
    ],
    neutral: [
      '{rike} säljer medborgarskap mot investering',
      'Gyllene pass: så fungerar det nya programmet',
      'Uppehållstillstånd mot investering införs',
      'Första köparna av gyllene pass godkända',
    ],
    critical: [
      'Medborgarskap till salu — vem köper?',
      'Grannländerna varnar för de gyllene passen',
      'Som Malta och Cypern: risk för pengatvätt',
      'Är ett pass en vara? Kritiken växer',
    ],
    propaganda: [
      'Världens rikaste köar för att bli medborgare hos oss!',
      'Vårt pass är värt mer än guld!',
      'Miljardärer drömmer om att bli en del av {rike}!',
      '{ledare} förvandlar passet till guld!',
    ],
  },

  golden_off: {
    friendly: [
      'Medborgarskapet är inte till salu — programmet stängs',
      '{ledare} sätter passets värde före pengarna',
      'Grannländerna välkomnar beslutet',
      'Ordning och reda: de gyllene passen avskaffas',
    ],
    neutral: [
      'Programmet för gyllene pass avslutas',
      '{rike} slutar sälja medborgarskap',
      'Inga nya gyllene pass från och med i dag',
      'Så påverkas de som redan köpt pass',
    ],
    critical: [
      'Äntligen — men varför tog det så lång tid?',
      'Gyllene passen stängs efter skandalen',
      'Vad hände med pengarna från passförsäljningen?',
      'Hur många fel personer hann köpa ett pass?',
    ],
    propaganda: [
      'Vårt medborgarskap är heligt och kan inte köpas!',
      '{ledare} skyddar nationens själ!',
      'Inga pengar i världen räcker för att bli en av oss!',
      'Ledaren visar vägen — rena pass för ett rent folk!',
    ],
  },

  pass_security: {
    friendly: [
      'Nya säkra pass: "{val}" — förfalskarna får det svårt',
      'Moderna pass öppnar fler gränser',
      '{ledare}: "Ett pass världen kan lita på"',
      'Säkrare pass hyllas av gränspolisen',
    ],
    neutral: [
      'Passen byts till "{val}"',
      'Ny passteknik införs under året',
      'Så får du ditt nya pass',
      'Passmyndigheten börjar utfärda nya pass',
    ],
    critical: [
      'Nya pass — och nya köer till passkontoret',
      'Vem har tillgång till fingeravtrycken?',
      'Dyrt passbyte kritiseras',
      'Experter: chipet kan knäckas',
    ],
    propaganda: [
      'Världens säkraste pass tillhör {rike}!',
      'Ingen fiende kan förfalska vår identitet!',
      '{ledare} skyddar varje medborgare med teknik från framtiden!',
      'Passet är en mur mot fiendens ränker!',
    ],
  },

  exit_visa: {
    friendly: [
      'Utresevisum skyddar landets läkare och ingenjörer',
      '{ledare}: "Vi behöver våra talanger här"',
      'Ordning vid gränsen: utresor prövas',
      'Fria resor igen — utresevisumet avskaffat',
    ],
    neutral: [
      'Utresevisum krävs för resor utomlands',
      'Nya regler för resor ut ur landet',
      'Utresevisumet avskaffas',
      'Kö till utresetillstånd i {huvudstad}',
    ],
    critical: [
      'Fångar i sitt eget land — utresevisum kritiseras',
      'Läkare flyr trots utresevisumet',
      'Människorättsgrupper: rätten att lämna sitt land kränks',
      'Utresevisum — ett tecken på ett land i kris',
    ],
    propaganda: [
      'Ingen vill lämna paradiset — och nu behöver ingen!',
      'Folket stannar hos {ledare} av egen fri vilja!',
      'Varför resa ut när allt finns här?',
      'Gränsen skyddar folket från utlandets frestelser!',
    ],
  },

  order_award: {
    friendly: [
      'Vardagens hjältar hedrade med statens orden',
      '{ledare} delar ut ordnar till landets främsta',
      'Barnmorskor och brandmän fick ordnar i {huvudstad}',
      'Ordensdagen: nationen tackar sina bästa',
    ],
    neutral: [
      'Årets ordnar utdelade',
      'Statens orden delad till {val}',
      'Ceremoni på slottet i {huvudstad}',
      'Här är mottagarna av årets ordnar',
    ],
    critical: [
      'Ordnar till ministrar och vänner — igen',
      'Vem bestämmer vem som får en orden?',
      'Kritik mot årets ordensutdelning',
      'Ordnarna delas ut som godis, säger kritiker',
    ],
    propaganda: [
      'Den högsta äran i världen delad av den största ledaren!',
      'Hjältarna gråter av lycka när {ledare} fäster ordern!',
      'Varje orden från {rike} är värd mer än guld!',
      'Folkets bästa hedrade av folkets bäste!',
    ],
  },

  honours_sold: {
    friendly: [
      'Gåvor till staten — och ett tack från nationen',
      'Generösa givare hedrade för sina bidrag',
      'Regeringen: alla ordnar har gått till förtjänta',
      'Bidragen går till kultur och välgörenhet',
    ],
    neutral: [
      'Ordnar till stora givare väcker frågor',
      'Uppgifter: ordnar har getts mot pengar',
      'Polisen utreder ordnarna',
      'Ordenskansliet granskas',
    ],
    critical: [
      'Ordnar mot pengar — skandalen växer',
      'Ett kors för fem miljoner: mejlen avslöjar allt',
      'Som Storbritannien 2006: ordnar till salu',
      'Hederstecken till salu — de riktiga hjältarna skäms',
    ],
    propaganda: [
      'Lögner om ordnarna sprids av fiendens tidningar!',
      'Endast de värdigaste får ledarens orden!',
      'Givarnas kärlek till {rike} belönas med rätta!',
      'Ordensskandalen är en utländsk konspiration!',
    ],
  },

  notes_new: {
    friendly: [
      'Nya sedlar: "{val}" — vackra och säkra',
      'Folket får sedlar att vara stolta över',
      'Nya sedlar hyllas av formgivare',
      'Säkrare pengar i plånboken från i dag',
    ],
    neutral: [
      'Ny sedelserie: "{val}"',
      'Centralbanken släpper nya sedlar',
      'De gamla sedlarna gäller i fyra månader till',
      'Så känner du igen de nya sedlarna',
    ],
    critical: [
      'Nya sedlar — vad kostade bytet?',
      'Vem valde motivet på de nya sedlarna?',
      'Pensionärer förvirrade av de nya sedlarna',
      'Sedlar i ett land där ingen använder kontanter?',
    ],
    propaganda: [
      'Världens vackraste pengar finns i {rike}!',
      'Varje sedel bär landets storhet!',
      '{ledare} ger folket pengar att vara stolta över!',
      'Utlandet vill samla våra sedlar!',
    ],
  },

  stamp: {
    friendly: [
      'Nytt frimärke: {val} — en hälsning till världen',
      'Frimärkssamlarna jublar över nya märket',
      'Vackert frimärke hyllar {val}',
      '{rike} berättar om sig själv i nytt frimärke',
    ],
    neutral: [
      'Posten ger ut nytt frimärke: {val}',
      'Nytt frimärke i dag',
      'Frimärket {val} finns på postkontoren',
      'Första dagsstämpeln för nytt frimärke i {stad}',
    ],
    critical: [
      'Frimärke för {val} — men posten delar knappt ut brev',
      'Vem skickar brev i dag?',
      'Nytt frimärke kritiseras för motivet',
      'Posten lägger ner kontor men ger ut frimärken',
    ],
    propaganda: [
      'Världens mest efterlängtade frimärke!',
      'Varje brev bär nu {rike}s glans!',
      'Samlare i alla länder köar för vårt frimärke!',
      'Frimärket {val} — konst för tusen år!',
    ],
  },

  stamp_misprint: {
    friendly: [
      'Lyckligt feltryck: ett frimärke blir en skatt',
      'Samlare i hela världen talar om {rike}',
      'Feltrycket gör landet känt',
      'Ett fel som blev en framgång',
    ],
    neutral: [
      'Feltryckt frimärke upptäckt i {stad}',
      'Upp och ner: frimärke med fel i trycket',
      'Feltrycket kan bli värt miljoner',
      'Posten bekräftar feltryck på nytt frimärke',
    ],
    critical: [
      'Feltryck — hur kunde det hända?',
      'Posten slarvar med tryckningen',
      'Vem tjänar på feltrycket?',
      'Felet som ingen på posten märkte',
    ],
    propaganda: [
      'Inget feltryck — ett medvetet konstverk!',
      'Även våra misstag är mästerverk!',
      'Världen häpnar inför {rike}s unika frimärke!',
      'Ledarens frimärke är värt mer än guld!',
    ],
  },

  pride_up: {
    friendly: [
      'Stoltheten växer — folket tror på {rike}',
      'Ny mätning: fler stolta medborgare än på länge',
      '{ledare}: "Vi har mycket att vara stolta över"',
      'Flaggor i fönstren i hela {stad}',
    ],
    neutral: [
      'Fler säger sig vara mycket stolta över landet',
      'Undersökning: nationalstoltheten ökar',
      'Stoltheten högst bland äldre',
      'Stoltheten stiger efter ett händelserikt år',
    ],
    critical: [
      'Stolthet eller chauvinism? Forskare varnar',
      'Stoltheten stiger — men inte för alla',
      'När stolthet blir till förakt mot andra',
      'Flaggviftande döljer problemen',
    ],
    propaganda: [
      'Hela folket brinner av kärlek till {rike}!',
      'Ingen nation på jorden är så stolt som vår!',
      'Stoltheten når himlen — tack, {ledare}!',
      'Varje hjärta slår för fosterlandet!',
    ],
  },

  pride_down: {
    friendly: [
      'Regeringen tar folkets oro på allvar',
      '{ledare} lovar att ge folket tillbaka framtidstron',
      'Stoltheten svajar — men landet står stadigt',
      'Ny satsning ska stärka gemenskapen',
    ],
    neutral: [
      'Färre är stolta över landet',
      'Mätning: nationalstoltheten sjunker',
      'Unga minst stolta i ny undersökning',
      'Stoltheten lägst på årtionden',
    ],
    critical: [
      'Stoltheten rasar — och regeringen tittar på',
      'Folket har tappat tron på {rike}',
      'Unga vill flytta utomlands',
      'När ingen längre är stolt: en kris i landets själ',
    ],
    propaganda: [
      'Mätningen är förfalskad av utländska agenter!',
      'Folkets kärlek till {ledare} har aldrig varit större!',
      'Endast förrädare säger att stoltheten sjunker!',
      'I hjärtat är varje medborgare oändligt stolt!',
    ],
  },
};
