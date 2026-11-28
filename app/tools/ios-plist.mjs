// Lägger in det appen behöver i ios/App/App/Info.plist efter `npx cap sync ios`. Kan köras hur många gånger som
// helst (byter värdet om nyckeln redan finns). Värdena kommer ur app/package.json "imperium".
//   GADApplicationIdentifier       AdMob-appens id (Googles test-id tills Carls AdMob-konto finns)
//   NSUserTrackingUsageDescription texten i Apples spårningsfråga (ATT), krävs av AdMob
//   SKAdNetworkItems               Googles SKAdNetwork-id (cstr6suwn9). Googles fulla lista kan läggas till här.
//   ITSAppUsesNonExemptEncryption  false = ingen exportfråga i TestFlight (appen använder bara Apples HTTPS)
//   node tools/ios-plist.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLIST = path.join(APP, 'ios', 'App', 'App', 'Info.plist');
const CFG = JSON.parse(fs.readFileSync(path.join(APP, 'package.json'), 'utf8')).imperium;
if (!fs.existsSync(PLIST)) throw new Error('ios/App/App/Info.plist saknas – kör npx cap add ios --packagemanager SPM först');
let t = fs.readFileSync(PLIST, 'utf8').replace(/\r\n/g, '\n');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const satt = (nyckel, varde) => {
  const re = new RegExp(`\\n\\t<key>${nyckel}</key>\\n\\t(<string>[^<]*</string>|<true/>|<false/>|<array>[\\s\\S]*?\\n\\t</array>)`);
  const rad = `\n\t<key>${nyckel}</key>\n\t${varde}`;
  t = re.test(t) ? t.replace(re, rad) : t.replace(/\n<\/dict>\n<\/plist>/, `${rad}\n</dict>\n</plist>`);
};
satt('GADApplicationIdentifier', `<string>${esc(CFG.admob.appId)}</string>`);
satt('NSUserTrackingUsageDescription', '<string>Används bara för att visa annonser som passar dig bättre. Spelet fungerar lika bra om du säger nej.</string>');
satt('SKAdNetworkItems', '<array>\n\t\t<dict>\n\t\t\t<key>SKAdNetworkIdentifier</key>\n\t\t\t<string>cstr6suwn9.skadnetwork</string>\n\t\t</dict>\n\t</array>');
satt('ITSAppUsesNonExemptEncryption', '<false/>');
fs.writeFileSync(PLIST, t);
console.log('Info.plist: AdMob', CFG.admob.appId, CFG.admob.test === false ? '(skarp)' : '(test)');
