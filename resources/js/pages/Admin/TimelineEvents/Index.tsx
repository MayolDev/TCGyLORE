import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, Plus, Search, Pencil, Trash2, Sparkles, Calendar, Users as UsersIcon, MapPin } from 'lucide-react';
import { useState } from 'react';

interface TimelineEvent {
    id: number;
    name: string;
    description: string | null;
    year: number;
    event_type: string;
    importance: string;
    world: {
        id: number;
        name: string;
    };
    characters?: Array<{ id: number; name: string }>;
    locations?: Array<{ id: number; name: string }>;
    created_at: string;
}

interface PaginatedData {
    data: TimelineEvent[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    events?: PaginatedData;
    filters?: {
        search?: string;
        event_type?: string;
        world_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Línea de Tiempo', href: '/admin/timeline-events' },
];

const eventTypeColors: Record<string, string> = {
    'guerra': 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
    'fundacion': 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    'catastrofe': 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
    'paz': 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30',
    'descubrimiento': 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    'traicion': 'bg-slate-800/10 text-slate-700 dark:text-slate-300 border-slate-800/30',
    'alianza': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
};

const importanceColors: Record<string, string> = {
    'crucial': 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    'importante': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
    'menor': 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
};

export default function Index({ events: initialEvents, filters: initialFilters }: Props) {
    const events = initialEvents || { data: [], current_page: 1, last_page: 1, per_page: 15, total: 0 };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/timeline-events', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`¿Estás seguro de eliminar el evento "${name}"?`)) {
            router.delete(`/admin/timeline-events/${id}`);
        }
    };

    const clearSearch = () => {
        setSearch('');
        router.get('/admin/timeline-events');
    };

    // Ordenar eventos por año
    const sortedEvents = [...events.data].sort((a, b) => a.year - b.year);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Línea de Tiempo" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            Línea de Tiempo
                        </h1>
                        <p className="text-yellow-200/70 mt-2 font-semibold text-base">
                            ⏰ Gestiona los eventos históricos de tus mundos
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black shadow-xl shadow-orange-500/50 border-2 border-yellow-400/30" style={{ fontFamily: 'Cinzel, serif' }}>
                        <Link href="/admin/timeline-events/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Evento
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <Card className="border-primary/20">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar eventos por nombre..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit">Buscar</Button>
                            {filters.search && (
                                <Button type="button" variant="outline" onClick={clearSearch}>
                                    Limpiar
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Timeline Events */}
                {events.data.length === 0 ? (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-amber-500/10 p-6 mb-4">
                                <Clock className="h-12 w-12 text-amber-500 animate-float" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {filters.search ? 'No se encontraron eventos' : '¡Crea tu primer evento histórico!'}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {filters.search
                                    ? `No hay eventos que coincidan con "${filters.search}"`
                                    : 'Documenta la historia de tu mundo con eventos épicos'
                                }
                            </p>
                            {!filters.search && (
                                <Button variant="magical" size="lg" asChild>
                                    <Link href="/admin/timeline-events/create">
                                        <Clock className="mr-2 h-5 w-5" />
                                        Crear Primer Evento
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Timeline View */}
                        <div className="relative space-y-6">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-yellow-500 hidden md:block shadow-[0_0_10px_rgba(251,191,36,0.5)]" />

                            {sortedEvents.map((event) => (
                                <Card key={event.id} className="group overflow-hidden border-4 border-amber-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 hover:border-amber-400/70 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105 relative md:ml-20">
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {/* Timeline Dot */}
                                        <div className="hidden md:flex absolute -left-12 top-6 items-center justify-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-amber-500 rounded-full blur-md animate-pulse" />
                                                <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg border-4 border-slate-900 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                                                    <Calendar className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 relative z-10">
                                            <CardHeader className="pb-3">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge variant="outline" className="bg-amber-500/30 border-amber-500/50 text-amber-200 font-black text-sm drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                                                            Año {event.year}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-orange-500/30 border-orange-500/50 text-orange-200 font-bold">
                                                            {event.event_type}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-yellow-500/30 border-yellow-500/50 text-yellow-200 font-bold">
                                                            {event.importance}
                                                        </Badge>
                                                    </div>
                                                    <Badge variant="secondary" className="w-fit bg-slate-900/90 border-amber-500/30 text-yellow-200 font-bold">
                                                        {event.world.name}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl flex items-center gap-2 text-yellow-100 font-black" style={{ fontFamily: 'Cinzel, serif' }}>
                                                    <span>{event.name}</span>
                                                    <Sparkles className="h-6 w-6 text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                                </CardTitle>
                                                <CardDescription className="line-clamp-3 text-yellow-200/60 font-semibold">
                                                    {event.description || 'Sin descripción'}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="space-y-3">
                                                {/* Characters & Locations */}
                                                {((event.characters && event.characters.length > 0) || (event.locations && event.locations.length > 0)) && (
                                                    <div className="flex flex-col gap-2 text-sm border-t border-amber-500/30 pt-3">
                                                        {event.characters && event.characters.length > 0 && (
                                                            <div className="flex items-start gap-2">
                                                                <UsersIcon className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]" />
                                                                <div className="flex flex-wrap gap-1">
                                                                    {event.characters.map((char) => (
                                                                        <Badge key={char.id} variant="outline" className="text-xs bg-emerald-500/30 border-emerald-500/50 text-emerald-200 font-bold">
                                                                            {char.name}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {event.locations && event.locations.length > 0 && (
                                                            <div className="flex items-start gap-2">
                                                                <MapPin className="h-4 w-4 text-rose-400 mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]" />
                                                                <div className="flex flex-wrap gap-1">
                                                                    {event.locations.map((loc) => (
                                                                        <Badge key={loc.id} variant="outline" className="text-xs bg-rose-500/30 border-rose-500/50 text-rose-200 font-bold">
                                                                            {loc.name}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-200 hover:bg-amber-600/20 hover:text-amber-100 font-bold" asChild>
                                                        <Link href={`/admin/timeline-events/${event.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                        onClick={() => handleDelete(event.id, event.name)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {events.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{events.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{events.total}</span> eventos
                                    </div>
                                    <div className="flex gap-2">
                                        {events.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/timeline-events?page=${events.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {events.current_page} de {events.last_page}
                                        </div>
                                        {events.current_page < events.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/timeline-events?page=${events.current_page + 1}${
                                                        search ? `&search=${search}` : ''
                                                    }`}
                                                >
                                                    Siguiente
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
