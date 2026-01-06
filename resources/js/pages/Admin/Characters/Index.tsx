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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Grid3x3,
    Pencil,
    Plus,
    Scroll,
    Search,
    Sparkles,
    Table2,
    Trash2,
    User,
    Users,
} from 'lucide-react';
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

export default function Index({
    characters: initialCharacters,
    filters: initialFilters,
}: Props) {
    const characters = initialCharacters || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
    };
    const filters = initialFilters || { search: '' };
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
                        <h1
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent uppercase drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            Personajes Legendarios
                        </h1>
                        <p className="mt-2 text-base font-semibold text-yellow-200/70">
                            👥 Gestiona los héroes y villanos de tus mundos
                        </p>
                    </div>
                    <Button
                        variant="magical"
                        size="lg"
                        asChild
                        className="border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 font-black text-white shadow-xl shadow-orange-500/50 hover:from-yellow-500 hover:to-red-500"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        <Link href="/admin/characters/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Crear Personaje
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
                                        placeholder="Buscar personajes por nombre..."
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

                {/* Characters Grid/Table */}
                {characters.data.length === 0 ? (
                    <Card className="border-2 border-dashed border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 rounded-full bg-emerald-500/10 p-6">
                                <Users className="animate-float h-12 w-12 text-emerald-500" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold">
                                {filters.search
                                    ? 'No se encontraron personajes'
                                    : '¡Crea tu primer personaje!'}
                            </h3>
                            <p className="mb-6 max-w-md text-muted-foreground">
                                {filters.search
                                    ? `No hay personajes que coincidan con "${filters.search}"`
                                    : 'Da vida a héroes épicos, villanos temibles y aliados memorables'}
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
                ) : viewMode === 'grid' ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {characters.data.map((character) => (
                                <Card
                                    key={character.id}
                                    className="group relative overflow-hidden border-4 border-emerald-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:border-emerald-400/70 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                                >
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    {/* Character Header with Avatar */}
                                    <div className="relative h-48 overflow-hidden border-b-2 border-emerald-500/30 bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-cyan-600/30">
                                        {character.image_url ? (
                                            <img
                                                src={character.image_url}
                                                alt={character.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative">
                                                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 opacity-50 blur-xl" />
                                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                                                        <User className="h-12 w-12 text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

                                        {/* World Badge */}
                                        <div className="absolute top-2 right-2">
                                            <Badge
                                                variant="secondary"
                                                className="border-emerald-500/30 bg-slate-900/90 font-bold text-yellow-200 backdrop-blur-sm"
                                            >
                                                {character.world.name}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="relative z-10 pb-3">
                                        <CardTitle
                                            className="flex items-center justify-between gap-2 text-xl font-black text-yellow-100"
                                            style={{
                                                fontFamily: 'Cinzel, serif',
                                            }}
                                        >
                                            <span className="line-clamp-1">
                                                {character.name}
                                            </span>
                                            <Sparkles className="h-6 w-6 shrink-0 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 font-semibold text-yellow-200/60">
                                            {character.biography ||
                                                'Sin biografía'}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        {/* Spells */}
                                        {character.spells &&
                                            Array.isArray(character.spells) &&
                                            character.spells.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-yellow-200/70">
                                                        <Scroll className="h-4 w-4 text-teal-400 drop-shadow-[0_0_5px_rgba(20,184,166,0.6)]" />
                                                        <span>
                                                            Hechizos (
                                                            {
                                                                character.spells
                                                                    .length
                                                            }
                                                            )
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {character.spells
                                                            .slice(0, 3)
                                                            .map(
                                                                (
                                                                    spell,
                                                                    index,
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="outline"
                                                                        className="border-teal-500/50 bg-teal-500/30 text-xs font-bold text-teal-200"
                                                                    >
                                                                        {spell}
                                                                    </Badge>
                                                                ),
                                                            )}
                                                        {character.spells
                                                            .length > 3 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-slate-600/50 bg-slate-700/50 text-xs text-yellow-200"
                                                            >
                                                                +
                                                                {character
                                                                    .spells
                                                                    .length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-emerald-500/50 font-bold text-emerald-200 hover:bg-emerald-600/20 hover:text-emerald-100"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/characters/${character.id}/edit`}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                        onClick={() =>
                                                            handleDelete(
                                                                character.id,
                                                                character.name,
                                                            )
                                                        }
                                                        aria-label="Eliminar personaje"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Eliminar</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* Created Date */}
                                        <p className="border-t border-emerald-500/30 pt-2 text-center text-xs font-semibold text-yellow-300/50">
                                            Creado{' '}
                                            {new Date(
                                                character.created_at,
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
                        {characters.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {characters.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {characters.total}
                                        </span>{' '}
                                        personajes
                                    </div>
                                    <div className="flex gap-2">
                                        {characters.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/characters?page=${characters.current_page - 1}${
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
                                            Página {characters.current_page} de{' '}
                                            {characters.last_page}
                                        </div>
                                        {characters.current_page <
                                            characters.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/characters?page=${characters.current_page + 1}${
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
                                                    Mundo
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Biografía
                                                </TableHead>
                                                <TableHead className="font-bold text-yellow-400">
                                                    Hechizos
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
                                            {characters.data.map(
                                                (character) => (
                                                    <TableRow
                                                        key={character.id}
                                                        className="border-yellow-900/20 transition-colors hover:bg-yellow-900/10"
                                                    >
                                                        <TableCell className="font-bold text-yellow-200">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-5 w-5 text-emerald-400" />
                                                                {character.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-yellow-200/70">
                                                            <Badge
                                                                variant="outline"
                                                                className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                                                            >
                                                                {
                                                                    character
                                                                        .world
                                                                        .name
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="max-w-md text-yellow-200/70">
                                                            <div className="line-clamp-2">
                                                                {character.biography ||
                                                                    'Sin biografía'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(() => {
                                                                    let spells =
                                                                        null;

                                                                    if (
                                                                        Array.isArray(
                                                                            character.spells,
                                                                        )
                                                                    ) {
                                                                        spells =
                                                                            character.spells;
                                                                    } else if (
                                                                        typeof character.spells ===
                                                                            'string' &&
                                                                        character.spells
                                                                    ) {
                                                                        try {
                                                                            spells =
                                                                                JSON.parse(
                                                                                    character.spells,
                                                                                );
                                                                        } catch {
                                                                            // Si no es JSON válido, tratarlo como un solo hechizo
                                                                            spells =
                                                                                [
                                                                                    character.spells,
                                                                                ];
                                                                        }
                                                                    }

                                                                    return spells &&
                                                                        spells.length >
                                                                            0 ? (
                                                                        <>
                                                                            {spells
                                                                                .slice(
                                                                                    0,
                                                                                    3,
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        spell: string,
                                                                                        idx: number,
                                                                                    ) => (
                                                                                        <Badge
                                                                                            key={
                                                                                                idx
                                                                                            }
                                                                                            variant="outline"
                                                                                            className="border-teal-500/40 bg-teal-500/20 text-xs text-teal-300"
                                                                                        >
                                                                                            <Scroll className="mr-1 h-3 w-3" />
                                                                                            {
                                                                                                spell
                                                                                            }
                                                                                        </Badge>
                                                                                    ),
                                                                                )}
                                                                            {spells.length >
                                                                                3 && (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="border-teal-500/40 bg-teal-500/20 text-xs text-teal-300"
                                                                                >
                                                                                    +
                                                                                    {spells.length -
                                                                                        3}
                                                                                </Badge>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-sm text-yellow-200/50">
                                                                            Sin
                                                                            hechizos
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-yellow-300/60">
                                                            {new Date(
                                                                character.created_at,
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
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            asChild
                                                                            className="border-emerald-700/50 bg-emerald-900/50 text-emerald-200 hover:border-emerald-500/70 hover:bg-emerald-800/70 hover:text-emerald-100"
                                                                            aria-label="Editar personaje"
                                                                        >
                                                                            <Link
                                                                                href={`/admin/characters/${character.id}/edit`}
                                                                            >
                                                                                <Pencil className="h-4 w-4" />
                                                                            </Link>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Editar
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="border-red-500/50 text-red-300 hover:bg-red-600/20 hover:text-red-200"
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    character.id,
                                                                                    character.name,
                                                                                )
                                                                            }
                                                                            aria-label="Eliminar personaje"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Eliminar
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {characters.last_page > 1 && (
                            <Card className="border-primary/20">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando{' '}
                                        <span className="font-medium text-foreground">
                                            {characters.data.length}
                                        </span>{' '}
                                        de{' '}
                                        <span className="font-medium text-foreground">
                                            {characters.total}
                                        </span>{' '}
                                        personajes
                                    </div>
                                    <div className="flex gap-2">
                                        {characters.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/characters?page=${characters.current_page - 1}${
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
                                            Página {characters.current_page} de{' '}
                                            {characters.last_page}
                                        </div>
                                        {characters.current_page <
                                            characters.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/characters?page=${characters.current_page + 1}${
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
