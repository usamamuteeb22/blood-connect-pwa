import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Donor, BloodRequest, Donation } from "@/types/custom";
import { toast } from "@/components/ui/use-toast";

// Helper function to fetch donor profile
const fetchDonorProfile = async (userId: string) => {
  const { data: donor, error } = await supabase
    .from('donors')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error("Error fetching donor profile:", error);
    return null;
  }
  
  return donor as Donor | null;
};

// Helper function to count completed donations
const fetchDonationCount = async (donorId: string) => {
  const { data: donationsData, error } = await supabase
    .from('donations')
    .select('id')
    .eq('donor_id', donorId)
    .eq('status', 'completed');
    
  if (error) {
    console.error("Error fetching donation count:", error);
    return 0;
  }
  
  return donationsData?.length || 0;
};

// Helper function to fetch user requests
const fetchUserRequests = async (userId: string) => {
  const { data: requests, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('requester_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching user requests:", error);
    return [];
  }
  
  return requests as BloodRequest[] || [];
};

// Helper function to fetch donor requests - specifically pending status only
const fetchDonorRequests = async (donorId: string) => {
  const { data: requests, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('donor_id', donorId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching donor requests:", error);
    return [];
  }
  
  return requests as BloodRequest[] || [];
};

// Helper function to fetch donations
const fetchDonations = async (donorId: string) => {
  const { data: donations, error } = await supabase
    .from('donations')
    .select('*')
    .eq('donor_id', donorId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
  
  return donations as Donation[] || [];
};

export const useDashboardData = () => {
  const { user } = useAuth();
  
  const [userDonor, setUserDonor] = useState<Donor | null>(null);
  const [userRequests, setUserRequests] = useState<BloodRequest[]>([]);
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [donorRequests, setDonorRequests] = useState<BloodRequest[]>([]);
  const [donationCount, setDonationCount] = useState(0);
  const [nextEligibleDate, setNextEligibleDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Expose refresh trigger setter for components to use
  const refreshData = () => setRefreshTrigger(prev => prev + 1);
  
  // Fetch user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch donor profile
        const donor = await fetchDonorProfile(user.id);
        
        if (donor) {
          setUserDonor(donor);
          setNextEligibleDate(new Date(donor.next_eligible_date));
          
          // Fetch donation count
          const count = await fetchDonationCount(donor.id);
          setDonationCount(count);
          
          // Fetch donor-specific requests - only pending ones
          const requests = await fetchDonorRequests(donor.id);
          setDonorRequests(requests);
          
          // Fetch donations
          const donations = await fetchDonations(donor.id);
          setUserDonations(donations);
        }
        
        // Fetch user requests (always fetch these)
        const requests = await fetchUserRequests(user.id);
        setUserRequests(requests);
      } catch (error: any) {
        console.error("Error loading dashboard data:", error.message);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, refreshTrigger]); // Add refreshTrigger as a dependency

  return {
    userDonor,
    userRequests,
    userDonations,
    donorRequests,
    donationCount,
    nextEligibleDate,
    loading,
    refreshData // Export the refresh function
  };
};
