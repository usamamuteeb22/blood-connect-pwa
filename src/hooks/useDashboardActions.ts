
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Donor } from "@/types/custom";

export const useDashboardActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
            status: 'pending'
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Request Sent",
        description: `Your blood request has been sent to ${selectedDonor.name}.`,
      });
      
      setShowDonorDialog(false);
      
      // Return true to indicate success (for refreshing data)
      return true;
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to send blood request.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleApproveRequest = async (requestId: string) => {
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('blood_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      // Get request details
      const { data: request } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('id', requestId)
        .single();
      
      // Get donor details 
      const { data: donor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user?.id)
        .single();
        
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
        
        toast({
          title: "Request Approved",
          description: "You have approved the blood donation request. Thank you for saving a life!",
        });
        
        return {
          success: true,
          newEligibleDate
        };
      }
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to approve blood request.",
        variant: "destructive",
      });
    }
    
    return { success: false };
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      // Update request status
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast({
        title: "Request Rejected",
        description: "You have rejected the blood donation request.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to reject blood request.",
        variant: "destructive",
      });
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
