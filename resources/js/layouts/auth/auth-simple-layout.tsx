/* eslint-disable react-hooks/purity */
import AppLogoIcon from '@/components/app-logo-icon';
import { Head, Link } from '@inertiajs/react';
import { type PropsWithChildren, useEffect, useMemo, useRef } from 'react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<{ title?: string; description?: string }>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Precompute random stars to avoid re-renders triggering impure Math.random calls
    const stars = useMemo(() => {
        return Array.from({ length: 20 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.7 + 0.3,
        }));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Partículas místicas
        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            alpha: number;
        }> = [];

        const colors = [
            '#F59E0B',
            '#D97706',
            '#B45309',
            '#FCD34D',
            '#7C3AED',
            '#6D28D9',
        ]; // Yellows, Oranges and Purples

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.1,
            });
        }

        function animate() {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                ctx.globalAlpha = particle.alpha;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
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
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative overflow-hidden">
            <Head title={title} />

            {/* Canvas de fondo */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 pointer-events-none opacity-40"
            />

            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 opacity-90"></div>
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>

                {/* Estrellas parpadeantes */}
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-twinkle"
                        style={star}
                    />
                ))}
            </div>

            <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
                <Link
                    href="/"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-primary-foreground shadow-lg shadow-orange-500/30 transform hover:scale-110 transition-transform duration-300">
                        <AppLogoIcon className="size-8" />
                    </div>
                    <div className="flex flex-col">
                        <span
                            className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 drop-shadow-sm"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            TAPON'AZO
                        </span>
                        <span
                            className="text-[0.6rem] font-bold tracking-[0.3em] text-yellow-500/80 uppercase"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            Legends Forge
                        </span>
                    </div>
                </Link>
                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border-2 border-orange-500/20 bg-slate-900/80 shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] backdrop-blur-md p-1">
                        <div className="rounded-lg bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-6 md:p-8">
                            <div className="mb-6 flex flex-col gap-2 text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    {title}
                                </h1>
                                <p className="text-sm text-slate-400">
                                    {description}
                                </p>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                
                .animate-twinkle {
                    animation: twinkle 3s ease-in-out infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
