"""Appikonen och startbilden ur 3D-planeten (app/ikon/glob3d.png = webbspelets WebGL-klot, 1024x1024, utan etiketter).
    python app/tools/ikon.py
Skriver ios/App/App/Assets.xcassets: AppIcon-512@2x.png (1024x1024 RGB utan alfa, Apple nekar alfa) och de tre
startbilderna 2732x2732 (spelets mörka botten och klotet i mitten, där telefonen visar bilden i båda lägena)."""
import os
from PIL import Image
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XC = os.path.join(APP, 'ios', 'App', 'App', 'Assets.xcassets')
glob = Image.open(os.path.join(APP, 'ikon', 'glob3d.png')).convert('RGB')
glob.resize((1024, 1024), Image.LANCZOS).save(os.path.join(XC, 'AppIcon.appiconset', 'AppIcon-512@2x.png'), optimize=True)
S = 2732
start = Image.new('RGB', (S, S), (5, 8, 12))
g = glob.resize((900, 900), Image.LANCZOS)
start.paste(g, ((S - 900) // 2, (S - 900) // 2))
for n in ('splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'):
    start.save(os.path.join(XC, 'Splash.imageset', n), optimize=True)
print('ikon + startbild klara')
