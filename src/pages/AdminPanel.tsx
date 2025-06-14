import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DonorsTable from "@/components/admin/DonorsTable";
import AddDonorDialog from "@/components/admin/AddDonorDialog";

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  blood_type: string;
  age: number;
  weight: number;
  city: string;
  address: string;
  created_at: string;
  is_eligible: boolean;
}

const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
      return;
    }
    
    if (user && isAdmin) {
      fetchDonors();
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    filterDonors();
  }, [donors, searchTerm, bloodTypeFilter, statusFilter]);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setDonorsLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    if (searchTerm) {
      filtered = filtered.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (bloodTypeFilter !== "all") {
      filtered = filtered.filter(donor => donor.blood_type === bloodTypeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(donor => 
        statusFilter === "active" ? donor.is_eligible : !donor.is_eligible
      );
    }

    setFilteredDonors(filtered);
  };

  const handleAddDonor = () => {
    fetchDonors(); // Refresh the list after adding
    setShowAddDialog(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading || donorsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blood">OneDrop Admin Panel</h1>
              <p className="text-gray-600">Manage donors and blood requests</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Donors</CardDescription>
              <CardTitle className="text-2xl text-blood">{donors.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Donors</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {donors.filter(d => d.is_eligible).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Inactive Donors</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {donors.filter(d => !d.is_eligible).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Cities Covered</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {new Set(donors.map(d => d.city)).size}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Donors Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Donors Management</CardTitle>
                <CardDescription>View and manage all registered donors</CardDescription>
              </div>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-blood hover:bg-blood-600 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Donor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={bloodTypeFilter} onValueChange={setBloodTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Types</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredDonors.length} of {donors.length} donors
              </p>
              {(searchTerm || bloodTypeFilter !== "all" || statusFilter !== "all") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setBloodTypeFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Donors Table */}
            <DonorsTable donors={filteredDonors} onRefresh={fetchDonors} />
          </CardContent>
        </Card>
      </div>

      {/* Add Donor Dialog */}
      <AddDonorDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={handleAddDonor}
      />
    </div>
  );
};

export default AdminPanel;
