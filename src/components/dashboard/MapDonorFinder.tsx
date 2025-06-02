
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DonorMap from '@/components/map/DonorMap';
import { useLocation } from '@/contexts/LocationContext';
import { Donor } from '@/types/custom';

interface MapDonorFinderProps {
  onDonorSelect: (donor: Donor) => void;
}

const MapDonorFinder: React.FC<MapDonorFinderProps> = ({ onDonorSelect }) => {
  const { currentPosition, isLoading } = useLocation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Find Donors Near You</span>
          </CardTitle>
          <CardDescription>
            Use location-based search to find available blood donors in your area. 
            You can filter by distance, blood type, and city.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorMap 
            currentPosition={currentPosition}
            onDonorSelect={onDonorSelect}
            radiusKm={10}
            bloodTypeFilter={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapDonorFinder;
