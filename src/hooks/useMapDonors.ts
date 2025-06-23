
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Donor } from '@/types/custom';
import { calculateDistance, isValidCoordinate } from '@/utils/mapUtils';

interface UseMapDonorsProps {
  currentPosition: { lat: number; lng: number } | null;
  radiusKm: number;
  bloodTypeFilter: string[];
  city?: string;
}

interface MapDonorResult extends Donor {
  distance?: number;
}

export function useMapDonors({ currentPosition, radiusKm, bloodTypeFilter, city }: UseMapDonorsProps) {
  const [donors, setDonors] = useState<MapDonorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonors = async () => {
    if (!currentPosition && !city) {
      console.log('No position or city provided');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('donors')
        .select('*')
        .eq('is_eligible', true);

      // Apply city filter if provided
      if (city && city.trim()) {
        query = query.ilike('city', `%${city.trim()}%`);
      }

      // Apply blood type filter
      if (bloodTypeFilter.length > 0) {
        query = query.in('blood_type', bloodTypeFilter);
      }

      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false })
        .limit(100); // Increase limit for better coverage

      if (fetchError) {
        throw fetchError;
      }

      let processedDonors: MapDonorResult[] = [];

      if (data) {
        // Transform data to ensure last_donation_date is included
        const donorsWithLastDonation = data.map(donor => ({
          ...donor,
          last_donation_date: donor.last_donation_date || null
        }));

        processedDonors = donorsWithLastDonation;

        // Calculate real distances if we have current position
        if (currentPosition) {
          processedDonors = donorsWithLastDonation.map(donor => {
            let distance: number | undefined;
            
            // Calculate real distance using coordinates
            if (isValidCoordinate(donor.latitude, donor.longitude)) {
              distance = calculateDistance(
                currentPosition.lat,
                currentPosition.lng,
                donor.latitude!,
                donor.longitude!
              );
            }
            
            return {
              ...donor,
              distance,
            };
          })
          // Filter by radius if distance was calculated
          .filter(donor => {
            if (donor.distance === undefined) return true; // Include donors without coordinates
            return donor.distance <= radiusKm;
          })
          // Sort by distance (donors without coordinates at the end)
          .sort((a, b) => {
            if (a.distance === undefined && b.distance === undefined) return 0;
            if (a.distance === undefined) return 1;
            if (b.distance === undefined) return -1;
            return a.distance - b.distance;
          });
        }
      }

      setDonors(processedDonors);
    } catch (err: any) {
      console.error('Error fetching donors:', err);
      setError(err.message || 'Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [currentPosition, radiusKm, bloodTypeFilter, city]);

  return { 
    donors, 
    loading, 
    error, 
    refetch: fetchDonors 
  };
}
