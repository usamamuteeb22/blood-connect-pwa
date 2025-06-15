
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RequestCard from "./RequestCard";
import { BloodRequestWithDonor } from "@/types/custom";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, MapPin, Zap } from "lucide-react";

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'needed_today': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'needed_today': return <Zap className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'Critical';
      case 'needed_today': return 'Needed Today';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true;
    if (filter === "critical") return request.urgency_level === 'critical';
    if (filter === "needed_today") return request.urgency_level === 'needed_today';
    if (filter === "normal") return request.urgency_level === 'normal';
    return request.blood_type === filter;
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Active Blood Requests</h2>
            <p className="text-gray-600">Help save lives by responding to these urgent requests</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Requests
            </Button>
            <Button
              variant={filter === "critical" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setFilter("critical")}
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              Critical
            </Button>
            <Button
              variant={filter === "needed_today" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("needed_today")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Zap className="w-4 h-4 mr-1" />
              Needed Today
            </Button>
            <Button
              variant={filter === "normal" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("normal")}
            >
              Normal
            </Button>
            {bloodTypes.map(type => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type)}
                className="min-w-[50px]"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((request) => (
              <div key={request.id} className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${getUrgencyColor(request.urgency_level)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {request.blood_type}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{request.requester_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`${getUrgencyColor(request.urgency_level)} text-xs`}>
                          {getUrgencyLabel(request.urgency_level)}
                        </Badge>
                        {getUrgencyIcon(request.urgency_level)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{request.city}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Reason: </span>
                    <span className="text-gray-700">{request.reason}</span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Units needed: </span>
                    <span className="text-gray-700">{request.units_needed}</span>
                  </div>

                  {request.needed_by && (
                    <div className="text-sm">
                      <span className="font-medium">Needed by: </span>
                      <span className="text-gray-700">{new Date(request.needed_by).toLocaleDateString()}</span>
                    </div>
                  )}

                  {request.hospital_name && (
                    <div className="text-sm">
                      <span className="font-medium">Hospital: </span>
                      <span className="text-gray-700">{request.hospital_name}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Posted {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => navigate('/dashboard', { state: { openRequestDialog: request } })}
                  >
                    Respond to Request
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${request.contact}`, '_blank')}
                  >
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {filter === "all" ? "No blood requests found." : `No ${filter.replace('_', ' ')} requests found.`}
            </p>
            <Button 
              className="bg-blood hover:bg-blood-600"
              onClick={() => navigate('/donate', { state: { activeTab: 'request' } })}
            >
              Create a Request
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RequestList;
