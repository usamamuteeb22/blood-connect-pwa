
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleX, Clock, BadgeAlert } from "lucide-react";
import { BloodRequest } from "@/types/custom";
import { Button } from "@/components/ui/button";

// Helper function: format time since creation
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now.getTime() - then.getTime();
  if (isNaN(diffMs)) return "N/A";
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

// Helper: status meta info
const statusMeta = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-800",
    desc: "Waiting for donor action or admin approval.",
    icon: <Clock className="w-4 h-4 mr-1 inline" />,
    next: "You may cancel if needed.",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    desc: "Your request was approved by the donor.",
    icon: <CircleCheck className="w-4 h-4 mr-1 inline" />,
    next: "You should contact the donor to proceed.",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    desc: "Request was declined by the donor.",
    icon: <CircleX className="w-4 h-4 mr-1 inline" />,
    next: "You can create a new request or try another donor.",
  },
  completed: {
    label: "Completed",
    color: "bg-blue-50 text-blue-800",
    desc: "Request marked as fulfilled.",
    icon: <CircleCheck className="w-4 h-4 mr-1 inline" />,
    next: "Thank you for using our platform!",
  },
};

// Helper: request type
const getRequestTypeBadge = (req: any) => {
  return req.donor_name ? (
    <Badge variant="outline" className="border-cyan-700 text-cyan-900 bg-cyan-50 flex items-center gap-1">
      <BadgeAlert className="w-3 h-3" /> Direct Donor Request
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-gray-200 text-gray-800 flex items-center gap-1">
      General Request
    </Badge>
  );
};

interface RequestWithDonor extends BloodRequest {
  reason: string;
  donor_name: string | null;
  donor_phone: string | null;
  donor_next_eligible_date?: string | null;
  donor_is_eligible?: boolean | null;
  updated_at?: string | null;
}

interface UserRequestsTabProps {
  userRequests: BloodRequest[];
}

const UserRequestsTab = ({ userRequests }: UserRequestsTabProps) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestWithDonor[]>([]);
  const [loading, setLoading] = useState(true);

  // For action UI feedback
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  // Cancel handler
  const handleCancel = async (id: string) => {
    setCancelingId(id);
    try {
      const { error } = await supabase
        .from("blood_requests")
        .update({ status: "rejected" })
        .eq("id", id)
        .eq("requester_id", user.id)
        .eq("status", "pending");
      if (error) throw error;
      // Refresh
      setRequests((reqs) =>
        reqs.map((req) =>
          req.id === id ? { ...req, status: "rejected" } : req
        )
      );
    } catch (err) {
      console.error("Cancel request failed:", err);
      // Optionally: toast error
    }
    setCancelingId(null);
  };

  useEffect(() => {
    const fetchRequestsWithDonor = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch all requests made by this user (regardless of status)
        // Join donors table for donor_id if present (add donor_next_eligible_date)
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
            updated_at,
            donors:donor_id (
              name,
              phone,
              next_eligible_date,
              is_eligible
            )
          `)
          .eq("requester_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Get display name
        const displayName =
          (user.user_metadata &&
            (user.user_metadata.full_name || user.user_metadata.name)) ||
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
          updated_at: r.updated_at || r.created_at,
          status: r.status as "pending" | "approved" | "rejected" | "completed",
          donor_id: r.donor_id,
          donor_name: r.donors?.name || null,
          donor_phone: r.donors?.phone || null,
          donor_next_eligible_date: r.donors?.next_eligible_date || null,
          donor_is_eligible: typeof r.donors?.is_eligible === 'boolean' ? r.donors.is_eligible : null,
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
        <div className="space-y-6">
          {requests.map((req) => {
            const meta = statusMeta[req.status];
            return (
              <div
                key={req.id}
                className={`relative p-4 border rounded-lg space-y-3 shadow transition 
                  ${
                    req.status === "approved"
                      ? "bg-green-50 border-green-200"
                      : req.status === "pending"
                      ? "bg-amber-50 border-amber-200"
                      : req.status === "rejected"
                      ? "bg-red-50 border-red-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blood text-white flex items-center justify-center font-medium text-lg">
                      {req.blood_type}
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        <span className="font-medium text-base">
                          {meta.icon}
                          {meta.label}
                        </span>
                        <span className={`${meta.color} rounded px-2 py-0.5 text-xs font-semibold`}>
                          {meta.label}
                        </span>
                        {getRequestTypeBadge(req)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {meta.desc}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <span title={new Date(req.created_at).toLocaleString()}>
                      {getTimeAgo(req.created_at)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-1">
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
                      <Badge variant="outline" className="border-green-500 text-green-900 bg-green-50 flex gap-1">
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

                  {req.donor_next_eligible_date && (
                    <div>
                      <p className="text-gray-500 font-medium">Donor Next Eligible</p>
                      <span className="text-xs text-gray-600">
                        {
                          new Date(req.donor_next_eligible_date) <= new Date()
                            ? "Available Now"
                            : `Available from ${new Date(
                                req.donor_next_eligible_date
                              ).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  )}
                  {typeof req.donor_is_eligible === 'boolean' && (
                    <div>
                      <p className="text-gray-500 font-medium">Donor Eligibility</p>
                      <Badge
                        variant="outline"
                        className={req.donor_is_eligible ? "border-green-500 text-green-900 bg-green-50" : "border-red-500 text-red-900 bg-red-50"}
                      >
                        {req.donor_is_eligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Timeline/History */}
                <div className="text-xs text-muted-foreground pt-1">
                  <span>
                    Requested: {new Date(req.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {req.updated_at && req.updated_at !== req.created_at && (
                    <span className="ml-4">
                      Last updated: {new Date(req.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {req.donor_phone && req.status === "approved" && (
                    <a
                      href={`tel:${req.donor_phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="bg-green-600 hover:bg-green-800 text-white">
                        Contact Donor
                      </Button>
                    </a>
                  )}

                  {req.status === "pending" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancel(req.id)}
                      disabled={cancelingId === req.id}
                    >
                      {cancelingId === req.id ? "Cancelling..." : "Cancel Request"}
                    </Button>
                  )}

                  {/* Add more future actions here */}
                </div>

                {/* Next Step Feedback */}
                <div className="mt-1 text-xs text-gray-700 italic">
                  {meta.next}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserRequestsTab;

