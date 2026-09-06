/* TAPONAZO · Taller de Cartas
   Todo el dibujo va contra un contexto `g` que se pasa por parámetro y que ya viene
   escalado. Por eso la exportación es nítida de verdad: no se estira un PNG de 750×1050,
   se vuelve a pintar la carta entera a la resolución pedida. */
(() => {
  'use strict';

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // ---------------------------------------------------------------- geometría
  const W = 750, H = 1050;          // carta · ratio 2,5" × 3,5"
  const TW = 600;                   // ficha (cuadrada)

  // ---------------------------------------------------------------- paleta
  // Darkest Dungeon + Griftlands: negro de tinta, hueso sucio, ocre y sangre.
  const C = {
    ink:    '#0c0a08',
    ink2:   '#16120d',
    bone:   '#e7ddc4',
    boneD:  '#b7a985',
    parch:  '#d8c9a6',
    gold:   '#b8862f',
    blood:  '#8f2f24',
  };

  const ACCENT = {
    comun:      { c:'#6b7355', label:'CRIATURA · COMÚN' },
    elite:      { c:'#3f6072', label:'CRIATURA · ÉLITE' },
    legendaria: { c:'#b8862f', label:'CRIATURA · LEGENDARIA' },
  };
  const TYPES = {
    creature: null,                                     // usa la rareza
    spell:    { c:'#6b4a7a', label:'HECHIZO' },
    trap:     { c:'#8f2f24', label:'TRAMPA · BOCA ABAJO' },
    wall:     { c:'#6a6355', label:'MURO' },
    weapon:   { c:'#4a5866', label:'ARMA · EQUIPO' },
    hero:     { c:'#a8452f', label:'PROTAGONISTA' },
    heraldo:  { c:'#3a3228', label:'EL HERALDO' },
  };

  // ---------------------------------------------------------------- estado
  const S = {
    mode:  'carta',            // carta · dorso · ficha
    style: 'darkest',          // darkest · grafico · fullbleed · marco
    scale: 2,
    foil: false, foilAmt: .55,
    zoom: 1, ox: 0, oy: 0,
  };

  const cv = $('#card'), ctx = cv.getContext('2d');

  // ---------------------------------------------------------------- registros
  const ART    = new Map();   // slug -> HTMLImageElement (ilustraciones)
  const FRAMES = new Map();   // clave -> HTMLImageElement (marcos y texturas)
  let   artEl  = null;        // ilustración de la carta en edición

  const slug = s => (s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function fileToImage(file){
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = e.target.result; };
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  // ---------------------------------------------------------------- PRNG
  // El grano y las salpicaduras se siembran con el nombre de la carta: así la vista
  // previa y el PNG exportado son idénticos, y la misma carta sale siempre igual.
  function hash(str){ let h = 2166136261; for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // ---------------------------------------------------------------- helpers de dibujo
  function rr(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }

  // Rectángulo con las esquinas cortadas en diagonal (el corte angular de Griftlands).
  function cut(g,x,y,w,h,c){ g.beginPath(); g.moveTo(x+c,y); g.lineTo(x+w-c,y); g.lineTo(x+w,y+c); g.lineTo(x+w,y+h-c); g.lineTo(x+w-c,y+h); g.lineTo(x+c,y+h); g.lineTo(x,y+h-c); g.lineTo(x,y+c); g.closePath(); }

  function wrap(g, text, font, maxw){
    g.font = font;
    const out = [];
    String(text).split('\n').forEach(para => {
      if (!para){ out.push(''); return; }
      const words = para.split(' ');
      let cur = '';
      for (const w of words){
        const t = cur ? cur + ' ' + w : w;
        if (g.measureText(t).width <= maxw) cur = t;
        else { if (cur) out.push(cur); cur = w; }
      }
      out.push(cur);
    });
    return out;
  }

  // `prefix` lleva estilo y peso (italic, 700…). En CSS van ANTES del tamaño: si se
  // cuelan detrás, la cadena es inválida, el canvas la descarta sin avisar y sigue
  // pintando con la fuente anterior.
  /**
   * Cuerpo con marcado ligero, pensado para los protagonistas:
   *   "## ÚNICA — El Lado Positivo"  → título de sección (ÚNICA en verde,
   *   EL FINAL en rojo, el resto en el color del texto), y
   *   "---" en su propia línea      → separador horizontal.
   * Sin marcado pinta texto plano, como siempre. Devuelve la Y final.
   */
  function drawBody(g, texto, bx, bw, ty0, maxh, inkColor, oscuro){
    const bloques = [];
    String(texto || '').split('\n').forEach(linea => {
      const t = linea.trim();
      if (t === '---') bloques.push({ tipo: 'sep' });
      else if (t.startsWith('## ')) bloques.push({ tipo: 'titulo', texto: t.slice(3).trim() });
      else bloques.push({ tipo: 'texto', texto: linea });
    });

    const colorTitulo = t => {
      const u = t.toUpperCase();
      if (u.startsWith('ÚNICA') || u.startsWith('UNICA')) return oscuro ? '#a9bd63' : '#5c6e2a';
      if (u.startsWith('EL FINAL') || u.startsWith('FINAL')) return oscuro ? '#e0705a' : '#8f2f24';
      if (u.startsWith('NIVEL')) return oscuro ? '#d9b34a' : '#8a6b1f';
      return inkColor;
    };

    for (let size = 31; size >= 15; size--){
      const lh = size * 1.34;
      let alto = 0;
      const plan = [];
      for (const b of bloques){
        if (b.tipo === 'sep'){ plan.push({ ...b, h: lh * 0.7 }); alto += lh * 0.7; continue; }
        const font = b.tipo === 'titulo'
          ? `700 ${size}px "Alegreya", serif`
          : `${size}px "Alegreya", serif`;
        const lines = wrap(g, b.texto, font, bw);
        plan.push({ ...b, lines, font });
        alto += lines.length * lh;
      }
      if (alto <= maxh || size === 15){
        let ty = ty0;
        for (const p of plan){
          if (p.tipo === 'sep'){
            g.strokeStyle = oscuro ? 'rgba(231,221,196,.4)' : 'rgba(21,17,12,.3)';
            g.lineWidth = 2;
            g.beginPath(); g.moveTo(bx, ty - lh * 0.42); g.lineTo(bx + bw, ty - lh * 0.42); g.stroke();
            ty += lh * 0.7;
            continue;
          }
          g.font = p.font;
          g.fillStyle = p.tipo === 'titulo' ? colorTitulo(p.texto) : inkColor;
          p.lines.forEach(l => { g.fillText(l, bx, ty); ty += lh; });
        }
        return ty;
      }
    }
    return ty0;
  }

  function fitText(g, text, family, maxw, maxh, start, min, prefix){
    const mk = size => `${prefix ? prefix + ' ' : ''}${size}px ${family}`;
    for (let size = start; size >= min; size--){
      const font = mk(size);
      const lines = wrap(g, text, font, maxw);
      const lh = size * 1.34;
      if (lines.length * lh <= maxh) return { size, lines, lh, font };
    }
    const font = mk(min);
    return { size:min, lines:wrap(g, text, font, maxw), lh:min*1.34, font };
  }

  // Ajusta el cuerpo de una fuente midiendo SIEMPRE con la fuente candidata.
  /** El antetítulo de una senda se compone solo: SENDA (oculta) · SOSIUS. */
  function etiquetasDe(c){
    if (c.tipo !== 'senda') return c.etiquetas || '';
    const prota = (c.sprota || '').toUpperCase();
    return 'SENDA' + (c.soculta !== false ? ' (oculta)' : '') + (prota ? ' · ' + prota : '');
  }

  function fitLine(g, text, mk, maxw, start, min){
    for (let size = start; size >= min; size -= 1){
      g.font = mk(size);
      if (g.measureText(text).width <= maxw) return size;
    }
    g.font = mk(min);
    return min;
  }

  function centered(g, text, x, y){ g.textAlign = 'center'; g.fillText(text, x, y); g.textAlign = 'left'; }

  // Texto con interletraje amplio, centrado. Se dibuja carácter a carácter porque
  // ctx.letterSpacing no está en todos los navegadores.
  function trackedText(g, text, cx, y, spacing){
    g.textAlign = 'left';                     // se centra a mano, carácter a carácter
    const chars = Array.from(text);
    let total = -spacing;
    chars.forEach(ch => total += g.measureText(ch).width + spacing);
    let x = cx - total/2;
    chars.forEach(ch => { g.fillText(ch, x, y); x += g.measureText(ch).width + spacing; });
    return total;
  }

  function fitTracked(g, text, mk, maxw, spacing, start, min){
    for (let size = start; size >= min; size--){
      g.font = mk(size);
      let total = -spacing;
      Array.from(text).forEach(ch => total += g.measureText(ch).width + spacing);
      if (total <= maxw) return size;
    }
    g.font = mk(min);
    return min;
  }

  // Cuerpo a dos columnas, con el entintado ligeramente desigual de una prensa mala.
  function twoColumns(g, text, family, x, y, colW, colH, gutter, start, min, color, seed){
    const fit = fitText(g, text, family, colW, colH*2 - 10, start, min);
    const per = Math.ceil(fit.lines.length/2);
    const rd = rng(seed);
    g.save();
    g.font = fit.font; g.fillStyle = color;
    fit.lines.forEach((l, i) => {
      const col = i < per ? 0 : 1;
      const row = i < per ? i : i - per;
      g.globalAlpha = .84 + rd()*.16;
      g.fillText(l, x + col*(colW + gutter), y + row*fit.lh);
    });
    g.restore();
    return fit;
  }

  // Convierte lo que haya en la ventana en una estampa: sin color, contraste duro, tinta parda.
  function woodcutPass(g, x, y, w, h){
    g.save();
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.globalCompositeOperation = 'saturation';
    g.fillStyle = '#808080'; g.fillRect(x, y, w, h);
    g.globalCompositeOperation = 'multiply';
    g.fillStyle = 'rgba(52,42,28,.52)'; g.fillRect(x, y, w, h);
    g.globalCompositeOperation = 'screen';
    g.fillStyle = 'rgba(216,201,166,.20)'; g.fillRect(x, y, w, h);
    g.globalCompositeOperation = 'source-over';
    g.restore();
  }

  function doubleRule(g, x1, x2, y, color){
    g.strokeStyle = color; g.lineWidth = 3.5;
    g.beginPath(); g.moveTo(x1, y); g.lineTo(x2, y); g.stroke();
    g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(x1, y+7); g.lineTo(x2, y+7); g.stroke();
  }

  // ---------------------------------------------------------------- texturas
  function parchment(g, x, y, w, h, seed){
    const grad = g.createLinearGradient(x, y, x, y+h);
    grad.addColorStop(0, '#e3d7ba'); grad.addColorStop(.55, C.parch); grad.addColorStop(1, '#c6b590');
    g.fillStyle = grad; g.fillRect(x, y, w, h);
    const r = rng(seed);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    for (let i = 0; i < Math.round(w*h/900); i++){
      const px = x + r()*w, py = y + r()*h, s = r()*1.9 + .3;
      g.fillStyle = r() > .5 ? 'rgba(70,56,34,.09)' : 'rgba(255,250,235,.10)';
      g.fillRect(px, py, s, s);
    }
    // manchas de humedad
    for (let i = 0; i < 7; i++){
      const px = x + r()*w, py = y + r()*h, rad = 28 + r()*70;
      const gg = g.createRadialGradient(px, py, 0, px, py, rad);
      gg.addColorStop(0, 'rgba(88,66,34,.07)'); gg.addColorStop(1, 'rgba(88,66,34,0)');
      g.fillStyle = gg; g.beginPath(); g.arc(px, py, rad, 0, 7); g.fill();
    }
    g.restore();
  }

  function grain(g, x, y, w, h, seed, amount){
    const r = rng(seed);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    for (let i = 0; i < Math.round(w*h/1400 * (amount||1)); i++){
      g.fillStyle = `rgba(0,0,0,${.05 + r()*.14})`;
      g.fillRect(x + r()*w, y + r()*h, r()*2.4, r()*2.4);
    }
    g.restore();
  }

  // Borde de tinta irregular: la marca de Darkest Dungeon.
  function inkEdge(g, x, y, w, h, seed, depth){
    const r = rng(seed);
    const d = depth || 9;
    g.save(); g.fillStyle = C.ink;
    const step = 15;
    g.beginPath(); g.moveTo(x, y);
    for (let i = x; i <= x+w; i += step) g.lineTo(i, y + r()*d);
    g.lineTo(x+w, y); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x, y+h);
    for (let i = x; i <= x+w; i += step) g.lineTo(i, y + h - r()*d);
    g.lineTo(x+w, y+h); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x, y);
    for (let i = y; i <= y+h; i += step) g.lineTo(x + r()*d, i);
    g.lineTo(x, y+h); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x+w, y);
    for (let i = y; i <= y+h; i += step) g.lineTo(x + w - r()*d, i);
    g.lineTo(x+w, y+h); g.closePath(); g.fill();
    g.restore();
  }

  function vignette(g, x, y, w, h, strength){
    const gg = g.createRadialGradient(x+w/2, y+h/2, Math.min(w,h)*.28, x+w/2, y+h/2, Math.max(w,h)*.78);
    gg.addColorStop(0, 'rgba(0,0,0,0)');
    gg.addColorStop(1, `rgba(0,0,0,${strength == null ? .62 : strength})`);
    g.fillStyle = gg; g.fillRect(x, y, w, h);
  }

  // ---------------------------------------------------------------- piezas
  function art(g, x, y, w, h, img, shape){
    g.save();
    if (shape === 'cut') cut(g, x, y, w, h, 22); else rr(g, x, y, w, h, 4);
    g.clip();
    if (img){
      const base = Math.max(w/img.width, h/img.height) * S.zoom;
      const dw = img.width*base, dh = img.height*base;
      g.drawImage(img, x + (w-dw)/2 + S.ox*(w/200), y + (h-dh)/2 + S.oy*(h/200), dw, dh);
    } else {
      const gg = g.createLinearGradient(x, y, x, y+h);
      gg.addColorStop(0, '#25211c'); gg.addColorStop(1, '#100d0a');
      g.fillStyle = gg; g.fillRect(x, y, w, h);
      g.fillStyle = 'rgba(184,134,47,.45)'; g.font = 'italic 26px "IM Fell English", serif';
      centered(g, 'sin ilustración', x+w/2, y+h/2);
      g.fillStyle = 'rgba(231,221,196,.22)'; g.font = '15px Archivo, sans-serif';
      centered(g, 'sube una imagen o carga la carpeta de arte', x+w/2, y+h/2+26);
    }
    g.restore();
  }

  function seal(g, cx, cy, r, fill, text, seed){
    g.save();
    g.beginPath(); g.arc(cx, cy, r+5, 0, 7); g.fillStyle = C.ink; g.fill();
    // borde de lacre irregular
    const rd = rng(seed || 1);
    g.beginPath();
    for (let a = 0; a < Math.PI*2; a += Math.PI/16){
      const rr2 = r * (1 + (rd()-.5)*.07);
      const px = cx + Math.cos(a)*rr2, py = cy + Math.sin(a)*rr2;
      a === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.closePath(); g.fillStyle = fill; g.fill();
    g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.55)'; g.stroke();
    g.beginPath(); g.arc(cx, cy, r-9, 0, 7); g.lineWidth = 1.5; g.strokeStyle = 'rgba(231,221,196,.35)'; g.stroke();
    g.fillStyle = C.bone; g.textBaseline = 'middle';
    g.font = `700 ${r > 34 ? 46 : 34}px Archivo, sans-serif`;
    centered(g, String(text), cx, cy+2);
    g.textBaseline = 'alphabetic';
    g.restore();
  }

  function diamond(g, cx, cy, r, fill, text, label){
    g.save();
    g.beginPath(); g.moveTo(cx, cy-r-4); g.lineTo(cx+r+4, cy); g.lineTo(cx, cy+r+4); g.lineTo(cx-r-4, cy); g.closePath();
    g.fillStyle = C.ink; g.fill();
    g.beginPath(); g.moveTo(cx, cy-r); g.lineTo(cx+r, cy); g.lineTo(cx, cy+r); g.lineTo(cx-r, cy); g.closePath();
    g.fillStyle = fill; g.fill();
    g.lineWidth = 2; g.strokeStyle = 'rgba(0,0,0,.5)'; g.stroke();
    g.fillStyle = C.bone; g.font = '700 38px Archivo, sans-serif'; g.textBaseline = 'middle';
    centered(g, String(text), cx, cy+1);
    g.textBaseline = 'alphabetic';
    if (label){
      g.fillStyle = C.ink; g.font = '700 19px Archivo, sans-serif';
      centered(g, label, cx, cy + r + 30);
    }
    g.restore();
  }

  function statbox(g, x, y, w, h, label, val, fill){
    g.save();
    cut(g, x-4, y-4, w+8, h+8, 12); g.fillStyle = C.ink; g.fill();
    cut(g, x, y, w, h, 10); g.fillStyle = fill; g.fill();
    const gg = g.createLinearGradient(x, y, x, y+h);
    gg.addColorStop(0, 'rgba(255,255,255,.13)'); gg.addColorStop(1, 'rgba(0,0,0,.30)');
    g.fillStyle = gg; g.fill();
    // Etiquetas y cifras en la sans: en gótica se vuelven manchas al tamaño real de mesa.
    g.fillStyle = 'rgba(231,221,196,.80)'; g.font = '700 21px Archivo, sans-serif';
    centered(g, label, x+w/2, y+28);
    g.fillStyle = C.bone; g.font = '800 52px Archivo, sans-serif';
    centered(g, String(val), x+w/2, y+h-16);
    g.restore();
  }

  function foil(g, x, y, w, h, shape){
    if (!S.foil) return;
    g.save();
    if (shape === 'cut') cut(g, x, y, w, h, 22); else rr(g, x, y, w, h, 6);
    g.clip();
    const a = S.foilAmt;
    const gg = g.createLinearGradient(x, y, x+w, y+h);
    gg.addColorStop(0,   `rgba(255,246,214,${.05*a})`);
    gg.addColorStop(.32, `rgba(255,255,255,${.30*a})`);
    gg.addColorStop(.5,  `rgba(184,134,47,${.14*a})`);
    gg.addColorStop(.68, `rgba(255,255,255,${.18*a})`);
    gg.addColorStop(1,   `rgba(255,246,214,${.05*a})`);
    g.fillStyle = gg; g.fillRect(x, y, w, h);
    g.restore();
  }

  // ---------------------------------------------------------------- lectura del panel
  function readCard(){
    return {
      kind:    'carta',
      nombre:  $('#name').value,
      tipo:    $('#type').value,
      rareza:  S.rarity || 'comun',
      coste:   $('#cost').value,
      etiquetas: $('#tags').value,
      texto:   $('#body').value,
      cita:    $('#flavor').value.trim(),
      pie:     $('#foot').value,
      atq: $('#atk').value, def: $('#def').value, ego: $('#ego').value,
      fue: $('#fue').value, agi: $('#agi').value, men: $('#men').value, car: $('#car').value, pv: $('#pv').value,
      hmast: $('#hmast').value, hregla: $('#hregla').value, hvoz: $('#hvoz').value,
      sprota: $('#sprota').value, soculta: $('#soculta').checked,
      arte:    $('#artslug').value || slug($('#name').value),
      style:   S.style, foil: S.foil, foilAmt: S.foilAmt,
      zoom: S.zoom, ox: S.ox, oy: S.oy,
    };
  }

  function writeCard(c){
    $('#name').value = c.nombre || '';
    $('#type').value = c.tipo || 'creature';
    $('#cost').value = c.coste ?? 0;
    $('#tags').value = c.etiquetas || '';
    $('#sprota').value = c.sprota || '';
    $('#soculta').checked = c.soculta !== false;
    $('#body').value = c.texto || '';
    $('#flavor').value = c.cita || '';
    $('#foot').value = c.pie || $('#foot').value;
    $('#atk').value = c.atq ?? 0; $('#def').value = c.def ?? 0; $('#ego').value = c.ego ?? 0;
    $('#fue').value = c.fue ?? 0; $('#agi').value = c.agi ?? 0; $('#men').value = c.men ?? 0;
    $('#car').value = c.car ?? 0; $('#pv').value  = c.pv  ?? 20;
    $('#hmast').value = c.hmast || 'El Heraldo';
    $('#hregla').value = c.hregla || '';
    $('#hvoz').value = c.hvoz || '';
    $('#artslug').value = c.arte || slug(c.nombre);
    if (c.rareza){ S.rarity = c.rareza; syncChips('#rarity', 'rar', c.rareza); }
    if (c.style){ S.style = c.style; syncChips('#style', 'style', c.style); }
    // El acabado foil se restaura con la carta: sin esto, reabrir y volver a
    // guardar horneaba el render sin brillo aunque la carta fuera foil.
    S.foil = !!c.foil; $('#foil').checked = S.foil;
    if (c.foilAmt != null){ S.foilAmt = c.foilAmt; if ($('#foilamt')) $('#foilamt').value = c.foilAmt * 100; }
    artEl = ART.get(c.arte || slug(c.nombre)) || null;
    S.zoom = c.zoom ?? 1; S.ox = c.ox ?? 0; S.oy = c.oy ?? 0;
    $('#zoom').value = S.zoom*100; $('#ox').value = S.ox; $('#oy').value = S.oy;
    toggleFields(); draw();
  }

  function accentOf(c){
    if (c.tipo === 'creature') return ACCENT[c.rareza] || ACCENT.comun;
    return TYPES[c.tipo] || ACCENT.comun;
  }

  // ================================================================ PINTAR CARTA
  function paintCard(g, c, img, opts){
    const A = accentOf(c);
    const seed = hash(c.nombre || 'taponazo');
    const isCreature = c.tipo === 'creature';
    const isWall = c.tipo === 'wall';
    const isHero = c.tipo === 'hero';

    // El Heraldo tiene plantilla propia: es un pliego, no una carta de juego.
    if (c.tipo === 'heraldo')         paintHeraldo(g, c, img, A, seed);
    else if (c.style === 'fullbleed') paintFullbleed(g, c, img, A, seed);
    else if (c.style === 'grafico')   paintGrafico(g, c, img, A, seed, isCreature, isWall, isHero);
    else if (c.style === 'marco')     paintMarco(g, c, img, A, seed, isCreature, isWall, isHero, opts);
    else                              paintDarkest(g, c, img, A, seed, isCreature, isWall, isHero);
  }

  // ---- EL HERALDO: pliego de cordel ------------------------------------------
  // La voz del juego es Paco Flores vendiendo la ronda como un romance de ciego:
  // papel malo, cabecera con filetes, titular gritado, grabado tosco, la noticia a
  // dos columnas y un escéptico rebatiéndole desde la barra. Su función mecánica es
  // dar conocimiento común — que la mesa sepa quién va ganando sin que nadie tenga
  // que decirlo y pagar el coste político.
  function paintHeraldo(g, c, img, A, seed){
    const INK_P = '#221b12';                 // tinta parda de imprenta barata
    const hasRegla = !!(c.hregla && c.hregla.trim());

    // ---- el pliego
    g.fillStyle = C.ink; g.fillRect(0, 0, W, H);
    const px = 14, py = 14, pw = W-28, ph = H-28;
    parchment(g, px, py, pw, ph, seed);
    g.fillStyle = 'rgba(140,124,88,.10)'; g.fillRect(px, py, pw, ph);   // papel más gris

    const m = 52, mw = W - m*2;

    // ---- cabecera
    doubleRule(g, m, W-m, 60, INK_P);
    const msz = fitTracked(g, (c.hmast || 'El Heraldo').toUpperCase(),
      s => `400 ${s}px "Grenze Gotisch", "IM Fell English SC", serif`, mw - 20, 9, 56, 26);
    g.fillStyle = INK_P; g.font = `400 ${msz}px "Grenze Gotisch", "IM Fell English SC", serif`;
    trackedText(g, (c.hmast || 'El Heraldo').toUpperCase(), W/2, 132, 9);
    doubleRule(g, m, W-m, 150, INK_P);

    // ---- antetítulo (la ronda, el lugar)
    g.font = 'italic 23px "IM Fell English", serif'; g.fillStyle = 'rgba(34,27,18,.72)';
    centered(g, etiquetasDe(c), W/2, 196);
    g.strokeStyle = 'rgba(34,27,18,.35)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(m, 212); g.lineTo(W-m, 212); g.stroke();

    // ---- el titular, gritado
    const head = (c.nombre || '').toUpperCase();
    const hf = fitText(g, head, '"Archivo", sans-serif', mw, 106, 62, 26, '800');
    g.fillStyle = INK_P; g.font = hf.font;
    let hy = 250 + (106 - hf.lines.length*hf.lh)/2;
    hf.lines.forEach(l => { centered(g, l, W/2, hy); hy += hf.lh; });

    // ---- el grabado
    const ax = 70, ay = 366, aw = W-140, ah = 280;
    art(g, ax, ay, aw, ah, img, 'rect');
    woodcutPass(g, ax, ay, aw, ah);
    g.strokeStyle = INK_P; g.lineWidth = 3;
    g.strokeRect(ax, ay, aw, ah);
    g.lineWidth = 1; g.strokeStyle = 'rgba(34,27,18,.5)';
    g.strokeRect(ax+7, ay+7, aw-14, ah-14);

    g.strokeStyle = 'rgba(34,27,18,.4)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(m, 664); g.lineTo(W-m, 664); g.stroke();

    // ---- la noticia, a dos columnas
    const bodyTop = 692;
    const bodyBottom = hasRegla ? 792 : 884;
    const gutter = 26, colW = (mw - gutter)/2;
    twoColumns(g, c.texto || '', '"Alegreya", serif',
      m, bodyTop, colW, bodyBottom - bodyTop, gutter, 25, 14, INK_P, seed+3);
    // corondel
    g.strokeStyle = 'rgba(34,27,18,.22)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(m + colW + gutter/2, bodyTop - 14); g.lineTo(m + colW + gutter/2, bodyBottom - 6); g.stroke();

    // ---- el efecto, si es Evento Global
    if (hasRegla){
      const rx = m, ry = 804, rw = mw, rh = 88;
      g.fillStyle = 'rgba(34,27,18,.07)'; g.fillRect(rx, ry, rw, rh);
      g.lineWidth = 2; g.strokeStyle = INK_P; g.strokeRect(rx, ry, rw, rh);
      g.fillStyle = C.parch; g.fillRect(rx+18, ry-9, 132, 18);
      g.fillStyle = INK_P; g.font = '700 15px Archivo, sans-serif';
      g.fillText('EVENTO GLOBAL', rx+24, ry+4);
      const rf = fitText(g, c.hregla, '"Alegreya", serif', rw-36, rh-30, 24, 14);
      let ry2 = ry + 34;
      g.font = rf.font;
      rf.lines.forEach(l => { g.fillText(l, rx+18, ry2); ry2 += rf.lh; });
    }

    // ---- desde la barra: el escéptico le rebate
    if (c.cita){
      g.strokeStyle = 'rgba(34,27,18,.4)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(m, 912); g.lineTo(W-m, 912); g.stroke();
      g.fillStyle = 'rgba(34,27,18,.5)'; g.font = '700 13px Archivo, sans-serif';
      trackedText(g, 'DESDE LA BARRA', W/2, 934, 4);

      const qf = fitText(g, c.cita, '"IM Fell English", serif', mw-40, 54, 25, 15, 'italic');
      g.fillStyle = INK_P; g.font = qf.font;
      let qy = 966;
      qf.lines.forEach(l => { centered(g, l, W/2, qy); qy += qf.lh; });
      if (c.hvoz){
        g.font = '16px Archivo, sans-serif'; g.fillStyle = 'rgba(34,27,18,.6)';
        centered(g, '— ' + c.hvoz, W/2, qy + 6);
      }
    }

    // ---- pie
    g.fillStyle = 'rgba(34,27,18,.42)'; g.font = '15px Archivo, sans-serif';
    centered(g, c.pie || '', W/2, H-30);

    inkEdge(g, px, py, pw, ph, seed+7, 10);
    grain(g, 0, 0, W, H, seed+11, 1.1);
    vignette(g, 0, 0, W, H, .3);
  }

  // ---- DARKEST: pergamino sucio, tinta gruesa, sello de lacre -----------------
  function paintDarkest(g, c, img, A, seed, isCreature, isWall, isHero){
    g.fillStyle = C.ink; g.fillRect(0, 0, W, H);
    parchment(g, 16, 16, W-32, H-32, seed);
    inkEdge(g, 16, 16, W-32, H-32, seed+7, 11);

    // filo exterior
    g.lineWidth = 3; g.strokeStyle = A.c; g.globalAlpha = .75;
    g.strokeRect(26, 26, W-52, H-52); g.globalAlpha = 1;

    // ---- cartela del nombre
    const nx = 36, ny = 36, nw = W-72, nh = 116;
    cut(g, nx, ny, nw, nh, 16); g.fillStyle = C.ink; g.fill();
    g.lineWidth = 2; g.strokeStyle = A.c; g.stroke();
    if (!isHero && c.tipo !== 'senda') seal(g, nx+62, ny+nh/2, 40, A.c, c.coste, seed+3);
    // Coste y EGO enmarcan el nombre: son las dos cifras del Consejo.
    if (isCreature) diamond(g, nx+nw-58, ny+nh/2, 38, '#6b4a7a', c.ego, null);
    const tx0 = isHero ? nx+26 : nx+124;
    const nmax = nw - (isHero ? 52 : 150) - (isCreature ? 104 : 0);
    const nsz = fitLine(g, c.nombre || ' ', s => `600 ${s}px "Grenze Gotisch", "IM Fell English SC", serif`, nmax, 52, 22);
    g.fillStyle = C.bone; g.font = `600 ${nsz}px "Grenze Gotisch", "IM Fell English SC", serif`;
    g.textBaseline = 'middle'; g.fillText(c.nombre || ' ', tx0, ny+nh/2 - 4); g.textBaseline = 'alphabetic';

    // ---- tipo + etiquetas
    g.fillStyle = A.c; g.fillRect(36, 166, 6, 22);
    g.fillStyle = C.ink; g.font = '700 21px Archivo, sans-serif';
    g.fillText(A.label, 52, 184);
    g.fillStyle = 'rgba(12,10,8,.68)'; g.font = 'italic 24px "IM Fell English", serif';
    g.fillText(etiquetasDe(c), 36, 218);

    // ---- ventana de arte
    const ax = 36, ay = 230, aw = W-72, ah = 372;
    g.fillStyle = C.ink; g.fillRect(ax-8, ay-8, aw+16, ah+16);
    art(g, ax, ay, aw, ah, img, 'cut');
    g.save(); cut(g, ax, ay, aw, ah, 22); g.clip(); vignette(g, ax, ay, aw, ah, .55); g.restore();
    foil(g, ax, ay, aw, ah, 'cut');
    cut(g, ax, ay, aw, ah, 22); g.lineWidth = 3; g.strokeStyle = 'rgba(184,134,47,.42)'; g.stroke();

    // ---- caja de texto
    const bx = 36, bw = W-72;
    let by = ay + ah + 24;
    const bottom = isHero ? H-262 : (isCreature || isWall) ? H-196 : H-96;
    const bh = bottom - by;
    g.fillStyle = 'rgba(20,15,9,.09)'; g.fillRect(bx, by, bw, bh);
    g.lineWidth = 1.5; g.strokeStyle = 'rgba(20,15,9,.32)'; g.strokeRect(bx, by, bw, bh);

    let ty = by + 34;
    const hasCita = !!c.cita;
    const bodyH = bh - 44 - (hasCita ? 66 : 0);
    ty = drawBody(g, c.texto, bx+20, bw-40, ty, bodyH, '#181309', false);

    if (hasCita){
      ty += 10;
      g.strokeStyle = 'rgba(20,15,9,.25)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(bx+20, ty-16); g.lineTo(bx+bw-20, ty-16); g.stroke();
      const ff = fitText(g, c.cita, '"IM Fell English", serif', bw-40, 62, 24, 15, 'italic');
      g.fillStyle = 'rgba(24,19,9,.62)'; g.font = ff.font;
      ff.lines.forEach(l => { g.fillText(l, bx+20, ty); ty += ff.lh; });
    }

    // ---- stats (el DEF del muro va donde el de criatura)
    if (isCreature){ statbox(g, 44, H-176, 168, 114, 'ATQ', c.atq, C.blood); statbox(g, W-212, H-176, 168, 114, 'DEF', c.def, '#3f6072'); }
    if (isWall)     statbox(g, W-212, H-176, 168, 114, 'DEF', c.def, '#3f6072');
    if (isHero)     heroStats(g, c);
    if (isHero)     heroPV(g, c, nx+nw-58, ny+nh/2, seed+5);

    // ---- pie
    g.fillStyle = 'rgba(20,15,9,.55)'; g.font = '18px Archivo, sans-serif';
    centered(g, c.pie || '', W/2, H-30);

    if (c.rareza === 'legendaria' && isCreature) corners(g, '#b8862f');
    grain(g, 0, 0, W, H, seed+21, .55);
  }

  // ---- GRÁFICO: plano, contornos gruesos, serigrafía --------------------------
  function paintGrafico(g, c, img, A, seed, isCreature, isWall, isHero){
    g.fillStyle = A.c; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(0,0,0,.30)'; g.fillRect(0, 0, W, H);
    cut(g, 14, 14, W-28, H-28, 26); g.fillStyle = '#141210'; g.fill();

    // banda superior de color
    cut(g, 30, 30, W-60, 120, 18); g.fillStyle = A.c; g.fill();
    g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();
    if (!isHero && c.tipo !== 'senda') seal(g, 92, 90, 40, C.ink, c.coste, seed+3);
    if (isCreature) diamond(g, W-96, 90, 38, '#6b4a7a', c.ego, null);
    const nmax = W - 60 - (isHero ? 60 : 150) - (isCreature ? 100 : 0);
    const nsz = fitLine(g, c.nombre || ' ', s => `600 ${s}px "Grenze Gotisch", "IM Fell English SC", serif`, nmax, 50, 22);
    g.fillStyle = C.bone; g.font = `600 ${nsz}px "Grenze Gotisch", "IM Fell English SC", serif`;
    g.textBaseline = 'middle'; g.fillText(c.nombre || ' ', isHero ? 56 : 148, 92); g.textBaseline = 'alphabetic';

    const ax = 30, ay = 166, aw = W-60, ah = 430;
    art(g, ax, ay, aw, ah, img, 'cut');
    foil(g, ax, ay, aw, ah, 'cut');
    cut(g, ax, ay, aw, ah, 22); g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();

    // etiqueta de tipo pegada al arte
    g.font = '700 19px Archivo, sans-serif';
    const lw = g.measureText(A.label).width + 26;
    cut(g, ax+14, ay+ah-40, lw, 30, 8); g.fillStyle = A.c; g.fill();
    g.lineWidth = 3; g.strokeStyle = C.ink; g.stroke();
    g.fillStyle = C.bone; g.fillText(A.label, ax+27, ay+ah-19);

    const bx = 30, bw = W-60;
    let by = ay + ah + 34;
    const bottom = isHero ? H-252 : (isCreature || isWall) ? H-176 : H-84;
    cut(g, bx, by, bw, bottom-by, 16); g.fillStyle = '#efe6d0'; g.fill();
    g.lineWidth = 5; g.strokeStyle = C.ink; g.stroke();

    g.fillStyle = 'rgba(12,10,8,.55)'; g.font = 'italic 20px "IM Fell English", serif';
    g.fillText(etiquetasDe(c), bx+22, by+30);

    let ty = by + 62;
    const hasCita = !!c.cita;
    ty = drawBody(g, c.texto, bx+22, bw-44, ty, (bottom-by) - 78 - (hasCita?66:0), '#15110c', false);
    if (hasCita){
      ty += 8;
      const ff = fitText(g, c.cita, '"IM Fell English", serif', bw-44, 58, 23, 15, 'italic');
      g.fillStyle = 'rgba(21,17,12,.58)'; g.font = ff.font;
      ff.lines.forEach(l => { g.fillText(l, bx+22, ty); ty += ff.lh; });
    }

    if (isCreature){ statbox(g, 40, H-158, 160, 110, 'ATQ', c.atq, C.blood); statbox(g, W-200, H-158, 160, 110, 'DEF', c.def, '#3f6072'); }
    if (isWall)     statbox(g, W-200, H-158, 160, 110, 'DEF', c.def, '#3f6072');
    if (isHero)     heroStats(g, c);
    if (isHero)     heroPV(g, c, W-96, 90, seed+5);

    g.fillStyle = 'rgba(231,221,196,.42)'; g.font = '18px Archivo, sans-serif';
    g.fillText(c.pie || '', 34, H-28);
    grain(g, 0, 0, W, H, seed+9, .7);
  }

  // ---- ILUSTRACIÓN COMPLETA ---------------------------------------------------
  function paintFullbleed(g, c, img, A, seed){
    const isCreature = c.tipo === 'creature', isWall = c.tipo === 'wall', isHero = c.tipo === 'hero';
    art(g, 0, 0, W, H, img, 'rect');
    let gg = g.createLinearGradient(0, 0, 0, 250);
    gg.addColorStop(0, 'rgba(8,6,5,.82)'); gg.addColorStop(1, 'rgba(8,6,5,0)');
    g.fillStyle = gg; g.fillRect(0, 0, W, 250);
    gg = g.createLinearGradient(0, H-580, 0, H);
    gg.addColorStop(0, 'rgba(9,7,5,0)'); gg.addColorStop(.38, 'rgba(9,7,5,.74)'); gg.addColorStop(1, 'rgba(7,5,4,.97)');
    g.fillStyle = gg; g.fillRect(0, H-580, W, 580);
    foil(g, 0, 0, W, H, 'rect');

    g.lineWidth = 6; g.strokeStyle = A.c; rr(g, 9, 9, W-18, H-18, 12); g.stroke();
    g.lineWidth = 2; g.strokeStyle = 'rgba(0,0,0,.55)'; rr(g, 16, 16, W-32, H-32, 8); g.stroke();
    if (!isHero && c.tipo !== 'senda') seal(g, 82, 84, 44, A.c, c.coste, seed+3);
    if (c.tipo === 'creature') diamond(g, W-82, 84, 40, '#6b4a7a', c.ego, null);

    const nsz = fitLine(g, c.nombre || ' ', s => `600 ${s}px "Grenze Gotisch", "IM Fell English SC", serif`, W-260, 60, 26);
    g.fillStyle = C.bone; g.font = `600 ${nsz}px "Grenze Gotisch", "IM Fell English SC", serif`;
    g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 16; g.shadowOffsetY = 2;
    centered(g, c.nombre || ' ', W/2, 154);
    g.shadowBlur = 0; g.shadowOffsetY = 0;
    g.font = 'italic 25px "IM Fell English", serif'; g.fillStyle = 'rgba(216,201,166,.9)';
    centered(g, c.etiquetas || '', W/2, 192);

    const tx = 52, tw = W-104;
    let ty = H-372;
    g.fillStyle = A.c; g.font = '700 22px Archivo, sans-serif'; g.fillText(A.label, tx, ty); ty += 14;
    g.strokeStyle = 'rgba(184,134,47,.5)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx+tw, ty); g.stroke(); ty += 32;
    ty = drawBody(g, c.texto, tx, tw, ty, 170, '#efe6d2', true);
    if (c.cita){
      ty += 8;
      const ff = fitText(g, c.cita, '"IM Fell English", serif', tw, 66, 24, 15, 'italic');
      g.fillStyle = 'rgba(188,174,144,.9)'; g.font = ff.font;
      ff.lines.forEach(l => { g.fillText(l, tx, ty); ty += ff.lh; });
    }
    if (isCreature){
      statbox(g, 46, H-142, 150, 104, 'ATQ', c.atq, C.blood);
      statbox(g, W-196, H-142, 150, 104, 'DEF', c.def, '#3f6072');
    }
    if (isWall) statbox(g, W-196, H-142, 150, 104, 'DEF', c.def, '#3f6072');
    if (isHero) heroStats(g, c);
    if (isHero) heroPV(g, c, W-82, 84, seed+5);
    g.fillStyle = 'rgba(156,142,112,.85)'; g.font = '19px Archivo, sans-serif';
    g.fillText(c.pie || '', tx, H-158);
  }

  // ---- MARCO PROPIO: la imagen de marco manda ---------------------------------
  // El PNG del marco se dibuja a sangre (750×1050) sobre el arte. Debe traer la
  // ventana de ilustración transparente. Los textos van en las zonas seguras.
  function paintMarco(g, c, img, A, seed, isCreature, isWall, isHero, opts){
    const L = layoutFor(c);
    g.fillStyle = C.ink; g.fillRect(0, 0, W, H);
    const key = frameKeyFor(c);
    const fr  = FRAMES.get(key) || FRAMES.get('marco:todos');

    art(g, L.winX, L.winY, L.winW, L.winH, img, 'rect');
    foil(g, L.winX, L.winY, L.winW, L.winH, 'rect');

    if (fr) g.drawImage(fr, 0, 0, W, H);
    else {
      // Sin marco: se pinta un panel claro bajo el bloque de texto para que se pueda
      // colocar todo aunque el PNG todavía no exista, y el aviso va en una franja
      // superior donde no puede chocar con nada.
      rr(g, L.textX - 14, L.textY - 34, L.textW + 28, L.textH + 46, 10);
      g.fillStyle = 'rgba(216,201,166,.9)'; g.fill();
      g.fillStyle = 'rgba(143,47,36,.9)'; g.fillRect(0, 0, W, 34);
      g.fillStyle = C.bone; g.font = '700 16px Archivo, sans-serif';
      centered(g, `sin marco para «${key}» · súbelo en «Marcos»`, W/2, 23);
    }

    // ---- textos, colocados según el layout de este marco
    if (!isHero && c.tipo !== 'heraldo' && c.tipo !== 'senda') seal(g, 84, L.titleY - 10, 40, A.c, c.coste, seed+3);
    if (isCreature) diamond(g, W-84, L.titleY - 10, 38, '#6b4a7a', c.ego, null);
    const nsz = fitLine(g, c.nombre || ' ', s => `600 ${s}px "Grenze Gotisch", "IM Fell English SC", serif`, W-280, 46, 20);
    g.font = `600 ${nsz}px "Grenze Gotisch", "IM Fell English SC", serif`;
    if (L.titleDark){
      g.fillStyle = '#1a140c';                   // banda de título clara
    } else {
      g.fillStyle = C.bone;
      g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = 10;
    }
    centered(g, c.nombre || ' ', W/2, L.titleY);
    g.shadowBlur = 0;

    const bx = L.textX, bw = L.textW;
    g.fillStyle = 'rgba(12,10,8,.72)'; g.font = 'italic 21px "IM Fell English", serif';
    centered(g, etiquetasDe(c), W/2, L.tagsY);

    let ty = L.textY;
    const hasCita = !!c.cita;
    ty = drawBody(g, c.texto, bx, bw, ty, L.textH - (hasCita ? 56 : 0), '#15110c', false);
    if (hasCita){
      ty += 6;
      const ff = fitText(g, c.cita, '"IM Fell English", serif', bw, 52, 22, 13, 'italic');
      g.fillStyle = 'rgba(21,17,12,.6)'; g.font = ff.font;
      ff.lines.forEach(l => { g.fillText(l, bx, ty); ty += ff.lh; });
    }

    if (isCreature){
      statbox(g, 40, L.statsY, 150, 104, 'ATQ', c.atq, C.blood);
      statbox(g, W-190, L.statsY, 150, 104, 'DEF', c.def, '#3f6072');
    }
    if (isWall) statbox(g, W-190, L.statsY, 150, 104, 'DEF', c.def, '#3f6072');
    // Atributos un poco más arriba para que respiren sobre el pie,
    // y los PV arriba a la derecha (donde la criatura lleva el EGO).
    if (isHero) heroStats(g, c, L.statsY - 28);
    if (isHero) heroPV(g, c, W-84, L.titleY - 10, seed+5);

    g.fillStyle = 'rgba(255,255,255,.92)'; g.font = '17px Archivo, sans-serif';
    centered(g, c.pie || '', W/2, L.footY);

    if (opts && opts.guides) drawGuides(g, L, isCreature, isWall, isHero);
  }

  // ---------------------------------------------------------------- marcos propios
  // Un marco generado fuera nunca trae el agujero donde a nosotros nos venga bien,
  // así que la posición de la ventana y de cada bloque de texto es editable y se
  // guarda por tipo de marco.
  const LAYOUT_DEF = {
    winX: 66, winY: 150, winW: 618, winH: 520,
    titleY: 96, tagsY: 700, textX: 74, textW: 602, textY: 730, textH: 150, statsY: 900, footY: 1014,
    titleDark: 0,          // 1 si la banda del título es clara y el texto debe ir en tinta
  };

  // Devuelve el marco sin fondo. Cubre los dos accidentes habituales: que el PNG
  // llegue con el damero de transparencia horneado como píxeles grises (pasa al
  // guardar una vista previa en vez del archivo) y que el generador entregue un
  // fondo plano opaco aunque se le haya pedido alfa. Se toman como fondo los
  // colores dominantes del borde exterior.
  function stripBackground(img){
    // Se trabaja a la resolución nativa. Reescalar antes de recortar mezcla los
    // cuadros vecinos del damero y deja grises intermedios que sobreviven al umbral:
    // esa rejilla residual encierra el relleno y la ventana sale minúscula.
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const c = document.createElement('canvas');
    c.width = iw; c.height = ih;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    let id;
    try { id = g.getImageData(0, 0, iw, ih); } catch { return null; }
    const d = id.data;

    // colores dominantes del anillo exterior
    const bins = new Map();
    const sample = i => {
      if (d[i+3] < 250) return;                          // ya transparente
      const k = ((d[i] >> 3) << 10) | ((d[i+1] >> 3) << 5) | (d[i+2] >> 3);
      const b = bins.get(k) || { n:0, r:0, g:0, b:0 };
      b.n++; b.r += d[i]; b.g += d[i+1]; b.b += d[i+2];
      bins.set(k, b);
    };
    for (let x = 0; x < iw; x++){ sample(x*4); sample(((ih-1)*iw + x)*4); }
    for (let y = 0; y < ih; y++){ sample(y*iw*4); sample((y*iw + iw-1)*4); }
    if (!bins.size) return null;

    const ring = 2*(iw + ih);
    const targets = [...bins.values()]
      .filter(b => b.n / ring > 0.04)                    // ruido fuera
      .sort((a, b) => b.n - a.n)
      .slice(0, 3)
      .map(b => [b.r/b.n, b.g/b.n, b.b/b.n]);
    if (!targets.length) return null;

    // Caja de color que cubre todos los tonos de fondo. Con un damero, engloba
    // además las mezclas entre sus dos grises; con un fondo plano se queda en él.
    const TOL = 18;
    const lo = [255, 255, 255], hi = [0, 0, 0];
    targets.forEach(t => t.forEach((v, k) => {
      lo[k] = Math.min(lo[k], v - TOL);
      hi[k] = Math.max(hi[k], v + TOL);
    }));

    let cleared = 0;
    for (let i = 0; i < d.length; i += 4){
      if (d[i+3] === 0) continue;
      if (d[i]   >= lo[0] && d[i]   <= hi[0] &&
          d[i+1] >= lo[1] && d[i+1] <= hi[1] &&
          d[i+2] >= lo[2] && d[i+2] <= hi[2]){
        d[i+3] = 0; cleared++;
      }
    }
    if (cleared / (iw*ih) > 0.88) return null;           // se comería el marco entero
    g.putImageData(id, 0, 0);
    return { canvas: c, cleared, total: iw*ih };
  }

  // Recorta el margen transparente del marco y reescala lo que queda a la carta
  // entera. Sin esto, un PNG con aire alrededor del borde dibujado deja un cerco
  // oscuro: el marco no llega a los filos.
  function trimFrame(img){
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const c = document.createElement('canvas');
    c.width = iw; c.height = ih;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    let d;
    try { d = g.getImageData(0, 0, iw, ih).data; } catch { return null; }

    let x0 = iw, x1 = -1, y0 = ih, y1 = -1;
    for (let y = 0; y < ih; y++){
      const row = y*iw;
      for (let x = 0; x < iw; x++){
        if (d[(row + x)*4 + 3] > 24){
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) return null;                       // todo transparente
    const tw = x1-x0+1, th = y1-y0+1;
    if (tw >= iw-1 && th >= ih-1) return null;     // no sobraba nada

    const out = document.createElement('canvas');
    out.width = W; out.height = H;
    out.getContext('2d').drawImage(c, x0, y0, tw, th, 0, 0, W, H);
    // cuánto se deforma al estirar un recorte que no tiene la proporción de la carta
    const stretch = Math.round(Math.abs((tw/th) / (W/H) - 1) * 100);
    return { canvas: out, stretch, margen: [x0, y0, iw-x1-1, ih-y1-1] };
  }

  // Deja el marco listo para pintar: recortado a sangre y guardado bajo su clave.
  function installFrame(key, img){
    const t = trimFrame(img);
    FRAMES.set(key, t ? t.canvas : img);
    return t;
  }

  // Lee el marco a media resolución una sola vez y deja consultar píxeles.
  function frameProbe(img){
    const sw = W/2, sh = H/2;
    const oc = document.createElement('canvas');
    oc.width = sw; oc.height = sh;
    const og = oc.getContext('2d', { willReadFrequently: true });
    og.drawImage(img, 0, 0, sw, sh);
    let d;
    try { d = og.getImageData(0, 0, sw, sh).data; }
    catch { return null; }                       // lienzo contaminado
    return { sw, sh, d,
      at: (x, y) => { const i = (y*sw + x)*4; return [d[i], d[i+1], d[i+2], d[i+3]]; } };
  }

  // Inunda desde el centro sobre los píxeles que cumplan `is` y devuelve su caja.
  function floodBox(P, is){
    const { sw, sh } = P;
    const cx = Math.floor(sw/2), cy = Math.floor(sh/2);
    if (!is(cx, cy)) return null;
    const seen = new Uint8Array(sw*sh);
    const st = [cy*sw + cx];
    let x0 = sw, x1 = 0, y0 = sh, y1 = 0;
    while (st.length){
      const q = st.pop();
      if (seen[q]) continue;
      seen[q] = 1;
      const x = q % sw, y = (q - x)/sw;
      if (!is(x, y)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      if (x > 0)     st.push(q-1);
      if (x < sw-1)  st.push(q+1);
      if (y > 0)     st.push(q-sw);
      if (y < sh-1)  st.push(q+sw);
    }
    const w = (x1-x0+1)*2, h = (y1-y0+1)*2;
    if (w*h > W*H*0.92) return null;             // el marco no cierra
    return { winX: x0*2, winY: y0*2, winW: w, winH: h };
  }

  // Saca de un marco la ventana y los paneles de pergamino, y traduce todo a las
  // posiciones del layout. Funciona con alfa y también con el damero horneado, para
  // poder medir un PNG aunque haya perdido la transparencia.
  function detectZones(img){
    const P = frameProbe(img);
    if (!P) return null;
    const { at } = P;

    const transparente = (x, y) => at(x, y)[3] < 24;
    const damero = (x, y) => { const [r, g, b, a] = at(x, y);
      return a > 240 && Math.abs(r-g) < 8 && Math.abs(g-b) < 8 && r > 188; };
    // pergamino: claro pero cálido — así no se confunde con el gris del damero
    const pergamino = (x, y) => { const [r, g, b, a] = at(x, y);
      return a > 240 && r > 185 && g > 160 && b > 115 && r > b + 10; };

    const win = floodBox(P, transparente) || floodBox(P, damero);

    // bandas horizontales de pergamino
    const bandas = [];
    let cur = null;
    for (let y = 0; y < P.sh; y++){
      let n = 0;
      for (let x = 0; x < P.sw; x += 2) if (pergamino(x, y)) n++;
      if (n / (P.sw/2) > 0.42){ if (!cur) cur = { y0:y, y1:y }; else cur.y1 = y; }
      else if (cur){ if (cur.y1 - cur.y0 > 6) bandas.push(cur); cur = null; }
    }
    if (cur && cur.y1 - cur.y0 > 6) bandas.push(cur);

    // extensión horizontal: el tramo continuo más largo de la fila central
    bandas.forEach(b => {
      const ym = Math.floor((b.y0 + b.y1)/2);
      let run = 0, best = 0, start = 0;
      b.x0 = 0; b.x1 = P.sw-1;
      for (let x = 0; x < P.sw; x++){
        if (pergamino(x, ym)){
          if (!run) start = x;
          run++;
          if (run > best){ best = run; b.x0 = start; b.x1 = x; }
        } else run = 0;
      }
      b.h = b.y1 - b.y0;
    });

    const L = {};
    if (win) Object.assign(L, win);

    const winTop = win ? win.winY/2 : P.sh*0.15;
    const arriba = bandas.filter(b => b.y1 < winTop + 4);
    const abajo  = bandas.filter(b => b.y0 > winTop);

    if (arriba.length){
      const t = arriba[arriba.length-1];
      L.titleY = Math.round((t.y0 + t.y1) * 1.0) + 12;   // centro*2 + ajuste óptico
      L.titleDark = 1;                                    // hay pergamino: tinta oscura
    }
    if (abajo.length){
      const texto = abajo.reduce((a, b) => b.h > a.h ? b : a);
      const etiq  = abajo.filter(b => b !== texto && b.y1 <= texto.y0);
      if (etiq.length){
        const e = etiq[0];
        L.tagsY = Math.round((e.y0 + e.y1) * 1.0) + 9;
      }
      L.textX = texto.x0*2 + 20;
      L.textW = (texto.x1 - texto.x0)*2 - 40;
      L.textY = texto.y0*2 + 38;
      L.statsY = Math.max(texto.y1*2 - 62, L.textY + 90);
      L.textH = Math.max(60, Math.min(texto.h*2 - 54, L.statsY - L.textY - 12));
    }
    L.footY = 1014;

    return Object.keys(L).length ? L : null;
  }
  const FRAME_WINDOW = { x:LAYOUT_DEF.winX, y:LAYOUT_DEF.winY, w:LAYOUT_DEF.winW, h:LAYOUT_DEF.winH };

  const LS_LAYOUT = 'taponazo.taller.marcos.v1';
  let LAYOUTS = {};
  try { LAYOUTS = JSON.parse(localStorage.getItem(LS_LAYOUT) || '{}'); } catch { LAYOUTS = {}; }
  // Migración suave: los defaults antiguos del pie (1022 del DEF, 1030 del
  // detector) pasan al 1014 actual. Un footY elegido a mano se respeta.
  Object.values(LAYOUTS).forEach(L => {
    if (L && (L.footY === 1022 || L.footY === 1030)) L.footY = 1014;
  });
  function saveLayouts(){
    try { localStorage.setItem(LS_LAYOUT, JSON.stringify(LAYOUTS)); } catch {}
  }

  function frameKeyFor(c){
    return 'marco:' + (c.tipo === 'creature' ? c.rareza : c.tipo);
  }
  /**
   * Clave de layout EFECTIVA: la del marco que realmente se está pintando.
   * Con un único marco global (marco:todos), TODOS los tipos comparten el
   * mismo ajuste fino — antes cada tipo guardaba bajo su propia clave y al
   * cambiar de tipo el layout "se desajustaba" porque leía otra entrada.
   */
  function layoutKeyFor(c){
    const propia = frameKeyFor(c);
    return FRAMES.has(propia) ? propia : 'marco:todos';
  }
  function layoutFor(c){
    const key = layoutKeyFor(c);
    return Object.assign({}, LAYOUT_DEF, LAYOUTS['marco:todos'] || {}, LAYOUTS[key] || {});
  }

  // Guías de encaje. Solo en la vista previa: la exportación nunca las lleva.
  function drawGuides(g, L, isCreature, isWall, isHero){
    g.save();
    g.setLineDash([9, 7]); g.lineWidth = 2; g.font = '600 15px Archivo, sans-serif';

    const mark = (x, y, w, h, color, label) => {
      g.strokeStyle = color; g.strokeRect(x, y, w, h);
      g.fillStyle = color;
      g.setLineDash([]);
      g.fillRect(x, y - 19, g.measureText(label).width + 12, 19);
      g.setLineDash([9, 7]);
      g.fillStyle = '#0c0a08'; g.fillText(label, x + 6, y - 5);
    };
    const line = (y, color, label) => {
      g.strokeStyle = color;
      g.beginPath(); g.moveTo(20, y); g.lineTo(W-20, y); g.stroke();
      g.setLineDash([]);
      g.fillStyle = color; g.fillRect(20, y - 19, g.measureText(label).width + 12, 19);
      g.fillStyle = '#0c0a08'; g.fillText(label, 26, y - 5);
      g.setLineDash([9, 7]);
    };

    mark(L.winX, L.winY, L.winW, L.winH, '#e8b23a', 'ventana de ilustración');
    line(L.titleY, '#6fd0e0', 'título');
    line(L.tagsY, '#8fd07a', 'etiquetas');
    mark(L.textX, L.textY - 22, L.textW, L.textH, '#c98ae0', 'texto');
    if (isCreature || isWall || isHero) line(L.statsY, '#e0705a', 'stats');
    line(L.footY, '#9aa0a8', 'pie');

    g.restore();
  }

  // Solo los atributos: los PV del protagonista van arriba a la derecha,
  // en el mismo sitio donde la criatura lleva su EGO (decisión de Iván).
  function heroStats(g, c, y0){
    const y = y0 == null ? H-158 : y0;
    const atributos = [['FUE', c.fue], ['AGI', c.agi], ['MEN', c.men], ['CAR', c.car]];
    // La Capacidad de EGO no se teclea: es CAR + 3 (Reglamento 0.4, seccion 8).
    // Calculada no puede quedarse desfasada del CAR ni de la regla.
    const cap = Number(c.car || 0) + 3;
    const bw = 106, gap = 10;
    const total = (atributos.length + 1)*bw + atributos.length*gap;
    let x = (W - total)/2;
    atributos.forEach(([l, v]) => {
      statbox(g, x, y, bw, 96, l, (v >= 0 ? '+' : '') + v, '#3a3228');
      x += bw + gap;
    });
    // En morado, el color del EGO de las criaturas: es un tope, no un atributo.
    statbox(g, x, y, bw, 96, 'CAP', cap, '#4a3352');
  }

  /** Sello rojo de PV del protagonista, arriba a la derecha. */
  function heroPV(g, c, cx, cy, seed){
    seal(g, cx, cy, 40, C.blood, c.pv, seed);
    g.fillStyle = C.bone; g.font = '700 13px Archivo, sans-serif';
    centered(g, 'PV', cx, cy + 32);
  }

  function corners(g, color){
    g.strokeStyle = color; g.lineWidth = 4;
    [[30,30,1,1],[W-30,30,-1,1],[30,H-30,1,-1],[W-30,H-30,-1,-1]].forEach(([x,y,sx,sy]) => {
      g.beginPath(); g.moveTo(x, y+30*sy); g.lineTo(x, y); g.lineTo(x+30*sx, y); g.stroke();
    });
  }

  // ---------------------------------------------------------------- dorso: piezas
  // Borrón de tinta: contorno perturbado en varias frecuencias + gotas + salpicadura.
  function inkBlot(g, cx, cy, r, seed, color){
    const rd = rng(seed);
    const p1 = seed % 7, p2 = seed % 11, p3 = seed % 13, p4 = seed % 17;
    const ink = color || C.ink;

    // Contorno de la mancha: muchos lóbulos pequeños, no cuatro bultos grandes.
    const outline = (k0) => {
      g.beginPath();
      const N = 320;
      for (let i = 0; i <= N; i++){
        const a = i/N * Math.PI*2;
        const k = k0
          + Math.sin(a*5  + p1)*.050
          + Math.sin(a*8  + p2)*.034
          + Math.sin(a*13 + p3)*.022
          + Math.sin(a*21 + p4)*.013;
        const px = cx + Math.cos(a)*r*k, py = cy + Math.sin(a)*r*k*1.05;
        i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
      }
      g.closePath();
    };

    g.save();
    g.fillStyle = ink;
    // halo de absorción: la tinta que ha calado el papel alrededor
    g.globalAlpha = .16; outline(1.10); g.fill();
    g.globalAlpha = .30; outline(1.045); g.fill();
    g.globalAlpha = 1;   outline(1); g.fill();

    // gotas desprendidas, pequeñas
    for (let i = 0; i < 13; i++){
      const a = rd()*Math.PI*2, d = r*(1.08 + rd()*.62);
      g.globalAlpha = .8 + rd()*.2;
      g.beginPath(); g.arc(cx + Math.cos(a)*d, cy + Math.sin(a)*d*1.05, r*(.014 + rd()*.045), 0, 7); g.fill();
    }
    // salpicadura fina
    for (let i = 0; i < 210; i++){
      const a = rd()*Math.PI*2, d = r*(1.02 + rd()*1.25);
      g.globalAlpha = .25 + rd()*.55;
      g.beginPath(); g.arc(cx + Math.cos(a)*d, cy + Math.sin(a)*d*1.05, rd()*2.2 + .35, 0, 7); g.fill();
    }
    g.globalAlpha = 1;
    g.restore();
  }

  // Renglones de escritura fingida: trazos ondulados que se cortan al final del párrafo.
  function handwriting(g, x, y, w, rows, seed, alpha){
    const rd = rng(seed);
    g.save();
    g.strokeStyle = `rgba(28,20,11,${alpha == null ? .5 : alpha})`;
    g.lineCap = 'round';
    for (let r = 0; r < rows; r++){
      const yy = y + r*27;
      let xx = x + (r === 0 ? 40 : 0);
      const end = x + w*(r === rows-1 ? .34 + rd()*.28 : .9 + rd()*.09);
      while (xx < end){
        const seg = 9 + rd()*24;
        g.lineWidth = 1.5 + rd()*1.2;
        g.beginPath();
        g.moveTo(xx, yy);
        g.bezierCurveTo(xx + seg*.3, yy - 3 - rd()*3, xx + seg*.7, yy + 2 + rd()*3, xx + seg, yy);
        g.stroke();
        xx += seg + 4 + rd()*7;
      }
    }
    g.restore();
  }

  // Los tres mazos ocultos del juego. Cada uno con su emblema, su color y su voz.
  // Todos los glifos son simétricos al girar: el dorso no puede delatar orientación.
  const BACKS = {
    relato: { acc:'#8f2f24', titulo:'TAPONAZO',   sub:'La Crónica',                 glifo:'rombo',        tinte:null },
    evento: { acc:'#b8862f', titulo:'EL HERALDO', sub:'Lo que se cuenta en la Venta', glifo:'estrella',   tinte:'rgba(184,134,47,.08)' },
    senda:  { acc:'#4f6b3a', titulo:'LA SENDA',   sub:'Lo que aún no has contado',   glifo:'encrucijada', tinte:'rgba(79,107,58,.08)' },
  };

  // Sello de lacre con un emblema en relieve.
  function waxSeal(g, cx, cy, r, color, seed, glifo){
    const rd = rng(seed);
    g.save();
    g.beginPath();
    for (let a = 0; a < Math.PI*2; a += Math.PI/20){
      const rr2 = r*(1 + (rd()-.5)*.13);
      const px = cx + Math.cos(a)*rr2, py = cy + Math.sin(a)*rr2;
      a === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.closePath();
    g.fillStyle = color; g.fill();
    const gg = g.createLinearGradient(cx, cy-r, cx, cy+r);
    gg.addColorStop(0, 'rgba(255,255,255,.12)'); gg.addColorStop(.5, 'rgba(0,0,0,.12)'); gg.addColorStop(1, 'rgba(0,0,0,.55)');
    g.fillStyle = gg; g.fill();
    g.lineWidth = 2.5; g.strokeStyle = 'rgba(0,0,0,.5)'; g.stroke();
    // emblema hundido
    const d = r*.46;
    g.save();
    g.translate(cx, cy);
    g.fillStyle = 'rgba(0,0,0,.34)';
    g.strokeStyle = 'rgba(255,255,255,.20)';
    g.lineWidth = 2;

    if (glifo === 'estrella'){
      // la voz que se propaga: el pregón del Heraldo
      g.beginPath();
      for (let i = 0; i < 16; i++){
        const a = i/16 * Math.PI*2, rr = (i % 2) ? d*.44 : d;
        const px = Math.cos(a)*rr, py = Math.sin(a)*rr;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.closePath(); g.fill(); g.stroke();

    } else if (glifo === 'encrucijada'){
      // dos caminos que se cruzan: la Senda es una elección, y está oculta
      g.lineCap = 'round';
      g.strokeStyle = 'rgba(0,0,0,.38)'; g.lineWidth = Math.max(5, d*.26);
      g.beginPath(); g.moveTo(-d*.8, -d*.8); g.lineTo(d*.8, d*.8);
      g.moveTo(d*.8, -d*.8); g.lineTo(-d*.8, d*.8); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.16)'; g.lineWidth = Math.max(2, d*.10);
      g.beginPath(); g.moveTo(-d*.8, -d*.8); g.lineTo(d*.8, d*.8);
      g.moveTo(d*.8, -d*.8); g.lineTo(-d*.8, d*.8); g.stroke();
      g.beginPath(); g.moveTo(0, -d*.36); g.lineTo(d*.27, 0); g.lineTo(0, d*.36); g.lineTo(-d*.27, 0); g.closePath();
      g.fillStyle = 'rgba(0,0,0,.42)'; g.fill();

    } else {
      g.beginPath(); g.moveTo(0, -d); g.lineTo(d*.74, 0); g.lineTo(0, d); g.lineTo(-d*.74, 0); g.closePath();
      g.fill(); g.stroke();
    }
    g.restore();
    g.restore();
  }

  // ================================================================ PINTAR DORSO
  // «La página de la Crónica.» Una carta boca abajo es una entrada que todavía no
  // se ha escrito: renglones a medias y un borrón fresco donde iría el relato.
  function paintBack(g, b){
    const V = BACKS[b.variant] || BACKS.relato;
    const seed = hash('dorso' + (b.titulo || '') + (b.subtitulo || ''));
    const acc = b.color || V.acc;

    g.fillStyle = C.ink; g.fillRect(0, 0, W, H);

    // ---- la página
    const px = 16, py = 16, pw = W-32, ph = H-32;
    const tex = FRAMES.get('dorso:textura');
    if (tex){
      g.save(); g.beginPath(); g.rect(px, py, pw, ph); g.clip();
      const base = Math.max(pw/tex.width, ph/tex.height);
      g.drawImage(tex, px + (pw - tex.width*base)/2, py + (ph - tex.height*base)/2, tex.width*base, tex.height*base);
      g.restore();
    } else {
      parchment(g, px, py, pw, ph, seed);
    }
    if (V.tinte){ g.fillStyle = V.tinte; g.fillRect(px, py, pw, ph); }

    // Todo lo que no esté centrado se pinta dos veces, la segunda girada media
    // vuelta. El juego coloca cartas boca abajo: un dorso asimétrico delata la
    // orientación y eso es información filtrada.
    const dosVeces = fn => {
      fn();
      g.save();
      g.translate(W/2, H/2); g.rotate(Math.PI); g.translate(-W/2, -H/2);
      fn();
      g.restore();
    };

    // ---- encabezado de la entrada, arriba y cabeza abajo
    dosVeces(() => {
      g.fillStyle = '#1a1409';
      const t = b.titulo || V.titulo;
      const tsz = fitLine(g, t, s => `500 ${s}px "Grenze Gotisch", "IM Fell English SC", serif`, pw-160, 62, 26);
      g.font = `500 ${tsz}px "Grenze Gotisch", "IM Fell English SC", serif`;
      centered(g, t, W/2, 142);

      g.strokeStyle = 'rgba(26,20,9,.45)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(150, 168); g.lineTo(W-150, 168); g.stroke();
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(178, 175); g.lineTo(W-178, 175); g.stroke();

      g.font = 'italic 24px "IM Fell English", serif'; g.fillStyle = 'rgba(26,20,9,.7)';
      centered(g, b.subtitulo || V.sub, W/2, 208);

      // la entrada a medio escribir
      handwriting(g, 84, 252, W-168, 6, seed+31, .5);
    });

    // ---- el borrón, centrado y también simétrico
    dosVeces(() => inkBlot(g, W/2, H/2, 190, seed+91));

    // ---- el sello de lacre
    g.save();
    g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 20; g.shadowOffsetY = 0;
    waxSeal(g, W/2, H/2, 80, acc, seed+13, V.glifo);
    g.restore();

    // ---- bordes. Viñeta suave: el dorso es capa Venta, no capa Relato.
    vignette(g, 0, 0, W, H, .26);
    inkEdge(g, px, py, pw, ph, seed+7, 12);
    g.lineWidth = 2.5; g.strokeStyle = 'rgba(26,20,9,.5)'; g.strokeRect(38, 38, W-76, H-76);
    grain(g, 0, 0, W, H, seed+5, .55);
    foil(g, 0, 0, W, H, 'rect');
  }

  // ================================================================ PINTAR FICHA
  function paintToken(g, t){
    const seed = hash('ficha' + (t.nombre || ''));
    const R = TW/2, cx = R, cy = R;
    g.clearRect(0, 0, TW, TW);

    const round = (t.forma || 'circulo') === 'circulo';
    const path = () => {
      g.beginPath();
      if (round) g.arc(cx, cy, R-14, 0, 7);
      else cut(g, 22, 22, TW-44, TW-44, 34);
    };

    // aro exterior de tinta
    g.save();
    path(); g.fillStyle = C.ink; g.fill();
    g.restore();

    g.save(); path(); g.clip();
    g.fillStyle = t.color || C.gold; g.fillRect(0, 0, TW, TW);
    const gg = g.createLinearGradient(0, 0, 0, TW);
    gg.addColorStop(0, 'rgba(255,255,255,.16)'); gg.addColorStop(.55, 'rgba(0,0,0,0)'); gg.addColorStop(1, 'rgba(0,0,0,.42)');
    g.fillStyle = gg; g.fillRect(0, 0, TW, TW);
    grain(g, 0, 0, TW, TW, seed, 1.4);
    vignette(g, 0, 0, TW, TW, .42);
    g.restore();

    g.save(); path(); g.lineWidth = 22; g.strokeStyle = C.ink; g.stroke(); g.restore();
    g.save();
    g.beginPath();
    if (round) g.arc(cx, cy, R-36, 0, 7); else cut(g, 44, 44, TW-88, TW-88, 26);
    g.lineWidth = 3; g.strokeStyle = 'rgba(231,221,196,.42)'; g.stroke();
    g.restore();

    const showNum = t.valor !== '' && t.valor != null;
    g.fillStyle = C.bone; g.textBaseline = 'middle';
    if (showNum){
      g.font = '800 190px Archivo, sans-serif';
      centered(g, String(t.valor), cx, cy - 18);
    } else {
      g.font = '160px "Archivo", sans-serif';
      centered(g, t.glifo || '◆', cx, cy - 18);
    }
    g.textBaseline = 'alphabetic';

    const nsz = fitLine(g, t.nombre || '', s => `700 ${s}px Archivo, sans-serif`, TW-90, 46, 18);
    g.font = `700 ${nsz}px Archivo, sans-serif`;
    g.fillStyle = 'rgba(231,221,196,.92)';
    centered(g, (t.nombre || '').toUpperCase(), cx, TW - 92);
    if (t.nota){
      const nz = fitLine(g, t.nota, s => `italic ${s}px "IM Fell English", serif`, TW-100, 22, 12);
      g.font = `italic ${nz}px "IM Fell English", serif`;
      g.fillStyle = 'rgba(231,221,196,.55)';
      centered(g, t.nota, cx, TW - 62);
    }
  }

  // ================================================================ render
  function currentData(){
    if (S.mode === 'dorso') return { kind:'dorso', variant:S.backVariant, titulo:$('#btitle').value, subtitulo:$('#bsub').value, pie:$('#bfoot').value, color:$('#bcolor').value, foil:S.foil };
    if (S.mode === 'ficha') return { kind:'ficha', nombre:$('#tname').value, glifo:$('#tglyph').value, valor:$('#tval').value, nota:$('#tnote').value, color:$('#tcolor').value, forma:S.tokenShape || 'circulo' };
    return readCard();
  }

  function paintAny(g, d, img, opts){
    if (d.kind === 'dorso') paintBack(g, d);
    else if (d.kind === 'ficha') paintToken(g, d);
    else paintCard(g, d, img !== undefined ? img : (ART.get(d.arte) || null), opts);
  }

  function sizeOf(d){ return d.kind === 'ficha' ? { w:TW, h:TW } : { w:W, h:H }; }

  function draw(){
    const d = currentData();
    const { w, h } = sizeOf(d);
    if (cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; }
    cv.style.aspectRatio = `${w} / ${h}`;
    cv.classList.toggle('square', d.kind === 'ficha');
    ctx.clearRect(0, 0, w, h);
    // Las guías son solo de pantalla: renderAt() nunca las pasa.
    paintAny(ctx, d, d.kind === 'carta' ? artEl : undefined, { guides: S.guides });
    $('#sheen').style.opacity = S.foil && d.kind !== 'ficha' ? Math.min(.85, S.foilAmt) : 0;
  }

  // Re-pinta a la resolución pedida. Nada de estirar el canvas de pantalla.
  function renderAt(d, scale, img){
    const { w, h } = sizeOf(d);
    const out = document.createElement('canvas');
    out.width = Math.round(w*scale); out.height = Math.round(h*scale);
    const g = out.getContext('2d');
    g.scale(scale, scale);
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    paintAny(g, d, img);
    return out;
  }

  function saveCanvas(canvas, name){
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = name; a.href = url; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  }

  // ================================================================ biblioteca
  const LS_KEY = 'taponazo.taller.biblioteca.v1';
  let LIB = [];

  function libLoad(){
    try { LIB = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { LIB = []; }
    renderLib();
  }
  function libSave(){
    try { localStorage.setItem(LS_KEY, JSON.stringify(LIB)); }
    catch (e){ toast('No se pudo guardar la biblioteca: ' + e.message); }
  }
  function libUpsert(entry){
    const id = entry.id || slug(entry.nombre || entry.titulo || 'sin-nombre');
    entry.id = id;
    const i = LIB.findIndex(x => x.id === id && x.kind === entry.kind);
    if (i >= 0) LIB[i] = entry; else LIB.push(entry);
    libSave(); renderLib();
    return id;
  }

  function libFiltered(){
    const f = $('#libfilter').value;
    const q = slug($('#libsearch').value);
    return LIB.filter(e => (f === 'todo' || e.kind === f) && (!q || slug(e.nombre || e.titulo || '').includes(q)));
  }

  function renderLib(){
    const list = $('#liblist'); list.innerHTML = '';
    const items = libFiltered();
    $('#libcount').textContent = LIB.length ? `${items.length} de ${LIB.length}` : 'vacía';
    $('#libhint').style.display = LIB.length ? 'none' : '';
    items.forEach(e => {
      const row = document.createElement('div');
      row.className = 'librow';
      const tag = e.kind === 'carta' ? (e.tipo || '') : e.kind;
      // El aviso solo tiene sentido una vez hay arte cargado; si no, serían 48 avisos.
      const missing = ART.size > 0 && e.kind === 'carta' && !ART.has(e.arte || slug(e.nombre));
      if (e.kind === S.mode && e.id === S.currentId) row.classList.add('on');
      row.innerHTML =
        `<span class="dot" style="background:${e.kind === 'ficha' ? (e.color||'#888') : (accentOf(e).c || '#888')}"></span>` +
        `<span class="nm">${escapeHtml(e.nombre || e.titulo || '—')}</span>` +
        `<span class="tg">${escapeHtml(tag)}</span>` +
        (missing ? `<span class="warn" title="sin ilustración cargada">!</span>` : '') +
        `<span class="del" title="Quitar">✕</span>`;
      row.onclick = ev => {
        if (ev.target.classList.contains('del')){
          LIB = LIB.filter(x => !(x.id === e.id && x.kind === e.kind));
          libSave(); renderLib(); return;
        }
        loadEntry(e);
      };
      list.appendChild(row);
    });
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

  function loadEntry(e){
    S.currentId = e.id;
    if (e.kind === 'carta'){ setMode('carta'); writeCard(e); }
    else if (e.kind === 'dorso'){
      setMode('dorso');
      S.backVariant = e.variant || 'relato';
      syncChips('#backvariant', 'back', S.backVariant);
      $('#btitle').value = e.titulo||''; $('#bsub').value = e.subtitulo||'';
      $('#bfoot').value = e.pie||''; $('#bcolor').value = e.color||BACKS[S.backVariant].acc;
      draw();
    }
    else { setMode('ficha'); $('#tname').value = e.nombre||''; $('#tglyph').value = e.glifo||''; $('#tval').value = e.valor||''; $('#tnote').value = e.nota||''; $('#tcolor').value = e.color||C.gold; S.tokenShape = e.forma||'circulo'; syncChips('#tshape','shape',S.tokenShape); draw(); }
    renderLib();
  }

  // ================================================================ hoja TTS
  // Tabletop Simulator lee las barajas como una rejilla de máximo 10×7 y textura
  // de 4096 px por lado. Se calcula el tamaño de celda para no pasarse.
  const TTS_MAX = 4096;

  async function exportSheet(kind){
    const cols = Math.max(1, Math.min(10, +$('#sheetcols').value));
    const rows = Math.max(1, Math.min(7,  +$('#sheetrows').value));
    const per  = cols*rows;
    const items = LIB.filter(e => e.kind === kind);
    if (!items.length){ toast('No hay nada de ese tipo en la biblioteca.'); return; }

    const ratio = kind === 'ficha' ? 1 : H/W;
    const cw = Math.floor(Math.min(TTS_MAX/cols, TTS_MAX/(rows*ratio)));
    const ch = Math.floor(cw*ratio);
    const scale = cw / (kind === 'ficha' ? TW : W);

    const sheets = Math.ceil(items.length/per);
    for (let s = 0; s < sheets; s++){
      const slice = items.slice(s*per, (s+1)*per);
      const usedRows = Math.ceil(slice.length/cols);
      const out = document.createElement('canvas');
      out.width = cw*cols; out.height = ch*usedRows;
      const g = out.getContext('2d');
      g.imageSmoothingQuality = 'high';
      slice.forEach((e, i) => {
        const one = renderAt(e, scale, e.kind === 'carta' ? (ART.get(e.arte || slug(e.nombre)) || null) : undefined);
        g.drawImage(one, (i % cols)*cw, Math.floor(i/cols)*ch);
      });
      saveCanvas(out, `taponazo-${kind}-hoja${sheets > 1 ? '-' + (s+1) : ''}-${cols}x${usedRows}.png`);
      await new Promise(r => setTimeout(r, 350)); // el navegador necesita aire entre descargas
    }
    toast(`${items.length} ${kind}(s) en ${sheets} hoja(s) de ${cols}×${rows}.`);
  }

  // ================================================================ UI
  function toast(msg){
    const t = $('#toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('on'), 3200);
  }

  function syncChips(sel, key, val){
    $$(sel + ' .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset[key] === val)));
  }

  function setMode(m){
    S.mode = m;
    syncChips('#mode', 'mode', m);
    $$('.only-carta').forEach(e => e.classList.toggle('hidden', m !== 'carta'));
    $$('.only-dorso').forEach(e => e.classList.toggle('hidden', m !== 'dorso'));
    $$('.only-ficha').forEach(e => e.classList.toggle('hidden', m !== 'ficha'));
    toggleFields();
    draw();
  }

  function toggleFields(){
    const t = $('#type').value;
    const heraldo = t === 'heraldo';
    $('#statgroup').classList.toggle('hidden', !(t === 'creature' || t === 'wall'));
    $('#herogroup').classList.toggle('hidden', t !== 'hero');
    $('#heraldogroup').classList.toggle('hidden', !heraldo);
    $('#sendagroup').classList.toggle('hidden', t !== 'senda');
    $('#tags').closest('label').classList.toggle('hidden', t === 'senda');
    $('#rarityrow').classList.toggle('hidden', t !== 'creature');
    $('#atkwrap').classList.toggle('hidden', t !== 'creature');
    $('#egowrap').classList.toggle('hidden', t !== 'creature');
    // El Heraldo ignora el estilo de marco y no tiene coste ni foil.
    $('#stylegroup').classList.toggle('hidden', heraldo);
    $('#marcogroup').classList.toggle('hidden', heraldo || S.style !== 'marco');
    $('#costwrap').classList.toggle('hidden', heraldo || t === 'senda');
    $$('.lbl-carta').forEach(e => e.classList.toggle('hidden', heraldo));
    $$('.lbl-heraldo').forEach(e => e.classList.toggle('hidden', !heraldo));
  }

  // ---- binds
  // Guías apagadas por defecto: las etiquetas de zonas son herramienta de
  // maquetación, no parte de la carta. Se activan en «Ajuste fino».
  S.rarity = 'legendaria'; S.tokenShape = 'circulo'; S.guides = false; S.backVariant = 'relato';

  ['name','cost','tags','body','flavor','foot','atk','def','ego','fue','agi','men','car','pv',
   'hmast','hregla','hvoz','artslug','type']
    .forEach(id => $('#'+id).addEventListener('input', () => {
      if (id === 'type'){ toggleFields(); loadLayoutFields(); }
      if (id === 'artslug') artEl = ART.get($('#artslug').value) || artEl;
      draw();
    }));
  ['btitle','bsub','bfoot','bcolor','tname','tglyph','tval','tnote','tcolor']
    .forEach(id => $('#'+id).addEventListener('input', draw));

  $('#zoom').oninput   = e => { S.zoom = e.target.value/100; draw(); };
  $('#ox').oninput     = e => { S.ox = +e.target.value; draw(); };
  $('#oy').oninput     = e => { S.oy = +e.target.value; draw(); };
  $('#foil').onchange  = e => { S.foil = e.target.checked; draw(); };
  $('#foilamt').oninput= e => { S.foilAmt = e.target.value/100; draw(); };

  // Ejemplo de pliego: enseña de golpe para qué sirve el Heraldo.
  $('#hejemplo').onclick = () => {
    $('#type').value = 'heraldo';
    $('#name').value  = 'Cae Bornejesto';
    $('#tags').value  = 'Ronda IV · Venta del Camino Viejo';
    $('#hmast').value = 'El Heraldo';
    $('#body').value  =
      'Dicen los que estaban —y todos dicen que estaban— que el Padre de Hierro cruzó el flanco ' +
      'este sin que nadie se lo impidiera, y que allí sigue.\n\n' +
      'La peste se huele ya desde el patio: tres cuerpos en un mismo hueco y nadie con Vigor para ' +
      'limpiarlos.\n\n' +
      'Ansuz alcanzó su segundo tramo antes de tiempo. No quiso explicar por qué, y esta casa no ' +
      'insiste, pero lo cuenta.';
    $('#flavor').value = '«Yo estaba allí y no fue así. Ni de lejos.»';
    $('#hvoz').value   = 'Sosius';
    $('#foot').value   = 'TAPONAZO · El Heraldo · 0.4';
    $('#artslug').value = 'heraldo-cae-bornejesto';
    artEl = ART.get($('#artslug').value) || null;
    toggleFields(); draw();
  };

  $$('#mode .chip').forEach(c => c.onclick = () => setMode(c.dataset.mode));
  $$('#style .chip').forEach(c => c.onclick = () => {
    S.style = c.dataset.style; syncChips('#style','style',S.style);
    if (S.style === 'marco') $('#stylegroup').open = true;   // que se vean sus ajustes
    toggleFields(); loadLayoutFields(); draw();
  });

  // ---- editor de encaje del marco propio
  const LAYOUT_KEYS = ['winX','winY','winW','winH','titleY','tagsY','textX','textW','textY','textH','statsY','footY'];

  function loadLayoutFields(){
    const c = readCard();
    const key = layoutKeyFor(c);
    const L = layoutFor(c);
    $('#layoutkey').textContent = key;
    LAYOUT_KEYS.forEach(k => { $('#'+k).value = L[k]; });
    $('#titleDark').checked = !!L.titleDark;
  }

  function storeLayoutFields(){
    const key = layoutKeyFor(readCard());
    const L = Object.assign({}, LAYOUT_DEF, LAYOUTS[key] || {});
    LAYOUT_KEYS.forEach(k => {
      const v = parseInt($('#'+k).value, 10);
      if (!Number.isNaN(v)) L[k] = v;
    });
    L.titleDark = $('#titleDark').checked ? 1 : 0;
    LAYOUTS[key] = L;
    saveLayouts();
    draw();
  }

  LAYOUT_KEYS.forEach(k => $('#'+k).addEventListener('input', storeLayoutFields));
  $('#guides').onchange = e => { S.guides = e.target.checked; draw(); };
  $('#titleDark').onchange = () => storeLayoutFields();

  function currentFrameEntry(){
    const key = frameKeyFor(readCard());
    if (FRAMES.has(key)) return { key, fr: FRAMES.get(key) };
    if (FRAMES.has('marco:todos')) return { key:'marco:todos', fr: FRAMES.get('marco:todos') };
    return { key, fr: null };
  }

  function applyZones(img){
    const L = detectZones(img);
    if (!L) return null;
    LAYOUT_KEYS.forEach(k => { if (L[k] != null) $('#'+k).value = L[k]; });
    if (L.titleDark != null) $('#titleDark').checked = !!L.titleDark;
    storeLayoutFields();
    return L;
  }

  $('#detectwin').onclick = () => {
    const { fr } = currentFrameEntry();
    if (!fr){ toast('Primero sube el PNG del marco en «Marcos».'); return; }
    const L = applyZones(fr);
    if (!L){ toast('No he sabido leer las zonas de ese marco.'); return; }
    toast(L.winX != null
      ? `Zonas detectadas. Ventana: ${L.winX}, ${L.winY} · ${L.winW}×${L.winH}`
      : 'Paneles detectados, pero no la ventana. Prueba «Quitar fondo».');
  };

  $('#stripbg').onclick = () => {
    const { key, fr } = currentFrameEntry();
    if (!fr){ toast('Primero sube el PNG del marco en «Marcos».'); return; }
    const out = stripBackground(fr);
    if (!out){ toast('No he sabido separar el fondo de ese marco.'); return; }
    // Recortar el margen que acaba de quedar transparente y llevarlo a sangre.
    const t = installFrame(key, out.canvas);
    const pct = Math.round(out.cleared / out.total * 100);
    const L = applyZones(FRAMES.get(key));
    draw();
    const aviso = t && t.stretch > 4 ? ` Estirado un ${t.stretch}%.` : '';
    toast(L && L.winX != null
      ? `Fondo quitado (${pct}%) y marco a sangre.${aviso} Ventana: ${L.winX}, ${L.winY} · ${L.winW}×${L.winH}`
      : `Fondo quitado (${pct}%), pero la ventana no queda cerrada. Colócala a mano.`);
  };
  $('#layoutall').onclick = () => {
    const key = layoutKeyFor(readCard());
    const L = Object.assign({}, LAYOUT_DEF, LAYOUTS[key] || {});
    LAYOUTS = { 'marco:todos': L };
    saveLayouts(); loadLayoutFields(); draw();
    toast('Encaje aplicado a todos los tipos de marco.');
  };
  $('#layoutreset').onclick = () => {
    delete LAYOUTS[layoutKeyFor(readCard())];
    saveLayouts(); loadLayoutFields(); draw();
    toast('Encaje restablecido.');
  };
  $$('#rarity .chip').forEach(c => c.onclick = () => {
    S.rarity = c.dataset.rar; syncChips('#rarity','rar',S.rarity);
    if (S.rarity === 'legendaria'){ $('#foil').checked = true; S.foil = true; }
    loadLayoutFields(); draw();
  });
  $$('#tshape .chip').forEach(c => c.onclick = () => { S.tokenShape = c.dataset.shape; syncChips('#tshape','shape',S.tokenShape); draw(); });

  // Cada variante de dorso trae su emblema, su color y su voz.
  $$('#backvariant .chip').forEach(c => c.onclick = () => {
    S.backVariant = c.dataset.back;
    syncChips('#backvariant', 'back', S.backVariant);
    const p = BACKS[S.backVariant];
    $('#btitle').value = p.titulo;
    $('#bsub').value   = p.sub;
    $('#bcolor').value = p.acc;
    draw();
  });

  // Calidad del PNG como chips (antes era un botón que rotaba: parecía
  // una acción y nadie sabía qué hacía).
  function syncScaleChips(){
    $$('#scalechips button').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.s) === S.scale)));
  }
  $$('#scalechips button').forEach(b => {
    b.onclick = () => {
      S.scale = Number(b.dataset.s);
      syncScaleChips();
      toast(`El PNG se descargará a ${S.scale}× (${W*S.scale}px de ancho).`);
    };
  });

  // ---- ilustración
  const drop = $('#drop'), fileIn = $('#file');
  drop.onclick = () => fileIn.click();
  fileIn.onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    artEl = await fileToImage(f);
    const sl = $('#artslug').value || slug($('#name').value);
    ART.set(sl, artEl); $('#artslug').value = sl;
    draw(); renderLib();
  };
  ['dragover','dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', async e => {
    const f = e.dataTransfer.files[0]; if (!f) return;
    artEl = await fileToImage(f);
    const sl = $('#artslug').value || slug($('#name').value);
    ART.set(sl, artEl); $('#artslug').value = sl;
    draw(); renderLib();
  });

  // ---- carpeta de arte: empareja por nombre de archivo
  $('#artfolder').onchange = async e => {
    const files = Array.from(e.target.files).filter(f => /^image\//.test(f.type));
    let ok = 0;
    for (const f of files){
      const name = f.name.replace(/\.[^.]+$/, '');
      try { ART.set(slug(name), await fileToImage(f)); ok++; } catch {}
    }
    artEl = ART.get($('#artslug').value) || artEl;
    toast(`${ok} ilustración(es) cargadas. Emparejan por nombre de archivo.`);
    draw(); renderLib();
  };

  // ---- marcos
  $('#framefile').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    const key = $('#frametarget').value;
    const t = installFrame(key, await fileToImage(f));
    // Si el PNG trae transparencia de verdad, se encaja solo y no hay más pasos.
    const L = applyZones(FRAMES.get(key));
    draw();
    const aviso = t && t.stretch > 4 ? ` Estirado un ${t.stretch}% para llegar a los bordes.` : '';
    toast(L && L.winX != null
      ? `Marco encajado en «${key}».${aviso}`
      : `Marco cargado en «${key}», sin ventana transparente. Pulsa «Quitar fondo y encajar».`);
  };
  $('#framefolder').onchange = async e => {
    // Empareja por nombre: marco-comun.png, marco-elite.png, marco-hechizo.png, dorso-textura.png…
    const MAP = {
      'marco-comun':'marco:comun', 'marco-elite':'marco:elite', 'marco-legendaria':'marco:legendaria',
      'marco-hechizo':'marco:spell', 'marco-trampa':'marco:trap', 'marco-muro':'marco:wall',
      'marco-arma':'marco:weapon', 'marco-protagonista':'marco:hero', 'marco-todos':'marco:todos',
      'dorso-textura':'dorso:textura',
    };
    let ok = 0;
    for (const f of Array.from(e.target.files)){
      const key = MAP[slug(f.name.replace(/\.[^.]+$/, ''))];
      if (!key) continue;
      try {
        const im = await fileToImage(f);
        if (key === 'dorso:textura') FRAMES.set(key, im);
        else installFrame(key, im);
        ok++;
      } catch {}
    }
    toast(ok ? `${ok} marco(s) cargados.` : 'Ningún archivo con nombre reconocido (marco-comun.png, dorso-textura.png…).');
    draw();
  };

  // ---- descargar
  $('#download').onclick = () => {
    const d = currentData();
    const img = d.kind === 'carta' ? (ART.get(d.arte) || artEl) : undefined;
    const name = slug(d.nombre || d.titulo || 'carta') || 'carta';
    saveCanvas(renderAt(d, S.scale, img), `${d.kind}-${name}-${S.scale}x.png`);
  };

  // ---- guardar: UNA sola acción. Deja copia en el borrador local de la
  // izquierda y, si es una carta con nombre, la publica en la Biblioteca de
  // la web (mismo nombre = se actualiza, no se duplica). El vocabulario de
  // tipos del taller se traduce a la taxonomía de la web; el JSON completo
  // viaja en `data` y se guarda en cards.taller_data.
  const TIPOS_BIBLIOTECA = {
    creature: 'Criatura', spell: 'Hechizo', trap: 'Trampa', wall: 'Muro',
    weapon: 'Arma', hero: 'Protagonista', senda: 'Senda', heraldo: 'Evento',
  };

  $('#save').onclick = async () => {
    const d = currentData();
    libUpsert(d);

    if (d.kind !== 'carta'){
      toast('Guardado en el borrador local (dorsos y fichas no van a la Biblioteca web).');
      return;
    }
    if (!d.nombre){
      toast('Guardado en el borrador local. Ponle nombre para publicarla en la Biblioteca.');
      return;
    }

    const btn = $('#save');
    btn.disabled = true; btn.textContent = '📚 Publicando…';
    try {
      const img = ART.get(d.arte) || artEl;
      const canvas = renderAt(d, 2, img);
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));

      const xsrf = document.cookie.split('; ').find(c => c.startsWith('XSRF-TOKEN='));
      const fd = new FormData();
      fd.append('name', d.nombre);
      fd.append('type', TIPOS_BIBLIOTECA[d.tipo] || 'Criatura');
      fd.append('cost', String(parseInt(d.coste, 10) || 0));
      fd.append('effect', d.texto || '');
      fd.append('flavor_text', d.cita || '');
      fd.append('data', JSON.stringify(d));
      fd.append('image', blob, `${slug(d.nombre)}.png`);

      // La ilustración FUENTE viaja aparte: sin ella, reabrir la carta en el
      // taller la dejaba sin arte (el render final no sirve como fuente).
      if (img && img.width){
        const oc = document.createElement('canvas');
        oc.width = img.naturalWidth || img.width;
        oc.height = img.naturalHeight || img.height;
        oc.getContext('2d').drawImage(img, 0, 0);
        const arte = await new Promise(res => oc.toBlob(res, 'image/png'));
        if (arte) fd.append('art', arte, 'arte.png');
      }

      const res = await fetch('/admin/taller-cards', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-XSRF-TOKEN': xsrf ? decodeURIComponent(xsrf.split('=')[1]) : '',
          'Accept': 'application/json',
        },
        body: fd,
      });

      if (res.status === 201 || res.status === 200){
        const j = await res.json();
        toast(j.updated ? `Guardada: «${j.name}» actualizada en la Biblioteca.` : `Guardada: «${j.name}» creada en la Biblioteca.`);
      } else if (res.status === 401 || res.status === 419 || res.status === 302){
        toast('Guardado el borrador local. Para publicar en la Biblioteca, abre el taller desde el panel web con sesión.');
      } else {
        toast('Guardado el borrador local, pero la Biblioteca respondió ' + res.status + '.');
      }
    } catch (e){
      toast('Guardado el borrador local. Sin conexión con la Biblioteca: ' + e.message);
    } finally {
      btn.disabled = false; btn.textContent = '📚 Guardar en Biblioteca';
    }
  };

  // ---- set base
  $('#loadset').onclick = async () => {
    try {
      const res = await fetch('data/set-base.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      ingestSet(await res.json());
    } catch (err){
      // file:// bloquea fetch en la mayoría de navegadores; se cae al selector de archivo.
      toast('No pude leer data/set-base.json (' + err.message + '). Elígelo a mano.');
      $('#setfile').click();
    }
  };
  $('#setfile').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { ingestSet(JSON.parse(r.result)); } catch (err){ toast('JSON inválido: ' + err.message); } };
    r.readAsText(f);
  };

  function ingestSet(json){
    const pie = json.pie || $('#foot').value;
    let n = 0;
    (json.cartas || []).forEach(c => { libUpsert(Object.assign({ kind:'carta', style:S.style, pie, rareza:c.rareza || 'comun' }, c)); n++; });
    (json.protagonistas || []).forEach(c => { libUpsert(Object.assign({ kind:'carta', style:S.style, pie, tipo:'hero' }, c)); n++; });
    (json.fichas || []).forEach(t => { libUpsert(Object.assign({ kind:'ficha' }, t)); n++; });
    toast(`${n} entradas cargadas en la biblioteca.`);
    renderLib();
  }

  // ---- importar / exportar biblioteca
  $('#libexport').onclick = () => {
    const blob = new Blob([JSON.stringify({ set:'TAPONAZO · biblioteca', entradas:LIB }, null, 2)], { type:'application/json' });
    const a = document.createElement('a');
    a.download = 'taponazo-biblioteca.json'; a.href = URL.createObjectURL(blob); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  $('#libimportbtn').onclick = () => $('#libimport').click();
  $('#libimport').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const j = JSON.parse(r.result);
        const arr = j.entradas || j.cartas || (Array.isArray(j) ? j : []);
        arr.forEach(x => libUpsert(x));
        toast(`${arr.length} entradas importadas.`);
      } catch (err){ toast('JSON inválido: ' + err.message); }
    };
    r.readAsText(f);
  };
  $('#libclear').onclick = () => {
    if (!LIB.length) return;
    if (!confirm(`Vas a borrar las ${LIB.length} entradas de la biblioteca. Esto no se puede deshacer. ¿Sigo?`)) return;
    LIB = []; libSave(); renderLib();
  };
  $('#libfilter').onchange = renderLib;
  $('#libsearch').oninput  = renderLib;

  // ---- exportar rejilla
  $('#sheetcards').onclick  = () => exportSheet('carta');
  $('#sheettokens').onclick = () => exportSheet('ficha');
  // Cada mazo oculto necesita su dorso, así que se exportan todos los guardados.
  $('#sheetback').onclick = async () => {
    const dorsos = LIB.filter(e => e.kind === 'dorso');
    if (!dorsos.length){
      const d = currentData();
      if (d.kind !== 'dorso'){ toast('Ponte en modo Dorso o guarda alguno en la biblioteca.'); return; }
      saveCanvas(renderAt(d, 2, undefined), `taponazo-dorso-${d.variant || 'relato'}-2x.png`);
      return;
    }
    for (const d of dorsos){
      saveCanvas(renderAt(d, 2, undefined), `taponazo-dorso-${d.variant || slug(d.titulo) || 'relato'}-2x.png`);
      await new Promise(r => setTimeout(r, 350));
    }
    toast(`${dorsos.length} dorso(s) exportados.`);
  };

  // ---- prompts
  // Escritos para Gemini: prosa descriptiva en frases completas, no listas de etiquetas.
  // Gemini sabe escribir texto dentro de la imagen, así que hay que prohibírselo a mano.
  const ARTDIR = {
    ddgrift:
      'A grim hand-painted dark fantasy illustration. The world is rendered like a soot-stained woodcut: ' +
      'heavy black ink, brutal chiaroscuro, a desaturated palette of bone, ochre and dried blood, ' +
      'visible brush and hatching texture, and an oppressive gloom that swallows the edges. ' +
      'The character work is deliberately different in register: bold, confident, hand-drawn.',
    dd:
      'A grim hand-painted dark fantasy illustration in the manner of a soot-stained woodcut: heavy black ink, ' +
      'brutal chiaroscuro, a desaturated palette of bone, ochre and dried blood, gaunt elongated anatomy, ' +
      'visible hatching, and an oppressive gloom that swallows the edges.',
    grift:
      'A bold hand-painted character illustration with thick confident outlines, strongly caricatured anatomy, ' +
      'flat but dirty colour, a limited palette of rust ochre and bruised purple, and a printed halftone texture over everything.',
    oil:
      'A dark fantasy oil painting with dramatic side lighting, rich muted colour, thick visible brushwork ' +
      'and deep shadow pooling in the background.',
    woodcut:
      'An antique woodcut engraving: stark high-contrast black linework, dense cross-hatching, ' +
      'a medieval printed look, and a single ochre spot colour over the black.',
  };

  // La cara es lo que aporta Griftlands. Solo aplica a criaturas y protagonistas.
  const FACES =
    'The face is the most important part of the image. Give it strongly caricatured, memorable features: ' +
    'an angular asymmetric skull, a heavy jaw, a pronounced nose, deep-set eyes under a heavy brow, ' +
    'thick decisive outlines, and one single emotion that reads instantly at thumbnail size. ' +
    'Exaggerate the silhouette of the head. Avoid a neutral or generic face.';

  const TYPEWORD = {
    creature: 'a single creature, shown full body',
    spell:    'an arcane spell effect with no figures in it',
    trap:     'a single hidden trap mechanism',
    wall:     'a fortification or barricade',
    weapon:   'a single weapon resting on a plain surface',
    hero:     'a hero portrait, from the chest up, in three-quarter view',
    heraldo:  'a crude chapbook woodcut of the scene described in the headline',
  };

  const NOTEXT =
    'The image must contain no text, no letters, no numbers, no signature, no watermark, ' +
    'no card border and no user interface.';

  // Proporción real del hueco donde va a caer la ilustración con el estilo actual.
  // El encuadre es "cubrir", así que pedir una vertical para una ventana apaisada
  // significa perder la cabeza y los pies del bicho.
  function artWindow(c){
    if (c.style === 'fullbleed') return { w:W, h:H };
    if (c.style === 'marco'){ const L = layoutFor(c); return { w:L.winW, h:L.winH }; }
    if (c.style === 'grafico') return { w:W-60, h:430 };
    return { w:W-72, h:372 };                      // darkest
  }

  const RATIOS = [
    ['1:1', 1], ['5:4', 1.25], ['4:3', 1.333], ['3:2', 1.5], ['16:9', 1.778],
    ['4:5', .8], ['3:4', .75], ['5:7', .714], ['2:3', .667], ['9:16', .5625],
  ];
  function aspectPhrase(win){
    const r = win.w / win.h;
    const best = RATIOS.reduce((a, b) => Math.abs(b[1]-r) < Math.abs(a[1]-r) ? b : a);
    return `${r >= 1 ? 'horizontal' : 'vertical'}, ${best[0]} aspect ratio`;
  }

  function showPrompt(p){
    const box = $('#promptout'); box.value = p;
    box.classList.remove('hidden'); $('#promptactions').classList.remove('hidden');
  }

  $('#genprompt').onclick = () => {
    const c = readCard();

    // El grabado del Heraldo es apaisado y de imprenta barata: pide otra cosa.
    if (c.tipo === 'heraldo'){
      showPrompt(
        `Illustrate a crude chapbook woodcut for a broadside ballad sold in a Spanish roadside inn. ` +
        `The scene it depicts: ${c.nombre}. ${c.etiquetas}.\n\n` +
        `Style: ${ARTDIR.woodcut} This is deliberately cheap printing — the block is worn, the lines are ` +
        `coarse and a little clumsy, the register is slightly off, and the ink has bled into rough paper. ` +
        `Naive proportions are welcome: this was cut in a hurry by a jobbing printer, not by a master.\n\n` +
        `Composition: horizontal, roughly 2:1 aspect ratio, one simple scene that reads at a glance, ` +
        `flat and frontal like a medieval print, on plain cream paper with no framing border.\n\n` +
        NOTEXT
      );
      return;
    }

    const face = (c.tipo === 'creature' || c.tipo === 'hero') ? ' ' + FACES : '';
    const win = artWindow(c);
    showPrompt(
      `Illustrate ${TYPEWORD[c.tipo]}, for a dark fantasy card game: ${c.nombre}. ${c.etiquetas}.\n\n` +
      `Style: ${ARTDIR[$('#artdir').value]}${face}\n\n` +
      `Composition: ${aspectPhrase(win)}. A single subject, centred, with generous empty ` +
      `space around it so that nothing important touches the edges. The background is a plain atmospheric void ` +
      `that fades to near black at the corners — no scenery and no props.\n\n` +
      `Lighting: one hard light source from above and to one side, deep shadows, strong contrast.\n\n` +
      NOTEXT
    );
  };

  $('#genframeprompt').onclick = () => {
    const target = $('#frametarget').value.replace('marco:', '');
    const wx = Math.round(FRAME_WINDOW.x/W*100), wy = Math.round(FRAME_WINDOW.y/H*100);
    const ww = Math.round(FRAME_WINDOW.w/W*100), wh = Math.round(FRAME_WINDOW.h/H*100);
    showPrompt(
      `Design the decorative FRAME of a trading card for a dark fantasy game — the border ornament only, ` +
      `with an empty hole where the artwork will later be placed. This is the "${target}" tier.\n\n` +
      `Style: ${ARTDIR.dd} The border itself is carved and weathered: heavy black ink edges, bone-and-ochre ` +
      `parchment worn thin at the corners, angular cut corners, and small gothic filigree. Matte, never glossy.\n\n` +
      `Layout: a vertical rectangle in 5:7 proportions — a standard 2.5 by 3.5 inch playing card, ` +
      `not 2:3. The ornament must reach all four edges of the image, with no empty margin around it. ` +
      `Everything that is not border ornament must be fully transparent. ` +
      `Leave a clean rectangular hole for the artwork starting about ${wx}% from the left and ${wy}% from the top, ` +
      `about ${ww}% of the width and ${wh}% of the height. Keep the top eighth of the card as a plain title band ` +
      `with an uncluttered roundel-sized area in each of its two upper corners, and leave a flat unornamented ` +
      `panel across the lower third where the rules text will be printed.\n\n` +
      `Deliver a PNG with a genuinely transparent background. The image must contain no text, no letters, ` +
      `no numbers, no logo and no character artwork — decorated border only.`
    );
  };

  // El dorso es capa Venta, no capa Relato: aquí el tono es socarrón, y el papel
  // tiene que quedar legible y cálido, no una mancha negra.
  const BACK_PROMPT = {
    relato: {
      que: 'the deck the players draw their tales from',
      centro: 'a deep red wax seal stamped with a plain diamond, pressed over a blot of spilled ink',
      orla: 'quill strokes, small diamonds and tally scratches, like the illumination around a capital ' +
            'letter in a monastic chronicle — the same motif repeated many times over, because this is ' +
            'one story told in many versions',
      color: 'warm bone and ochre paper with oxblood red as the single accent',
    },
    evento: {
      que: 'the shared deck of news that the tavern crier reads out each round',
      centro: 'a bronze wax seal stamped with a many-pointed starburst, like sound going out in all directions',
      orla: 'printer\'s fleurons, pointing hands, little bells and rows of type ornaments, arranged like the ' +
            'border of a cheap broadside ballad sold at an inn door — crooked, over-inked and enthusiastic',
      color: 'warm cream paper with tarnished gold and ochre as the accents',
    },
    senda: {
      que: 'the hidden path each hero keeps face down behind them',
      centro: 'a dark green wax seal stamped with a crossroads: two roads crossing, a small diamond at the meeting point',
      orla: 'winding roads, milestones, thorns and forking branches that knot into each other',
      color: 'pale bone paper with moss green and old brass as the accents',
    },
  };

  $('#genbackprompt').onclick = () => {
    const v = S.backVariant || 'relato';
    const B = BACK_PROMPT[v];
    showPrompt(
      `Design the BACK of a playing card for TAPONAZO, a game in which rival narrators argue in a roadside ` +
      `inn over how a story really happened. This particular back covers ${B.que}.\n\n` +
      `It will be seen hundreds of times per game, so it has to work as a dense emblem, and it must look ` +
      `exactly the same when the card is turned upside down.\n\n` +
      `Build it in this order of importance:\n` +
      `1. An ornate inked border that reaches all four edges of the image, with no empty margin anywhere.\n` +
      `2. A large central medallion holding ${B.centro}.\n` +
      `3. Around that medallion, a radial rosette of ${B.orla}.\n` +
      `4. The ground behind everything is aged, stained, well-handled paper. No large areas of blank paper, ` +
      `but no large areas of solid black either.\n\n` +
      `Style: hand-drawn dark fantasy with heavy black ink and visible hatching, like a soot-stained woodcut. ` +
      `Important: the palette is ${B.color} — this is warm, readable and a little wry, not a black and gloomy ` +
      `image. The game is grim inside the story but this is the tavern that frames it, so the emblem can ` +
      `carry a wink: slightly lopsided, over-decorated, made by someone enjoying themselves. ` +
      `Matte, never glossy.\n\n` +
      `Format: vertical, 5:7 proportions — a standard 2.5 by 3.5 inch playing card, not 2:3. Full bleed, ` +
      `paper grain, only a light vignette in the corners. Rotationally symmetrical: turning the card upside ` +
      `down must produce an identical image.\n\n` +
      `The image must contain no text, no letters, no numbers and no logo.`
    );
  };
  $('#copyprompt').onclick = async () => {
    const b = $('#promptout');
    try { await navigator.clipboard.writeText(b.value); }
    catch { b.select(); document.execCommand('copy'); }
    $('#copyprompt').textContent = '¡Copiado!';
    setTimeout(() => $('#copyprompt').textContent = 'Copiar', 1200);
  };

  // ---- arranque
  setMode('carta');
  syncChips('#style', 'style', S.style);
  syncChips('#rarity', 'rar', S.rarity);
  syncChips('#tshape', 'shape', S.tokenShape);
  syncScaleChips();
  loadLayoutFields();
  libLoad();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  draw();

  // ---- carta de la Biblioteca (?card=ID): al abrir el taller desde una
  // carta de la web, se carga aquí tal cual para seguir editándola.
  (async function cartaDesdeBiblioteca(){
    const id = new URLSearchParams(location.search).get('card');
    if (!id) return;
    try {
      const res = await fetch(`/admin/taller-cards/${encodeURIComponent(id)}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok){ toast('No pude cargar la carta #' + id + ' (' + res.status + ').'); return; }
      const j = await res.json();
      if (j.data){
        setMode(j.data.kind || 'carta');
        writeCard(j.data);
        // La ilustración fuente vuelve con la carta
        if (j.art_url){
          const im = new Image();
          im.onload = () => {
            artEl = im;
            if (j.data.arte) ART.set(j.data.arte, im);
            draw();
          };
          im.src = j.art_url;
        }
        draw();
        toast(`«${j.name}» cargada desde la Biblioteca. Al guardar, se actualizará.`);
      }
    } catch (e){
      toast('No pude cargar la carta: ' + e.message);
    }
  })();

  // ---- marco por defecto: images/marco.png se instala solo al arrancar y
  // el estilo pasa a 'marco'. Decisión de diseño de Iván: la carta nace con
  // su marco ilustrado, no con el procedural. Si el fichero no está (p. ej.
  // la versión file:// sin la imagen), todo sigue como antes.
  (function marcoPorDefecto(){
    const im = new Image();
    im.onload = () => {
      let lienzo = im;
      const out = stripBackground(im);   // el PNG puede traer el damero pintado
      if (out) lienzo = out.canvas;
      installFrame('marco:todos', lienzo);
      // Autodetectar zonas SOLO la primera vez: si ya hay un encaje guardado,
      // respetarlo — antes se machacaba el ajuste fino en cada recarga.
      if (!LAYOUTS['marco:todos']){
        applyZones(FRAMES.get('marco:todos'));
      } else {
        loadLayoutFields();
      }
      if (S.style === 'darkest'){        // no pisar una elección manual previa
        S.style = 'marco';
        syncChips('#style', 'style', 'marco');
      }
      draw();
    };
    im.onerror = () => {};
    im.src = 'images/marco.png';
  })();
})();
