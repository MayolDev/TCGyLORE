import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import LoreShowHeader from '@/components/lore-show-header';
import MarkdownContent from '@/components/markdown-content';

interface Story {
    id: number;
    title: string;
    content: string;
    category: string;
    era: string | null;
    is_published: boolean;
    image_url: string | null;
    world: { id: number; name: string } | null;
    characters: { id: number; name: string }[];
}

const CATEGORIAS: Record<string, string> = {
    leyenda: '🏛️ Leyenda',
    cuento: '📖 Cuento',
    cronica: '📜 Crónica',
    biografia: '👤 Biografía',
    mito: '⚡ Mito',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Historias', href: '/admin/stories' },
    { title: 'Ver' },
];

export default function Show({ story }: { story: Story }) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={story.title} />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                <LoreShowHeader
                    image={story.image_url}
                    icon="📜"
                    title={story.title}
                    subtitle={story.era}
                    backHref="/admin/stories"
                    editHref={`/admin/stories/${story.id}/edit`}
                    badges={
                        <>
                            <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/50 font-bold">
                                {CATEGORIAS[story.category] ?? story.category}
                            </Badge>
                            {story.world && (
                                <Badge className="bg-blue-600/30 text-blue-200 border-blue-500/50 font-bold">
                                    🌍 {story.world.name}
                                </Badge>
                            )}
                            <Badge className={story.is_published ? 'bg-green-600/30 text-green-200 border-green-500/50 font-bold' : 'bg-slate-600/30 text-slate-300 border-slate-500/50 font-bold'}>
                                {story.is_published ? '✅ Publicada' : '📝 Borrador'}
                            </Badge>
                        </>
                    }
                />

                <Card className="border-2 border-amber-500/30 bg-slate-900/70">
                    <CardContent className="px-8 py-8 sm:px-12">
                        <MarkdownContent content={story.content} />
                    </CardContent>
                </Card>

                {story.characters.length > 0 && (
                    <Card className="border-2 border-purple-500/30 bg-slate-900/70">
                        <CardContent className="px-8 py-5">
                            <h2 className="mb-3 text-lg font-black text-purple-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                ⚔️ Personajes de esta historia
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {story.characters.map((c) => (
                                    <Link key={c.id} href={`/admin/characters/${c.id}`}>
                                        <Badge className="cursor-pointer bg-purple-600/20 text-purple-200 border-purple-500/40 font-bold hover:bg-purple-600/40 transition-colors">
                                            {c.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
