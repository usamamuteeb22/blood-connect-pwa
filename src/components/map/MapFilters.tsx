
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, MapPin } from 'lucide-react';

interface MapFiltersProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  bloodFilter: string[];
  onBloodFilterChange: (bloodTypes: string[]) => void;
  city: string;
  onCityChange: (city: string) => void;
  onRefresh: () => void;
  onGetLocation: () => void;
  loading?: boolean;
}

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const MapFilters: React.FC<MapFiltersProps> = ({
  radius,
  onRadiusChange,
  bloodFilter,
  onBloodFilterChange,
  city,
  onCityChange,
  onRefresh,
  onGetLocation,
  loading = false,
}) => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city-filter">City</Label>
          <Input
            id="city-filter"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="radius-filter">Search Radius</Label>
          <Select value={radius.toString()} onValueChange={(value) => onRadiusChange(Number(value))}>
            <SelectTrigger id="radius-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="20">20 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
              <SelectItem value="100">100 km</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="blood-type-filter">Blood Type</Label>
          <Select 
            value={bloodFilter[0] || "all"} 
            onValueChange={(value) => onBloodFilterChange(value === "all" ? [] : [value])}
          >
            <SelectTrigger id="blood-type-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {BLOOD_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Actions</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGetLocation}
              disabled={loading}
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MapFilters;
