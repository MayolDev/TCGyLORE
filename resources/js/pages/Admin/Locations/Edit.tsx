import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WriterLayout from '@/layouts/writer-layout';
import MapView from '@/components/map-view';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { MapPin, Save, X, Map } from 'lucide-react';
import { useState } from 'react';

interface World {
    id: number;
    name: string;
}

interface Location {
    id: number;
    world_id: number;
    name: string;
    description: string | null;
    type: string;
    location_type: string;
    coordinate_x: number | null;
    coordinate_y: number | null;
    image: string | null;
    world?: {
        id: number;
        name: string;
    };
}

interface Props {
    location: Location;
    worlds: World[];
    locations: Location[]; // Todas las ubicaciones para el mapa
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ubicaciones', href: '/admin/locations' },
    { title: 'Editar' },
];

export default function Edit({ location, worlds, locations }: Props) {
    const [showMap, setShowMap] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        world_id: location.world_id.toString(),
        name: location.name || '',
        description: location.description || '',
        type: location.type || 'city',
        location_type: location.location_type || '',
        coordinate_x: location.coordinate_x?.toString() || '',
        coordinate_y: location.coordinate_y?.toString() || '',
        image: location.image || '',
        is_discovered: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/locations/${location.id}`);
    };

    const handleMapClick = (lat: number, lng: number) => {
        // lat = Y, lng = X en nuestro sistema de coordenadas
        setData('coordinate_y', lat.toFixed(2));
        setData('coordinate_x', lng.toFixed(2));
        console.log('📍 Coordenadas establecidas:', { Y: lat.toFixed(2), X: lng.toFixed(2) });
    };

    const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;
    const charCount = data.description.length;

    return (
        <WriterLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${location.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                            <MapPin className="h-8 w-8 text-primary" />
                            Editar Ubicación
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Modifica los detalles de este lugar
                        </p>
                    </div>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/admin/locations">
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
                                Datos esenciales de la ubicación
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
                                    <Label htmlFor="name">Nombre de la Ubicación *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Lumendor, Bosque Oscuro..."
                                        className="text-lg"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">URL de Imagen (opcional)</Label>
                                <Input
                                    id="image"
                                    type="text"
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    placeholder="https://example.com/location.jpg"
                                />
                                <InputError message={errors.image} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coordinates Card with Interactive Map */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Map className="h-5 w-5" />
                                        Coordenadas en el Mapa
                                    </CardTitle>
                                    <CardDescription>
                                        Haz click en el mapa para establecer la ubicación
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant={showMap ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShowMap(!showMap)}
                                >
                                    {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="coordinate_x">Coordenada X</Label>
                                    <Input
                                        id="coordinate_x"
                                        type="number"
                                        step="any"
                                        value={data.coordinate_x}
                                        onChange={(e) => setData('coordinate_x', e.target.value)}
                                        placeholder="0-1536"
                                        className="font-mono"
                                    />
                                    <InputError message={errors.coordinate_x} />
                                    <p className="text-xs text-muted-foreground">
                                        Coordenada horizontal (0-1536 píxeles)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coordinate_y">Coordenada Y</Label>
                                    <Input
                                        id="coordinate_y"
                                        type="number"
                                        step="any"
                                        value={data.coordinate_y}
                                        onChange={(e) => setData('coordinate_y', e.target.value)}
                                        placeholder="0-754"
                                        className="font-mono"
                                    />
                                    <InputError message={errors.coordinate_y} />
                                    <p className="text-xs text-muted-foreground">
                                        Coordenada vertical (0-754 píxeles)
                                    </p>
                                </div>
                            </div>

                            {showMap && (
                                <div className="space-y-3">
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                        <p className="text-sm text-amber-900 dark:text-amber-100 font-medium flex items-center gap-2">
                                            <Map className="h-4 w-4" />
                                            Click en el mapa para establecer las coordenadas de esta ubicación
                                        </p>
                                    </div>
                                    <MapView
                                        locations={locations || []}
                                        onMapClick={handleMapClick}
                                        allowClick={true}
                                        height="500px"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Type Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle>Tipo de Ubicación</CardTitle>
                            <CardDescription>
                                Categoría de esta ubicación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo *</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="castle">🏰 Castillo</SelectItem>
                                            <SelectItem value="city">🏛️ Ciudad</SelectItem>
                                            <SelectItem value="village">🏘️ Aldea</SelectItem>
                                            <SelectItem value="forest">🌲 Bosque</SelectItem>
                                            <SelectItem value="mountain">⛰️ Montaña</SelectItem>
                                            <SelectItem value="dungeon">🕳️ Mazmorra</SelectItem>
                                            <SelectItem value="ruins">🏛️ Ruinas</SelectItem>
                                            <SelectItem value="battlefield">⚔️ Campo de Batalla</SelectItem>
                                            <SelectItem value="port">⚓ Puerto</SelectItem>
                                            <SelectItem value="temple">⛩️ Templo</SelectItem>
                                            <SelectItem value="cave">🗻 Cueva</SelectItem>
                                            <SelectItem value="tower">🗼 Torre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location_type">Tipo Descriptivo</Label>
                                    <Input
                                        id="location_type"
                                        type="text"
                                        value={data.location_type}
                                        onChange={(e) => setData('location_type', e.target.value)}
                                        placeholder="Ej: ciudad, bosque, montaña"
                                    />
                                    <InputError message={errors.location_type} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Card */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Descripción de la Ubicación</CardTitle>
                                    <CardDescription>
                                        Describe este lugar y su importancia
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
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe el lugar, su historia, características únicas..."
                                className="min-h-[300px] text-base leading-relaxed resize-y font-serif"
                            />
                            <InputError message={errors.description} />
                            <p className="text-xs text-muted-foreground mt-2">
                                💡 Tip: Incluye detalles sobre el ambiente, la arquitectura y qué hace especial a este lugar
                            </p>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-primary/20 bg-card/50">
                        <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                                <Button type="button" variant="outline" size="lg" asChild>
                                    <Link href="/admin/locations">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" size="lg" variant="magical" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Actualizar Ubicación'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </WriterLayout>
    );
}
