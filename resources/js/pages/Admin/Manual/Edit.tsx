import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { processManualCitations } from '@/lib/citations';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Eye, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

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
                        <h1
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent"
                            style={{ fontFamily: 'Cinzel, serif' }}
                        >
                            <BookOpen className="mr-3 inline h-8 w-8 text-orange-400" />
                            Editar Sección
                        </h1>
                        <p className="mt-2 font-semibold text-yellow-200/70">
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
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Ej: Introducción al juego, Reglas de combate..."
                                    className="text-lg"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Categoría *
                                    </Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) =>
                                            setData('category', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categories).map(
                                                ([key, value]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {value}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">
                                        Sección Padre (opcional)
                                    </Label>
                                    <Select
                                        value={data.parent_id || 'none'}
                                        onValueChange={(value) =>
                                            setData(
                                                'parent_id',
                                                value === 'none'
                                                    ? undefined
                                                    : value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguna (sección principal)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Ninguna
                                            </SelectItem>
                                            {sections.map((sec) => (
                                                <SelectItem
                                                    key={sec.id}
                                                    value={sec.id.toString()}
                                                >
                                                    {sec.title} (
                                                    {categories[sec.category]})
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
                                        onChange={(e) =>
                                            setData(
                                                'order',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        min="0"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Define el orden de aparición (0 =
                                        primero)
                                    </p>
                                    <InputError message={errors.order} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="is_published">Estado</Label>
                                    <div className="flex h-10 items-center space-x-2">
                                        <Switch
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked) =>
                                                setData('is_published', checked)
                                            }
                                        />
                                        <Label
                                            htmlFor="is_published"
                                            className="cursor-pointer"
                                        >
                                            {data.is_published
                                                ? 'Publicado'
                                                : 'Borrador'}
                                        </Label>
                                    </div>
                                    <InputError message={errors.is_published} />
                                </div>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3">
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
                                        Edita el contenido de esta sección del
                                        manual
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                className="border-orange-500/50 bg-orange-600/20 hover:bg-orange-600/30"
                                            >
                                                <Eye className="mr-2 h-5 w-5" />
                                                Vista Previa
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent
                                            className="flex h-screen max-h-screen w-screen !max-w-none flex-col overflow-hidden rounded-none border-4 border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
                                            style={{ maxWidth: 'none' }}
                                        >
                                            <DialogHeader className="border-b-2 border-orange-500/30 px-8 pb-4">
                                                <DialogTitle
                                                    className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-3xl font-black text-transparent"
                                                    style={{
                                                        fontFamily:
                                                            'Cinzel, serif',
                                                    }}
                                                >
                                                    📖 Vista Previa del Manual
                                                </DialogTitle>
                                                <DialogDescription className="text-base text-yellow-200/70">
                                                    {data.title ||
                                                        section.title}{' '}
                                                    • {wordCount} palabras
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto p-8">
                                                <div className="mx-auto max-w-7xl rounded-xl border-2 border-orange-500/20 bg-slate-800/50 p-12 shadow-2xl">
                                                    <div className="prose prose-orange prose-lg max-w-none">
                                                        <ReactMarkdown
                                                            remarkPlugins={[
                                                                remarkGfm,
                                                            ]}
                                                            rehypePlugins={[
                                                                rehypeRaw,
                                                            ]}
                                                        >
                                                            {processManualCitations(
                                                                data.content,
                                                            ) ||
                                                                '*No hay contenido para previsualizar*'}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-medium">
                                            {wordCount}{' '}
                                            {wordCount === 1
                                                ? 'palabra'
                                                : 'palabras'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                placeholder="Escribe aquí el contenido de la sección... Puedes usar markdown para formato."
                                rows={20}
                                className="min-h-[400px] resize-y font-mono text-base"
                            />
                            <InputError message={errors.content} />
                            <p className="mt-2 text-sm text-muted-foreground">
                                💡 Tip: Puedes usar Markdown para dar formato al
                                texto (títulos, listas, negritas, etc.)
                            </p>
                        </CardContent>
                    </Card>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-end gap-4">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/admin/manual-sections">Cancelar</Link>
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
