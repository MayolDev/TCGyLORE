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
import random
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
    # tono · saturacion · luz · destellos
    # Las tres criaturas comparten tono: son la misma familia y asi se leen.
    # Lo que sube con la rareza es la LUZ y los DESTELLOS, no el color.
    'comun':      (36,  0.58, 0.98, 0),    # ocre anaranjado, sin adornos
    'elite':      (45,  0.70, 1.18, 26),   # oro con destellos
    'legendaria': (48,  0.80, 1.45, 60),   # oro radiante, el doble de destellos
    'spell':      (285, 0.52, 1.10, 0),    # morado
    'trap':       (357, 0.68, 0.70, 0),    # rojo sangre, mas oscuro que el ocre
    'wall':       (35,  0.05, 1.20, 0),    # PIEDRA: gris neutro
    'weapon':     (212, 0.55, 0.70, 0),    # acero, azul oscuro
    'hero':       (18,  0.50, 1.30, 0),    # teja
    'heraldo':    (30,  0.08, 0.45, 0),    # carbon casi negro: se separa del ocre por la luz, no por el tono
    'pacto':      (162, 0.55, 1.00, 0),    # verde azulado
    'evento':     (330, 0.55, 1.15, 0),    # vino
}

im = Image.open(ORIG)
pal = list(im.getpalette())

# Entradas de la paleta que son el rojo de las espinas. Fuera la tinta (poca
# saturacion) y lo casi negro, que deben quedarse como estan.
sel = [i for i in range(254)
       for (h, s, v) in [colorsys.rgb_to_hsv(*[c / 255 for c in pal[i * 3:i * 3 + 3]])]
       if (h * 360 < 20 or h * 360 >= 340) and s >= 0.25 and v >= 0.12]


def recolorear(tono, sat, luz):
    nuevo = pal[:]
    for i in sel:
        _, s, v = colorsys.rgb_to_hsv(*[c / 255 for c in pal[i * 3:i * 3 + 3]])
        # La saturacion sale de la pedida, modulada por la del pixel para no
        # aplanar la variacion del dibujo. El valor se escala: es lo que
        # conserva el sombreado y a la vez separa familias de color.
        s2 = min(1.0, sat * (0.55 + 0.6 * s))
        v2 = max(0.0, min(1.0, v * luz))
        nr, ng, nb = colorsys.hsv_to_rgb(tono / 360, s2, v2)
        nuevo[i * 3:i * 3 + 3] = [int(round(x * 255)) for x in (nr, ng, nb)]
    c = im.copy()
    c.putpalette(nuevo)
    c.info['transparency'] = im.info.get('transparency', 255)
    return c


def sembrar_destellos(img, cuantos, semilla=7):
    """Chispas de gema sobre la franja de espinas: nucleo claro y cuatro
    brazos que se apagan.

    Van GRANDES a proposito. El marco mide 1027 de ancho y se pinta a 750,
    asi que todo se reduce a 0,73: las chispas finas de uno o dos pixeles se
    deshacian al reducir y en la carta no se veia nada. Mejor pocas y
    gordas, que se lean como gemas, que muchas y finas, que se leen como
    ruido y encima desaparecen.

    Solo se siembran sobre pixeles de la propia franja, asi la madera, el
    pergamino y la ventana transparente quedan intactos.
    """
    if not cuantos:
        return img.convert('RGBA')

    idx = img.convert('P').load()
    out = img.convert('RGBA')
    px = out.load()
    W, H = out.size
    rnd = random.Random(semilla)

    def mezclar(cx, cy, fuerza):
        if not (0 <= cx < W and 0 <= cy < H):
            return
        r, g, b, a = px[cx, cy]
        if a == 0:
            return
        f = max(0.0, min(1.0, fuerza))
        # Hacia blanco calido, no blanco puro: es una gema sobre oro.
        px[cx, cy] = (int(r + (255 - r) * f),
                      int(g + (253 - g) * f),
                      int(b + (235 - b) * f), a)

    puestos = intentos = 0
    while puestos < cuantos and intentos < cuantos * 500:
        intentos += 1
        x = rnd.randrange(14, W - 14)
        y = rnd.randrange(14, H - 14)
        if idx[x, y] not in sel:
            continue

        grande = rnd.random() < 0.30
        brazo = rnd.randint(9, 14) if grande else rnd.randint(5, 8)
        nucleo = 2 if grande else 1

        # Nucleo: un cuadradito lleno, que es lo que sobrevive a la reduccion.
        for dx in range(-nucleo, nucleo + 1):
            for dy in range(-nucleo, nucleo + 1):
                mezclar(x + dx, y + dy, 1.0 if abs(dx) + abs(dy) <= nucleo else 0.7)

        # Brazos en cruz, apagandose hacia la punta.
        for d in range(nucleo + 1, brazo + 1):
            f = (1 - (d - nucleo) / (brazo - nucleo + 1)) ** 1.5
            mezclar(x + d, y, f); mezclar(x - d, y, f)
            mezclar(x, y + d, f); mezclar(x, y - d, f)
            # Un pixel de grosor a los lados del brazo para que no se pierda.
            if d <= brazo * 0.45:
                mezclar(x + d, y + 1, f * .5); mezclar(x + d, y - 1, f * .5)
                mezclar(x - d, y + 1, f * .5); mezclar(x - d, y - 1, f * .5)
                mezclar(x + 1, y + d, f * .5); mezclar(x - 1, y + d, f * .5)
                mezclar(x + 1, y - d, f * .5); mezclar(x - 1, y - d, f * .5)

        if grande:
            for d in range(1, 5):
                f = 0.35 * (1 - d / 5)
                mezclar(x + d, y + d, f); mezclar(x - d, y - d, f)
                mezclar(x + d, y - d, f); mezclar(x - d, y + d, f)
        puestos += 1
    return out


os.makedirs(DEST, exist_ok=True)
medias = {}

for clave, (tono, sat, luz, destellos) in PALETA.items():
    img = recolorear(tono, sat, luz)
    base_paleta = img          # se mide ANTES: en RGBA los indices ya no valen
    if destellos:
        # Con destellos hay que salir de la paleta: las chispas son colores
        # que no existen en ella. Se guarda en RGBA y punto — requantizar
        # reconstruye la paleta entera y desviaba el color de TODO el marco
        # (la trampa salia marron en vez de roja).
        img = sembrar_destellos(img, destellos)
    img.save(os.path.join(DEST, f'marco-{clave}.png'), optimize=True)

    # Media del fondo de las espinas. Solo cuentan los pixeles que pertenecen
    # a esa franja: medir el rectangulo entero mete madera y tinta, que son
    # iguales en los once y diluyen las diferencias hasta esconderlas.
    idx = base_paleta.convert('P').load()
    rgb = base_paleta.convert('RGB')
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
