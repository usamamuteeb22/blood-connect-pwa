
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Donor } from '@/types/custom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MapLibreMapProps {
  donors: (Donor & { distance?: number })[];
  currentPosition: { lat: number; lng: number } | null;
  onDonorSelect: (donor: Donor) => void;
}

const MapLibreMap: React.FC<MapLibreMapProps> = ({ donors, currentPosition, onDonorSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      // Find center point - use first donor with coordinates or current position
      const donorsWithCoords = donors.filter(d => d.latitude && d.longitude);
      let center: [number, number] = [0, 0]; // Default center
      
      if (currentPosition) {
        center = [currentPosition.lng, currentPosition.lat];
      } else if (donorsWithCoords.length > 0) {
        center = [donorsWithCoords[0].longitude!, donorsWithCoords[0].latitude!];
      }

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: center,
        zoom: 5
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);
      });

      map.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map. Please try again.');
      });

      mapRef.current = map;

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Add markers when map is loaded and donors change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add current position marker if available
    if (currentPosition) {
      const userMarker = new maplibregl.Marker({
        color: '#3b82f6'
      })
        .setLngLat([currentPosition.lng, currentPosition.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML('<div style="padding: 8px;"><strong>Your Location</strong></div>')
        )
        .addTo(mapRef.current);

      markersRef.current.push(userMarker);
    }

    // Add donor markers
    donors.forEach(donor => {
      if (!donor.latitude || !donor.longitude) return;

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'donor-marker';
      markerElement.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: #dc2626;
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;

      // Add blood type text
      const bloodTypeText = document.createElement('div');
      bloodTypeText.textContent = donor.blood_type;
      bloodTypeText.style.cssText = `
        color: white;
        font-size: 10px;
        font-weight: bold;
        transform: rotate(45deg);
        line-height: 1;
      `;
      markerElement.appendChild(bloodTypeText);

      const marker = new maplibregl.Marker({ element: markerElement })
        .setLngLat([donor.longitude, donor.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 12px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #dc2626; font-weight: bold;">
                  ${donor.name}
                </h3>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <div style="width: 20px; height: 20px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
                    ${donor.blood_type}
                  </div>
                  <span style="font-size: 14px;">Blood Type</span>
                </div>
                <div style="margin-bottom: 6px; font-size: 14px;">
                  📍 ${donor.city}
                </div>
                ${donor.distance ? `
                  <div style="margin-bottom: 6px; font-size: 14px;">
                    📏 ${donor.distance.toFixed(1)} km away
                  </div>
                ` : ''}
                <div style="margin-bottom: 8px; font-size: 14px;">
                  📞 ${donor.phone}
                </div>
                <button 
                  onclick="window.selectDonor('${donor.id}')"
                  style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%;"
                >
                  Request Blood
                </button>
              </div>
            `)
        )
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });

    // Global function for donor selection
    (window as any).selectDonor = (donorId: string) => {
      const donor = donors.find(d => d.id === donorId);
      if (donor) {
        onDonorSelect(donor);
      }
    };

  }, [donors, currentPosition, mapLoaded, onDonorSelect]);

  if (mapError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{mapError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={mapContainer} 
        className="h-96 w-full rounded-lg border"
        style={{ minHeight: '400px' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-600">
            <p>Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLibreMap;
