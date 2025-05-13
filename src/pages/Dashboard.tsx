
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LocationMap from "@/components/map/LocationMap";
import { Donor, BloodRequest, Donation } from "@/types/custom";

// Import refactored components
import DonorEligibility from "@/components/dashboard/DonorEligibility";
import ImpactStats from "@/components/dashboard/ImpactStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UserRequestsTab from "@/components/dashboard/UserRequestsTab";
import UserDonationsTab from "@/components/dashboard/UserDonationsTab";
import DonorRequestsTab from "@/components/dashboard/DonorRequestsTab";
import DonorRegistrationDialog from "@/components/dashboard/DonorRegistrationDialog";
import DonorDetailsDialog from "@/components/dashboard/DonorDetailsDialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [userDonor, setUserDonor] = useState<Donor | null>(null);
  const [userRequests, setUserRequests] = useState<BloodRequest[]>([]);
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [donorRequests, setDonorRequests] = useState<BloodRequest[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
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
        setUserDonor(donor as Donor);
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
        setUserRequests(requests as BloodRequest[]);
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
          setDonorRequests(requests as BloodRequest[]);
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
          setUserDonations(donations as Donation[]);
        }
      }
    };

    fetchDonorProfile();
    fetchUserRequests();
    fetchDonorRequests();
    fetchDonations();
  }, [user]);
  
  const handleDonorSelect = (donor: Donor) => {
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
        setUserRequests(requests as BloodRequest[]);
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
          setUserDonations(donations as Donation[]);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <DashboardHeader 
            user={user} 
            userDonor={userDonor} 
            onRegisterClick={() => setShowRegisterDialog(true)} 
          />
          
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
                {userDonor && <DonorEligibility nextEligibleDate={nextEligibleDate} />}
                <ImpactStats donationCount={donationCount} />
                <RecentActivity 
                  userRequests={userRequests} 
                  userDonations={userDonations} 
                  donorRequests={donorRequests} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="map">
              <LocationMap onDonorSelect={handleDonorSelect} />
            </TabsContent>
            
            <TabsContent value="requests">
              <UserRequestsTab userRequests={userRequests} />
            </TabsContent>
            
            <TabsContent value="donations">
              <UserDonationsTab userDonations={userDonations} />
            </TabsContent>

            {userDonor && (
              <TabsContent value="donor-requests">
                <DonorRequestsTab 
                  donorRequests={donorRequests} 
                  onApprove={handleApproveRequest} 
                  onReject={handleRejectRequest} 
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
      
      <DonorRegistrationDialog 
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
      />
      
      <DonorDetailsDialog 
        open={showDonorDialog}
        onOpenChange={setShowDonorDialog}
        selectedDonor={selectedDonor}
        onSendRequest={handleSendRequest}
      />
    </div>
  );
};

export default Dashboard;
