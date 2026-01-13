import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type PropsWithChildren, useEffect, useRef } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Runas mágicas flotantes
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
        for (let i = 0; i < 50; i++) {
            const type = Math.random() > 0.7 ? 'rune' : Math.random() > 0.5 ? 'spark' : 'trail';
            magicElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                type,
                symbol: type === 'rune' ? runes[Math.floor(Math.random() * runes.length)] : undefined,
                size: type === 'rune' ? Math.random() * 20 + 15 : Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.6 + 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                life: Math.random() * 100 + 100
            });
        }

        let animationId: number;

        function animate() {
            if (!ctx || !canvas) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            magicElements.forEach((element, index) => {
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
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = element.color;
                    ctx.fillText(element.symbol!, 0, 0);
                    element.rotation += element.rotationSpeed;
                } else if (element.type === 'spark') {
                    // Chispas brillantes con estela
                    ctx.fillStyle = element.color;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = element.color;
                    ctx.beginPath();
                    ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Estela
                    ctx.globalAlpha = element.opacity * 0.3;
                    ctx.beginPath();
                    ctx.arc(element.x - element.speedX * 10, element.y - element.speedY * 10, element.size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Trazos de energía
                    ctx.strokeStyle = element.color;
                    ctx.lineWidth = element.size;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = element.color;
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(element.x + element.speedX * 20, element.y + element.speedY * 20);
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
                    element.opacity = Math.random() * 0.6 + 0.3;
                }
            });

            animationId = requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        }
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

            {/* Canvas de partículas de fondo MUY VISIBLE */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ opacity: 1 }}
            />

            {/* Efectos de luz ambiente INTENSOS */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse-slow animation-delay-1000"></div>
                
                {/* Rayos de luz */}
                <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent animate-shimmer"></div>
                <div className="absolute top-0 left-3/4 w-2 h-full bg-gradient-to-b from-transparent via-orange-400/20 to-transparent animate-shimmer animation-delay-2000"></div>
                
                {/* Estrellas brillantes */}
                {[...Array(30)].map((_, i) => {
                    const style = {
                        left: `${(i * 13 + 7) % 100}%`,
                        top: `${(i * 29 + 19) % 100}%`,
                        animationDelay: `${(i % 5) * 0.5}s`,
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)'
                    };
                    return (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-twinkle"
                            style={style}
                        />
                    );
                })}
            </div>

            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden relative z-10">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.25; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.1); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.8); }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                
                .animate-shimmer {
                    animation: shimmer 4s ease-in-out infinite;
                }
                
                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
}
