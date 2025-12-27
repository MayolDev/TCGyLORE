import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Globe, BookText, Users, MapPin, Swords, Pencil, Trash2, Plus, Search, Grid3x3, Table2 } from 'lucide-react';
import { useState } from 'react';

interface World {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    stories_count?: number;
    characters_count?: number;
    locations_count?: number;
    cards_count?: number;
}

interface PaginatedData {
    data: World[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    worlds?: PaginatedData;
    filters?: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mundos', href: '/admin/worlds' },
];

export default function Index({ worlds: initialWorlds, filters: initialFilters }: Props) {
    const worlds = initialWorlds || { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/worlds', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`¿Estás seguro de eliminar el mundo "${name}"? Esto eliminará todas las historias, personajes, ubicaciones y cartas asociadas.`)) {
            router.delete(`/admin/worlds/${id}`);
        }
    };

    const clearSearch = () => {
        setSearch('');
        router.get('/admin/worlds');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Mundos" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            Mundos Épicos
                        </h1>
                        <p className="text-yellow-200/70 mt-2 font-semibold text-base">
                            🌍 Gestiona los universos de tu juego TCG
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black shadow-xl shadow-orange-500/50 border-2 border-yellow-400/30" style={{ fontFamily: 'Cinzel, serif' }}>
                        <Link href="/admin/worlds/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Mundo
                        </Link>
                    </Button>
                </div>

                {/* Search & View Toggle */}
                <Card className="border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar mundos por nombre..."
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
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    onClick={() => setViewMode('grid')}
                                    className={viewMode === 'grid' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                >
                                    <Grid3x3 className="h-4 w-4 mr-2" />
                                    Cards
                                </Button>
                                <Button
                                    type="button"
                                    variant={viewMode === 'table' ? 'default' : 'outline'}
                                    onClick={() => setViewMode('table')}
                                    className={viewMode === 'table' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                >
                                    <Table2 className="h-4 w-4 mr-2" />
                                    Tabla
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Worlds Grid/Table */}
                {worlds.data.length === 0 ? (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-primary/10 p-6 mb-4">
                                <Globe className="h-12 w-12 text-primary animate-float" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {filters.search ? 'No se encontraron mundos' : '¡Crea tu primer mundo!'}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {filters.search 
                                    ? `No hay mundos que coincidan con "${filters.search}"`
                                    : 'Construye universos épicos donde tus historias y cartas cobrarán vida'
                                }
                            </p>
                            {!filters.search && (
                                <Button variant="magical" size="lg" asChild>
                                    <Link href="/admin/worlds/create">
                                        <Globe className="mr-2 h-5 w-5" />
                                        Crear Primer Mundo
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {worlds.data.map((world) => (
                                <Card key={world.id} className="group overflow-hidden border-4 border-purple-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 hover:border-purple-400/70 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105 hover:-rotate-1 relative">
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* World Image or Gradient Header */}
                                    <div className="relative h-40 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-indigo-600/30 overflow-hidden border-b-2 border-purple-500/30">
                                        {world.image_url ? (
                                            <img 
                                                src={world.image_url} 
                                                alt={world.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Globe className="h-20 w-20 text-purple-400/60 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                                    </div>

                                    <CardHeader className="relative z-10">
                                        <CardTitle className="flex items-start justify-between gap-2 text-yellow-100 font-black text-xl" style={{ fontFamily: 'Cinzel, serif' }}>
                                            <span className="line-clamp-1">{world.name}</span>
                                            <Globe className="h-6 w-6 text-purple-400 shrink-0 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 text-yellow-200/60 font-semibold">
                                            {world.description || 'Sin descripción'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4 relative z-10">
                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded-lg bg-purple-500/30 border border-purple-500/50">
                                                    <BookText className="h-4 w-4 text-purple-300 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                                                </div>
                                                <span className="text-yellow-200/80 font-semibold">
                                                    {world.stories_count || 0} historias
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded-lg bg-emerald-500/30 border border-emerald-500/50">
                                                    <Users className="h-4 w-4 text-emerald-300 drop-shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
                                                </div>
                                                <span className="text-yellow-200/80 font-semibold">
                                                    {world.characters_count || 0} personajes
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded-lg bg-rose-500/30 border border-rose-500/50">
                                                    <MapPin className="h-4 w-4 text-rose-300 drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]" />
                                                </div>
                                                <span className="text-yellow-200/80 font-semibold">
                                                    {world.locations_count || 0} ubicaciones
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded-lg bg-violet-500/30 border border-violet-500/50">
                                                    <Swords className="h-4 w-4 text-violet-300 drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]" />
                                                </div>
                                                <span className="text-yellow-200/80 font-semibold">
                                                    {world.cards_count || 0} cartas
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1 border-purple-500/50 text-purple-200 hover:bg-purple-600/20 hover:text-purple-100 font-bold" asChild>
                                                <Link href={`/admin/worlds/${world.id}/edit`}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                onClick={() => handleDelete(world.id, world.name)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Created Date */}
                                        <p className="text-xs text-yellow-300/50 text-center pt-2 border-t border-purple-500/30 font-semibold">
                                            Creado {new Date(world.created_at).toLocaleDateString('es-ES', { 
                                                day: 'numeric', 
                                                month: 'long', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {worlds.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{worlds.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{worlds.total}</span> mundos
                                    </div>
                                    <div className="flex gap-2">
                                        {worlds.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {worlds.current_page} de {worlds.last_page}
                                        </div>
                                        {worlds.current_page < worlds.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page + 1}${
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
                ) : (
                    /* Table View */
                    <>
                        <Card className="border-primary/20">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-yellow-900/30 hover:bg-yellow-900/10">
                                                <TableHead className="text-yellow-400 font-bold">Nombre</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Descripción</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-center">Historias</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-center">Personajes</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-center">Ubicaciones</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-center">Cartas</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Creado</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {worlds.data.map((world) => (
                                                <TableRow 
                                                    key={world.id} 
                                                    className="border-yellow-900/20 hover:bg-yellow-900/10 transition-colors"
                                                >
                                                    <TableCell className="font-bold text-yellow-200">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="h-5 w-5 text-purple-400" />
                                                            {world.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70 max-w-md">
                                                        <div className="line-clamp-2">
                                                            {world.description || 'Sin descripción'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <BookText className="h-4 w-4 text-purple-400" />
                                                            {world.stories_count || 0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Users className="h-4 w-4 text-emerald-400" />
                                                            {world.characters_count || 0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <MapPin className="h-4 w-4 text-rose-400" />
                                                            {world.locations_count || 0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Swords className="h-4 w-4 text-amber-400" />
                                                            {world.cards_count || 0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-300/60 text-sm">
                                                        {new Date(world.created_at).toLocaleDateString('es-ES', { 
                                                            day: 'numeric', 
                                                            month: 'short', 
                                                            year: 'numeric' 
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                asChild
                                                                className="bg-purple-900/50 hover:bg-purple-800/70 text-purple-200 hover:text-purple-100 border-purple-700/50 hover:border-purple-500/70"
                                                            >
                                                                <Link href={`/admin/worlds/${world.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                                onClick={() => handleDelete(world.id, world.name)}
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
                        {worlds.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{worlds.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{worlds.total}</span> mundos
                                    </div>
                                    <div className="flex gap-2">
                                        {worlds.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {worlds.current_page} de {worlds.last_page}
                                        </div>
                                        {worlds.current_page < worlds.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page + 1}${
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
