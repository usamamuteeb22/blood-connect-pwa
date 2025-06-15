
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Donor } from "@/types/custom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import AddDonationConfirmDialog from "@/components/admin/AddDonationConfirmDialog";

const DonorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log(`Fetching donor profile for ID: ${id}`);
      
      // Fetch donor details
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
      setDonor(donorData);

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
      toast.error("Failed to load donor profile: " + (e as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  // Helper: robust back navigation
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/admin');
    }
  };

  // Show confirmation dialog
  const handleAddDonationClick = () => {
    console.log("Opening donation confirmation dialog");
    setShowConfirmDialog(true);
  };

  // Add new donation with comprehensive error handling
  const handleConfirmAddDonation = async () => {
    if (!donor) {
      console.error("No donor data available");
      toast.error("No donor data available");
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
        request_id: null,
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
      toast.success("Donation added successfully!");

      // Refresh the profile data immediately
      await fetchProfile();

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
      toast.error(error.message || "Failed to add donation. Please try again.");
    } finally {
      setAddLoading(false);
      setShowConfirmDialog(false);
    }
  };

  // Reset all donations for testing
  const handleResetDonations = async () => {
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
      
      console.log("Donations reset successfully");
      toast.success("All donations reset for this donor");
      
      // Refresh data
      await fetchProfile();
      
      // Trigger analytics refresh
      window.dispatchEvent(new CustomEvent('donationAdded', {
        detail: { reset: true, donorId: donor.id }
      }));
      
    } catch (e) {
      console.error("Error resetting donations:", e);
      toast.error("Error resetting donations: " + (e as Error).message);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!donor) return <div>Donor not found.</div>;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="mb-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <Card className="mb-3 p-4 flex flex-col gap-2">
        <div className="font-bold text-xl text-blood">{donor.name}</div>
        <div className="text-sm text-gray-600">{donor.email}</div>
        <div className="text-sm">Phone: {donor.phone}</div>
        <div className="text-sm">City: {donor.city}</div>
        <div className="text-sm">Address: {donor.address}</div>
        <div className="text-sm">Blood Group: {donor.blood_type}</div>
        <div className="text-sm">Total Donations: {donations.length}</div>
        
        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleAddDonationClick}
            className="bg-blood text-white hover:bg-red-700"
            disabled={addLoading}
          >
            {addLoading ? "Adding..." : "Add Donation"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() =>
              import('@/utils/exportUtils').then(m =>
                m.exportToCSV(donations, `donor-${donor.id}-donations`)
              )
            }
          >
            Export Donations (CSV)
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleResetDonations}
            size="sm"
          >
            Reset Donations
          </Button>
        </div>
      </Card>
      
      <Card>
        <CardContent>
          <div className="py-2 font-semibold">
            Donation History ({donations.length} total)
          </div>
          {donations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No donations recorded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map(donation => (
                  <TableRow key={donation.id}>
                    <TableCell>{format(new Date(donation.date), "yyyy-MM-dd HH:mm")}</TableCell>
                    <TableCell>{donation.recipient_name}</TableCell>
                    <TableCell>{donation.blood_type}</TableCell>
                    <TableCell>{donation.city}</TableCell>
                    <TableCell className="capitalize text-green-600 font-medium">
                      {donation.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddDonationConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmAddDonation}
        donorName={donor.name}
        isLoading={addLoading}
      />
    </div>
  );
};

export default DonorProfilePage;
