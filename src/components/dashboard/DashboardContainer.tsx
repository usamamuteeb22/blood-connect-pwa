
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { LayoutDashboard, Search, ListOrdered, Heart, List, Map } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

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
  const [visitedTabs, setVisitedTabs] = useState<string[]>(["overview"]);
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

  // Track which tabs have new content
  const [newContentTabs, setNewContentTabs] = useState<Record<string, number>>({});

  // Update new content indicators based on data changes
  useEffect(() => {
    const newContent: Record<string, number> = {};
    
    // Check for new requests (assuming newer requests have higher counts)
    if (userRequests.length > 0) {
      newContent.requests = userRequests.filter(req => req.status === 'approved').length;
    }
    
    // Check for pending donor requests
    if (donorRequests.length > 0) {
      newContent['donor-requests'] = donorRequests.length;
    }

    setNewContentTabs(newContent);
  }, [userRequests, donorRequests]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    if (!visitedTabs.includes(tabValue)) {
      setVisitedTabs([...visitedTabs, tabValue]);
    }
    // Clear notification for visited tab
    if (newContentTabs[tabValue]) {
      setNewContentTabs(prev => {
        const updated = { ...prev };
        delete updated[tabValue];
        return updated;
      });
    }
  };

  const renderTabTrigger = (value: string, icon: React.ReactNode, label: string) => {
    const hasNewContent = newContentTabs[value] && !visitedTabs.includes(value);
    const contentCount = newContentTabs[value] || 0;

    return (
      <TabsTrigger 
        value={value} 
        className="flex items-center gap-2 flex-grow sm:flex-grow-0 relative"
      >
        {icon}
        <span className={isMobile ? "sr-only" : ""}>{label}</span>
        {hasNewContent && (
          <Badge 
            variant="destructive" 
            className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
          >
            {contentCount > 0 ? contentCount : ""}
          </Badge>
        )}
      </TabsTrigger>
    );
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-8">
      <TabsList className="flex flex-wrap gap-1 h-auto p-1">
        {renderTabTrigger("overview", <LayoutDashboard className="h-4 w-4" />, "Overview")}
        {renderTabTrigger("donors", <Search className="h-4 w-4" />, "Find Donors")}
        {renderTabTrigger("map", <Map className="h-4 w-4" />, "Map View")}
        {renderTabTrigger("requests", <ListOrdered className="h-4 w-4" />, "My Requests")}
        {renderTabTrigger("donations", <Heart className="h-4 w-4" />, "My Donations")}
        {userDonor && renderTabTrigger("donor-requests", <List className="h-4 w-4" />, "Donation Requests")}
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
