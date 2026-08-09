import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Users, Save, X, Sparkles, MapPin, BookText } from 'lucide-react';
import RichTextEditor from '@/components/rich-text-editor';
import EntityImageField from '@/components/entity-image-field';
import WorldMultiSelect from '@/components/world-multi-select';

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

interface Character {
    id: number;
    world_id: number;

    worlds?: { id: number; name: string }[];
    name: string;
    biography: string | null;
    spells: string[] | null;
    image_url: string | null;
    locations?: Location[];
    stories?: Story[];
}

interface Props {
    character: Character;
    worlds: World[];
    locations: Location[];
    stories: Story[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Personajes', href: '/admin/characters' },
    { title: 'Editar' },
];

export default function Edit({ character, worlds, locations, stories }: Props) {
    console.log('DEBUG - Props recibidos:', { 
        locationsCount: locations?.length, 
        storiesCount: stories?.length,
        locations,
        stories 
    });

    // POST + _method PUT: PHP no parsea multipart en PUT y el retrato llega como fichero.
    const { data, setData, post, processing, errors } = useForm({
        world_ids: character.worlds?.map((w) => w.id.toString()) || [],
        name: character.name || '',
        biography: character.biography || '',
        spells: Array.isArray(character.spells) ? character.spells.join(', ') : (character.spells || ''),
        // Solo precargar URLs externas: un /storage/... es fichero nuestro y no debe reenviarse
        image_url: character.image_url?.startsWith('http') ? character.image_url : '',
        image: null as File | null,
        location_ids: character.locations?.map(l => l.id.toString()) || [],
        story_ids: character.stories?.map(s => s.id.toString()) || [],
        _method: 'PUT',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/characters/${character.id}`, { forceFormData: true });
    };

    const wordCount = data.biography.trim().split(/\s+/).filter(Boolean).length;
    const charCount = data.biography.length;
    const spellsArray = data.spells.split(',').map(s => s.trim()).filter(Boolean);

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${character.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                            <Users className="h-8 w-8 text-primary" />
                            Editar Personaje
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Desarrolla la historia y habilidades de tu personaje
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/characters">
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6 writer-form">
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
                                <WorldMultiSelect
                                    worlds={worlds}
                                    value={data.world_ids}
                                    onChange={(ids) => setData('world_ids', ids)}
                                    error={errors.world_ids}
                                />

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nombre del personaje..."
                                        className="text-lg"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <EntityImageField
                                label="Retrato (opcional)"
                                current={character.image_url}
                                urlValue={data.image_url}
                                onFileChange={(f) => setData('image', f)}
                                onUrlChange={(url) => setData('image_url', url)}
                                errorImage={errors.image}
                                errorUrl={errors.image_url}
                            />
                        </CardContent>
                    </Card>

                    {/* Biography Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Biografía del Personaje</CardTitle>
                                    <CardDescription>
                                        Narra la historia de vida de tu personaje
                                    </CardDescription>
                                </div>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span className="font-medium">
                                        {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
                                    </span>
                                    <span className="text-muted-foreground/60">|</span>
                                    <span>
                                        {charCount} {charCount === 1 ? 'carácter' : 'caracteres'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <RichTextEditor
                                id="biography"
                                value={data.biography}
                                onChange={(md) => setData('biography', md)}
                                placeholder="Escribe la historia del personaje, su origen, motivaciones, pasado..."
                                minHeight="400px"
                            />
                            <InputError message={errors.biography} />
                            <p className="text-xs text-muted-foreground mt-2">
                                💡 Tip: Describe su origen, personalidad, motivaciones y momentos clave de su vida
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
                                    {spellsArray.length} {spellsArray.length === 1 ? 'hechizo' : 'hechizos'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <RichTextEditor
                                id="spells"
                                value={data.spells}
                                onChange={(md) => setData('spells', md)}
                                placeholder="Bola de Fuego, Escudo Arcano, Teletransporte..."
                                minHeight="220px"
                            />
                            <InputError message={errors.spells} />
                            <p className="text-xs text-muted-foreground mt-2">
                                ✨ Separa cada hechizo con comas: Bola de Fuego, Escudo Arcano, Rayo
                            </p>
                        </CardContent>
                    </Card>

                    {/* Relationships Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Relaciones del Personaje</CardTitle>
                            <CardDescription>
                                Conecta este personaje con ubicaciones e historias
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Ubicaciones Relacionadas
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {locations.map((location) => {
                                        const isSelected = data.location_ids.includes(location.id.toString());
                                        return (
                                            <button
                                                key={location.id}
                                                type="button"
                                                onClick={() => {
                                                    const ids = isSelected
                                                        ? data.location_ids.filter((id) => id !== location.id.toString())
                                                        : [...data.location_ids, location.id.toString()];
                                                    setData('location_ids', ids);
                                                }}
                                                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-card hover:bg-accent border-border'
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
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {stories.map((story) => {
                                        const isSelected = data.story_ids.includes(story.id.toString());
                                        return (
                                            <button
                                                key={story.id}
                                                type="button"
                                                onClick={() => {
                                                    const ids = isSelected
                                                        ? data.story_ids.filter((id) => id !== story.id.toString())
                                                        : [...data.story_ids, story.id.toString()];
                                                    setData('story_ids', ids);
                                                }}
                                                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-card hover:bg-accent border-border'
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
                            <div className="flex justify-between items-center">
                                <Button type="button" variant="outline" size="lg" asChild>
                                    <Link href="/admin/characters">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" size="lg" variant="magical" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Actualizar Personaje'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </WriterLayout>
    );
}
