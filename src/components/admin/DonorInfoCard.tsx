
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Donor } from "@/types/custom";
import ResetDonationsConfirmDialog from "./ResetDonationsConfirmDialog";

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
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetConfirm = () => {
    onResetDonations();
    setShowResetDialog(false);
  };

  return (
    <>
      <Card className="mb-3 p-4 flex flex-col gap-2">
        <div className="font-bold text-xl text-blood">{donor.name}</div>
        <div className="text-sm text-gray-600">{donor.email}</div>
        <div className="text-sm">Phone: {donor.phone}</div>
        <div className="text-sm">City: {donor.city}</div>
        <div className="text-sm">Address: {donor.address}</div>
        <div className="text-sm">Blood Group: {donor.blood_type}</div>
        <div className="text-sm">Total Donations: {donationsCount}</div>
        <div className="text-sm">
          Last Donation Date: {donor.last_donation_date ? 
            format(new Date(donor.last_donation_date), 'MMM dd, yyyy') : 
            <span className="text-gray-400">Never</span>
          }
        </div>
        
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
            onClick={() => setShowResetDialog(true)}
            size="sm"
          >
            Reset Donations
          </Button>
        </div>
      </Card>

      <ResetDonationsConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleResetConfirm}
        donorName={donor.name}
      />
    </>
  );
};

export default DonorInfoCard;
