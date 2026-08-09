import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import LoreShowHeader from '@/components/lore-show-header';
import MarkdownContent from '@/components/markdown-content';

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
    { title: 'Ver' },
];

export default function Show({ character }: { character: Character }) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={character.name} />

            <div className="space-y-6 p-6">
                <LoreShowHeader
                    image={character.image_url}
                    icon="⚔️"
                    title={character.name}
                    subtitle={character.title}
                    backHref="/admin/characters"
                    editHref={`/admin/characters/${character.id}/edit`}
                    badges={
                        <>
                            {character.worlds.map((w) => (
                                <Badge key={w.id} className="bg-blue-600/30 text-blue-200 border-blue-500/50 font-bold">🌍 {w.name}</Badge>
                            ))}
                            {character.faction && (
                                <Badge className="bg-red-600/30 text-red-200 border-red-500/50 font-bold">🚩 {character.faction}</Badge>
                            )}
                            {character.alignment && (
                                <Badge className="bg-emerald-600/30 text-emerald-200 border-emerald-500/50 font-bold">☯️ {character.alignment}</Badge>
                            )}
                        </>
                    }
                />

                {character.biography && (
                    <Card className="border-2 border-amber-500/30 bg-slate-900/70">
                        <CardContent className="px-8 py-8 sm:px-12">
                            <h2 className="mb-4 text-xl font-black text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                📖 Biografía
                            </h2>
                            <MarkdownContent content={character.biography} />
                        </CardContent>
                    </Card>
                )}

                {character.spells && (
                    <Card className="border-2 border-indigo-500/30 bg-slate-900/70">
                        <CardContent className="px-8 py-6 sm:px-12">
                            <h2 className="mb-4 text-xl font-black text-indigo-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                ✨ Hechizos y Habilidades
                            </h2>
                            <MarkdownContent content={character.spells} />
                        </CardContent>
                    </Card>
                )}

                {(character.locations.length > 0 || character.stories.length > 0) && (
                    <Card className="border-2 border-purple-500/30 bg-slate-900/70">
                        <CardContent className="space-y-4 px-8 py-5">
                            {character.locations.length > 0 && (
                                <div>
                                    <h2 className="mb-2 text-lg font-black text-rose-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                        📍 Ubicaciones
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {character.locations.map((l) => (
                                            <Link key={l.id} href={`/admin/locations/${l.id}`}>
                                                <Badge className="cursor-pointer bg-rose-600/20 text-rose-200 border-rose-500/40 font-bold hover:bg-rose-600/40 transition-colors">
                                                    {l.name}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {character.stories.length > 0 && (
                                <div>
                                    <h2 className="mb-2 text-lg font-black text-purple-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                        📜 Aparece en
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {character.stories.map((s) => (
                                            <Link key={s.id} href={`/admin/stories/${s.id}`}>
                                                <Badge className="cursor-pointer bg-purple-600/20 text-purple-200 border-purple-500/40 font-bold hover:bg-purple-600/40 transition-colors">
                                                    {s.title}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
