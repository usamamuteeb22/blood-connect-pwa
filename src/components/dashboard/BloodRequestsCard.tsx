
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MapPin } from "lucide-react";

interface BloodRequest {
  id: string;
  bloodType: string;
  location: string;
  distance: string;
  urgency: string;
  status: string;
  requestedAt: string;
}

interface BloodRequestsCardProps {
  requests: BloodRequest[];
}

const BloodRequestsCard = ({ requests }: BloodRequestsCardProps) => {
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Nearby Blood Requests</CardTitle>
        <CardDescription>Requests in your area that match your blood type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
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
  );
};

export default BloodRequestsCard;
