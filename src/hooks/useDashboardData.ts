
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Donor, BloodRequest, Donation } from "@/types/custom";

export const useDashboardData = () => {
  const { user } = useAuth();
  
  const [userDonor, setUserDonor] = useState<Donor | null>(null);
  const [userRequests, setUserRequests] = useState<BloodRequest[]>([]);
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [donorRequests, setDonorRequests] = useState<BloodRequest[]>([]);
  const [donationCount, setDonationCount] = useState(0);
  const [nextEligibleDate, setNextEligibleDate] = useState<Date | null>(null);
  
  // Fetch user data
  useEffect(() => {
    if (!user) return;
    
    const fetchDonorProfile = async () => {
      // Check if user is registered as a donor
      const { data: donor, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (donor && !error) {
        setUserDonor(donor as Donor);
        setNextEligibleDate(new Date(donor.next_eligible_date));
      }
      
      // Count completed donations
      if (donor) {
        const { data: donationsData, error: countError } = await supabase
          .from('donations')
          .select('id')
          .eq('donor_id', donor.id)
          .eq('status', 'completed');
          
        if (!countError && donationsData) {
          setDonationCount(donationsData.length || 0);
        }
      }
    };
    
    const fetchUserRequests = async () => {
      // Get requests made by this user
      const { data: requests, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });
        
      if (requests && !error) {
        setUserRequests(requests as BloodRequest[]);
      }
    };
    
    const fetchDonorRequests = async () => {
      // Get requests made to this donor
      const { data: donor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (donor) {
        const { data: requests, error } = await supabase
          .from('blood_requests')
          .select('*')
          .eq('donor_id', donor.id)
          .order('created_at', { ascending: false });
          
        if (requests && !error) {
          setDonorRequests(requests as BloodRequest[]);
        }
      }
    };
    
    const fetchDonations = async () => {
      // Get donations made by this donor
      const { data: donor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (donor) {
        const { data: donations, error } = await supabase
          .from('donations')
          .select('*')
          .eq('donor_id', donor.id)
          .order('date', { ascending: false });
          
        if (donations && !error) {
          setUserDonations(donations as Donation[]);
        }
      }
    };

    fetchDonorProfile();
    fetchUserRequests();
    fetchDonorRequests();
    fetchDonations();
  }, [user]);

  return {
    userDonor,
    userRequests,
    userDonations,
    donorRequests,
    donationCount,
    nextEligibleDate,
  };
};
