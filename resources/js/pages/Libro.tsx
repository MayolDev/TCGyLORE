import { Head, router } from '@inertiajs/react';
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
    palabras?: number;
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

export default function Libro({
    paginas,
    indice,
    titulo,
    rotulo,
    fondo,
    musica,
    hermano,
    wpp,
}: {
    paginas: Pagina[];
    indice: EntradaIndice[];
    titulo: string;
    /** Lo que se lee en la barra cuando no hay capítulo. */
    rotulo: string;
    fondo: string | null;
    musica: string | null;
    /** El otro libro, para saltar de uno a otro. */
    hermano: { titulo: string; url: string } | null;
    /** Palabras por hoja con las que el servidor ha repartido este libro. */
    wpp: number;
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

    // ── La musica ─────────────────────────────────────────────────────────
    // Arranca callada siempre: el navegador bloquea el sonido automatico y,
    // aunque no lo hiciera, meterle musica a alguien sin avisar es de mal
    // gusto. La eleccion se recuerda entre visitas.
    const audio = useRef<HTMLAudioElement | null>(null);
    const [suena, setSuena] = useState(false);

    const alternarMusica = useCallback(() => {
        const el = audio.current;
        if (!el) return;

        if (suena) {
            el.pause();
            setSuena(false);
            try {
                localStorage.setItem('cronica-musica', 'no');
            } catch {
                /* navegacion privada: da igual, se queda sin recordar */
            }

            return;
        }

        el.volume = 0;
        el.play()
            .then(() => {
                setSuena(true);
                try {
                    localStorage.setItem('cronica-musica', 'si');
                } catch {
                    /* idem */
                }
                // Entra despacio, que no pegue un susto.
                const subir = window.setInterval(() => {
                    if (!audio.current || audio.current.volume >= 0.34) {
                        window.clearInterval(subir);

                        return;
                    }
                    audio.current.volume = Math.min(0.34, audio.current.volume + 0.02);
                }, 90);
            })
            .catch(() => setSuena(false));
    }, [suena]);

    // Si ya la habia dejado puesta, se intenta reanudar. El navegador solo lo
    // permite si ya ha habido algun gesto del usuario en el sitio; si no,
    // simplemente se queda callada y el altavoz sigue ahi.
    useEffect(() => {
        if (!musica) return;
        let recuerda: string | null = null;
        try {
            recuerda = localStorage.getItem('cronica-musica');
        } catch {
            recuerda = null;
        }
        if (recuerda !== 'si' || !audio.current) return;

        audio.current.volume = 0.34;
        audio.current.play().then(() => setSuena(true)).catch(() => setSuena(false));
    }, [musica]);

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
                // En un movil manda el ancho, y con la proporcion de un libro
                // abierto quedaria media pantalla vacia: se deja crecer hasta
                // 1.8, que es la proporcion de una hoja suelta y no de un
                // pliego, y aprovecha el telefono entero.
                alto = Math.min(altoLibre, ancho * (aDoble ? PROPORCION : 1.8));
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

    /**
     * El reparto en hojas lo hace el servidor, que no sabe de que tamaño es la
     * pantalla: en un movil cabe la mitad que en un portatil. Aqui se mide una
     * hoja de texto ya pintada —cuantas palabras lleva y cuanto ocupa de
     * verdad— y, si el reparto no cuadra, se vuelve a pedir el libro con la
     * medida buena. Pasa una sola vez por dispositivo: queda recordada.
     */
    const yaCalibrado = useRef(false);

    const calibrar = useCallback(
        (palabras: number, altoUsado: number, altoDisponible: number) => {
            if (yaCalibrado.current || !palabras || !altoUsado || !altoDisponible) return;

            const cabrian = Math.round((palabras * altoDisponible) / altoUsado * 0.92);
            const bueno = Math.max(50, Math.min(260, cabrian));

            // Menos de un 12% de diferencia no merece otra peticion.
            if (Math.abs(bueno - wpp) / wpp < 0.12) {
                yaCalibrado.current = true;

                return;
            }

            yaCalibrado.current = true;
            try {
                localStorage.setItem('libro-wpp', String(bueno));
            } catch {
                /* navegacion privada: se recalibrara la proxima vez */
            }
            // Con otro reparto las hojas son otras, asi que la pagina 71 de
            // antes no es la de ahora: se estima la equivalente por regla de
            // tres para no devolver al lector al principio del libro.
            router.get(
                window.location.pathname,
                { wpp: bueno, p: Math.max(1, Math.round(((n + 1) * wpp) / bueno)) },
                { replace: true, preserveScroll: true },
            );
        },
        [wpp, n],
    );

    // Si ya se midio en otra visita, se pide el libro con esa medida de entrada
    // y nos ahorramos el repintado.
    useEffect(() => {
        if (yaCalibrado.current) return;
        let guardado: number | null = null;
        try {
            const v = localStorage.getItem('libro-wpp');
            guardado = v ? Number(v) : null;
        } catch {
            guardado = null;
        }
        if (!guardado || !Number.isFinite(guardado)) return;
        if (Math.abs(guardado - wpp) / wpp < 0.12) {
            yaCalibrado.current = true;

            return;
        }
        yaCalibrado.current = true;
        router.get(
            window.location.pathname,
            { wpp: guardado, p: Math.max(1, Math.round(((n + 1) * wpp) / guardado)) },
            { replace: true, preserveScroll: true },
        );
    }, [wpp, n]);

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
            <Head title={titulo}>
                <meta name="description" content={`${titulo}. Para leer de principio a fin.`} />
            </Head>

            <style>{`
                .cronica { --tinta:#2b1d10; --tinta-suave:#5a452c; --oro:#8a6a3f; --pergamino:#efe2c6; }

                /* ── La taberna ────────────────────────────────────────────
                   Tablones de madera oscura, el candil justo encima del libro
                   y la sala apagandose hacia los bordes. Todo dibujado: la
                   Cronica tiene que abrir aunque no cargue ninguna imagen. */
                .taberna {
                    position: fixed; inset: 0; z-index: 0;
                    background-color: #3a2413;
                    background-image:
                        /* juntas entre tablones */
                        repeating-linear-gradient(
                            180deg,
                            rgba(0,0,0,.55) 0px, rgba(0,0,0,.55) 3px,
                            rgba(126,80,38,.22) 3px, rgba(126,80,38,.22) 82px,
                            rgba(0,0,0,.42) 82px, rgba(0,0,0,.42) 86px,
                            rgba(96,60,28,.26) 86px, rgba(96,60,28,.26) 168px
                        ),
                        /* veta de la madera */
                        repeating-linear-gradient(
                            93deg,
                            rgba(255,214,150,.055) 0px, rgba(255,214,150,.055) 2px,
                            transparent 2px, transparent 9px
                        ),
                        repeating-linear-gradient(
                            88deg,
                            rgba(40,22,8,.10) 0px, rgba(40,22,8,.10) 5px,
                            transparent 5px, transparent 23px
                        );
                }
                /* Luz del candil: cae desde arriba sobre la mesa. */
                .candil {
                    position: fixed; inset: 0; z-index: 1; pointer-events: none;
                    background:
                        radial-gradient(52% 40% at 50% 2%, rgba(255,206,128,.42), transparent 72%),
                        radial-gradient(80% 64% at 50% 44%, rgba(255,181,96,.20), transparent 74%),
                        radial-gradient(125% 118% at 50% 52%, transparent 44%, rgba(20,10,4,.52) 84%, rgba(12,6,2,.8) 100%);
                    animation: candil 6.5s ease-in-out infinite;
                }
                /* El candil no está quieto: parpadea despacio. */
                @keyframes candil { 0%,100% { opacity:.92 } 45% { opacity:1 } 70% { opacity:.95 } }

                .taberna-foto {
                    position: fixed; inset: 0; z-index: 0;
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
                /* Animacion y no transicion: una transicion exige que el
                   navegador haya pintado antes el estado de partida, y la hoja
                   nace en el mismo fotograma en que empieza a caer. */
                .giro { transform-style: preserve-3d; will-change: transform; }
                .giro-adelante {
                    transform-origin: left center;
                    animation: caer-adelante ${MS_GIRO}ms cubic-bezier(.42,.02,.36,1) forwards;
                }
                .giro-atras {
                    transform-origin: right center;
                    animation: caer-atras ${MS_GIRO}ms cubic-bezier(.42,.02,.36,1) forwards;
                }
                @keyframes caer-adelante { from { transform: rotateY(0deg) } to { transform: rotateY(-180deg) } }
                @keyframes caer-atras    { from { transform: rotateY(0deg) } to { transform: rotateY(180deg) } }
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

            {musica && <audio ref={audio} src={musica} loop preload="none" />}

            {fondo ? (
                <div className="taberna-foto" style={{ backgroundImage: `url(${fondo})` }} />
            ) : (
                <div className="taberna" />
            )}
            <div className="candil" />

            <div
                className="cronica relative z-10 min-h-screen px-3 py-4 sm:px-6"
                onTouchStart={alTocar}
                onTouchEnd={alSoltar}
            >
                {/* Barra */}
                <div className="no-imprimir mx-auto mb-3 flex max-w-6xl flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIndiceAbierto((v) => !v)}
                        className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/85 px-3 py-1.5 text-sm font-semibold text-[#e6d3a8] hover:bg-[#2a1a0c]"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {indiceAbierto ? 'Cerrar el índice' : 'Índice'}
                    </button>

                        {musica && (
                            <button
                                type="button"
                                onClick={alternarMusica}
                                title={suena ? 'Callar la música' : 'Música de la Venta'}
                                aria-pressed={suena}
                                className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/85 px-3 py-1.5 text-sm text-[#e6d3a8] hover:bg-[#2a1a0c]"
                            >
                                {suena ? '🔊' : '🔇'}
                            </button>
                        )}

                        {hermano && (
                            <a
                                href={hermano.url}
                                className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/85 px-3 py-1.5 text-sm font-semibold text-[#e6d3a8] hover:bg-[#2a1a0c]"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {hermano.titulo}
                            </a>
                        )}
                    </div>

                    <p
                        className="text-xs tracking-widest text-[#c9ae7c]/70 uppercase"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {capitulo || rotulo}
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
                                <Hoja pagina={paginas[dFija]} lado="der" numero={dFija + 1} estilos={estilosHoja} calibrar={calibrar} />
                            </>
                        ) : (
                            <Hoja pagina={paginas[destino]} lado={null} numero={destino + 1} estilos={estilosHoja} calibrar={calibrar} />
                        )}

                        {/* La hoja que cae */}
                        {giro && (
                            <div
                                className={`giro absolute top-0 ${adelante ? 'giro-adelante' : 'giro-atras'}`}
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
    calibrar,
}: {
    pagina: Pagina | undefined | null;
    lado: 'izq' | 'der' | null;
    numero: number;
    estilos: { width: number; height: number };
    calibrar?: (palabras: number, altoUsado: number, altoDisponible: number) => void;
}) {
    const caja = useRef<HTMLDivElement>(null);
    // El texto va envuelto porque la caja nunca mide menos que su propia
    // altura: para saber cuanto ocupa DE VERDAD hay que medir lo de dentro.
    const dentro = useRef<HTMLDivElement>(null);

    // El tamaño de letra lo escribe este efecto directamente en el nodo, no un
    // atributo style: si estuviera en las props, React lo devolveria a 1rem en
    // cada repintado y el ajuste se perderia.
    useLayoutEffect(() => {
        const el = caja.current;
        if (!el) return;

        el.style.fontSize = '1rem';

        // Con el texto a su tamaño natural: cuanto ocupa de verdad esta hoja.
        // De ahi sale el reparto para esta pantalla.
        if (calibrar && pagina?.palabras && dentro.current) {
            calibrar(pagina.palabras, dentro.current.offsetHeight, el.clientHeight);
        }

        // Encoge de a poco hasta que entre. Es la red de seguridad mientras el
        // reparto se ajusta; si aun asi no cupiese, la hoja se desliza por
        // dentro antes que comerse una linea.
        let e = 1;
        while (el.scrollHeight > el.clientHeight + 1 && e > 0.72) {
            e -= 0.04;
            el.style.fontSize = `${e}rem`;
        }
    }, [pagina, estilos.width, estilos.height, calibrar]);

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

            <div ref={caja} className="prosa min-h-0 flex-1 overflow-y-auto">
                <div ref={dentro}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {primeraDelCapitulo && pagina.texto ? conCapitular(pagina.texto) : (pagina.texto ?? '')}
                    </ReactMarkdown>
                </div>
            </div>

            <NumeroHoja n={numero} />
        </div>
    );
}

function NumeroHoja({ n }: { n: number }) {
    return <p className="mt-3 shrink-0 text-center text-xs text-[#8a6a3f]/70">— {n} —</p>;
}
