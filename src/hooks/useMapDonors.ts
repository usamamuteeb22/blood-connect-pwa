
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MapDonor {
  id: string;
  name: string;
  blood_type: string;
  latitude: number;
  longitude: number;
  availability: boolean;
  city: string;
  phone: string;
}

interface UseMapDonorsProps {
  currentPosition: { lat: number; lng: number } | null;
  radiusKm: number;
  bloodTypeFilter: string[];
}

export function useMapDonors({ currentPosition, radiusKm, bloodTypeFilter }: UseMapDonorsProps) {
  const [donors, setDonors] = useState<MapDonor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPosition) return;

    const fetchMapDonors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use the existing RPC function but adapt the response for map usage
        const { data, error: rpcError } = await supabase.rpc('get_nearby_donors', {
          origin_lat: currentPosition.lat,
          origin_lng: currentPosition.lng,
          radius_km: radiusKm,
          blood_types: bloodTypeFilter.length > 0 ? bloodTypeFilter : null
        });

        if (rpcError) throw rpcError;

        // Transform the data to match the MapDonor interface
        const mapDonors: MapDonor[] = (data || []).map((donor: any) => ({
          id: donor.id,
          name: donor.name,
          blood_type: donor.blood_type,
          latitude: donor.latitude,
          longitude: donor.longitude,
          availability: donor.availability,
          city: donor.city,
          phone: donor.phone
        }));

        setDonors(mapDonors);
      } catch (err) {
        console.error('Error fetching map donors:', err);
        setError('Failed to fetch nearby donors');
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMapDonors();
  }, [currentPosition, radiusKm, bloodTypeFilter]);

  return { donors, loading, error };
}
