"""IMPERIUM-appen: egna krigsbilder i stället för webbspelets lånade sprites.

Webbspelets bilder i v4/assets/sprites (BerkleyToreno & Umrex, CC BY-NC-SA 3.0) får inte användas i en app som
säljer något, eftersom licensen förbjuder kommersiellt bruk. Appen får i stället Carls egna Blender-modeller ur
Unreal-projektet, renderade av ImperiumUE/tools/render_units.py (Saved/UnitRenders/<faktion>_<typ>.png, 900x700).

Varje bild får samma namn och ungefär samma storlek som webbens, eftersom striden ritar spriten i sin egen storlek
(battleA.js: ws.width * 1.15). Bilderna pekar åt vänster som webbens. Facing 1 speglas av spelet.

    python app/tools/sprites.py            # skriver app/vendor/sprites/*.png
    python app/tools/sprites.py --spegla   # om renderingarna någon gång pekar åt höger
"""
import os, sys
from PIL import Image, ImageOps

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(APP)
UE = os.path.join(os.path.dirname(ROOT), 'ImperiumUE', 'Saved', 'UnitRenders')
WEB = os.path.join(ROOT, 'v4', 'assets', 'sprites')
OUT = os.path.join(APP, 'vendor', 'sprites')

# webbens fil -> renderingen som ersätter den (+ blå ton för fiendens förtonade tank)
KARTA = {
    'apc-wheeled.png': ('jarngardet_inf', None),
    'tank-tan.png': ('jarngardet_tank', None),
    'tank-blue.png': ('jarngardet_tank', (79, 168, 255)),
    'heli-gray.png': ('reserv_jaktplan', None),
    'jarngardet-tank.png': ('jarngardet_tank', None),
    'vintergardet-inf.png': ('vintergardet_inf', None),
    'vintergardet-tank.png': ('vintergardet_tank', None),
    'askgardet-inf.png': ('askgardet_inf', None),
    'askgardet-tank.png': ('askgardet_tank', None),
    'stjarnsamvaldet-inf.png': ('stjarnsamvaldet_inf', None),
    'stjarnsamvaldet-tank.png': ('stjarnsamvaldet_tank', None),
    'stjarnsamvaldet-flyg.png': ('stjarnsamvaldet_flyg', None),
}


def tona(img, rgb, styrka=0.45):
    r, g, b, a = img.split()
    farg = Image.new('RGB', img.size, rgb)
    blandad = Image.blend(img.convert('RGB'), farg, styrka)
    blandad.putalpha(a)
    return blandad


def main():
    spegla = '--spegla' in sys.argv   # Blender-renderingarna pekar redan åt vänster
    os.makedirs(OUT, exist_ok=True)
    saknas = [k for k, (src, _) in KARTA.items() if not os.path.exists(os.path.join(UE, src + '.png'))]
    if saknas:
        sys.exit('saknar renderingar i %s för: %s (kör ImperiumUE/tools/render_units.py)' % (UE, ', '.join(saknas)))
    for namn, (src, ton) in KARTA.items():
        img = Image.open(os.path.join(UE, src + '.png')).convert('RGBA')
        # beskär till det som syns (alfa > 8, så att den mjuka skuggans yttersta kant inte räknas)
        mask = img.split()[3].point(lambda v: 255 if v > 8 else 0)
        img = img.crop(mask.getbbox())
        if spegla:
            img = ImageOps.mirror(img)
        ow, oh = Image.open(os.path.join(WEB, namn)).size
        # samma bredd som webbens bild (striden ritar i naturlig storlek), höjden följer modellen men högst 1,4x
        sk = min(ow / img.width, (oh * 1.4) / img.height)
        img = img.resize((max(1, round(img.width * sk)), max(1, round(img.height * sk))), Image.LANCZOS)
        if ton:
            img = tona(img, ton)
        img.save(os.path.join(OUT, namn), optimize=True)
        print('%-26s <- %-22s %dx%d' % (namn, src, img.width, img.height))


if __name__ == '__main__':
    main()
