
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Donor } from "@/types/custom";

export const useDonorProfileData = (id: string | undefined) => {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log(`Fetching donor profile for ID: ${id}`);
      
      // Fetch donor details with last_donation_date
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (donorError) {
        console.error("Donor fetch error:", donorError);
        throw donorError;
      }
      
      console.log("Fetched donor:", donorData);
      const donorWithLastDonation = {
        ...donorData,
        last_donation_date: donorData.last_donation_date || null
      };
      setDonor(donorWithLastDonation);

      // Fetch donations for this specific donor only
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', id)
        .order('date', { ascending: false });
      
      if (donationsError) {
        console.error("Donations fetch error:", donationsError);
        throw donationsError;
      }
      
      console.log(`Fetched ${donationsData?.length || 0} donations for donor ${id}:`, donationsData);
      setDonations(donationsData || []);
      
    } catch (e) {
      console.error("Failed to load profile", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  return {
    donor,
    donations,
    loading,
    fetchProfile,
    setDonor,
    setDonations
  };
};
