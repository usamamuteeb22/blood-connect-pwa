
import React, { useEffect, useRef, useState } from 'react';
import { Donor } from '@/types/custom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, Phone, User } from 'lucide-react';

interface GoogleMapProps {
  donors: (Donor & { distance?: number })[];
  currentPosition: { lat: number; lng: number } | null;
  onDonorSelect: (donor: Donor) => void;
}

// Google Maps configuration
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // You'll need to add your API key

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ donors, currentPosition, onDonorSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setMapLoaded(true);
    };
    
    script.onerror = () => {
      setMapError('Failed to load Google Maps. Please check your API key.');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !currentPosition) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: currentPosition,
        zoom: 12,
        styles: [
          {
            featureType: 'poi.medical',
            elementType: 'geometry',
            stylers: [{ color: '#ffd2d2' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add user location marker
      new window.google.maps.Marker({
        position: currentPosition,
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 12)
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }
  }, [mapLoaded, currentPosition]);

  // Add donor markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add donor markers
    donors.forEach(donor => {
      if (!donor.latitude || !donor.longitude) return;

      const marker = new window.google.maps.Marker({
        position: { lat: donor.latitude, lng: donor.longitude },
        map: mapInstanceRef.current,
        title: `${donor.name} (${donor.blood_type})`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C13.2386 2 11 4.23858 11 7C11 12.25 16 18 16 18S21 12.25 21 7C21 4.23858 18.7614 2 16 2Z" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
              <circle cx="16" cy="7" r="2" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #dc2626; font-weight: bold;">
              ${donor.name}
            </h3>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <div style="width: 24px; height: 24px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">
                ${donor.blood_type}
              </div>
              <span style="font-size: 14px;">Blood Type</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 14px;">
              📍 ${donor.city}
            </div>
            ${donor.distance ? `
              <div style="margin-bottom: 6px; font-size: 14px;">
                📏 ${donor.distance} km away
              </div>
            ` : ''}
            <div style="margin-bottom: 8px; font-size: 14px;">
              📞 ${donor.phone}
            </div>
            <button 
              onclick="window.selectDonor('${donor.id}')"
              style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;"
            >
              Request Blood
            </button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Global function for donor selection (called from info window)
    window.selectDonor = (donorId: string) => {
      const donor = donors.find(d => d.id === donorId);
      if (donor) {
        onDonorSelect(donor);
      }
    };

  }, [donors, onDonorSelect]);

  if (mapError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {mapError}
          <br />
          <small>To use Google Maps, you need to add your Google Maps API key.</small>
        </AlertDescription>
      </Alert>
    );
  }

  if (!currentPosition) {
    return (
      <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>Enable location access to view the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
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

export default GoogleMap;
