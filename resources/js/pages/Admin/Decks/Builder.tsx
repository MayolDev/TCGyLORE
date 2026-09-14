import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Search, Layers, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import FoilOverlay from '@/components/foil-overlay';

interface LibraryCard {
    id: number;
    name: string;
    image: string | null;
    effect: string;
    cost: number | null;
    type: string;
    rarity?: string | null;
    foil?: boolean;
}

interface DeckEntry {
    card_id: number;
    zone: Zone;
    quantity: number;
}

interface DeckData {
    id: number;
    name: string;
    description: string | null;
    type: TipoMazo;
    cards: DeckEntry[];
}

type Zone = 'protagonista' | 'senda' | 'principal' | 'side' | 'eventos' | 'pacto';
type TipoMazo = 'normal' | 'eventos' | 'social';

const ZONAS_NORMAL: { zone: Zone; titulo: string; icono: string }[] = [
    { zone: 'protagonista', titulo: 'Protagonista', icono: '👑' },
    { zone: 'senda', titulo: 'Sendas', icono: '🛤️' },
    { zone: 'principal', titulo: 'Mazo principal', icono: '🃏' },
    { zone: 'side', titulo: 'Sidecards', icono: '🎒' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Biblioteca · Mazos', href: '/admin/decks' },
    { title: 'Constructor' },
];

/**
 * Tope de copias del Reglamento 0.4 §13: comunes, hechizos, trampas y muros
 * máx 3 · élites máx 2 · legendarias máx 1. El Protagonista y las Sendas van
 * aparte y son de una.
 */
function limiteDeCopias(carta: LibraryCard): number {
    if (carta.type === 'Protagonista' || carta.type === 'Senda') return 1;
    const r = (carta.rarity ?? '').toLowerCase();
    if (r.includes('legendaria')) return 1;
    if (r.includes('élite') || r.includes('elite')) return 2;
    return 3;
}

/** Mínimo de cartas del mazo principal (§13). Sin máximo: el tamaño es una apuesta. */
const MINIMO_PRINCIPAL = 25;

/** La Baraja de Pactos de Protagonistas-2 §1 son 20 cartas distintas. */
const MINIMO_PACTOS = 20;

/** Zona a la que va una carta según su tipo (y el destino elegido para las normales). */
function zonaParaCarta(carta: LibraryCard, tipoMazo: TipoMazo, destino: 'principal' | 'side'): Zone | null {
    if (tipoMazo === 'eventos') {
        return carta.type === 'Evento' ? 'eventos' : null;
    }
    if (tipoMazo === 'social') {
        return carta.type === 'Pacto' ? 'pacto' : null;
    }
    // Eventos y Pactos tienen mazo propio: no se mezclan con el principal.
    if (carta.type === 'Evento' || carta.type === 'Pacto') return null;
    if (carta.type === 'Protagonista') return 'protagonista';
    if (carta.type === 'Senda') return 'senda';
    return destino;
}

export default function Builder({ deck, library }: { deck: DeckData | null; library: LibraryCard[] }) {
    const [name, setName] = useState(deck?.name ?? '');
    const [type, setType] = useState<TipoMazo>(deck?.type ?? 'normal');
    const [entries, setEntries] = useState<DeckEntry[]>(deck?.cards ?? []);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [destino, setDestino] = useState<'principal' | 'side'>('principal');
    const [preview, setPreview] = useState<LibraryCard | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    /** Cuántas copias mete un clic en la Biblioteca. */
    const [lote, setLote] = useState<1 | 2 | 3>(1);

    const porId = useMemo(() => new Map(library.map((c) => [c.id, c])), [library]);
    const tipos = useMemo(() => Array.from(new Set(library.map((c) => c.type))).sort(), [library]);

    const visibles = library.filter((c) => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (typeFilter && c.type !== typeFilter) return false;
        if (type === 'eventos' && c.type !== 'Evento') return false;
        if (type === 'social' && c.type !== 'Pacto') return false;
        return true;
    });

    const avisar = (msg: string) => {
        setAviso(msg);
        window.setTimeout(() => setAviso(null), 2500);
    };

    /** Copias de una carta ya metidas, sumando todas sus zonas. */
    const copiasDe = (cardId: number) =>
        entries.filter((e) => e.card_id === cardId).reduce((a, e) => a + e.quantity, 0);

    /**
     * Mete `cuantas` copias de golpe. Es la razón de ser de esta pantalla:
     * antes cada copia era un clic, así que un mazo de 25 costaba 25 clics.
     * Recorta al tope del §13 en vez de rechazar, y avisa de cuántas entraron.
     */
    const agregar = (carta: LibraryCard, cuantas: number = lote) => {
        const zone = zonaParaCarta(carta, type, destino);
        if (!zone) {
            avisar(
                type === 'eventos' ? 'Un mazo de eventos solo admite cartas de tipo Evento'
                : type === 'social' ? 'Un mazo social solo admite Pactos'
                : 'Los Eventos y los Pactos van en su propio mazo',
            );
            return;
        }
        if (zone === 'protagonista') {
            const yaHay = entries.find((e) => e.zone === 'protagonista');
            if (yaHay && yaHay.card_id !== carta.id) {
                avisar('Solo puede haber un Protagonista: quita el actual primero');
                return;
            }
        }

        const tope = limiteDeCopias(carta);
        const hueco = tope - copiasDe(carta.id);

        if (hueco <= 0) {
            avisar(`${carta.name}: ya tienes el máximo de ${tope} ${tope === 1 ? 'copia' : 'copias'}`);
            return;
        }

        const entran = Math.min(cuantas, hueco);
        if (entran < cuantas) {
            avisar(`${carta.name}: solo caben ${entran} más (tope ${tope})`);
        }

        setEntries((prev) => {
            const existente = prev.find((e) => e.card_id === carta.id && e.zone === zone);
            if (existente) {
                return prev.map((e) => (e === existente ? { ...e, quantity: e.quantity + entran } : e));
            }
            return [...prev, { card_id: carta.id, zone, quantity: entran }];
        });
    };

    /** Fija la cantidad exacta de una entrada; a 0 la quita del mazo. */
    const ponerCantidad = (entry: DeckEntry, cantidad: number) => {
        const carta = porId.get(entry.card_id);
        const tope = carta ? limiteDeCopias(carta) : 20;
        const valor = Math.max(0, Math.min(cantidad, tope));

        setEntries((prev) =>
            prev
                .map((e) => (e.card_id === entry.card_id && e.zone === entry.zone ? { ...e, quantity: valor } : e))
                .filter((e) => e.quantity > 0),
        );
    };

    const quitar = (entry: DeckEntry) => ponerCantidad(entry, entry.quantity - 1);

    /** Rellena el mazo al tope de copias de todo lo visible. Para montar rápido. */
    const meterTodasLasVisibles = () => {
        const aptas = visibles.filter((c) => zonaParaCarta(c, type, destino) !== null);
        if (aptas.length === 0) {
            avisar('Nada que meter con este filtro');
            return;
        }
        if (!confirm(`Meter al máximo de copias las ${aptas.length} cartas visibles. ¿Seguro?`)) return;
        aptas.forEach((c) => agregar(c, limiteDeCopias(c)));
    };

    const guardar = () => {
        const payload = { name, description: deck?.description ?? null, type, cards: entries };
        if (deck) {
            router.put(`/admin/decks/${deck.id}`, payload);
        } else {
            router.post('/admin/decks', payload);
        }
    };

    const cambiarTipo = (nuevo: TipoMazo) => {
        if (nuevo !== type && entries.length > 0 && !confirm('Cambiar el tipo vacía el mazo. ¿Seguro?')) return;
        if (nuevo !== type) setEntries([]);
        setType(nuevo);
    };

    const zonas =
        type === 'eventos' ? [{ zone: 'eventos' as Zone, titulo: 'Eventos', icono: '⚡' }]
        : type === 'social' ? [{ zone: 'pacto' as Zone, titulo: 'Baraja de Pactos', icono: '🤝' }]
        : ZONAS_NORMAL;
    const total = entries.reduce((acc, e) => acc + e.quantity, 0);
    const enPrincipal = entries.filter((e) => e.zone === 'principal').reduce((a, e) => a + e.quantity, 0);

    /** Lo que falta para que el mazo sea legal segun §13. Vacio = listo. */
    const problemas = useMemo(() => {
        const fallos: string[] = [];
        if (type === 'normal') {
            if (!entries.some((e) => e.zone === 'protagonista')) fallos.push('falta el Protagonista');
            if (enPrincipal < MINIMO_PRINCIPAL) fallos.push(`faltan ${MINIMO_PRINCIPAL - enPrincipal} en el principal`);
        } else if (type === 'social') {
            // La Baraja de Pactos son 20 cartas distintas (Protagonistas-2 §1).
            if (total < MINIMO_PACTOS) fallos.push(`faltan ${MINIMO_PACTOS - total} Pactos`);
        } else if (total < MINIMO_PRINCIPAL) {
            fallos.push(`faltan ${MINIMO_PRINCIPAL - total} eventos`);
        }
        return fallos;
    }, [entries, type, enPrincipal, total]);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={deck ? `Mazo: ${deck.name}` : 'Nuevo Mazo'} />

            <div className="space-y-4 p-6">
                {/* Cabecera */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/decks">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Layers className="h-7 w-7 text-yellow-400" />
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del mazo..."
                            className="w-72 text-lg font-bold"
                        />
                        <div className="flex overflow-hidden rounded-md border border-input">
                            {(['normal', 'eventos', 'social'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => cambiarTipo(t)}
                                    className={`px-3 py-1.5 text-sm font-bold transition-colors ${
                                        type === t ? 'bg-yellow-600 text-white' : 'text-yellow-200/60 hover:bg-yellow-600/10'
                                    }`}
                                >
                                    {t === 'normal' ? '🃏 Normal' : t === 'eventos' ? '⚡ Eventos' : '🤝 Social'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {aviso && <span className="text-sm font-bold text-red-400">⚠️ {aviso}</span>}
                        <Badge
                            title={problemas.length ? problemas.join(' · ') : 'Cumple el Reglamento §13'}
                            className={`border font-bold text-sm ${
                                problemas.length
                                    ? 'bg-slate-800 text-orange-200 border-orange-500/50'
                                    : 'bg-emerald-900/60 text-emerald-200 border-emerald-500/50'
                            }`}
                        >
                            {total} cartas{problemas.length ? ` · ${problemas.join(' · ')}` : ' · listo'}
                        </Badge>
                        {/* Solo tiene sentido descargar lo que ya esta guardado. */}
                        {deck && (
                            <Button variant="outline" asChild title="Descarga las hojas de rejilla para importar el mazo en Tabletop Simulator">
                                <a href={`/admin/decks/${deck.id}/tts`}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Exportar a TTS
                                </a>
                            </Button>
                        )}
                        <Button variant="magical" onClick={guardar} disabled={!name.trim()} className="bg-gradient-to-r from-yellow-600 to-orange-600 font-black shadow-lg shadow-orange-500/40">
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Mazo
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                    {/* Biblioteca */}
                    <Card className="border-2 border-amber-500/25 bg-slate-900/60">
                        <CardContent className="space-y-3 pt-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative min-w-48 flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar en la Biblioteca..." className="pl-9" />
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setTypeFilter('')}
                                        className={`rounded px-2 py-1 text-xs font-bold ${!typeFilter ? 'bg-yellow-600/30 text-yellow-200' : 'text-yellow-200/50 hover:bg-yellow-600/10'}`}
                                    >
                                        Todos
                                    </button>
                                    {tipos.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
                                            className={`rounded px-2 py-1 text-xs font-bold ${typeFilter === t ? 'bg-yellow-600/30 text-yellow-200' : 'text-yellow-200/50 hover:bg-yellow-600/10'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                {type === 'normal' && (
                                    <div className="flex overflow-hidden rounded-md border border-input text-xs">
                                        {(['principal', 'side'] as const).map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => setDestino(d)}
                                                title="A qué parte del mazo se añaden las cartas normales"
                                                className={`px-2 py-1 font-bold ${destino === d ? 'bg-purple-600/60 text-white' : 'text-purple-200/60 hover:bg-purple-600/20'}`}
                                            >
                                                {d === 'principal' ? '→ Principal' : '→ Side'}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Cuantas copias mete cada clic. Sin esto, montar un mazo
                                    de 25 eran 25 clics. */}
                                <div className="flex items-center gap-1 rounded-md border border-emerald-500/40 px-1.5 py-0.5 text-xs">
                                    <span className="font-bold text-emerald-200/70">Clic mete</span>
                                    {([1, 2, 3] as const).map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setLote(n)}
                                            title={`Cada clic en una carta mete ${n} ${n === 1 ? 'copia' : 'copias'}`}
                                            className={`h-6 w-6 rounded font-black transition-colors ${
                                                lote === n ? 'bg-emerald-500 text-slate-900' : 'text-emerald-200/60 hover:bg-emerald-600/20'
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={meterTodasLasVisibles}
                                    title="Mete al máximo de copias todas las cartas que ves ahora mismo"
                                    className="rounded-md border border-emerald-500/40 px-2 py-1 text-xs font-bold text-emerald-200/80 transition-colors hover:bg-emerald-600/20"
                                >
                                    ⧉ Meter todas al tope
                                </button>
                            </div>

                            {visibles.length === 0 ? (
                                <p className="py-12 text-center text-sm text-yellow-200/50">
                                    {library.length === 0
                                        ? 'La Biblioteca está vacía: crea cartas desde el Taller o desde Cartas TCG.'
                                        : 'Ninguna carta coincide con el filtro.'}
                                </p>
                            ) : (
                                /* Cartas grandes y limpias: la carta ya lleva su nombre y coste pintados */
                                <div className="grid max-h-[72vh] grid-cols-2 gap-4 overflow-y-auto pr-1 lg:grid-cols-3 2xl:grid-cols-4">
                                    {visibles.map((carta) => {
                                        const llevo = copiasDe(carta.id);
                                        const tope = limiteDeCopias(carta);
                                        const lleno = llevo >= tope;
                                        return (
                                            <div
                                                key={carta.id}
                                                onMouseEnter={() => setPreview(carta)}
                                                onMouseLeave={() => setPreview(null)}
                                                className={`group relative overflow-hidden rounded-xl border-2 bg-slate-800 transition-all hover:shadow-[0_0_22px_rgba(251,191,36,0.4)] ${
                                                    lleno ? 'border-emerald-500/70' : llevo > 0 ? 'border-yellow-500/60' : 'border-slate-600/50 hover:border-yellow-400/80'
                                                }`}
                                                style={{ aspectRatio: '5 / 7' }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => agregar(carta)}
                                                    title={`Meter ${lote} · llevas ${llevo} de ${tope}`}
                                                    className="absolute inset-0 h-full w-full cursor-pointer text-left"
                                                >
                                                    {carta.image ? (
                                                        <img src={carta.image} alt={carta.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-700 to-slate-900 p-3 text-center">
                                                            <span className="text-sm font-bold text-yellow-200/80">{carta.name}</span>
                                                            <span className="text-xs text-yellow-200/40">{carta.type}{carta.cost != null ? ` · Coste ${carta.cost}` : ''}</span>
                                                        </div>
                                                    )}
                                                    {carta.foil && <FoilOverlay />}
                                                </button>

                                                {/* Cuantas llevas de esta carta, siempre a la vista. */}
                                                {llevo > 0 && (
                                                    <span
                                                        className={`pointer-events-none absolute top-2 left-2 rounded-md px-2 py-0.5 text-sm font-black shadow-lg ${
                                                            lleno ? 'bg-emerald-500 text-slate-900' : 'bg-yellow-500 text-slate-900'
                                                        }`}
                                                    >
                                                        {llevo}/{tope}
                                                    </span>
                                                )}

                                                {/* Ajuste fino sin tener que ir al panel de la derecha. */}
                                                <div className="absolute inset-x-0 bottom-0 flex items-stretch opacity-0 transition-opacity group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        disabled={llevo === 0}
                                                        onClick={() => {
                                                            const e = entries.find((x) => x.card_id === carta.id);
                                                            if (e) quitar(e);
                                                        }}
                                                        title="Quitar una copia"
                                                        className="flex-1 bg-red-900/90 py-1.5 text-lg font-black text-white disabled:opacity-30 hover:bg-red-700"
                                                    >
                                                        −
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={lleno}
                                                        onClick={() => agregar(carta, tope - llevo)}
                                                        title={`Meter las ${tope - llevo} que faltan`}
                                                        className="flex-1 bg-emerald-800/90 py-1.5 text-[11px] font-black text-white disabled:opacity-30 hover:bg-emerald-600"
                                                    >
                                                        TOPE
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={lleno}
                                                        onClick={() => agregar(carta, 1)}
                                                        title="Meter una copia"
                                                        className="flex-1 bg-yellow-700/90 py-1.5 text-lg font-black text-white disabled:opacity-30 hover:bg-yellow-500 hover:text-slate-900"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Panel del mazo */}
                    <Card className="border-2 border-purple-500/30 bg-slate-900/70 lg:sticky lg:top-4 lg:self-start">
                        <CardContent className="space-y-4 pt-5">
                            {zonas.map(({ zone, titulo, icono }) => {
                                const deZona = entries.filter((e) => e.zone === zone);
                                const cuenta = deZona.reduce((a, e) => a + e.quantity, 0);
                                return (
                                    <div key={zone}>
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <h3 className="text-sm font-black text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                                {icono} {titulo}
                                            </h3>
                                            <span className="text-xs font-bold text-yellow-200/50">{cuenta}</span>
                                        </div>
                                        {deZona.length === 0 ? (
                                            <p className="rounded border border-dashed border-slate-600/60 px-2 py-1.5 text-xs text-yellow-200/35">
                                                {zone === 'protagonista' ? 'Añade un Protagonista desde la Biblioteca' : 'Vacío'}
                                            </p>
                                        ) : (
                                            <ul className="space-y-1">
                                                {deZona.map((entry) => {
                                                    const carta = porId.get(entry.card_id);
                                                    if (!carta) return null;
                                                    const tope = limiteDeCopias(carta);
                                                    return (
                                                        <li
                                                            key={`${entry.card_id}-${entry.zone}`}
                                                            onMouseEnter={() => setPreview(carta)}
                                                            onMouseLeave={() => setPreview(null)}
                                                            className="flex items-center gap-1.5 overflow-hidden rounded border border-slate-600/50 bg-slate-800/80 px-2 py-1"
                                                        >
                                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                                                                {carta.cost ?? '·'}
                                                            </span>
                                                            <span className="min-w-0 flex-1 truncate text-xs font-bold text-yellow-100">{carta.name}</span>
                                                            {/* Stepper: ajustar copias sin contar clics. */}
                                                            <div className="flex shrink-0 items-center gap-0.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => quitar(entry)}
                                                                    title="Una menos"
                                                                    className="h-5 w-5 rounded bg-red-900/70 text-xs font-black text-white hover:bg-red-600"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="w-7 text-center text-[11px] font-black text-yellow-200">
                                                                    {entry.quantity}
                                                                    <span className="text-yellow-200/40">/{tope}</span>
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    disabled={entry.quantity >= tope}
                                                                    onClick={() => ponerCantidad(entry, entry.quantity + 1)}
                                                                    title="Una más"
                                                                    className="h-5 w-5 rounded bg-emerald-900/70 text-xs font-black text-white disabled:opacity-25 hover:bg-emerald-600"
                                                                >
                                                                    +
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => ponerCantidad(entry, 0)}
                                                                    title="Quitar todas"
                                                                    className="h-5 w-5 rounded text-xs font-black text-red-400/70 hover:bg-red-900/50 hover:text-red-300"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Preview flotante de la carta bajo el cursor */}
            {preview && (
                /* Grande de verdad: a 256px el texto de la carta era ilegible.
                   Tope por viewport para que nunca se salga por arriba. */
                <div className="pointer-events-none fixed bottom-6 left-6 z-[9000]" style={{ width: 'min(440px, calc(82vh * 5 / 7))' }}>
                    {preview.image ? (
                        <div className="relative overflow-hidden rounded-xl">
                            <img src={preview.image} alt={preview.name} className="w-full rounded-xl border-4 border-yellow-500/70 shadow-[0_0_40px_rgba(251,191,36,0.5)]" />
                            {preview.foil && <FoilOverlay />}
                        </div>
                    ) : (
                        <div className="rounded-xl border-4 border-yellow-500/70 bg-slate-900 p-4 shadow-[0_0_40px_rgba(251,191,36,0.5)]">
                            <p className="font-black text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>{preview.name}</p>
                            <p className="mt-1 text-xs text-yellow-200/60">{preview.type} · Coste {preview.cost ?? '—'}</p>
                            <p className="mt-2 text-sm text-yellow-100/90">{preview.effect}</p>
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
