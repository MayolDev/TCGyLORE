import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Layers, Pencil, Plus, Trash2 } from 'lucide-react';

interface DeckSummary {
    id: number;
    name: string;
    description: string | null;
    type: 'normal' | 'eventos';
    protagonista: { name: string; image: string | null } | null;
    totales: { principal: number; side: number; senda: number; eventos: number };
    updated_at: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mazos', href: '/admin/decks' },
];

export default function Index({ decks }: { decks: DeckSummary[] }) {
    const handleDelete = (deck: DeckSummary) => {
        if (confirm(`¿Eliminar el mazo "${deck.name}"?`)) {
            router.delete(`/admin/decks/${deck.id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Mazos" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            Mazos
                        </h1>
                        <p className="mt-2 text-base font-semibold text-yellow-200/70">
                            🃏 Construye mazos con las cartas de tu Biblioteca
                        </p>
                    </div>
                    <Button variant="magical" size="lg" asChild className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 font-black shadow-xl shadow-orange-500/50 border-2 border-yellow-400/30" style={{ fontFamily: 'Cinzel, serif' }}>
                        <Link href="/admin/decks/create">
                            <Plus className="mr-2 h-5 w-5" />
                            Nuevo Mazo
                        </Link>
                    </Button>
                </div>

                {decks.length === 0 ? (
                    <Card className="border-2 border-dashed border-primary/30">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Layers className="mb-4 h-16 w-16 text-yellow-400/50" />
                            <p className="font-semibold text-yellow-200/70">Todavía no hay mazos. Crea el primero.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {decks.map((deck) => (
                            <Card key={deck.id} className="group overflow-hidden pt-0 border-4 border-amber-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 transition-all duration-300 hover:border-amber-400/70 hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]">
                                <div className="relative h-36 overflow-hidden border-b-2 border-amber-500/30 bg-gradient-to-br from-amber-600/25 via-orange-600/15 to-red-600/25">
                                    {deck.protagonista?.image ? (
                                        <img src={deck.protagonista.image} alt={deck.protagonista.name} className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Layers className="h-16 w-16 text-amber-400/50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                                    <Badge className="absolute top-2 right-2 border-amber-500/50 bg-slate-900/90 font-bold text-yellow-200 backdrop-blur-sm">
                                        {deck.type === 'eventos' ? '⚡ Eventos' : '🃏 Normal'}
                                    </Badge>
                                </div>
                                <CardContent className="space-y-3">
                                    <div>
                                        <h2 className="text-xl font-black text-yellow-200" style={{ fontFamily: 'Cinzel, serif' }}>
                                            {deck.name}
                                        </h2>
                                        {deck.protagonista && (
                                            <p className="text-sm font-semibold text-yellow-200/60">👑 {deck.protagonista.name}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 text-xs">
                                        {deck.type === 'eventos' ? (
                                            <Badge variant="outline" className="border-cyan-500/50 text-cyan-200 font-bold">⚡ {deck.totales.eventos} eventos</Badge>
                                        ) : (
                                            <>
                                                <Badge variant="outline" className="border-yellow-500/50 text-yellow-200 font-bold">🃏 {deck.totales.principal}</Badge>
                                                <Badge variant="outline" className="border-purple-500/50 text-purple-200 font-bold">🛤️ {deck.totales.senda}</Badge>
                                                <Badge variant="outline" className="border-blue-500/50 text-blue-200 font-bold">🎒 {deck.totales.side}</Badge>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <Button variant="outline" size="sm" className="flex-1 border-yellow-500/50 font-bold text-yellow-200 hover:bg-yellow-600/20" asChild>
                                            <Link href={`/admin/decks/${deck.id}/edit`}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Abrir
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(deck)} className="border-red-500/50 text-red-300 hover:bg-red-600/20">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
