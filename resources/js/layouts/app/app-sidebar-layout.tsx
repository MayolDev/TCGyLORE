import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { StarField } from '@/components/ui/star-field';
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
        const runes = [
            'ᚠ',
            'ᚢ',
            'ᚦ',
            'ᚨ',
            'ᚱ',
            'ᚲ',
            'ᚷ',
            'ᚹ',
            'ᚺ',
            'ᚾ',
            'ᛁ',
            'ᛃ',
            '✦',
            '✧',
            '⚝',
            '⚡',
            '❋',
            '✵',
        ];
        const colors = [
            '#FFD700',
            '#FF6B35',
            '#8B5CF6',
            '#F97316',
            '#EC4899',
            '#FBBF24',
        ];

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
            const type =
                Math.random() > 0.7
                    ? 'rune'
                    : Math.random() > 0.5
                      ? 'spark'
                      : 'trail';
            magicElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                type,
                symbol:
                    type === 'rune'
                        ? runes[Math.floor(Math.random() * runes.length)]
                        : undefined,
                size:
                    type === 'rune'
                        ? Math.random() * 20 + 15
                        : Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.6 + 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                life: Math.random() * 100 + 100,
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
                    ctx.arc(
                        element.x - element.speedX * 10,
                        element.y - element.speedY * 10,
                        element.size * 0.5,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                } else {
                    // Trazos de energía
                    ctx.strokeStyle = element.color;
                    ctx.lineWidth = element.size;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = element.color;
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(
                        element.x + element.speedX * 20,
                        element.y + element.speedY * 20,
                    );
                    ctx.stroke();
                }

                ctx.restore();

                // Movimiento
                element.x += element.speedX;
                element.y += element.speedY;
                element.life--;

                // Reposicionar si sale del canvas o termina su vida
                if (
                    element.life <= 0 ||
                    element.x < -50 ||
                    element.x > canvas.width + 50 ||
                    element.y < -50 ||
                    element.y > canvas.height + 50
                ) {
                    element.x = Math.random() * canvas.width;
                    element.y = Math.random() * canvas.height;
                    element.life = Math.random() * 100 + 100;
                    element.opacity = Math.random() * 0.6 + 0.3;
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

            {/* Canvas de partículas de fondo MUY VISIBLE */}
            <canvas
                ref={canvasRef}
                className="pointer-events-none fixed inset-0 z-0"
                style={{ opacity: 1 }}
            />

            {/* Efectos de luz ambiente INTENSOS */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="animate-pulse-slow absolute top-20 left-20 h-[600px] w-[600px] rounded-full bg-purple-500 opacity-30 mix-blend-screen blur-3xl filter"></div>
                <div className="animate-pulse-slow animation-delay-2000 absolute right-20 bottom-20 h-[600px] w-[600px] rounded-full bg-orange-500 opacity-30 mix-blend-screen blur-3xl filter"></div>
                <div className="animate-pulse-slow animation-delay-1000 absolute top-1/2 left-1/2 h-[500px] w-[500px] rounded-full bg-yellow-400 opacity-25 mix-blend-screen blur-3xl filter"></div>

                {/* Rayos de luz */}
                <div className="animate-shimmer absolute top-0 left-1/4 h-full w-2 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent"></div>
                <div className="animate-shimmer animation-delay-2000 absolute top-0 left-3/4 h-full w-2 bg-gradient-to-b from-transparent via-orange-400/20 to-transparent"></div>

                {/* Estrellas brillantes */}
                <StarField count={30} className="h-2 w-2 bg-yellow-300" />
            </div>

            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent
                    variant="sidebar"
                    className="relative z-10 overflow-x-hidden"
                >
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
