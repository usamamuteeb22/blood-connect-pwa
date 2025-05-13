import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LocationMap from "@/components/map/LocationMap";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import BloodRequestCard from "@/components/dashboard/BloodRequestCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DonorType {
  id: string;
  name: string;
  blood_type: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  next_eligible_date: string;
}

interface RequestType {
  id: string;
  requester_id: string;
  donor_id?: string;
  requester_name: string;
  blood_type: string;
  city: string;
  address: string;
  contact: string;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
}

interface DonationType {
  id: string;
  donor_id: string;
  request_id: string;
  recipient_name: string;
  blood_type: string;
  city: string;
  date: string;
  status: "completed";
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [userDonor, setUserDonor] = useState<DonorType | null>(null);
  const [userRequests, setUserRequests] = useState<RequestType[]>([]);
  const [userDonations, setUserDonations] = useState<DonationType[]>([]);
  const [donorRequests, setDonorRequests] = useState<RequestType[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorType | null>(null);
  const [showDonorDialog, setShowDonorDialog] = useState(false);
  const [donationCount, setDonationCount] = useState(0);
  const [nextEligibleDate, setNextEligibleDate] = useState<Date | null>(null);
  
  // Fetch user data
  useEffect(() => {
    if (!user) return;
    
    const fetchDonorProfile = async () => {
      // Check if user is registered as a donor
      const { data: donor, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (donor && !error) {
        setUserDonor(donor as DonorType);
        setNextEligibleDate(new Date(donor.next_eligible_date));
      }
      
      // Count completed donations
      if (donor) {
        const { data: donationsData, error: countError } = await supabase
          .from('donations')
          .select('id')
          .eq('donor_id', donor.id)
          .eq('status', 'completed');
          
        if (!countError && donationsData) {
          setDonationCount(donationsData.length || 0);
        }
      }
    };
    
    const fetchUserRequests = async () => {
      // Get requests made by this user
      const { data: requests, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });
        
      if (requests && !error) {
        setUserRequests(requests as RequestType[]);
      }
    };
    
    const fetchDonorRequests = async () => {
      // Get requests made to this donor
      const { data: donor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (donor) {
        const { data: requests, error } = await supabase
          .from('blood_requests')
          .select('*')
          .eq('donor_id', donor.id)
          .order('created_at', { ascending: false });
          
        if (requests && !error) {
          setDonorRequests(requests as RequestType[]);
        }
      }
    };
    
    const fetchDonations = async () => {
      // Get donations made by this donor
      const { data: donor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (donor) {
        const { data: donations, error } = await supabase
          .from('donations')
          .select('*')
          .eq('donor_id', donor.id)
          .order('date', { ascending: false });
          
        if (donations && !error) {
          setUserDonations(donations as DonationType[]);
        }
      }
    };

    fetchDonorProfile();
    fetchUserRequests();
    fetchDonorRequests();
    fetchDonations();
  }, [user]);
  
  const handleDonorRegistration = async () => {
    if (!user) return;
    
    setIsRegistering(true);
    
    try {
      // Get user metadata from auth
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      if (!userData || !userData.user_metadata) {
        throw new Error("User data not available");
      }
      
      const metadata = userData.user_metadata;
      
      // Register as donor
      const { error } = await supabase
        .from('donors')
        .insert([
          {
            user_id: user.id,
            name: metadata.full_name || '',
            email: userData.email,
            phone: metadata.phone || '',
            blood_type: metadata.blood_type || 'O+',
            age: 0, // Default values since we don't have these
            weight: 0,
            city: '',
            address: '',
            next_eligible_date: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString(),
            is_eligible: true
          }
        ]);
      
      if (error) throw error;
      
      const { data: newDonor } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (newDonor) {
        setUserDonor(newDonor as DonorType);
        setNextEligibleDate(new Date(newDonor.next_eligible_date));
      }
      
      toast({
        title: "Registration Successful",
        description: "You are now registered as a blood donor!",
      });
      
      setShowRegisterDialog(false);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register as donor.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleDonorSelect = (donor: DonorType) => {
    setSelectedDonor(donor);
    setShowDonorDialog(true);
  };
  
  const handleSendRequest = async () => {
    if (!user || !selectedDonor) return;
    
    try {
      // Get user profile
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('blood_requests')
        .insert([
          {
            requester_id: user.id,
            donor_id: selectedDonor.id,
            requester_name: userData?.user_metadata?.full_name || user.email,
            blood_type: selectedDonor.blood_type,
            city: selectedDonor.city,
            address: selectedDonor.address,
            contact: userData?.user_metadata?.phone || '',
            status: 'pending'
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Request Sent",
        description: `Your blood request has been sent to ${selectedDonor.name}.`,
      });
      
      setShowDonorDialog(false);
      
      // Refresh user requests
      const { data: requests } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });
        
      if (requests) {
        setUserRequests(requests as RequestType[]);
      }
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to send blood request.",
        variant: "destructive",
      });
    }
  };
  
  const handleApproveRequest = async (requestId: string) => {
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('blood_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      // Get request details
      const { data: request } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (request && userDonor) {
        // Create donation record
        const { error: donationError } = await supabase
          .from('donations')
          .insert([
            {
              donor_id: userDonor.id,
              request_id: requestId,
              recipient_name: request.requester_name,
              blood_type: request.blood_type,
              city: request.city,
              date: new Date().toISOString(),
              status: 'completed'
            }
          ]);
          
        if (donationError) throw donationError;
        
        // Update donor's next eligible date
        const newEligibleDate = new Date();
        newEligibleDate.setDate(newEligibleDate.getDate() + 90);
        
        const { error: donorUpdateError } = await supabase
          .from('donors')
          .update({ next_eligible_date: newEligibleDate.toISOString() })
          .eq('id', userDonor.id);
          
        if (donorUpdateError) throw donorUpdateError;
        
        // Refresh data
        setDonorRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId ? { ...req, status: 'approved' } : req
          )
        );
        
        // Update donation count
        setDonationCount(prev => prev + 1);
        
        // Update next eligible date
        setNextEligibleDate(newEligibleDate);
        
        // Also refresh donations
        const { data: donations } = await supabase
          .from('donations')
          .select('*')
          .eq('donor_id', userDonor.id)
          .order('date', { ascending: false });
          
        if (donations) {
          setUserDonations(donations as DonationType[]);
        }
        
        toast({
          title: "Request Approved",
          description: "You have approved the blood donation request. Thank you for saving a life!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to approve blood request.",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      // Update request status
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
        
      if (error) throw error;
      
      // Refresh data
      setDonorRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        )
      );
      
      toast({
        title: "Request Rejected",
        description: "You have rejected the blood donation request.",
      });
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to reject blood request.",
        variant: "destructive",
      });
    }
  };
  
  const calculateDaysLeft = () => {
    if (!nextEligibleDate) return 0;
    
    const today = new Date();
    const diffTime = nextEligibleDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const eligibilityPercentage = () => {
    const daysLeft = calculateDaysLeft();
    // Assuming 90 days between donations
    const percentage = ((90 - daysLeft) / 90) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.user_metadata?.full_name || user?.email || "User"}
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline">View Notifications</Button>
              {!userDonor ? (
                <Button 
                  className="bg-blood hover:bg-blood-600"
                  onClick={() => setShowRegisterDialog(true)}
                >
                  Register as Donor
                </Button>
              ) : (
                <Button className="bg-blood hover:bg-blood-600">Find Donors</Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="map">Find Donors</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="donations">My Donations</TabsTrigger>
              {userDonor && (
                <TabsTrigger value="donor-requests">Donation Requests</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Donation Eligibility Card */}
                {userDonor && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Next Eligible Donation</h2>
                    <div className="space-y-4">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-blood h-4 rounded-full transition-all duration-500" 
                          style={{ width: `${eligibilityPercentage()}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Last donation</span>
                        <span>Eligible to donate</span>
                      </div>
                      <div className="bg-gray-50 rounded-md p-4 text-center">
                        {calculateDaysLeft() > 0 ? (
                          <p className="font-medium">
                            You will be eligible to donate in <span className="text-blood">{calculateDaysLeft()} days</span>
                          </p>
                        ) : (
                          <p className="font-medium text-green-600">
                            You are eligible to donate blood now!
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          You can still approve donation requests at any time
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Impact Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Impact</h2>
                  <div className="flex items-center justify-center py-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blood mb-2">{donationCount}</div>
                      <p className="text-gray-600">Lives Saved</p>
                      <p className="text-sm text-gray-500 mt-4 max-w-md">
                        Each donation can save up to 3 lives. Thank you for your contributions!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  {userRequests.length === 0 && userDonations.length === 0 && donorRequests.length === 0 ? (
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
                              {new Date(donation.date).toLocaleDateString()}
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
              </div>
            </TabsContent>
            
            <TabsContent value="map">
              <LocationMap onDonorSelect={handleDonorSelect} />
            </TabsContent>
            
            <TabsContent value="requests">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Blood Requests</h2>
                {userRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">You haven't made any blood requests yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userRequests.map((request) => (
                      <BloodRequestCard 
                        key={request.id} 
                        request={request}
                        viewMode="requester"
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="donations">
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
                            {new Date(donation.date).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Completed
                          </span>
                        </div>
                        <p className="font-medium">Recipient: {donation.recipient_name}</p>
                        <p className="text-sm text-gray-500">
                          Blood Type: {donation.blood_type} • Location: {donation.city} • Lives Saved: 3
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {userDonor && (
              <TabsContent value="donor-requests">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Blood Donation Requests</h2>
                  {donorRequests.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                      You don't have any blood donation requests yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {donorRequests.map((request) => (
                        <BloodRequestCard 
                          key={request.id} 
                          request={request}
                          viewMode="donor"
                          onApprove={() => handleApproveRequest(request.id)}
                          onReject={() => handleRejectRequest(request.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
      
      {/* Register as Donor Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register as Blood Donor</DialogTitle>
            <DialogDescription>
              Are you sure you want to register as a blood donor? This will make your profile visible to those in need of blood donations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegisterDialog(false)}>Cancel</Button>
            <Button 
              className="bg-blood hover:bg-blood-600"
              onClick={handleDonorRegistration}
              disabled={isRegistering}
            >
              {isRegistering ? "Registering..." : "Register Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Donor Details Dialog */}
      <Dialog open={showDonorDialog} onOpenChange={setShowDonorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donor Information</DialogTitle>
          </DialogHeader>
          
          {selectedDonor && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-md p-4 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blood text-white text-xl font-semibold mb-2">
                  {selectedDonor.blood_type}
                </div>
                <h3 className="font-semibold text-lg">{selectedDonor.name}</h3>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <p className="text-gray-500">Phone:</p>
                  <p className="font-medium">{selectedDonor.phone}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-gray-500">Email:</p>
                  <p className="font-medium">{selectedDonor.email}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-gray-500">City:</p>
                  <p className="font-medium">{selectedDonor.city}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-gray-500">Address:</p>
                  <p className="font-medium">{selectedDonor.address}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDonorDialog(false)}>Cancel</Button>
                <Button className="bg-blood hover:bg-blood-600" onClick={handleSendRequest}>
                  Request Blood
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
