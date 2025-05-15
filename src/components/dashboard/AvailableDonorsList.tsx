
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Donor } from "@/types/custom";

interface AvailableDonorsListProps {
  onDonorSelect?: (donor: Donor) => void;
}

const AvailableDonorsList = ({ onDonorSelect }: AvailableDonorsListProps) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        // Fetch all eligible donors
        const { data, error } = await supabase
          .from('donors')
          .select('*')
          .eq('is_eligible', true);
          
        if (error) throw error;
        
        if (data) {
          setDonors(data as Donor[]);
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonors();
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Available Blood Donors</h2>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading donors...</div>
      ) : donors.length > 0 ? (
        <div className="space-y-4">
          {donors.map((donor) => (
            <div 
              key={donor.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
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
          No eligible donors found in your area. Please check again later.
        </div>
      )}
    </div>
  );
};

export default AvailableDonorsList;
