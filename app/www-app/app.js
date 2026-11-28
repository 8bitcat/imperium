// IMPERIUM som iPhone-app: det som bara finns i appen, ovanpå webbspelet v4 (som inte ändras).
// Carl 2026-11-28: «baserad på webbversionen … inställd på 3d från början … spela mot andra om man har rumskod …
// lägg in saker man ska kunna köpa och reklam efter eventen».
//
//   • 3D från början: build.mjs lägger en rad i <head> som sätter imperium.mode3d = 1 vid första starten
//     (spelaren kan fortfarande byta till pixelläget med knappen 3D).
//   • Rummen: webbspelets SPELA MED KOMPISAR (PeerJS, fyra tecken lång rumskod) följer med oförändrat.
//   • BUTIKEN (köp i appen, @capgo/native-purchases = StoreKit 2):
//       INGEN REKLAM – engångsköp, följer Apple-kontot (Återställ köp).
//       STATSKASSAN LITEN / STOR – pengar i ett halvår (60 dagar) / tre år (360 dagar) av din dagsinkomst.
//       FORSKNINGSANSLAG – forskningspoäng för 60 dagar av din forskning.
//     Förbrukningsvarorna gäller bara solospelet (i rummen vore det fusk mot kompisarna). Ett köp som kommer in
//     utan ett solospel igång väntar till nästa gång ett solospel är öppet.
//   • REKLAMEN (Google AdMob, @capacitor-community/admob): en helsidesannons när du stängt en händelse, i
//     solospelet, högst en var tredje minut och inte under de två första minuterna. Världen står still medan
//     annonsen visas. Ingen reklam i rummen (världen väntar inte där) och ingen efter köpet INGEN REKLAM.
//     Samtyckesrutan (EU, Googles UMP) och Apples spårningsfråga (ATT) visas före första annonsen.
(() => {
  'use strict';
  // rummets värd körs i en dold iframe (?server=1, main.js createRoom) – där finns ingen butik och ingen reklam
  if (/[?&]server=1/.test(location.search)) return;
  const CFG = window.IM_APP || {};
  const SKU = (CFG.bundle || 'io.eightbitcat.imperium') + '.';
  const PRODUKTER = [
    { id: 'ingenreklam', sku: SKU + 'ingenreklam', typ: 'ingenreklam', namn: 'INGEN REKLAM', text: 'INGA ANNONSER EFTER HÄNDELSERNA – FÖR ALLTID' },
    { id: 'kassa-liten', sku: SKU + 'kassa.liten', typ: 'pengar', dagar: 60, namn: 'STATSKASSAN', text: 'ETT HALVÅRS INKOMST RAKT I KASSAN' },
    { id: 'kassa-stor', sku: SKU + 'kassa.stor', typ: 'pengar', dagar: 360, namn: 'STORA STATSKASSAN', text: 'TRE ÅRS INKOMST RAKT I KASSAN' },
    { id: 'forskning', sku: SKU + 'forskning', typ: 'rp', dagar: 60, namn: 'FORSKNINGSANSLAG', text: 'ETT HALVÅRS FORSKNING PÅ EN GÅNG' },
  ];
  const forbruk = (p) => p.typ === 'pengar' || p.typ === 'rp';
  const $ = (s) => document.querySelector(s);
  const native = () => { try { return !!window.Capacitor?.isNativePlatform?.(); } catch { return false; } };
  const plug = (n) => (native() ? window.Capacitor?.Plugins?.[n] || null : null);
  const S = () => window.IMPERIUM;              // webbspelets state (main.js: window.IMPERIUM = state)
  const API = () => window.__imperium || {};
  const solo = () => S()?.mode === 'solo' && S()?.solo?.res ? S().solo : null;

  // ---------- läget (utanför sparningarna) ----------
  const KEY = 'imperium.app.kop';
  let L = null;
  const las = () => {
    if (L) return L;
    let p = null;
    try { p = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { /* trasigt */ }
    L = {
      tx: Array.isArray(p?.tx) ? p.tx.slice(-300) : [],
      ingenreklam: !!p?.ingenreklam,
      vantar: Array.isArray(p?.vantar) ? p.vantar.filter((id) => PRODUKTER.some((x) => x.id === id && forbruk(x))).slice(0, 20) : [],
    };
    return L;
  };
  const spara = () => { try { localStorage.setItem(KEY, JSON.stringify(las())); } catch { /* fullt */ } };

  // ---------- en liten ruta i spelets stil ----------
  function meddela(text, ms = 4500) {
    let el = $('#appmsg');
    if (!el) {
      el = document.createElement('div');
      el.id = 'appmsg';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(meddela.t);
    meddela.t = setTimeout(() => el.classList.remove('show'), ms);
  }

  // ---------- förbrukningsvaror i solospelet ----------
  const vardeFor = (p) => {
    const s = solo();
    if (!s) return 0;
    if (p.typ === 'pengar') return Math.max(50, Math.round((API().moneyPerDay?.() || 0) * p.dagar));
    if (p.typ === 'rp') return Math.max(100, Math.round((API().researchIncome?.()?.total || 0) * p.dagar));
    return 0;
  };
  function ge(p) {
    const s = solo();
    if (!s) return 0;
    const v = vardeFor(p);
    if (p.typ === 'pengar') s.res.money += v;
    if (p.typ === 'rp') s.res.rp += v;
    return v;
  }
  function vantandeIn() {
    const st = las();
    if (!st.vantar.length || !solo()) return;
    const ut = st.vantar.splice(0).map((id) => PRODUKTER.find((p) => p.id === id)).filter(Boolean);
    spara();
    for (const p of ut) ge(p);
    meddela(`DINA KÖP LIGGER NU I SPELET: ${ut.map((p) => p.namn).join(', ')}`);
  }

  function bokfor(tx) {
    const p = PRODUKTER.find((x) => x.sku === tx?.productIdentifier);
    if (!p) return null;
    const st = las(), id = String(tx.transactionId || '');
    if (tx.revocationDate) { if (p.typ === 'ingenreklam') { st.ingenreklam = false; spara(); } return null; }
    if (id && st.tx.includes(id)) return null;
    if (id) st.tx.push(id);
    let v = 0;
    if (p.typ === 'ingenreklam') st.ingenreklam = true;
    else if (solo()) v = ge(p);
    else st.vantar.push(p.id);
    spara();
    return { p, v };
  }
  // beloppen visas som i spelet: pengar i riktiga dollar (real.js money), forskning i poäng
  let REAL = null;
  import('../js/real.js').then((m) => { REAL = m; }).catch(() => {});
  const belopp = (p, v) => p.typ === 'pengar' ? (REAL ? REAL.money(v) : `${Math.round(v)} \u{1F4B0}`) : `${Math.round(v).toLocaleString('sv-SE')} FORSKNINGSPOÄNG`;
  const tack = ({ p, v }) => p.typ === 'ingenreklam' ? 'TACK! INGA FLER ANNONSER.'
    : v ? `TACK! +${belopp(p, v)}${p.typ === 'pengar' ? ' I KASSAN' : ''}`
      : 'TACK! KÖPET KOMMER IN NÄR DU SPELAR ETT SOLOSPEL.';

  // ---------- Apple ----------
  let priser = null;
  async function hamtaPriser() {
    const P = plug('NativePurchases');
    if (!P || priser) return priser;
    try {
      const r = await P.getProducts({ productIdentifiers: PRODUKTER.map((p) => p.sku), productType: 'inapp' });
      priser = {};
      for (const x of r?.products || []) if (x?.identifier) priser[x.identifier] = String(x.priceString || '');
    } catch { priser = null; }
    return priser;
  }
  async function kopa(p) {
    const P = plug('NativePurchases');
    if (!P) return 'BUTIKEN FINNS I IPHONE-APPEN.';
    if (p.typ === 'ingenreklam' && las().ingenreklam) return 'DEN ÄR REDAN DIN.';
    try {
      const tx = await P.purchaseProduct({ productIdentifier: p.sku, productType: 'inapp', quantity: 1, isConsumable: forbruk(p) });
      const r = bokfor(tx);
      if (r?.p.typ === 'ingenreklam') avbrytAnnonser();
      return r ? tack(r) : 'TACK!';
    } catch (e) {
      const m = String(e?.message || e || '');
      if (/pending/i.test(m)) return 'KÖPET VÄNTAR PÅ GODKÄNNANDE. DET KOMMER IN NÄR DET ÄR KLART.';
      if (/cancel/i.test(m)) return '';
      return 'KÖPET GICK INTE IGENOM. FÖRSÖK IGEN OM EN STUND.';
    }
  }
  async function aterstall(tyst) {
    const P = plug('NativePurchases');
    if (!P) return '';
    try {
      if (!tyst) await P.restorePurchases();
      const r = await P.getPurchases({ productType: 'inapp', onlyCurrentEntitlements: true });
      let n = 0;
      for (const tx of r?.purchases || []) if (tx?.productIdentifier === SKU + 'ingenreklam' && !tx.revocationDate && !las().ingenreklam) { las().ingenreklam = true; n++; }
      if (n) { spara(); avbrytAnnonser(); }
      return n ? 'INGEN REKLAM ÄR ÅTERSTÄLLD.' : 'ALLT DU KÖPT FINNS REDAN HÄR.';
    } catch { return tyst ? '' : 'DET GICK INTE ATT ÅTERSTÄLLA JUST NU.'; }
  }

  // ---------- butiken ----------
  function byggButik() {
    const ov = document.createElement('div');
    ov.id = 'appbutik';
    ov.className = 'overlay';
    ov.innerHTML = `<div class="card">
      <div class="logo" style="font-size:16px">&#128722; BUTIKEN</div>
      <div class="tagline" id="abinfo"></div>
      <div id="ablist"></div>
      <div class="err" id="abmsg"></div>
      <button id="abrest" class="btn">&#8635; ÅTERSTÄLL KÖP</button>
      <button id="abclose" class="btn amber">STÄNG</button>
    </div>`;
    document.body.appendChild(ov);
    $('#abclose').addEventListener('click', () => ov.classList.remove('show'));
    $('#abrest').addEventListener('click', async () => { $('#abmsg').textContent = '…'; $('#abmsg').textContent = await aterstall(false); ritaButik(); });
  }
  async function ritaButik() {
    const lista = $('#ablist');
    const s = solo();
    $('#abinfo').textContent = !native() ? 'BUTIKEN FINNS I IPHONE-APPEN'
      : s ? 'STATSKASSAN OCH FORSKNINGEN GÅR TILL RIKET DU SPELAR NU'
        : 'STATSKASSAN OCH FORSKNINGEN KOMMER IN NÄSTA GÅNG DU SPELAR ETT SOLOSPEL (INTE I RUMMEN)';
    const pr = (await hamtaPriser()) || {};
    lista.innerHTML = '';
    for (const p of PRODUKTER) {
      const b = document.createElement('button');
      b.className = 'btn' + (p.typ === 'ingenreklam' ? ' amber' : '');
      const agd = p.typ === 'ingenreklam' && las().ingenreklam;
      const v = vardeFor(p);
      const mer = v ? ` (+${belopp(p, v)})` : '';
      b.innerHTML = `${p.namn}${agd ? ' &#10003;' : ''}<br><span style="font-size:7px;opacity:.8">${p.text}${mer}</span>`
        + `<span style="float:right">${agd ? 'KÖPT' : pr[p.sku] || ''}</span>`;
      b.disabled = agd || !native();
      b.addEventListener('click', async () => {
        b.disabled = true;
        $('#abmsg').textContent = '…';
        $('#abmsg').textContent = await kopa(p);
        ritaButik();
      });
      lista.appendChild(b);
    }
  }
  function oppnaButik() { $('#appbutik').classList.add('show'); $('#abmsg').textContent = ''; ritaButik(); }

  // ---------- reklamen ----------
  const ANNONS_MELLAN = 180_000, ANNONS_FORST = 120_000;
  const start = Date.now();
  let senast = 0, laddad = false, redo = false, visar = false, pausFore = null;
  const AD = () => plug('AdMob');
  const annonsId = () => CFG.admob?.interstitial || 'ca-app-pub-3940256099942544/4411468910';   // Googles test-id tills Carls finns
  function avbrytAnnonser() { laddad = false; }
  async function forbered() {
    const A = AD();
    if (!A || !redo || las().ingenreklam) return;
    try { await A.prepareInterstitial({ adId: annonsId(), isTesting: CFG.admob?.test !== false }); laddad = true; } catch { laddad = false; setTimeout(forbered, 60_000); }
  }
  async function startaAnnonser() {
    const A = AD();
    if (!A || las().ingenreklam) return;
    try {
      // 1) Googles samtycke (EU/EES/UK) 2) Apples spårningsfråga 3) AdMob
      const info = await A.requestConsentInfo().catch(() => null);
      if (info && info.status === 'REQUIRED' && info.isConsentFormAvailable) await A.showConsentForm().catch(() => {});
      const t = await A.trackingAuthorizationStatus().catch(() => null);
      if (t?.status === 'notDetermined') await A.requestTrackingAuthorization().catch(() => {});
      await A.initialize({ initializeForTesting: CFG.admob?.test !== false });
      const slut = () => {
        visar = false;
        const s = S()?.solo;
        if (s?.clock && pausFore !== null) s.clock.paused = pausFore;
        pausFore = null;
        forbered();
      };
      A.addListener('interstitialAdDismissed', slut);
      A.addListener('interstitialAdFailedToShow', slut);
      redo = true;
      forbered();
    } catch { /* ingen reklam den här gången */ }
  }
  async function efterHandelse() {
    const A = AD();
    const s = solo();
    const nu = Date.now();
    if (!A || !s || !laddad || visar || las().ingenreklam) return;
    if (nu - start < ANNONS_FORST || nu - senast < ANNONS_MELLAN) return;
    visar = true; laddad = false; senast = nu;
    pausFore = !!s.clock?.paused;
    if (s.clock) s.clock.paused = true;            // världen står still medan annonsen visas
    try { await A.showInterstitial(); } catch { visar = false; if (s.clock) s.clock.paused = pausFore; pausFore = null; forbered(); }
  }

  // ---------- koppla in i webbspelet ----------
  function koppla() {
    if (!$('#menu') || !$('#eventovl')) return setTimeout(koppla, 200);
    byggButik();
    // knappen BUTIK i menyn (efter SPELA MED KOMPISAR) och i verktygsraden (bredvid 3D)
    const mb = document.createElement('button');
    mb.className = 'btn';
    mb.id = 'btnShop';
    mb.innerHTML = '&#128722; BUTIK';
    mb.addEventListener('click', oppnaButik);
    $('#btnJoin')?.after(mb);
    const tb = document.createElement('button');
    tb.className = 'tbtn';
    tb.id = 'tgShop';
    tb.innerHTML = '&#128722;';
    tb.title = 'BUTIK';
    tb.addEventListener('click', oppnaButik);
    $('#tg3d')?.before(tb);
    // reklam när en händelse stängs
    const ev = $('#eventovl');
    let oppen = ev.classList.contains('show');
    new MutationObserver(() => {
      const nu = ev.classList.contains('show');
      if (oppen && !nu) setTimeout(efterHandelse, 400);
      oppen = nu;
    }).observe(ev, { attributes: true, attributeFilter: ['class'] });
    // köp som väntar på ett solospel
    setInterval(vantandeIn, 3000);
    // Apple: köp som godkänns senare + tyst återställning, sedan reklamen
    const P = plug('NativePurchases');
    try { P?.addListener?.('transactionUpdated', (tx) => { const r = bokfor(tx); if (r) meddela(tack(r)); }); } catch { /* äldre */ }
    setTimeout(() => { aterstall(true).finally(() => setTimeout(startaAnnonser, 1500)); }, 3000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', koppla); else koppla();
})();
