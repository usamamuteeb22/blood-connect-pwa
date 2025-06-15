
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Donor } from "@/types/custom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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

  // Fetch analytics: donations for month/year, by group, top donors, in-demand
  const fetchStats = async () => {
    setLoading(true);
    try {
      // Donations for this year, this month, by group
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1; // Jan = 0
      let { data: donations, error } = await supabase
        .from('donations')
        .select('*, donor:donor_id(name, email, blood_type)')
        .order('date', { ascending: false });

      if (error) throw error;

      // Totals
      let monthTotal = 0, yearTotal = 0;
      let groupMap: Record<string, number> = {};
      let donorMap: Record<string, { name: string, email: string, count: number }> = {};
      let groupDemand: Record<string, number> = {};

      for (const d of donations || []) {
        const donDate = d.date ? parseISO(d.date) : null;
        if (donDate && donDate.getFullYear() === year) {
          yearTotal += 1;
          if (donDate.getMonth() + 1 === month) {
            monthTotal += 1;
          }
        }
        // Group
        if (d.blood_type) {
          groupMap[d.blood_type] = (groupMap[d.blood_type] || 0) + 1;
        }
        // Top donors
        if (d.donor && d.donor.email) {
          const key = d.donor.email;
          donorMap[key] = donorMap[key] || { name: d.donor.name, email: key, count: 0 };
          donorMap[key].count += 1;
        }
      }
      // Top in-demand blood groups (from blood_requests with status 'pending')
      const { data: requests } = await supabase
        .from("blood_requests")
        .select("blood_type")
        .eq("status", "pending");
      if (requests) {
        for (const r of requests) {
          if (r.blood_type) {
            groupDemand[r.blood_type] = (groupDemand[r.blood_type] || 0) + 1;
          }
        }
      }
      // Top 5 donors
      const topDonors = Object.values(donorMap).sort((a,b) => b.count - a.count).slice(0, 5);
      // Distribution by group (recharts)
      const byGroupArr = bloodGroups.map(bg => ({
        blood_type: bg,
        count: groupMap[bg] || 0,
      }));
      // Top demand groups
      const topGroups = Object.entries(groupDemand)
        .map(([blood_type, count]) => ({ blood_type, count }))
        .sort((a,b) => b.count - a.count)
        .slice(0, 5);

      setDonationStats({
        monthly: monthTotal,
        yearly: yearTotal,
        byGroup: groupMap,
        topGroups,
        topDonors,
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [donors]);

  // Listen for donation updates
  useEffect(() => {
    const handleDonationAdded = () => {
      console.log('Donation added event received, refreshing analytics...');
      fetchStats();
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
        
        {/* Blood Group Chart - spans 2 columns on larger screens */}
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
              <Bar dataKey="count">
                {bloodGroups.map((_, i) => (
                  <Cell key={i} fill={groupColors[i % groupColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row - In-demand Groups and Top Donors in separate cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
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
