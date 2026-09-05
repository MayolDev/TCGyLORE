import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import MarkdownContent from '@/components/markdown-content';
import LightboxImage from '@/components/lightbox-image';
import FoilOverlay from '@/components/foil-overlay';
import { ArrowLeft, Link2, Pencil, Swords, Users } from 'lucide-react';

interface Relacion {
    id: number;
    tipo: string;
    notas: string | null;
    personaje: { id: number; name: string; title: string | null; image_url: string | null };
}

interface Carta {
    id: number;
    name: string;
    illustration_url: string | null;
    /** Presente cuando la carta vino del Taller: la ilustracion ES la carta entera. */
    taller_data?: unknown;
    is_foil?: boolean;
    cost: number | null;
    card_type: { id: number; name: string } | null;
    rarity: { id: number; name: string } | null;
}

interface Character {
    id: number;
    name: string;
    title: string | null;
    biography: string | null;
    spells: string | null;
    faction: string | null;
    alignment: string | null;
    image_url: string | null;
    worlds: { id: number; name: string }[];
    locations: { id: number; name: string }[];
    stories: { id: number; title: string }[];
    cards: Carta[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Personajes', href: '/admin/characters' },
    { title: 'Ficha', href: '#' },
];

/**
 * Las biografías importadas del documento de worldbuilding abren con el
 * epíteto del personaje. Se saca del cuerpo para lucirlo bajo el nombre en
 * vez de repetirlo dentro del texto.
 *
 * El documento no es coherente: unas fichas lo traen como encabezado de
 * nivel 3 y otras (la mayoría) como una línea suelta en negrita. Se admiten
 * las dos, y solo si esa línea abre la biografía.
 */
function separarEpiteto(bio: string | null): { epiteto: string | null; cuerpo: string } {
    if (!bio) return { epiteto: null, cuerpo: '' };

    // Tres formas en el mismo documento: encabezado de cualquier nivel,
    // encabezado con la negrita dentro, o una línea suelta en negrita.
    const cabecera = bio.trimStart().split(/\r?\n/)[0].trim();
    const m = cabecera.match(/^#{1,3}\s*\**\s*(.+?)\s*\**$/) ?? cabecera.match(/^\*\*([^*]+)\*\*$/);
    if (!m) return { epiteto: null, cuerpo: bio };

    // «Preludio» y compañía son secciones del documento, no el epíteto.
    const SECCIONES = ['preludio', 'biografia', 'biografía', 'descripcion', 'descripción'];
    if (SECCIONES.includes(m[1].replace(/\*\*/g, '').trim().toLowerCase())) {
        return { epiteto: null, cuerpo: bio };
    }

    return {
        epiteto: m[1].replace(/\*\*/g, '').replace(/<\/?u>/g, '').trim(),
        cuerpo: bio.replace(cabecera, '').trim(),
    };
}

export default function Show({ character, relaciones }: { character: Character; relaciones: Relacion[] }) {
    const { epiteto, cuerpo } = separarEpiteto(character.biography);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={character.name} />

            <div className="p-4 sm:p-6">
                <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">

                    {/* ── Retrato, identidad y vínculos ── */}
                    <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
                        <div className="overflow-hidden rounded-xl border-4 border-amber-500/50 bg-slate-900 shadow-[0_0_45px_rgba(251,191,36,0.28)]">
                            {character.image_url ? (
                                <LightboxImage src={character.image_url} alt={character.name} className="w-full" />
                            ) : (
                                <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-purple-900/50 via-slate-900 to-amber-900/40">
                                    <Users className="h-20 w-20 text-yellow-500/40" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 text-center">
                            <h1
                                className="text-3xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.45)]"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {character.name}
                            </h1>
                            {(epiteto || character.title) && (
                                <p className="text-base font-semibold italic text-yellow-200/75">
                                    {epiteto ?? character.title}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {character.worlds.map((w) => (
                                <Badge key={w.id} className="border-blue-500/50 bg-blue-600/25 font-bold text-blue-200">🌍 {w.name}</Badge>
                            ))}
                            {character.faction && (
                                <Badge className="border-red-500/50 bg-red-600/25 font-bold text-red-200">🚩 {character.faction}</Badge>
                            )}
                            {character.alignment && (
                                <Badge className="border-emerald-500/50 bg-emerald-600/25 font-bold text-emerald-200">☯️ {character.alignment}</Badge>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild className="flex-1 border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                <Link href="/admin/characters">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Personajes
                                </Link>
                            </Button>
                            <Button size="sm" asChild className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 font-bold text-white shadow-lg shadow-orange-500/40 hover:from-yellow-500 hover:to-orange-500">
                                <Link href={`/admin/characters/${character.id}/edit`}>
                                    <Pencil className="mr-1 h-4 w-4" />
                                    Editar
                                </Link>
                            </Button>
                        </div>

                        {(character.locations.length > 0 || character.stories.length > 0) && (
                            <Card className="border-2 border-purple-500/25 bg-slate-900/70">
                                <CardContent className="space-y-3 py-4">
                                    {character.locations.length > 0 && (
                                        <div>
                                            <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-rose-300/80">📍 Ubicaciones</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {character.locations.map((l) => (
                                                    <Link key={l.id} href={`/admin/locations/${l.id}`}>
                                                        <Badge className="cursor-pointer border-rose-500/40 bg-rose-600/20 text-rose-200 transition-colors hover:bg-rose-600/40">{l.name}</Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {character.stories.length > 0 && (
                                        <div>
                                            <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-purple-300/80">📜 Aparece en</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {character.stories.map((s) => (
                                                    <Link key={s.id} href={`/admin/stories/${s.id}`}>
                                                        <Badge className="cursor-pointer border-purple-500/40 bg-purple-600/20 text-purple-200 transition-colors hover:bg-purple-600/40">{s.title}</Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </aside>

                    {/* ── Su historia ── */}
                    <div className="min-w-0 space-y-5">
                        {character.cards.length > 0 && (
                            <Card className="border-2 border-yellow-500/25 bg-slate-900/70">
                                <CardContent className="px-6 py-6 sm:px-8">
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                        <Swords className="h-5 w-5" />
                                        En la Biblioteca
                                        <span className="text-sm font-semibold text-yellow-200/50">
                                            ({character.cards.length} {character.cards.length === 1 ? 'carta' : 'cartas'})
                                        </span>
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {character.cards.map((c) =>
                                            c.taller_data && c.illustration_url ? (
                                                /* Carta del Taller: se ensena tal cual se diseno. */
                                                <Link
                                                    key={c.id}
                                                    href={`/admin/cards/${c.id}/edit`}
                                                    title={`Editar ${c.name}`}
                                                    className="group relative overflow-hidden rounded-xl border-2 border-transparent transition-all hover:scale-[1.03] hover:border-yellow-400/70 hover:shadow-[0_0_30px_rgba(251,191,36,0.35)]"
                                                >
                                                    <img src={c.illustration_url} alt={c.name} className="w-full" loading="lazy" />
                                                    {c.is_foil && <FoilOverlay />}
                                                </Link>
                                            ) : (
                                                <Link
                                                    key={c.id}
                                                    href={`/admin/cards/${c.id}/edit`}
                                                    title={`Editar ${c.name}`}
                                                    className="group overflow-hidden rounded-xl border-2 border-yellow-500/20 bg-slate-950/60 transition-all hover:border-yellow-400/60 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)]"
                                                >
                                                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900 to-amber-900/30">
                                                        {c.illustration_url ? (
                                                            <img src={c.illustration_url} alt={c.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center">
                                                                <Swords className="h-12 w-12 text-yellow-500/25" />
                                                            </div>
                                                        )}
                                                        {c.cost !== null && (
                                                            <div className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-500/40 bg-slate-950/85 text-sm font-black text-yellow-200">
                                                                {c.cost}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="px-3 py-2">
                                                        <p className="truncate text-sm font-bold text-yellow-100">{c.name}</p>
                                                        <p className="truncate text-xs text-yellow-200/50">
                                                            {[c.card_type?.name, c.rarity?.name].filter(Boolean).join(' · ') || 'Sin tipo'}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {relaciones.length > 0 && (
                            <Card className="border-2 border-rose-500/25 bg-slate-900/70">
                                <CardContent className="px-6 py-6 sm:px-8">
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-rose-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                        <Link2 className="h-5 w-5" />
                                        Relaciones
                                        <span className="text-sm font-semibold text-rose-200/50">({relaciones.length})</span>
                                    </h2>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {relaciones.map((r) => (
                                            <Link
                                                key={r.id}
                                                href={`/admin/characters/${r.personaje.id}`}
                                                className="group flex items-center gap-3 rounded-lg border border-rose-500/20 bg-slate-950/50 p-3 transition-all hover:border-rose-400/60 hover:bg-slate-900"
                                            >
                                                {r.personaje.image_url ? (
                                                    <img
                                                        src={r.personaje.image_url}
                                                        alt={r.personaje.name}
                                                        className="h-14 w-14 shrink-0 rounded-full border-2 border-rose-500/40 object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-rose-500/30 bg-slate-900">
                                                        <Users className="h-6 w-6 text-rose-300/40" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black uppercase tracking-wider text-rose-300/80">{r.tipo}</p>
                                                    <p className="truncate font-bold text-yellow-100 group-hover:text-yellow-50">{r.personaje.name}</p>
                                                    {r.notas && <p className="truncate text-xs text-yellow-200/45">{r.notas}</p>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {cuerpo && (
                            <Card className="border-2 border-amber-500/25 bg-slate-900/70">
                                <CardContent className="px-6 py-7 sm:px-10">
                                    <MarkdownContent content={cuerpo} />
                                </CardContent>
                            </Card>
                        )}

                        {character.spells && (
                            <Card className="border-2 border-indigo-500/25 bg-slate-900/70">
                                <CardContent className="px-6 py-6 sm:px-10">
                                    <h2 className="mb-3 text-xl font-black text-indigo-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                        ✨ Hechizos y habilidades
                                    </h2>
                                    <MarkdownContent content={character.spells} />
                                </CardContent>
                            </Card>
                        )}

                        {!cuerpo && !character.spells && character.cards.length === 0 && relaciones.length === 0 && (
                            <Card className="border-2 border-dashed border-amber-500/25 bg-slate-900/50">
                                <CardContent className="py-16 text-center">
                                    <p className="font-semibold text-yellow-200/50">Este personaje aún no tiene biografía.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
