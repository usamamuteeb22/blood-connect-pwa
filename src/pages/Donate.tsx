import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DonateHero from "@/components/donation/DonateHero";
import DonationTabs from "@/components/donation/DonationTabs";
import { useAuth } from "@/contexts/AuthContext";

const Donate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("donate");
  
  // Check if we need to activate a specific tab based on navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Handle button clicks
  const handleCheckEligibility = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
  };

  const handleFullEligibilityCheck = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    navigate("/donate/eligibility");
  };

  const handleFindDonationCenters = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
  };

  const handleScheduleDonation = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
  };

  const handleEmergencyRequest = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setActiveTab("request");
  };

  const handleViewPastRequests = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    navigate("/auth");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar is now globally rendered in App */}
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
    </div>
  );
};

export default Donate;
