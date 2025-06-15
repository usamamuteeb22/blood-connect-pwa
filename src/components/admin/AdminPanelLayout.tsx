
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import DonorSearchFilters from "./DonorSearchFilters";
import DonorsTable from "@/components/admin/DonorsTable";
import AddDonorDialog from "@/components/admin/AddDonorDialog";
import ActivityLogs from "./ActivityLogs";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// types
import type { Donor } from "@/types/custom";

const AdminPanelLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ field: "", value: "" });
  const [locationQuery, setLocationQuery] = useState({ city: "", address: "" });
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [exportAllLoading, setExportAllLoading] = useState(false);

  // Fetch donors
  const fetchDonors = async () => {
    setDonorsLoading(true);
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

  // Export all donations as Excel
  const handleExportAllDonations = async () => {
    setExportAllLoading(true);
    toast.info("Fetching all donations for export...");
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        toast.warning("No donations to export.");
      } else {
        const mod = await import('@/utils/exportUtils');
        await mod.exportToExcel(data, 'all-donations');
        toast.success("Exported all donations as Excel!");
      }
    } catch (err) {
      toast.error("Failed to export all donations.");
      console.error(err);
    }
    setExportAllLoading(false);
  };

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
      return;
    }
    if (user && isAdmin) fetchDonors();
    // eslint-disable-next-line
  }, [user, isAdmin, loading]);

  // Filtering logic: advanced search & location-based & blood group, all must combine
  useEffect(() => {
    let filtered = donors;

    // Multi-field filter: search by name/email/phone
    if (searchQuery.value && searchQuery.field) {
      filtered = filtered.filter(donor =>
        donor[searchQuery.field]?.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    // Location filter: city/address
    if (locationQuery.city) {
      filtered = filtered.filter(donor =>
        donor.city?.toLowerCase().includes(locationQuery.city.toLowerCase())
      );
    }
    if (locationQuery.address) {
      filtered = filtered.filter(donor =>
        donor.address?.toLowerCase().includes(locationQuery.address.toLowerCase())
      );
    }
    // Blood group filter
    if (bloodGroupFilter) {
      filtered = filtered.filter(donor =>
        donor.blood_type === bloodGroupFilter
      );
    }
    setFilteredDonors(filtered);
  }, [donors, searchQuery, locationQuery, bloodGroupFilter]);

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
      <div className="container mx-auto px-2 py-4 md:py-8 flex flex-col gap-8">
        {/* Analytics */}
        <AnalyticsDashboard donors={donors} />

        {/* Donor Management */}
        <Card>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-semibold">Donors Management</h2>
                <span className="text-sm text-gray-600">Search and manage all registered donors.</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-blood hover:bg-blood-600 flex items-center gap-2"
                >
                  + Add Donor
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportAllDonations}
                  disabled={exportAllLoading}
                >
                  {exportAllLoading ? "Exporting..." : "Export ALL Donations (Excel)"}
                </Button>
              </div>
            </div>

            {/* Advanced Search Filters */}
            <DonorSearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
              bloodGroupFilter={bloodGroupFilter}
              setBloodGroupFilter={setBloodGroupFilter}
            />

            {/* Results Info + CSV export */}
            <div className="flex flex-wrap items-center justify-between">
              <p className="text-xs text-gray-600">
                Showing {filteredDonors.length} of {donors.length} donors
              </p>
              {/* Export CSV/Excel */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => import('@/utils/exportUtils').then(m => m.exportToCSV(filteredDonors, 'donors'))}>Export CSV</Button>
                <Button variant="outline" size="sm" onClick={() => import('@/utils/exportUtils').then(m => m.exportToExcel(filteredDonors, 'donors'))}>Export Excel</Button>
              </div>
            </div>

            {/* Donor Table */}
            <DonorsTable 
              donors={filteredDonors}
              onRefresh={fetchDonors}
              clickableRows
            />
          </div>
        </Card>

        {/* Add Donor Dialog */}
        <AddDonorDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={fetchDonors}
        />
      </div>
    </div>
  );
};

export default AdminPanelLayout;
