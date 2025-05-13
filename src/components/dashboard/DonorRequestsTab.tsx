
import { BloodRequest } from "@/types/custom";
import BloodRequestCard from "@/components/dashboard/BloodRequestCard";

interface DonorRequestsTabProps {
  donorRequests: BloodRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const DonorRequestsTab = ({ donorRequests, onApprove, onReject }: DonorRequestsTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Blood Donation Requests</h2>
      {donorRequests.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          You don't have any blood donation requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {donorRequests.map((request) => (
            <BloodRequestCard 
              key={request.id} 
              request={request}
              viewMode="donor"
              onApprove={() => onApprove(request.id)}
              onReject={() => onReject(request.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorRequestsTab;
