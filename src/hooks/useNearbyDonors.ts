
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NearbyDonor {
  id: string;
  name: string;
  blood_type: string;
  latitude: number;
  longitude: number;
  availability: boolean;
  city: string;
  phone: string;
}

interface UseNearbyDonorsProps {
  currentPosition: { lat: number; lng: number } | null;
  radiusKm: number;
  bloodTypeFilter: string[];
}

export function useNearbyDonors({ currentPosition, radiusKm, bloodTypeFilter }: UseNearbyDonorsProps) {
  const [donors, setDonors] = useState<NearbyDonor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPosition) return;

    const fetchNearbyDonors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: rpcError } = await supabase.rpc('get_nearby_donors', {
          origin_lat: currentPosition.lat,
          origin_lng: currentPosition.lng,
          radius_km: radiusKm,
          blood_types: bloodTypeFilter.length > 0 ? bloodTypeFilter : null
        });

        if (rpcError) throw rpcError;

        setDonors(data || []);
      } catch (err) {
        console.error('Error fetching nearby donors:', err);
        setError('Failed to fetch nearby donors');
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyDonors();
  }, [currentPosition, radiusKm, bloodTypeFilter]);

  return { donors, loading, error };
}
