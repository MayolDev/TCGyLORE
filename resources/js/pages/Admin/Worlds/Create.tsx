import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Globe, Map, Plus, X } from 'lucide-react';
import RichTextEditor from '@/components/rich-text-editor';
import EntityImageField from '@/components/entity-image-field';
import { useState } from 'react';

const DEFAULT_MAP = '/images/map-aethermoor.webp';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mundos', href: '/admin/worlds' },
    { title: 'Crear' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        image_url: string;
        image: File | null;
        map_image: File | null;
    }>({
        name: '',
        description: '',
        image_url: '',
        image: null,
        map_image: null,
    });

    const [mapPreview, setMapPreview] = useState<string | null>(null);

    const handleMapFile = (file: File | null) => {
        setData('map_image', file);
        setMapPreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/worlds', { forceFormData: true });
    };

    const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;
    const charCount = data.description.length;

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Mundo" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                            <Globe className="h-8 w-8 text-primary" />
                            Crear Nuevo Mundo
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Da vida a un nuevo universo épico
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/worlds">
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
                                Datos esenciales del mundo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Mundo *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Aethermoor, Tierra Media..."
                                    className="text-lg"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <EntityImageField
                                label="Imagen del Mundo (opcional)"
                                urlValue={data.image_url}
                                onFileChange={(f) => setData('image', f)}
                                onUrlChange={(url) => setData('image_url', url)}
                                errorImage={errors.image}
                                errorUrl={errors.image_url}
                            />
                        </CardContent>
                    </Card>

                    {/* Mapa del Mundo */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Map className="h-5 w-5 text-primary" />
                                Mapa del Mundo
                            </CardTitle>
                            <CardDescription>
                                Mapa base sobre el que se colocan las ubicaciones de este mundo. Si no subes uno, se usa el mapa por defecto.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative overflow-hidden rounded-lg border-2 border-amber-500/40">
                                <img
                                    src={mapPreview ?? DEFAULT_MAP}
                                    alt="Mapa del mundo"
                                    className="w-full max-h-72 object-cover"
                                />
                                <span className="absolute top-2 left-2 rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-bold text-yellow-200 border border-yellow-500/40">
                                    {mapPreview ? '🗺️ Mapa nuevo' : '🗺️ Mapa por defecto'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="map_image">Subir mapa (opcional)</Label>
                                <Input
                                    id="map_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleMapFile(e.target.files?.[0] || null)}
                                />
                                <InputError message={errors.map_image} />
                                <p className="text-xs text-muted-foreground">
                                    💡 Recomendado: imagen apaisada (proporción ~2:1), máximo 8MB. WebP o JPG pesan menos.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Descripción del Mundo</CardTitle>
                                    <CardDescription>
                                        Describe las características principales de tu mundo
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
                                id="description"
                                value={data.description}
                                onChange={(md) => setData('description', md)}
                                placeholder="Un mundo de fantasía medieval donde la magia y la tecnología conviven..."
                                minHeight="300px"
                            />
                            <InputError message={errors.description} />
                            <p className="text-xs text-muted-foreground mt-2">
                                💡 Tip: Describe el ambiente, las características únicas y el tono general del mundo
                            </p>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-primary/20 bg-card/50">
                        <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                                <Button type="button" variant="outline" size="lg" asChild>
                                    <Link href="/admin/worlds">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" size="lg" variant="magical" disabled={processing}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {processing ? 'Creando...' : 'Crear Mundo'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </WriterLayout>
    );
}
