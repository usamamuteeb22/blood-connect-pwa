import { BloodRequest } from "@/types/custom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface UserRequestsTabProps {
  userRequests: BloodRequest[];
}

interface RequestWithDonor extends BloodRequest {
  reason: string;
  donor_name: string | null;
  donor_phone: string | null;
}

const UserRequestsTab = ({ userRequests }: UserRequestsTabProps) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestWithDonor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestsWithDonor = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch all requests made by this user (regardless of status)
        // Join donors table for donor_id if present
        const { data, error } = await supabase
          .from("blood_requests")
          .select(`
            id,
            reason,
            city,
            address,
            contact,
            blood_type,
            created_at,
            status,
            donor_id,
            donors:donor_id (
              name,
              phone
            )
          `)
          .eq("requester_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Get display name from user_metadata or fallback to email
        const displayName =
          (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
          user.email ||
          "Unknown";

        // Format data for UI
        const formatted = (data || []).map((r: any) => ({
          id: r.id,
          reason: r.reason,
          city: r.city,
          address: r.address,
          contact: r.contact,
          blood_type: r.blood_type,
          created_at: r.created_at,
          status: r.status as "pending" | "approved" | "rejected" | "completed",
          donor_id: r.donor_id,
          donor_name: r.donors?.name || null,
          donor_phone: r.donors?.phone || null,
          requester_id: user.id,
          requester_name: displayName,
        }));

        setRequests(formatted);
      } catch (error) {
        console.error("Error fetching user requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestsWithDonor();
  }, [user, userRequests]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
        <p className="text-gray-500 text-center py-10">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">My Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          You have not made any blood requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`p-4 border rounded-lg space-y-3 ${
                req.status === "approved"
                  ? "bg-green-50 border-green-200"
                  : req.status === "pending"
                  ? "bg-amber-50 border-amber-200"
                  : req.status === "rejected"
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blood text-white flex items-center justify-center font-medium">
                    {req.blood_type}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {req.status === "pending" && "Request Sent"}
                      {req.status === "approved" && "Request Approved!"}
                      {req.status === "rejected" && "Request Rejected"}
                      {req.status === "completed" && "Request Completed"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    req.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : req.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : req.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-200 text-gray-700"
                  }
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Reason</p>
                  <p>{req.reason ? req.reason : "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">City</p>
                  <p>{req.city}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Contact</p>
                  <p>{req.contact}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Address</p>
                  <p>{req.address}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Requested Donor</p>
                  {req.donor_name ? (
                    <Badge variant="outline" className="border-green-500 text-green-900 bg-green-50">
                      {req.donor_name}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">No specific donor (general request)</span>
                  )}
                </div>
                {req.donor_phone && (
                  <div>
                    <p className="text-gray-500 font-medium">Donor Contact</p>
                    <Badge variant="outline" className="border-green-500 text-green-900 bg-green-50">
                      {req.donor_phone}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRequestsTab;
