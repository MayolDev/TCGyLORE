import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Plus, Search, Pencil, Trash2, FileText, Eye, EyeOff, Grid3x3, Table2, BookOpenCheck } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ManualSection {
    id: number;
    title: string;
    slug: string;
    category: string;
    content: string;
    order: number;
    is_published: boolean;
    parent_id: number | null;
    parent?: {
        id: number;
        title: string;
    };
    created_at: string;
}

interface PaginatedData {
    data: ManualSection[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    sections?: PaginatedData;
    filters?: {
        search?: string;
        category?: string;
    };
    categories: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manual del Juego', href: '/admin/manual-sections' },
];

const categoryColors: Record<string, string> = {
    fundamentos: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    mecanicas: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    cartas: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
    lore: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
    glosario: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30',
    desarrollo: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
};

export default function Index({ sections: initialSections, filters: initialFilters, categories }: Props) {
    const sections = initialSections || { data: [], current_page: 1, last_page: 1, per_page: 15, total: 0 };
    const filters = initialFilters || { search: '', category: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [previewSection, setPreviewSection] = useState<ManualSection | null>(null);
    const [showFullManual, setShowFullManual] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: { search?: string; category?: string } = {};
        if (search) params.search = search;
        if (category && category !== 'all') params.category = category;
        router.get('/admin/manual-sections', params, { preserveState: true });
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`¿Estás seguro de eliminar la sección "${title}"?`)) {
            router.delete(`/admin/manual-sections/${id}`);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('all');
        router.get('/admin/manual-sections');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manual del Juego" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            Manual del Juego
                        </h1>
                        <p className="text-yellow-200/70 mt-2 font-semibold text-base">
                            📚 Documenta las reglas, mecánicas y fundamentos de tu juego
                        </p>
                    </div>
                    <Button 
                        variant="magical" 
                        size="lg" 
                        asChild 
                        className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black shadow-xl shadow-orange-500/50 border-2 border-yellow-400/30" 
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        <Link href="/admin/manual-sections/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Nueva Sección
                        </Link>
                    </Button>
                    {sections.data.length > 0 && (
                        <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => setShowFullManual(true)}
                            className="border-2 border-blue-500/50 hover:bg-blue-600/20 text-blue-200 font-bold"
                        >
                            <BookOpenCheck className="mr-2 h-5 w-5" />
                            Ver Manual Completo
                        </Button>
                    )}
                </div>

                {/* Search & Filters */}
                <Card className="border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar secciones por título..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Todas las categorías" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las categorías</SelectItem>
                                        {Object.entries(categories).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button type="submit">Buscar</Button>
                                {(filters.search || filters.category) && (
                                    <Button type="button" variant="outline" onClick={clearFilters}>
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
                                    className={viewMode === 'grid' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                >
                                    <Grid3x3 className="h-4 w-4 mr-2" />
                                    Cards
                                </Button>
                                <Button
                                    type="button"
                                    variant={viewMode === 'table' ? 'default' : 'outline'}
                                    onClick={() => setViewMode('table')}
                                    className={viewMode === 'table' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                >
                                    <Table2 className="h-4 w-4 mr-2" />
                                    Tabla
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sections Grid/Table */}
                {sections.data.length === 0 ? (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-orange-500/10 p-6 mb-4">
                                <BookOpen className="h-12 w-12 text-orange-500 animate-float" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {filters.search || filters.category ? 'No se encontraron secciones' : '¡Crea tu primera sección del manual!'}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {filters.search || filters.category
                                    ? 'No hay secciones que coincidan con los filtros aplicados'
                                    : 'Empieza a documentar las reglas y mecánicas de tu juego'
                                }
                            </p>
                            {!filters.search && !filters.category && (
                                <Button variant="magical" size="lg" asChild>
                                    <Link href="/admin/manual-sections/create">
                                        <BookOpen className="mr-2 h-5 w-5" />
                                        Crear Primera Sección
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    <>
                        <div className="grid gap-4">
                            {sections.data.map((section) => (
                                <Card 
                                    key={section.id} 
                                    className="group overflow-hidden border-2 border-orange-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 hover:border-orange-400/70 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] transition-all duration-300"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={categoryColors[section.category] || 'bg-slate-500/10'}
                                                    >
                                                        {categories[section.category]}
                                                    </Badge>
                                                    {section.parent && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            ↳ {section.parent.title}
                                                        </Badge>
                                                    )}
                                                    <Badge 
                                                        variant="outline" 
                                                        className={section.is_published 
                                                            ? 'border-green-500/50 text-green-300 bg-green-500/10' 
                                                            : 'border-gray-500/50 text-gray-400 bg-gray-500/10'
                                                        }
                                                    >
                                                        {section.is_published ? (
                                                            <><Eye className="h-3 w-3 mr-1" /> Publicado</>
                                                        ) : (
                                                            <><EyeOff className="h-3 w-3 mr-1" /> Borrador</>
                                                        )}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                                        Orden: {section.order}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl flex items-center gap-2 text-yellow-100 font-black" style={{ fontFamily: 'Cinzel, serif' }}>
                                                    <FileText className="h-5 w-5 text-orange-400" />
                                                    {section.title}
                                                </CardTitle>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    asChild
                                                    className="bg-orange-900/50 hover:bg-orange-800/70 text-orange-200 hover:text-orange-100 border-orange-700/50 hover:border-orange-500/70"
                                                >
                                                    <Link href={`/admin/manual-sections/${section.id}/edit`}>
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                    onClick={() => handleDelete(section.id, section.title)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <CardDescription className="line-clamp-2 text-yellow-200/60 font-semibold">
                                            {section.content}
                                        </CardDescription>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-500/20">
                                            <div className="text-xs text-yellow-300/50 font-semibold">
                                                <FileText className="h-3 w-3 inline mr-1 text-orange-400" />
                                                {section.content.split(' ').length} palabras
                                            </div>
                                            <p className="text-xs text-yellow-300/50 font-semibold">
                                                Creado {new Date(section.created_at).toLocaleDateString('es-ES', { 
                                                    day: 'numeric', 
                                                    month: 'long', 
                                                    year: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {sections.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{sections.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{sections.total}</span> secciones
                                    </div>
                                    <div className="flex gap-2">
                                        {sections.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/manual-sections?page=${sections.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }${category ? `&category=${category}` : ''}`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {sections.current_page} de {sections.last_page}
                                        </div>
                                        {sections.current_page < sections.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/manual-sections?page=${sections.current_page + 1}${
                                                        search ? `&search=${search}` : ''
                                                    }${category ? `&category=${category}` : ''}`}
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
                                                <TableHead className="text-yellow-400 font-bold">Categoría</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Estado</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Orden</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Contenido</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Creado</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sections.data.map((section) => (
                                                <TableRow 
                                                    key={section.id} 
                                                    className="border-yellow-900/20 hover:bg-yellow-900/10 transition-colors"
                                                >
                                                    <TableCell className="font-bold text-yellow-200">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-orange-400" />
                                                            <div>
                                                                <div>{section.title}</div>
                                                                {section.parent && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        ↳ {section.parent.title}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={categoryColors[section.category] || 'bg-slate-500/10'}
                                                        >
                                                            {categories[section.category]}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={section.is_published 
                                                                ? 'border-green-500/50 text-green-300 bg-green-500/10' 
                                                                : 'border-gray-500/50 text-gray-400 bg-gray-500/10'
                                                            }
                                                        >
                                                            {section.is_published ? (
                                                                <><Eye className="h-3 w-3 mr-1" /> Publicado</>
                                                            ) : (
                                                                <><EyeOff className="h-3 w-3 mr-1" /> Borrador</>
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        {section.order}
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70 max-w-md">
                                                        <div className="line-clamp-2">
                                                            {section.content}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {section.content.split(' ').length} palabras
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-300/60 text-sm">
                                                        {new Date(section.created_at).toLocaleDateString('es-ES', { 
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
                                                                onClick={() => setPreviewSection(section)}
                                                                className="bg-blue-900/50 hover:bg-blue-800/70 text-blue-200 hover:text-blue-100 border-blue-700/50 hover:border-blue-500/70"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                asChild
                                                                className="bg-orange-900/50 hover:bg-orange-800/70 text-orange-200 hover:text-orange-100 border-orange-700/50 hover:border-orange-500/70"
                                                            >
                                                                <Link href={`/admin/manual-sections/${section.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                                onClick={() => handleDelete(section.id, section.title)}
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
                    </>
                )}

                {/* Modal de Vista Previa Individual */}
                <Dialog open={!!previewSection} onOpenChange={(open) => !open && setPreviewSection(null)}>
                    <DialogContent className="!max-w-none w-screen max-h-screen h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-orange-500/40 rounded-none" style={{ maxWidth: 'none' }}>
                        <DialogHeader className="border-b-2 border-orange-500/30 pb-4 px-8">
                            <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500" style={{ fontFamily: 'Cinzel, serif' }}>
                                📖 {previewSection?.title}
                            </DialogTitle>
                            <DialogDescription className="text-yellow-200/70 text-base">
                                {categories[previewSection?.category || '']} • {previewSection?.content.split(' ').length} palabras
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-7xl mx-auto bg-slate-800/50 rounded-xl p-12 border-2 border-orange-500/20 shadow-2xl">
                                <div className="prose prose-orange prose-lg max-w-none">
                                    <ReactMarkdown>{previewSection?.content || ''}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal de Manual Completo */}
                <Dialog open={showFullManual} onOpenChange={setShowFullManual}>
                    <DialogContent className="!max-w-none w-screen max-h-screen h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-blue-500/40 rounded-none" style={{ maxWidth: 'none' }}>
                        <DialogHeader className="border-b-2 border-blue-500/30 pb-4 px-8">
                            <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-400 to-purple-500" style={{ fontFamily: 'Cinzel, serif' }}>
                                📚 Manual Completo del Juego
                            </DialogTitle>
                            <DialogDescription className="text-blue-200/70 text-base">
                                {sections.total} secciones • {sections.data.reduce((acc, s) => acc + s.content.split(' ').length, 0)} palabras totales
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-7xl mx-auto bg-slate-800/50 rounded-xl p-12 border-2 border-blue-500/20 shadow-2xl">
                                <div className="prose prose-orange prose-lg max-w-none space-y-16">
                                    {sections.data
                                        .sort((a, b) => {
                                            // Ordenar por categoría y luego por orden
                                            if (a.category !== b.category) {
                                                const catOrder = ['fundamentos', 'mecanicas', 'cartas', 'lore', 'glosario', 'desarrollo'];
                                                return catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
                                            }
                                            return a.order - b.order;
                                        })
                                        .map((section, index) => (
                                            <div key={section.id} className="border-t-4 border-orange-500/30 pt-8 first:border-t-0 first:pt-0">
                                                <div className="mb-6">
                                                    <Badge className="mb-2 bg-orange-600/20 text-orange-300 border-orange-500/50">
                                                        {categories[section.category]}
                                                    </Badge>
                                                    <h1 className="!mt-2 !mb-4">{section.title}</h1>
                                                </div>
                                                <ReactMarkdown>{section.content}</ReactMarkdown>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}

