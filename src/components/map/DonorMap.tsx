
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin, Loader2, AlertCircle, Navigation } from 'lucide-react';
import { Donor } from '@/types/custom';

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
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

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

  if (!position) {
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

      {/* Map placeholder with donor list */}
      <Card className="overflow-hidden">
        <div className="h-96 w-full relative bg-gradient-to-br from-blue-50 to-green-50">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading donors...</p>
              </div>
            </div>
          )}
          
          {/* Current location indicator */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Your Location</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </div>
          </div>

          {/* Donor markers simulation */}
          <div className="absolute inset-0 p-4">
            <div className="text-center mt-20">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map Coming Soon</h3>
              <p className="text-gray-600 mb-6">View available donors in your area</p>
              
              {/* Simulated markers */}
              <div className="grid gap-2 max-w-md mx-auto">
                {donors.slice(0, 3).map((donor, index) => (
                  <div 
                    key={donor.id}
                    className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedDonor(donor)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm">{donor.name}</div>
                          <div className="text-xs text-gray-600">{donor.city}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-red-600 text-white text-xs">
                        {donor.blood_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected donor details */}
      {selectedDonor && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Selected Donor</h3>
            <Button variant="outline" size="sm" onClick={() => setSelectedDonor(null)}>
              Close
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">{selectedDonor.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{selectedDonor.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedDonor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-red-600 text-white">
                    {selectedDonor.blood_type}
                  </Badge>
                  <div className={`h-2 w-2 rounded-full ${selectedDonor.is_eligible ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">{selectedDonor.is_eligible ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={() => onDonorSelect(selectedDonor)}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!selectedDonor.is_eligible}
              >
                Request Blood
              </Button>
            </div>
          </div>
        </Card>
      )}
      
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
