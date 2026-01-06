import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Clock, Save, X } from 'lucide-react';

interface World {
    id: number;
    name: string;
}

interface Character {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
}

interface TimelineEvent {
    id: number;
    world_id: number;
    name: string;
    description: string | null;
    year: number;
    event_type: string;
    importance: string;
    characters?: Character[];
    locations?: Location[];
}

interface Props {
    event: TimelineEvent;
    worlds: World[];
    characters: Character[];
    locations: Location[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Línea de Tiempo', href: '/admin/timeline-events' },
    { title: 'Editar' },
];

const EVENT_TYPES = [
    { value: 'guerra', label: 'Guerra' },
    { value: 'fundacion', label: 'Fundación' },
    { value: 'catastrofe', label: 'Catástrofe' },
    { value: 'paz', label: 'Paz' },
    { value: 'descubrimiento', label: 'Descubrimiento' },
    { value: 'traicion', label: 'Traición' },
    { value: 'alianza', label: 'Alianza' },
];

const IMPORTANCE_LEVELS = [
    { value: 'menor', label: 'Menor' },
    { value: 'importante', label: 'Importante' },
    { value: 'crucial', label: 'Crucial' },
];

export default function Edit({ event, worlds, characters, locations }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        world_id: event.world_id.toString(),
        name: event.name || '',
        description: event.description || '',
        year: event.year.toString(),
        event_type: event.event_type || '',
        importance: event.importance || '',
        character_ids: event.characters?.map((c) => c.id.toString()) || [],
        location_ids: event.locations?.map((l) => l.id.toString()) || [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/timeline-events/${event.id}`);
    };

    const wordCount = data.description
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    const charCount = data.description.length;

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${event.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent">
                            <Clock className="h-8 w-8 text-amber-500" />
                            Editar Evento Histórico
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Modifica este momento crucial de la historia
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/timeline-events">
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="writer-form space-y-6">
                    {/* Basic Info Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Datos esenciales del evento histórico
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="world_id">Mundo *</Label>
                                    <Select
                                        value={data.world_id}
                                        onValueChange={(value) =>
                                            setData('world_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un mundo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {worlds.map((world) => (
                                                <SelectItem
                                                    key={world.id}
                                                    value={world.id.toString()}
                                                >
                                                    {world.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.world_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="year"
                                        className="flex items-center gap-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Año *
                                    </Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        value={data.year}
                                        onChange={(e) =>
                                            setData('year', e.target.value)
                                        }
                                        placeholder="Ej: -1000, 500, 2024"
                                    />
                                    <InputError message={errors.year} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nombre del Evento *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="La Gran Guerra, Fundación de..."
                                    className="text-lg"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="event_type">
                                        Tipo de Evento *
                                    </Label>
                                    <Select
                                        value={data.event_type}
                                        onValueChange={(value) =>
                                            setData('event_type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EVENT_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.event_type} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="importance">
                                        Importancia *
                                    </Label>
                                    <Select
                                        value={data.importance}
                                        onValueChange={(value) =>
                                            setData('importance', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona importancia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {IMPORTANCE_LEVELS.map((level) => (
                                                <SelectItem
                                                    key={level.value}
                                                    value={level.value}
                                                >
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.importance} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        Descripción del Evento *
                                    </CardTitle>
                                    <CardDescription>
                                        Narra qué sucedió y su impacto en el
                                        mundo
                                    </CardDescription>
                                </div>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span className="font-medium">
                                        {wordCount}{' '}
                                        {wordCount === 1
                                            ? 'palabra'
                                            : 'palabras'}
                                    </span>
                                    <span className="text-muted-foreground/60">
                                        |
                                    </span>
                                    <span>
                                        {charCount}{' '}
                                        {charCount === 1
                                            ? 'carácter'
                                            : 'caracteres'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="En el año X, sucedió algo extraordinario que cambiaría el curso de la historia..."
                                className="min-h-[400px] resize-y font-serif text-base leading-relaxed"
                            />
                            <InputError message={errors.description} />
                            <p className="mt-2 text-xs text-muted-foreground">
                                💡 Tip: Describe qué sucedió, quiénes estuvieron
                                involucrados y las consecuencias del evento
                            </p>
                        </CardContent>
                    </Card>

                    {/* Relations Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle>
                                Personajes y Ubicaciones Relacionados
                            </CardTitle>
                            <CardDescription>
                                Conecta este evento con personajes y lugares
                                (opcional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Personajes Involucrados</Label>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {characters.map((character) => {
                                        const isSelected =
                                            data.character_ids.includes(
                                                character.id.toString(),
                                            );
                                        return (
                                            <button
                                                key={character.id}
                                                type="button"
                                                onClick={() => {
                                                    const ids = isSelected
                                                        ? data.character_ids.filter(
                                                              (id) =>
                                                                  id !==
                                                                  character.id.toString(),
                                                          )
                                                        : [
                                                              ...data.character_ids,
                                                              character.id.toString(),
                                                          ];
                                                    setData(
                                                        'character_ids',
                                                        ids,
                                                    );
                                                }}
                                                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                                                    isSelected
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-border bg-card hover:bg-accent'
                                                }`}
                                            >
                                                {character.name}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Seleccionados: {data.character_ids.length}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Ubicaciones del Evento</Label>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {locations.map((location) => {
                                        const isSelected =
                                            data.location_ids.includes(
                                                location.id.toString(),
                                            );
                                        return (
                                            <button
                                                key={location.id}
                                                type="button"
                                                onClick={() => {
                                                    const ids = isSelected
                                                        ? data.location_ids.filter(
                                                              (id) =>
                                                                  id !==
                                                                  location.id.toString(),
                                                          )
                                                        : [
                                                              ...data.location_ids,
                                                              location.id.toString(),
                                                          ];
                                                    setData(
                                                        'location_ids',
                                                        ids,
                                                    );
                                                }}
                                                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                                                    isSelected
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-border bg-card hover:bg-accent'
                                                }`}
                                            >
                                                {location.name}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Seleccionadas: {data.location_ids.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-primary/20 bg-card/50">
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    asChild
                                >
                                    <Link href="/admin/timeline-events">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    variant="magical"
                                    disabled={processing}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Guardando...'
                                        : 'Actualizar Evento'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </WriterLayout>
    );
}
