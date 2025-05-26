
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { LayoutDashboard, Search, ListOrdered, Heart, List, Map } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Import refactored components
import DonorEligibility from "@/components/dashboard/DonorEligibility";
import ImpactStats from "@/components/dashboard/ImpactStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UserRequestsTab from "@/components/dashboard/UserRequestsTab";
import UserDonationsTab from "@/components/dashboard/UserDonationsTab";
import DonorRequestsTab from "@/components/dashboard/DonorRequestsTab";
import AvailableDonorsList from "@/components/dashboard/AvailableDonorsList";
import MapDonorFinder from "@/components/dashboard/MapDonorFinder";

// Import dashboard context
import { useDashboard } from "@/contexts/DashboardContext";

const DashboardContainer = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
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
      <TabsList className="flex flex-wrap gap-1 h-auto p-1">
        <TabsTrigger value="overview" className="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <LayoutDashboard className="h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="donors" className="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <Search className="h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>Find Donors</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <Map className="h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>Map View</span>
        </TabsTrigger>
        <TabsTrigger value="requests" className="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <ListOrdered className="h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>My Requests</span>
        </TabsTrigger>
        <TabsTrigger value="donations" className="flex items-center gap-2 flex-grow sm:flex-grow-0">
          <Heart className="h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>My Donations</span>
        </TabsTrigger>
        {userDonor && (
          <TabsTrigger value="donor-requests" className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <List className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : ""}>Donation Requests</span>
          </TabsTrigger>
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
      
      <TabsContent value="donors">
        <AvailableDonorsList onDonorSelect={onDonorSelect} />
      </TabsContent>
      
      <TabsContent value="map">
        <MapDonorFinder onDonorSelect={onDonorSelect} />
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
