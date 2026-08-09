import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Globe, Save } from 'lucide-react';
import EpicFormHeader from '@/components/epic-form-header';
import RichTextEditor from '@/components/rich-text-editor';

interface World {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
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
    const { data, setData, put, processing, errors } = useForm({
        name: world.name || '',
        description: world.description || '',
        image_url: world.image_url || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/worlds/${world.id}`);
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
