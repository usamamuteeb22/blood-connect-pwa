
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DonateHero from "@/components/donation/DonateHero";
import DonationTabs from "@/components/donation/DonationTabs";
import { useAuth } from "@/contexts/AuthContext";

const Donate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
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
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with the donation process.",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Eligibility Check",
      description: "Based on the criteria, you appear to be eligible to donate blood. Please consult with a healthcare professional for a final determination.",
    });
  };

  const handleFullEligibilityCheck = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with the donation process.",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Full Eligibility Guide",
      description: "Please answer a few questions to determine your eligibility to donate blood.",
    });
  };

  const handleFindDonationCenters = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view donation centers.",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Donation Centers",
      description: "We're finding donation centers near your location.",
    });
  };

  const handleScheduleDonation = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to schedule your blood donation appointment.",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Schedule Donation",
      description: "Please sign in to schedule your blood donation appointment.",
    });
  };

  const handleEmergencyRequest = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a blood request.",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Request Submitted",
      description: "Your blood request has been submitted. You'll be notified when donors respond.",
    });
    setActiveTab("request");
  };

  const handleViewPastRequests = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your past blood requests.",
      });
      navigate("/auth");
      return;
    }
    
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
