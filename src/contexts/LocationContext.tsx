
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  currentPosition: { lat: number; lng: number } | null;
  setCurrentPosition: (position: { lat: number; lng: number }) => void;
  getCurrentLocation: () => Promise<void>;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
            setIsLoading(false);
          },
          (error) => {
            console.warn('Location access denied:', error);
            // Fallback to a default location (e.g., city center)
            setCurrentPosition({ lat: 40.7128, lng: -74.0060 }); // New York as default
            setIsLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      } else {
        console.warn('Geolocation not supported');
        setCurrentPosition({ lat: 40.7128, lng: -74.0060 });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentPosition({ lat: 40.7128, lng: -74.0060 });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider value={{
      currentPosition,
      setCurrentPosition,
      getCurrentLocation,
      isLoading
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
