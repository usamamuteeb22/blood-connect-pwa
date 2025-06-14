
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

const DonorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

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
    } catch (e) {
      console.error("Failed to load profile", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // Add new donation (with current date and time)
  const handleAddDonation = async () => {
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
          recipient_name: 'Manual Entry',
          blood_type: donor.blood_type,
          city: donor.city,
          date: date,
          status: 'completed'
        }]);

      if (error) {
        toast.error("Error adding donation. Check your Supabase security/RLS policies: " + error.message);
      } else {
        toast.success("Donation added successfully!");
        fetchProfile();
      }
    } catch (e) {
      toast.error("Error adding donation. Please try again.");
      console.error(e);
    }
    setAddLoading(false);
  };

  if (loading) return <div>Loading profile...</div>;
  if (!donor) return <div>Donor not found.</div>;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
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
        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleAddDonation}
            className="bg-blood text-white"
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
        </div>
      </Card>
      <Card>
        <CardContent>
          <div className="py-2 font-semibold">
            Donation History ({donations.length} total)
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Blood Type</TableHead>
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
                  <TableCell>{d.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorProfilePage;

