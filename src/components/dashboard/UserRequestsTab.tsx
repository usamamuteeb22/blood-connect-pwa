
import { BloodRequest } from "@/types/custom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserRequestsTabProps {
  userRequests: BloodRequest[];
}

interface ApprovedRequest {
  id: string;
  reason: string;
  city: string;
  contact: string;
  donor_name: string;
  donor_contact: string;
  blood_type: string;
  created_at: string;
  status: string;
}

const UserRequestsTab = ({ userRequests }: UserRequestsTabProps) => {
  const { user } = useAuth();
  const [approvedRequests, setApprovedRequests] = useState<ApprovedRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      if (!user) return;
      
      try {
        // Fetch approved requests with donor information
        const { data, error } = await supabase
          .from('blood_requests')
          .select(`
            id,
            reason,
            city,
            contact,
            blood_type,
            created_at,
            status,
            donors:donor_id (
              name,
              phone
            )
          `)
          .eq('requester_id', user.id)
          .eq('status', 'approved');

        if (error) throw error;

        const formattedRequests = data?.map(request => ({
          id: request.id,
          reason: request.reason || '',
          city: request.city,
          contact: request.contact,
          donor_name: request.donors?.name || 'Unknown Donor',
          donor_contact: request.donors?.phone || 'Contact not available',
          blood_type: request.blood_type,
          created_at: request.created_at,
          status: request.status
        })) || [];

        setApprovedRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching approved requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRequests();
  }, [user, userRequests]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Blood Requests</h2>
        <p className="text-gray-500 text-center py-10">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">My Blood Requests</h2>
      {approvedRequests.length === 0 ? (
        <p className="text-gray-500 text-center py-10">You don't have any approved blood requests yet.</p>
      ) : (
        <div className="space-y-4">
          {approvedRequests.map((request) => (
            <div key={request.id} className="p-4 border rounded-lg space-y-3 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blood text-white flex items-center justify-center font-medium">
                    {request.blood_type}
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Request Approved!</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Reason for Request</p>
                  <p>{request.reason}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Your City</p>
                  <p>{request.city}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Your Contact</p>
                  <p>{request.contact}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Donor Name</p>
                  <p className="font-medium text-green-700">{request.donor_name}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 font-medium">Donor Contact</p>
                  <p className="font-medium text-green-700">{request.donor_contact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRequestsTab;
