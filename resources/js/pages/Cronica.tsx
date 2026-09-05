import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

/**
 * Adorno de separación. Se dibuja con caracteres para no depender de ningún
 * recurso externo: la Crónica tiene que abrir bien aunque no cargue nada más.
 */
function Filigrana() {
    return <div className="my-4 text-center text-[#8a6a3f]/50 select-none">❦</div>;
}

/** Capitular: la primera letra del texto, grande, como en un libro antiguo. */
function conCapitular(texto: string) {
    return texto.replace(
        /^([A-ZÁÉÍÓÚÑ«"¿¡])/,
        (letra) => `<span class="capitular">${letra}</span>`,
    );
}

export default function Cronica({
    paginas,
    indice,
    mundo,
}: {
    paginas: Pagina[];
    indice: EntradaIndice[];
    mundo: string;
}) {
    // La página vive en la URL (?p=), para poder compartir un punto del libro.
    const inicial = () => {
        if (typeof window === 'undefined') return 0;
        const p = Number(new URLSearchParams(window.location.search).get('p'));
        return Number.isFinite(p) && p > 0 ? Math.min(p - 1, paginas.length - 1) : 0;
    };

    const [n, setN] = useState(inicial);
    const [indiceAbierto, setIndiceAbierto] = useState(false);
    const [doble, setDoble] = useState(false);

    // Dos páginas a la vez solo si hay sitio de verdad: en móvil una y basta.
    useEffect(() => {
        const mirar = () => setDoble(window.innerWidth >= 1100);
        mirar();
        window.addEventListener('resize', mirar);
        return () => window.removeEventListener('resize', mirar);
    }, []);

    const salto = doble ? 2 : 1;

    const ir = useCallback(
        (destino: number) => {
            const max = paginas.length - 1;
            const limpio = Math.max(0, Math.min(destino, max));
            setN(limpio);
            const url = new URL(window.location.href);
            url.searchParams.set('p', String(limpio + 1));
            window.history.replaceState({}, '', url);
        },
        [paginas.length],
    );

    useEffect(() => {
        const tecla = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') ir(n + salto);
            if (e.key === 'ArrowLeft') ir(n - salto);
            if (e.key === 'Home') ir(0);
            if (e.key === 'End') ir(paginas.length - 1);
            if (e.key === 'Escape') setIndiceAbierto(false);
        };
        window.addEventListener('keydown', tecla);
        return () => window.removeEventListener('keydown', tecla);
    }, [n, salto, ir, paginas.length]);

    const capitulo = useMemo(() => {
        let actual = '';
        for (const e of indice) {
            if (e.pagina <= n) actual = e.titulo;
            else break;
        }
        return actual;
    }, [indice, n]);

    const visibles = doble ? [paginas[n], paginas[n + 1]] : [paginas[n]];

    return (
        <>
            <Head title={`Crónica de ${mundo}`}>
                <meta
                    name="description"
                    content={`La crónica completa de ${mundo}: sus reinos, sus ventas y quienes los caminaron.`}
                />
            </Head>

            <style>{`
                .cronica {
                    --tinta: #2b1d10;
                    --tinta-suave: #5a452c;
                    --oro: #8a6a3f;
                    --pergamino: #efe2c6;
                    --pergamino-sombra: #d9c69f;
                }
                .cronica-fondo {
                    background:
                        radial-gradient(ellipse at 50% 0%, #24170e 0%, #140c07 55%, #0b0704 100%);
                }
                .hoja {
                    background-color: var(--pergamino);
                    background-image:
                        radial-gradient(ellipse at 12% 18%, rgba(150,116,64,.16), transparent 55%),
                        radial-gradient(ellipse at 85% 75%, rgba(120,88,44,.14), transparent 50%),
                        radial-gradient(circle at 60% 40%, rgba(255,255,255,.5), transparent 60%);
                    box-shadow:
                        inset 0 0 70px rgba(120,88,44,.22),
                        0 22px 50px rgba(0,0,0,.55);
                }
                /* La sombra del pliegue: el lado que toca el lomo va mas oscuro. */
                .hoja-izq { box-shadow: inset -26px 0 42px -26px rgba(70,45,18,.55), inset 0 0 70px rgba(120,88,44,.22), 0 22px 50px rgba(0,0,0,.55); }
                .hoja-der { box-shadow: inset  26px 0 42px -26px rgba(70,45,18,.55), inset 0 0 70px rgba(120,88,44,.22), 0 22px 50px rgba(0,0,0,.55); }

                .prosa { color: var(--tinta); font-size: 1.02rem; line-height: 1.85; text-align: justify; hyphens: auto; }
                .prosa p { margin: 0 0 .95rem; }
                .prosa em { color: var(--tinta-suave); }
                .prosa strong { color: #4a2f12; }
                .prosa h1, .prosa h2, .prosa h3 {
                    font-family: Cinzel, Georgia, serif; color: #4a2f12;
                    text-align: center; letter-spacing: .04em; margin: 1.2rem 0 .8rem;
                    font-size: 1.05rem; text-transform: uppercase;
                }
                .prosa blockquote {
                    margin: 1rem 0; padding-left: 1rem;
                    border-left: 3px solid rgba(138,106,63,.45);
                    font-style: italic; color: var(--tinta-suave);
                }
                .prosa img { max-width: 100%; border-radius: 3px; }
                .prosa table { width: 100%; font-size: .86rem; }
                .prosa code { font-size: .82rem; background: rgba(138,106,63,.12); padding: 0 .25em; }
                .prosa pre { font-size: .72rem; overflow-x: auto; background: rgba(138,106,63,.1); padding: .6rem; }

                .capitular {
                    float: left; font-family: Cinzel, Georgia, serif;
                    font-size: 3.3rem; line-height: .82; padding: .12em .12em 0 0;
                    color: #7a4f1c;
                }
                @media print { .no-imprimir { display: none !important; } }
            `}</style>

            <div className="cronica cronica-fondo min-h-screen px-3 py-5 sm:px-6 sm:py-8">
                {/* Barra */}
                <div className="no-imprimir mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => setIndiceAbierto((v) => !v)}
                        className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/80 px-3 py-1.5 text-sm font-semibold text-[#e6d3a8] hover:bg-[#2a1a0c]"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {indiceAbierto ? 'Cerrar el índice' : 'Índice'}
                    </button>

                    <p className="text-xs tracking-widest text-[#c9ae7c]/70 uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                        {capitulo || 'Crónica'}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => ir(n - salto)}
                            disabled={n === 0}
                            className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/80 px-3 py-1.5 text-sm text-[#e6d3a8] disabled:opacity-30"
                        >
                            ‹
                        </button>
                        <span className="min-w-24 text-center text-xs text-[#c9ae7c]/70">
                            {n + 1} / {paginas.length}
                        </span>
                        <button
                            type="button"
                            onClick={() => ir(n + salto)}
                            disabled={n >= paginas.length - 1}
                            className="rounded border border-[#8a6a3f]/50 bg-[#1c1108]/80 px-3 py-1.5 text-sm text-[#e6d3a8] disabled:opacity-30"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Índice */}
                {indiceAbierto && (
                    <div className="no-imprimir mx-auto mb-5 max-w-6xl rounded border border-[#8a6a3f]/40 bg-[#1a1007]/95 p-4">
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
                <div className={`mx-auto grid max-w-6xl gap-0 ${doble ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {visibles.map((p, i) =>
                        p ? (
                            <Hoja
                                key={n + i}
                                pagina={p}
                                numero={n + i + 1}
                                lado={doble ? (i === 0 ? 'izq' : 'der') : null}
                            />
                        ) : (
                            <div key={`vacia-${i}`} className="hoja hoja-der min-h-[70vh] opacity-40" />
                        ),
                    )}
                </div>

                {/* Zonas de paso, para pasar hoja con el dedo o el raton */}
                <div className="no-imprimir mx-auto mt-4 flex max-w-6xl justify-between text-xs text-[#8a6a3f]/60">
                    <button type="button" onClick={() => ir(n - salto)} className="px-2 hover:text-[#c9ae7c]">
                        ← anterior
                    </button>
                    <button type="button" onClick={() => ir(n + salto)} className="px-2 hover:text-[#c9ae7c]">
                        siguiente →
                    </button>
                </div>
            </div>
        </>
    );
}

function Hoja({ pagina, numero, lado }: { pagina: Pagina; numero: number; lado: 'izq' | 'der' | null }) {
    const clase = `hoja ${lado === 'izq' ? 'hoja-izq' : lado === 'der' ? 'hoja-der' : ''} relative flex min-h-[70vh] flex-col px-7 py-8 sm:px-12 sm:py-12`;

    if (pagina.tipo === 'portada') {
        return (
            <div className={`${clase} items-center justify-center text-center`}>
                <p className="mb-3 text-xs tracking-[0.35em] text-[#8a6a3f] uppercase">Crónica de</p>
                <h1
                    className="text-4xl leading-tight font-black text-[#4a2f12] sm:text-5xl"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
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
            <div className={`${clase} items-center justify-center text-center`}>
                <Filigrana />
                <h2
                    className="text-3xl font-black text-[#4a2f12]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
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
            <div className={clase}>
                {pagina.imagen && (
                    <div className="mx-auto mb-4 w-full max-w-[260px] overflow-hidden rounded-sm border-4 border-[#8a6a3f]/40 shadow-[0_10px_28px_rgba(60,40,15,.4)]">
                        <img src={pagina.imagen} alt={pagina.titulo ?? ''} className="w-full" loading="lazy" />
                    </div>
                )}

                <h2
                    className="text-center text-2xl leading-tight font-black text-[#4a2f12]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
                    {pagina.titulo}
                </h2>
                {pagina.epiteto && (
                    <p className="mt-1 text-center text-sm text-[#5a452c] italic">{pagina.epiteto}</p>
                )}
                {pagina.faccion && (
                    <p className="mt-1 text-center text-[11px] tracking-widest text-[#8a6a3f] uppercase">
                        {pagina.faccion}
                    </p>
                )}

                <Filigrana />

                {!!pagina.vinculos?.length && (
                    <div className="mb-3">
                        <p className="mb-1.5 text-center text-[11px] tracking-widest text-[#8a6a3f] uppercase">
                            De quién se rodeó
                        </p>
                        <ul className="mx-auto max-w-sm space-y-0.5 text-sm text-[#3d2a15]">
                            {pagina.vinculos.map((v, i) => (
                                <li key={i} className="flex justify-between gap-3">
                                    <span className="text-[#5a452c] italic">{v.tipo}</span>
                                    <span className="flex-1 border-b border-dotted border-[#8a6a3f]/40" />
                                    <span className="font-semibold">{v.nombre}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!!pagina.lugares?.length && (
                    <p className="text-center text-xs text-[#5a452c]">
                        <span className="tracking-widest uppercase">Se le vio en</span>
                        <br />
                        {pagina.lugares.join(' · ')}
                    </p>
                )}

                <NumeroHoja n={numero} />
            </div>
        );
    }

    // Lugar y texto corrido
    const primeraDelCapitulo = !pagina.continua;

    return (
        <div className={clase}>
            {pagina.cabecera && (
                <p className="mb-4 text-center text-[11px] tracking-[0.3em] text-[#8a6a3f]/70 uppercase">
                    {pagina.cabecera}
                </p>
            )}

            {pagina.titulo && (
                <>
                    <h2
                        className="text-center text-2xl font-black text-[#4a2f12]"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {pagina.titulo}
                    </h2>
                    {pagina.etiqueta && (
                        <p className="mt-1 text-center text-[11px] tracking-widest text-[#8a6a3f] uppercase">
                            {pagina.etiqueta}
                        </p>
                    )}
                    <Filigrana />
                </>
            )}

            {pagina.imagen && (
                <div className="mb-4 overflow-hidden rounded-sm border-2 border-[#8a6a3f]/40">
                    <img src={pagina.imagen} alt={pagina.titulo ?? ''} className="w-full" loading="lazy" />
                </div>
            )}

            <div className="prosa flex-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {primeraDelCapitulo && pagina.texto ? conCapitular(pagina.texto) : (pagina.texto ?? '')}
                </ReactMarkdown>
            </div>

            <NumeroHoja n={numero} />
        </div>
    );
}

function NumeroHoja({ n }: { n: number }) {
    return <p className="mt-6 text-center text-xs text-[#8a6a3f]/70">— {n} —</p>;
}
