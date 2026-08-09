import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface World {
    id: number;
    name: string;
}

/**
 * Selector de pertenencia a mundos: una entidad puede ser de uno o de varios.
 * En cronología, dejarlo vacío significa "evento global, de todos los mundos".
 */
export default function WorldMultiSelect({
    worlds,
    value,
    onChange,
    error,
    required = true,
    emptyMeansAll = false,
}: {
    worlds: World[];
    value: string[];
    onChange: (ids: string[]) => void;
    error?: string;
    required?: boolean;
    /** true en cronología: sin mundos = evento de todos los mundos. */
    emptyMeansAll?: boolean;
}) {
    const toggle = (id: string) => {
        onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
    };

    return (
        <div className="space-y-2">
            <Label>
                🌍 Mundos {required && <span className="text-destructive">*</span>}
            </Label>
            <div className="flex flex-wrap gap-2">
                {worlds.map((world) => {
                    const isSelected = value.includes(world.id.toString());
                    return (
                        <button
                            key={world.id}
                            type="button"
                            onClick={() => toggle(world.id.toString())}
                            className={`px-3 py-2 text-sm font-semibold rounded-md border transition-colors ${
                                isSelected
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card hover:bg-accent border-border'
                            }`}
                        >
                            {isSelected ? '✓ ' : ''}{world.name}
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-muted-foreground">
                {emptyMeansAll
                    ? '💡 Sin ninguno seleccionado, el evento es global: pasa en todos los mundos.'
                    : '💡 Puede pertenecer a un mundo o a varios.'}
            </p>
            <InputError message={error} />
        </div>
    );
}
