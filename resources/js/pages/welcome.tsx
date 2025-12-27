import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Sparkles, Swords, BookText, Users, Globe, Shield, Zap, Crown, Flame } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            color: string;
        }> = [];

        const colors = ['#FFD700', '#FF6B35', '#8B5CF6', '#EC4899', '#F97316'];

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function animate() {
            if (!ctx || !canvas) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Head title="Tapon'Azo - El Universo Legendario">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=almendra:700|cinzel:700,900|trade-winds:400"
                    rel="stylesheet"
                />
            </Head>
            
            {/* Canvas de partículas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
            />

            {/* Background épico con múltiples capas */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-red-950">
                {/* Capa de textura */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02ek0yNCA0MGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                
                {/* Efectos de luz dramáticos */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
                </div>

                {/* Rayos de luz */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-yellow-400/80 via-yellow-400/20 to-transparent transform -rotate-12 animate-shimmer"></div>
                    <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-purple-400/80 via-purple-400/20 to-transparent transform rotate-12 animate-shimmer animation-delay-2000"></div>
                </div>

                {/* Header Épico */}
                <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-4 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 shadow-2xl shadow-orange-500/50 border-2 border-yellow-400/50 group-hover:scale-110 transition-transform">
                                    <Shield className="h-8 w-8 text-yellow-100 drop-shadow-lg" />
                                    <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-spin-slow" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>
                                    TAPON'AZO
                                </h1>
                                <p className="text-xs text-yellow-400/80 font-semibold tracking-widest" style={{ fontFamily: 'Trade Winds, cursive' }}>
                                    LEGENDS FORGE
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white font-black text-lg hover:from-yellow-500 hover:to-red-500 transition-all shadow-2xl shadow-orange-500/50 hover:shadow-orange-400/70 transform hover:scale-105 border-2 border-yellow-400/30 hover:border-yellow-300/50"
                                    style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Crown className="w-5 h-5" />
                                        ENTRAR AL REINO
                                    </span>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white hover:from-yellow-500 hover:to-red-500 transition-all border-2 border-yellow-400/30 backdrop-blur-sm font-bold shadow-lg shadow-orange-500/30" style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                    INICIAR SESIÓN
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section ÉPICO */}
                <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-32 text-center">
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Badge Épico */}
                        <div className="inline-block animate-float">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/50 to-red-600/50 rounded-full blur-xl"></div>
                                <div className="relative px-6 py-3 rounded-full bg-gradient-to-r from-yellow-900/80 to-red-900/80 border-2 border-yellow-500/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <Flame className="w-5 h-5 text-yellow-400 animate-pulse" />
                                        <span className="text-yellow-200 font-black text-sm tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                                            TCG SYSTEM · UNIVERSE BUILDER · LEGENDARY FORGE
                                        </span>
                                        <Zap className="w-5 h-5 text-orange-400 animate-pulse animation-delay-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Título Principal */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 blur-3xl transform scale-150"></div>
                            <h1 className="relative text-7xl md:text-9xl font-black leading-none" style={{ fontFamily: 'Cinzel, serif' }}>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] animate-shine">
                                    TAPON'AZO
                                </span>
                                <span className="block text-5xl md:text-7xl mt-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-red-400 to-orange-300 drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]">
                                    LEGENDS FORGE
                                </span>
                            </h1>
                        </div>

                        {/* Subtítulo Épico */}
                        <p className="text-2xl md:text-3xl text-yellow-100/90 max-w-4xl mx-auto leading-relaxed font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Almendra, serif' }}>
                            Forja Tu Destino. Construye Tu Imperio.
                            <br />
                            <span className="text-orange-300">El Poder de Crear Mundos Legendarios Está en Tus Manos.</span>
                        </p>

                        {/* CTA Principal */}
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                            <Link
                                href={auth.user ? dashboard() : login()}
                                className="group relative px-12 py-5 rounded-2xl bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white font-black text-2xl hover:from-yellow-500 hover:to-red-500 transition-all shadow-2xl shadow-orange-500/60 hover:shadow-orange-400/80 transform hover:scale-110 border-4 border-yellow-400/40 hover:border-yellow-300/60"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <Swords className="w-8 h-8" />
                                    {auth.user ? 'ENTRAR AL REINO' : 'COMENZAR LA LEYENDA'}
                                    <Crown className="w-8 h-8" />
                                </span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/0 via-white/30 to-yellow-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </Link>
                        </div>

                        {/* Frase Motivadora */}
                        <div className="pt-8">
                            <p className="text-xl text-yellow-300/80 font-bold italic" style={{ fontFamily: 'Almendra, serif' }}>
                                "Cada carta cuenta una historia. Cada héroe forja su destino."
                            </p>
                        </div>
                    </div>

                    {/* Features Grid ÉPICO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mt-32">
                        <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/60 via-purple-950/60 to-black/60 border-2 border-purple-500/40 backdrop-blur-md hover:border-purple-400/70 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-purple-500/50 border-2 border-purple-400/30">
                                    <Swords className="w-9 h-9 text-purple-100" />
                                </div>
                                <h3 className="text-2xl font-black text-yellow-100 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CARTAS TCG
                                </h3>
                                <p className="text-purple-200/80 font-medium leading-relaxed">
                                    Diseña cartas legendarias con estadísticas épicas, habilidades devastadoras y rareza única.
                                </p>
                            </div>
                        </div>

                        <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-900/60 via-blue-950/60 to-black/60 border-2 border-blue-500/40 backdrop-blur-md hover:border-blue-400/70 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-blue-500/50 border-2 border-blue-400/30">
                                    <Globe className="w-9 h-9 text-blue-100" />
                                </div>
                                <h3 className="text-2xl font-black text-yellow-100 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                                    MUNDOS ÉPICOS
                                </h3>
                                <p className="text-blue-200/80 font-medium leading-relaxed">
                                    Construye reinos completos con geografía mística, historia ancestral y culturas legendarias.
                                </p>
                            </div>
                        </div>

                        <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-red-900/60 via-red-950/60 to-black/60 border-2 border-red-500/40 backdrop-blur-md hover:border-red-400/70 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-red-500/50 border-2 border-red-400/30">
                                    <Users className="w-9 h-9 text-red-100" />
                                </div>
                                <h3 className="text-2xl font-black text-yellow-100 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                                    HÉROES & VILLANOS
                                </h3>
                                <p className="text-red-200/80 font-medium leading-relaxed">
                                    Crea personajes legendarios con historias épicas, poderes antiguos y destinos entrelazados.
                                </p>
                            </div>
                        </div>

                        <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-yellow-900/60 via-orange-950/60 to-black/60 border-2 border-yellow-500/40 backdrop-blur-md hover:border-yellow-400/70 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-yellow-500/50 border-2 border-yellow-400/30">
                                    <BookText className="w-9 h-9 text-yellow-100" />
                                </div>
                                <h3 className="text-2xl font-black text-yellow-100 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                                    CRÓNICAS DEL DESTINO
                                </h3>
                                <p className="text-yellow-200/80 font-medium leading-relaxed">
                                    Organiza tu saga con historias épicas, eventos cataclísmicos y líneas temporales legendarias.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action Final ÉPICO */}
                    <div className="relative max-w-5xl mx-auto mt-32">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 via-orange-600/30 to-red-600/30 blur-3xl animate-pulse-slow"></div>
                        <div className="relative p-16 rounded-3xl bg-gradient-to-br from-yellow-900/40 via-orange-900/40 to-red-900/40 border-4 border-yellow-500/40 backdrop-blur-md shadow-2xl">
                            <div className="absolute top-4 right-4">
                                <Crown className="w-12 h-12 text-yellow-400/50 animate-pulse" />
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <Sparkles className="w-12 h-12 text-orange-400/50 animate-spin-slow" />
                            </div>
                            
                            <h2 className="text-5xl font-black text-yellow-100 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                                ¿LISTO PARA FORJAR TU LEYENDA?
                            </h2>
                            <p className="text-2xl text-yellow-200/90 mb-10 font-bold" style={{ fontFamily: 'Almendra, serif' }}>
                                El poder de crear mundos legendarios te espera.
                                <br />
                                <span className="text-orange-300">Tu imperio comienza aquí.</span>
                            </p>
                            <Link
                                href={auth.user ? dashboard() : login()}
                                className="inline-flex items-center gap-4 px-12 py-5 rounded-2xl bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white font-black text-2xl hover:from-yellow-500 hover:to-red-500 transition-all shadow-2xl shadow-orange-500/60 hover:shadow-orange-400/80 transform hover:scale-110 border-4 border-yellow-400/40"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                <Shield className="w-8 h-8" />
                                {auth.user ? 'ENTRAR AL REINO' : 'FORJAR MI DESTINO'}
                                <Flame className="w-8 h-8" />
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t-2 border-yellow-900/30 backdrop-blur-sm bg-black/20">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-yellow-400/70 font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                                © 2025 Tapon'Azo · Legends Forge
                            </p>
                            <div className="flex items-center gap-3 text-yellow-400/70 font-bold">
                                <Crown className="w-5 h-5" />
                                <span style={{ fontFamily: 'Almendra, serif' }}>Forjado con pasión épica</span>
                                <Flame className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                
                @keyframes shimmer {
                    0% { transform: translateY(-100%) rotate(-12deg); }
                    100% { transform: translateY(100vh) rotate(-12deg); }
                }
                
                @keyframes shine {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                
                .animate-shimmer {
                    animation: shimmer 8s linear infinite;
                }
                
                .animate-shine {
                    background-size: 200% 200%;
                    animation: shine 3s ease infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
