import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import MapView, { LOCATION_TYPES } from '@/components/map-view';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Plus, Search, Pencil, Trash2, Sparkles, Navigation, Map, Grid3X3 } from 'lucide-react';
import { useState } from 'react';

interface Location {
    id: number;
    name: string;
    description: string | null;
    type?: string;
    image_url: string | null;
    coordinate_x: number | null;
    coordinate_y: number | null;
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
    locations?: Location[] | PaginatedData; // Puede ser array simple o paginado
    filters?: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ubicaciones', href: '/admin/locations' },
];

export default function Index({ locations: initialLocations, filters: initialFilters }: Props) {
    // Manejar tanto array simple como datos paginados
    const locationsArray = Array.isArray(initialLocations) 
        ? initialLocations 
        : (initialLocations?.data || []);
    
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    console.log('Index - Locations received:', locationsArray.length, locationsArray);

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

    const handleLocationClick = (location: Location) => {
        router.visit(`/admin/locations/${location.id}/edit`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubicaciones" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Ubicaciones Místicas
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona los lugares legendarios de tus mundos
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild>
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
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar ubicaciones por nombre..."
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
                            
                            {/* View Mode Toggle */}
                            <div className="flex gap-2 border-l pl-4">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3X3 className="mr-2 h-4 w-4" />
                                    Lista
                                </Button>
                                <Button
                                    variant={viewMode === 'map' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('map')}
                                >
                                    <Map className="mr-2 h-4 w-4" />
                                    Mapa
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State */}
                {locationsArray.length === 0 ? (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-rose-500/10 p-6 mb-4">
                                <MapPin className="h-12 w-12 text-rose-500 animate-float" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {filters.search ? 'No se encontraron ubicaciones' : '¡Crea tu primera ubicación!'}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {filters.search
                                    ? `No hay ubicaciones que coincidan con "${filters.search}"`
                                    : 'Diseña lugares épicos donde tus historias cobrarán vida'
                                }
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
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {locationsArray.map((location) => {
                                    const locationType = (location.type || 'city') as keyof typeof LOCATION_TYPES;
                                    const locationConfig = LOCATION_TYPES[locationType] || LOCATION_TYPES.city;
                                    
                                    return (
                                        <Card key={location.id} className="card-tcg group overflow-hidden border-primary/20 hover:border-primary/40">
                                            {/* Location Image */}
                                            <div className="relative h-48 bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-amber-500/20 overflow-hidden">
                                                {location.image_url ? (
                                                    <img 
                                                        src={location.image_url} 
                                                        alt={location.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-7xl">{locationConfig.icon}</div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                                                
                                                {/* World Badge */}
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                                                        {location.world.name}
                                                    </Badge>
                                                </div>

                                                {/* Type Badge */}
                                                <div className="absolute top-2 left-2">
                                                    <Badge 
                                                        variant="outline" 
                                                        className="backdrop-blur-sm bg-background/80"
                                                        style={{ borderColor: locationConfig.color }}
                                                    >
                                                        {locationConfig.icon} {locationConfig.label}
                                                    </Badge>
                                                </div>

                                                {/* Coordinates Badge */}
                                                {(location.coordinate_x != null && location.coordinate_y != null) && (
                                                    <div className="absolute bottom-2 left-2">
                                                        <Badge variant="outline" className="backdrop-blur-sm bg-background/80 gap-1">
                                                            <Navigation className="h-3 w-3" />
                                                            <span className="text-xs">Mapeado</span>
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base flex items-center justify-between gap-2">
                                                    <span className="line-clamp-1">{location.name}</span>
                                                    <Sparkles className="h-4 w-4 text-rose-500 shrink-0" />
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {location.description || 'Sin descripción'}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="space-y-4">
                                                {/* Coordinates */}
                                                {(location.coordinate_x != null && location.coordinate_y != null) && (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                                                        <Navigation className="h-3.5 w-3.5 text-rose-500" />
                                                        <span>
                                                            {Number(location.coordinate_x).toFixed(2)}, {Number(location.coordinate_y).toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2 border-t">
                                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                                        <Link href={`/admin/locations/${location.id}/edit`}>
                                                            <Pencil className="mr-1.5 h-3 w-3" />
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(location.id, location.name)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                {/* Created Date */}
                                                <p className="text-xs text-muted-foreground text-center pt-2 border-t">
                                                    Creado {new Date(location.created_at).toLocaleDateString('es-ES', { 
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        year: 'numeric' 
                                                    })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}

                        {/* Map View */}
                        {viewMode === 'map' && (
                            <MapView
                                locations={locationsArray}
                                onLocationClick={handleLocationClick}
                                height="700px"
                            />
                        )}

                        {/* Pagination - solo en vista de lista */}
                        {/* Paginación deshabilitada - se muestran todas las ubicaciones */}
                        {/* {viewMode === 'grid' && locations.last_page > 1 && ( ... )} */}

                        {/* Stats en vista de mapa */}
                        {viewMode === 'map' && (
                            <Card className="border-primary/20">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Mostrando <span className="font-medium text-foreground">{locationsArray.length}</span> ubicaciones en el mapa
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 text-rose-500" />
                                            Click en marcador para ver información
                                        </div>
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
