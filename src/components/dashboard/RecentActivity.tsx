
import { BloodRequest, Donation } from "@/types/custom";

interface RecentActivityProps {
  userRequests: BloodRequest[];
  userDonations: Donation[];
  donorRequests: BloodRequest[];
}

const RecentActivity = ({ userRequests, userDonations, donorRequests }: RecentActivityProps) => {
  const hasActivity = userRequests.length > 0 || userDonations.length > 0 || donorRequests.length > 0;

  return (
    <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      {!hasActivity ? (
        <p className="text-gray-500 text-center py-6">
          No recent activity to display. Start by making a blood request or registering as a donor!
        </p>
      ) : (
        <div className="space-y-4">
          {userRequests.slice(0, 3).map((request) => (
            <div key={request.id} className="flex justify-between border-b pb-4">
              <div>
                <p className="font-medium">Blood Request</p>
                <p className="text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  request.status === 'pending' 
                    ? 'bg-amber-100 text-amber-800'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                <p className="text-sm text-gray-500">{request.city}</p>
              </div>
            </div>
          ))}
          {userDonations.slice(0, 3).map((donation, index) => (
            <div key={`donation-${index}`} className="flex justify-between border-b pb-4">
              <div>
                <p className="font-medium">Donation Completed</p>
                <p className="text-sm text-gray-500">
                  {new Date(donation.donation_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
                <p className="text-sm text-gray-500">{donation.recipient_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
