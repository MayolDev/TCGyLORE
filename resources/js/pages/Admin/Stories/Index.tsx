import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookText, Plus, Search, Pencil, Trash2, Sparkles, FileText, Grid3x3, Table2 } from 'lucide-react';
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
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            Historias Épicas
                        </h1>
                        <p className="text-yellow-200/70 mt-2 font-semibold text-base">
                            📖 Gestiona las narrativas y leyendas de tus mundos
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black shadow-xl shadow-orange-500/50 border-2 border-yellow-400/30" style={{ fontFamily: 'Cinzel, serif' }}>
                        <Link href="/admin/stories/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Historia
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

                {/* Stories Grid/Table */}
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
                ) : viewMode === 'grid' ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {stories.data.map((story) => (
                                <Card key={story.id} className="group overflow-hidden border-4 border-purple-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 hover:border-purple-400/70 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105 hover:-rotate-1 relative flex flex-col">
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Story Image/Header */}
                                    <div className="relative h-40 bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-rose-600/30 overflow-hidden border-b-2 border-purple-500/30">
                                        {story.image_url ? (
                                            <img 
                                                src={story.image_url} 
                                                alt={story.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FileText className="h-20 w-20 text-purple-400/60 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                                        
                                        {/* Category Badge */}
                                        {story.category && (
                                            <div className="absolute top-2 left-2">
                                                <Badge 
                                                    variant="outline" 
                                                    className="backdrop-blur-sm bg-slate-900/90 border-purple-500/50 text-purple-200 font-bold"
                                                >
                                                    {story.category}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* World Badge */}
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="secondary" className="backdrop-blur-sm bg-slate-900/90 border-purple-500/30 text-yellow-200 font-bold">
                                                {story.world.name}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-3 relative z-10">
                                        <CardTitle className="text-xl flex items-center justify-between gap-2 text-yellow-100 font-black" style={{ fontFamily: 'Cinzel, serif' }}>
                                            <span className="line-clamp-2">{story.title}</span>
                                            <Sparkles className="h-6 w-6 text-purple-400 shrink-0 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4 flex-1 flex flex-col relative z-10">
                                        {/* Content Preview */}
                                        <CardDescription className="line-clamp-3 flex-1 text-yellow-200/60 font-semibold">
                                            {story.content}
                                        </CardDescription>

                                        {/* Word Count */}
                                        <div className="text-xs text-yellow-200/70 flex items-center gap-1.5 font-semibold">
                                            <FileText className="h-3 w-3 text-purple-400" />
                                            <span>{story.content.split(' ').length} palabras</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1 border-purple-500/50 text-purple-200 hover:bg-purple-600/20 hover:text-purple-100 font-bold" asChild>
                                                <Link href={`/admin/stories/${story.id}/edit`}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                onClick={() => handleDelete(story.id, story.title)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Created Date */}
                                        <p className="text-xs text-yellow-300/50 text-center pt-2 border-t border-purple-500/30 font-semibold">
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
                ) : (
                    /* Table View */
                    <>
                        <Card className="border-primary/20">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-yellow-900/30 hover:bg-yellow-900/10">
                                                <TableHead className="text-yellow-400 font-bold">Título</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Mundo</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Categoría</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Contenido</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Creado</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stories.data.map((story) => (
                                                <TableRow 
                                                    key={story.id} 
                                                    className="border-yellow-900/20 hover:bg-yellow-900/10 transition-colors"
                                                >
                                                    <TableCell className="font-bold text-yellow-200">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-purple-400" />
                                                            {story.title}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        <Badge variant="outline" className="bg-purple-500/20 border-purple-500/40 text-purple-300">
                                                            {story.world.name}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {story.category && (
                                                            <Badge 
                                                                variant="outline" 
                                                                className={`${categoryColors[story.category] || 'bg-violet-500/20 border-violet-500/40 text-violet-300'}`}
                                                            >
                                                                {story.category}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70 max-w-md">
                                                        <div className="line-clamp-2">
                                                            {story.content}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-300/60 text-sm">
                                                        {new Date(story.created_at).toLocaleDateString('es-ES', { 
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
                                                                <Link href={`/admin/stories/${story.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                                onClick={() => handleDelete(story.id, story.title)}
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
