
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Bell } from "lucide-react";

const LocationMap = () => {
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("map");
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // Mock nearby donors/hospitals data
  const nearbyPoints = [
    { id: 1, type: "donor", name: "John Doe", bloodType: "O+", distance: "1.2 km", available: true },
    { id: 2, type: "donor", name: "Jane Smith", bloodType: "AB-", distance: "2.5 km", available: true },
    { id: 3, type: "donor", name: "Robert Brown", bloodType: "A+", distance: "3.7 km", available: false },
    { id: 4, type: "hospital", name: "City General Hospital", distance: "2.1 km", emergency: false },
    { id: 5, type: "hospital", name: "Medical Center", distance: "4.3 km", emergency: true },
  ];
  
  const filteredPoints = bloodTypeFilter === "all" 
    ? nearbyPoints 
    : nearbyPoints.filter(point => 
        point.type !== "donor" || point.bloodType === bloodTypeFilter
      );
  
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
            {/* Placeholder markers */}
            <div className="absolute left-1/4 top-1/3 w-8 h-8 rounded-full bg-blood text-white flex items-center justify-center text-xs font-bold">
              O+
            </div>
            <div className="absolute right-1/3 top-1/2 w-8 h-8 rounded-full bg-blood text-white flex items-center justify-center text-xs font-bold">
              A+
            </div>
            <div className="absolute left-1/2 bottom-1/4 w-10 h-10 rounded-full bg-white border-2 border-blood text-blood flex items-center justify-center text-xs font-bold">
              H
            </div>
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          <div className="border rounded-md divide-y">
            {filteredPoints.map(point => (
              <div key={point.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`${
                    point.type === "donor" 
                      ? "bg-blood-50 text-blood" 
                      : "bg-blue-50 text-blue-600"
                  } w-10 h-10 rounded-full flex items-center justify-center mr-4`}>
                    {point.type === "donor" ? <User className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{point.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      {point.type === "donor" && (
                        <span className="mr-2 px-1.5 bg-gray-100 rounded text-xs font-medium">
                          {point.bloodType}
                        </span>
                      )}
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{point.distance}</span>
                      {point.type === "hospital" && point.emergency && (
                        <span className="ml-2 text-xs font-medium text-red-500">
                          URGENT NEED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {point.type === "donor" && (
                    <div className={`w-3 h-3 rounded-full ${
                      point.available ? "bg-green-500" : "bg-gray-300"
                    }`} />
                  )}
                  {point.type === "hospital" && (
                    <button className="text-sm text-blood hover:text-blood-700 hover:underline">
                      Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
