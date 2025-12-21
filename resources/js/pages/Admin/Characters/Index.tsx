import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Plus, Search, Pencil, Trash2, Sparkles, Scroll, User } from 'lucide-react';
import { useState } from 'react';

interface Character {
    id: number;
    name: string;
    biography: string | null;
    image_url: string | null;
    spells: string[] | null;
    world: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface PaginatedData {
    data: Character[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    characters?: PaginatedData;
    filters?: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Personajes', href: '/admin/characters' },
];

export default function Index({ characters: initialCharacters, filters: initialFilters }: Props) {
    const characters = initialCharacters || { data: [], current_page: 1, last_page: 1, per_page: 12, total: 0 };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/characters', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`¿Estás seguro de eliminar al personaje "${name}"?`)) {
            router.delete(`/admin/characters/${id}`);
        }
    };

    const clearSearch = () => {
        setSearch('');
        router.get('/admin/characters');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Personajes" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            Personajes Legendarios
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona los héroes y villanos de tus mundos
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild>
                        <Link href="/admin/characters/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Personaje
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
                                    placeholder="Buscar personajes por nombre..."
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

                {/* Characters Grid */}
                {characters.data.length === 0 ? (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-emerald-500/10 p-6 mb-4">
                                <Users className="h-12 w-12 text-emerald-500 animate-float" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {filters.search ? 'No se encontraron personajes' : '¡Crea tu primer personaje!'}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {filters.search
                                    ? `No hay personajes que coincidan con "${filters.search}"`
                                    : 'Da vida a héroes épicos, villanos temibles y aliados memorables'
                                }
                            </p>
                            {!filters.search && (
                                <Button variant="magical" size="lg" asChild>
                                    <Link href="/admin/characters/create">
                                        <Users className="mr-2 h-5 w-5" />
                                        Crear Primer Personaje
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {characters.data.map((character) => (
                                <Card key={character.id} className="card-tcg group overflow-hidden border-primary/20 hover:border-primary/40">
                                    {/* Character Header with Avatar */}
                                    <div className="relative h-48 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 overflow-hidden">
                                        {character.image_url ? (
                                            <img 
                                                src={character.image_url} 
                                                alt={character.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-xl opacity-50 animate-pulse" />
                                                    <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                                        <User className="h-12 w-12 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                                        
                                        {/* World Badge */}
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                                                {character.world.name}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center justify-between gap-2">
                                            <span className="line-clamp-1">{character.name}</span>
                                            <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {character.biography || 'Sin biografía'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Spells */}
                                        {character.spells && Array.isArray(character.spells) && character.spells.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                    <Scroll className="h-3.5 w-3.5 text-teal-500" />
                                                    <span>Hechizos ({character.spells.length})</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {character.spells.slice(0, 3).map((spell, index) => (
                                                        <Badge 
                                                            key={index} 
                                                            variant="outline" 
                                                            className="text-xs bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300"
                                                        >
                                                            {spell}
                                                        </Badge>
                                                    ))}
                                                    {character.spells.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{character.spells.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t">
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href={`/admin/characters/${character.id}/edit`}>
                                                    <Pencil className="mr-1.5 h-3 w-3" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(character.id, character.name)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        {/* Created Date */}
                                        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
                                            Creado {new Date(character.created_at).toLocaleDateString('es-ES', { 
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
                        {characters.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{characters.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{characters.total}</span> personajes
                                    </div>
                                    <div className="flex gap-2">
                                        {characters.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/characters?page=${characters.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {characters.current_page} de {characters.last_page}
                                        </div>
                                        {characters.current_page < characters.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/characters?page=${characters.current_page + 1}${
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
