import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Globe, BookText, Users, MapPin, Swords, Pencil, Trash2, Plus, Search } from 'lucide-react';
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
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Mundos Épicos
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona los universos de tu juego TCG
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild>
                        <Link href="/admin/worlds/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Mundo
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
                    </CardContent>
                </Card>

                {/* Worlds Grid */}
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
                ) : (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {worlds.data.map((world) => (
                                <Card key={world.id} className="card-tcg group overflow-hidden border-primary/20 hover:border-primary/40">
                                    {/* World Image or Gradient Header */}
                                    <div className="relative h-32 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 overflow-hidden">
                                        {world.image_url ? (
                                            <img 
                                                src={world.image_url} 
                                                alt={world.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Globe className="h-16 w-16 text-primary/40 animate-float" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="flex items-start justify-between gap-2">
                                            <span className="line-clamp-1">{world.name}</span>
                                            <Globe className="h-5 w-5 text-primary shrink-0" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {world.description || 'Sin descripción'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded bg-purple-500/10">
                                                    <BookText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {world.stories_count || 0} historias
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded bg-emerald-500/10">
                                                    <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {world.characters_count || 0} personajes
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded bg-rose-500/10">
                                                    <MapPin className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {world.locations_count || 0} ubicaciones
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="p-1.5 rounded bg-violet-500/10">
                                                    <Swords className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {world.cards_count || 0} cartas
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href={`/admin/worlds/${world.id}/edit`}>
                                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(world.id, world.name)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>

                                        {/* Created Date */}
                                        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
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
                )}
            </div>
        </AdminLayout>
    );
}
