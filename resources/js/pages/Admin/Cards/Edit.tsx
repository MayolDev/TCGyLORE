import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import LightboxImage from '@/components/lightbox-image';
import FoilOverlay from '@/components/foil-overlay';
import { ArrowLeft, Hammer, Save, Trash2 } from 'lucide-react';

interface World {
    id: number;
    name: string;
}

interface Character {
    id: number;
    name: string;
}

interface Taxonomy {
    id: number;
    name: string;
}

interface CardLogEntry {
    id: number;
    action: string;
    source: string;
    user_name: string | null;
    changes: Record<string, { de: unknown; a: unknown } | string> | null;
    created_at: string;
}

interface CardData {
    id: number;
    world_id: number;
    character_id: number | null;
    name: string;
    illustration: string | null;
    illustration_url: string | null;
    taller_data?: unknown;
    is_foil?: boolean;
    effect: string;
    cost: number;
    card_type_id: number | null;
    rarity_id: number | null;
    archetype_id: number | null;
    alignment_id: number | null;
    faction_id: number | null;
    edition_id: number | null;
    artist_id: number | null;
    flavor_text: string | null;
    strength: number | null;
    agility: number | null;
    charisma: number | null;
    mind: number | null;
    defense: number | null;
    magic_defense: number | null;
    health: number | null;
    logs?: CardLogEntry[];
}

interface Props {
    card: CardData;
    worlds: World[];
    characters: Character[];
    cardTypes: Taxonomy[];
    rarities: Taxonomy[];
    archetypes: Taxonomy[];
    alignments: Taxonomy[];
    factions: Taxonomy[];
    editions: Taxonomy[];
    artists: Taxonomy[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Biblioteca', href: '/admin/cards' },
    { title: 'Editar carta' },
];

const ACCION_ICONO: Record<string, string> = { creada: '✨', actualizada: '✏️', eliminada: '🗑️' };

/** Historial de cambios de la carta: qué se tocó, cuándo y desde dónde. */
function HistorialCarta({ logs }: { logs?: CardLogEntry[] }) {
    if (!logs || logs.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-lg border border-yellow-500/25 bg-slate-900/70">
            <p className="border-b border-yellow-500/20 bg-slate-900 px-4 py-2.5 text-sm font-black text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>
                📜 Historial de cambios
            </p>
            <ul className="max-h-72 divide-y divide-slate-800 overflow-y-auto">
                {logs.map((log) => (
                    <li key={log.id} className="px-4 py-2.5 text-sm">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-yellow-100">
                                {ACCION_ICONO[log.action] ?? '•'} {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                <span className="ml-1.5 text-xs font-semibold text-yellow-200/50">
                                    por <span className="text-yellow-200/80">{log.user_name ?? 'desconocido'}</span> · {log.source}
                                </span>
                            </span>
                            <span className="shrink-0 text-xs text-yellow-200/50">
                                {new Date(log.created_at).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        {log.changes && (
                            <ul className="mt-1 space-y-0.5">
                                {Object.entries(log.changes).map(([campo, cambio]) => (
                                    <li key={campo} className="text-xs text-yellow-200/70">
                                        <span className="font-semibold text-yellow-200/90">{campo}</span>
                                        {typeof cambio === 'string'
                                            ? `: ${cambio}`
                                            : <>: <span className="text-red-300/80 line-through">{String(cambio.de ?? '—')}</span> → <span className="text-green-300/90">{String(cambio.a ?? '—')}</span></>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Panel plegable con la voz visual del taller: cabecera dorada, cuerpo oscuro. */
function Seccion({ titulo, abierta = false, children }: { titulo: string; abierta?: boolean; children: React.ReactNode }) {
    return (
        <details open={abierta} className="group overflow-hidden rounded-lg border border-yellow-500/25 bg-slate-900/70">
            <summary
                className="cursor-pointer select-none border-b border-transparent bg-slate-900 px-4 py-2.5 text-sm font-black text-yellow-200 transition-colors group-open:border-yellow-500/20 hover:bg-slate-800"
                style={{ fontFamily: 'Cinzel, serif' }}
            >
                {titulo}
            </summary>
            <div className="space-y-4 p-4">{children}</div>
        </details>
    );
}

export default function Edit({ card, worlds, characters, cardTypes, rarities, archetypes, alignments, factions, editions, artists }: Props) {
    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'PUT',
        world_id: card.world_id.toString(),
        character_id: card.character_id?.toString() || '0',
        name: card.name || '',
        illustration: null as File | null,
        effect: card.effect || '',
        cost: card.cost.toString(),
        card_type_id: card.card_type_id?.toString() || '',
        rarity_id: card.rarity_id?.toString() || '',
        archetype_id: card.archetype_id?.toString() || '0',
        alignment_id: card.alignment_id?.toString() || '',
        faction_id: card.faction_id?.toString() || '0',
        edition_id: card.edition_id?.toString() || '0',
        artist_id: card.artist_id?.toString() || '0',
        flavor_text: card.flavor_text || '',
        strength: card.strength?.toString() || '',
        agility: card.agility?.toString() || '',
        charisma: card.charisma?.toString() || '',
        mind: card.mind?.toString() || '',
        defense: card.defense?.toString() || '',
        magic_defense: card.magic_defense?.toString() || '',
        health: card.health?.toString() || '',
    });

    // '0' = "Ninguno" en los selects opcionales; el backend espera null.
    transform((datos) => ({
        ...datos,
        character_id: datos.character_id === '0' ? null : datos.character_id,
        archetype_id: datos.archetype_id === '0' ? null : datos.archetype_id,
        faction_id: datos.faction_id === '0' ? null : datos.faction_id,
        edition_id: datos.edition_id === '0' ? null : datos.edition_id,
        artist_id: datos.artist_id === '0' ? null : datos.artist_id,
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/cards/${card.id}`, { forceFormData: true });
    };

    const eliminar = () => {
        if (confirm(`¿Eliminar la carta "${card.name}"? Esta acción no tiene vuelta atrás.`)) {
            router.delete(`/admin/cards/${card.id}`);
        }
    };

    const taxonomia = (
        id: string,
        etiqueta: string,
        valor: string,
        opciones: Taxonomy[],
        campo: 'card_type_id' | 'rarity_id' | 'alignment_id' | 'archetype_id' | 'faction_id' | 'edition_id' | 'artist_id',
        opcional = false,
    ) => (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-xs text-yellow-200/70">{etiqueta}</Label>
            <Select value={valor} onValueChange={(v) => setData(campo, v)}>
                <SelectTrigger id={id}>
                    <SelectValue placeholder={etiqueta} />
                </SelectTrigger>
                <SelectContent>
                    {opcional && <SelectItem value="0">Ninguno</SelectItem>}
                    {opciones.map((o) => (
                        <SelectItem key={o.id} value={o.id.toString()}>
                            {o.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputError message={errors[campo]} />
        </div>
    );

    const stat = (id: keyof typeof data & string, etiqueta: string) => (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-xs text-yellow-200/70">{etiqueta}</Label>
            <Input id={id} type="number" value={data[id] as string} onChange={(e) => setData(id, e.target.value)} placeholder="—" />
            <InputError message={errors[id]} />
        </div>
    );

    // Las cartas del Taller no se editan aquí: el taller es la mesa de
    // trabajo. Esta vista solo enseña, manda al taller o elimina.
    if (card.taller_data) {
        return (
            <AdminLayout breadcrumbs={breadcrumbs}>
                <Head title={card.name} />

                <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 p-6 lg:flex-row">
                    <div className="w-full max-w-sm shrink-0">
                        {card.illustration_url && (
                            <div className="relative overflow-hidden rounded-xl">
                                <LightboxImage
                                    src={card.illustration_url}
                                    alt={card.name}
                                    className="w-full rounded-xl border-2 border-yellow-500/40 shadow-[0_0_35px_rgba(251,191,36,0.25)]"
                                />
                                {card.is_foil && <FoilOverlay />}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-400" style={{ fontFamily: 'Cinzel, serif' }}>
                            {card.name}
                        </h1>
                        <div className="rounded-lg border border-yellow-500/25 bg-slate-900/70 p-4">
                            <p className="text-sm font-semibold text-yellow-200/80">
                                🔨 Esta carta nació en el <strong>Taller</strong> y se edita allí.
                            </p>
                            <p className="mt-2 text-sm text-yellow-200/60">
                                Pulsa <strong>«Abrir en el Taller»</strong>: la carta se carga allí tal cual. Haz los cambios,
                                dale a <strong>«📚 Guardar en Biblioteca»</strong> y esta carta se actualizará sola, render
                                nuevo incluido.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild className="bg-gradient-to-r from-yellow-600 to-orange-600 font-black text-white shadow-lg shadow-orange-500/40 hover:from-yellow-500 hover:to-orange-500">
                                <Link href={`/admin/cards-taller?card=${card.id}`}>
                                    <Hammer className="mr-2 h-4 w-4" />
                                    Abrir en el Taller
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                <Link href="/admin/cards">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver a la Biblioteca
                                </Link>
                            </Button>
                            <Button variant="outline" onClick={eliminar} className="border-red-500/50 text-red-300 hover:bg-red-600/20">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </Button>
                        </div>
                        <HistorialCarta logs={card.logs} />
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${card.name}`} />

            <form onSubmit={submit} className="p-4">
                <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
                    {/* La carta, grande y al mando — como en el taller */}
                    <div className="space-y-3 lg:sticky lg:top-4 lg:self-start">
                        {card.illustration_url ? (
                            <LightboxImage
                                src={card.illustration_url}
                                alt={card.name}
                                className="w-full rounded-xl border-2 border-yellow-500/40 shadow-[0_0_35px_rgba(251,191,36,0.25)]"
                            />
                        ) : (
                            <div className="flex aspect-[5/7] w-full items-center justify-center rounded-xl border-2 border-dashed border-yellow-500/30 bg-slate-900/70 p-6 text-center">
                                <p className="text-sm font-semibold text-yellow-200/50">
                                    Sin imagen. Súbela en «Ilustración» o crea la carta en el Taller.
                                </p>
                            </div>
                        )}

                        <Button type="submit" size="lg" disabled={processing} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 font-black text-white shadow-lg shadow-orange-500/40 hover:from-yellow-500 hover:to-orange-500">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando…' : 'Guardar Carta'}
                        </Button>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" asChild className="flex-1 border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                <Link href="/admin/cards">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Biblioteca
                                </Link>
                            </Button>
                            <Button type="button" variant="outline" size="sm" asChild className="flex-1 border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                <Link href="/admin/cards-taller">
                                    <Hammer className="mr-1 h-4 w-4" />
                                    Taller
                                </Link>
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={eliminar} className="border-red-500/50 text-red-300 hover:bg-red-600/20">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Inspector, estilo taller */}
                    <div className="min-w-0 space-y-3">
                        <Seccion titulo="🃏 Identidad" abierta>
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs text-yellow-200/70">Nombre *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nombre épico de la carta..." className="text-lg font-bold" />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="cost" className="text-xs text-yellow-200/70">Coste *</Label>
                                    <Input id="cost" type="number" value={data.cost} onChange={(e) => setData('cost', e.target.value)} placeholder="0" />
                                    <InputError message={errors.cost} />
                                </div>
                                {taxonomia('card_type_id', 'Tipo *', data.card_type_id, cardTypes, 'card_type_id')}
                                {taxonomia('rarity_id', 'Rareza *', data.rarity_id, rarities, 'rarity_id')}
                                {taxonomia('alignment_id', 'Alineación *', data.alignment_id, alignments, 'alignment_id')}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="world_id" className="text-xs text-yellow-200/70">Mundo *</Label>
                                    <Select value={data.world_id} onValueChange={(v) => setData('world_id', v)}>
                                        <SelectTrigger id="world_id">
                                            <SelectValue placeholder="Mundo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {worlds.map((w) => (
                                                <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.world_id} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="character_id" className="text-xs text-yellow-200/70">Personaje (opcional)</Label>
                                    <Select value={data.character_id} onValueChange={(v) => setData('character_id', v)}>
                                        <SelectTrigger id="character_id">
                                            <SelectValue placeholder="Ninguno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Ninguno</SelectItem>
                                            {characters.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.character_id} />
                                </div>
                            </div>
                        </Seccion>

                        <Seccion titulo="📜 Efecto y cita" abierta>
                            <div className="space-y-1.5">
                                <Label htmlFor="effect" className="text-xs text-yellow-200/70">Efecto * — ***negrita***, --- separador</Label>
                                <Textarea
                                    id="effect"
                                    value={data.effect}
                                    onChange={(e) => setData('effect', e.target.value)}
                                    placeholder="***Habilidad:*** al entrar en juego..."
                                    className="min-h-[160px] resize-y font-mono text-sm leading-relaxed"
                                />
                                <InputError message={errors.effect} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="flavor_text" className="text-xs text-yellow-200/70">Texto de sabor</Label>
                                <Textarea
                                    id="flavor_text"
                                    value={data.flavor_text}
                                    onChange={(e) => setData('flavor_text', e.target.value)}
                                    placeholder="«Una cita con mala idea...»"
                                    rows={2}
                                    className="resize-y italic"
                                />
                                <InputError message={errors.flavor_text} />
                            </div>
                        </Seccion>

                        <Seccion titulo="⚔️ Atributos">
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                                {stat('strength', '💪 Fuerza')}
                                {stat('agility', '⚡ Agilidad')}
                                {stat('charisma', '✨ Carisma')}
                                {stat('mind', '🧠 Mente')}
                                {stat('defense', '🛡️ Defensa')}
                                {stat('magic_defense', '🔮 Def. Mágica')}
                                {stat('health', '❤️ Vida')}
                            </div>
                        </Seccion>

                        <Seccion titulo="🏷️ Taxonomías extra">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {taxonomia('archetype_id', 'Arquetipo', data.archetype_id, archetypes, 'archetype_id', true)}
                                {taxonomia('faction_id', 'Facción', data.faction_id, factions, 'faction_id', true)}
                                {taxonomia('edition_id', 'Edición', data.edition_id, editions, 'edition_id', true)}
                                {taxonomia('artist_id', 'Artista', data.artist_id, artists, 'artist_id', true)}
                            </div>
                        </Seccion>

                        <Seccion titulo="🖼️ Ilustración">
                            <div className="space-y-1.5">
                                <Input
                                    id="illustration"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('illustration', e.target.files?.[0] || null)}
                                />
                                <p className="text-xs text-yellow-200/50">
                                    {card.taller_data
                                        ? 'Esta carta vino del Taller: su imagen es la carta entera renderizada. Si la reemplazas aquí, perderás ese render (puedes regenerarlo desde el Taller).'
                                        : 'Sustituye la imagen actual. Formato vertical 5:7 recomendado.'}
                                </p>
                                <InputError message={errors.illustration} />
                            </div>
                        </Seccion>

                        <HistorialCarta logs={card.logs} />
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
