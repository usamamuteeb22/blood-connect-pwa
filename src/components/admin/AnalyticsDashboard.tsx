
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import type { Donor } from "@/types/custom";

interface AnalyticsDashboardProps {
  donors: Donor[];
}

interface BloodGroupData {
  bloodGroup: string;
  count: number;
  fill: string;
}

interface TopDonor {
  id: string;
  name: string;
  bloodGroup: string;
  donationCount: number;
}

interface DailyDonation {
  date: string;
  count: number;
}

const bloodGroupColors: Record<string, string> = {
  "A+": "#ef4444",
  "A-": "#dc2626", 
  "A1": "#b91c1c",
  "B+": "#3b82f6",
  "B-": "#2563eb",
  "AB+": "#8b5cf6",
  "AB-": "#7c3aed",
  "O+": "#10b981",
  "O-": "#059669"
};

const chartConfig = {
  bloodGroup: {
    label: "Blood Group"
  },
  count: {
    label: "Donations"
  }
};

const AnalyticsDashboard = ({ donors }: AnalyticsDashboardProps) => {
  const [bloodGroupData, setBloodGroupData] = useState<BloodGroupData[]>([]);
  const [topDonors, setTop DonorsState] = useState<TopDonor[]>([]);
  const [dailyDonations, setDailyDonations] = useState<DailyDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Fetch all donations with donor data
        const { data: donations, error } = await supabase
          .from('donations')
          .select(`
            id,
            donor_id,
            blood_type,
            date,
            donors (
              id,
              name,
              blood_type
            )
          `);

        if (error) {
          console.error('Error fetching donations:', error);
          setLoading(false);
          return;
        }

        // Process blood group data
        const bloodGroupCounts: Record<string, number> = {};
        donations?.forEach(donation => {
          const bloodType = donation.blood_type;
          bloodGroupCounts[bloodType] = (bloodGroupCounts[bloodType] || 0) + 1;
        });

        const bloodGroupChartData = Object.entries(bloodGroupCounts).map(([bloodGroup, count]) => ({
          bloodGroup,
          count,
          fill: bloodGroupColors[bloodGroup] || "#6b7280"
        }));

        setBloodGroupData(bloodGroupChartData);

        // Process top donors data
        const donorCounts: Record<string, { name: string; bloodGroup: string; count: number }> = {};
        donations?.forEach(donation => {
          if (donation.donors) {
            const donorId = donation.donor_id;
            const donorData = Array.isArray(donation.donors) ? donation.donors[0] : donation.donors;
            
            if (!donorCounts[donorId]) {
              donorCounts[donorId] = {
                name: donorData.name,
                bloodGroup: donorData.blood_type,
                count: 0
              };
            }
            donorCounts[donorId].count++;
          }
        });

        const topDonorsData = Object.entries(donorCounts)
          .map(([id, data]) => ({
            id,
            name: data.name,
            bloodGroup: data.bloodGroup,
            donationCount: data.count
          }))
          .sort((a, b) => b.donationCount - a.donationCount)
          .slice(0, 10);

        setTopDonors(topDonorsData);

        // Process daily donations for current month
        const currentDate = new Date();
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        const dailyCounts: Record<string, number> = {};
        donations?.forEach(donation => {
          const donationDate = new Date(donation.date);
          if (donationDate >= monthStart && donationDate <= monthEnd) {
            const dateKey = format(donationDate, 'yyyy-MM-dd');
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
          }
        });

        const dailyChartData = daysInMonth.map(day => ({
          date: format(day, 'MMM dd'),
          count: dailyCounts[format(day, 'yyyy-MM-dd')] || 0
        }));

        setDailyDonations(dailyChartData);

      } catch (error) {
        console.error('Error in fetchAnalyticsData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();

    // Listen for donation events to refresh data
    const handleDonationAdded = () => {
      fetchAnalyticsData();
    };

    window.addEventListener('donationAdded', handleDonationAdded);
    return () => window.removeEventListener('donationAdded', handleDonationAdded);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Blood Group Chart */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Monthly Blood Group Donations</CardTitle>
            <CardDescription>Donation counts by blood group</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodGroupData}>
                  <XAxis 
                    dataKey="bloodGroup" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Active Donors */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Top Active Donors</CardTitle>
            <CardDescription>Leading donors by donation count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {topDonors.length > 0 ? (
                topDonors.map((donor, index) => (
                  <div key={donor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">#{index + 1}</span>
                      <div>
                        <div className="font-medium text-sm">{donor.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {donor.bloodGroup}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {donor.donationCount} donations
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">No donation data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Donations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Daily Donations This Month</CardTitle>
            <CardDescription>Daily donation trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyDonations}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
