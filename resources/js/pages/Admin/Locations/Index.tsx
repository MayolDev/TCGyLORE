import MapView from '@/components/map-view';
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
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Grid3x3,
    Map as MapIcon,
    MapPin,
    Navigation,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Table2,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface LocationData {
    id: number;
    name: string;
    description?: string;
    type: string;
    coordinate_x: number;
    coordinate_y: number;
}

interface Location {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    latitude: number | null;
    longitude: number | null;
    world: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface PaginatedData {
    data: Location[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    locations?: PaginatedData;
    filters?: {
        search?: string;
    };
    allLocations: LocationData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ubicaciones', href: '/admin/locations' },
];

export default function Index({
    locations: initialLocations,
    filters: initialFilters,
    allLocations,
}: Props) {
    const locations = initialLocations || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
    };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'table' | 'map'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/locations', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`¿Estás seguro de eliminar la ubicación "${name}"?`)) {
            router.delete(`/admin/locations/${id}`);
        }
    };

    const clearSearch = () => {
        setSearch('');
        router.get('/admin/locations');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubicaciones" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent uppercase drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            Ubicaciones Místicas
                        </h1>
                        <p className="mt-2 text-base font-semibold text-yellow-200/70">
                            📍 Gestiona los lugares legendarios de tus mundos
                        </p>
                    </div>
                    <Button
                        variant="magical"
                        size="lg"
                        asChild
                        className="border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 font-black text-white shadow-xl shadow-orange-500/50 hover:from-yellow-500 hover:to-red-500"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        <Link href="/admin/locations/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Ubicación
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
                                        placeholder="Buscar ubicaciones por nombre..."
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
                                <Button
                                    type="button"
                                    variant={
                                        viewMode === 'map'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setViewMode('map')}
                                    className={
                                        viewMode === 'map'
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : ''
                                    }
                                >
                                    <MapIcon className="mr-2 h-4 w-4" />
                                    Mapa
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Locations Grid/Table/Map */}
                {locations.data.length === 0 && viewMode !== 'map' ? (
                    <Card className="border-2 border-dashed border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 rounded-full bg-rose-500/10 p-6">
                                <MapPin className="animate-float h-12 w-12 text-rose-500" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold">
                                {filters.search
                                    ? 'No se encontraron ubicaciones'
                                    : '¡Crea tu primera ubicación!'}
                            </h3>
                            <p className="mb-6 max-w-md text-muted-foreground">
                                {filters.search
                                    ? `No hay ubicaciones que coincidan con "${filters.search}"`
                                    : 'Diseña lugares épicos donde tus historias cobrarán vida'}
                            </p>
                            {!filters.search && (
                                <Button variant="magical" size="lg" asChild>
                                    <Link href="/admin/locations/create">
                                        <MapPin className="mr-2 h-5 w-5" />
                                        Crear Primera Ubicación
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === 'map' ? (
                    /* Map View */
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-200">
                                <Navigation className="h-6 w-6 text-yellow-400" />
                                🗺️ Mapa del Mundo
                            </CardTitle>
                            <CardDescription className="text-yellow-200/70">
                                Vista general de todas las ubicaciones en el
                                mapa - Haz clic en un marcador para editar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MapView
                                locations={allLocations}
                                height="700px"
                                onLocationClick={(location) => {
                                    router.visit(
                                        `/admin/locations/${location.id}/edit`,
                                    );
                                }}
                            />
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {locations.data.map((location) => (
                                <Card
                                    key={location.id}
                                    className="group relative overflow-hidden border-4 border-rose-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:border-rose-400/70 hover:shadow-[0_0_40px_rgba(244,63,94,0.4)]"
                                >
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-orange-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    {/* Location Image */}
                                    <div className="relative h-48 overflow-hidden border-b-2 border-rose-500/30 bg-gradient-to-br from-rose-600/30 via-orange-600/20 to-amber-600/30">
                                        {location.image_url ? (
                                            <img
                                                src={location.image_url}
                                                alt={location.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <MapPin className="h-20 w-20 text-rose-400/60 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:text-rose-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

                                        {/* World Badge */}
                                        <div className="absolute top-2 right-2">
                                            <Badge
                                                variant="secondary"
                                                className="border-rose-500/30 bg-slate-900/90 font-bold text-yellow-200 backdrop-blur-sm"
                                            >
                                                {location.world.name}
                                            </Badge>
                                        </div>

                                        {/* Coordinates Badge */}
                                        {location.latitude != null &&
                                            location.longitude != null && (
                                                <div className="absolute bottom-2 left-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 border-amber-500/50 bg-slate-900/90 font-bold text-amber-200 backdrop-blur-sm"
                                                    >
                                                        <Navigation className="h-3 w-3" />
                                                        <span className="text-xs">
                                                            Mapeado
                                                        </span>
                                                    </Badge>
                                                </div>
                                            )}
                                    </div>

                                    <CardHeader className="relative z-10 pb-3">
                                        <CardTitle
                                            className="flex items-center justify-between gap-2 text-xl font-black text-yellow-100"
                                            style={{
                                                fontFamily: 'Cinzel, serif',
                                            }}
                                        >
                                            <span className="line-clamp-1">
                                                {location.name}
                                            </span>
                                            <Sparkles className="h-6 w-6 shrink-0 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 font-semibold text-yellow-200/60">
                                            {location.description ||
                                                'Sin descripción'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        {/* Coordinates */}
                                        {location.latitude != null &&
                                            location.longitude != null && (
                                                <div className="flex items-center gap-2 rounded border border-rose-500/30 bg-rose-900/30 p-2 text-xs font-semibold text-yellow-200/70">
                                                    <Navigation className="h-4 w-4 text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]" />
                                                    <span>
                                                        {Number(
                                                            location.latitude,
                                                        ).toFixed(4)}
                                                        ,{' '}
                                                        {Number(
                                                            location.longitude,
                                                        ).toFixed(4)}
                                                    </span>
                                                </div>
                                            )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-rose-500/50 font-bold text-rose-200 hover:bg-rose-600/20 hover:text-rose-100"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/locations/${location.id}/edit`}
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
                                                        location.id,
                                                        location.name,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Created Date */}
                                        <p className="border-t border-rose-500/30 pt-2 text-center text-xs font-semibold text-yellow-300/50">
                                            Creado{' '}
                                            {new Date(
                                                location.created_at,
                                            ).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {locations.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {locations.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {locations.total}
                                        </span>{' '}
                                        ubicaciones
                                    </div>
                                    <div className="flex gap-2">
                                        {locations.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/locations?page=${locations.current_page - 1}${
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
                                            Página {locations.current_page} de{' '}
                                            {locations.last_page}
                                        </div>
                                        {locations.current_page <
                                            locations.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/locations?page=${locations.current_page + 1}${
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
                    <>
                        {/* Table View */}
                        <Card className="border-primary/20">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-primary/20 bg-slate-900/50">
                                                <th className="px-6 py-4 text-left text-sm font-black tracking-wider text-yellow-200 uppercase">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-black tracking-wider text-yellow-200 uppercase">
                                                    Mundo
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-black tracking-wider text-yellow-200 uppercase">
                                                    Descripción
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-black tracking-wider text-yellow-200 uppercase">
                                                    Coordenadas
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-black tracking-wider text-yellow-200 uppercase">
                                                    Fecha
                                                </th>
                                                <th className="px-6 py-4 text-right text-sm font-black tracking-wider text-yellow-200 uppercase">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/10">
                                            {locations.data.map((location) => (
                                                <tr
                                                    key={location.id}
                                                    className="group transition-colors hover:bg-rose-500/10"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <MapPin className="h-5 w-5 shrink-0 text-rose-400" />
                                                            <span className="font-bold text-yellow-100">
                                                                {location.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge
                                                            variant="secondary"
                                                            className="border-rose-500/30 bg-slate-800/70 font-semibold text-yellow-200"
                                                        >
                                                            {
                                                                location.world
                                                                    .name
                                                            }
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="line-clamp-2 max-w-md text-sm text-yellow-200/70">
                                                            {location.description ||
                                                                'Sin descripción'}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {location.latitude !=
                                                            null &&
                                                        location.longitude !=
                                                            null ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="gap-1 border-amber-500/50 bg-slate-900/50 text-amber-200"
                                                            >
                                                                <Navigation className="h-3 w-3" />
                                                                Sí
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                No
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-xs text-yellow-300/60">
                                                            {new Date(
                                                                location.created_at,
                                                            ).toLocaleDateString(
                                                                'es-ES',
                                                                {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                },
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                                className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-600/20 hover:text-yellow-200"
                                                            >
                                                                <Link
                                                                    href={`/admin/locations/${location.id}/edit`}
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
                                                                        location.id,
                                                                        location.name,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {locations.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {locations.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {locations.total}
                                        </span>{' '}
                                        ubicaciones
                                    </div>
                                    <div className="flex gap-2">
                                        {locations.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/locations?page=${locations.current_page - 1}${
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
                                            Página {locations.current_page} de{' '}
                                            {locations.last_page}
                                        </div>
                                        {locations.current_page <
                                            locations.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/locations?page=${locations.current_page + 1}${
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
