from pathlib import Path
import base64, re
root=Path(__file__).resolve().parents[1]
template=(root/'src/index.html').read_text()
js=(root/'src/game.js').read_text()
assets={
 '__SPRITE_URL__':root/'original/dexter_sprites.png',
 '__LOGO_URL__':root/'assets/logo_transparent.png',
 '__PORTRAIT_URL__':root/'assets/portrait_runtime_indexed.png',
 '__PARK_URL__':root/'assets/classic_park.png'
}
for key,path in assets.items():
 val='data:image/png;base64,'+base64.b64encode(path.read_bytes()).decode('ascii')
 js=js.replace(key,val)
classic=(root/'original/Dexter_Classic_Investigation.html').read_text()
assert '</template>' not in classic.lower()
out=template.replace('/*__GAME_JS__*/',js).replace('/*__CLASSIC_HTML__*/',classic)
assert not re.search(r'__([A-Z_]+)__',out), 'unresolved placeholder'
path=root/'Dexter_The_Long_Way_Home.html'
path.write_text(out)
print('WROTE',path,'bytes',path.stat().st_size)
