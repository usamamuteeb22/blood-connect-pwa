
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, MapPin, User } from "lucide-react";

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
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "matched":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fulfilled":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Next Eligible Donation</CardTitle>
            <CardDescription>Based on your last donation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Eligibility</span>
                <span className="text-sm font-medium">{donorStats.eligibilityProgress}%</span>
              </div>
              <Progress value={donorStats.eligibilityProgress} className="h-2" />
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">Next eligible date</span>
                <span className="text-sm font-medium">{donorStats.nextEligibleDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Your Impact</CardTitle>
            <CardDescription>Lives potentially saved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blood">{donorStats.impactLives}</p>
                <p className="text-sm text-gray-500">Lives impacted</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-2xl font-semibold">{donorStats.totalDonations}</p>
                <p className="text-sm text-gray-500">Total donations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recognition</CardTitle>
            <CardDescription>Your donor status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{donorStats.rank}</span>
                <Badge className="bg-blood">{donorStats.bloodType}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {donorStats.badges.map((badge, i) => (
                  <Badge key={i} variant="outline" className="border-blood-200 text-blood-700 bg-blood-50">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Nearby Blood Requests</CardTitle>
          <CardDescription>Requests in your area that match your blood type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div 
                key={request.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg card-hover"
              >
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blood-50 text-blood">
                    <span className="font-bold">{request.bloodType}</span>
                  </div>
                  <div>
                    <p className="font-medium">{request.location}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{request.distance}</span>
                      <span className="text-gray-300">•</span>
                      <Clock className="h-3 w-3" />
                      <span>{request.requestedAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Badge className={getUrgencyColor(request.urgency)}>
                    {request.urgency === "high" 
                      ? "Urgent" 
                      : request.urgency === "medium" ? "Needed Soon" : "Standard"
                    }
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status === "pending" && "Pending"}
                    {request.status === "matched" && "Matched"}
                    {request.status === "fulfilled" && (
                      <span className="flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Fulfilled
                      </span>
                    )}
                  </Badge>
                  {request.status === "pending" && (
                    <button className="text-sm text-blood hover:text-blood-700 hover:underline">
                      Respond
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
