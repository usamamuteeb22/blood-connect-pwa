
import { useState, useEffect } from "react";
import { BloodRequest } from "@/types/custom";
import BloodRequestCard from "@/components/dashboard/BloodRequestCard";

interface DonorRequestsTabProps {
  donorRequests: BloodRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const DonorRequestsTab = ({ donorRequests: initialRequests, onApprove, onReject }: DonorRequestsTabProps) => {
  // Only display pending requests
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  // Update local state whenever initialRequests changes, filtering for pending requests only
  useEffect(() => {
    // Only show pending requests from the initialRequests
    const pendingRequests = initialRequests.filter(request => request.status === "pending");
    setRequests(pendingRequests);
  }, [initialRequests]);
  
  // Handle approving a blood request
  const handleApprove = async (requestId: string) => {
    try {
      // Remove the request immediately from the local state
      setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      
      // Call the parent handler
      await onApprove(requestId);
    } catch (error) {
      // If there's an error, add the request back to the local state
      const requestToRestore = initialRequests.find(req => req.id === requestId);
      if (requestToRestore && requestToRestore.status === "pending") {
        setRequests(prevRequests => [...prevRequests, requestToRestore]);
      }
      console.error("Failed to approve request:", error);
    }
  };
  
  // Handle rejecting a blood request
  const handleReject = async (requestId: string) => {
    try {
      // Remove the request immediately from the local state
      setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      
      // Call the parent handler
      await onReject(requestId);
    } catch (error) {
      // If there's an error, add the request back to the local state
      const requestToRestore = initialRequests.find(req => req.id === requestId);
      if (requestToRestore && requestToRestore.status === "pending") {
        setRequests(prevRequests => [...prevRequests, requestToRestore]);
      }
      console.error("Failed to reject request:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Blood Donation Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          You don't have any pending blood donation requests.
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
