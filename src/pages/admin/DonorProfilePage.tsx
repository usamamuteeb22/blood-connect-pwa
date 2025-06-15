
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
      // Fetch donor details
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (donorError) throw donorError;
      setDonor(donorData);

      // Fetch donations for this specific donor only
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', id)
        .order('date', { ascending: false });
      
      if (donationsError) throw donationsError;
      setDonations(donationsData || []);
      
      console.log(`Fetched ${donationsData?.length || 0} donations for donor ${id}`);
    } catch (e) {
      console.error("Failed to load profile", e);
      toast.error("Failed to load donor profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  // Helper: robust back navigation (go back if possible, else go to /admin)
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/admin');
    }
  };

  // Show confirmation dialog
  const handleAddDonationClick = () => {
    setShowConfirmDialog(true);
  };

  // Add new donation (with current date and time)
  const handleConfirmAddDonation = async () => {
    if (!donor) return;
    setAddLoading(true);
    try {
      const currentDate = new Date().toISOString();

      // Insert a new donation record
      const { data: newDonation, error } = await supabase
        .from('donations')
        .insert([{
          donor_id: donor.id,
          request_id: null,
          recipient_name: donor.name, // Use donor name as recipient
          blood_type: donor.blood_type,
          city: donor.city,
          date: currentDate,
          status: 'completed'
        }])
        .select()
        .single();

      if (error) {
        console.error("Error adding donation:", error);
        toast.error("Error adding donation: " + error.message);
      } else {
        console.log("Successfully added donation:", newDonation);
        toast.success("Donation added successfully!");
        
        // Refresh the profile data to get updated donation list
        await fetchProfile();
        
        // Trigger analytics refresh with more specific event data
        window.dispatchEvent(new CustomEvent('donationAdded', {
          detail: {
            donorId: donor.id,
            bloodType: donor.blood_type,
            city: donor.city,
            date: currentDate
          }
        }));
      }
    } catch (e) {
      console.error("Error adding donation:", e);
      toast.error("Error adding donation. Please try again.");
    }
    setAddLoading(false);
    setShowConfirmDialog(false);
  };

  // Reset all donations (for testing)
  const handleResetDonations = async () => {
    if (!donor) return;
    
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('donor_id', donor.id);
      
      if (error) throw error;
      
      toast.success("All donations reset for this donor");
      await fetchProfile();
      
      // Trigger analytics refresh
      window.dispatchEvent(new CustomEvent('donationAdded'));
    } catch (e) {
      console.error("Error resetting donations:", e);
      toast.error("Error resetting donations");
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
            className="bg-blood text-white"
            disabled={addLoading}
          >
            Add Donation
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
                {donations.map(d => (
                  <TableRow key={d.id}>
                    <TableCell>{format(new Date(d.date), "yyyy-MM-dd HH:mm")}</TableCell>
                    <TableCell>{d.recipient_name}</TableCell>
                    <TableCell>{d.blood_type}</TableCell>
                    <TableCell>{d.city}</TableCell>
                    <TableCell className="capitalize">{d.status}</TableCell>
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
