# -*- coding: utf-8 -*-
"""Un marco por tipo de carta, recoloreando solo la franja de las espinas.

El marco base es imagen de paleta de 254 colores, asi que recolorear es
remapear entradas: ni un pixel se toca y la transparencia de la ventana
sobrevive intacta.

La primera version solo movia el TONO y salieron trece pares indistinguibles:
la franja de espinas es oscura y estrecha de luminosidad, asi que once tonos
repartidos por la rueda acaban todos en el mismo barro. Aqui se usan las tres
palancas —tono, saturacion y luminosidad— y al final se mide la distancia
entre todos los pares para que no vuelva a colarse una colision.
"""
import colorsys
import itertools
import os
import sys

from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')
ORIG = r'D:\proyectoLore\proyectoLore\public\taller\images\marco.png'
DEST = r'D:\proyectoLore\proyectoLore\public\taller\images\marcos'
SC = r'C:\Users\ivmab\AppData\Local\Temp\claude\C--Users-ivmab-Documents-Taponazo260726\b7378842-7cda-47b2-9a07-beab87489c2d\scratchpad'

# tono en grados · saturacion objetivo · factor de luminosidad
#
# Los tonos los fijo yo porque significan algo (la trampa es roja, el muro es
# piedra). La saturacion y la luz salen de una busqueda que maximiza la
# distancia minima entre los once, acotada a la paleta embarrada del juego:
# sin ese techo el optimizador saca verdes lima que separan de maravilla y no
# son este juego. Minima resultante: 36 sobre 255.
PALETA = {
    # tono · saturacion · luz · brillo
    'comun':      (95,  0.50, 0.88, 0.0),   # verde, mas oscuro: la humilde no compite con el oro
    'elite':      (45,  0.70, 1.25, 0.55),  # ORO con luz
    'legendaria': (48,  0.80, 1.45, 1.00),  # ORO RADIANTE: el escalon de arriba
    'spell':      (285, 0.52, 1.10, 0.0),   # morado
    'trap':       (2,   0.60, 0.85, 0.0),   # rojo sangre, oscuro
    'wall':       (35,  0.05, 1.20, 0.0),   # PIEDRA: gris neutro
    'weapon':     (212, 0.55, 0.70, 0.0),   # acero, azul oscuro
    'hero':       (18,  0.50, 1.30, 0.0),   # teja
    'heraldo':    (30,  0.10, 0.75, 0.0),   # carbon
    'pacto':      (162, 0.55, 1.00, 0.0),   # verde azulado
    'evento':     (330, 0.55, 1.15, 0.0),   # vino
}

im = Image.open(ORIG)
pal = list(im.getpalette())

# Entradas de la paleta que son el rojo de las espinas. Fuera la tinta (poca
# saturacion) y lo casi negro, que deben quedarse como estan.
sel = [i for i in range(254)
       for (h, s, v) in [colorsys.rgb_to_hsv(*[c / 255 for c in pal[i * 3:i * 3 + 3]])]
       if (h * 360 < 20 or h * 360 >= 340) and s >= 0.25 and v >= 0.12]


def recolorear(tono, sat, luz, brillo=0.0):
    """brillo levanta SOLO los realces y les quita color, que es como se ve
    la luz sobre el metal: la sombra sigue siendo oro y el brillo tira a
    blanco. Subir el valor entero, en cambio, solo hace el oro mas palido."""
    nuevo = pal[:]
    vmax = max(colorsys.rgb_to_hsv(*[c / 255 for c in pal[i * 3:i * 3 + 3]])[2] for i in sel)
    for i in sel:
        _, s, v = colorsys.rgb_to_hsv(*[c / 255 for c in pal[i * 3:i * 3 + 3]])
        # La saturacion sale de la pedida, modulada por la del pixel para no
        # aplanar la variacion del dibujo. El valor se escala: es lo que
        # conserva el sombreado y a la vez separa familias de color.
        s2 = min(1.0, sat * (0.55 + 0.6 * s))
        v2 = max(0.0, min(1.0, v * luz))
        if brillo > 0:
            # Cuanto mas claro era el pixel, mas le pega la luz.
            k = (v / vmax) ** 2.2 * brillo
            v2 = min(1.0, v2 + k * (1.0 - v2) * 0.95)
            s2 = s2 * (1.0 - 0.75 * k)
        nr, ng, nb = colorsys.hsv_to_rgb(tono / 360, s2, v2)
        nuevo[i * 3:i * 3 + 3] = [int(round(x * 255)) for x in (nr, ng, nb)]
    c = im.copy()
    c.putpalette(nuevo)
    c.info['transparency'] = im.info.get('transparency', 255)
    return c


os.makedirs(DEST, exist_ok=True)
medias = {}

for clave, (tono, sat, luz, brillo) in PALETA.items():
    img = recolorear(tono, sat, luz, brillo)
    img.save(os.path.join(DEST, f'marco-{clave}.png'), optimize=True)

    # Media del fondo de las espinas. Solo cuentan los pixeles que pertenecen
    # a esa franja: medir el rectangulo entero mete madera y tinta, que son
    # iguales en los once y diluyen las diferencias hasta esconderlas.
    idx = img.convert('P').load()
    rgb = img.convert('RGB')
    r = g = b = n = 0
    for y in range(400, 1200, 8):
        for x in range(40, 95, 2):
            if idx[x, y] in sel:
                p = rgb.getpixel((x, y))
                r += p[0]; g += p[1]; b += p[2]; n += 1
    medias[clave] = (r // n, g // n, b // n)

print('COLOR MEDIO DE LA FRANJA')
for clave, (r, g, b) in medias.items():
    print(f'  {clave:11} rgb({r:3},{g:3},{b:3})')

print('\nPARES MAS PARECIDOS')
pares = sorted(
    ((sum((medias[a][i] - medias[b][i]) ** 2 for i in range(3)) ** .5, a, b)
     for a, b in itertools.combinations(medias, 2)),
    key=lambda x: x[0])
for d, a, b in pares[:6]:
    aviso = '  <-- SE CONFUNDEN' if d < 40 else ''
    print(f'  {a:11} / {b:11}  distancia {d:5.0f}{aviso}')
print(f'\nminima: {pares[0][0]:.0f}  (objetivo: 40 o mas)')

# Hoja de contactos
w, et, cols = 186, 22, 6
h = int(w * 1531 / 1027)
filas = (len(PALETA) + cols - 1) // cols
hoja = Image.new('RGB', (cols * w, filas * (h + et)), (22, 20, 18))
d = ImageDraw.Draw(hoja)
for n, clave in enumerate(PALETA):
    x, y = (n % cols) * w, (n // cols) * (h + et)
    hoja.paste(Image.open(os.path.join(DEST, f'marco-{clave}.png')).convert('RGB').resize((w, h), Image.LANCZOS), (x, y))
    d.text((x + 6, y + h + 5), clave, fill=(235, 225, 200))
hoja.save(os.path.join(SC, 'marcos-por-tipo.png'))
