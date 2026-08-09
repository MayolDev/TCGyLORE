import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { BookText, Plus, X } from 'lucide-react';
import RichTextEditor from '@/components/rich-text-editor';
import EntityImageField from '@/components/entity-image-field';

interface World {
    id: number;
    name: string;
}

interface Props {
    worlds: World[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Historias', href: '/admin/stories' },
    { title: 'Crear' },
];

export default function Create({ worlds }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        world_id: '',
        title: '',
        content: '',
        category: '',
        image_url: '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/stories', { forceFormData: true });
    };

    const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length;
    const charCount = data.content.length;

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Historia" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                            <BookText className="h-8 w-8 text-primary" />
                            Crear Nueva Historia
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Escribe una historia épica para tu mundo
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/stories">
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6 writer-form">
                    {/* Metadata Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Configura los datos principales de la historia
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="world_id">Mundo *</Label>
                                    <Select value={data.world_id} onValueChange={(value) => setData('world_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un mundo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {worlds.map((world) => (
                                                <SelectItem key={world.id} value={world.id.toString()}>
                                                    {world.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.world_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>
                                    <Input
                                        id="category"
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        placeholder="Leyenda, Crónica, Biografía..."
                                    />
                                    <InputError message={errors.category} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Un título épico para tu historia..."
                                    className="text-lg"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <EntityImageField
                                label="Portada (opcional)"
                                urlValue={data.image_url}
                                onFileChange={(f) => setData('image', f)}
                                onUrlChange={(url) => setData('image_url', url)}
                                errorImage={errors.image}
                                errorUrl={errors.image_url}
                            />
                        </CardContent>
                    </Card>

                    {/* Content Card - Full Width, Writer Friendly */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Contenido de la Historia *</CardTitle>
                                    <CardDescription>
                                        Escribe tu historia con libertad y creatividad
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
                                id="content"
                                value={data.content}
                                onChange={(md) => setData('content', md)}
                                placeholder="Había una vez en el reino de Aethermoor..."
                                minHeight="500px"
                            />
                            <InputError message={errors.content} />
                            <p className="text-xs text-muted-foreground mt-2">
                                💡 Tip: Usa saltos de línea para separar párrafos y hacer tu historia más legible
                            </p>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-primary/20 bg-card/50">
                        <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                                <Button type="button" variant="outline" size="lg" asChild>
                                    <Link href="/admin/stories">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" size="lg" variant="magical" disabled={processing}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {processing ? 'Creando...' : 'Crear Historia'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </WriterLayout>
    );
}

