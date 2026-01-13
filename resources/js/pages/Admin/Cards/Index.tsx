import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Swords, 
    Plus, 
    Search, 
    Pencil, 
    Trash2,
    Zap,
    Heart,
    Brain,
    Sparkles,
    Filter,
    Grid3x3,
    Table2
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { CardData } from '@/types/card';
import { rarityBadgeVariant } from '@/lib/card-helpers';
import CardGridItem from './CardGridItem';

interface PaginatedCards {
    data: CardData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    cards?: PaginatedCards;
    filters?: {
        search?: string;
        rarity?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cartas TCG', href: '/admin/cards' },
];

export default function Index({ cards: initialCards, filters: initialFilters }: Props) {
    const cards = initialCards || { data: [], current_page: 1, last_page: 1, per_page: 12, total: 0 };
    const filters = initialFilters || { search: '', rarity: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [rarity, setRarity] = useState(filters.rarity || '');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/cards', { search, rarity }, { preserveState: true });
    };

    const handleRarityChange = (value: string) => {
        setRarity(value);
        router.get('/admin/cards', { search, rarity: value }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setRarity('');
        router.get('/admin/cards');
    };

    const handleDelete = useCallback((id: number, name: string) => {
        if (confirm(`¿Estás seguro de eliminar la carta "${name}"?`)) {
            router.delete(`/admin/cards/${id}`);
        }
    }, []);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Cartas TCG" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]" style={{ fontFamily: 'Cinzel, serif' }}>
                            CARTAS TCG LEGENDARIAS
                        </h1>
                        <p className="text-yellow-200/70 mt-2 font-semibold text-base">
                            ⚔️ Gestiona las cartas de combate de tu juego épico
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white font-black shadow-xl shadow-orange-500/50 border-2 border-yellow-400/30">
                        <Link href="/admin/cards/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Carta
                        </Link>
                    </Button>
                </div>

                {/* Search & Filters */}
                <Card className="border-primary/20">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex flex-col gap-4">
                            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar cartas por nombre..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtros
                                </Button>
                                <Button type="submit">Buscar</Button>
                                {(filters.search || filters.rarity) && (
                                    <Button type="button" variant="outline" onClick={clearFilters}>
                                        Limpiar
                                    </Button>
                                )}
                            </form>

                            {/* View Mode Toggle */}
                            <div className="flex gap-2 justify-end">
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

                        {showFilters && (
                            <div className="flex flex-wrap gap-3 pt-2 border-t">
                                <div className="w-full sm:w-48">
                                    <Select value={rarity} onValueChange={handleRarityChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todas las rarezas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las rarezas</SelectItem>
                                            <SelectItem value="comun">Común</SelectItem>
                                            <SelectItem value="rara">Rara</SelectItem>
                                            <SelectItem value="epica">Épica</SelectItem>
                                            <SelectItem value="legendaria">Legendaria</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Cards Grid/Table */}
                {cards.data.length === 0 ? (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-violet-500/10 p-6 mb-4">
                                <Swords className="h-12 w-12 text-violet-500 animate-magical-glow" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {filters.search || filters.rarity ? 'No se encontraron cartas' : '¡Crea tu primera carta!'}
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                {filters.search || filters.rarity
                                    ? 'No hay cartas que coincidan con los filtros aplicados'
                                    : 'Diseña cartas épicas con habilidades únicas y estadísticas personalizadas'
                                }
                            </p>
                            {!filters.search && !filters.rarity && (
                                <Button variant="magical" size="lg" asChild>
                                    <Link href="/admin/cards/create">
                                        <Swords className="mr-2 h-5 w-5" />
                                        Crear Primera Carta
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {cards.data.map((card) => (
                                <CardGridItem key={card.id} card={card} onDelete={handleDelete} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {cards.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{cards.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{cards.total}</span> cartas
                                    </div>
                                    <div className="flex gap-2">
                                        {cards.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }${rarity ? `&rarity=${rarity}` : ''}`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {cards.current_page} de {cards.last_page}
                                        </div>
                                        {cards.current_page < cards.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page + 1}${
                                                        search ? `&search=${search}` : ''
                                                    }${rarity ? `&rarity=${rarity}` : ''}`}
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
                                                <TableHead className="text-yellow-400 font-bold">Tipo</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Rareza</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-center">Coste</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Mundo</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Personaje</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Estadísticas</TableHead>
                                                <TableHead className="text-yellow-400 font-bold">Creado</TableHead>
                                                <TableHead className="text-yellow-400 font-bold text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cards.data.map((card) => (
                                                <TableRow 
                                                    key={card.id} 
                                                    className="border-yellow-900/20 hover:bg-yellow-900/10 transition-colors"
                                                >
                                                    <TableCell className="font-bold text-yellow-200">
                                                        <div className="flex items-center gap-2">
                                                            <Swords className="h-5 w-5 text-violet-400" />
                                                            {card.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        {card.card_type?.name || 'Sin tipo'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={rarityBadgeVariant[card.rarity?.name || 'común'] || 'outline'}
                                                            className="font-semibold"
                                                        >
                                                            {card.rarity?.name || 'Sin rareza'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className="bg-amber-500/20 border-amber-500/40 text-amber-300">
                                                            {card.cost}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        <Badge variant="outline" className="bg-violet-500/20 border-violet-500/40 text-violet-300">
                                                            {card.world.name}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        {card.character ? card.character.name : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1 text-xs">
                                                            {card.strength && (
                                                                <Badge variant="outline" className="bg-red-500/20 border-red-500/40 text-red-300">
                                                                    <Zap className="h-3 w-3 mr-1" />
                                                                    {card.strength}
                                                                </Badge>
                                                            )}
                                                            {card.agility && (
                                                                <Badge variant="outline" className="bg-green-500/20 border-green-500/40 text-green-300">
                                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                                    {card.agility}
                                                                </Badge>
                                                            )}
                                                            {card.charisma && (
                                                                <Badge variant="outline" className="bg-pink-500/20 border-pink-500/40 text-pink-300">
                                                                    <Heart className="h-3 w-3 mr-1" />
                                                                    {card.charisma}
                                                                </Badge>
                                                            )}
                                                            {card.mind && (
                                                                <Badge variant="outline" className="bg-blue-500/20 border-blue-500/40 text-blue-300">
                                                                    <Brain className="h-3 w-3 mr-1" />
                                                                    {card.mind}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-300/60 text-sm">
                                                        {new Date(card.created_at).toLocaleDateString('es-ES', { 
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
                                                                className="bg-violet-900/50 hover:bg-violet-800/70 text-violet-200 hover:text-violet-100 border-violet-700/50 hover:border-violet-500/70"
                                                            >
                                                                <Link href={`/admin/cards/${card.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                                onClick={() => handleDelete(card.id, card.name)}
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
                        {cards.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando <span className="font-medium text-foreground">{cards.data.length}</span> de{' '}
                                        <span className="font-medium text-foreground">{cards.total}</span> cartas
                                    </div>
                                    <div className="flex gap-2">
                                        {cards.current_page > 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page - 1}${
                                                        search ? `&search=${search}` : ''
                                                    }${rarity ? `&rarity=${rarity}` : ''}`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {cards.current_page} de {cards.last_page}
                                        </div>
                                        {cards.current_page < cards.last_page && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page + 1}${
                                                        search ? `&search=${search}` : ''
                                                    }${rarity ? `&rarity=${rarity}` : ''}`}
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
