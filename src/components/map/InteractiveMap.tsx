
import React from 'react';
import MapLibreMap from './MapLibreMap';

interface InteractiveMapProps {
  donors: any[];
  center?: [number, number];
  zoom?: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  donors, 
  center = [0, 0], 
  zoom = 2 
}) => {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border">
      <MapLibreMap 
        donors={donors}
        center={center}
        zoom={zoom}
      />
    </div>
  );
};

export default InteractiveMap;
