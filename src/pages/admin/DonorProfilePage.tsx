
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Donor } from "@/types/custom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";

const DonorProfilePage = () => {
  const { id } = useParams();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Add new donation (with current date)
  const handleAddDonation = async () => {
    if (!donor) return;
    try {
      const date = new Date().toISOString();
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_id: donor.id,
          request_id: null,
          recipient_name: 'Manual Entry',
          blood_type: donor.blood_type,
          city: donor.city,
          date: date,
          status: 'completed'
        }]);
      if (error) throw error;
      fetchProfile(); // Refresh
    } catch (e) {
      alert("Error adding donation");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!donor) return <div>Donor not found.</div>;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card className="mb-3 p-4 flex flex-col gap-2">
        <div className="font-bold text-xl text-blood">{donor.name}</div>
        <div className="text-sm text-gray-600">{donor.email}</div>
        <div className="text-sm">Phone: {donor.phone}</div>
        <div className="text-sm">City: {donor.city}</div>
        <div className="text-sm">Address: {donor.address}</div>
        <div className="text-sm">Blood Group: {donor.blood_type}</div>
        <div className="flex gap-2 mt-2">
          <Button onClick={handleAddDonation} className="bg-blood text-white">Add Donation</Button>
          <Button variant="outline" onClick={() => import('@/utils/exportUtils').then(m => m.exportToCSV(donations, `donor-${donor.id}-donations`))}>Export Donations (CSV)</Button>
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
