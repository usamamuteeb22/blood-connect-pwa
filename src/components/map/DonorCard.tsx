
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Clock, User } from 'lucide-react';
import { Donor } from '@/types/custom';

interface DonorCardProps {
  donor: Donor;
  onSelect: (donor: Donor) => void;
  distance?: number;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor, onSelect, distance }) => {
  const formatNextEligibleDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Available now';
    } else if (diffDays === 1) {
      return 'Available tomorrow';
    } else {
      return `Available in ${diffDays} days`;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(donor)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {donor.blood_type}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{donor.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <User className="h-3 w-3" />
                <span>Age {donor.age}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant={donor.is_eligible ? "default" : "secondary"}
              className={donor.is_eligible ? "bg-green-600" : ""}
            >
              {donor.is_eligible ? 'Available' : 'Not Available'}
            </Badge>
            {distance && (
              <div className="text-xs text-gray-500 mt-1">
                {distance.toFixed(1)} km away
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{donor.city}, {donor.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{donor.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatNextEligibleDate(donor.next_eligible_date)}</span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-red-600 hover:bg-red-700"
          disabled={!donor.is_eligible}
        >
          {donor.is_eligible ? 'Request Blood' : 'Not Available'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DonorCard;
