
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

// Import custom hooks
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardActions } from "@/hooks/useDashboardActions";

// Import refactored components
import DonorRegistrationDialog from "@/components/dashboard/DonorRegistrationDialog";
import DonorDetailsDialog from "@/components/dashboard/DonorDetailsDialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContainer from "@/components/dashboard/DashboardContainer";

// Import dashboard context
import { DashboardProvider } from "@/contexts/DashboardContext";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Check if we need to activate a specific tab based on navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Get dashboard data with refresh capability
  const {
    userDonor,
    userRequests,
    userDonations,
    donorRequests,
    donationCount,
    nextEligibleDate,
    refreshData
  } = useDashboardData();
  
  // Get dashboard actions
  const {
    selectedDonor,
    showDonorDialog,
    showRegisterDialog,
    setShowRegisterDialog,
    setShowDonorDialog,
    handleDonorSelect,
    handleSendRequest,
    handleApproveRequest,
    handleRejectRequest
  } = useDashboardActions();

  // Create wrapper functions to handle data refresh after actions
  const onSendRequest = async () => {
    await handleSendRequest();
    refreshData(); // Refresh data after sending request
  };
  
  const onApproveRequest = async (requestId: string) => {
    const result = await handleApproveRequest(requestId);
    refreshData(); // Refresh data after approving request
    return result;
  };
  
  const onRejectRequest = async (requestId: string) => {
    const result = await handleRejectRequest(requestId);
    refreshData(); // Refresh data after rejecting request
    return result;
  };

  // Create context value with proper validation
  const dashboardContextValue = {
    userDonor: userDonor || null,
    userRequests: userRequests || [],
    userDonations: userDonations || [],
    donorRequests: donorRequests || [],
    donationCount: donationCount || 0,
    nextEligibleDate: nextEligibleDate || null,
    onDonorSelect: handleDonorSelect,
    onApproveRequest,
    onRejectRequest
  };

  // Add loading state check
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <DashboardHeader 
            user={user} 
            userDonor={userDonor} 
            onRegisterClick={() => setShowRegisterDialog(true)} 
          />
          
          <DashboardProvider value={dashboardContextValue}>
            <DashboardContainer />
          </DashboardProvider>
        </div>
      </main>
      <Footer />
      
      <DonorRegistrationDialog 
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
      />
      
      <DonorDetailsDialog 
        open={showDonorDialog}
        onOpenChange={setShowDonorDialog}
        selectedDonor={selectedDonor}
        onSendRequest={onSendRequest}
      />
    </div>
  );
};

export default Dashboard;
