
import { useState } from "react";
import { BloodRequest } from "@/types/custom";
import BloodRequestCard from "@/components/dashboard/BloodRequestCard";
import { useToast } from "@/hooks/use-toast";

interface DonorRequestsTabProps {
  donorRequests: BloodRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const DonorRequestsTab = ({ donorRequests: initialRequests, onApprove, onReject }: DonorRequestsTabProps) => {
  const [requests, setRequests] = useState(initialRequests);
  const { toast } = useToast();
  
  // Handle approving a blood request
  const handleApprove = async (requestId: string) => {
    try {
      await onApprove(requestId);
      // Update the local state to show the request as approved
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: "approved" } 
            : request
        )
      );
      
      toast({
        title: "Request approved",
        description: "You've successfully approved this blood donation request.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle rejecting a blood request
  const handleReject = async (requestId: string) => {
    try {
      await onReject(requestId);
      // Remove the rejected request from the displayed list
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      toast({
        title: "Request rejected",
        description: "You've rejected this blood donation request.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Blood Donation Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          You don't have any blood donation requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <BloodRequestCard 
              key={request.id} 
              request={request}
              viewMode="donor"
              onApprove={() => handleApprove(request.id)}
              onReject={() => handleReject(request.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorRequestsTab;
