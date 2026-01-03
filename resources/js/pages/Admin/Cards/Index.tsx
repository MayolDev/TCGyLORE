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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    Brain,
    Filter,
    Grid3x3,
    Heart,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Swords,
    Table2,
    Trash2,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

interface CardData {
    id: number;
    name: string;
    card_type: { id: number; name: string } | null;
    rarity: { id: number; name: string } | null;
    cost: number;
    illustration_url?: string | null;
    effect?: string;
    world: {
        id: number;
        name: string;
    };
    character?: {
        id: number;
        name: string;
    } | null;
    strength?: number | null;
    agility?: number | null;
    charisma?: number | null;
    mind?: number | null;
    created_at: string;
}

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

const rarityBadgeVariant: Record<
    string,
    'common' | 'rare' | 'epic' | 'legendary' | 'outline'
> = {
    comun: 'common',
    común: 'common',
    Común: 'common',
    rara: 'rare',
    Rara: 'rare',
    epica: 'epic',
    épica: 'epic',
    Épica: 'epic',
    legendaria: 'legendary',
    Legendaria: 'legendary',
};

const rarityGradient: Record<string, string> = {
    comun: 'from-gray-400 to-gray-600',
    común: 'from-gray-400 to-gray-600',
    Común: 'from-gray-400 to-gray-600',
    rara: 'from-blue-400 to-blue-600',
    Rara: 'from-blue-400 to-blue-600',
    epica: 'from-purple-400 to-purple-600',
    épica: 'from-purple-400 to-purple-600',
    Épica: 'from-purple-400 to-purple-600',
    legendaria: 'from-amber-400 to-amber-600',
    Legendaria: 'from-amber-400 to-amber-600',
};

export default function Index({
    cards: initialCards,
    filters: initialFilters,
}: Props) {
    const cards = initialCards || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
    };
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
        router.get(
            '/admin/cards',
            { search, rarity: value },
            { preserveState: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setRarity('');
        router.get('/admin/cards');
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`¿Estás seguro de eliminar la carta "${name}"?`)) {
            router.delete(`/admin/cards/${id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Cartas TCG" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            CARTAS TCG LEGENDARIAS
                        </h1>
                        <p className="mt-2 text-base font-semibold text-yellow-200/70">
                            ⚔️ Gestiona las cartas de combate de tu juego épico
                        </p>
                    </div>
                    <Button
                        variant="magical"
                        size="lg"
                        asChild
                        className="border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 font-black text-white shadow-xl shadow-orange-500/50 hover:from-yellow-500 hover:to-red-500"
                    >
                        <Link href="/admin/cards/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Carta
                        </Link>
                    </Button>
                </div>

                {/* Search & Filters */}
                <Card className="border-primary/20">
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex flex-col gap-4">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col gap-2 sm:flex-row"
                            >
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar cartas por nombre..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtros
                                </Button>
                                <Button type="submit">Buscar</Button>
                                {(filters.search || filters.rarity) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearFilters}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </form>

                            {/* View Mode Toggle */}
                            <div className="flex justify-end gap-2">
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

                        {showFilters && (
                            <div className="flex flex-wrap gap-3 border-t pt-2">
                                <div className="w-full sm:w-48">
                                    <Select
                                        value={rarity}
                                        onValueChange={handleRarityChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todas las rarezas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Todas las rarezas
                                            </SelectItem>
                                            <SelectItem value="comun">
                                                Común
                                            </SelectItem>
                                            <SelectItem value="rara">
                                                Rara
                                            </SelectItem>
                                            <SelectItem value="epica">
                                                Épica
                                            </SelectItem>
                                            <SelectItem value="legendaria">
                                                Legendaria
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Cards Grid/Table */}
                {cards.data.length === 0 ? (
                    <Card className="border-2 border-dashed border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 rounded-full bg-violet-500/10 p-6">
                                <Swords className="animate-magical-glow h-12 w-12 text-violet-500" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold">
                                {filters.search || filters.rarity
                                    ? 'No se encontraron cartas'
                                    : '¡Crea tu primera carta!'}
                            </h3>
                            <p className="mb-6 max-w-md text-muted-foreground">
                                {filters.search || filters.rarity
                                    ? 'No hay cartas que coincidan con los filtros aplicados'
                                    : 'Diseña cartas épicas con habilidades únicas y estadísticas personalizadas'}
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
                                <Card
                                    key={card.id}
                                    className="card-tcg group overflow-hidden border-primary/20 hover:border-primary/40"
                                >
                                    {/* Card Illustration Header */}
                                    <div
                                        className={`relative h-48 bg-gradient-to-br ${rarityGradient[card.rarity?.name || 'comun'] || 'from-gray-400 to-gray-600'} overflow-hidden`}
                                    >
                                        {card.illustration_url ? (
                                            <img
                                                src={card.illustration_url}
                                                alt={card.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Swords className="animate-float h-20 w-20 text-white/30" />
                                            </div>
                                        )}

                                        {/* Cost Badge */}
                                        <div className="absolute top-2 right-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-background/90 shadow-lg backdrop-blur-sm">
                                            <span className="text-lg font-bold">
                                                {card.cost}
                                            </span>
                                        </div>

                                        {/* Rarity Badge */}
                                        {card.rarity && (
                                            <div className="absolute top-2 left-2">
                                                <Badge
                                                    variant={
                                                        rarityBadgeVariant[
                                                            card.rarity.name
                                                        ] || 'outline'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {card.rarity.name}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="line-clamp-1 flex items-center justify-between gap-2 text-base">
                                            <span>{card.name}</span>
                                            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {card.card_type?.name || 'Sin tipo'}{' '}
                                            • {card.world.name}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        {/* Stats */}
                                        {(card.strength ||
                                            card.agility ||
                                            card.charisma ||
                                            card.mind) && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {card.strength !== null && (
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <div className="rounded bg-red-500/10 p-1">
                                                            <Zap className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                        </div>
                                                        <span className="text-muted-foreground">
                                                            Fuerza:{' '}
                                                            {card.strength}
                                                        </span>
                                                    </div>
                                                )}
                                                {card.agility !== null && (
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <div className="rounded bg-green-500/10 p-1">
                                                            <Zap className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <span className="text-muted-foreground">
                                                            Agilidad:{' '}
                                                            {card.agility}
                                                        </span>
                                                    </div>
                                                )}
                                                {card.charisma !== null && (
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <div className="rounded bg-pink-500/10 p-1">
                                                            <Heart className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                                                        </div>
                                                        <span className="text-muted-foreground">
                                                            Carisma:{' '}
                                                            {card.charisma}
                                                        </span>
                                                    </div>
                                                )}
                                                {card.mind !== null && (
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <div className="rounded bg-blue-500/10 p-1">
                                                            <Brain className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <span className="text-muted-foreground">
                                                            Mente: {card.mind}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Effect Text (truncated) */}
                                        <div className="line-clamp-2 border-t pt-2 text-xs text-muted-foreground">
                                            {card.effect
                                                ? card.effect
                                                      .replace(/\*\*\*/g, '')
                                                      .replace(/---/g, '•')
                                                : 'Sin efecto'}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/cards/${card.id}/edit`}
                                                >
                                                    <Pencil className="mr-1.5 h-3 w-3" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    handleDelete(
                                                        card.id,
                                                        card.name,
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {cards.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {cards.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {cards.total}
                                        </span>{' '}
                                        cartas
                                    </div>
                                    <div className="flex gap-2">
                                        {cards.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page - 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
                                                    }${rarity ? `&rarity=${rarity}` : ''}`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {cards.current_page} de{' '}
                                            {cards.last_page}
                                        </div>
                                        {cards.current_page <
                                            cards.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page + 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
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
                                                <TableHead className="font-bold text-yellow-400">
                                                    Nombre
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Tipo
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Rareza
                                                </TableHead>
                                                <TableHead className="text-center font-bold text-yellow-400">
                                                    Coste
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Mundo
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Personaje
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Estadísticas
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
                                            {cards.data.map((card) => (
                                                <TableRow
                                                    key={card.id}
                                                    className="border-yellow-900/20 transition-colors hover:bg-yellow-900/10"
                                                >
                                                    <TableCell className="font-bold text-yellow-200">
                                                        <div className="flex items-center gap-2">
                                                            <Swords className="h-5 w-5 text-violet-400" />
                                                            {card.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        {card.card_type?.name ||
                                                            'Sin tipo'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                rarityBadgeVariant[
                                                                    card.rarity
                                                                        ?.name ||
                                                                        'común'
                                                                ] || 'outline'
                                                            }
                                                            className="font-semibold"
                                                        >
                                                            {card.rarity
                                                                ?.name ||
                                                                'Sin rareza'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className="border-amber-500/40 bg-amber-500/20 text-amber-300"
                                                        >
                                                            {card.cost}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        <Badge
                                                            variant="outline"
                                                            className="border-violet-500/40 bg-violet-500/20 text-violet-300"
                                                        >
                                                            {card.world.name}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-yellow-200/70">
                                                        {card.character
                                                            ? card.character
                                                                  .name
                                                            : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1 text-xs">
                                                            {card.strength && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-red-500/40 bg-red-500/20 text-red-300"
                                                                >
                                                                    <Zap className="mr-1 h-3 w-3" />
                                                                    {
                                                                        card.strength
                                                                    }
                                                                </Badge>
                                                            )}
                                                            {card.agility && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-green-500/40 bg-green-500/20 text-green-300"
                                                                >
                                                                    <Sparkles className="mr-1 h-3 w-3" />
                                                                    {
                                                                        card.agility
                                                                    }
                                                                </Badge>
                                                            )}
                                                            {card.charisma && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-pink-500/40 bg-pink-500/20 text-pink-300"
                                                                >
                                                                    <Heart className="mr-1 h-3 w-3" />
                                                                    {
                                                                        card.charisma
                                                                    }
                                                                </Badge>
                                                            )}
                                                            {card.mind && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-blue-500/40 bg-blue-500/20 text-blue-300"
                                                                >
                                                                    <Brain className="mr-1 h-3 w-3" />
                                                                    {card.mind}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-yellow-300/60">
                                                        {new Date(
                                                            card.created_at,
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
                                                                className="border-violet-700/50 bg-violet-900/50 text-violet-200 hover:border-violet-500/70 hover:bg-violet-800/70 hover:text-violet-100"
                                                            >
                                                                <Link
                                                                    href={`/admin/cards/${card.id}/edit`}
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
                                                                        card.id,
                                                                        card.name,
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
                        {cards.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {cards.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {cards.total}
                                        </span>{' '}
                                        cartas
                                    </div>
                                    <div className="flex gap-2">
                                        {cards.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page - 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
                                                    }${rarity ? `&rarity=${rarity}` : ''}`}
                                                >
                                                    Anterior
                                                </Link>
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2 px-3 text-sm">
                                            Página {cards.current_page} de{' '}
                                            {cards.last_page}
                                        </div>
                                        {cards.current_page <
                                            cards.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/cards?page=${cards.current_page + 1}${
                                                        search
                                                            ? `&search=${search}`
                                                            : ''
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
