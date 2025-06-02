
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Donor } from '@/types/custom';
import { toast } from '@/components/ui/use-toast';

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
        .limit(50);

      if (fetchError) {
        throw fetchError;
      }

      let processedDonors: MapDonorResult[] = data || [];

      // Calculate distances if we have current position
      if (currentPosition && data) {
        processedDonors = data.map(donor => {
          // For now, generate mock coordinates near the user's position
          // In a real app, you'd use actual donor coordinates
          const distance = Math.random() * radiusKm; // Mock distance calculation
          return {
            ...donor,
            distance,
          };
        }).filter(donor => !radiusKm || (donor.distance && donor.distance <= radiusKm))
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      setDonors(processedDonors);
    } catch (err: any) {
      console.error('Error fetching donors:', err);
      setError(err.message || 'Failed to fetch donors');
      toast({
        title: "Error",
        description: "Failed to load nearby donors. Please try again.",
        variant: "destructive",
      });
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
