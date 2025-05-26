
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { MapPin, Search } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useNearbyDonors } from '@/hooks/useNearbyDonors';
import InteractiveMap from '@/components/map/InteractiveMap';

interface MapDonorFinderProps {
  onDonorSelect: (donor: any) => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MapDonorFinder: React.FC<MapDonorFinderProps> = ({ onDonorSelect }) => {
  const { currentPosition, getCurrentLocation, isLoading: locationLoading } = useLocation();
  const [radiusKm, setRadiusKm] = useState([10]);
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string[]>([]);
  
  const { donors, loading, error } = useNearbyDonors({
    currentPosition,
    radiusKm: radiusKm[0],
    bloodTypeFilter
  });

  const handleBloodTypeFilterChange = (value: string) => {
    if (value === 'all') {
      setBloodTypeFilter([]);
    } else {
      setBloodTypeFilter([value]);
    }
  };

  const handleRequestBlood = (donor: any) => {
    onDonorSelect(donor);
  };

  if (locationLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood mx-auto mb-4"></div>
              <p className="text-gray-500">Getting your location...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentPosition) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Location Access Required</h3>
            <p className="text-gray-500 mb-4">
              We need your location to find nearby blood donors
            </p>
            <Button onClick={getCurrentLocation} className="bg-blood hover:bg-blood-600">
              <MapPin className="h-4 w-4 mr-2" />
              Enable Location
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Find Nearby Donors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Type</label>
              <Select onValueChange={handleBloodTypeFilterChange} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All blood types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All blood types</SelectItem>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Radius Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Search Radius: {radiusKm[0]} km
              </label>
              <Slider
                value={radiusKm}
                onValueChange={setRadiusKm}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Results Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Results</label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {donors.length} donors found
                </Badge>
                {bloodTypeFilter.length > 0 && (
                  <Badge variant="outline" className="text-sm">
                    {bloodTypeFilter[0]} only
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          {error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <InteractiveMap
              center={currentPosition}
              donors={donors}
              onRequestBlood={handleRequestBlood}
            />
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood mx-auto mb-2"></div>
          <p className="text-gray-500">Searching for donors...</p>
        </div>
      )}
    </div>
  );
};

export default MapDonorFinder;
