import { cn } from '@/lib/utils';
import { NOMBRES, useEstilo, type Estilo } from '@/hooks/use-estilo';
import { Flame, Wine } from 'lucide-react';

const OPCIONES: { valor: Estilo; icono: typeof Flame }[] = [
    { valor: 'forja', icono: Flame },
    { valor: 'taberna', icono: Wine },
];

/**
 * Elige el estilo visual. Cambia al momento y se recuerda; no toca ningun
 * contenido, solo los colores.
 */
export default function EstiloTabs({ className = '' }: { className?: string }) {
    const { estilo, cambiarEstilo } = useEstilo();

    return (
        <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
            {OPCIONES.map(({ valor, icono: Icono }) => {
                const activo = estilo === valor;

                return (
                    <button
                        key={valor}
                        type="button"
                        onClick={() => cambiarEstilo(valor)}
                        aria-pressed={activo}
                        className={cn(
                            'flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors',
                            activo
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-card hover:border-primary/50',
                        )}
                    >
                        <Icono className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="min-w-0">
                            <span className="block font-bold">{NOMBRES[valor].titulo}</span>
                            <span className="block text-sm text-muted-foreground">
                                {NOMBRES[valor].descripcion}
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
