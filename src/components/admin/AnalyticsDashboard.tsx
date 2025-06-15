import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Donor } from "@/types/custom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const groupColors = [
  "#ed2222","#ff7675","#039be5","#ffd600",
  "#00b894","#b2bec3","#e17055","#c44536"
];

const AnalyticsDashboard = ({ donors }: { donors: Donor[] }) => {
  const [donationStats, setDonationStats] = useState({
    monthly: 0,
    yearly: 0,
    byGroup: {} as Record<string, number>,
    topGroups: [] as { blood_type: string, count: number }[],
    topDonors: [] as { name: string, email: string, count: number }[],
  });
  const [loading, setLoading] = useState(true);

  // Fetch analytics with comprehensive error handling
  const fetchStats = async () => {
    console.log('Starting analytics fetch...');
    setLoading(true);
    
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      console.log(`Fetching analytics for year ${currentYear}, month ${currentMonth}`);

      // Fetch all donations with detailed logging
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select(`
          *,
          donor:donor_id (
            id,
            name,
            email,
            blood_type
          )
        `)
        .order('date', { ascending: false });

      if (donationsError) {
        console.error("Analytics donations fetch error:", donationsError);
        throw donationsError;
      }

      console.log(`Found ${donations?.length || 0} total donations:`, donations);

      // Initialize counters
      let monthTotal = 0;
      let yearTotal = 0;
      const groupMap: Record<string, number> = {};
      const donorMap: Record<string, { name: string, email: string, count: number }> = {};

      // Process each donation with detailed logging
      for (const donation of donations || []) {
        try {
          const donationDate = parseISO(donation.date);
          console.log(`Processing donation ${donation.id} from ${donation.date}`);
          
          // Count by time period
          if (donationDate.getFullYear() === currentYear) {
            yearTotal += 1;
            if (donationDate.getMonth() + 1 === currentMonth) {
              monthTotal += 1;
              console.log(`Month donation count: ${monthTotal}`);
            }
          }

          // Count by blood group
          if (donation.blood_type) {
            groupMap[donation.blood_type] = (groupMap[donation.blood_type] || 0) + 1;
            console.log(`Blood group ${donation.blood_type} count: ${groupMap[donation.blood_type]}`);
          }

          // Count by donor
          if (donation.donor && donation.donor.email) {
            const key = donation.donor.email;
            if (!donorMap[key]) {
              donorMap[key] = { 
                name: donation.donor.name || 'Unknown', 
                email: key, 
                count: 0 
              };
            }
            donorMap[key].count += 1;
            console.log(`Donor ${donation.donor.name} count: ${donorMap[key].count}`);
          }
        } catch (dateError) {
          console.error(`Error processing donation ${donation.id}:`, dateError);
        }
      }

      // Get in-demand blood groups from pending requests
      const { data: requests, error: requestsError } = await supabase
        .from("blood_requests")
        .select("blood_type")
        .eq("status", "pending");

      if (requestsError) {
        console.error("Requests fetch error:", requestsError);
      }

      const groupDemand: Record<string, number> = {};
      if (requests) {
        for (const request of requests) {
          if (request.blood_type) {
            groupDemand[request.blood_type] = (groupDemand[request.blood_type] || 0) + 1;
          }
        }
      }

      // Top 5 donors
      const topDonors = Object.values(donorMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Top demand groups
      const topGroups = Object.entries(groupDemand)
        .map(([blood_type, count]) => ({ blood_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const newStats = {
        monthly: monthTotal,
        yearly: yearTotal,
        byGroup: groupMap,
        topGroups,
        topDonors,
      };

      console.log('Final analytics stats:', newStats);
      setDonationStats(newStats);

    } catch (error) {
      console.error("Error fetching analytics statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [donors]);

  // Listen for donation updates with improved logging
  useEffect(() => {
    const handleDonationAdded = (event: any) => {
      console.log('Donation analytics refresh event received:', event.detail);
      
      // Add delay to ensure database has been updated
      setTimeout(() => {
        console.log('Refreshing analytics after donation event...');
        fetchStats();
      }, 1000);
    };

    window.addEventListener('donationAdded', handleDonationAdded);
    
    return () => {
      window.removeEventListener('donationAdded', handleDonationAdded);
    };
  }, []);

  if (loading) return <div className="flex justify-center py-6">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Top Row - Monthly and Yearly Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col gap-2 justify-center items-center">
          <span className="text-xs text-gray-600">This Month</span>
          <span className="text-xl font-bold text-blood">{donationStats.monthly}</span>
          <span className="text-xs text-gray-600">Donations</span>
        </Card>
        <Card className="p-4 flex flex-col gap-2 justify-center items-center">
          <span className="text-xs text-gray-600">This Year</span>
          <span className="text-xl font-bold text-blue-600">{donationStats.yearly}</span>
          <span className="text-xs text-gray-600">Donations</span>
        </Card>
        
        {/* Blood Group Chart */}
        <Card className="p-4 sm:col-span-2">
          <div className="font-semibold mb-2 text-center text-blood">Blood Group Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bloodGroups.map(bg => ({
              blood_type: bg,
              count: donationStats.byGroup[bg] || 0,
            }))}>
              <XAxis dataKey="blood_type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#ed2222" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row - In-demand Groups and Top Donors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* In-demand Blood Groups Card */}
        <Card className="p-4 flex flex-col gap-2">
          <div className="mb-1 font-semibold text-center text-blood">In-demand Blood Groups</div>
          <ol className="text-sm space-y-1">
            {donationStats.topGroups.length === 0 ? (
              <li className="text-center text-gray-500">No pending requests</li>
            ) : (
              donationStats.topGroups.map((g, i) => (
                <li key={g.blood_type} className="flex justify-between items-center">
                  <span>{i+1}. {g.blood_type}</span>
                  <span className="text-gray-500">({g.count} requests)</span>
                </li>
              ))
            )}
          </ol>
        </Card>

        {/* Top Active Donors Card */}
        <Card className="p-4 flex flex-col gap-2">
          <div className="font-semibold mb-1 text-center text-blood">Top Active Donors</div>
          <ol className="text-sm space-y-1">
            {donationStats.topDonors.length === 0 ? (
              <li className="text-center text-gray-500">No donations recorded</li>
            ) : (
              donationStats.topDonors.map((d, i) => (
                <li key={d.email} className="flex justify-between items-center">
                  <span className="truncate">{i+1}. {d.name}</span>
                  <span className="text-gray-500">({d.count})</span>
                </li>
              ))
            )}
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
