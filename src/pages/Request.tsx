
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Request = () => {
  const { isAuthenticated } = useAuth();
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-red-50 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Blood <span className="text-blood">Requests</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              View all active blood requests or create your own request if you need blood.
            </p>
            <Button 
              className="bg-blood hover:bg-blood-600 text-white"
              onClick={() => navigate('/donate', { state: { activeTab: 'request' } })}
            >
              I Need Blood
            </Button>
          </div>
        </section>
        
        {/* Public Requests Feed */}
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
                  <div key={request.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-12 w-12 rounded-full bg-blood text-white flex items-center justify-center font-bold text-lg">
                        {request.blood_type}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{request.requester_name}</h3>
                        <p className="text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {request.reason && (
                        <div className="col-span-2">
                          <h4 className="text-sm text-gray-500">Reason for Request</h4>
                          <p>{request.reason}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm text-gray-500">City</h4>
                        <p>{request.city}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Contact</h4>
                        <p>{request.contact}</p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-sm text-gray-500">Address</h4>
                        <p>{request.address}</p>
                      </div>
                    </div>
                    
                    {isAuthenticated ? (
                      <div className="flex justify-end">
                        <Button 
                          className="bg-blood hover:bg-blood-600"
                          onClick={() => navigate('/dashboard', { state: { activeTab: 'donors' } })}
                        >
                          I Want to Donate
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <Button 
                          className="bg-blood hover:bg-blood-600"
                          onClick={() => navigate('/auth')}
                        >
                          Sign In to Donate
                        </Button>
                      </div>
                    )}
                  </div>
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

        {/* Call to Action */}
        <section className="py-12 bg-blood-50 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need Blood Urgently?</h2>
            <p className="max-w-2xl mx-auto mb-6">Submit your blood request and connect with potential donors quickly.</p>
            <Button 
              className="bg-blood hover:bg-blood-600"
              onClick={() => navigate('/donate', { state: { activeTab: 'request' } })}
            >
              Create Blood Request
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Request;
