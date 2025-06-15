
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
  const [donationCount, setDonationCount] = useState(0);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*').eq('id', id)
        .single();
      if (error) throw error;
      setDonor(data);

      const dn = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', id)
        .order('date', { ascending: false });
      setDonations(dn.data || []);
      setDonationCount(dn.data?.length || 0);
    } catch (e) {
      console.error("Failed to load profile", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
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
      const date = new Date().toISOString();

      // Attempt to insert a new donation
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_id: donor.id,
          request_id: null, // Most manual entries will not be tied to a blood request
          recipient_name: donor.name, // Changed from 'Manual Entry' to donor name
          blood_type: donor.blood_type,
          city: donor.city,
          date: date,
          status: 'completed'
        }]);

      if (error) {
        toast.error("Error adding donation. Check your Supabase security/RLS policies: " + error.message);
      } else {
        toast.success("Donation added successfully!");
        setDonationCount(prev => prev + 1);
        fetchProfile();
      }
    } catch (e) {
      toast.error("Error adding donation. Please try again.");
      console.error(e);
    }
    setAddLoading(false);
    setShowConfirmDialog(false);
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
        <div className="text-sm">Total Donations: {donationCount}</div>
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
        </div>
      </Card>
      <Card>
        <CardContent>
          <div className="py-2 font-semibold">
            Donation History ({donationCount} total)
          </div>
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
                  <TableCell>{format(new Date(d.date), "yyyy-MM-dd")}</TableCell>
                  <TableCell>{d.recipient_name}</TableCell>
                  <TableCell>{d.blood_type}</TableCell>
                  <TableCell>{d.city}</TableCell>
                  <TableCell className="capitalize">{d.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
