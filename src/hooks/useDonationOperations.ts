
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Donor } from "@/types/custom";

export const useDonationOperations = (donor: Donor | null, onRefresh: () => void) => {
  const [addLoading, setAddLoading] = useState(false);

  const addDonation = async () => {
    if (!donor) {
      console.error("No donor data available");
      return;
    }

    console.log("Starting donation addition process for donor:", donor.id);
    setAddLoading(true);
    
    try {
      const currentDate = new Date().toISOString();
      console.log("Creating donation with date:", currentDate);

      // First, verify the donor exists
      const { data: donorCheck, error: donorCheckError } = await supabase
        .from('donors')
        .select('id, name, blood_type, city')
        .eq('id', donor.id)
        .single();

      if (donorCheckError) {
        console.error("Donor verification failed:", donorCheckError);
        throw new Error(`Donor verification failed: ${donorCheckError.message}`);
      }

      console.log("Donor verification successful:", donorCheck);

      // Prepare donation data
      const donationData = {
        donor_id: donor.id,
        request_id: null, // Explicitly set null now allowed by updated DB
        recipient_name: donor.name,
        blood_type: donor.blood_type,
        city: donor.city,
        date: currentDate,
        status: 'completed'
      };

      console.log("Inserting donation data:", donationData);

      // Insert the donation record
      const { data: newDonation, error: insertError } = await supabase
        .from('donations')
        .insert([donationData])
        .select()
        .single();

      if (insertError) {
        console.error("Donation insertion failed:", insertError);
        throw new Error(`Failed to add donation: ${insertError.message}`);
      }

      console.log("Donation successfully inserted:", newDonation);

      // Update donor's last_donation_date
      const { error: updateError } = await supabase
        .from('donors')
        .update({ last_donation_date: currentDate })
        .eq('id', donor.id);

      if (updateError) {
        console.error("Failed to update last donation date:", updateError);
      }

      // Refresh the profile data immediately
      await onRefresh();

      // Trigger analytics refresh with detailed event data
      const refreshEvent = new CustomEvent('donationAdded', {
        detail: {
          donorId: donor.id,
          bloodType: donor.blood_type,
          city: donor.city,
          date: currentDate,
          donationId: newDonation.id
        }
      });
      
      console.log("Dispatching analytics refresh event:", refreshEvent.detail);
      window.dispatchEvent(refreshEvent);

    } catch (error: any) {
      console.error("Error in donation addition process:", error);
    } finally {
      setAddLoading(false);
    }
  };

  const resetDonations = async () => {
    if (!donor) return;
    
    console.log("Resetting donations for donor:", donor.id);
    
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('donor_id', donor.id);
      
      if (error) {
        console.error("Reset donations error:", error);
        throw error;
      }
      
      // Reset last_donation_date
      const { error: updateError } = await supabase
        .from('donors')
        .update({ last_donation_date: null })
        .eq('id', donor.id);

      if (updateError) {
        console.error("Failed to reset last donation date:", updateError);
      }
      
      console.log("Donations reset successfully");
      
      // Refresh data
      await onRefresh();
      
      // Trigger analytics refresh
      window.dispatchEvent(new CustomEvent('donationAdded', {
        detail: { reset: true, donorId: donor.id }
      }));
      
    } catch (e) {
      console.error("Error resetting donations:", e);
    }
  };

  return {
    addLoading,
    addDonation,
    resetDonations
  };
};
