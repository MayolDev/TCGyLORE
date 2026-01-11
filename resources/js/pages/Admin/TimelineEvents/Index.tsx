import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Grid3x3,
    MapPin,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Table2,
    Trash2,
    Users as UsersIcon,
} from 'lucide-react';
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
    guerra: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
    fundacion:
        'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    catastrofe:
        'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
    paz: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30',
    descubrimiento:
        'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    traicion:
        'bg-slate-800/10 text-slate-700 dark:text-slate-300 border-slate-800/30',
    alianza:
        'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
};

const importanceColors: Record<string, string> = {
    crucial:
        'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    importante:
        'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
    menor: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
};

export default function Index({
    events: initialEvents,
    filters: initialFilters,
}: Props) {
    const events = initialEvents || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/timeline-events',
            { search },
            { preserveState: true },
        );
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
                        <h1
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent uppercase drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            Línea de Tiempo
                        </h1>
                        <p className="mt-2 text-base font-semibold text-yellow-200/70">
                            ⏰ Gestiona los eventos históricos de tus mundos
                        </p>
                    </div>
                    <Button
                        variant="magical"
                        size="lg"
                        asChild
                        className="border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 font-black text-white shadow-xl shadow-orange-500/50 hover:from-yellow-500 hover:to-red-500"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        <Link href="/admin/timeline-events/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Evento
                        </Link>
                    </Button>
                </div>

                {/* Search & View Toggle */}
                <Card className="border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-1 gap-2"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar eventos por nombre..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit">Buscar</Button>
                                {filters.search && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearSearch}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </form>

                            {/* View Mode Toggle */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={
                                        viewMode === 'grid'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setViewMode('grid')}
                                    className={
                                        viewMode === 'grid'
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : ''
                                    }
                                >
                                    <Grid3x3 className="mr-2 h-4 w-4" />
                                    Cards
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        viewMode === 'table'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setViewMode('table')}
                                    className={
                                        viewMode === 'table'
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : ''
                                    }
                                >
                                    <Table2 className="mr-2 h-4 w-4" />
                                    Tabla
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline Events */}
                {events.data.length === 0 ? (
                    <Card className="border-2 border-dashed border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 rounded-full bg-amber-500/10 p-6">
                                <Clock className="animate-float h-12 w-12 text-amber-500" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold">
                                {filters.search
                                    ? 'No se encontraron eventos'
                                    : '¡Crea tu primer evento histórico!'}
                            </h3>
                            <p className="mb-6 max-w-md text-muted-foreground">
                                {filters.search
                                    ? `No hay eventos que coincidan con "${filters.search}"`
                                    : 'Documenta la historia de tu mundo con eventos épicos'}
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
                ) : viewMode === 'grid' ? (
                    <>
                        {/* Timeline View */}
                        <div className="relative space-y-6">
                            {/* Timeline Line */}
                            <div className="absolute top-0 bottom-0 left-8 hidden w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-yellow-500 shadow-[0_0_10px_rgba(251,191,36,0.5)] md:block" />

                            {sortedEvents.map((event) => (
                                <Card
                                    key={event.id}
                                    className="group relative overflow-hidden border-4 border-amber-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 transition-all duration-300 hover:scale-105 hover:border-amber-400/70 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] md:ml-20"
                                >
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    <div className="flex flex-col gap-4 md:flex-row">
                                        {/* Timeline Dot */}
                                        <div className="absolute top-6 -left-12 hidden items-center justify-center md:flex">
                                            <div className="relative">
                                                <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500 blur-md" />
                                                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-slate-900 bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                                                    <Calendar className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex-1">
                                            <CardHeader className="pb-3">
                                                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="border-amber-500/50 bg-amber-500/30 text-sm font-black text-amber-200 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"
                                                        >
                                                            Año {event.year}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-orange-500/50 bg-orange-500/30 font-bold text-orange-200"
                                                        >
                                                            {event.event_type}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-yellow-500/50 bg-yellow-500/30 font-bold text-yellow-200"
                                                        >
                                                            {event.importance}
                                                        </Badge>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-fit border-amber-500/30 bg-slate-900/90 font-bold text-yellow-200"
                                                    >
                                                        {event.world.name}
                                                    </Badge>
                                                </div>
                                                <CardTitle
                                                    className="flex items-center gap-2 text-xl font-black text-yellow-100"
                                                    style={{
                                                        fontFamily:
                                                            'Cinzel, serif',
                                                    }}
                                                >
                                                    <span>{event.name}</span>
                                                    <Sparkles className="h-6 w-6 shrink-0 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                                </CardTitle>
                                                <CardDescription className="line-clamp-3 font-semibold text-yellow-200/60">
                                                    {event.description ||
                                                        'Sin descripción'}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="space-y-3">
                                                {/* Characters & Locations */}
                                                {((event.characters &&
                                                    event.characters.length >
                                                        0) ||
                                                    (event.locations &&
                                                        event.locations.length >
                                                            0)) && (
                                                    <div className="flex flex-col gap-2 border-t border-amber-500/30 pt-3 text-sm">
                                                        {event.characters &&
                                                            event.characters
                                                                .length > 0 && (
                                                                <div className="flex items-start gap-2">
                                                                    <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]" />
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {event.characters.map(
                                                                            (
                                                                                char,
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        char.id
                                                                                    }
                                                                                    variant="outline"
                                                                                    className="border-emerald-500/50 bg-emerald-500/30 text-xs font-bold text-emerald-200"
                                                                                >
                                                                                    {
                                                                                        char.name
                                                                                    }
                                                                                </Badge>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        {event.locations &&
                                                            event.locations
                                                                .length > 0 && (
                                                                <div className="flex items-start gap-2">
                                                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]" />
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {event.locations.map(
                                                                            (
                                                                                loc,
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        loc.id
                                                                                    }
                                                                                    variant="outline"
                                                                                    className="border-rose-500/50 bg-rose-500/30 text-xs font-bold text-rose-200"
                                                                                >
                                                                                    {
                                                                                        loc.name
                                                                                    }
                                                                                </Badge>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-amber-500/50 font-bold text-amber-200 hover:bg-amber-600/20 hover:text-amber-100"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/timeline-events/${event.id}/edit`}
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                        onClick={() =>
                                                            handleDelete(
                                                                event.id,
                                                                event.name,
                                                            )
                                                        }
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
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {events.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {events.total}
                                        </span>{' '}
                                        eventos
                                    </div>
                                    <div className="flex gap-2">
                                        {events.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/timeline-events?page=${events.current_page - 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
                                                    }`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {events.current_page} de{' '}
                                            {events.last_page}
                                        </div>
                                        {events.current_page <
                                            events.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/timeline-events?page=${events.current_page + 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
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
                ) : (
                    /* Table View */
                    <>
                        <Card className="border-primary/20">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-yellow-900/30 hover:bg-yellow-900/10">
                                                <TableHead className="font-bold text-yellow-400">
                                                    Año
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Nombre
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Mundo
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Tipo
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Importancia
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Descripción
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Relacionado
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Creado
                                                </TableHead>
                                                <TableHead className="text-right font-bold text-yellow-400">
                                                    Acciones
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedEvents.map((event) => (
                                                <TableRow
                                                    key={event.id}
                                                    className="border-yellow-900/20 transition-colors hover:bg-yellow-900/10"
                                                >
                                                    <TableCell className="text-lg font-bold text-amber-300">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-5 w-5 text-amber-400" />
                                                            {event.year}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-yellow-200">
                                                        <div className="flex items-center gap-2">
                                                            <Sparkles className="h-5 w-5 text-amber-400" />
                                                            {event.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        <Badge
                                                            variant="outline"
                                                            className="border-amber-500/40 bg-amber-500/20 text-amber-300"
                                                        >
                                                            {event.world.name}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                eventTypeColors[
                                                                    event
                                                                        .event_type
                                                                ] ||
                                                                'border-slate-500/40 bg-slate-500/20 text-slate-300'
                                                            }
                                                        >
                                                            {event.event_type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                importanceColors[
                                                                    event
                                                                        .importance
                                                                ] ||
                                                                'border-slate-500/40 bg-slate-500/20 text-slate-300'
                                                            }
                                                        >
                                                            {event.importance}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-md text-yellow-200/70">
                                                        <div className="line-clamp-2">
                                                            {event.description ||
                                                                'Sin descripción'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {event.characters &&
                                                                event.characters
                                                                    .length >
                                                                    0 && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-slate-500/40 bg-slate-500/20 text-xs text-slate-300"
                                                                    >
                                                                        <UsersIcon className="mr-1 h-3 w-3" />
                                                                        {
                                                                            event
                                                                                .characters
                                                                                .length
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            {event.locations &&
                                                                event.locations
                                                                    .length >
                                                                    0 && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-slate-500/40 bg-slate-500/20 text-xs text-slate-300"
                                                                    >
                                                                        <MapPin className="mr-1 h-3 w-3" />
                                                                        {
                                                                            event
                                                                                .locations
                                                                                .length
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            {(!event.characters ||
                                                                event.characters
                                                                    .length ===
                                                                    0) &&
                                                                (!event.locations ||
                                                                    event
                                                                        .locations
                                                                        .length ===
                                                                        0) && (
                                                                    <span className="text-sm text-yellow-200/50">
                                                                        -
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-yellow-300/60">
                                                        {new Date(
                                                            event.created_at,
                                                        ).toLocaleDateString(
                                                            'es-ES',
                                                            {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                                className="border-amber-700/50 bg-amber-900/50 text-amber-200 hover:border-amber-500/70 hover:bg-amber-800/70 hover:text-amber-100"
                                                            >
                                                                <Link
                                                                    href={`/admin/timeline-events/${event.id}/edit`}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        event.id,
                                                                        event.name,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {events.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {events.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {events.total}
                                        </span>{' '}
                                        eventos
                                    </div>
                                    <div className="flex gap-2">
                                        {events.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/timeline-events?page=${events.current_page - 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
                                                    }`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {events.current_page} de{' '}
                                            {events.last_page}
                                        </div>
                                        {events.current_page <
                                            events.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/timeline-events?page=${events.current_page + 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
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
