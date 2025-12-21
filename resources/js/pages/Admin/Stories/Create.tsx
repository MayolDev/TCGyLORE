import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { BookText, Plus, X } from 'lucide-react';

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
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/stories');
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

                            <div className="space-y-2">
                                <Label htmlFor="image_url">URL de Imagen (opcional)</Label>
                                <Input
                                    id="image_url"
                                    type="text"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <InputError message={errors.image_url} />
                            </div>
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
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Había una vez en el reino de Aethermoor..."
                                className="min-h-[500px] text-base leading-relaxed resize-y font-serif"
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

export default function Create({ worlds }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        world_id: '',
        title: '',
        content: '',
        category: '',
        image_url: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/stories');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Historia" />

            <div className="max-w-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Crear Nueva Historia</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/stories">Cancelar</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Historia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
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
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Título de la historia"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Input
                                    id="category"
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    placeholder="Leyenda, Crónica, Biografía, etc."
                                />
                                <InputError message={errors.category} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Contenido *</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Escribe la historia aquí..."
                                    rows={10}
                                />
                                <InputError message={errors.content} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">URL de Imagen</Label>
                                <Input
                                    id="image_url"
                                    type="text"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <InputError message={errors.image_url} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/stories">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Crear Historia'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

