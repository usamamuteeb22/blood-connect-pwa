
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BloodRequestWithDonor } from "@/types/custom";
import RequestFilters from "./RequestFilters";
import RequestGrid from "./RequestGrid";
import RequestEmptyState from "./RequestEmptyState";

const RequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BloodRequestWithDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // Fetch all blood requests with donor info using join
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blood_requests')
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
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Transform the data to match BloodRequestWithDonor interface
          const transformedData = data.map((request: any) => ({
            ...request,
            urgency_level: request.urgency_level || 'normal',
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
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true;
    if (filter === "critical") return request.urgency_level === 'critical';
    if (filter === "needed_today") return request.urgency_level === 'needed_today';
    if (filter === "normal") return request.urgency_level === 'normal';
    
    // Check if filter is a blood type
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (bloodTypes.includes(filter)) {
      return request.blood_type === filter;
    }
    
    return false;
  });

  const handleShowInfo = (request: BloodRequestWithDonor) => {
    // This function is now handled within the card component
    console.log("Show info for request:", request.id);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Active Blood Requests</h2>
            <p className="text-gray-600">Help save lives by responding to these urgent requests</p>
          </div>
          
          <RequestFilters filter={filter} onFilterChange={setFilter} />
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <RequestGrid requests={filteredRequests} onRespond={handleShowInfo} />
        ) : (
          <RequestEmptyState filter={filter} onCreateRequest={() => 
            navigate('/donate', { state: { activeTab: 'request' } })
          } />
        )}
      </div>
    </section>
  );
};

export default RequestList;
