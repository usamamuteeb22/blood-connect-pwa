
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Donor } from "@/types/custom";

interface DonorWithDonationCount extends Donor {
  donation_count: number;
}

export const useDonorTableLogic = (donors: Donor[]) => {
  const [sortField, setSortField] = useState<keyof Donor>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [donorsWithCounts, setDonorsWithCounts] = useState<DonorWithDonationCount[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch donation counts for all donors
  useEffect(() => {
    const fetchDonationCounts = async () => {
      if (donors.length === 0) return;
      
      setLoading(true);
      try {
        const donorIds = donors.map(d => d.id);
        const { data: donationCounts, error } = await supabase
          .from('donations')
          .select('donor_id')
          .in('donor_id', donorIds);

        if (error) {
          console.error('Error fetching donation counts:', error);
          setDonorsWithCounts(donors.map(donor => ({ ...donor, donation_count: 0 })));
          return;
        }

        // Count donations per donor
        const countMap = donationCounts.reduce((acc, donation) => {
          acc[donation.donor_id] = (acc[donation.donor_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const donorsWithCounts = donors.map(donor => ({
          ...donor,
          donation_count: countMap[donor.id] || 0
        }));

        setDonorsWithCounts(donorsWithCounts);
      } catch (error) {
        console.error('Error in fetchDonationCounts:', error);
        setDonorsWithCounts(donors.map(donor => ({ ...donor, donation_count: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchDonationCounts();
  }, [donors]);

  const handleSort = (field: keyof Donor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDonors = [...donorsWithCounts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = async (donorId: string, onRefresh: () => void) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;

    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', donorId);

      if (error) throw error;

      onRefresh();
    } catch (error) {
      console.error('Error deleting donor:', error);
    }
  };

  return {
    sortField,
    sortDirection,
    sortedDonors,
    loading,
    handleSort,
    handleDelete
  };
};
