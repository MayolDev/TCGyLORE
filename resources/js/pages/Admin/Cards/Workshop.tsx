import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Hammer, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cartas TCG', href: '/admin/cards' },
    { title: 'Taller de Cartas', href: '/admin/cards-taller' },
];

/**
 * El Taller de Cartas es la herramienta autonoma del proyecto TAPONAZO
 * (canvas 750x1050, biblioteca, dorsos, fichas y hojas para Tabletop
 * Simulator). Vive como estatico en /taller y aqui se incrusta con el marco
 * del panel; css/theme-web.css la alinea con esta paleta sin tocar el motor
 * de pintado, asi que las cartas exportadas salen identicas.
 */
export default function Workshop() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Taller de Cartas" />

            <div className="flex h-full flex-col gap-4 p-4">
                {/* Cabecera épica, misma voz que el resto del panel */}
                <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/40 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 px-6 py-4 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                    <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-yellow-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
                    <div className="relative flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 shadow-lg shadow-orange-500/40">
                                <Hammer className="h-6 w-6 text-yellow-100" />
                            </div>
                            <div>
                                <h1
                                    className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-400"
                                    style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                    TALLER DE CARTAS
                                </h1>
                                <p className="flex items-center gap-1 text-xs font-semibold text-yellow-200/70">
                                    <Sparkles className="h-3 w-3 text-yellow-400" />
                                    Cartas, dorsos, fichas y hojas para Tabletop Simulator
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild className="border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                <Link href="/admin/cards">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Volver a Cartas
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="border-yellow-500/40 text-yellow-200 hover:bg-yellow-600/10">
                                <a href="/taller/index.html" target="_blank" rel="noopener">
                                    <ExternalLink className="mr-1 h-4 w-4" />
                                    Pantalla completa
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* El taller entero, embebido. La biblioteca del taller persiste en
                    localStorage del navegador, igual que en la version autonoma. */}
                <div className="min-h-0 flex-1 overflow-hidden rounded-xl border-2 border-yellow-500/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <iframe
                        src="/taller/index.html"
                        title="Taller de Cartas de Tapon'Azo"
                        className="h-full w-full border-0"
                        style={{ minHeight: 'calc(100vh - 220px)' }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
