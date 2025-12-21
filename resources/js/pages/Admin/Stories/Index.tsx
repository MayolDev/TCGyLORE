import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookText, Plus, Search, Pencil, Trash2, Sparkles, FileText } from 'lucide-react';
import { useState } from 'react';

interface Story {
    id: number;
    title: string;
    content: string;
    category: string | null;
    image_url: string | null;
    world: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface PaginatedData {
    data: Story[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    stories?: PaginatedData;
    filters?: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Historias', href: '/admin/stories' },
];

const categoryColors: Record<string, string> = {
    'Main Quest': 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
    'Side Quest': 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    'Lore Entry': 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    'Legend': 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
};

export default function Index({ stories: initialStories, filters: initialFilters }: Props) {
    const stories = initialStories || { data: [], current_page: 1, last_page: 1, per_page: 12, total: 0 };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/stories', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`¿Estás seguro de eliminar la historia "${title}"?`)) {
            router.delete(`/admin/stories/${id}`);
        }
    };

    const clearSearch = () => {
        setSearch('');
        router.get('/admin/stories');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Historias" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Historias Épicas
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona las narrativas y leyendas de tus mundos
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild>
                        <Link href="/admin/stories/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Historia
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
                                    placeholder="Buscar historias por título..."
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

                {/* Stories Grid */}
                {stories.data.length === 0 ? (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-purple-500/10 p-6 mb-4">
                                <BookText className="h-12 w-12 text-purple-500 animate-float" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {filters.search ? 'No se encontraron historias' : '¡Escribe tu primera historia!'}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {filters.search
                                    ? `No hay historias que coincidan con "${filters.search}"`
                                    : 'Crea narrativas épicas que den vida a tu universo TCG'
                                }
                            </p>
                            {!filters.search && (
                                <Button variant="magical" size="lg" asChild>
                                    <Link href="/admin/stories/create">
                                        <BookText className="mr-2 h-5 w-5" />
                                        Escribir Primera Historia
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {stories.data.map((story) => (
                                <Card key={story.id} className="card-tcg group overflow-hidden border-primary/20 hover:border-primary/40 flex flex-col">
                                    {/* Story Image/Header */}
                                    <div className="relative h-40 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-rose-500/20 overflow-hidden">
                                        {story.image_url ? (
                                            <img 
                                                src={story.image_url} 
                                                alt={story.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FileText className="h-16 w-16 text-purple-500/30 animate-float" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                                        
                                        {/* Category Badge */}
                                        {story.category && (
                                            <div className="absolute top-2 left-2">
                                                <Badge 
                                                    variant="outline" 
                                                    className={categoryColors[story.category] || 'bg-secondary'}
                                                >
                                                    {story.category}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* World Badge */}
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                                                {story.world.name}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center justify-between gap-2">
                                            <span className="line-clamp-2">{story.title}</span>
                                            <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4 flex-1 flex flex-col">
                                        {/* Content Preview */}
                                        <CardDescription className="line-clamp-3 flex-1">
                                            {story.content}
                                        </CardDescription>

                                        {/* Word Count */}
                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <FileText className="h-3 w-3" />
                                            <span>{story.content.split(' ').length} palabras</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t">
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href={`/admin/stories/${story.id}/edit`}>
                                                    <Pencil className="mr-1.5 h-3 w-3" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(story.id, story.title)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        {/* Created Date */}
                                        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
                                            Creado {new Date(story.created_at).toLocaleDateString('es-ES', { 
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
                        {stories.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{stories.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{stories.total}</span> historias
                                    </div>
                                    <div className="flex gap-2">
                                        {stories.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/stories?page=${stories.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {stories.current_page} de {stories.last_page}
                                        </div>
                                        {stories.current_page < stories.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/stories?page=${stories.current_page + 1}${
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
