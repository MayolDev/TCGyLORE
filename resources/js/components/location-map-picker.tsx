import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface LocationMapPickerProps {
    latitude: number | null;
    longitude: number | null;
    onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationMapPicker({
    latitude,
    longitude,
    onLocationChange,
}: LocationMapPickerProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Inicializar el mapa
        const map = L.map(mapContainerRef.current).setView(
            [latitude || 40.4168, longitude || -3.7038], // Madrid por defecto
            latitude && longitude ? 13 : 6
        );

        // Añadir capa de tiles (mapa base) con estilo oscuro épico
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '©OpenStreetMap, ©CartoDB',
            maxZoom: 19,
        }).addTo(map);

        // Añadir marcador si hay coordenadas
        if (latitude && longitude) {
            const customIcon = L.divIcon({
                className: 'custom-marker-icon',
                html: `
                    <div class="relative">
                        <div class="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                        <div class="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-yellow-400 shadow-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });

            markerRef.current = L.marker([latitude, longitude], { 
                icon: customIcon,
                draggable: true 
            }).addTo(map);

            // Evento al arrastrar el marcador
            markerRef.current.on('dragend', (e) => {
                const position = e.target.getLatLng();
                onLocationChange(position.lat, position.lng);
            });
        }

        // Click en el mapa para colocar/mover el marcador
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            
            const customIcon = L.divIcon({
                className: 'custom-marker-icon',
                html: `
                    <div class="relative">
                        <div class="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                        <div class="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-yellow-400 shadow-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng], { 
                    icon: customIcon,
                    draggable: true 
                }).addTo(map);

                markerRef.current.on('dragend', (e) => {
                    const position = e.target.getLatLng();
                    onLocationChange(position.lat, position.lng);
                });
            }

            onLocationChange(lat, lng);
        });

        mapRef.current = map;

        // Cleanup
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Actualizar posición del marcador cuando cambien las props
    useEffect(() => {
        if (mapRef.current && latitude && longitude) {
            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
                mapRef.current.setView([latitude, longitude], 13);
            }
        }
    }, [latitude, longitude]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <div
                    ref={mapContainerRef}
                    className="h-[400px] w-full rounded-lg border-4 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden"
                    style={{ zIndex: 0 }}
                />
                <div className="absolute top-4 left-4 bg-slate-900/90 border-2 border-purple-500/50 rounded-lg px-4 py-2 z-[1000] backdrop-blur-sm">
                    <p className="text-sm text-yellow-200 font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
                        🗺️ Haz clic en el mapa para seleccionar una ubicación
                    </p>
                </div>
            </div>
            <style>{`
                .leaflet-container {
                    background: #0f172a !important;
                }
                .custom-marker-icon {
                    background: transparent !important;
                    border: none !important;
                }
                .leaflet-popup-content-wrapper {
                    background: rgb(15 23 42 / 0.95) !important;
                    border: 2px solid rgb(168 85 247 / 0.5) !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4) !important;
                }
                .leaflet-popup-content {
                    color: rgb(254 240 138) !important;
                    font-family: 'Cinzel', serif !important;
                }
                .leaflet-popup-tip {
                    background: rgb(15 23 42 / 0.95) !important;
                }
            `}</style>
        </div>
    );
}

