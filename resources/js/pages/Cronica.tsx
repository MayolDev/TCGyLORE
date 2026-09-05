import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface Vinculo {
    tipo: string;
    nombre: string;
}

interface Pagina {
    tipo: 'portada' | 'portadilla' | 'personaje' | 'lugar' | 'texto' | 'colofon';
    titulo?: string | null;
    subtitulo?: string;
    pie?: string;
    etiqueta?: string | null;
    epiteto?: string | null;
    imagen?: string | null;
    faccion?: string | null;
    lugares?: string[];
    vinculos?: Vinculo[];
    texto?: string;
    cabecera?: string;
    continua?: boolean;
}

interface EntradaIndice {
    titulo: string;
    pagina: number;
    sangria?: boolean;
}

/** Proporción de una hoja: alto respecto al ancho. Un libro real, no un folio. */
const PROPORCION = 1.42;
/** Lo que tarda en caer la hoja. Más y cansa; menos y no se ve el gesto. */
const MS_GIRO = 620;

function Filigrana() {
    return <div className="my-3 text-center text-[#8a6a3f]/50 select-none">❦</div>;
}

/** Capitular: la primera letra del texto, grande, como en un libro antiguo. */
function conCapitular(texto: string) {
    return texto.replace(/^([A-ZÁÉÍÓÚÑ«"¿¡])/, (letra) => `<span class="capitular">${letra}</span>`);
}

export default function Cronica({
    paginas,
    indice,
    mundo,
    fondo,
}: {
    paginas: Pagina[];
    indice: EntradaIndice[];
    mundo: string;
    fondo: string | null;
}) {
    const inicial = () => {
        if (typeof window === 'undefined') return 0;
        const p = Number(new URLSearchParams(window.location.search).get('p'));
        return Number.isFinite(p) && p > 0 ? Math.min(p - 1, paginas.length - 1) : 0;
    };

    const [n, setN] = useState(inicial);
    const [indiceAbierto, setIndiceAbierto] = useState(false);
    const [doble, setDoble] = useState(false);
    const [medida, setMedida] = useState({ ancho: 380, alto: 540 });

    // La hoja que está cayendo: mientras dura, el libro no acepta más pasos.
    const [giro, setGiro] = useState<{ hacia: 'adelante' | 'atras'; desde: number } | null>(null);
    const temporizador = useRef<number | null>(null);

    /**
     * Todas las hojas miden exactamente lo mismo, siempre. El tamaño sale del
     * hueco disponible, no del contenido: si dependiera del texto, una página
     * con dos párrafos sería más corta que otra con seis y el libro cambiaría
     * de tamaño al pasar hoja.
     */
    useEffect(() => {
        const medir = () => {
            const anchoVentana = window.innerWidth;
            const altoVentana = window.innerHeight;
            const aDoble = anchoVentana >= 1100;

            // Hueco real, descontando barra, pie y márgenes.
            const altoLibre = Math.max(360, altoVentana - 150);
            const anchoLibre = Math.max(300, anchoVentana - 48);

            let alto = Math.min(altoLibre, 860);
            let ancho = alto / PROPORCION;

            const anchoTotal = aDoble ? ancho * 2 : ancho;
            if (anchoTotal > anchoLibre) {
                ancho = aDoble ? anchoLibre / 2 : anchoLibre;
                alto = ancho * PROPORCION;
            }

            setDoble(aDoble);
            setMedida({ ancho: Math.floor(ancho), alto: Math.floor(alto) });
        };

        medir();
        window.addEventListener('resize', medir);
        return () => window.removeEventListener('resize', medir);
    }, []);

    const salto = doble ? 2 : 1;

    const fijarUrl = useCallback((destino: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('p', String(destino + 1));
        window.history.replaceState({}, '', url);
    }, []);

    /** Salto directo, sin animación: el índice no pasa hojas de una en una. */
    const ir = useCallback(
        (destino: number) => {
            const limpio = Math.max(0, Math.min(destino, paginas.length - 1));
            setGiro(null);
            setN(limpio);
            fijarUrl(limpio);
        },
        [paginas.length, fijarUrl],
    );

    const pasar = useCallback(
        (hacia: 'adelante' | 'atras') => {
            if (giro) return;

            const destino = hacia === 'adelante' ? n + salto : n - salto;
            if (destino < 0 || destino > paginas.length - 1) return;

            setGiro({ hacia, desde: n });
            temporizador.current = window.setTimeout(() => {
                setN(destino);
                fijarUrl(destino);
                setGiro(null);
            }, MS_GIRO);
        },
        [giro, n, salto, paginas.length, fijarUrl],
    );

    useEffect(() => () => {
        if (temporizador.current) window.clearTimeout(temporizador.current);
    }, []);

    useEffect(() => {
        const tecla = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                pasar('adelante');
            }
            if (e.key === 'ArrowLeft') pasar('atras');
            if (e.key === 'Home') ir(0);
            if (e.key === 'End') ir(paginas.length - 1);
            if (e.key === 'Escape') setIndiceAbierto(false);
        };
        window.addEventListener('keydown', tecla);
        return () => window.removeEventListener('keydown', tecla);
    }, [pasar, ir, paginas.length]);

    // Pasar hoja con el dedo.
    const tacto = useRef<number | null>(null);
    const alTocar = (e: React.TouchEvent) => {
        tacto.current = e.changedTouches[0].clientX;
    };
    const alSoltar = (e: React.TouchEvent) => {
        if (tacto.current === null) return;
        const d = e.changedTouches[0].clientX - tacto.current;
        if (Math.abs(d) > 55) pasar(d < 0 ? 'adelante' : 'atras');
        tacto.current = null;
    };

    const capitulo = useMemo(() => {
        let actual = '';
        for (const e of indice) {
            if (e.pagina <= n) actual = e.titulo;
            else break;
        }
        return actual;
    }, [indice, n]);

    // ── Qué se ve mientras cae la hoja ────────────────────────────────────
    // Debajo ya está el destino; encima cae la hoja que estás pasando, con la
    // página que dejas por delante y la que llega por detrás. Se trabaja con
    // indices para que el numero al pie sea siempre el de su propia página.
    const destino = giro ? (giro.hacia === 'adelante' ? n + salto : n - salto) : n;
    const adelante = giro?.hacia === 'adelante';

    // Las dos que no se mueven durante el giro.
    const iFija = doble ? (adelante ? n : destino) : destino;
    const dFija = doble ? (giro && !adelante ? n + 1 : destino + 1) : -1;

    // Las dos caras de la hoja: la que abandonas y la que aparece.
    const iDelante = doble ? (adelante ? n + 1 : n) : n;
    const iDetras = doble ? (adelante ? destino : destino + 1) : destino;

    const estilosHoja = { width: medida.ancho, height: medida.alto };

    return (
        <>
            <Head title={`Crónica de ${mundo}`}>
                <meta
                    name="description"
                    content={`La crónica completa de ${mundo}: sus reinos, sus ventas y quienes los caminaron.`}
                />
            </Head>

            <style>{`
                .cronica { --tinta:#2b1d10; --tinta-suave:#5a452c; --oro:#8a6a3f; --pergamino:#efe2c6; }

                /* ── La taberna ────────────────────────────────────────────
                   Tablones de madera oscura, el candil justo encima del libro
                   y la sala apagandose hacia los bordes. Todo dibujado: la
                   Cronica tiene que abrir aunque no cargue ninguna imagen. */
                .taberna {
                    position: fixed; inset: 0; z-index: -2;
                    background-color: #24160c;
                    background-image:
                        repeating-linear-gradient(
                            180deg,
                            rgba(0,0,0,.34) 0px, rgba(0,0,0,.34) 2px,
                            rgba(92,58,28,.10) 2px, rgba(92,58,28,.10) 74px,
                            rgba(0,0,0,.22) 74px, rgba(0,0,0,.22) 78px,
                            rgba(74,46,22,.14) 78px, rgba(74,46,22,.14) 150px
                        ),
                        repeating-linear-gradient(
                            97deg,
                            rgba(255,220,160,.030) 0px, rgba(255,220,160,.030) 3px,
                            transparent 3px, transparent 11px
                        );
                }
                /* Luz del candil: cae desde arriba sobre la mesa. */
                .candil {
                    position: fixed; inset: 0; z-index: -1; pointer-events: none;
                    background:
                        radial-gradient(60% 46% at 50% 8%, rgba(255,196,110,.30), transparent 70%),
                        radial-gradient(78% 62% at 50% 42%, rgba(255,178,92,.17), transparent 72%),
                        radial-gradient(120% 120% at 50% 55%, transparent 38%, rgba(0,0,0,.62) 82%, rgba(0,0,0,.85) 100%);
                    animation: candil 6.5s ease-in-out infinite;
                }
                /* El candil no está quieto: parpadea despacio. */
                @keyframes candil { 0%,100% { opacity:.92 } 45% { opacity:1 } 70% { opacity:.95 } }

                .taberna-foto {
                    position: fixed; inset: 0; z-index: -2;
                    background-size: cover; background-position: center;
                    filter: brightness(.42) saturate(.8);
                }

                /* ── El libro ─────────────────────────────────────────────── */
                .libro { perspective: 2200px; }
                .hoja {
                    background-color: var(--pergamino);
                    background-image:
                        radial-gradient(ellipse at 12% 18%, rgba(150,116,64,.16), transparent 55%),
                        radial-gradient(ellipse at 85% 75%, rgba(120,88,44,.14), transparent 50%),
                        radial-gradient(circle at 60% 40%, rgba(255,255,255,.5), transparent 60%);
                    overflow: hidden;
                }
                .hoja-izq { box-shadow: inset -28px 0 44px -26px rgba(70,45,18,.6), inset 0 0 70px rgba(120,88,44,.2); }
                .hoja-der { box-shadow: inset  28px 0 44px -26px rgba(70,45,18,.6), inset 0 0 70px rgba(120,88,44,.2); }
                .libro-sombra { box-shadow: 0 34px 70px rgba(0,0,0,.72), 0 6px 18px rgba(0,0,0,.5); }

                /* ── El giro ──────────────────────────────────────────────── */
                .giro { transform-style: preserve-3d; transition: transform ${MS_GIRO}ms cubic-bezier(.42,.02,.36,1); }
                .giro-adelante { transform-origin: left center;  transform: rotateY(-180deg); }
                .giro-atras    { transform-origin: right center; transform: rotateY(180deg); }
                .cara { position: absolute; inset: 0; backface-visibility: hidden; }
                .cara-reverso { transform: rotateY(180deg); }
                /* Sombra que barre la hoja mientras cae. */
                .velo { position:absolute; inset:0; pointer-events:none; background:linear-gradient(90deg, rgba(0,0,0,.32), transparent 55%); animation: velo ${MS_GIRO}ms ease-out forwards; }
                @keyframes velo { 0% { opacity:0 } 40% { opacity:1 } 100% { opacity:0 } }

                /* ── Tipografía ───────────────────────────────────────────── */
                .prosa { color: var(--tinta); line-height: 1.8; text-align: justify; hyphens: auto; }
                .prosa p { margin: 0 0 .8rem; }
                .prosa em { color: var(--tinta-suave); }
                .prosa strong { color: #4a2f12; }
                .prosa h1, .prosa h2, .prosa h3 {
                    font-family: Cinzel, Georgia, serif; color:#4a2f12; text-align:center;
                    letter-spacing:.04em; margin:.9rem 0 .6rem; font-size:1em; text-transform:uppercase;
                }
                .prosa blockquote { margin:.8rem 0; padding-left:.9rem; border-left:3px solid rgba(138,106,63,.45); font-style:italic; color:var(--tinta-suave); }
                .prosa img { max-width:100%; border-radius:3px; }
                .prosa table { width:100%; font-size:.85em; }
                .prosa code { font-size:.85em; background:rgba(138,106,63,.12); padding:0 .25em; }
                .prosa pre { font-size:.72em; overflow:hidden; background:rgba(138,106,63,.1); padding:.5rem; }
                .capitular { float:left; font-family:Cinzel, Georgia, serif; font-size:3.1em; line-height:.82; padding:.1em .1em 0 0; color:#7a4f1c; }

                @media print { .no-imprimir { display:none !important } }
            `}</style>

            {fondo ? (
                <div className="taberna-foto" style={{ backgroundImage: `url(${fondo})` }} />
            ) : (
                <div className="taberna" />
            )}
            <div className="candil" />

            <div className="cronica min-h-screen px-3 py-4 sm:px-6" onTouchStart={alTocar} onTouchEnd={alSoltar}>
                {/* Barra */}
                <div className="no-imprimir mx-auto mb-3 flex max-w-6xl flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => setIndiceAbierto((v) => !v)}
                        className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/85 px-3 py-1.5 text-sm font-semibold text-[#e6d3a8] hover:bg-[#2a1a0c]"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {indiceAbierto ? 'Cerrar el índice' : 'Índice'}
                    </button>

                    <p
                        className="text-xs tracking-widest text-[#c9ae7c]/70 uppercase"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {capitulo || 'Crónica'}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => pasar('atras')}
                            disabled={n === 0}
                            className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/85 px-3 py-1.5 text-sm text-[#e6d3a8] disabled:opacity-30"
                        >
                            ‹
                        </button>
                        <span className="min-w-24 text-center text-xs text-[#c9ae7c]/70">
                            {n + 1} / {paginas.length}
                        </span>
                        <button
                            type="button"
                            onClick={() => pasar('adelante')}
                            disabled={n >= paginas.length - 1}
                            className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/85 px-3 py-1.5 text-sm text-[#e6d3a8] disabled:opacity-30"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Índice */}
                {indiceAbierto && (
                    <div className="no-imprimir mx-auto mb-4 max-w-6xl rounded border border-[#8a6a3f]/40 bg-[#1a1007]/95 p-4">
                        <div className="grid max-h-[52vh] grid-cols-2 gap-x-6 gap-y-1 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
                            {indice.map((e) => (
                                <button
                                    key={`${e.titulo}-${e.pagina}`}
                                    type="button"
                                    onClick={() => {
                                        ir(e.pagina);
                                        setIndiceAbierto(false);
                                    }}
                                    className={`truncate text-left text-sm hover:text-[#f3e2b8] ${
                                        e.sangria ? 'pl-3 text-[#c9ae7c]/80' : 'font-bold text-[#e6d3a8]'
                                    }`}
                                    style={e.sangria ? undefined : { fontFamily: 'Cinzel, serif' }}
                                >
                                    {e.titulo}
                                    <span className="ml-1 text-[#8a6a3f]/60">·{e.pagina + 1}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* El libro */}
                <div className="libro flex justify-center">
                    <div
                        className="libro-sombra relative flex"
                        style={{ width: doble ? medida.ancho * 2 : medida.ancho, height: medida.alto }}
                    >
                        {doble ? (
                            <>
                                <Hoja pagina={paginas[iFija]} lado="izq" numero={iFija + 1} estilos={estilosHoja} />
                                <Hoja pagina={paginas[dFija]} lado="der" numero={dFija + 1} estilos={estilosHoja} />
                            </>
                        ) : (
                            <Hoja pagina={paginas[destino]} lado={null} numero={destino + 1} estilos={estilosHoja} />
                        )}

                        {/* La hoja que cae */}
                        {giro && (
                            <div
                                className={`giro absolute top-0 ${giro.hacia === 'adelante' ? 'giro-adelante' : 'giro-atras'}`}
                                style={{
                                    ...estilosHoja,
                                    left: doble && adelante ? medida.ancho : 0,
                                    zIndex: 20,
                                }}
                            >
                                <div className="cara">
                                    <Hoja
                                        pagina={paginas[iDelante]}
                                        lado={doble ? (adelante ? 'der' : 'izq') : null}
                                        numero={iDelante + 1}
                                        estilos={estilosHoja}
                                    />
                                    <div className="velo" />
                                </div>
                                <div className="cara cara-reverso">
                                    <Hoja
                                        pagina={paginas[iDetras]}
                                        lado={doble ? (adelante ? 'izq' : 'der') : null}
                                        numero={iDetras + 1}
                                        estilos={estilosHoja}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="no-imprimir mx-auto mt-3 flex max-w-6xl justify-between text-xs text-[#8a6a3f]/70">
                    <button type="button" onClick={() => pasar('atras')} className="px-2 hover:text-[#c9ae7c]">
                        ← anterior
                    </button>
                    <button type="button" onClick={() => pasar('adelante')} className="px-2 hover:text-[#c9ae7c]">
                        siguiente →
                    </button>
                </div>
            </div>
        </>
    );
}

/**
 * Una hoja. Mide siempre lo mismo y no se estira: si el texto no cupiese, se
 * encoge la letra hasta que quepa, que es preferible a una pagina mas larga
 * que las demas o a un texto cortado por la mitad.
 */
function Hoja({
    pagina,
    lado,
    numero,
    estilos,
}: {
    pagina: Pagina | undefined | null;
    lado: 'izq' | 'der' | null;
    numero: number;
    estilos: { width: number; height: number };
}) {
    const caja = useRef<HTMLDivElement>(null);

    // El tamaño de letra lo escribe este efecto directamente en el nodo, no un
    // atributo style: si estuviera en las props, React lo devolveria a 1rem en
    // cada repintado y el ajuste se perderia.
    useLayoutEffect(() => {
        const el = caja.current;
        if (!el) return;

        let e = 1;
        el.style.fontSize = '1rem';

        // Encoge de a poco hasta que entre. Con las paginas repartidas por
        // palabras casi nunca hace falta; esto es la red de seguridad para que
        // ninguna hoja crezca ni corte el texto.
        while (el.scrollHeight > el.clientHeight + 1 && e > 0.74) {
            e -= 0.04;
            el.style.fontSize = `${e}rem`;
        }
    }, [pagina, estilos.width, estilos.height]);

    const clase = `hoja ${lado === 'izq' ? 'hoja-izq' : lado === 'der' ? 'hoja-der' : ''} relative flex flex-col px-6 py-7 sm:px-9 sm:py-9`;

    if (!pagina) {
        return <div className={`hoja ${lado === 'der' ? 'hoja-der' : 'hoja-izq'} opacity-40`} style={estilos} />;
    }

    if (pagina.tipo === 'portada') {
        return (
            <div className={`${clase} items-center justify-center text-center`} style={estilos}>
                <p className="mb-3 text-xs tracking-[0.35em] text-[#8a6a3f] uppercase">Crónica de</p>
                <h1 className="text-4xl leading-tight font-black text-[#4a2f12]" style={{ fontFamily: 'Cinzel, serif' }}>
                    {pagina.titulo}
                </h1>
                <Filigrana />
                <p className="text-sm text-[#5a452c] italic">{pagina.subtitulo}</p>
                <p className="mt-8 text-xs tracking-widest text-[#8a6a3f]/80 uppercase">{pagina.pie}</p>
            </div>
        );
    }

    if (pagina.tipo === 'portadilla' || pagina.tipo === 'colofon') {
        return (
            <div className={`${clase} items-center justify-center text-center`} style={estilos}>
                <Filigrana />
                <h2 className="text-3xl font-black text-[#4a2f12]" style={{ fontFamily: 'Cinzel, serif' }}>
                    {pagina.titulo}
                </h2>
                <Filigrana />
                <p className="max-w-sm text-sm leading-relaxed text-[#5a452c] italic">{pagina.texto}</p>
                <NumeroHoja n={numero} />
            </div>
        );
    }

    if (pagina.tipo === 'personaje') {
        return (
            <div className={clase} style={estilos}>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {pagina.imagen && (
                        <div className="mx-auto mb-3 max-h-[42%] overflow-hidden rounded-sm border-4 border-[#8a6a3f]/40 shadow-[0_10px_28px_rgba(60,40,15,.4)]">
                            <img src={pagina.imagen} alt={pagina.titulo ?? ''} className="h-full w-auto object-contain" loading="lazy" />
                        </div>
                    )}

                    <h2 className="text-center text-2xl leading-tight font-black text-[#4a2f12]" style={{ fontFamily: 'Cinzel, serif' }}>
                        {pagina.titulo}
                    </h2>
                    {pagina.epiteto && <p className="mt-1 text-center text-sm text-[#5a452c] italic">{pagina.epiteto}</p>}
                    {pagina.faccion && (
                        <p className="mt-1 text-center text-[11px] tracking-widest text-[#8a6a3f] uppercase">{pagina.faccion}</p>
                    )}

                    <Filigrana />

                    {!!pagina.vinculos?.length && (
                        <div className="min-h-0 flex-1 overflow-hidden">
                            <p className="mb-1.5 text-center text-[11px] tracking-widest text-[#8a6a3f] uppercase">
                                De quién se rodeó
                            </p>
                            <ul className="mx-auto max-w-sm space-y-0.5 text-[13px] text-[#3d2a15]">
                                {pagina.vinculos.map((v, i) => (
                                    <li key={i} className="flex justify-between gap-3">
                                        <span className="shrink-0 text-[#5a452c] italic">{v.tipo}</span>
                                        <span className="flex-1 border-b border-dotted border-[#8a6a3f]/40" />
                                        <span className="shrink-0 font-semibold">{v.nombre}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!!pagina.lugares?.length && (
                        <p className="mt-2 text-center text-[11px] text-[#5a452c]">
                            <span className="tracking-widest uppercase">Se le vio en</span>
                            <br />
                            {pagina.lugares.join(' · ')}
                        </p>
                    )}
                </div>

                <NumeroHoja n={numero} />
            </div>
        );
    }

    const primeraDelCapitulo = !pagina.continua;

    return (
        <div className={clase} style={estilos}>
            {pagina.cabecera && (
                <p className="mb-3 shrink-0 text-center text-[11px] tracking-[0.3em] text-[#8a6a3f]/70 uppercase">
                    {pagina.cabecera}
                </p>
            )}

            {pagina.titulo && (
                <div className="shrink-0">
                    <h2 className="text-center text-2xl font-black text-[#4a2f12]" style={{ fontFamily: 'Cinzel, serif' }}>
                        {pagina.titulo}
                    </h2>
                    {pagina.etiqueta && (
                        <p className="mt-1 text-center text-[11px] tracking-widest text-[#8a6a3f] uppercase">{pagina.etiqueta}</p>
                    )}
                    <Filigrana />
                </div>
            )}

            {pagina.imagen && (
                <div className="mb-3 max-h-[38%] shrink-0 overflow-hidden rounded-sm border-2 border-[#8a6a3f]/40">
                    <img src={pagina.imagen} alt={pagina.titulo ?? ''} className="w-full object-cover" loading="lazy" />
                </div>
            )}

            <div ref={caja} className="prosa min-h-0 flex-1 overflow-hidden">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {primeraDelCapitulo && pagina.texto ? conCapitular(pagina.texto) : (pagina.texto ?? '')}
                </ReactMarkdown>
            </div>

            <NumeroHoja n={numero} />
        </div>
    );
}

function NumeroHoja({ n }: { n: number }) {
    return <p className="mt-3 shrink-0 text-center text-xs text-[#8a6a3f]/70">— {n} —</p>;
}
