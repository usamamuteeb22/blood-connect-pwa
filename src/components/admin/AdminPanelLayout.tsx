
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AdminPanelHeader from "./AdminPanelHeader";
import DonorManagementSection from "./DonorManagementSection";
import { useAdminDonors } from "@/hooks/useAdminDonors";

const AdminPanelLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const {
    donors,
    filteredDonors,
    donorsLoading,
    searchQuery,
    setSearchQuery,
    locationQuery,
    setLocationQuery,
    bloodGroupFilter,
    setBloodGroupFilter,
    showAddDialog,
    setShowAddDialog,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    downloadLoading,
    fetchDonors,
    handleDownloadDonations,
  } = useAdminDonors();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
      return;
    }
    if (user && isAdmin) fetchDonors();
    // eslint-disable-next-line
  }, [user, isAdmin, loading]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading || donorsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPanelHeader onSignOut={handleSignOut} />

      {/* Main Content */}
      <div className="container mx-auto px-2 py-4 md:py-8 flex flex-col gap-8">
        {/* Analytics */}
        <AnalyticsDashboard donors={donors} />

        {/* Donor Management */}
        <DonorManagementSection
          donors={donors}
          filteredDonors={filteredDonors}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          bloodGroupFilter={bloodGroupFilter}
          setBloodGroupFilter={setBloodGroupFilter}
          showAddDialog={showAddDialog}
          setShowAddDialog={setShowAddDialog}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={setEndDate}
          setEndDate={setEndDate}
          downloadLoading={downloadLoading}
          onRefresh={fetchDonors}
          onDownloadDonations={handleDownloadDonations}
        />
      </div>
    </div>
  );
};

export default AdminPanelLayout;
