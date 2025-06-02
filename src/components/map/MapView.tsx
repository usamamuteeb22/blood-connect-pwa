
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin } from 'lucide-react';
import { Donor } from '@/types/custom';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  position: { lat: number; lng: number };
  donors: Donor[];
  onDonorSelect: (donor: Donor) => void;
  generateMockCoordinates: (index: number) => number[];
}

const MapView: React.FC<MapViewProps> = ({ 
  position, 
  donors, 
  onDonorSelect, 
  generateMockCoordinates 
}) => {
  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Current location marker */}
      <Marker position={[position.lat, position.lng]}>
        <Popup>
          <div className="text-center">
            <strong>Your Location</strong>
          </div>
        </Popup>
      </Marker>
      
      {/* Donor markers */}
      {donors.map((donor, index) => {
        const [lat, lng] = generateMockCoordinates(index);
        return (
          <Marker
            key={donor.id}
            position={[lat, lng]}
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
                    <div className={`h-2 w-2 rounded-full ${donor.is_eligible ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm">{donor.is_eligible ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onDonorSelect(donor)}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!donor.is_eligible}
                >
                  Request Blood
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
