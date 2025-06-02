
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Donor } from '@/types/custom';

// Simple dynamic import for the entire map component
const MapComponent = React.lazy(() => import('./MapView'));

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
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        
        // Mock data that matches the Donor type from custom.ts
        const mockDonors: Donor[] = [
          {
            id: '1',
            user_id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1-555-0123',
            blood_type: 'O+',
            age: 28,
            weight: 70,
            city: 'New York',
            address: '123 Main St, New York, NY',
            next_eligible_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_eligible: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: 'user-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1-555-0456',
            blood_type: 'A+',
            age: 32,
            weight: 65,
            city: 'New York',
            address: '456 Oak Ave, New York, NY',
            next_eligible_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            is_eligible: true,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            user_id: 'user-3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            phone: '+1-555-0789',
            blood_type: 'B-',
            age: 25,
            weight: 80,
            city: 'New York',
            address: '789 Pine St, New York, NY',
            next_eligible_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            is_eligible: true,
            created_at: new Date().toISOString()
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

  // Generate mock coordinates near the user's position
  const generateMockCoordinates = (index: number) => {
    if (!position) return [0, 0];
    
    const latOffset = (Math.random() - 0.5) * 0.02; // ~1km radius
    const lngOffset = (Math.random() - 0.5) * 0.02;
    
    return [position.lat + latOffset, position.lng + lngOffset];
  };

  if (!position || !isClient) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Getting your location...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Map container */}
      <Card className="overflow-hidden">
        <div className="h-96 w-full relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading donors...</p>
              </div>
            </div>
          )}
          
          <React.Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }>
            <MapComponent
              position={position}
              donors={donors}
              onDonorSelect={onDonorSelect}
              generateMockCoordinates={generateMockCoordinates}
            />
          </React.Suspense>
        </div>
      </Card>
      
      {/* Results summary */}
      <Card className="p-4">
        <div className="text-center text-sm text-gray-600">
          Found {donors.length} available donors within {radius}km
        </div>
      </Card>
    </div>
  );
};

export default DonorMap;
