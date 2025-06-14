import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Donor } from "@/types/custom";

export const useDashboardActions = () => {
  const { user } = useAuth();
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorDialog, setShowDonorDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  
  const handleDonorSelect = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDonorDialog(true);
  };
  
  const handleSendRequest = async () => {
    if (!user || !selectedDonor) return;
    
    try {
      // Get user profile
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('blood_requests')
        .insert([
          {
            requester_id: user.id,
            donor_id: selectedDonor.id,
            requester_name: userData?.user_metadata?.full_name || user.email,
            blood_type: selectedDonor.blood_type,
            city: selectedDonor.city,
            address: selectedDonor.address,
            contact: userData?.user_metadata?.phone || '',
            reason: "Request made through donor selection", // Add default reason
            status: 'pending'
          }
        ]);
      
      if (error) throw error;
      
      setShowDonorDialog(false);
      
      // Return true to indicate success (for refreshing data)
      return true;
    } catch (error: any) {
      console.error("Request Failed", error.message || "Failed to send blood request.");
      return false;
    }
  };
  
  const handleApproveRequest = async (requestId: string) => {
    try {
      // Update request status to approved (not pending anymore)
      const { error: updateError } = await supabase
        .from('blood_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      // Get request details
      const { data: request, error: requestError } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (requestError) throw requestError;
      
      // Get donor details 
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user?.id)
        .single();
        
      if (donorError) throw donorError;
      
      if (request && donor) {
        // Create donation record
        const { error: donationError } = await supabase
          .from('donations')
          .insert([
            {
              donor_id: donor.id,
              request_id: requestId,
              recipient_name: request.requester_name,
              blood_type: request.blood_type,
              city: request.city,
              date: new Date().toISOString(),
              status: 'completed'
            }
          ]);
          
        if (donationError) throw donationError;
        
        // Update donor's next eligible date
        const newEligibleDate = new Date();
        newEligibleDate.setDate(newEligibleDate.getDate() + 90);
        
        const { error: donorUpdateError } = await supabase
          .from('donors')
          .update({ next_eligible_date: newEligibleDate.toISOString() })
          .eq('id', donor.id);
          
        if (donorUpdateError) throw donorUpdateError;
        
        return {
          success: true,
          newEligibleDate
        };
      }
    } catch (error: any) {
      console.error("Action Failed", error.message || "Failed to approve blood request.");
    }
    
    return { success: false };
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      // Update request status to rejected (not pending anymore)
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
        
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error("Action Failed", error.message || "Failed to reject blood request.");
      return false;
    }
  };

  return {
    selectedDonor,
    showDonorDialog,
    showRegisterDialog,
    setShowRegisterDialog,
    setShowDonorDialog,
    handleDonorSelect,
    handleSendRequest,
    handleApproveRequest,
    handleRejectRequest
  };
};
