import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  blood_type: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  next_eligible_date: string;
}

interface DonorProps {
  id: string;
  name: string;
  blood_type: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  next_eligible_date: string;
}

interface LocationMapProps {
  onDonorSelect?: (donor: DonorProps) => void;
}

const LocationMap = ({ onDonorSelect }: LocationMapProps) => {
  const [donors, setDonors] = useState<DonorProps[]>([]);
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
          setDonors(data as DonorProps[]);
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonors();
  }, []);
  
  // Placeholder for map implementation
  // In a real app, you'd integrate Google Maps or similar here
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Find Blood Donors Near You</h2>
      
      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading donors...</div>
      ) : donors.length > 0 ? (
        <div className="space-y-4">
          {/* Placeholder for map view */}
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
            Interactive map will be displayed here
          </div>
          
          <h3 className="text-lg font-medium">Available Donors</h3>
          <div className="space-y-2">
            {donors.map((donor) => (
              <div 
                key={donor.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onDonorSelect && onDonorSelect(donor)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{donor.name}</p>
                    <p className="text-sm text-gray-500">
                      {donor.city} • {donor.blood_type} blood type
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blood text-white flex items-center justify-center font-bold">
                    {donor.blood_type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No eligible donors found in your area. Please check again later.
        </div>
      )}
    </div>
  );
};

export default LocationMap;
