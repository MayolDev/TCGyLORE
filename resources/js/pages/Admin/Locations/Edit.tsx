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
import { MapPin, Save, X } from 'lucide-react';
import MapView, { LOCATION_TYPES } from '@/components/map-view';
import ImageUpload from '@/components/image-upload';
import React, { useMemo, useState, useEffect } from 'react';

interface World {
    id: number;
    name: string;
}

interface LocationData {
    id: number;
    name: string;
    description?: string;
    type: string;
    coordinate_x: number;
    coordinate_y: number;
}

interface Location {
    id: number;
    world_id: number;
    name: string;
    description: string | null;
    coordinate_x: number | null;
    coordinate_y: number | null;
    location_type: string;
    image: string | null;
}

interface Props {
    location: Location;
    worlds: World[];
    // allLocations removed, fetched async
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ubicaciones', href: '/admin/locations' },
    { title: 'Editar' },
];

export default function Edit({ location, worlds }: Props) {
    const [mapLocations, setMapLocations] = useState<LocationData[]>([]);

    useEffect(() => {
        fetch('/admin/locations/map-data')
            .then(res => res.json())
            .then(data => setMapLocations(data))
            .catch(err => console.error('Error fetching map data:', err));
    }, []);

    const { data, setData, post, processing, errors } = useForm<{
        world_id: string;
        name: string;
        description: string;
        coordinate_x: string;
        coordinate_y: string;
        image: File | null;
        location_type: string;
        _method: string;
    }>({
        world_id: location.world_id.toString(),
        name: location.name || '',
        description: location.description || '',
        coordinate_x: location.coordinate_x?.toString() || '',
        coordinate_y: location.coordinate_y?.toString() || '',
        image: null,
        location_type: location.location_type || 'city',
        _method: 'PUT',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/locations/${location.id}`, {
            forceFormData: true,
        });
    };

    const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;
    const charCount = data.description.length;

    // Coordenadas actuales para el marcador temporal (solo cuando hay cambios)
    const currentCoords = useMemo(() => {
        if (data.coordinate_x && data.coordinate_y) {
            return {
                x: parseFloat(data.coordinate_x),
                y: parseFloat(data.coordinate_y),
                type: data.location_type,
            };
        }
        return null;
    }, [data.coordinate_x, data.coordinate_y, data.location_type]);

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
                                <Label htmlFor="image">Imagen de la Ubicación (opcional)</Label>
                                <ImageUpload
                                    value={data.image}
                                    onChange={(file) => setData('image', file)}
                                    existingImage={location.image ? `/storage/${location.image}` : undefined}
                                    error={errors.image}
                                />
                                <p className="text-xs text-yellow-300/60 font-semibold">
                                    📸 Sube una imagen para visualizar esta ubicación (máx. 2MB)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location_type">Tipo de Ubicación *</Label>
                                <Select value={data.location_type} onValueChange={(value) => setData('location_type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(LOCATION_TYPES).map(([key, config]) => (
                                            <SelectItem key={key} value={key}>
                                                <span className="flex items-center gap-2">
                                                    <span>{config.icon}</span>
                                                    <span>{config.label}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.location_type} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="coordinate_x">Coordenada X (0-1536)</Label>
                                    <Input
                                        id="coordinate_x"
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="1536"
                                        value={data.coordinate_x}
                                        onChange={(e) => setData('coordinate_x', e.target.value)}
                                        placeholder="Horizontal: 0 (izquierda) a 1536 (derecha)"
                                    />
                                    <InputError message={errors.coordinate_x} />
                                    <p className="text-xs text-yellow-300/60 font-semibold">
                                        💡 Haz clic en el mapa para seleccionar
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coordinate_y">Coordenada Y (0-754)</Label>
                                    <Input
                                        id="coordinate_y"
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="754"
                                        value={data.coordinate_y}
                                        onChange={(e) => setData('coordinate_y', e.target.value)}
                                        placeholder="Vertical: 0 (arriba) a 754 (abajo)"
                                    />
                                    <InputError message={errors.coordinate_y} />
                                    <p className="text-xs text-yellow-300/60 font-semibold">
                                        💡 Haz clic en el mapa para seleccionar
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🗺️ Mapa del Mundo</CardTitle>
                            <CardDescription>
                                Haz clic en el mapa para colocar tu ubicación
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MapView
                                locations={mapLocations}
                                center={data.coordinate_x && data.coordinate_y ? [parseFloat(data.coordinate_y), parseFloat(data.coordinate_x)] : undefined}
                                zoom={data.coordinate_x && data.coordinate_y ? 1 : 0}
                                allowClick={true}
                                currentLocationId={location.id}
                                currentLocationCoords={currentCoords}
                                onMapClick={(y, x) => {
                                    setData({
                                        ...data,
                                        coordinate_x: Math.round(x).toString(),
                                        coordinate_y: Math.round(y).toString(),
                                    });
                                }}
                                height="500px"
                            />
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
