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
    BookText,
    Globe,
    Grid3x3,
    MapPin,
    Pencil,
    Plus,
    Search,
    Swords,
    Table2,
    Trash2,
    Users,
} from 'lucide-react';
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

export default function Index({
    worlds: initialWorlds,
    filters: initialFilters,
}: Props) {
    const worlds = initialWorlds || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/worlds', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (
            confirm(
                `¿Estás seguro de eliminar el mundo "${name}"? Esto eliminará todas las historias, personajes, ubicaciones y cartas asociadas.`,
            )
        ) {
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
                        <h1
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent uppercase drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            Mundos Épicos
                        </h1>
                        <p className="mt-2 text-base font-semibold text-yellow-200/70">
                            🌍 Gestiona los universos de tu juego TCG
                        </p>
                    </div>
                    <Button
                        variant="magical"
                        size="lg"
                        asChild
                        className="border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 font-black text-white shadow-xl shadow-orange-500/50 hover:from-yellow-500 hover:to-red-500"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        <Link href="/admin/worlds/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Mundo
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
                                        placeholder="Buscar mundos por nombre..."
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

                {/* Worlds Grid/Table */}
                {worlds.data.length === 0 ? (
                    <Card className="border-2 border-dashed border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 rounded-full bg-primary/10 p-6">
                                <Globe className="animate-float h-12 w-12 text-primary" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold">
                                {filters.search
                                    ? 'No se encontraron mundos'
                                    : '¡Crea tu primer mundo!'}
                            </h3>
                            <p className="mb-6 max-w-md text-muted-foreground">
                                {filters.search
                                    ? `No hay mundos que coincidan con "${filters.search}"`
                                    : 'Construye universos épicos donde tus historias y cartas cobrarán vida'}
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
                                <Card
                                    key={world.id}
                                    className="group relative overflow-hidden border-4 border-purple-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:border-purple-400/70 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                                >
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    {/* World Image or Gradient Header */}
                                    <div className="relative h-40 overflow-hidden border-b-2 border-purple-500/30 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-indigo-600/30">
                                        {world.image_url ? (
                                            <img
                                                src={world.image_url}
                                                alt={world.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Globe className="h-20 w-20 text-purple-400/60 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:text-purple-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                                    </div>

                                    <CardHeader className="relative z-10">
                                        <CardTitle
                                            className="flex items-start justify-between gap-2 text-xl font-black text-yellow-100"
                                            style={{
                                                fontFamily: 'Cinzel, serif',
                                            }}
                                        >
                                            <span className="line-clamp-1">
                                                {world.name}
                                            </span>
                                            <Globe className="h-6 w-6 shrink-0 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 font-semibold text-yellow-200/60">
                                            {world.description ||
                                                'Sin descripción'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="rounded-lg border border-purple-500/50 bg-purple-500/30 p-1.5">
                                                    <BookText className="h-4 w-4 text-purple-300 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                                                </div>
                                                <span className="font-semibold text-yellow-200/80">
                                                    {world.stories_count || 0}{' '}
                                                    historias
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/30 p-1.5">
                                                    <Users className="h-4 w-4 text-emerald-300 drop-shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
                                                </div>
                                                <span className="font-semibold text-yellow-200/80">
                                                    {world.characters_count ||
                                                        0}{' '}
                                                    personajes
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="rounded-lg border border-rose-500/50 bg-rose-500/30 p-1.5">
                                                    <MapPin className="h-4 w-4 text-rose-300 drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]" />
                                                </div>
                                                <span className="font-semibold text-yellow-200/80">
                                                    {world.locations_count || 0}{' '}
                                                    ubicaciones
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="rounded-lg border border-violet-500/50 bg-violet-500/30 p-1.5">
                                                    <Swords className="h-4 w-4 text-violet-300 drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]" />
                                                </div>
                                                <span className="font-semibold text-yellow-200/80">
                                                    {world.cards_count || 0}{' '}
                                                    cartas
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-purple-500/50 font-bold text-purple-200 hover:bg-purple-600/20 hover:text-purple-100"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/worlds/${world.id}/edit`}
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
                                                        world.id,
                                                        world.name,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Created Date */}
                                        <p className="border-t border-purple-500/30 pt-2 text-center text-xs font-semibold text-yellow-300/50">
                                            Creado{' '}
                                            {new Date(
                                                world.created_at,
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
                        {worlds.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {worlds.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {worlds.total}
                                        </span>{' '}
                                        mundos
                                    </div>
                                    <div className="flex gap-2">
                                        {worlds.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page - 1}${
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
                                            Página {worlds.current_page} de{' '}
                                            {worlds.last_page}
                                        </div>
                                        {worlds.current_page <
                                            worlds.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page + 1}${
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
                                                    Nombre
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Descripción
                                                </TableHead>
                                                <TableHead className="text-center font-bold text-yellow-400">
                                                    Historias
                                                </TableHead>
                                                <TableHead className="text-center font-bold text-yellow-400">
                                                    Personajes
                                                </TableHead>
                                                <TableHead className="text-center font-bold text-yellow-400">
                                                    Ubicaciones
                                                </TableHead>
                                                <TableHead className="text-center font-bold text-yellow-400">
                                                    Cartas
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
                                            {worlds.data.map((world) => (
                                                <TableRow
                                                    key={world.id}
                                                    className="border-yellow-900/20 transition-colors hover:bg-yellow-900/10"
                                                >
                                                    <TableCell className="font-bold text-yellow-200">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="h-5 w-5 text-purple-400" />
                                                            {world.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-md text-yellow-200/70">
                                                        <div className="line-clamp-2">
                                                            {world.description ||
                                                                'Sin descripción'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <BookText className="h-4 w-4 text-purple-400" />
                                                            {world.stories_count ||
                                                                0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Users className="h-4 w-4 text-emerald-400" />
                                                            {world.characters_count ||
                                                                0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <MapPin className="h-4 w-4 text-rose-400" />
                                                            {world.locations_count ||
                                                                0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-yellow-200/80">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Swords className="h-4 w-4 text-amber-400" />
                                                            {world.cards_count ||
                                                                0}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-yellow-300/60">
                                                        {new Date(
                                                            world.created_at,
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
                                                                className="border-purple-700/50 bg-purple-900/50 text-purple-200 hover:border-purple-500/70 hover:bg-purple-800/70 hover:text-purple-100"
                                                            >
                                                                <Link
                                                                    href={`/admin/worlds/${world.id}/edit`}
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
                                                                        world.id,
                                                                        world.name,
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
                        {worlds.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {worlds.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {worlds.total}
                                        </span>{' '}
                                        mundos
                                    </div>
                                    <div className="flex gap-2">
                                        {worlds.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page - 1}${
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
                                            Página {worlds.current_page} de{' '}
                                            {worlds.last_page}
                                        </div>
                                        {worlds.current_page <
                                            worlds.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/worlds?page=${worlds.current_page + 1}${
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
