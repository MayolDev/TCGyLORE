import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Hammer, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Biblioteca', href: '/admin/cards' },
    { title: 'Taller de Cartas', href: '/admin/cards-taller' },
];

/**
 * El Taller de Cartas es la herramienta autonoma del proyecto TAPONAZO
 * (canvas 750x1050, biblioteca, dorsos, fichas y hojas para Tabletop
 * Simulator). Vive como estatico en /taller y aqui se incrusta a altura
 * completa. Pantalla completa REAL via Fullscreen API sobre el iframe:
 * ESC o el mismo boton devuelven al panel, sin navegar a ningun lado.
 */
export default function Workshop() {
    const frameRef = useRef<HTMLDivElement>(null);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            frameRef.current?.requestFullscreen();
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Taller de Cartas" />

            <div className="flex h-[calc(100vh-4rem)] flex-col gap-3 p-3">
                {/* Cabecera compacta: el protagonista es el taller */}
                <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/40 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 px-4 py-2.5">
                    <div className="relative flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 shadow-lg shadow-orange-500/40">
                                <Hammer className="h-5 w-5 text-yellow-100" />
                            </div>
                            <div>
                                <h1
                                    className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-400"
                                    style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                    TALLER DE CARTAS
                                </h1>
                                <p className="flex items-center gap-1 text-[11px] font-semibold text-yellow-200/70">
                                    <Sparkles className="h-3 w-3 text-yellow-400" />
                                    «📚 A Biblioteca» crea la carta en la sección de Cartas
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild className="border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                <Link href="/admin/cards">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Biblioteca
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                {fullscreen ? <Minimize2 className="mr-1 h-4 w-4" /> : <Maximize2 className="mr-1 h-4 w-4" />}
                                {fullscreen ? 'Salir (Esc)' : 'Pantalla completa'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* El taller entero, a altura completa. Su biblioteca local persiste
                    en localStorage, igual que en la version autonoma. */}
                <div ref={frameRef} className="min-h-0 flex-1 overflow-hidden rounded-xl border-2 border-yellow-500/30 bg-slate-950 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <iframe
                        src="/taller/index.html"
                        title="Taller de Cartas de Tapon'Azo"
                        className="h-full w-full border-0"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
