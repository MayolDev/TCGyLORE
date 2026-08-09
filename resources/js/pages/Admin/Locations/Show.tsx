import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import LoreShowHeader from '@/components/lore-show-header';
import MarkdownContent from '@/components/markdown-content';
import { LOCATION_TYPES } from '@/components/map-view';

interface Location {
    id: number;
    name: string;
    description: string | null;
    location_type: string;
    coordinate_x: number | null;
    coordinate_y: number | null;
    is_discovered: boolean;
    image_url: string | null;
    world: { id: number; name: string } | null;
    characters: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ubicaciones', href: '/admin/locations' },
    { title: 'Ver' },
];

export default function Show({ location }: { location: Location }) {
    const tipo = LOCATION_TYPES[location.location_type as keyof typeof LOCATION_TYPES];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={location.name} />

            <div className="mx-auto max-w-4xl space-y-6 p-6">
                <LoreShowHeader
                    image={location.image_url}
                    icon={tipo?.icon ?? '📍'}
                    title={location.name}
                    backHref="/admin/locations"
                    editHref={`/admin/locations/${location.id}/edit`}
                    badges={
                        <>
                            <Badge className="bg-rose-600/30 text-rose-200 border-rose-500/50 font-bold">
                                {tipo?.icon} {tipo?.label ?? location.location_type}
                            </Badge>
                            {location.world && (
                                <Badge className="bg-blue-600/30 text-blue-200 border-blue-500/50 font-bold">🌍 {location.world.name}</Badge>
                            )}
                            {location.coordinate_x != null && location.coordinate_y != null && (
                                <Badge className="bg-amber-600/30 text-amber-200 border-amber-500/50 font-bold">
                                    🧭 ({Math.round(location.coordinate_x)}, {Math.round(location.coordinate_y)})
                                </Badge>
                            )}
                            <Badge className={location.is_discovered ? 'bg-green-600/30 text-green-200 border-green-500/50 font-bold' : 'bg-slate-600/30 text-slate-300 border-slate-500/50 font-bold'}>
                                {location.is_discovered ? '🔍 Descubierta' : '🌫️ Sin descubrir'}
                            </Badge>
                        </>
                    }
                />

                {location.description && (
                    <Card className="border-2 border-amber-500/30 bg-slate-900/70">
                        <CardContent className="px-8 py-8 sm:px-12">
                            <MarkdownContent content={location.description} />
                        </CardContent>
                    </Card>
                )}

                {location.characters.length > 0 && (
                    <Card className="border-2 border-purple-500/30 bg-slate-900/70">
                        <CardContent className="px-8 py-5">
                            <h2 className="mb-3 text-lg font-black text-purple-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                ⚔️ Personajes vinculados
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {location.characters.map((c) => (
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
