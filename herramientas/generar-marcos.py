# -*- coding: utf-8 -*-
"""Un marco por tipo de carta, recoloreando solo la franja de las espinas."""
import colorsys, os, sys
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')
ORIG = r'D:\proyectoLore\proyectoLore\public\taller\images\marco.png'
DEST = r'D:\proyectoLore\proyectoLore\public\taller\images\marcos'
SC = r'C:\Users\ivmab\AppData\Local\Temp\claude\C--Users-ivmab-Documents-Taponazo260726\b7378842-7cda-47b2-9a07-beab87489c2d\scratchpad'

# Mismo color de acento que ya usa la etiqueta del tipo en app.js.
ACENTOS = {
    'comun':      '#6b7355',
    'elite':      '#3f6072',
    'legendaria': '#b8862f',
    'spell':      '#6b4a7a',
    'trap':       '#8f2f24',
    'wall':       '#6a6355',
    'weapon':     '#4a5866',
    'hero':       '#a8452f',
    'heraldo':    '#3a3228',
    'pacto':      '#2f6b5a',
    # El Evento Global: vino oscuro, el unico tono que quedaba libre y que no
    # se confunde con el rojo de trampa ni con el teja del protagonista.
    'evento':     '#6b2f5a',
}

im = Image.open(ORIG)
pal = list(im.getpalette())

# Entradas de la paleta que son el rojo de las espinas. Fuera la tinta (poca
# saturacion) y lo casi negro, que deben quedarse como estan.
sel = [i for i in range(254)
       for (h, s, v) in [colorsys.rgb_to_hsv(*[c / 255 for c in pal[i * 3:i * 3 + 3]])]
       if (h * 360 < 20 or h * 360 >= 340) and s >= 0.25 and v >= 0.12]


# Dos acentos son casi grises y, con su propio tono, el marco salia igual que
# la madera y no se distinguia. Se les fuerza un tono frio: siguen leyendose
# como "gris" pero ya no se confunden con el ocre del marco.
TONO_FORZADO = {'wall': (212 / 360, 0.30), 'legendaria': (40 / 360, 0.95)}


def recolorear(hexcolor, clave=None):
    r, g, b = [int(hexcolor[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    hh, ss, _ = colorsys.rgb_to_hsv(r, g, b)
    if clave in TONO_FORZADO:
        hh, ss = TONO_FORZADO[clave]
    nuevo = pal[:]
    for i in sel:
        _, s, v = colorsys.rgb_to_hsv(*[c / 255 for c in pal[i * 3:i * 3 + 3]])
        # Tono del acento; la saturacion mezcla la del acento con la del pixel
        # para no aplanar la variacion del dibujo; el valor no se toca, que es
        # lo que lleva el sombreado y la textura.
        sat = min(1.0, ss * 0.55 + s * 0.75)
        nr, ng, nb = colorsys.hsv_to_rgb(hh, sat, v)
        nuevo[i * 3:i * 3 + 3] = [int(round(x * 255)) for x in (nr, ng, nb)]
    c = im.copy()
    c.putpalette(nuevo)
    c.info['transparency'] = im.info.get('transparency', 255)
    return c


os.makedirs(DEST, exist_ok=True)
hechos = []
for clave, hexc in ACENTOS.items():
    out = os.path.join(DEST, f'marco-{clave}.png')
    img = recolorear(hexc, clave)
    img.save(out, optimize=True)
    hechos.append((clave, hexc, os.path.getsize(out)))

for clave, hexc, size in hechos:
    print(f'  marco-{clave}.png  {hexc}  {size/1024:.0f} KB')
print(f'total: {sum(s for _,_,s in hechos)/1048576:.2f} MB en {len(hechos)} marcos')

# Hoja de contactos para revisarlos de un vistazo
w = 205
h = int(w * 1531 / 1027)
et = 24
cols = 5
filas = 2
hoja = Image.new('RGB', (cols * w, filas * (h + et)), (22, 20, 18))
d = ImageDraw.Draw(hoja)
for n, (clave, hexc, _) in enumerate(hechos):
    x, y = (n % cols) * w, (n // cols) * (h + et)
    hoja.paste(Image.open(os.path.join(DEST, f'marco-{clave}.png')).convert('RGB').resize((w, h), Image.LANCZOS), (x, y))
    d.text((x + 6, y + h + 6), f'{clave}  {hexc}', fill=(235, 225, 200))
hoja.save(os.path.join(SC, 'marcos-por-tipo.png'))
print('hoja de contactos lista')
