
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Donor {
  id: string;
  name: string;
  blood_type: string;
  latitude: number;
  longitude: number;
  availability: boolean;
  city: string;
  phone: string;
}

interface InteractiveMapProps {
  center: { lat: number; lng: number };
  donors: Donor[];
  onRequestBlood: (donor: Donor) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ center, donors, onRequestBlood }) => {
  const mapCenter: LatLngExpression = [center.lat, center.lng];
  const [key, setKey] = useState(0);

  // Update map when center changes by remounting
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [center.lat, center.lng]);

  // Create custom icons for different blood types
  const createBloodTypeIcon = (bloodType: string) => {
    const color = bloodType.includes('O') ? '#dc2626' : bloodType.includes('A') ? '#2563eb' : 
                  bloodType.includes('B') ? '#059669' : '#7c3aed';
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C7.84 0 4 3.84 4 8.5c0 8.5 8.5 17 8.5 17s8.5-8.5 8.5-17C21 3.84 17.16 0 12.5 0z"/>
          <circle cx="12.5" cy="8.5" r="4" fill="#fff"/>
          <text x="12.5" y="12" text-anchor="middle" fill="${color}" font-size="8" font-weight="bold">${bloodType}</text>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        key={key}
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {donors.map((donor) => (
          <Marker
            key={donor.id}
            position={[donor.latitude, donor.longitude]}
            icon={createBloodTypeIcon(donor.blood_type)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{donor.name}</h3>
                  <Badge variant="secondary" className="bg-red-600 text-white">
                    {donor.blood_type}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{donor.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{donor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${donor.availability ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm">{donor.availability ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onRequestBlood(donor)}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!donor.availability}
                >
                  Request Blood
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
