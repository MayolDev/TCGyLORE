import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ImageOverlay } from 'react-leaflet';
import L, { CRS } from 'leaflet';
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

// Tipos de ubicaciones con sus iconos personalizados épicos
export const LOCATION_TYPES = {
    castle: { label: 'Castillo', icon: '🏰', color: '#8B4513' },
    city: { label: 'Ciudad', icon: '🏛️', color: '#4A90E2' },
    village: { label: 'Aldea', icon: '🏠', color: '#7CB342' },
    forest: { label: 'Bosque', icon: '🌲', color: '#2E7D32' },
    mountain: { label: 'Montaña', icon: '⛰️', color: '#5D4037' },
    dungeon: { label: 'Mazmorra', icon: '⚔️', color: '#212121' },
    ruins: { label: 'Ruinas', icon: '🗿', color: '#9E9E9E' },
    battlefield: { label: 'Campo de Batalla', icon: '💀', color: '#D32F2F' },
    port: { label: 'Puerto', icon: '⚓', color: '#0277BD' },
    temple: { label: 'Templo', icon: '⛪', color: '#F9A825' },
    cave: { label: 'Cueva', icon: '🕳️', color: '#424242' },
    tower: { label: 'Torre', icon: '🗼', color: '#6A1B9A' },
};

// Función para crear iconos personalizados épicos
export function createCustomIcon(type: keyof typeof LOCATION_TYPES = 'city', isCurrentLocation = false) {
    const locationConfig = LOCATION_TYPES[type] || LOCATION_TYPES.city;
    
    // Si es la ubicación actual (editando), hacer el marcador mucho más destacado
    const size = isCurrentLocation ? 80 : 56;
    const glowSize = isCurrentLocation ? 100 : 70;
    const ringSize = isCurrentLocation ? 90 : 60;
    const borderColor = isCurrentLocation ? '#FF0080' : '#FBBF24';
    const borderWidth = isCurrentLocation ? 8 : 5;
    const pulseIntensity = isCurrentLocation ? '1.0' : '0.7';
    
    const iconHtml = `
        <div class="relative animate-float" style="animation-duration: 3s;">
            <!-- Glow exterior pulsante -->
            <div class="absolute inset-0 rounded-full blur-2xl animate-pulse" style="
                background: ${isCurrentLocation ? '#FF0080' : locationConfig.color};
                width: ${glowSize}px;
                height: ${glowSize}px;
                left: ${-(glowSize - size) / 2}px;
                top: ${-(glowSize - size) / 2}px;
                opacity: ${pulseIntensity};
            "></div>
            
            ${isCurrentLocation ? `
            <!-- Anillo extra para ubicación actual -->
            <div class="absolute animate-ping" style="
                width: ${ringSize + 20}px;
                height: ${ringSize + 20}px;
                left: ${-(ringSize + 20 - size) / 2}px;
                top: ${-(ringSize + 20 - size) / 2}px;
                border: 4px solid #FF0080;
                border-radius: 50%;
                opacity: 0.6;
                animation-duration: 2s;
            "></div>
            ` : ''}
            
            <!-- Anillo mágico giratorio -->
            <div class="absolute animate-spin-slow" style="
                width: ${ringSize}px;
                height: ${ringSize}px;
                left: ${-(ringSize - size) / 2}px;
                top: ${-(ringSize - size) / 2}px;
                border: 3px solid ${isCurrentLocation ? '#FF0080' : locationConfig.color};
                border-radius: 50%;
                opacity: 0.4;
                animation-duration: 8s;
            "></div>
            
            <!-- Pin principal -->
            <div class="relative" style="
                background: linear-gradient(135deg, ${locationConfig.color} 0%, oklch(from ${locationConfig.color} calc(l * 0.6) c h) 100%);
                width: ${size}px;
                height: ${size}px;
                border-radius: 50% 50% 50% 0;
                border: ${borderWidth}px solid ${borderColor};
                box-shadow: 
                    0 0 30px rgba(251, 191, 36, 0.8),
                    0 0 60px ${locationConfig.color},
                    ${isCurrentLocation ? '0 0 80px rgba(255, 0, 128, 0.9),' : ''}
                    0 6px 20px rgba(0,0,0,0.9),
                    inset 0 2px 4px rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(-45deg);
                font-size: ${isCurrentLocation ? 44 : 32}px;
                z-index: ${isCurrentLocation ? 2000 : 1000};
                position: relative;
            ">
                <!-- Icono -->
                <span style="
                    transform: rotate(45deg);
                    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.6));
                    display: block;
                    animation: twinkle 2s ease-in-out infinite;
                ">${locationConfig.icon}</span>
            </div>
            
            ${isCurrentLocation ? `
            <!-- Etiqueta "TU UBICACIÓN" -->
            <div style="
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #FF0080 0%, #FF1493 100%);
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 900;
                white-space: nowrap;
                box-shadow: 0 0 20px rgba(255, 0, 128, 0.8);
                border: 2px solid #FFD700;
                z-index: 3000;
                animation: twinkle 1.5s ease-in-out infinite;
            ">
                ✨ EDITANDO ✨
            </div>
            ` : ''}
            
            <!-- Partículas mágicas -->
            <div class="absolute" style="
                width: 4px;
                height: 4px;
                background: #FBBF24;
                border-radius: 50%;
                top: 0;
                left: 10px;
                box-shadow: 0 0 10px #FBBF24;
                animation: twinkle 1.5s ease-in-out infinite;
            "></div>
            <div class="absolute" style="
                width: 3px;
                height: 3px;
                background: #FBBF24;
                border-radius: 50%;
                top: 15px;
                right: 5px;
                box-shadow: 0 0 8px #FBBF24;
                animation: twinkle 2s ease-in-out infinite 0.5s;
            "></div>
        </div>
    `;
    
    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker-location',
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
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
    currentLocationId?: number | null;
    currentLocationCoords?: { x: number; y: number; type: string } | null;
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
    zoom = 0, // Zoom más alejado para ver todo el mapa
    onLocationClick,
    onMapClick,
    height = '600px',
    allowClick = false,
    currentLocationId = null,
    currentLocationCoords = null,
}: MapViewProps) {
    // Calcular centro basado en ubicaciones si existen
    const calculatedCenter = (() => {
        if (!locations || locations.length === 0) {
            return center;
        }
        
        const validLocations = locations.filter(
            (loc) => loc.coordinate_x != null && loc.coordinate_y != null && 
                     !isNaN(Number(loc.coordinate_x)) && !isNaN(Number(loc.coordinate_y))
        );
        
        if (validLocations.length === 0) {
            return center;
        }
        
        // Si solo hay una ubicación, centrar en ella con zoom
        if (validLocations.length === 1) {
            return [Number(validLocations[0].coordinate_y), Number(validLocations[0].coordinate_x)] as [number, number];
        }
        
        const avgX = validLocations.reduce((sum, loc) => sum + Number(loc.coordinate_x || 0), 0) / validLocations.length;
        const avgY = validLocations.reduce((sum, loc) => sum + Number(loc.coordinate_y || 0), 0) / validLocations.length;
        
        return [avgY, avgX] as [number, number];
    })();

    // Dimensiones del mapa fantasy: 1536x754 píxeles
    const bounds: [[number, number], [number, number]] = [[0, 0], [754, 1536]];

    return (
        <div className="relative rounded-lg overflow-hidden border-4 border-amber-500/60 shadow-[0_0_40px_rgba(251,191,36,0.4)]" style={{ height }}>
            {/* Decoración de pergamino épico */}
            <div className="absolute inset-0 pointer-events-none z-[1000] opacity-30">
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-amber-900/80 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-amber-900/80 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-amber-900/80 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-amber-900/80 to-transparent" />
            </div>
            
            {/* Brújula decorativa épica */}
            <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-full p-4 border-4 border-yellow-500/50 shadow-[0_0_20px_rgba(251,191,36,0.6)]">
                <div className="text-3xl animate-spin text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" style={{ animationDuration: '20s' }}>
                    🧭
                </div>
            </div>
            
            <MapContainer
                center={calculatedCenter}
                zoom={zoom}
                style={{ height: '100%', width: '100%', background: '#0f172a' }}
                className="map-fantasy"
                crs={CRS.Simple}
                minZoom={-1}
                maxZoom={4}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                zoomSnap={0.25}
                zoomDelta={0.25}
            >
                {/* Mapa personalizado PNG */}
                <ImageOverlay
                    url="/images/map-aethermoor.png"
                    bounds={bounds}
                    opacity={1.0}
                />
                
                {/* Manejador de clicks */}
                {allowClick && onMapClick && <MapClickHandler onMapClick={onMapClick} />}
                
                {/* Marcadores de ubicaciones */}
                {locations.map((location) => {
                    if (location.coordinate_x == null || location.coordinate_y == null) {
                        return null;
                    }
                    
                    // Si es la ubicación actual y tenemos coordenadas temporales, no mostrar este marcador
                    const isCurrentLocation = currentLocationId !== null && location.id === currentLocationId;
                    if (isCurrentLocation && currentLocationCoords) {
                        return null;
                    }
                    
                    const type = (location.type || 'city') as keyof typeof LOCATION_TYPES;
                    const icon = createCustomIcon(type, isCurrentLocation);
                    const position: [number, number] = [
                        Number(location.coordinate_y), 
                        Number(location.coordinate_x)
                    ];
                    
                    return (
                        <Marker
                            key={location.id}
                            position={position}
                            icon={icon}
                            zIndexOffset={isCurrentLocation ? 1000 : 0}
                        >
                            <Popup className="custom-popup" maxWidth={320}>
                                <div className="p-4 min-w-[300px] bg-slate-900/95 rounded-lg border-2 border-purple-500/50">
                                    <h3 className="text-xl font-black mb-2 text-yellow-200 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
                                        <span className="text-3xl drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">{LOCATION_TYPES[type]?.icon}</span>
                                        {location.name}
                                    </h3>
                                    {location.world && (
                                        <p className="text-xs text-yellow-300/70 mb-3 flex items-center gap-1 font-semibold">
                                            <span>🌍</span> {location.world.name}
                                        </p>
                                    )}
                                    <div className="mb-3 p-2 bg-purple-900/30 rounded-md border border-purple-500/30">
                                        <p className="text-sm font-bold text-purple-300 mb-1 flex items-center gap-1">
                                            <span>📍</span> {LOCATION_TYPES[type]?.label || 'Ubicación'}
                                        </p>
                                        <p className="text-xs text-yellow-300/60 font-semibold">
                                            Coordenadas: ({position[1].toFixed(0)}, {position[0].toFixed(0)})
                                        </p>
                                    </div>
                                    {location.description && (
                                        <p className="text-sm text-yellow-100 mb-4 line-clamp-4 leading-relaxed">
                                            {location.description}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => onLocationClick && onLocationClick(location)}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white rounded-md hover:from-yellow-500 hover:to-red-500 transition-all font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/50"
                                        style={{ fontFamily: 'Cinzel, serif' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        EDITAR UBICACIÓN
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
                
                {/* Marcador temporal para la ubicación actual que se está editando */}
                {currentLocationCoords && (
                    <Marker
                        key="current-editing"
                        position={[currentLocationCoords.y, currentLocationCoords.x]}
                        icon={createCustomIcon(currentLocationCoords.type as keyof typeof LOCATION_TYPES, true)}
                        zIndexOffset={1000}
                    >
                        <Popup className="custom-popup" maxWidth={320}>
                            <div className="p-4 min-w-[300px] bg-slate-900/95 rounded-lg border-4 border-pink-500/70">
                                <h3 className="text-xl font-black mb-2 text-pink-200 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
                                    <span className="text-3xl">✨</span>
                                    EDITANDO UBICACIÓN
                                </h3>
                                <p className="text-sm text-pink-100 mb-2">
                                    Coordenadas actuales: ({currentLocationCoords.x.toFixed(0)}, {currentLocationCoords.y.toFixed(0)})
                                </p>
                                <p className="text-xs text-yellow-300/70 font-semibold">
                                    💾 Guarda los cambios para confirmar la nueva posición
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
            
            <style>{`
                .custom-marker-location {
                    background: transparent !important;
                    border: none !important;
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    padding: 0 !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                .leaflet-popup-tip {
                    background: rgb(15 23 42 / 0.95) !important;
                    border: 2px solid rgb(168 85 247 / 0.5) !important;
                }
            `}</style>
        </div>
    );
}

