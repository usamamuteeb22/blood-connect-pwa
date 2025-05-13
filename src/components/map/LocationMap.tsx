
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LocationMapProps {
  onDonorSelect?: (donor: any) => void;
}

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

const LocationMap = ({ onDonorSelect }: LocationMapProps) => {
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("map");
  const [donors, setDonors] = useState<DonorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  useEffect(() => {
    const fetchDonors = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase.from('donors').select('*');
        
        // Apply blood type filter if needed
        if (bloodTypeFilter !== "all") {
          query = query.eq('blood_type', bloodTypeFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          setDonors(data);
        }
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonors();
  }, [bloodTypeFilter]);
  
  const handleSelectDonor = (donor: DonorType) => {
    if (onDonorSelect) {
      onDonorSelect(donor);
    }
  };
  
  const isDonorEligible = (nextEligibleDate: string) => {
    const today = new Date();
    const eligibleDate = new Date(nextEligibleDate);
    return today >= eligibleDate;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <CardTitle>Blood Availability Map</CardTitle>
            <CardDescription>Find donors and hospitals near you</CardDescription>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Select value={bloodTypeFilter} onValueChange={setBloodTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs defaultValue={viewMode} onValueChange={setViewMode} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="map" className="mt-0">
          <div className="relative h-96 w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="mx-auto h-12 w-12 text-blood opacity-50 mb-4" />
              <p className="text-gray-500 font-medium">Map placeholder</p>
              <p className="text-sm text-gray-400">
                Map integration will show donor locations and hospitals
              </p>
            </div>
            {/* Placeholder markers for donors */}
            {donors.slice(0, 5).map((donor, index) => {
              // Calculate random positions for demonstration
              const left = 20 + (index * 15) + Math.random() * 10;
              const top = 20 + (index * 10) + Math.random() * 30;
              
              return (
                <div 
                  key={donor.id}
                  className="absolute w-8 h-8 rounded-full bg-blood text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onClick={() => handleSelectDonor(donor)}
                >
                  {donor.blood_type}
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading donors...</p>
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No donors found matching your criteria</p>
            </div>
          ) : (
            <div className="border rounded-md divide-y">
              {donors.map(donor => (
                <div 
                  key={donor.id} 
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectDonor(donor)}
                >
                  <div className="flex items-center">
                    <div className="bg-blood-50 text-blood w-10 h-10 rounded-full flex items-center justify-center mr-4">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2 px-1.5 bg-gray-100 rounded text-xs font-medium">
                          {donor.blood_type}
                        </span>
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{donor.city}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={`w-3 h-3 rounded-full ${
                      isDonorEligible(donor.next_eligible_date) ? "bg-green-500" : "bg-amber-500"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
