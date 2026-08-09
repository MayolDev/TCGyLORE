import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Search, Layers } from 'lucide-react';
import { useMemo, useState } from 'react';
import FoilOverlay from '@/components/foil-overlay';

interface LibraryCard {
    id: number;
    name: string;
    image: string | null;
    effect: string;
    cost: number | null;
    type: string;
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
    type: 'normal' | 'eventos';
    cards: DeckEntry[];
}

type Zone = 'protagonista' | 'senda' | 'principal' | 'side' | 'eventos';

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

/** Zona a la que va una carta según su tipo (y el destino elegido para las normales). */
function zonaParaCarta(carta: LibraryCard, tipoMazo: 'normal' | 'eventos', destino: 'principal' | 'side'): Zone | null {
    if (tipoMazo === 'eventos') {
        return carta.type === 'Evento' ? 'eventos' : null;
    }
    if (carta.type === 'Evento') return null; // los eventos van en su propio mazo
    if (carta.type === 'Protagonista') return 'protagonista';
    if (carta.type === 'Senda') return 'senda';
    return destino;
}

export default function Builder({ deck, library }: { deck: DeckData | null; library: LibraryCard[] }) {
    const [name, setName] = useState(deck?.name ?? '');
    const [type, setType] = useState<'normal' | 'eventos'>(deck?.type ?? 'normal');
    const [entries, setEntries] = useState<DeckEntry[]>(deck?.cards ?? []);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [destino, setDestino] = useState<'principal' | 'side'>('principal');
    const [preview, setPreview] = useState<LibraryCard | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);

    const porId = useMemo(() => new Map(library.map((c) => [c.id, c])), [library]);
    const tipos = useMemo(() => Array.from(new Set(library.map((c) => c.type))).sort(), [library]);

    const visibles = library.filter((c) => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (typeFilter && c.type !== typeFilter) return false;
        if (type === 'eventos' && c.type !== 'Evento') return false;
        return true;
    });

    const avisar = (msg: string) => {
        setAviso(msg);
        window.setTimeout(() => setAviso(null), 2500);
    };

    const agregar = (carta: LibraryCard) => {
        const zone = zonaParaCarta(carta, type, destino);
        if (!zone) {
            avisar(type === 'eventos' ? 'Un mazo de eventos solo admite cartas de tipo Evento' : 'Los Eventos van en su propio mazo de eventos');
            return;
        }
        if (zone === 'protagonista') {
            const yaHay = entries.find((e) => e.zone === 'protagonista');
            if (yaHay && yaHay.card_id !== carta.id) {
                avisar('Solo puede haber un Protagonista: quita el actual primero');
                return;
            }
            if (yaHay) return; // el mismo, ya está
        }
        setEntries((prev) => {
            const existente = prev.find((e) => e.card_id === carta.id && e.zone === zone);
            if (existente) {
                return prev.map((e) => (e === existente ? { ...e, quantity: e.quantity + 1 } : e));
            }
            return [...prev, { card_id: carta.id, zone, quantity: 1 }];
        });
    };

    const quitar = (entry: DeckEntry) => {
        setEntries((prev) =>
            prev
                .map((e) => (e === entry ? { ...e, quantity: e.quantity - 1 } : e))
                .filter((e) => e.quantity > 0),
        );
    };

    const guardar = () => {
        const payload = { name, description: deck?.description ?? null, type, cards: entries };
        if (deck) {
            router.put(`/admin/decks/${deck.id}`, payload);
        } else {
            router.post('/admin/decks', payload);
        }
    };

    const cambiarTipo = (nuevo: 'normal' | 'eventos') => {
        if (nuevo !== type && entries.length > 0 && !confirm('Cambiar el tipo vacía el mazo. ¿Seguro?')) return;
        if (nuevo !== type) setEntries([]);
        setType(nuevo);
    };

    const zonas = type === 'eventos' ? [{ zone: 'eventos' as Zone, titulo: 'Eventos', icono: '⚡' }] : ZONAS_NORMAL;
    const total = entries.reduce((acc, e) => acc + e.quantity, 0);

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
                            {(['normal', 'eventos'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => cambiarTipo(t)}
                                    className={`px-3 py-1.5 text-sm font-bold transition-colors ${
                                        type === t ? 'bg-yellow-600 text-white' : 'text-yellow-200/60 hover:bg-yellow-600/10'
                                    }`}
                                >
                                    {t === 'normal' ? '🃏 Normal' : '⚡ Eventos'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {aviso && <span className="text-sm font-bold text-red-400">⚠️ {aviso}</span>}
                        <Badge className="bg-slate-800 text-yellow-200 border-yellow-500/40 font-bold text-sm">{total} cartas</Badge>
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
                                    {visibles.map((carta) => (
                                        <button
                                            key={carta.id}
                                            type="button"
                                            onClick={() => agregar(carta)}
                                            onMouseEnter={() => setPreview(carta)}
                                            onMouseLeave={() => setPreview(null)}
                                            className="group relative overflow-hidden rounded-xl border-2 border-slate-600/50 bg-slate-800 text-left transition-all hover:border-yellow-400/80 hover:shadow-[0_0_22px_rgba(251,191,36,0.4)] hover:scale-[1.02]"
                                            style={{ aspectRatio: '5 / 7' }}
                                        >
                                            {carta.image ? (
                                                <img src={carta.image} alt={carta.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-700 to-slate-900 p-3 text-center">
                                                    <span className="text-sm font-bold text-yellow-200/80">{carta.name}</span>
                                                    <span className="text-xs text-yellow-200/40">{carta.type}{carta.cost != null ? ` · Coste ${carta.cost}` : ''}</span>
                                                </div>
                                            )}
                                            {carta.foil && <FoilOverlay />}
                                            <span className="absolute top-2 right-2 rounded-md bg-yellow-500 px-2 py-0.5 text-lg font-black text-slate-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                                +
                                            </span>
                                        </button>
                                    ))}
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
                                                    return (
                                                        <li key={`${entry.card_id}-${entry.zone}`}>
                                                            <button
                                                                type="button"
                                                                onClick={() => quitar(entry)}
                                                                onMouseEnter={() => setPreview(carta)}
                                                                onMouseLeave={() => setPreview(null)}
                                                                title="Clic para quitar una copia"
                                                                className="group flex w-full items-center gap-2 overflow-hidden rounded border border-slate-600/50 bg-slate-800/80 px-2 py-1 text-left transition-colors hover:border-red-500/70 hover:bg-red-950/40"
                                                            >
                                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                                                                    {carta.cost ?? '·'}
                                                                </span>
                                                                <span className="min-w-0 flex-1 truncate text-xs font-bold text-yellow-100">{carta.name}</span>
                                                                {entry.quantity > 1 && (
                                                                    <span className="rounded bg-yellow-500/90 px-1 text-[10px] font-black text-slate-900">x{entry.quantity}</span>
                                                                )}
                                                                <span className="text-xs font-black text-red-400 opacity-0 transition-opacity group-hover:opacity-100">−</span>
                                                            </button>
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
