
import StatsCard from "./stats/StatsCard";
import EligibilityCard from "./stats/EligibilityCard";
import ImpactCard from "./stats/ImpactCard";
import RecognitionCard from "./stats/RecognitionCard";
import BloodRequestsCard from "./BloodRequestsCard";

const DashboardOverview = () => {
  // Mock data
  const recentRequests = [
    {
      id: "req-001",
      bloodType: "A+",
      location: "City Hospital",
      distance: "2.5 km",
      urgency: "high",
      status: "pending",
      requestedAt: "2 hours ago"
    },
    {
      id: "req-002",
      bloodType: "O-",
      location: "Medical Center",
      distance: "5.1 km",
      urgency: "medium",
      status: "matched",
      requestedAt: "5 hours ago"
    },
    {
      id: "req-003",
      bloodType: "B+",
      location: "Community Hospital",
      distance: "1.8 km",
      urgency: "low",
      status: "fulfilled",
      requestedAt: "1 day ago"
    }
  ];
  
  const donorStats = {
    totalDonations: 8,
    lastDonation: "2023-04-15",
    bloodType: "A+",
    nextEligibleDate: "2023-07-15",
    impactLives: 24,
    eligibilityProgress: 75,
    rank: "Silver Donor",
    badges: ["Regular Donor", "First Time", "Responsive"]
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Next Eligible Donation" 
          description="Based on your last donation"
        >
          <EligibilityCard 
            eligibilityProgress={donorStats.eligibilityProgress} 
            nextEligibleDate={donorStats.nextEligibleDate} 
          />
        </StatsCard>
        
        <StatsCard 
          title="Your Impact" 
          description="Lives potentially saved"
        >
          <ImpactCard 
            impactLives={donorStats.impactLives} 
            totalDonations={donorStats.totalDonations} 
          />
        </StatsCard>
        
        <StatsCard 
          title="Recognition" 
          description="Your donor status"
        >
          <RecognitionCard 
            rank={donorStats.rank} 
            bloodType={donorStats.bloodType} 
            badges={donorStats.badges} 
          />
        </StatsCard>
      </div>
      
      <BloodRequestsCard requests={recentRequests} />
    </div>
  );
};

export default DashboardOverview;
