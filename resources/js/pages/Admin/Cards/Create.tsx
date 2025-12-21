import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WriterLayout from '@/layouts/writer-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Swords, Plus, X } from 'lucide-react';

interface World {
    id: number;
    name: string;
}

interface Character {
    id: number;
    name: string;
}

interface Props {
    worlds: World[];
    characters: Character[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cartas TCG', href: '/admin/cards' },
    { title: 'Crear' },
];

export default function Create({ worlds, characters }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        world_id: '',
        character_id: '0',
        name: '',
        illustration_url: '',
        effect: '',
        cost: '',
        type: '',
        rarity: '',
        archetype: '',
        alignment: '',
        faction: '',
        edition: '',
        artist: '',
        flavor_text: '',
        strength: '',
        agility: '',
        charisma: '',
        mind: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            ...data,
            character_id: data.character_id === '0' ? null : data.character_id,
        };
        
        post('/admin/cards', {
            data: submitData,
        });
    };

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Carta TCG" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                            <Swords className="h-8 w-8 text-primary" />
                            Crear Nueva Carta TCG
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Diseña una nueva carta para tu juego
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/cards">
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6 writer-form">
                    {/* Basic Info */}
                    <UICard className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>Datos principales de la carta</CardDescription>
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
                                    <Label htmlFor="character_id">Personaje (opcional)</Label>
                                    <Select value={data.character_id} onValueChange={(value) => setData('character_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Ninguno</SelectItem>
                                            {characters.map((character) => (
                                                <SelectItem key={character.id} value={character.id.toString()}>
                                                    {character.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.character_id} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre de la Carta *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nombre épico de la carta..."
                                    className="text-lg"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="illustration_url">URL de Ilustración</Label>
                                <Input
                                    id="illustration_url"
                                    type="text"
                                    value={data.illustration_url}
                                    onChange={(e) => setData('illustration_url', e.target.value)}
                                    placeholder="https://example.com/illustration.jpg"
                                />
                                <InputError message={errors.illustration_url} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="cost">Coste *</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        value={data.cost}
                                        onChange={(e) => setData('cost', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.cost} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo *</Label>
                                    <Input
                                        id="type"
                                        type="text"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        placeholder="Criatura, Hechizo..."
                                    />
                                    <InputError message={errors.type} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rarity">Rareza</Label>
                                    <Select value={data.rarity} onValueChange={(value) => setData('rarity', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Rareza" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="común">Común</SelectItem>
                                            <SelectItem value="rara">Rara</SelectItem>
                                            <SelectItem value="épica">Épica</SelectItem>
                                            <SelectItem value="legendaria">Legendaria</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.rarity} />
                                </div>
                            </div>
                        </CardContent>
                    </UICard>

                    {/* Effect Text */}
                    <UICard className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Efecto de la Carta *</CardTitle>
                            <CardDescription>
                                Usa *** para negrita y --- para separadores
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="effect"
                                value={data.effect}
                                onChange={(e) => setData('effect', e.target.value)}
                                placeholder="***Habilidad Especial:*** Este personaje puede...&#10;---&#10;Al entrar al campo de batalla..."
                                className="min-h-[200px] text-base leading-relaxed resize-y font-mono"
                            />
                            <InputError message={errors.effect} />
                            <p className="text-xs text-muted-foreground mt-2">
                                💡 Tip: Usa ***texto*** para negrita y --- en una línea separada para divisores
                            </p>
                        </CardContent>
                    </UICard>

                    {/* Attributes */}
                    <UICard className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Atributos (opcionales)</CardTitle>
                            <CardDescription>Stats del personaje</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="strength">💪 Fuerza</Label>
                                    <Input
                                        id="strength"
                                        type="number"
                                        value={data.strength}
                                        onChange={(e) => setData('strength', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.strength} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="agility">⚡ Agilidad</Label>
                                    <Input
                                        id="agility"
                                        type="number"
                                        value={data.agility}
                                        onChange={(e) => setData('agility', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.agility} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="charisma">✨ Carisma</Label>
                                    <Input
                                        id="charisma"
                                        type="number"
                                        value={data.charisma}
                                        onChange={(e) => setData('charisma', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.charisma} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mind">🧠 Mente</Label>
                                    <Input
                                        id="mind"
                                        type="number"
                                        value={data.mind}
                                        onChange={(e) => setData('mind', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.mind} />
                                </div>
                            </div>
                        </CardContent>
                    </UICard>

                    {/* Additional Info */}
                    <UICard className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Información Adicional</CardTitle>
                            <CardDescription>Detalles extra de la carta</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="archetype">Arquetipo</Label>
                                    <Input
                                        id="archetype"
                                        type="text"
                                        value={data.archetype}
                                        onChange={(e) => setData('archetype', e.target.value)}
                                        placeholder="Guerrero, Mago..."
                                    />
                                    <InputError message={errors.archetype} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alignment">Alineación</Label>
                                    <Input
                                        id="alignment"
                                        type="text"
                                        value={data.alignment}
                                        onChange={(e) => setData('alignment', e.target.value)}
                                        placeholder="Luz, Oscuridad..."
                                    />
                                    <InputError message={errors.alignment} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="faction">Facción</Label>
                                    <Input
                                        id="faction"
                                        type="text"
                                        value={data.faction}
                                        onChange={(e) => setData('faction', e.target.value)}
                                        placeholder="Nombre de facción"
                                    />
                                    <InputError message={errors.faction} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edition">Edición</Label>
                                    <Input
                                        id="edition"
                                        type="text"
                                        value={data.edition}
                                        onChange={(e) => setData('edition', e.target.value)}
                                        placeholder="Primera Edición..."
                                    />
                                    <InputError message={errors.edition} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="artist">Artista</Label>
                                <Input
                                    id="artist"
                                    type="text"
                                    value={data.artist}
                                    onChange={(e) => setData('artist', e.target.value)}
                                    placeholder="Nombre del artista"
                                />
                                <InputError message={errors.artist} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="flavor_text">Texto de Sabor</Label>
                                <Textarea
                                    id="flavor_text"
                                    value={data.flavor_text}
                                    onChange={(e) => setData('flavor_text', e.target.value)}
                                    placeholder="Una cita o texto descriptivo..."
                                    rows={3}
                                    className="text-base leading-relaxed resize-y italic"
                                />
                                <InputError message={errors.flavor_text} />
                            </div>
                        </CardContent>
                    </UICard>

                    {/* Actions */}
                    <UICard className="border-primary/20 bg-card/50">
                        <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                                <Button type="button" variant="outline" size="lg" asChild>
                                    <Link href="/admin/cards">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" size="lg" variant="magical" disabled={processing}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {processing ? 'Creando...' : 'Crear Carta'}
                                </Button>
                            </div>
                        </CardContent>
                    </UICard>
                </form>
            </div>
        </WriterLayout>
    );
}
