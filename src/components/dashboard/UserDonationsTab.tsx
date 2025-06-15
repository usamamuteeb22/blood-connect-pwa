
import { Donation } from "@/types/custom";

interface UserDonationsTabProps {
  userDonations: Donation[];
}

const UserDonationsTab = ({ userDonations }: UserDonationsTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">My Donations</h2>
      {userDonations.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          You haven't made any blood donations yet. Approve a donation request to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {userDonations.map((donation, index) => (
            <div key={`donation-${index}`} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(donation.donation_date).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  {donation.status}
                </span>
              </div>
              <p className="font-medium">Recipient: {donation.recipient_name}</p>
              <p className="text-sm text-gray-500">
                Blood Type: {donation.blood_type} • Location: {donation.city} • Units: {donation.units_donated}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDonationsTab;
