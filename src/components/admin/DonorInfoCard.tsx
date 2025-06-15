
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Donor } from "@/types/custom";

interface DonorInfoCardProps {
  donor: Donor;
  donationsCount: number;
  onAddDonation: () => void;
  onExportDonations: () => void;
  onResetDonations: () => void;
  addLoading: boolean;
}

const DonorInfoCard = ({
  donor,
  donationsCount,
  onAddDonation,
  onExportDonations,
  onResetDonations,
  addLoading,
}: DonorInfoCardProps) => {
  return (
    <Card className="mb-3 p-4 flex flex-col gap-2">
      <div className="font-bold text-xl text-blood">{donor.name}</div>
      <div className="text-sm text-gray-600">{donor.email}</div>
      <div className="text-sm">Phone: {donor.phone}</div>
      <div className="text-sm">City: {donor.city}</div>
      <div className="text-sm">Address: {donor.address}</div>
      <div className="text-sm">Blood Group: {donor.blood_type}</div>
      <div className="text-sm">Total Donations: {donationsCount}</div>
      
      <div className="flex gap-2 mt-2">
        <Button
          onClick={onAddDonation}
          className="bg-blood text-white hover:bg-red-700"
          disabled={addLoading}
        >
          {addLoading ? "Adding..." : "Add Donation"}
        </Button>
        
        <Button
          variant="outline"
          onClick={onExportDonations}
        >
          Export Donations
        </Button>
        
        <Button
          variant="destructive"
          onClick={onResetDonations}
          size="sm"
        >
          Reset Donations
        </Button>
      </div>
    </Card>
  );
};

export default DonorInfoCard;
