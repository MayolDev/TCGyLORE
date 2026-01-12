import { home } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Shield, Sparkles, Swords } from 'lucide-react';
import { StarField } from '@/components/star-field';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=almendra:700|cinzel:700,900|trade-winds:400"
                    rel="stylesheet"
                />
            </Head>

            {/* Background épico que reemplaza el canvas y efectos manuales */}
            <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 md:p-10 overflow-hidden">

                {/* Usamos StarField para las partículas y efectos de fondo */}
                <StarField />

                {/* Elementos extra específicos del layout Auth (si se quiere mantener algo extra) */}
                {/* En este caso StarField ya cubre la mayoría, pero mantenemos el contenedor y el z-index correcto */}

                {/* Contenedor del formulario */}
                <div className="relative z-10 w-full max-w-md">
                    <div className="relative">
                        {/* Glow effect detrás de la card - mejorado */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 via-orange-600/30 to-red-600/30 blur-3xl animate-pulse-slow"></div>
                        
                        {/* Anillos orbitales */}
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20 animate-spin-slow"></div>
                            <div className="absolute inset-4 rounded-full border-2 border-orange-500/20 animate-spin-reverse"></div>
                            <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-spin-slow"></div>
                        </div>
                        
                        {/* Card principal */}
                        <div className="relative flex flex-col gap-8 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90 border-2 border-yellow-900/30 backdrop-blur-xl shadow-2xl overflow-hidden">
                            {/* Brillo superior animado */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-shimmer"></div>
                            
                            {/* Decoraciones de esquinas con más animación */}
                            <div className="absolute top-4 right-4 animate-float">
                                <Sparkles className="w-6 h-6 text-yellow-400/40 animate-pulse" />
                            </div>
                            <div className="absolute bottom-4 left-4 animate-float animation-delay-500">
                                <Swords className="w-6 h-6 text-orange-400/40 animate-pulse animation-delay-500" />
                            </div>
                            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 animate-float animation-delay-1000">
                                <Shield className="w-5 h-5 text-purple-400/30 animate-pulse animation-delay-1000" />
                            </div>

                            {/* Logo y Título */}
                            <div className="flex flex-col items-center gap-6">
                                <Link
                                    href={home()}
                                    className="group flex flex-col items-center gap-3 font-medium"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 shadow-2xl shadow-orange-500/50 border-2 border-yellow-400/50 group-hover:scale-110 transition-transform">
                                            <Shield className="h-9 w-9 text-yellow-100 drop-shadow-lg" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" style={{ fontFamily: 'Cinzel, serif' }}>
                                            TAPON'AZO
                                        </h1>
                                        <p className="text-sm text-yellow-400/90 font-bold tracking-[0.3em] mt-2 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" style={{ fontFamily: 'Trade Winds, cursive' }}>
                                            LEGENDS FORGE
                                        </p>
                                    </div>
                                    <span className="sr-only">{title}</span>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h2 className="text-2xl font-bold text-yellow-100" style={{ fontFamily: 'Cinzel, serif' }}>
                                        {title}
                                    </h2>
                                    <p className="text-center text-sm text-yellow-200/70 font-medium">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            {/* Contenido (formulario) */}
                            <div className="relative">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="relative z-10 text-xs text-yellow-400/50 text-center font-semibold">
                    © 2025 Tapon'Azo · Forged with Epic Magic
                </p>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.05); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                @keyframes shimmer {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-shimmer {
                    animation: shimmer 3s ease-in-out infinite;
                }

                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }

                .animate-spin-reverse {
                    animation: spin-reverse 15s linear infinite;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }

                .animation-delay-1000 {
                    animation-delay: 1s;
                }

                .animation-delay-1500 {
                    animation-delay: 1.5s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
}
