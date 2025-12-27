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

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles?: Role[];
}

interface AuthProps {
    user?: User;
}

interface PageProps {
    auth?: AuthProps;
}

export default function Dashboard({ stats }: DashboardProps) {
    const page = usePage<PageProps>();
    const auth = page.props.auth || {};
    const user = auth.user;
    const isAdmin = user?.roles?.some((role: Role) => role.name === 'Admin') || false;

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
            color: 'from-purple-400 to-purple-600',
            bgGlow: 'bg-purple-500/20',
            iconColor: 'text-purple-300',
            borderColor: 'border-purple-500/30'
        },
        {
            name: 'Historias',
            icon: BookText,
            count: currentStats.stories,
            href: '/admin/stories',
            color: 'from-blue-400 to-cyan-500',
            bgGlow: 'bg-blue-500/20',
            iconColor: 'text-blue-300',
            borderColor: 'border-blue-500/30'
        },
        {
            name: 'Personajes',
            icon: Users,
            count: currentStats.characters,
            href: '/admin/characters',
            color: 'from-red-400 to-pink-500',
            bgGlow: 'bg-red-500/20',
            iconColor: 'text-red-300',
            borderColor: 'border-red-500/30'
        },
        {
            name: 'Ubicaciones',
            icon: MapPin,
            count: currentStats.locations,
            href: '/admin/locations',
            color: 'from-emerald-400 to-green-500',
            bgGlow: 'bg-emerald-500/20',
            iconColor: 'text-emerald-300',
            borderColor: 'border-emerald-500/30'
        },
        {
            name: 'Línea de Tiempo',
            icon: Clock,
            count: currentStats.timeline_events,
            href: '/admin/timeline-events',
            color: 'from-indigo-400 to-violet-500',
            bgGlow: 'bg-indigo-500/20',
            iconColor: 'text-indigo-300',
            borderColor: 'border-indigo-500/30'
        },
        {
            name: 'Cartas TCG',
            icon: Swords,
            count: currentStats.cards,
            href: '/admin/cards',
            color: 'from-yellow-400 to-orange-500',
            bgGlow: 'bg-yellow-500/20',
            iconColor: 'text-yellow-300',
            borderColor: 'border-yellow-500/30'
        },
    ];

    if (isAdmin) {
        modules.push({
            name: 'Usuarios',
            icon: UserCircle,
            count: currentStats.users,
            href: '/admin/users',
            color: 'from-slate-400 to-gray-500',
            bgGlow: 'bg-slate-500/20',
            iconColor: 'text-slate-300',
            borderColor: 'border-slate-500/30'
        });
    }

    const rarityColors: Record<string, string> = {
        'Común': 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
        'común': 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
        'Rara': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
        'rara': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
        'Épica': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
        'épica': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
        'Legendaria': 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
        'legendaria': 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    };

    const totalCards = Object.values(currentStats.cards_by_rarity).reduce((a, b) => a + b, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-8 p-6">
                {/* Hero Section ÉPICO CON MÁS BRILLO */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-900/60 via-orange-900/50 to-red-900/60 p-10 backdrop-blur-sm border-4 border-yellow-500/50 shadow-[0_0_50px_rgba(251,191,36,0.5)]">
                    <div className="absolute inset-0 bg-grid-white/10" />
                    {/* Efectos de luz INTENSOS */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse-slow animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow animation-delay-1000"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <Sparkles className="h-12 w-12 text-yellow-300 animate-magical-glow drop-shadow-[0_0_20px_rgba(251,191,36,1)]" />
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-400 drop-shadow-[0_4px_20px_rgba(251,191,36,0.8)] animate-pulse" style={{ fontFamily: 'Cinzel, serif' }}>
                                TAPON'AZO
                            </h1>
                        </div>
                        <p className="text-2xl text-yellow-50 font-bold max-w-3xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Almendra, serif' }}>
                            ⚔️ Forja mundos legendarios, crea historias épicas y diseña cartas inmortales
                        </p>
                        <p className="text-base text-yellow-300 font-bold mt-3 tracking-[0.3em] drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]" style={{ fontFamily: 'Trade Winds, cursive' }}>
                            LEGENDS FORGE
                        </p>
                    </div>
                </div>

                {/* Stats Grid - Tarjetas estilo TCG SÚPER ÉPICAS */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <Link key={module.name} href={module.href}>
                                <Card className={`group cursor-pointer overflow-hidden ${module.borderColor} border-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] transition-all duration-300 hover:scale-110 hover:-rotate-2 relative`}>
                                    {/* Brillo interior */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                        <CardTitle className="text-base font-black text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Cinzel, serif' }}>
                                            {module.name}
                                        </CardTitle>
                                        <div className={`p-3 rounded-lg ${module.bgGlow} group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                            <Icon className={`h-6 w-6 ${module.iconColor} drop-shadow-[0_0_10px_currentColor] group-hover:drop-shadow-[0_0_20px_currentColor]`} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <div className={`text-4xl font-black mb-1 bg-gradient-to-br ${module.color} bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
                                            {module.count}
                                        </div>
                                        <p className="text-xs text-yellow-200/70 flex items-center gap-1 font-bold">
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
                        <Card className="border-yellow-600/30 bg-gradient-to-br from-slate-900/80 to-purple-900/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-100" style={{ fontFamily: 'Cinzel, serif' }}>
                                    <Plus className="h-5 w-5 text-yellow-400" />
                                    Acciones Rápidas
                                </CardTitle>
                                <CardDescription className="text-yellow-200/70">Crear nuevo contenido legendario</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-2">
                                <Button variant="outline" className="justify-start border-yellow-600/30 hover:bg-yellow-600/10 hover:text-yellow-100" asChild>
                                    <Link href="/admin/worlds/create">
                                        <Globe className="mr-2 h-4 w-4" />
                                        Nuevo Mundo
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start border-yellow-600/30 hover:bg-yellow-600/10 hover:text-yellow-100" asChild>
                                    <Link href="/admin/stories/create">
                                        <BookText className="mr-2 h-4 w-4" />
                                        Nueva Historia
                                    </Link>
                                </Button>
                                <Button variant="outline" className="justify-start border-yellow-600/30 hover:bg-yellow-600/10 hover:text-yellow-100" asChild>
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
                        <Card className="border-purple-500/30 border-2 bg-gradient-to-br from-slate-900/90 to-purple-950/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-100" style={{ fontFamily: 'Cinzel, serif' }}>
                                    <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                                    Distribución de Rarezas
                                </CardTitle>
                                <CardDescription className="text-yellow-200/70">{totalCards} cartas legendarias forjadas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(currentStats.cards_by_rarity).map(([rarity, count]) => {
                                    const percentage = Math.round((count / totalCards) * 100);
                                    return (
                                        <div key={rarity} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <Badge variant="outline" className={rarityColors[rarity] || 'border-gray-500/30 bg-gray-500/20 text-gray-300'}>
                                                    {rarity}
                                                </Badge>
                                                <span className="text-yellow-200/60 font-semibold">
                                                    {count} ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-yellow-900/30">
                                                <div
                                                    className="h-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 transition-all duration-500 shadow-lg shadow-orange-500/50"
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
                    <Card className="border-orange-500/30 border-2 bg-gradient-to-br from-slate-900/90 to-orange-950/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-100" style={{ fontFamily: 'Cinzel, serif' }}>
                                <Eye className="h-5 w-5 text-orange-400" />
                                Cartas Recientes
                            </CardTitle>
                            <CardDescription className="text-yellow-200/70">Últimas leyendas forjadas</CardDescription>
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
