
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EligibilityCriteria from "./EligibilityCriteria";
import ImportantInformation from "./ImportantInformation";
import DonationProcess from "./DonationProcess";
import DonationRegistration from "./DonationRegistration";
import RequestForm from "./RequestForm";

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
  onFindDonationCenters,
  onScheduleDonation,
  activeTab,
  onTabChange
}: DonationTabsProps) => {
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
                <EligibilityCriteria onFullEligibilityCheck={onFullEligibilityCheck} />
                <ImportantInformation />
              </div>
              
              <div className="space-y-8">
                <DonationProcess />
                <DonationRegistration 
                  onFindDonationCenters={onFindDonationCenters}
                  onScheduleDonation={onScheduleDonation}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="request">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Submit a Blood Request</h2>
              <RequestForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DonationTabs;
