
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DonateHero from "@/components/donation/DonateHero";
import DonationTabs from "@/components/donation/DonationTabs";

const Donate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("donate");
  
  // Check if we need to activate a specific tab based on navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Handle button clicks
  const handleCheckEligibility = () => {
    toast({
      title: "Eligibility Check",
      description: "Based on the criteria, you appear to be eligible to donate blood. Please consult with a healthcare professional for a final determination.",
    });
  };

  const handleFullEligibilityCheck = () => {
    toast({
      title: "Full Eligibility Guide",
      description: "Please answer a few questions to determine your eligibility to donate blood.",
    });
    // In a real app, this would open a modal or navigate to a detailed eligibility questionnaire
  };

  const handleFindDonationCenters = () => {
    toast({
      title: "Donation Centers",
      description: "We're finding donation centers near your location.",
    });
    // In a real app, this would show a map of nearby donation centers
  };

  const handleScheduleDonation = () => {
    toast({
      title: "Schedule Donation",
      description: "Please sign in to schedule your blood donation appointment.",
    });
    navigate("/auth");
  };

  const handleEmergencyRequest = () => {
    toast({
      title: "Request Submitted",
      description: "Your blood request has been submitted. You'll be notified when donors respond.",
    });
    setActiveTab("request");
  };

  const handleViewPastRequests = () => {
    toast({
      title: "Authentication Required",
      description: "Please sign in to view your past blood requests.",
    });
    navigate("/auth");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <DonateHero onCheckEligibility={handleCheckEligibility} />
        
        {/* Main Content */}
        <DonationTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onFullEligibilityCheck={handleFullEligibilityCheck}
          onFindDonationCenters={handleFindDonationCenters}
          onScheduleDonation={handleScheduleDonation}
          onEmergencyRequest={handleEmergencyRequest}
          onViewPastRequests={handleViewPastRequests}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
