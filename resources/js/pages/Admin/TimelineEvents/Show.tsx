import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import LoreShowHeader from '@/components/lore-show-header';
import MarkdownContent from '@/components/markdown-content';

interface TimelineEvent {
    id: number;
    name: string;
    year: number;
    description: string | null;
    event_type: string;
    importance: number;
    world: { id: number; name: string } | null;
    characters: { id: number; name: string }[];
    locations: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cronología', href: '/admin/timeline-events' },
    { title: 'Ver' },
];

export default function Show({ event }: { event: TimelineEvent }) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={event.name} />

            <div className="mx-auto max-w-6xl space-y-6 p-6">
                <LoreShowHeader
                    image={null}
                    icon="⏳"
                    title={event.name}
                    subtitle={`Año ${event.year}`}
                    backHref="/admin/timeline-events"
                    editHref={`/admin/timeline-events/${event.id}/edit`}
                    badges={
                        <>
                            <Badge className="bg-cyan-600/30 text-cyan-200 border-cyan-500/50 font-bold">🏷️ {event.event_type}</Badge>
                            {event.world && (
                                <Badge className="bg-blue-600/30 text-blue-200 border-blue-500/50 font-bold">🌍 {event.world.name}</Badge>
                            )}
                            <Badge className="bg-amber-600/30 text-amber-200 border-amber-500/50 font-bold">
                                {'⭐'.repeat(Math.max(1, Math.min(5, event.importance)))}
                            </Badge>
                        </>
                    }
                />

                {event.description && (
                    <Card className="border-2 border-amber-500/30 bg-slate-900/70">
                        <CardContent className="px-8 py-8 sm:px-12">
                            <MarkdownContent content={event.description} />
                        </CardContent>
                    </Card>
                )}

                {(event.characters.length > 0 || event.locations.length > 0) && (
                    <Card className="border-2 border-purple-500/30 bg-slate-900/70">
                        <CardContent className="space-y-4 px-8 py-5">
                            {event.characters.length > 0 && (
                                <div>
                                    <h2 className="mb-2 text-lg font-black text-purple-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                        ⚔️ Personajes implicados
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {event.characters.map((c) => (
                                            <Link key={c.id} href={`/admin/characters/${c.id}`}>
                                                <Badge className="cursor-pointer bg-purple-600/20 text-purple-200 border-purple-500/40 font-bold hover:bg-purple-600/40 transition-colors">
                                                    {c.name}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {event.locations.length > 0 && (
                                <div>
                                    <h2 className="mb-2 text-lg font-black text-rose-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                        📍 Escenarios
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {event.locations.map((l) => (
                                            <Link key={l.id} href={`/admin/locations/${l.id}`}>
                                                <Badge className="cursor-pointer bg-rose-600/20 text-rose-200 border-rose-500/40 font-bold hover:bg-rose-600/40 transition-colors">
                                                    {l.name}
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
