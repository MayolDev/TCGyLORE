import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvents, ImageOverlay } from 'react-leaflet';
import L, { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { stripMarkdown } from '@/lib/utils';

const DefaultIcon = L.icon({
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
 * geográfico lat/long.
 *
 * IMPORTANTE:
 * - coordinate_x = Eje horizontal (oeste-este) → 0 (izquierda) a 1536 (derecha)
 * - coordinate_y = Eje vertical → 0 a 754
 * - Leaflet usa formato [Y, X] (al revés de lo normal)
 *
 * La imagen servida es /images/map-aethermoor.webp (3072×1519, ~200 KB). El
 * original de 11 935×5 900 px y 16 MB vive en resources/art/ y NO debe volver a
 * public/: era el 90 % del peso de la página y el navegador lo reescalaba en
 * cada zoom.
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

/**
 * Iconos de marcador. El pin va CLAVADO: nada de animaciones que muevan el
 * conjunto (el antiguo animate-float despegaba la punta de su coordenada, que
 * en un editor de posiciones es mentir). El que se está editando sí grita.
 */
export function createCustomIcon(type: keyof typeof LOCATION_TYPES = 'city', isCurrentLocation = false) {
    const locationConfig = LOCATION_TYPES[type] || LOCATION_TYPES.city;

    const size = isCurrentLocation ? 56 : 40;
    const borderColor = isCurrentLocation ? '#FF0080' : '#FBBF24';
    const borderWidth = isCurrentLocation ? 4 : 3;

    const iconHtml = `
        <div class="relative">
            ${isCurrentLocation ? `
            <!-- Anillo de "estás editando esto" -->
            <div class="absolute animate-ping" style="
                width: ${size + 24}px;
                height: ${size + 24}px;
                left: ${-12}px;
                top: ${-12}px;
                border: 3px solid #FF0080;
                border-radius: 50%;
                opacity: 0.5;
                animation-duration: 2s;
            "></div>
            ` : ''}

            <!-- Pin -->
            <div style="
                background: linear-gradient(135deg, ${locationConfig.color} 0%, oklch(from ${locationConfig.color} calc(l * 0.6) c h) 100%);
                width: ${size}px;
                height: ${size}px;
                border-radius: 50% 50% 50% 0;
                border: ${borderWidth}px solid ${borderColor};
                box-shadow:
                    0 0 12px ${locationConfig.color}66,
                    ${isCurrentLocation ? '0 0 30px rgba(255, 0, 128, 0.8),' : ''}
                    0 4px 12px rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(-45deg);
                font-size: ${isCurrentLocation ? 28 : 20}px;
            ">
                <span style="
                    transform: rotate(45deg);
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
                    display: block;
                ">${locationConfig.icon}</span>
            </div>

            ${isCurrentLocation ? `
            <div style="
                position: absolute;
                bottom: -26px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #FF0080 0%, #FF1493 100%);
                color: white;
                padding: 3px 10px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 900;
                white-space: nowrap;
                box-shadow: 0 0 14px rgba(255, 0, 128, 0.7);
                border: 2px solid #FFD700;
            ">
                ✨ EDITANDO ✨
            </div>
            ` : ''}
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
    /** Si se pasa, el mapa abre centrado aquí. Si no, encuadra el mundo entero. */
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

// Guarda la instancia del mapa y, si no hay centro explícito, encuadra el mundo
// entero al abrir en lugar de aparecer a medio zoom en un punto arbitrario.
function MapSetup({
    mapRef,
    fitWorld,
    bounds,
}: {
    mapRef: React.MutableRefObject<L.Map | null>;
    fitWorld: boolean;
    bounds: L.LatLngBoundsExpression;
}) {
    const map = useMap();
    useEffect(() => {
        mapRef.current = map;
        if (fitWorld) {
            map.fitBounds(bounds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);
    return null;
}

export default function MapView({
    locations,
    center,
    zoom = 1,
    onLocationClick,
    onMapClick,
    height = '600px',
    allowClick = false,
    currentLocationId = null,
    currentLocationCoords = null,
}: MapViewProps) {
    // La rueda del ratón NO hace zoom hasta que se hace clic en el mapa: un mapa
    // de 700 px dentro de una página con scroll secuestraba la rueda al pasar por
    // encima. Al sacar el cursor, se devuelve.
    const mapRef = useRef<L.Map | null>(null);
    const [wheelOn, setWheelOn] = useState(false);

    const enableWheel = () => {
        if (!wheelOn) {
            mapRef.current?.scrollWheelZoom.enable();
            setWheelOn(true);
        }
    };
    const disableWheel = () => {
        if (wheelOn) {
            mapRef.current?.scrollWheelZoom.disable();
            setWheelOn(false);
        }
    };

    // Dimensiones lógicas del mapa fantasy (independientes de los píxeles de la imagen)
    const bounds: [[number, number], [number, number]] = [[0, 0], [754, 1536]];

    // Leyenda: solo los tipos que están de verdad en el mapa
    const typesPresent = Array.from(
        new Set(
            locations
                .filter((l) => l.coordinate_x != null && l.coordinate_y != null)
                .map((l) => (l.type && l.type in LOCATION_TYPES ? l.type : 'city')),
        ),
    ) as (keyof typeof LOCATION_TYPES)[];

    return (
        <div
            className="relative rounded-lg overflow-hidden border-4 border-amber-500/60 shadow-[0_0_40px_rgba(251,191,36,0.4)]"
            style={{ height }}
            onClickCapture={enableWheel}
            onMouseLeave={disableWheel}
        >
            {/* Decoración de pergamino épico */}
            <div className="absolute inset-0 pointer-events-none z-[1000] opacity-30">
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-amber-900/80 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-amber-900/80 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-amber-900/80 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-amber-900/80 to-transparent" />
            </div>

            {/* Brújula (quieta: una brújula que gira no orienta a nadie) */}
            <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-full p-2.5 border-2 border-yellow-500/50 shadow-[0_0_14px_rgba(251,191,36,0.5)]">
                <div className="text-2xl text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🧭</div>
            </div>

            {/* Aviso de rueda: desaparece al primer clic */}
            {!wheelOn && (
                <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none bg-slate-900/85 backdrop-blur-sm rounded-md px-3 py-1.5 border border-yellow-500/40">
                    <p className="text-xs text-yellow-200/90 font-semibold">🖱️ Haz clic en el mapa para activar el zoom con la rueda</p>
                </div>
            )}

            {/* Leyenda de tipos presentes */}
            {typesPresent.length > 1 && (
                <div className="absolute bottom-3 right-3 z-[1000] pointer-events-none bg-slate-900/85 backdrop-blur-sm rounded-md px-2.5 py-1.5 border border-yellow-500/40 max-w-[45%]">
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {typesPresent.map((t) => (
                            <span key={t} className="text-[11px] text-yellow-200/90 font-semibold whitespace-nowrap">
                                {LOCATION_TYPES[t].icon} {LOCATION_TYPES[t].label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <MapContainer
                center={center ?? [377, 768]}
                zoom={center ? zoom : 0}
                scrollWheelZoom={false}
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
                <MapSetup mapRef={mapRef} fitWorld={!center} bounds={bounds} />

                {/* Mapa del mundo: webp de ~200 KB, no el PNG de 16 MB */}
                <ImageOverlay url="/images/map-aethermoor.webp" bounds={bounds} opacity={1.0} />

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
                    const position: [number, number] = [Number(location.coordinate_y), Number(location.coordinate_x)];

                    return (
                        <Marker key={location.id} position={position} icon={icon} zIndexOffset={isCurrentLocation ? 1000 : 0}>
                            <Popup className="custom-popup" maxWidth={320}>
                                <div className="p-4 min-w-[280px] bg-slate-900/95 rounded-lg border-2 border-purple-500/50">
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
                                            {stripMarkdown(location.description)}
                                        </p>
                                    )}
                                    {onLocationClick && (
                                        <button
                                            onClick={() => onLocationClick(location)}
                                            className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white rounded-md hover:from-yellow-500 hover:to-red-500 transition-all font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/50"
                                            style={{ fontFamily: 'Cinzel, serif' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            EDITAR UBICACIÓN
                                        </button>
                                    )}
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
                            <div className="p-4 min-w-[280px] bg-slate-900/95 rounded-lg border-4 border-pink-500/70">
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
