import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { BookOpen, X, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { processManualCitations } from '@/lib/citations';

interface ManualSection {
    id: number;
    title: string;
    slug: string;
    category: string;
    content: string;
    order: number;
    is_published: boolean;
    parent_id: number | null;
}

interface Props {
    section: ManualSection;
    categories: Record<string, string>;
    sections: ManualSection[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manual', href: '/admin/manual-sections' },
    { title: 'Editar' },
];

export default function Edit({ section, categories, sections }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: section.title || '',
        category: section.category || '',
        content: section.content || '',
        order: section.order || 0,
        is_published: section.is_published || false,
        parent_id: section.parent_id?.toString() || undefined,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/manual-sections/${section.id}`);
    };

    const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar: ${section.title}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500" style={{ fontFamily: 'Cinzel, serif' }}>
                            <BookOpen className="h-8 w-8 text-orange-400 inline mr-3" />
                            Editar Sección
                        </h1>
                        <p className="text-yellow-200/70 mt-2 font-semibold">
                            Modificando: {section.title}
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/manual-sections">
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Información Básica */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Modifica los datos principales de la sección
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Ej: Introducción al juego, Reglas de combate..."
                                    className="text-lg"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría *</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categories).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">Sección Padre (opcional)</Label>
                                    <Select value={data.parent_id || 'none'} onValueChange={(value) => setData('parent_id', value === 'none' ? undefined : value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguna (sección principal)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Ninguna</SelectItem>
                                            {sections.map((sec) => (
                                                <SelectItem key={sec.id} value={sec.id.toString()}>
                                                    {sec.title} ({categories[sec.category]})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.parent_id} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Orden</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Define el orden de aparición (0 = primero)
                                    </p>
                                    <InputError message={errors.order} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="is_published">Estado</Label>
                                    <div className="flex items-center space-x-2 h-10">
                                        <Switch
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked) => setData('is_published', checked)}
                                        />
                                        <Label htmlFor="is_published" className="cursor-pointer">
                                            {data.is_published ? 'Publicado' : 'Borrador'}
                                        </Label>
                                    </div>
                                    <InputError message={errors.is_published} />
                                </div>
                            </div>

                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Slug:</strong> {section.slug}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contenido */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Contenido *</CardTitle>
                                    <CardDescription>
                                        Edita el contenido de esta sección del manual
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline" size="lg" className="bg-orange-600/20 hover:bg-orange-600/30 border-orange-500/50">
                                                <Eye className="h-5 w-5 mr-2" />
                                                Vista Previa
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="!max-w-none w-screen max-h-screen h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-orange-500/40 rounded-none" style={{ maxWidth: 'none' }}>
                                            <DialogHeader className="border-b-2 border-orange-500/30 pb-4 px-8">
                                                <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500" style={{ fontFamily: 'Cinzel, serif' }}>
                                                    📖 Vista Previa del Manual
                                                </DialogTitle>
                                                <DialogDescription className="text-yellow-200/70 text-base">
                                                    {data.title || section.title} • {wordCount} palabras
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto p-8">
                                                <div className="max-w-7xl mx-auto bg-slate-800/50 rounded-xl p-12 border-2 border-orange-500/20 shadow-2xl">
                                            <div className="prose prose-orange prose-lg max-w-none">
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                >
                                                    {processManualCitations(data.content) || '*No hay contenido para previsualizar*'}
                                                </ReactMarkdown>
                                            </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-medium">
                                            {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Escribe aquí el contenido de la sección... Puedes usar markdown para formato."
                                rows={20}
                                className="font-mono text-base resize-y min-h-[400px]"
                            />
                            <InputError message={errors.content} />
                            <p className="text-sm text-muted-foreground mt-2">
                                💡 Tip: Puedes usar Markdown para dar formato al texto (títulos, listas, negritas, etc.)
                            </p>
                        </CardContent>
                    </Card>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-end gap-4">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/admin/manual-sections">
                                Cancelar
                            </Link>
                        </Button>
                        <Button 
                            type="submit" 
                            size="lg" 
                            disabled={processing}
                            className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 hover:from-yellow-500 hover:to-red-500"
                        >
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
