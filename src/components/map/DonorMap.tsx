
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Navigation, Users } from 'lucide-react';
import { Donor } from '@/types/custom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapDonors } from '@/hooks/useMapDonors';
import MapFilters from './MapFilters';
import DonorCard from './DonorCard';
import GoogleMap from './GoogleMap';

interface DonorMapProps {
  currentPosition?: { lat: number; lng: number };
  radiusKm?: number;
  bloodTypeFilter?: string[];
  onDonorSelect: (donor: Donor) => void;
}

const DonorMap: React.FC<DonorMapProps> = ({ 
  currentPosition: propPosition, 
  radiusKm = 10, 
  bloodTypeFilter = [],
  onDonorSelect 
}) => {
  const [radius, setRadius] = useState(radiusKm);
  const [bloodFilter, setBloodFilter] = useState<string[]>(bloodTypeFilter);
  const [city, setCity] = useState<string>('');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const { position, error: locationError, loading: locationLoading, refetch: refetchLocation } = useGeolocation();
  const currentPosition = propPosition || position;

  const { donors, loading: donorsLoading, error: donorsError, refetch: refetchDonors } = useMapDonors({
    currentPosition,
    radiusKm: radius,
    bloodTypeFilter: bloodFilter,
    city,
  });

  const handleDonorSelect = (donor: Donor) => {
    setSelectedDonor(donor);
    onDonorSelect(donor);
  };

  const handleRefresh = () => {
    refetchDonors();
    refetchLocation();
  };

  const loading = locationLoading || donorsLoading;

  // Filter donors with valid coordinates for map display
  const donorsWithCoordinates = donors.filter(donor => 
    donor.latitude !== null && donor.longitude !== null
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <MapFilters
        radius={radius}
        onRadiusChange={setRadius}
        bloodFilter={bloodFilter}
        onBloodFilterChange={setBloodFilter}
        city={city}
        onCityChange={setCity}
        onRefresh={handleRefresh}
        onGetLocation={refetchLocation}
        loading={loading}
      />

      {/* Location Status */}
      {currentPosition && (
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Current Location:</span>
            <span className="text-gray-600">
              {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
            </span>
            {city && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Searching in: {city}</span>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Location Error */}
      {locationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Donors Error */}
      {donorsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{donorsError}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">
                {locationLoading ? 'Getting your location...' : 'Loading nearby donors...'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      {!loading && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              <span className="font-medium">
                Found {donors.length} available donors
              </span>
              {radius && (
                <span className="text-gray-600">within {radius}km</span>
              )}
              {donorsWithCoordinates.length < donors.length && (
                <span className="text-sm text-gray-500">
                  ({donorsWithCoordinates.length} with location data)
                </span>
              )}
            </div>
            {bloodFilter.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtering:</span>
                <span className="text-sm font-medium text-red-600">
                  {bloodFilter.join(', ')}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Interactive Map */}
      {!loading && currentPosition && (
        <Card className="overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Interactive Map</h3>
            <GoogleMap
              donors={donorsWithCoordinates}
              currentPosition={currentPosition}
              onDonorSelect={handleDonorSelect}
            />
            {donorsWithCoordinates.length === 0 && donors.length > 0 && (
              <Alert className="mt-4">
                <AlertDescription>
                  No donors with location coordinates found. Showing list view below.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      )}

      {/* Donors Grid */}
      {!loading && donors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donors.map((donor) => (
            <DonorCard
              key={donor.id}
              donor={donor}
              onSelect={handleDonorSelect}
              distance={donor.distance}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && donors.length === 0 && !donorsError && (
        <Card className="p-8">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Donors Found</h3>
            <p className="text-gray-600 mb-4">
              {city 
                ? `No available donors found in "${city}"`
                : `No available donors found within ${radius}km of your location`
              }
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Increasing the search radius</li>
                <li>Removing blood type filters</li>
                <li>Searching in a different city</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DonorMap;
