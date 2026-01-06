import { StarField } from '@/components/star-field';
import { home } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { type PropsWithChildren, useEffect, useRef } from 'react';
import { Shield, Sparkles, Swords } from 'lucide-react';

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
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Símbolos mágicos y runas
        const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', '✦', '✧', '⚝', '⚡', '❋', '✵'];
        const colors = ['#FFD700', '#FF6B35', '#8B5CF6', '#F97316', '#EC4899', '#FBBF24'];

        const magicElements: Array<{
            x: number;
            y: number;
            type: 'rune' | 'spark' | 'trail';
            symbol?: string;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            color: string;
            rotation: number;
            rotationSpeed: number;
            life: number;
        }> = [];

        // Crear elementos mágicos
        for (let i = 0; i < 40; i++) {
            const type = Math.random() > 0.65 ? 'rune' : Math.random() > 0.5 ? 'spark' : 'trail';
            magicElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                type,
                symbol: type === 'rune' ? runes[Math.floor(Math.random() * runes.length)] : undefined,
                size: type === 'rune' ? Math.random() * 18 + 12 : Math.random() * 2.5 + 1.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.25,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.015,
                life: Math.random() * 100 + 100
            });
        }

        function animate() {
            if (!ctx || !canvas) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            magicElements.forEach((element) => {
                ctx.save();
                ctx.globalAlpha = element.opacity;

                if (element.type === 'rune') {
                    // Runas flotantes con rotación
                    ctx.translate(element.x, element.y);
                    ctx.rotate(element.rotation);
                    ctx.font = `${element.size}px serif`;
                    ctx.fillStyle = element.color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = element.color;
                    ctx.fillText(element.symbol!, 0, 0);
                    element.rotation += element.rotationSpeed;
                } else if (element.type === 'spark') {
                    // Chispas brillantes con estela
                    ctx.fillStyle = element.color;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = element.color;
                    ctx.beginPath();
                    ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Estela
                    ctx.globalAlpha = element.opacity * 0.3;
                    ctx.beginPath();
                    ctx.arc(element.x - element.speedX * 8, element.y - element.speedY * 8, element.size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Trazos de energía
                    ctx.strokeStyle = element.color;
                    ctx.lineWidth = element.size;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = element.color;
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(element.x + element.speedX * 15, element.y + element.speedY * 15);
                    ctx.stroke();
                }

                ctx.restore();

                // Movimiento
                element.x += element.speedX;
                element.y += element.speedY;
                element.life--;

                // Reposicionar si sale del canvas o termina su vida
                if (element.life <= 0 || element.x < -50 || element.x > canvas.width + 50 || element.y < -50 || element.y > canvas.height + 50) {
                    element.x = Math.random() * canvas.width;
                    element.y = Math.random() * canvas.height;
                    element.life = Math.random() * 100 + 100;
                    element.opacity = Math.random() * 0.5 + 0.25;
                }
            });

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
            <Head>
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

            {/* Background épico */}
            <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 md:p-10 overflow-hidden">
                {/* Efectos de luz múltiples */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse-slow animation-delay-1000"></div>
                    <div className="absolute top-10 right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float animation-delay-1500"></div>
                </div>

                {/* Rayos de luz animados */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent animate-shimmer"></div>
                    <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-transparent via-orange-400/30 to-transparent animate-shimmer animation-delay-2000"></div>
                    <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent animate-shimmer animation-delay-1000"></div>
                </div>

                {/* Estrellas parpadeantes */}
                <div className="absolute inset-0">
                    <StarField count={20} small />
                </div>

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
