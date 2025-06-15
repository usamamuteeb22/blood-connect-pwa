
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleX, Clock, BadgeAlert, Phone, Calendar, MapPin, AlertCircle } from "lucide-react";
import { BloodRequestWithDonor } from "@/types/custom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    desc: "Waiting for donor response.",
    icon: <Clock className="w-4 h-4 mr-1 inline" />,
    next: "You may cancel if needed.",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    desc: "Your request was approved by the donor.",
    icon: <CircleCheck className="w-4 h-4 mr-1 inline" />,
    next: "Contact the donor to coordinate donation.",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    desc: "Request was declined by the donor.",
    icon: <CircleX className="w-4 h-4 mr-1 inline" />,
    next: "You can create a new request.",
  },
  completed: {
    label: "Completed",
    color: "bg-blue-50 text-blue-800",
    desc: "Request has been fulfilled.",
    icon: <CircleCheck className="w-4 h-4 mr-1 inline" />,
    next: "Thank you for using our platform!",
  },
};

interface UserRequestsTabProps {
  userRequests: any[];
}

const UserRequestsTab = ({ userRequests }: UserRequestsTabProps) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequestWithDonor[]>([]);
  const [loading, setLoading] = useState(true);
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
      
      setRequests((reqs) =>
        reqs.map((req) =>
          req.id === id ? { ...req, status: "rejected" as const } : req
        )
      );
      
      toast.success("Request cancelled successfully.");
    } catch (err) {
      console.error("Cancel request failed:", err);
      toast.error("Failed to cancel request. Please try again.");
    }
    setCancelingId(null);
  };

  useEffect(() => {
    const fetchRequestsWithDonor = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch blood requests with donor information via join
        const { data, error } = await supabase
          .from("blood_requests")
          .select(`
            *,
            donors:donor_id (
              name,
              phone,
              email,
              is_eligible,
              next_eligible_date
            )
          `)
          .eq("requester_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Transform the data to match our expected format
        const transformedData = (data || []).map((request: any) => ({
          ...request,
          urgency_level: 'normal' as const, // Default values for missing fields
          needed_by: null,
          units_needed: 1,
          hospital_name: null,
          doctor_name: null,
          additional_notes: null,
          approved_at: null,
          completed_at: null,
          updated_at: request.created_at,
          donor_name: request.donors?.name || null,
          donor_phone: request.donors?.phone || null,
          donor_email: request.donors?.email || null,
          donor_is_eligible: request.donors?.is_eligible || null,
          donor_next_eligible_date: request.donors?.next_eligible_date || null,
        }));

        setRequests(transformedData);
      } catch (error) {
        console.error("Error fetching user requests:", error);
        setRequests([]);
        toast.error("Failed to load your requests.");
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
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="font-medium text-base">
                          {meta.icon}
                          {meta.label}
                        </span>
                        <span className={`${meta.color} rounded px-2 py-0.5 text-xs font-semibold`}>
                          {meta.label}
                        </span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-1">
                  <div>
                    <p className="text-gray-500 font-medium">Reason</p>
                    <p className="break-words">{req.reason}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Location
                    </p>
                    <p>{req.city}</p>
                    <p className="text-xs text-gray-600">{req.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Contact
                    </p>
                    <p>{req.contact}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 font-medium">Assigned Donor</p>
                    {req.donor_name ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="border-green-500 text-green-900 bg-green-50">
                          {req.donor_name}
                        </Badge>
                        {req.donor_phone && (
                          <p className="text-xs text-gray-600">{req.donor_phone}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No specific donor assigned</span>
                    )}
                  </div>

                  {req.donor_next_eligible_date && (
                    <div>
                      <p className="text-gray-500 font-medium">Donor Availability</p>
                      <span className="text-xs text-gray-600">
                        {
                          new Date(req.donor_next_eligible_date) <= new Date()
                            ? "Available Now"
                            : `Available from ${new Date(req.donor_next_eligible_date).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Timeline/History */}
                <div className="text-xs text-muted-foreground pt-1 border-t">
                  <span>
                    Requested: {new Date(req.created_at).toLocaleDateString("en-US", { 
                      year: "numeric", month: "short", day: "numeric", 
                      hour: "2-digit", minute: "2-digit" 
                    })}
                  </span>
                  {req.updated_at && req.updated_at !== req.created_at && (
                    <span className="ml-4">
                      Last updated: {new Date(req.updated_at).toLocaleDateString("en-US", { 
                        year: "numeric", month: "short", day: "numeric", 
                        hour: "2-digit", minute: "2-digit" 
                      })}
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
                        <Phone className="w-4 h-4 mr-1" />
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
