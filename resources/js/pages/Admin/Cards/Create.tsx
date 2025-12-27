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

interface Taxonomy {
    id: number;
    name: string;
}

interface Props {
    worlds: World[];
    characters: Character[];
    cardTypes: Taxonomy[];
    rarities: Taxonomy[];
    archetypes: Taxonomy[];
    alignments: Taxonomy[];
    factions: Taxonomy[];
    editions: Taxonomy[];
    artists: Taxonomy[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cartas TCG', href: '/admin/cards' },
    { title: 'Crear' },
];

export default function Create({ worlds, characters, cardTypes, rarities, archetypes, alignments, factions, editions, artists }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        world_id: '',
        character_id: '0',
        name: '',
        illustration: null as File | null,
        effect: '',
        cost: '',
        card_type_id: '',
        rarity_id: '',
        archetype_id: '0',
        alignment_id: '',
        faction_id: '0',
        edition_id: '0',
        artist_id: '0',
        flavor_text: '',
        strength: '',
        agility: '',
        charisma: '',
        mind: '',
        defense: '',
        magic_defense: '',
        health: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            ...data,
            character_id: data.character_id === '0' ? null : data.character_id,
            archetype_id: data.archetype_id === '0' ? null : data.archetype_id,
            faction_id: data.faction_id === '0' ? null : data.faction_id,
            edition_id: data.edition_id === '0' ? null : data.edition_id,
            artist_id: data.artist_id === '0' ? null : data.artist_id,
        };
        
        post('/admin/cards', {
            data: submitData,
            forceFormData: true,
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
                                <Label htmlFor="illustration">Ilustración (formato vertical)</Label>
                                <Input
                                    id="illustration"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('illustration', e.target.files?.[0] || null)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Formato vertical recomendado (ej: 600x800px). Máximo 2MB.
                                </p>
                                <InputError message={errors.illustration} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-4">
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
                                    <Label htmlFor="card_type_id">Tipo *</Label>
                                    <Select value={data.card_type_id} onValueChange={(value) => setData('card_type_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tipo de carta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cardTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.card_type_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rarity_id">Rareza *</Label>
                                    <Select value={data.rarity_id} onValueChange={(value) => setData('rarity_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Rareza" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rarities.map((rarity) => (
                                                <SelectItem key={rarity.id} value={rarity.id.toString()}>
                                                    {rarity.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.rarity_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alignment_id">Alineación *</Label>
                                    <Select value={data.alignment_id} onValueChange={(value) => setData('alignment_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Alineación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {alignments.map((alignment) => (
                                                <SelectItem key={alignment.id} value={alignment.id.toString()}>
                                                    {alignment.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.alignment_id} />
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
                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
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

                                <div className="space-y-2">
                                    <Label htmlFor="defense">🛡️ Defensa</Label>
                                    <Input
                                        id="defense"
                                        type="number"
                                        value={data.defense}
                                        onChange={(e) => setData('defense', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.defense} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="magic_defense">🔮 Def. Mágica</Label>
                                    <Input
                                        id="magic_defense"
                                        type="number"
                                        value={data.magic_defense}
                                        onChange={(e) => setData('magic_defense', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.magic_defense} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="health">❤️ Puntos de Vida</Label>
                                    <Input
                                        id="health"
                                        type="number"
                                        value={data.health}
                                        onChange={(e) => setData('health', e.target.value)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.health} />
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
                                    <Label htmlFor="archetype_id">Arquetipo</Label>
                                    <Select value={data.archetype_id} onValueChange={(value) => setData('archetype_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Ninguno</SelectItem>
                                            {archetypes.map((archetype) => (
                                                <SelectItem key={archetype.id} value={archetype.id.toString()}>
                                                    {archetype.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.archetype_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="faction_id">Facción</Label>
                                    <Select value={data.faction_id} onValueChange={(value) => setData('faction_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Ninguna</SelectItem>
                                            {factions.map((faction) => (
                                                <SelectItem key={faction.id} value={faction.id.toString()}>
                                                    {faction.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.faction_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edition_id">Edición</Label>
                                    <Select value={data.edition_id} onValueChange={(value) => setData('edition_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Ninguna</SelectItem>
                                            {editions.map((edition) => (
                                                <SelectItem key={edition.id} value={edition.id.toString()}>
                                                    {edition.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.edition_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="artist_id">Artista</Label>
                                    <Select value={data.artist_id} onValueChange={(value) => setData('artist_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ninguno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Ninguno</SelectItem>
                                            {artists.map((artist) => (
                                                <SelectItem key={artist.id} value={artist.id.toString()}>
                                                    {artist.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.artist_id} />
                                </div>
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
