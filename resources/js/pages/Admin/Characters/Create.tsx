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
import { BookText, MapPin, Plus, Sparkles, Users, X } from 'lucide-react';

interface World {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
}

interface Story {
    id: number;
    title: string;
}

interface Props {
    worlds: World[];
    locations: Location[];
    stories: Story[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Personajes', href: '/admin/characters' },
    { title: 'Crear' },
];

export default function Create({ worlds, locations, stories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        world_id: '',
        name: '',
        biography: '',
        spells: '',
        image_url: '',
        location_ids: [] as string[],
        story_ids: [] as string[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/characters');
    };

    const wordCount = data.biography.trim().split(/\s+/).filter(Boolean).length;
    const charCount = data.biography.length;
    const spellsArray = data.spells
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Personaje" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">
                            <Users className="h-8 w-8 text-primary" />
                            Crear Nuevo Personaje
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Da vida a un nuevo héroe o villano épico
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/characters">
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
                                Datos esenciales del personaje
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
                                    <Label htmlFor="name">Nombre *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Nombre del personaje..."
                                        className="text-lg"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">
                                    URL de Imagen (opcional)
                                </Label>
                                <Input
                                    id="image_url"
                                    type="text"
                                    value={data.image_url}
                                    onChange={(e) =>
                                        setData('image_url', e.target.value)
                                    }
                                    placeholder="https://example.com/character.jpg"
                                />
                                <InputError message={errors.image_url} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Biography Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        Biografía del Personaje
                                    </CardTitle>
                                    <CardDescription>
                                        Narra la historia de vida de tu
                                        personaje
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
                                id="biography"
                                value={data.biography}
                                onChange={(e) =>
                                    setData('biography', e.target.value)
                                }
                                placeholder="Escribe la historia del personaje, su origen, motivaciones, pasado..."
                                className="min-h-[400px] resize-y font-serif text-base leading-relaxed"
                            />
                            <InputError message={errors.biography} />
                            <p className="mt-2 text-xs text-muted-foreground">
                                💡 Tip: Describe su origen, personalidad,
                                motivaciones y momentos clave de su vida
                            </p>
                        </CardContent>
                    </Card>

                    {/* Spells Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Hechizos y Habilidades
                                    </CardTitle>
                                    <CardDescription>
                                        Lista de hechizos separados por comas
                                    </CardDescription>
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {spellsArray.length}{' '}
                                    {spellsArray.length === 1
                                        ? 'hechizo'
                                        : 'hechizos'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="spells"
                                value={data.spells}
                                onChange={(e) =>
                                    setData('spells', e.target.value)
                                }
                                placeholder="Bola de Fuego, Escudo Arcano, Teletransporte..."
                                rows={4}
                                className="resize-y text-base leading-relaxed"
                            />
                            <InputError message={errors.spells} />
                            <p className="mt-2 text-xs text-muted-foreground">
                                ✨ Separa cada hechizo con comas: Bola de Fuego,
                                Escudo Arcano, Rayo
                            </p>
                        </CardContent>
                    </Card>

                    {/* Relationships Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Relaciones del Personaje</CardTitle>
                            <CardDescription>
                                Conecta este personaje con ubicaciones e
                                historias
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Ubicaciones Relacionadas
                                </Label>
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

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <BookText className="h-4 w-4" />
                                    Historias Relacionadas
                                </Label>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                    {stories.map((story) => {
                                        const isSelected =
                                            data.story_ids.includes(
                                                story.id.toString(),
                                            );
                                        return (
                                            <button
                                                key={story.id}
                                                type="button"
                                                onClick={() => {
                                                    const ids = isSelected
                                                        ? data.story_ids.filter(
                                                              (id) =>
                                                                  id !==
                                                                  story.id.toString(),
                                                          )
                                                        : [
                                                              ...data.story_ids,
                                                              story.id.toString(),
                                                          ];
                                                    setData('story_ids', ids);
                                                }}
                                                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                                                    isSelected
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-border bg-card hover:bg-accent'
                                                }`}
                                            >
                                                {story.title}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Seleccionadas: {data.story_ids.length}
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
                                    <Link href="/admin/characters">
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
                                    <Plus className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Creando...'
                                        : 'Crear Personaje'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </WriterLayout>
    );
}
