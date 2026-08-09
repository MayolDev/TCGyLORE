import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';

/**
 * Cabecera épica de las páginas "Ver" del lore: banner con la imagen de la
 * entidad (o un degradado si no tiene), título en Cinzel, subtítulo y badges.
 */
export default function LoreShowHeader({
    image,
    icon,
    title,
    subtitle,
    badges,
    backHref,
    editHref,
}: {
    image: string | null;
    icon: string;
    title: string;
    subtitle?: string | null;
    badges?: React.ReactNode;
    backHref: string;
    editHref: string;
}) {
    return (
        <div className="relative overflow-hidden rounded-xl border-4 border-amber-500/50 shadow-[0_0_50px_rgba(251,191,36,0.35)]">
            <div className="relative h-64 sm:h-80">
                {image ? (
                    <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-slate-900 to-amber-900/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <Button variant="outline" size="sm" asChild className="bg-slate-900/80 backdrop-blur-sm">
                        <Link href={backHref}>
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                    <Button variant="magical" size="sm" asChild className="bg-gradient-to-r from-yellow-600 to-orange-600 font-bold shadow-lg shadow-orange-500/40">
                        <Link href={editHref}>
                            <Pencil className="mr-1 h-4 w-4" />
                            Editar
                        </Link>
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end gap-4">
                        <span className="text-5xl drop-shadow-[0_0_14px_rgba(251,191,36,0.7)]">{icon}</span>
                        <div className="min-w-0">
                            <h1
                                className="truncate text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] uppercase"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {title}
                            </h1>
                            {subtitle && <p className="mt-1 font-semibold text-yellow-200/80">{subtitle}</p>}
                        </div>
                    </div>
                    {badges && <div className="mt-3 flex flex-wrap gap-2">{badges}</div>}
                </div>
            </div>
        </div>
    );
}
