
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Import refactored components
import DonorEligibility from "@/components/dashboard/DonorEligibility";
import ImpactStats from "@/components/dashboard/ImpactStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UserRequestsTab from "@/components/dashboard/UserRequestsTab";
import UserDonationsTab from "@/components/dashboard/UserDonationsTab";
import DonorRequestsTab from "@/components/dashboard/DonorRequestsTab";
import LocationMap from "@/components/map/LocationMap";

// Import dashboard context
import { useDashboard } from "@/contexts/DashboardContext";

const DashboardContainer = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Use dashboard context instead of props
  const {
    userDonor,
    userRequests,
    userDonations,
    donorRequests,
    donationCount,
    nextEligibleDate,
    onDonorSelect,
    onApproveRequest,
    onRejectRequest
  } = useDashboard();

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="map">Find Donors</TabsTrigger>
        <TabsTrigger value="requests">My Requests</TabsTrigger>
        <TabsTrigger value="donations">My Donations</TabsTrigger>
        {userDonor && (
          <TabsTrigger value="donor-requests">Donation Requests</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userDonor && <DonorEligibility nextEligibleDate={nextEligibleDate} />}
          <ImpactStats donationCount={donationCount} />
          <RecentActivity 
            userRequests={userRequests} 
            userDonations={userDonations} 
            donorRequests={donorRequests} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="map">
        <LocationMap onDonorSelect={onDonorSelect} />
      </TabsContent>
      
      <TabsContent value="requests">
        <UserRequestsTab userRequests={userRequests} />
      </TabsContent>
      
      <TabsContent value="donations">
        <UserDonationsTab userDonations={userDonations} />
      </TabsContent>

      {userDonor && (
        <TabsContent value="donor-requests">
          <DonorRequestsTab 
            donorRequests={donorRequests} 
            onApprove={onApproveRequest} 
            onReject={onRejectRequest} 
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default DashboardContainer;
