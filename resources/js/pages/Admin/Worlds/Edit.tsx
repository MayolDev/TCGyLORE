import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Globe, Map, Save } from 'lucide-react';
import EpicFormHeader from '@/components/epic-form-header';
import RichTextEditor from '@/components/rich-text-editor';
import { useState } from 'react';

interface World {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    map_image: string | null;
    map_image_url: string;
}

interface Props {
    world: World;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mundos', href: '/admin/worlds' },
    { title: 'Editar' },
];

export default function Edit({ world }: Props) {
    // POST + _method PUT: PHP no parsea multipart en peticiones PUT reales,
    // y sin multipart el fichero del mapa nunca llegaría al servidor.
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        image_url: string;
        map_image: File | null;
        _method: string;
    }>({
        name: world.name || '',
        description: world.description || '',
        image_url: world.image_url || '',
        map_image: null,
        _method: 'PUT',
    });

    const [mapPreview, setMapPreview] = useState<string | null>(null);

    const handleMapFile = (file: File | null) => {
        setData('map_image', file);
        setMapPreview(file ? URL.createObjectURL(file) : null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/worlds/${world.id}`, { forceFormData: true });
    };

    const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;
    const charCount = data.description.length;

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${world.name}`} />

            <div className="space-y-6">
                <EpicFormHeader
                    icon={Globe}
                    title="Editar Mundo"
                    description="🌍 Modifica la configuración de tu mundo"
                    cancelLink="/admin/worlds"
                />

                <form onSubmit={submit} className="space-y-6 writer-form">
                    {/* Basic Info Card */}
                    <Card>
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

                            <div className="space-y-2">
                                <Label htmlFor="image_url">URL de Imagen (opcional)</Label>
                                <Input
                                    id="image_url"
                                    type="text"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    placeholder="https://example.com/world.jpg"
                                />
                                <InputError message={errors.image_url} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mapa del Mundo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Map className="h-5 w-5 text-primary" />
                                Mapa del Mundo
                            </CardTitle>
                            <CardDescription>
                                Mapa base sobre el que se colocan las ubicaciones de este mundo. Sube uno nuevo para reemplazarlo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative overflow-hidden rounded-lg border-2 border-amber-500/40">
                                <img
                                    src={mapPreview ?? world.map_image_url}
                                    alt={`Mapa de ${world.name}`}
                                    className="w-full max-h-72 object-cover"
                                />
                                <span className="absolute top-2 left-2 rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-bold text-yellow-200 border border-yellow-500/40">
                                    {mapPreview ? '🗺️ Mapa nuevo (sin guardar)' : world.map_image ? '🗺️ Mapa propio' : '🗺️ Mapa por defecto'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="map_image">Subir mapa nuevo (opcional)</Label>
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
                    <Card>
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
                    <Card className="bg-card/50">
                        <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                    ✨ Guarda los cambios para actualizar el mundo
                                </p>
                                <Button type="submit" size="lg" variant="magical" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Actualizar Mundo'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </WriterLayout>
    );
}
