
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Donor, BloodRequest, Donation } from "@/types/custom";

// Function to fetch donor profile safely
const fetchDonorProfile = async (userId: string): Promise<Donor | null> => {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle 0 or 1 results
      
    if (error) {
      console.error('Error fetching donor profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    return null;
  }
};

// Function to fetch user requests
const fetchUserRequests = async (userId: string): Promise<BloodRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('requester_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user requests:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return [];
  }
};

// Function to fetch user donations
const fetchUserDonations = async (userId: string): Promise<Donation[]> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', userId)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching user donations:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user donations:', error);
    return [];
  }
};

// Function to fetch donor requests
const fetchDonorRequests = async (donorId: string): Promise<BloodRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('donor_id', donorId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching donor requests:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching donor requests:', error);
    return [];
  }
};

export const useDashboardData = () => {
  const { user } = useAuth();
  const [userDonor, setUserDonor] = useState<Donor | null>(null);
  const [userRequests, setUserRequests] = useState<BloodRequest[]>([]);
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [donorRequests, setDonorRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    console.log('Loading dashboard data for user:', user.id);
    setLoading(true);
    
    try {
      // Fetch donor profile first
      const donorProfile = await fetchDonorProfile(user.id);
      setUserDonor(donorProfile);
      
      // Fetch user requests and donations in parallel
      const [requests, donations] = await Promise.all([
        fetchUserRequests(user.id),
        fetchUserDonations(user.id)
      ]);
      
      setUserRequests(requests);
      setUserDonations(donations);
      
      // If user is a donor, fetch donor-specific requests
      if (donorProfile?.id) {
        const donorRequests = await fetchDonorRequests(donorProfile.id);
        setDonorRequests(donorRequests);
      } else {
        setDonorRequests([]);
      }
      
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Reset states on error
      setUserDonor(null);
      setUserRequests([]);
      setUserDonations([]);
      setDonorRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  
  // Load data when user changes
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);
  
  // Calculate donation stats
  const donationCount = userDonations.length;
  const nextEligibleDate = userDonations.length > 0 
    ? new Date(new Date(userDonations[0]?.date).getTime() + (56 * 24 * 60 * 60 * 1000)) // 8 weeks
    : null;
  
  // Refresh function for manual data reload
  const refreshData = useCallback(() => {
    console.log('Refreshing dashboard data...');
    return loadDashboardData();
  }, [loadDashboardData]);
  
  return {
    userDonor,
    userRequests,
    userDonations,
    donorRequests,
    donationCount,
    nextEligibleDate,
    loading,
    refreshData
  };
};
