
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDonorProfile } from "@/hooks/useDonorProfile";
import DonorProfileHeader from "@/components/admin/DonorProfileHeader";
import DonorInfoCard from "@/components/admin/DonorInfoCard";
import DonationHistoryCard from "@/components/admin/DonationHistoryCard";
import AddDonationConfirmDialog from "@/components/admin/AddDonationConfirmDialog";

const DonorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { donor, donations, loading, addLoading, addDonation, resetDonations } = useDonorProfile(id);

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

  // Add new donation with error handling, no toast
  const handleConfirmAddDonation = async () => {
    await addDonation();
    setShowConfirmDialog(false);
  };

  // Export donations to Excel
  const handleExportDonations = () => {
    import('@/utils/exportUtils').then(m =>
      m.exportToExcel(donations, `donor-${donor?.id}-donations`)
    );
  };

  if (loading) return <div>Loading profile...</div>;
  if (!donor) return <div>Donor not found.</div>;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <DonorProfileHeader onBack={handleBack} />
      
      <DonorInfoCard
        donor={donor}
        donationsCount={donations.length}
        onAddDonation={handleAddDonationClick}
        onExportDonations={handleExportDonations}
        onResetDonations={resetDonations}
        addLoading={addLoading}
      />
      
      <DonationHistoryCard donations={donations} />

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
