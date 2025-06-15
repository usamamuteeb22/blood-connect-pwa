
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const { user, loading: authLoading, isAuthenticated } = useAuth();
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
    loading: dataLoading,
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
    try {
      await handleSendRequest();
      refreshData(); // Refresh data after sending request
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };
  
  const onApproveRequest = async (requestId: string) => {
    try {
      const result = await handleApproveRequest(requestId);
      refreshData(); // Refresh data after approving request
      return result;
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  };
  
  const onRejectRequest = async (requestId: string) => {
    try {
      const result = await handleRejectRequest(requestId);
      refreshData(); // Refresh data after rejecting request
      return result;
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  };

  // Show loading state while auth or data is loading
  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Navbar is now globally rendered in App */}
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Navbar is now globally rendered in App */}
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Please sign in to access your dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  // Create context value with proper validation and error handling
  const dashboardContextValue = {
    userDonor: userDonor || null,
    userRequests: Array.isArray(userRequests) ? userRequests : [],
    userDonations: Array.isArray(userDonations) ? userDonations : [],
    donorRequests: Array.isArray(donorRequests) ? donorRequests : [],
    donationCount: typeof donationCount === 'number' ? donationCount : 0,
    nextEligibleDate: nextEligibleDate || null,
    onDonorSelect: handleDonorSelect,
    onApproveRequest,
    onRejectRequest
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar is now globally rendered in App */}
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
