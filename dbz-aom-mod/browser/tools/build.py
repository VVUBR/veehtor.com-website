import glob, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(root, 'src')
js_files = sorted(f for f in glob.glob(os.path.join(src, '*.js')))
shell = open(os.path.join(src, '00-shell.html')).read()
js = '\n'.join(open(f).read() for f in js_files)
html = shell + "\n<script>\n(() => {\n'use strict';\n" + js + "\n})();\n</script>\n"
os.makedirs(os.path.join(root, 'dist'), exist_ok=True)
open(os.path.join(root, 'dist', 'dragon-ball-hunt.html'), 'w').write(html)
# standalone page (doctype, head) for opening the file directly in a browser
page = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + html + '\n</html>\n')
open(os.path.join(root, 'dragon-ball-hunt.html'), 'w').write(page)
# headless bundle for node: simulation modules only (01-08) plus stubs
sim = [f for f in js_files if os.path.basename(f)[:2] in ('01','02','03','04','05','06','07','08')]
stubs = """
function fxPush(f){ if (G.fx.length < 400) G.fx.push(f); }
function floatText(){} function toast(){} function announce(){} function alertAttack(){} function openWish(){} function showEnd(){}
"""
node = "'use strict';\n" + '\n'.join(open(f).read() for f in sim) + stubs + "\nmodule.exports = { G, startSkirmish, tick, STEP, U, B, TECH, POW, PATRONS, FACTIONS, ballsHeld, maxHp, stats, castPower, MAPS };\n"
open(os.path.join(root, 'dist', 'sim.cjs'), 'w').write(node)
print('built', len(html), 'bytes;', len(js_files), 'js files')
