
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImportantInformation from "./ImportantInformation";
import DonationProcess from "./DonationProcess";
import RequestForm from "./RequestForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DonationTabsProps {
  onFullEligibilityCheck: () => void;
  onFindDonationCenters: () => void;
  onScheduleDonation: () => void;
  onEmergencyRequest: () => void;
  onViewPastRequests: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DonationTabs = ({
  onFullEligibilityCheck,
  activeTab,
  onTabChange
}: DonationTabsProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Handle form access with auth check
  const handleFormAccess = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return false;
    }
    return true;
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-2">
              <TabsTrigger value="donate">I Want to Donate</TabsTrigger>
              <TabsTrigger value="request">I Need Blood</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="donate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Eligibility Criteria section removed */}
                <ImportantInformation />
              </div>
              
              <div className="space-y-8">
                <DonationProcess />
                {/* Removed DonationRegistration component */}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="request">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Submit a Blood Request</h2>
              {isAuthenticated ? (
                <RequestForm />
              ) : (
                <div className="text-center py-8">
                  <p className="mb-4">Please sign in to submit a blood request</p>
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="bg-blood hover:bg-blood-600"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DonationTabs;
