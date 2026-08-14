import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type * as Leaflet from 'leaflet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw, Minus, Plus, Eye, AlertCircle, X, MapPin, Radius } from 'lucide-react';

interface MapPickerProps {
    lat: number;
    lng: number;
    radius: number;
    onChangeLocation: (lat: number, lng: number) => void;
    onChangeRadius: (radius: number) => void;
}

// Dark theme tile layer
const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const darkAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function MapPicker({
    lat,
    lng,
    radius,
    onChangeLocation,
    onChangeRadius,
}: MapPickerProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Leaflet.Map | null>(null);
    const marker = useRef<Leaflet.Marker | null>(null);
    const circle = useRef<Leaflet.Circle | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [zoom, setZoom] = useState(13);
    const [userLat, setUserLat] = useState(lat);
    const [userLng, setUserLng] = useState(lng);
    const [geolocationError, setGeolocationError] = useState<string | null>(null);
    const [syncedLat, setSyncedLat] = useState(lat);
    const [syncedLng, setSyncedLng] = useState(lng);
    const isDraggingMarker = useRef(false);

    // Get user's current location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLat(latitude);
                    setUserLng(longitude);
                    // Update parent if initial values are default
                    if (lat === -6.2088 && lng === 106.8456) {
                        onChangeLocation(latitude, longitude);
                    }
                },
                (error) => {
                    console.log('Geolocation error:', error);
                    setGeolocationError('Lokasi ditolak. Mohon izinkan penggunaan lokasi untuk pengalaman terbaik.');
                    // Keep default values if geolocation fails
                }
            );
        }
    }, []);

    // Initialize map
    useEffect(() => {

        if (!mapContainer.current || map.current) return;

        let cancelled = false;

        const initMap = async () => {
            const L = (await import('leaflet')).default;

            if (cancelled || !mapContainer.current || map.current) {
                return;
            }

            map.current = L.map(mapContainer.current, {
                preferCanvas: true,
                zoomControl: false,
            }).setView([userLat, userLng], 13);

            L.tileLayer(darkTileUrl, {
                attribution: darkAttribution,
                maxZoom: 19,
            }).addTo(map.current);

            marker.current = L.marker([userLat, userLng], {
                draggable: true,
            })
                .addTo(map.current)
                .bindPopup('Drag to change location')
                .on('drag', () => {
                    if (marker.current && circle.current) {
                        const pos = marker.current.getLatLng();

                        circle.current.setLatLng(pos);

                        onChangeLocation(pos.lat, pos.lng);
                    }
                });

            circle.current = L.circle([userLat, userLng], {
                color: '#ffffff',
                fillColor: '#ffffff',
                fillOpacity: 0.08,
                radius,
                weight: 2,
                dashArray: '8 8',
                className: 'location-radius-circle',
            }).addTo(map.current);

            map.current.on('zoomend', () => {
                if (map.current) {
                    setZoom(map.current.getZoom());
                }
            });

            setIsMapReady(true);
        };

        initMap();
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Update marker and circle when props change
    useEffect(() => {
        if (isMapReady && marker.current && circle.current) {
            marker.current.setLatLng([lat, lng]);
            circle.current.setLatLng([lat, lng]);
            circle.current.setRadius(radius);
            // Auto-center map when location is synced
            if (map.current && (lat !== syncedLat || lng !== syncedLng)) {
                map.current.setView([lat, lng], zoom);
                setSyncedLat(lat);
                setSyncedLng(lng);
            }
        }
    }, [lat, lng, radius, isMapReady, syncedLat, syncedLng, zoom]);

    const handleCenterMap = () => {
        if (map.current) {
            map.current.setView([lat, lng], zoom);
        }
    };

    const handleResetLocation = () => {
        onChangeLocation(userLat, userLng);
        onChangeRadius(100);
        if (map.current) {
            map.current.setView([userLat, userLng], 13);
        }
    };

    const handleZoomIn = () => {
        if (map.current) {
            map.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (map.current) {
            map.current.zoomOut();
        }
    };

    const handleIncreaseRadius = () => {
        const newRadius = Math.min(radius + 100, 10000);
        onChangeRadius(newRadius);
    };

    const handleDecreaseRadius = () => {
        const newRadius = Math.max(radius - 100, 10);
        onChangeRadius(newRadius);
    };

    return (
        <div className="space-y-4">
            {/* Geolocation Error Alert */}
            {geolocationError && (
                <div className="rounded-lg border border-red-500/50 bg-red-50/10 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm text-red-600 font-medium">{geolocationError}</p>
                        <p className="text-xs text-red-500/70 mt-1">Menggunakan lokasi default Jakarta. Anda masih bisa menyesuaikan lokasi secara manual.</p>
                    </div>
                    <button
                        onClick={() => setGeolocationError(null)}
                        className="text-red-500 hover:text-red-600 flex-shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Map Container */}
            <div className="relative rounded-lg border border-border overflow-hidden bg-black">
                <div
                    ref={mapContainer}
                    className="w-full h-80 rounded-lg"
                    style={{ zIndex: 1 }}
                />

                {/* Custom Controls Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-lg bg-sidebar/90 hover:bg-sidebar border-border"
                        onClick={handleCenterMap}
                        title="Center on marker"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-lg bg-sidebar/90 hover:bg-sidebar border-border"
                        onClick={handleZoomIn}
                        title="Zoom in"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-lg bg-sidebar/90 hover:bg-sidebar border-border"
                        onClick={handleZoomOut}
                        title="Zoom out"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-lg bg-sidebar/90 hover:bg-sidebar border-border"
                        onClick={handleResetLocation}
                        title="Reset to default"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>

                {/* Coordinate Display */}
                <div className="absolute bottom-4 left-4 bg-sidebar/90 border border-border rounded-lg px-3 py-2 text-xs z-40">
                    <div className="text-muted-foreground">
                        Lat: <span className="text-foreground font-mono">{lat.toFixed(6)}</span>
                    </div>
                    <div className="text-muted-foreground">
                        Lng: <span className="text-foreground font-mono">{lng.toFixed(6)}</span>
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="lat-input">Latitude</Label>
                    <Input
                        id="lat-input"
                        type="number"
                        step="0.000001"
                        value={lat}
                        onChange={(e) => onChangeLocation(parseFloat(e.target.value), lng)}
                        className="rounded-lg"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lng-input">Longitude</Label>
                    <Input
                        id="lng-input"
                        type="number"
                        step="0.000001"
                        value={lng}
                        onChange={(e) => onChangeLocation(lat, parseFloat(e.target.value))}
                        className="rounded-lg"
                    />
                </div>
            </div>

            {/* Radius Controls */}
            <div className="grid gap-2">
                <Label htmlFor="radius-input">Radius: {radius}m</Label>
                <div className="flex gap-2 items-center">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleDecreaseRadius}
                        className="rounded-lg"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        id="radius-input"
                        type="range"
                        min="10"
                        max="10000"
                        step="10"
                        value={radius}
                        onChange={(e) => onChangeRadius(parseInt(e.target.value))}
                        className="rounded-lg cursor-pointer flex-1"
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleIncreaseRadius}
                        className="rounded-lg"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                    Drag slider or use +/- buttons to adjust radius (10m - 10km)
                </div>
            </div>
        </div>
    );
}
