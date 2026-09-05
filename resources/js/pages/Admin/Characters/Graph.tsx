import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    forceCenter,
    forceCollide,
    forceLink,
    forceManyBody,
    forceSimulation,
    forceX,
    forceY,
    type Simulation,
    type SimulationLinkDatum,
    type SimulationNodeDatum,
} from 'd3-force';
import { ArrowLeft, Maximize2, Search, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface NodoServidor {
    id: number;
    nombre: string;
    imagen: string | null;
    faccion: string | null;
    grado: number;
}

interface AristaServidor {
    id: number;
    origen: number;
    destino: number;
    tipo: string;
    inverso: string | null;
    notas: string | null;
}

interface Nodo extends SimulationNodeDatum, NodoServidor {}
interface Arista extends SimulationLinkDatum<Nodo> {
    id: number;
    tipo: string;
    inverso: string | null;
    notas: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Personajes', href: '/admin/characters' },
    { title: 'Grafo', href: '#' },
];

const ANCHO = 1600;
const ALTO = 1100;

/** Radio del nodo segun cuantas relaciones tenga. */
function radio(grado: number) {
    return 16 + Math.min(grado, 12) * 2.4;
}

/**
 * Color por faccion. Las facciones salen del lore y son pocas, asi que una
 * paleta fija basta; lo que no tiene faccion se queda en ambar, que es el
 * color de la casa.
 */
const COLOR_FACCION: Record<string, string> = {
    'Orden de Paladines': '#60a5fa',
    'La Geoda': '#a78bfa',
};
const COLOR_BASE = '#fbbf24';

function color(faccion: string | null) {
    return (faccion && COLOR_FACCION[faccion]) || COLOR_BASE;
}

export default function Graph({
    nodos: nodosServidor,
    aristas: aristasServidor,
    sueltos,
}: {
    nodos: NodoServidor[];
    aristas: AristaServidor[];
    sueltos: number;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const simRef = useRef<Simulation<Nodo, Arista> | null>(null);
    const arrastrando = useRef<Nodo | null>(null);

    // Copia propia: d3 muta los nodos (les mete x, y, vx, vy) y las props de
    // Inertia no se tocan.
    const nodos = useMemo<Nodo[]>(() => nodosServidor.map((n) => ({ ...n })), [nodosServidor]);
    const aristas = useMemo<Arista[]>(
        () =>
            aristasServidor.map((a) => ({
                id: a.id,
                source: a.origen,
                target: a.destino,
                tipo: a.tipo,
                inverso: a.inverso,
                notas: a.notas,
            })),
        [aristasServidor],
    );

    const [, repintar] = useState(0);
    const [foco, setFoco] = useState<number | null>(null);
    const [busqueda, setBusqueda] = useState('');
    const [vista, setVista] = useState({ x: 0, y: 0, k: 1 });
    const paneo = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

    // ── Simulacion ────────────────────────────────────────────────────────
    useEffect(() => {
        const sim = forceSimulation<Nodo>(nodos)
            .force(
                'enlace',
                forceLink<Nodo, Arista>(aristas)
                    .id((d) => d.id)
                    .distance(150)
                    .strength(0.55),
            )
            .force('repulsion', forceManyBody().strength(-420))
            .force('centro', forceCenter(ANCHO / 2, ALTO / 2))
            // Los nodos no se pisan: el radio del choque es el del dibujo.
            .force(
                'choque',
                forceCollide<Nodo>().radius((d) => radio(d.grado) + 12),
            )
            .force('x', forceX(ANCHO / 2).strength(0.03))
            .force('y', forceY(ALTO / 2).strength(0.05))
            .on('tick', () => repintar((n) => n + 1));

        simRef.current = sim;

        return () => {
            sim.stop();
        };
    }, [nodos, aristas]);

    // ── Arrastre de nodos ─────────────────────────────────────────────────
    const puntoSvg = useCallback((e: React.PointerEvent | PointerEvent) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const caja = svg.getBoundingClientRect();
        return {
            x: ((e.clientX - caja.left) / caja.width) * ANCHO,
            y: ((e.clientY - caja.top) / caja.height) * ALTO,
        };
    }, []);

    useEffect(() => {
        const mover = (e: PointerEvent) => {
            const svg = svgRef.current;
            if (!svg) return;
            const caja = svg.getBoundingClientRect();
            const px = ((e.clientX - caja.left) / caja.width) * ANCHO;
            const py = ((e.clientY - caja.top) / caja.height) * ALTO;

            if (arrastrando.current) {
                const n = arrastrando.current;
                n.fx = (px - vista.x) / vista.k;
                n.fy = (py - vista.y) / vista.k;
                simRef.current?.alphaTarget(0.25).restart();
                return;
            }

            if (paneo.current) {
                setVista((v) => ({
                    ...v,
                    x: paneo.current!.vx + (px - paneo.current!.x),
                    y: paneo.current!.vy + (py - paneo.current!.y),
                }));
            }
        };

        const soltar = () => {
            if (arrastrando.current) {
                // Se libera el nodo: vuelve a obedecer a las fuerzas.
                arrastrando.current.fx = null;
                arrastrando.current.fy = null;
                arrastrando.current = null;
                simRef.current?.alphaTarget(0);
            }
            paneo.current = null;
        };

        window.addEventListener('pointermove', mover);
        window.addEventListener('pointerup', soltar);
        return () => {
            window.removeEventListener('pointermove', mover);
            window.removeEventListener('pointerup', soltar);
        };
    }, [vista]);

    // ── Vecindario del nodo enfocado ──────────────────────────────────────
    const vecinos = useMemo(() => {
        if (foco === null) return null;
        const s = new Set<number>([foco]);
        for (const a of aristas) {
            const o = typeof a.source === 'object' ? (a.source as Nodo).id : (a.source as number);
            const d = typeof a.target === 'object' ? (a.target as Nodo).id : (a.target as number);
            if (o === foco) s.add(d);
            if (d === foco) s.add(o);
        }
        return s;
    }, [foco, aristas]);

    const coincide = useCallback(
        (n: Nodo) => busqueda.trim().length > 1 && n.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
        [busqueda],
    );

    const enfocado = foco !== null ? nodos.find((n) => n.id === foco) : null;
    const relacionesDelFoco = useMemo(() => {
        if (foco === null) return [];
        return aristas
            .filter((a) => {
                const o = typeof a.source === 'object' ? (a.source as Nodo).id : (a.source as number);
                const d = typeof a.target === 'object' ? (a.target as Nodo).id : (a.target as number);
                return o === foco || d === foco;
            })
            .map((a) => {
                const o = typeof a.source === 'object' ? (a.source as Nodo) : nodos.find((n) => n.id === a.source)!;
                const d = typeof a.target === 'object' ? (a.target as Nodo) : nodos.find((n) => n.id === a.target)!;
                const desdeOrigen = o.id === foco;
                return {
                    id: a.id,
                    otro: desdeOrigen ? d : o,
                    // Sin inverso declarado la relacion es simetrica.
                    tipo: desdeOrigen ? a.tipo : a.inverso || a.tipo,
                };
            })
            .sort((a, b) => a.tipo.localeCompare(b.tipo));
    }, [foco, aristas, nodos]);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Grafo de relaciones" />

            <div className="p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            Quién es quién
                        </h1>
                        <p className="text-sm text-yellow-200/60">
                            {nodos.length} personajes · {aristas.length} relaciones
                            {sueltos > 0 && ` · ${sueltos} sin relaciones, fuera del dibujo`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-yellow-200/40" />
                            <Input
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Resaltar por nombre…"
                                className="w-56 pl-8"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            title="Recentrar"
                            onClick={() => {
                                setVista({ x: 0, y: 0, k: 1 });
                                simRef.current?.alpha(0.6).restart();
                            }}
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/characters">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Listado
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="overflow-hidden rounded-xl border-4 border-amber-500/50 bg-slate-950 shadow-[0_0_45px_rgba(251,191,36,0.2)]">
                        <svg
                            ref={svgRef}
                            viewBox={`0 0 ${ANCHO} ${ALTO}`}
                            className="w-full touch-none select-none"
                            style={{ height: 'min(72vh, 780px)', cursor: paneo.current ? 'grabbing' : 'grab' }}
                            onPointerDown={(e) => {
                                if (e.target === svgRef.current) {
                                    const p = puntoSvg(e);
                                    paneo.current = { x: p.x, y: p.y, vx: vista.x, vy: vista.y };
                                    setFoco(null);
                                }
                            }}
                            onWheel={(e) => {
                                const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
                                setVista((v) => ({ ...v, k: Math.min(3, Math.max(0.35, v.k * factor)) }));
                            }}
                        >
                            <defs>
                                {nodos.map(
                                    (n) =>
                                        n.imagen && (
                                            <clipPath key={n.id} id={`recorte-${n.id}`}>
                                                <circle r={radio(n.grado)} />
                                            </clipPath>
                                        ),
                                )}
                            </defs>

                            <g transform={`translate(${vista.x} ${vista.y}) scale(${vista.k})`}>
                                {/* Aristas */}
                                {aristas.map((a) => {
                                    const o = a.source as Nodo;
                                    const d = a.target as Nodo;
                                    if (typeof o !== 'object' || typeof d !== 'object') return null;
                                    const activa = !vecinos || (vecinos.has(o.id) && vecinos.has(d.id));
                                    return (
                                        <line
                                            key={a.id}
                                            x1={o.x}
                                            y1={o.y}
                                            x2={d.x}
                                            y2={d.y}
                                            stroke={activa ? 'rgba(251,191,36,0.45)' : 'rgba(251,191,36,0.07)'}
                                            strokeWidth={activa && vecinos ? 2.5 : 1.2}
                                        />
                                    );
                                })}

                                {/* Nodos */}
                                {nodos.map((n) => {
                                    const r = radio(n.grado);
                                    const apagado = vecinos ? !vecinos.has(n.id) : false;
                                    const resaltado = coincide(n);
                                    return (
                                        <g
                                            key={n.id}
                                            transform={`translate(${n.x ?? 0} ${n.y ?? 0})`}
                                            opacity={apagado ? 0.18 : 1}
                                            style={{ cursor: 'pointer' }}
                                            onPointerDown={(e) => {
                                                e.stopPropagation();
                                                arrastrando.current = n;
                                                n.fx = n.x;
                                                n.fy = n.y;
                                                setFoco(n.id);
                                            }}
                                            onDoubleClick={() => router.visit(`/admin/characters/${n.id}`)}
                                        >
                                            <circle
                                                r={r + 3}
                                                fill="none"
                                                stroke={resaltado ? '#fff' : color(n.faccion)}
                                                strokeWidth={resaltado || n.id === foco ? 4 : 2}
                                            />
                                            {n.imagen ? (
                                                <image
                                                    href={n.imagen}
                                                    x={-r}
                                                    y={-r}
                                                    width={r * 2}
                                                    height={r * 2}
                                                    clipPath={`url(#recorte-${n.id})`}
                                                    preserveAspectRatio="xMidYMid slice"
                                                />
                                            ) : (
                                                <circle r={r} fill="#1e293b" />
                                            )}
                                            <text
                                                y={r + 16}
                                                textAnchor="middle"
                                                fontSize={13}
                                                fontWeight={700}
                                                fill={resaltado ? '#fff' : 'rgba(254,240,138,0.75)'}
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {n.nombre.length > 22 ? n.nombre.slice(0, 21) + '…' : n.nombre}
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        </svg>
                    </div>

                    {/* Panel lateral */}
                    <div className="rounded-xl border-2 border-amber-500/25 bg-slate-900/70 p-4">
                        {enfocado ? (
                            <>
                                <div className="mb-3 flex items-center gap-3">
                                    {enfocado.imagen ? (
                                        <img
                                            src={enfocado.imagen}
                                            alt={enfocado.nombre}
                                            className="h-16 w-16 rounded-full border-2 border-amber-500/50 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500/30 bg-slate-950">
                                            <Users className="h-7 w-7 text-yellow-500/40" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="truncate font-black text-yellow-100">{enfocado.nombre}</p>
                                        {enfocado.faccion && (
                                            <p className="truncate text-xs text-yellow-200/50">{enfocado.faccion}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3 space-y-2">
                                    {relacionesDelFoco.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setFoco(r.otro.id)}
                                            className="w-full rounded-md border border-amber-500/20 bg-slate-950/60 px-3 py-2 text-left transition-colors hover:border-amber-400/60"
                                        >
                                            <p className="text-[11px] font-black tracking-wider text-rose-300/80 uppercase">
                                                {r.tipo}
                                            </p>
                                            <p className="truncate text-sm font-bold text-yellow-100">{r.otro.nombre}</p>
                                        </button>
                                    ))}
                                </div>

                                <Button size="sm" asChild className="w-full">
                                    <Link href={`/admin/characters/${enfocado.id}`}>Ver ficha completa</Link>
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-3 text-sm text-yellow-200/60">
                                <p className="font-bold text-yellow-200/80">Cómo se maneja</p>
                                <ul className="list-inside list-disc space-y-1.5">
                                    <li>Clic en un personaje: apaga todo lo que no le toca.</li>
                                    <li>Arrástralo para colocarlo; al soltar vuelve a flotar.</li>
                                    <li>Doble clic: abre su ficha.</li>
                                    <li>Rueda para acercar, arrastra el fondo para mover.</li>
                                </ul>
                                <p className="pt-2 text-xs">
                                    El tamaño de cada uno es cuántas relaciones tiene. El color, su facción.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
