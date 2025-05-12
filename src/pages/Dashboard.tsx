
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LocationMap from "@/components/map/LocationMap";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome back, John Doe</p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline">View Notifications</Button>
              <Button className="bg-blood hover:bg-blood-600">Find Donors</Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="map">Find Donors</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="donations">My Donations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="map">
              <LocationMap />
            </TabsContent>
            
            <TabsContent value="requests">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Blood Requests</h2>
                <p className="text-gray-500">You haven't made any blood requests yet.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="donations">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Donations</h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">April 15, 2023</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Completed
                      </span>
                    </div>
                    <p className="font-medium">City General Hospital</p>
                    <p className="text-sm text-gray-500">
                      Blood Type: A+ • Units: 1 • Lives Saved: 3
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">January 10, 2023</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Completed
                      </span>
                    </div>
                    <p className="font-medium">Medical Center</p>
                    <p className="text-sm text-gray-500">
                      Blood Type: A+ • Units: 1 • Lives Saved: 3
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
