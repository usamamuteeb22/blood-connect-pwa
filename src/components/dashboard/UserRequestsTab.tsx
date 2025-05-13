
import { BloodRequest } from "@/types/custom";
import BloodRequestCard from "@/components/dashboard/BloodRequestCard";

interface UserRequestsTabProps {
  userRequests: BloodRequest[];
}

const UserRequestsTab = ({ userRequests }: UserRequestsTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">My Blood Requests</h2>
      {userRequests.length === 0 ? (
        <p className="text-gray-500 text-center py-10">You haven't made any blood requests yet.</p>
      ) : (
        <div className="space-y-4">
          {userRequests.map((request) => (
            <BloodRequestCard 
              key={request.id} 
              request={request}
              viewMode="requester"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRequestsTab;
