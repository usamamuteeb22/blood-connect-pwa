
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Find Donors Near You</CardTitle>
          <CardDescription>Loading your location...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            Loading map...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Donors Near You</CardTitle>
        <CardDescription>
          Use the map below to find available blood donors in your area
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DonorMap 
          currentPosition={currentPosition}
          onDonorSelect={onDonorSelect}
        />
      </CardContent>
    </Card>
  );
};

export default MapDonorFinder;
