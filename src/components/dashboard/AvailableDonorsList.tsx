
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Donor } from "@/types/custom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

interface AvailableDonorsListProps {
  onDonorSelect?: (donor: Donor) => void;
}

// Blood types for the filter
const bloodTypes = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AvailableDonorsList = ({ onDonorSelect }: AvailableDonorsListProps) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodType, setSelectedBloodType] = useState("All");
  
  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        // Fetch all eligible donors with last_donation_date
        const { data, error } = await supabase
          .from('donors')
          .select('*')
          .eq('is_eligible', true);
          
        if (error) throw error;
        
        if (data) {
          // Transform data to ensure last_donation_date is included
          const donorsWithLastDonation = data.map(donor => ({
            ...donor,
            last_donation_date: donor.last_donation_date || null
          }));
          setDonors(donorsWithLastDonation);
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonors();
  }, []);
  
  // Filter donors based on selected blood type
  const filteredDonors = useMemo(() => {
    if (selectedBloodType === "All") {
      return donors;
    }
    return donors.filter(donor => donor.blood_type === selectedBloodType);
  }, [donors, selectedBloodType]);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Available Blood Donors</h2>
        
        <div className="flex items-center w-full sm:w-auto">
          <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by blood type" />
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === "All" ? "All Blood Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading donors...</div>
      ) : filteredDonors.length > 0 ? (
        <div className="space-y-4">
          {filteredDonors.map((donor) => (
            <div 
              key={donor.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-blood text-white flex items-center justify-center font-bold">
                      {donor.blood_type}
                    </div>
                    <h3 className="font-medium text-lg">{donor.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">City</p>
                      <p>{donor.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p>{donor.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="truncate">{donor.email}</p>
                    </div>
                  </div>
                </div>
                <Button 
                  className="bg-blood hover:bg-blood-600 whitespace-nowrap"
                  onClick={() => onDonorSelect && onDonorSelect(donor)}
                >
                  Request Blood
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          {selectedBloodType === "All" 
            ? "No eligible donors found in your area. Please check again later." 
            : `No donors with blood type ${selectedBloodType} found.`}
        </div>
      )}
    </div>
  );
};

export default AvailableDonorsList;
