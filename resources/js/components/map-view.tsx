import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ImageOverlay } from 'react-leaflet';
import L, { CRS } from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * SISTEMA DE COORDENADAS FANTASY MAP
 * 
 * Este mapa usa CRS.Simple (coordenadas cartesianas simples) en lugar del sistema
 * geográfico lat/long. Las coordenadas van de 0 a 100 en ambos ejes.
 * 
 * IMPORTANTE: 
 * - coordinate_x = Eje horizontal (oeste-este) → 0 (izquierda) a 100 (derecha)
 * - coordinate_y = Eje vertical (norte-sur) → 0 (arriba) a 100 (abajo)
 * - Leaflet usa formato [Y, X] (al revés de lo normal)
 * 
 * Para agregar un mapa personalizado:
 * 1. Coloca tu imagen en /public/images/map-aethermoor.png (o .jpg)
 * 2. Descomenta el <ImageOverlay> más abajo
 * 3. Ajusta las dimensiones según tu imagen
 */

// Tipos de ubicaciones con sus iconos personalizados
export const LOCATION_TYPES = {
    castle: { label: 'Castillo', icon: '🏰', color: '#8B4513' },
    city: { label: 'Ciudad', icon: '🏛️', color: '#4A90E2' },
    village: { label: 'Aldea', icon: '🏘️', color: '#7CB342' },
    forest: { label: 'Bosque', icon: '🌲', color: '#2E7D32' },
    mountain: { label: 'Montaña', icon: '⛰️', color: '#5D4037' },
    dungeon: { label: 'Mazmorra', icon: '🕳️', color: '#212121' },
    ruins: { label: 'Ruinas', icon: '🏛️', color: '#9E9E9E' },
    battlefield: { label: 'Campo de Batalla', icon: '⚔️', color: '#D32F2F' },
    port: { label: 'Puerto', icon: '⚓', color: '#0277BD' },
    temple: { label: 'Templo', icon: '⛩️', color: '#F9A825' },
    cave: { label: 'Cueva', icon: '🗻', color: '#424242' },
    tower: { label: 'Torre', icon: '🗼', color: '#6A1B9A' },
};

// Función para crear iconos personalizados
export function createCustomIcon(type: keyof typeof LOCATION_TYPES = 'city') {
    const locationConfig = LOCATION_TYPES[type] || LOCATION_TYPES.city;
    
    const iconHtml = `
        <div style="
            background: ${locationConfig.color};
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            border: 4px solid #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-45deg);
            font-size: 24px;
            z-index: 1000;
            position: relative;
        ">
            <span style="transform: rotate(45deg); filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">${locationConfig.icon}</span>
        </div>
    `;
    
    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker-location',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
}

interface Location {
    id: number;
    name: string;
    description?: string;
    type?: string;
    coordinate_x?: number | null;
    coordinate_y?: number | null;
    world?: {
        name: string;
    };
}

interface MapViewProps {
    locations: Location[];
    center?: [number, number];
    zoom?: number;
    onLocationClick?: (location: Location) => void;
    onMapClick?: (lat: number, lng: number) => void;
    height?: string;
    allowClick?: boolean;
}

// Componente para capturar clicks en el mapa
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

export default function MapView({
    locations,
    center = [377, 768], // Centro de la imagen (754/2, 1536/2)
    zoom = 1, // Zoom bajo para ver toda la imagen
    onLocationClick,
    onMapClick,
    height = '600px',
    allowClick = false,
}: MapViewProps) {
    // Debug: verificar qué datos llegan
    console.log('MapView - locations:', locations);
    
    // Calcular centro basado en ubicaciones si existen
    const calculatedCenter = (() => {
        // Si no hay ubicaciones, usar centro por defecto
        if (!locations || locations.length === 0) {
            console.log('MapView - No locations, using default center:', center);
            return center;
        }
        
        const validLocations = locations.filter(
            (loc) => loc.coordinate_x != null && loc.coordinate_y != null && 
                     !isNaN(Number(loc.coordinate_x)) && !isNaN(Number(loc.coordinate_y))
        );
        
        console.log('MapView - Valid locations with coords:', validLocations.length);
        
        if (validLocations.length === 0) {
            console.log('MapView - No valid coords, using default center:', center);
            return center;
        }
        
        const avgX = validLocations.reduce((sum, loc) => sum + Number(loc.coordinate_x || 0), 0) / validLocations.length;
        const avgY = validLocations.reduce((sum, loc) => sum + Number(loc.coordinate_y || 0), 0) / validLocations.length;
        
        const calculatedCenter = [avgY, avgX] as [number, number]; // [Y, X] para Leaflet
        console.log('MapView - Calculated center:', calculatedCenter);
        
        return calculatedCenter;
    })();

    // Dimensiones del mapa fantasy
    // Imagen real: 1536x754 píxeles
    // En CRS.Simple, usamos las dimensiones de la imagen directamente
    // Formato: [[minY, minX], [maxY, maxX]]
    const bounds: [[number, number], [number, number]] = [[0, 0], [754, 1536]];

    return (
        <div className="relative rounded-lg overflow-hidden border-4 border-amber-900/40 shadow-2xl" style={{ height }}>
            {/* Decoración de pergamino */}
            <div className="absolute inset-0 pointer-events-none z-[1000] opacity-20">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-amber-900/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-amber-900/60 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-amber-900/60 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-amber-900/60 to-transparent" />
            </div>
            
            {/* Brújula decorativa */}
            <div className="absolute top-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-full p-3 border-2 border-amber-900/40 shadow-lg">
                <div className="text-2xl animate-spin" style={{ animationDuration: '20s' }}>
                    🧭
                </div>
            </div>
            
            <MapContainer
                center={calculatedCenter}
                zoom={zoom}
                style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
                className="map-fantasy"
                crs={CRS.Simple} // Usar sistema de coordenadas simple (no geográfico)
                minZoom={2}  // Evita alejarse demasiado y ver espacios vacíos
                maxZoom={10}  // Aumentado para permitir mucho más zoom
                maxBounds={bounds}  // Límites estrictos del mapa
                maxBoundsViscosity={1.0}  // Bloqueo total: no puedes salir del área
                zoomSnap={0.5}  // Suaviza el zoom
                zoomDelta={0.5}  // Incrementos de zoom más suaves
            >
                {/* TU MAPA PERSONALIZADO PNG (ACTUAL) */}
                <ImageOverlay
                    url="/images/map-aethermoor.png"
                    bounds={bounds}
                    opacity={1.0}
                />
                
                {/* OPCIÓN 2: SVG de Azgaar (COMENTADO) */}
                {/* 
                <ImageOverlay
                    url="/images/map-aethermoor.svg"
                    bounds={bounds}
                    opacity={1.0}
                />
                */}
                
                {/* OPCIÓN 3: Placeholder SVG medieval (COMENTADO) */}
                {/* 
                <ImageOverlay
                    url="/images/map-placeholder.svg"
                    bounds={bounds}
                    opacity={1.0}
                />
                */}
                
                {/* Manejador de clicks si está habilitado */}
                {allowClick && onMapClick && <MapClickHandler onMapClick={onMapClick} />}
                
                {/* Marcadores de ubicaciones */}
                {locations.map((location) => {
                    console.log(`🔍 Location ${location.name}:`, {
                        x: location.coordinate_x,
                        y: location.coordinate_y,
                        type: location.type
                    });
                    
                    if (location.coordinate_x == null || location.coordinate_y == null) {
                        console.log('❌ MapView - Ubicación sin coordenadas:', location.name);
                        return null;
                    }
                    
                    const type = (location.type || 'city') as keyof typeof LOCATION_TYPES;
                    const icon = createCustomIcon(type);
                    
                    // Coordenadas invertidas: [Y, X] para Leaflet
                    const position: [number, number] = [
                        Number(location.coordinate_y), 
                        Number(location.coordinate_x)
                    ];
                    
                    console.log(`✅ MapView - Marcador: ${location.name} en posición [Y:${position[0]}, X:${position[1]}] tipo: ${type}`);
                    
                    return (
                        <Marker
                            key={location.id}
                            position={position}
                            icon={icon}
                        >
                            <Popup className="custom-popup" maxWidth={300}>
                                <div className="p-3 min-w-[280px]">
                                    <h3 className="text-xl font-heading font-bold mb-2 text-foreground flex items-center gap-2">
                                        <span className="text-2xl">{LOCATION_TYPES[type]?.icon}</span>
                                        {location.name}
                                    </h3>
                                    {location.world && (
                                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                            <span>🌍</span> {location.world.name}
                                        </p>
                                    )}
                                    <div className="mb-3 p-2 bg-muted/30 rounded-md">
                                        <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                            <span>📍</span> {LOCATION_TYPES[type]?.label || 'Ubicación'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Coordenadas: ({position[1].toFixed(0)}, {position[0].toFixed(0)})
                                        </p>
                                    </div>
                                    {location.description && (
                                        <p className="text-sm text-foreground mb-4 line-clamp-4 leading-relaxed">
                                            {location.description}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => onLocationClick && onLocationClick(location)}
                                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Editar Ubicación
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

