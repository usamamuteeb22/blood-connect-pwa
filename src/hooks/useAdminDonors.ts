
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Donor } from "@/types/custom";

export const useAdminDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ field: "", value: "" });
  const [locationQuery, setLocationQuery] = useState({ city: "", address: "" });
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);

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

  // Download filtered donations as Excel
  const handleDownloadDonations = async () => {
    setDownloadLoading(true);
    toast.info("Fetching donations for export...");
    
    try {
      let query = supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });

      // Apply date filters if provided
      if (startDate) {
        query = query.gte('donation_date', startDate);
      }
      if (endDate) {
        query = query.lte('donation_date', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.warning("No donations found for the selected date range.");
      } else {
        const mod = await import('@/utils/exportUtils');
        const filename = startDate || endDate 
          ? `donations-${startDate || 'start'}-to-${endDate || 'end'}`
          : 'filtered-donations';
        await mod.exportToExcel(data, filename);
        toast.success(`Exported ${data.length} donations as Excel!`);
      }
    } catch (err) {
      toast.error("Failed to export donations.");
      console.error(err);
    }
    setDownloadLoading(false);
  };

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
    // Blood group filter - only filter if not "all"
    if (bloodGroupFilter && bloodGroupFilter !== "all") {
      filtered = filtered.filter(donor =>
        donor.blood_type === bloodGroupFilter
      );
    }
    setFilteredDonors(filtered);
  }, [donors, searchQuery, locationQuery, bloodGroupFilter]);

  return {
    donors,
    filteredDonors,
    donorsLoading,
    searchQuery,
    setSearchQuery,
    locationQuery,
    setLocationQuery,
    bloodGroupFilter,
    setBloodGroupFilter,
    showAddDialog,
    setShowAddDialog,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    downloadLoading,
    fetchDonors,
    handleDownloadDonations,
  };
};
