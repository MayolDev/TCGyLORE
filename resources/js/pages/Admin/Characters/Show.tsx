import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import MarkdownContent from '@/components/markdown-content';
import LightboxImage from '@/components/lightbox-image';
import { ArrowLeft, Pencil, Users } from 'lucide-react';

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
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Personajes', href: '/admin/characters' },
    { title: 'Ficha', href: '#' },
];

/**
 * Las biografías importadas del documento de worldbuilding abren con el
 * epíteto del personaje como encabezado de nivel 3. Se saca del cuerpo para
 * lucirlo bajo el nombre en vez de repetirlo dentro del texto.
 */
function separarEpiteto(bio: string | null): { epiteto: string | null; cuerpo: string } {
    if (!bio) return { epiteto: null, cuerpo: '' };
    const m = bio.match(/^\s*###\s+(.+?)\s*$/m);
    if (!m || bio.indexOf(m[0]) > 120) return { epiteto: null, cuerpo: bio };
    return {
        epiteto: m[1].replace(/\*\*/g, '').replace(/<\/?u>/g, '').trim(),
        cuerpo: bio.replace(m[0], '').trim(),
    };
}

export default function Show({ character }: { character: Character }) {
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

                        {!cuerpo && !character.spells && (
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
