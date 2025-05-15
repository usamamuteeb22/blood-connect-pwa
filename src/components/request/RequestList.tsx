
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RequestCard from "./RequestCard";

const RequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blood requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blood_requests')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setRequests(data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Active Blood Requests</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No blood requests found.</p>
            <Button 
              className="mt-4 bg-blood hover:bg-blood-600"
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
