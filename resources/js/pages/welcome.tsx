import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Sparkles, BookOpen, Map, Swords, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenido al Universo de Aethermoor" />
            
            <div className="relative min-h-screen bg-background overflow-hidden">
                {/* Vignette effect */}
                <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10" />
                
                {/* Header con navegación */}
                <header className="relative z-20 border-b border-border/40 bg-card/80 backdrop-blur-sm">
                    <div className="container mx-auto px-6 py-4">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-8 w-8 text-primary animate-magical-glow" />
                                <h1 className="text-2xl font-heading font-bold text-primary">
                                    Aethermoor
                                </h1>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Button asChild variant="default" size="lg">
                                        <Link href={dashboard()}>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Ir al Panel
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="ghost" size="lg">
                                            <Link href={login()}>
                                                Iniciar Sesión
                                            </Link>
                                        </Button>
                                        {canRegister && (
                                            <Button asChild variant="default" size="lg">
                                                <Link href={register()}>
                                                    Registrarse
                                                </Link>
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="relative z-10">
                    <div className="container mx-auto px-6 py-20">
                        {/* Hero principal */}
                        <div className="text-center mb-20 animate-fade-in">
                            <div className="inline-block mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-glow" />
                                    <Swords className="relative h-24 w-24 text-primary mx-auto animate-float" />
                                </div>
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer">
                                Bienvenido a Aethermoor
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                                Un universo de fantasía medieval donde la magia, las leyendas y las batallas épicas 
                                se entrelazan en un juego de cartas coleccionables con elementos de rol.
                            </p>
                            
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button asChild size="lg" variant="default" className="text-lg px-8 py-6">
                                        <Link href={register()}>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Comenzar Aventura
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                                        <Link href={login()}>
                                            Iniciar Sesión
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                            {[
                                {
                                    icon: BookOpen,
                                    title: 'Historias Épicas',
                                    description: 'Descubre relatos profundos que dan vida a un mundo de fantasía medieval lleno de misterios y aventuras.',
                                    gradient: 'from-purple-500/20 to-pink-500/20',
                                    iconColor: 'text-purple-400',
                                },
                                {
                                    icon: Users,
                                    title: 'Personajes Legendarios',
                                    description: 'Conoce héroes y villanos con biografías detalladas, hechizos únicos y habilidades extraordinarias.',
                                    gradient: 'from-emerald-500/20 to-teal-500/20',
                                    iconColor: 'text-emerald-400',
                                },
                                {
                                    icon: Map,
                                    title: 'Mundos Inmersivos',
                                    description: 'Explora reinos vastos con ubicaciones místicas, cada una con su propia historia y secretos por descubrir.',
                                    gradient: 'from-blue-500/20 to-cyan-500/20',
                                    iconColor: 'text-blue-400',
                                },
                                {
                                    icon: Swords,
                                    title: 'Cartas TCG',
                                    description: 'Colecciona cartas únicas con efectos especiales, atributos personalizados y rarezas legendarias.',
                                    gradient: 'from-amber-500/20 to-orange-500/20',
                                    iconColor: 'text-amber-400',
                                },
                                {
                                    icon: Clock,
                                    title: 'Línea Temporal',
                                    description: 'Sigue la historia del mundo a través de eventos cruciales, guerras épicas y momentos que marcaron eras.',
                                    gradient: 'from-rose-500/20 to-red-500/20',
                                    iconColor: 'text-rose-400',
                                },
                                {
                                    icon: Sparkles,
                                    title: 'Sistema de Lore',
                                    description: 'Todo está interconectado: personajes, ubicaciones, eventos y cartas forman un universo cohesivo.',
                                    gradient: 'from-indigo-500/20 to-violet-500/20',
                                    iconColor: 'text-indigo-400',
                                },
                            ].map((feature, index) => (
                                <Card 
                                    key={index}
                                    className="card-tcg group hover:scale-105 transition-transform duration-300"
                                >
                                    <CardContent className="p-6">
                                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                                        </div>
                                        <h3 className="text-xl font-heading font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* CTA Final */}
                        {!auth.user && (
                            <div className="text-center">
                                <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 max-w-2xl mx-auto">
                                    <CardContent className="p-12">
                                        <Sparkles className="h-16 w-16 text-primary mx-auto mb-6 animate-magical-glow" />
                                        <h2 className="text-3xl font-heading font-bold mb-4">
                                            ¿Listo para la Aventura?
                                        </h2>
                                        <p className="text-lg text-muted-foreground mb-8">
                                            Únete ahora y comienza a explorar el vasto universo de Aethermoor. 
                                            Cada carta cuenta una historia, cada personaje tiene un destino.
                                        </p>
                                        <Button asChild size="lg" className="text-lg px-12 py-6">
                                            <Link href={register()}>
                                                <Sparkles className="mr-2 h-5 w-5" />
                                                Crear Cuenta Gratis
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {auth.user && (
                            <div className="text-center">
                                <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 max-w-2xl mx-auto">
                                    <CardContent className="p-12">
                                        <Sparkles className="h-16 w-16 text-primary mx-auto mb-6 animate-magical-glow" />
                                        <h2 className="text-3xl font-heading font-bold mb-4">
                                            ¡Bienvenido de vuelta, {auth.user.name}!
                                        </h2>
                                        <p className="text-lg text-muted-foreground mb-8">
                                            Tu aventura en Aethermoor continúa. Explora nuevas cartas, 
                                            historias y personajes que te esperan.
                                        </p>
                                        <Button asChild size="lg" className="text-lg px-12 py-6">
                                            <Link href={dashboard()}>
                                                <Swords className="mr-2 h-5 w-5" />
                                                Ir al Panel de Control
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-border/40 bg-card/80 backdrop-blur-sm mt-20">
                    <div className="container mx-auto px-6 py-8">
                        <div className="text-center text-sm text-muted-foreground">
                            <p className="mb-2">
                                © 2025 Aethermoor TCG. Un universo de fantasía medieval.
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                Desarrollado con <Sparkles className="h-4 w-4 text-primary animate-magical-glow" /> y Laravel 12 + React 19
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
