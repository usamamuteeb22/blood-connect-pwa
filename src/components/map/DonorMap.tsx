
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin, Loader2 } from 'lucide-react';
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

interface DonorMapProps {
  currentPosition?: { lat: number; lng: number };
  radiusKm?: number;
  bloodTypeFilter?: string[];
  onDonorSelect: (donor: Donor) => void;
}

const DonorMap: React.FC<DonorMapProps> = ({ 
  currentPosition, 
  radiusKm = 10, 
  bloodTypeFilter = [],
  onDonorSelect 
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(currentPosition || null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(radiusKm);
  const [bloodFilter, setBloodFilter] = useState<string[]>(bloodTypeFilter);

  // Get current location if not provided
  useEffect(() => {
    if (!currentPosition && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.warn('Location denied', err);
          setError('Location access denied. Using default location.');
          setPosition({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else if (currentPosition) {
      setPosition(currentPosition);
    } else {
      setPosition({ lat: 40.7128, lng: -74.0060 });
    }
  }, [currentPosition]);

  // Fetch donors when position or filters change
  useEffect(() => {
    if (!position) return;

    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call - replace with actual Supabase call
        const mockDonors: Donor[] = [
          {
            id: '1',
            name: 'John Doe',
            blood_type: 'O+',
            latitude: position.lat + 0.01,
            longitude: position.lng + 0.01,
            availability: true,
            city: 'New York',
            phone: '+1-555-0123'
          },
          {
            id: '2',
            name: 'Jane Smith',
            blood_type: 'A+',
            latitude: position.lat - 0.01,
            longitude: position.lng - 0.01,
            availability: true,
            city: 'New York',
            phone: '+1-555-0456'
          }
        ];

        // Filter by blood type if specified
        const filteredDonors = bloodFilter.length > 0 
          ? mockDonors.filter(donor => bloodFilter.includes(donor.blood_type))
          : mockDonors;

        setDonors(filteredDonors);
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Failed to load donor data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [position, radius, bloodFilter]);

  // Create custom icons for different blood types
  const createBloodTypeIcon = (bloodType: string) => {
    const colorMap: Record<string, string> = {
      'O+': '#dc2626', 'O-': '#991b1b',
      'A+': '#2563eb', 'A-': '#1d4ed8',
      'B+': '#059669', 'B-': '#047857',
      'AB+': '#7c3aed', 'AB-': '#6d28d9'
    };
    
    const color = colorMap[bloodType] || '#6b7280';
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C7.84 0 4 3.84 4 8.5c0 8.5 8.5 17 8.5 17s8.5-8.5 8.5-17C21 3.84 17.16 0 12.5 0z"/>
          <circle cx="12.5" cy="8.5" r="4" fill="#fff"/>
          <text x="12.5" y="12" text-anchor="middle" fill="${color}" font-size="7" font-weight="bold">${bloodType}</text>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  if (!position) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading map...</span>
      </div>
    );
  }

  const mapCenter: LatLngExpression = [position.lat, position.lng];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium mb-1">Search Radius</label>
            <Select value={radius.toString()} onValueChange={(value) => setRadius(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium mb-1">Blood Type Filter</label>
            <Select 
              value={bloodFilter[0] || "all"} 
              onValueChange={(value) => setBloodFilter(value === "all" ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Map container */}
      <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading donors...</span>
          </div>
        )}
        
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Current location marker */}
          <Marker position={mapCenter}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
          
          {/* Donor markers */}
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
                    onClick={() => onDonorSelect(donor)}
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
      
      <div className="text-sm text-gray-600 text-center">
        Found {donors.length} available donors within {radius}km
      </div>
    </div>
  );
};

export default DonorMap;
