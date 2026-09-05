import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search as SearchIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Resultado {
    titulo: string;
    subtitulo: string | null;
    extracto: string | null;
    url: string;
    imagen: string | null;
}

interface Grupo {
    clave: string;
    titulo: string;
    icono: string;
    resultados: Resultado[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Buscar', href: '#' },
];

/** Resalta lo buscado dentro del extracto, sin meter HTML por medio. */
function Resaltado({ texto, q }: { texto: string; q: string }) {
    if (q.length < 2) return <>{texto}</>;

    const trozos: React.ReactNode[] = [];
    const bajo = texto.toLowerCase();
    const aguja = q.toLowerCase();
    let desde = 0;

    for (;;) {
        const i = bajo.indexOf(aguja, desde);
        if (i === -1) break;
        if (i > desde) trozos.push(texto.slice(desde, i));
        trozos.push(
            <mark key={i} className="rounded bg-yellow-400/25 px-0.5 text-yellow-100">
                {texto.slice(i, i + q.length)}
            </mark>,
        );
        desde = i + q.length;
    }
    trozos.push(texto.slice(desde));

    return <>{trozos}</>;
}

export default function Search({ q, grupos, total }: { q: string; grupos: Grupo[]; total: number }) {
    const [texto, setTexto] = useState(q);
    const primera = useRef(true);

    // Se busca sola mientras escribes, con freno para no disparar una consulta
    // por tecla. `replace` evita llenar el historial del navegador.
    useEffect(() => {
        if (primera.current) {
            primera.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get('/admin/buscar', { q: texto }, { preserveState: true, replace: true, only: ['grupos', 'total', 'q'] });
        }, 350);

        return () => clearTimeout(t);
    }, [texto]);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={q ? `Buscar: ${q}` : 'Buscar'} />

            <div className="mx-auto max-w-5xl p-4 sm:p-6">
                <h1
                    className="mb-1 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-2xl font-black text-transparent"
                    style={{ fontFamily: 'Cinzel, serif' }}
                >
                    Buscar en todo
                </h1>
                <p className="mb-4 text-sm text-yellow-200/60">
                    Personajes, ubicaciones, cartas, relaciones, historias, línea de tiempo y manual. Busca también
                    dentro de los textos.
                </p>

                <div className="relative mb-6">
                    <SearchIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-yellow-200/40" />
                    <Input
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Zunle, Venta, EGO, emboscada…"
                        autoFocus
                        className="h-12 pl-11 text-base"
                    />
                </div>

                {q.length >= 2 && (
                    <p className="mb-4 text-sm font-semibold text-yellow-200/50">
                        {total === 0 ? 'Nada que se le parezca.' : `${total} resultados`}
                    </p>
                )}

                <div className="space-y-6">
                    {grupos.map((g) => (
                        <div key={g.clave}>
                            <h2 className="mb-2 flex items-center gap-2 text-sm font-black tracking-wider text-yellow-200/80 uppercase">
                                <span>{g.icono}</span>
                                {g.titulo}
                                <span className="text-yellow-200/40">({g.resultados.length})</span>
                            </h2>

                            <div className="space-y-2">
                                {g.resultados.map((r, i) => (
                                    <Link key={`${g.clave}-${i}`} href={r.url} className="block">
                                        <Card className="border-2 border-amber-500/20 bg-slate-900/70 transition-all hover:border-amber-400/60 hover:bg-slate-900">
                                            <CardContent className="flex gap-3 p-3">
                                                {r.imagen && (
                                                    <img
                                                        src={r.imagen}
                                                        alt=""
                                                        className="h-14 w-14 shrink-0 rounded-md border border-amber-500/30 object-cover"
                                                        loading="lazy"
                                                    />
                                                )}
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-yellow-100">
                                                        <Resaltado texto={r.titulo} q={q} />
                                                    </p>
                                                    {r.subtitulo && (
                                                        <p className="truncate text-xs text-yellow-200/50 capitalize">
                                                            {r.subtitulo}
                                                        </p>
                                                    )}
                                                    {r.extracto && (
                                                        <p className="mt-1 line-clamp-2 text-sm text-yellow-200/70">
                                                            <Resaltado texto={r.extracto} q={q} />
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
