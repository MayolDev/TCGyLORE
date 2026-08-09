import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import LoreShowHeader from '@/components/lore-show-header';
import MarkdownContent from '@/components/markdown-content';
import LightboxImage from '@/components/lightbox-image';

interface World {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    image_url: string | null;
    map_image_url: string;
    stories_count: number;
    characters_count: number;
    locations_count: number;
    cards_count: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mundos', href: '/admin/worlds' },
    { title: 'Ver' },
];

export default function Show({ world }: { world: World }) {
    const stats = [
        { label: 'Historias', icon: '📜', count: world.stories_count, href: `/admin/stories?world_id=${world.id}` },
        { label: 'Personajes', icon: '⚔️', count: world.characters_count, href: `/admin/characters?world_id=${world.id}` },
        { label: 'Ubicaciones', icon: '📍', count: world.locations_count, href: `/admin/locations?world_id=${world.id}` },
        { label: 'Cartas', icon: '🃏', count: world.cards_count, href: `/admin/cards?world_id=${world.id}` },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={world.name} />

            <div className="space-y-6 p-6">
                <LoreShowHeader
                    image={world.image_url}
                    icon="🌍"
                    title={world.name}
                    backHref="/admin/worlds"
                    editHref={`/admin/worlds/${world.id}/edit`}
                    badges={
                        <Badge className={world.is_active ? 'bg-green-600/30 text-green-200 border-green-500/50 font-bold' : 'bg-slate-600/30 text-slate-300 border-slate-500/50 font-bold'}>
                            {world.is_active ? '✅ Activo' : '💤 Inactivo'}
                        </Badge>
                    }
                />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {stats.map((s) => (
                        <Link key={s.label} href={s.href}>
                            <Card className="border-2 border-amber-500/25 bg-slate-900/70 transition-all hover:border-amber-400/60 hover:scale-105">
                                <CardContent className="py-4 text-center">
                                    <div className="text-2xl">{s.icon}</div>
                                    <div className="text-2xl font-black text-yellow-300" style={{ fontFamily: 'Cinzel, serif' }}>{s.count}</div>
                                    <div className="text-xs font-semibold text-yellow-200/60 uppercase">{s.label}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {world.description && (
                    <Card className="border-2 border-amber-500/30 bg-slate-900/70">
                        <CardContent className="px-8 py-8 sm:px-12">
                            <MarkdownContent content={world.description} />
                        </CardContent>
                    </Card>
                )}

                <Card className="border-2 border-blue-500/30 bg-slate-900/70">
                    <CardContent className="px-8 py-6">
                        <h2 className="mb-4 text-xl font-black text-blue-200" style={{ fontFamily: 'Cinzel, serif' }}>
                            🗺️ Mapa del Mundo
                        </h2>
                        <LightboxImage
                            src={world.map_image_url}
                            alt={`Mapa de ${world.name}`}
                            className="w-full rounded-lg border-2 border-amber-500/40"
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
