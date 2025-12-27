import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Globe,
    BookText,
    Users,
    MapPin,
    Clock,
    Swords,
    UserCircle,
    Sparkles,
    TrendingUp,
    Plus,
    Eye
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface StatsData {
    worlds: number;
    stories: number;
    characters: number;
    locations: number;
    timeline_events: number;
    cards: number;
    users: number;
    cards_by_rarity: Record<string, number>;
    recent_cards: Array<{
        id: number;
        name: string;
        rarity: { id: number; name: string } | null;
        cost: number;
        world: { name: string };
    }>;
}

interface DashboardProps {
    stats?: StatsData;
}

export default function Dashboard({ stats }: DashboardProps) {
    const page = usePage<any>();
    const auth = page.props.auth || {};
    const user = auth.user;
    const isAdmin = user?.roles?.some((role: any) => role.name === 'Admin') || false;

    const defaultStats: StatsData = {
        worlds: 0,
        stories: 0,
        characters: 0,
        locations: 0,
        timeline_events: 0,
        cards: 0,
        users: 0,
        cards_by_rarity: {},
        recent_cards: [],
    };

    const currentStats = stats || defaultStats;
    const hasContent = currentStats.worlds > 0 || currentStats.cards > 0;

    const modules = [
        {
            name: 'Mundos',
            icon: Globe,
            count: currentStats.worlds,
            href: '/admin/worlds',
            color: 'from-blue-500 to-cyan-600',
            bgGlow: 'bg-blue-500/10',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            name: 'Historias',
            icon: BookText,
            count: currentStats.stories,
            href: '/admin/stories',
            color: 'from-purple-500 to-pink-600',
            bgGlow: 'bg-purple-500/10',
            iconColor: 'text-purple-600 dark:text-purple-400'
        },
        {
            name: 'Personajes',
            icon: Users,
            count: currentStats.characters,
            href: '/admin/characters',
            color: 'from-emerald-500 to-teal-600',
            bgGlow: 'bg-emerald-500/10',
            iconColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            name: 'Ubicaciones',
            icon: MapPin,
            count: currentStats.locations,
            href: '/admin/locations',
            color: 'from-rose-500 to-orange-600',
            bgGlow: 'bg-rose-500/10',
            iconColor: 'text-rose-600 dark:text-rose-400'
        },
        {
            name: 'Línea de Tiempo',
            icon: Clock,
            count: currentStats.timeline_events,
            href: '/admin/timeline-events',
            color: 'from-amber-500 to-yellow-600',
            bgGlow: 'bg-amber-500/10',
            iconColor: 'text-amber-600 dark:text-amber-400'
        },
        {
            name: 'Cartas TCG',
            icon: Swords,
            count: currentStats.cards,
            href: '/admin/cards',
            color: 'from-violet-500 to-purple-600',
            bgGlow: 'bg-violet-500/10',
            iconColor: 'text-violet-600 dark:text-violet-400'
        },
    ];

    if (isAdmin) {
        modules.push({
            name: 'Usuarios',
            icon: UserCircle,
            count: currentStats.users,
            href: '/admin/users',
            color: 'from-slate-500 to-gray-600',
            bgGlow: 'bg-slate-500/10',
            iconColor: 'text-slate-600 dark:text-slate-400'
        });
    }

    const rarityColors: Record<string, string> = {
        'común': 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
        'rara': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
        'épica': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
        'legendaria': 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    };

    const totalCards = Object.values(currentStats.cards_by_rarity).reduce((a, b) => a + b, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-8 p-6">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-8 backdrop-blur-sm border border-primary/20">
                    <div className="absolute inset-0 bg-grid-white/5" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="h-8 w-8 text-primary animate-magical-glow" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                                Bienvenido al Sistema de Lore TCG
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Gestiona mundos épicos, crea historias inmersivas y diseña cartas legendarias para tu juego de rol TCG
                        </p>
                    </div>
                </div>

                {/* Stats Grid - Tarjetas estilo TCG */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <Link key={module.name} href={module.href}>
                                <Card className="card-tcg group cursor-pointer overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {module.name}
                                        </CardTitle>
                                        <div className={`p-3 rounded-lg ${module.bgGlow} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`h-5 w-5 ${module.iconColor}`} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold mb-1 bg-gradient-to-br ${module.color} bg-clip-text text-transparent">
                                            {module.count}
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            {module.count === 1 ? 'registro' : 'registros'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Quick Actions */}
                    {isAdmin && (
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-primary" />
                                    Acciones Rápidas
                                </CardTitle>
                                <CardDescription>Crear nuevo contenido</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-2">
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href="/admin/worlds/create">
                                        <Globe className="mr-2 h-4 w-4" />
                                        Nuevo Mundo
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href="/admin/stories/create">
                                        <BookText className="mr-2 h-4 w-4" />
                                        Nueva Historia
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href="/admin/characters/create">
                                        <Users className="mr-2 h-4 w-4" />
                                        Nuevo Personaje
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start" asChild>
                                    <Link href="/admin/cards/create">
                                        <Swords className="mr-2 h-4 w-4" />
                                        Nueva Carta
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Rarity Distribution */}
                    {totalCards > 0 && (
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-500" />
                                    Distribución de Rarezas
                                </CardTitle>
                                <CardDescription>{totalCards} cartas totales</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(currentStats.cards_by_rarity).map(([rarity, count]) => {
                                    const percentage = Math.round((count / totalCards) * 100);
                                    return (
                                        <div key={rarity} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <Badge variant="outline" className={rarityColors[rarity] || ''}>
                                                    {rarity}
                                                </Badge>
                                                <span className="text-muted-foreground">
                                                    {count} ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Recent Cards */}
                {currentStats.recent_cards.length > 0 && (
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                Cartas Recientes
                            </CardTitle>
                            <CardDescription>Últimas cartas creadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {currentStats.recent_cards.map((card) => (
                                    <Link
                                        key={card.id}
                                        href={`/admin/cards/${card.id}/edit`}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/5 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                                <Swords className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{card.name}</p>
                                                <p className="text-sm text-muted-foreground">{card.world.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={rarityColors[card.rarity?.name] || ''}>
                                                {card.rarity?.name || 'Sin rareza'}
                                            </Badge>
                                            <Badge variant="secondary">Coste: {card.cost}</Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!hasContent && (
                    <Card className="border-dashed border-2 border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-primary/10 p-6 mb-4">
                                <Sparkles className="h-12 w-12 text-primary animate-magical-glow" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">¡Comienza tu Aventura!</h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Crea tu primer mundo mágico o diseña cartas épicas para comenzar a construir tu universo TCG
                            </p>
                            {isAdmin && (
                                <div className="flex gap-3">
                                    <Button asChild size="lg">
                                        <Link href="/admin/worlds/create">
                                            <Globe className="mr-2 h-5 w-5" />
                                            Crear Mundo
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild size="lg">
                                        <Link href="/admin/cards/create">
                                            <Swords className="mr-2 h-5 w-5" />
                                            Crear Carta
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
