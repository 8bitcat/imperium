// IMPERIUM V5.18 — SPARADE SPEL (Henrys önskemål): varje parti har en egen sparplats
// som aldrig försvinner av sig själv. Förr fanns en enda plats i localStorage som
// glömdes efter ett dygn och skrevs över av nästa parti.
//
// Partierna ligger i IndexedDB (stort utrymme, ingen tidsgräns): `meta` = listan som
// menyn visar (liten), `data` = själva partiet som JSON-text. Går IndexedDB inte att
// öppna (gammal webbläsare, vissa privata lägen) används localStorage i stället.
// Webbläsaren ombeds också att aldrig rensa sidans lagring (`persist`).
const DB_NAME = 'imperium-saves';
const LS_META = 'imperium.saves.meta';
const LS_DATA = 'imperium.save.';

let dbP = null;
function db() {
  if (dbP) return dbP;
  dbP = new Promise((resolve) => {
    try {
      const rq = indexedDB.open(DB_NAME, 1);
      rq.onupgradeneeded = () => {
        const d = rq.result;
        if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta', { keyPath: 'id' });
        if (!d.objectStoreNames.contains('data')) d.createObjectStore('data');
      };
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => resolve(null);
      rq.onblocked = () => resolve(null);
    } catch (e) { resolve(null); }
  });
  return dbP;
}

// en transaktion som ett löfte: fn(stores) gör jobbet, resultatet är det fn returnerar
function tx(mode, fn) {
  return db().then((d) => new Promise((resolve, reject) => {
    if (!d) { reject(new Error('no-idb')); return; }
    let out;
    try {
      const t = d.transaction(['meta', 'data'], mode);
      out = fn(t.objectStore('meta'), t.objectStore('data'));
      t.oncomplete = () => resolve(out && 'result' in out ? out.result : out);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error || new Error('abort'));
    } catch (e) { reject(e); }
  }));
}

// ---------- localStorage som reserv ----------
const lsMeta = () => { try { return JSON.parse(localStorage.getItem(LS_META) || '[]'); } catch (e) { return []; } };
const lsSetMeta = (list) => localStorage.setItem(LS_META, JSON.stringify(list));
const lsWrite = (meta, json) => {
  localStorage.setItem(LS_DATA + meta.id, json);
  lsSetMeta([meta, ...lsMeta().filter((m) => m.id !== meta.id)]);
};

export const newSaveId = () => 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// spara ett parti (meta = det menyn visar, json = partiet som text)
export async function writeSave(meta, json) {
  const m = { ...meta, size: json.length };
  try {
    await tx('readwrite', (M, D) => { M.put(m); D.put(json, m.id); });
    return true;
  } catch (e) {
    try { lsWrite(m, json); return true; } catch (e2) { return false; }
  }
}

// alla partier, senast spelade först
export async function listSaves() {
  let list = [];
  try { list = (await tx('readonly', (M) => M.getAll())) || []; } catch (e) { list = []; }
  const seen = new Set(list.map((m) => m.id));
  for (const m of lsMeta()) if (!seen.has(m.id)) list.push({ ...m, ls: true });
  return list.sort((a, b) => (b.at || 0) - (a.at || 0));
}

export async function readSave(id) {
  let json = null, meta = null;
  try {
    [meta, json] = await tx('readonly', (M, D) => {
      const a = M.get(id), b = D.get(id);
      return { get result() { return [a.result, b.result]; } };
    });
  } catch (e) { /* prova localStorage */ }
  if (json == null) {
    json = localStorage.getItem(LS_DATA + id);
    meta = lsMeta().find((m) => m.id === id) || null;
  }
  if (json == null) return null;
  try { return { meta, data: JSON.parse(json) }; } catch (e) { return null; }
}

export async function deleteSave(id) {
  try { await tx('readwrite', (M, D) => { M.delete(id); D.delete(id); }); } catch (e) { /* bara localStorage */ }
  try { localStorage.removeItem(LS_DATA + id); lsSetMeta(lsMeta().filter((m) => m.id !== id)); } catch (e) { /* tomt */ }
}

export async function renameSave(id, name) {
  const r = await readSave(id);
  if (!r?.meta) return false;
  return writeSave({ ...r.meta, name, custom: true }, JSON.stringify(r.data));
}

// en kopia med eget id — originalet står kvar som det var
export async function copySave(id, name) {
  const r = await readSave(id);
  if (!r) return null;
  const meta = { ...(r.meta || {}), id: newSaveId(), name: name || (r.meta?.name || 'PARTI') + ' (KOPIA)', custom: true,
    copy: true, created: Date.now(), at: Date.now() };
  return (await writeSave(meta, JSON.stringify(r.data))) ? meta : null;
}

// ---------- ladda ner / ladda upp en sparfil ----------
export async function exportSave(id) {
  const r = await readSave(id);
  if (!r) return null;
  return new Blob([JSON.stringify({ imperiumSave: 1, meta: r.meta, data: r.data })], { type: 'application/json' });
}

export async function importSave(text) {
  let f;
  try { f = JSON.parse(text); } catch (e) { return { err: 'FILEN ÄR INTE EN SPARFIL' }; }
  const data = f?.imperiumSave ? f.data : f;   // en ren speldump går också bra
  if (!data || (data.mode !== 'solo' && data.mode !== 'tv') || (data.mode === 'solo' && !data.solo?.nation)) {
    return { err: 'FILEN ÄR INTE ETT IMPERIUM-PARTI' };
  }
  const meta = { ...(f.meta || {}), id: newSaveId(), at: Date.now(), imported: true, mode: data.mode };
  meta.name ||= data.mode === 'tv' ? `TV-RUM ${data.code || ''}` : 'UPPLADDAT PARTI';
  meta.day ??= data.day || 1;
  return (await writeSave(meta, JSON.stringify(data))) ? { meta } : { err: 'KUNDE INTE SPARA — LAGRINGEN ÄR FULL' };
}

// ---------- lagringen ----------
// be webbläsaren att aldrig rensa sidans lagring på egen hand
export async function persist() {
  try {
    if (await navigator.storage?.persisted?.()) return true;
    return !!(await navigator.storage?.persist?.());
  } catch (e) { return false; }
}
export async function storageInfo() {
  try {
    const [est, kept] = await Promise.all([navigator.storage?.estimate?.(), navigator.storage?.persisted?.()]);
    return { used: est?.usage ?? null, quota: est?.quota ?? null, kept: !!kept };
  } catch (e) { return { used: null, quota: null, kept: false }; }
}
