
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DonateHeroProps {
  onCheckEligibility?: () => void;
}

const DonateHero = ({ onCheckEligibility }: DonateHeroProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleButtonClick = () => {
    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      navigate("/auth");
      return;
    }
    
    if (onCheckEligibility) {
      onCheckEligibility();
    }
    // Navigate to eligibility form
    navigate("/donate/eligibility");
  };
  
  return (
    <section className="relative bg-red-50 py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Become a <span className="text-blood">Lifesaver</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Your blood donation can save up to 3 lives. Join our community of donors and make a difference today.
        </p>
        <Button
          onClick={handleButtonClick}
          className="bg-blood hover:bg-blood-600 text-white px-8 py-6 text-lg"
        >
          Become a Donor
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden lg:block absolute top-1/2 left-12 transform -translate-y-1/2">
        <div className="h-40 w-40 rounded-full bg-blood/10 animate-pulse-slow"></div>
      </div>
      <div className="hidden lg:block absolute top-1/4 right-16">
        <div className="h-24 w-24 rounded-full bg-blood/10 animate-pulse-slow"></div>
      </div>
    </section>
  );
};

export default DonateHero;
