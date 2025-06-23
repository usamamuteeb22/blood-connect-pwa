
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Donor } from "@/types/custom";

interface DonorsTableProps {
  donors: Donor[];
  onRefresh: () => void;
  clickableRows?: boolean;
}

interface DonorWithDonationCount extends Donor {
  donation_count: number;
}

const DonorsTable = ({ donors, onRefresh, clickableRows }: DonorsTableProps) => {
  const [sortField, setSortField] = useState<keyof Donor>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [donorsWithCounts, setDonorsWithCounts] = useState<DonorWithDonationCount[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch donation counts for all donors
  useEffect(() => {
    const fetchDonationCounts = async () => {
      if (donors.length === 0) return;
      
      setLoading(true);
      try {
        const donorIds = donors.map(d => d.id);
        const { data: donationCounts, error } = await supabase
          .from('donations')
          .select('donor_id')
          .in('donor_id', donorIds);

        if (error) {
          console.error('Error fetching donation counts:', error);
          // Set counts to 0 if error
          setDonorsWithCounts(donors.map(donor => ({ ...donor, donation_count: 0 })));
          return;
        }

        // Count donations per donor
        const countMap = donationCounts.reduce((acc, donation) => {
          acc[donation.donor_id] = (acc[donation.donor_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const donorsWithCounts = donors.map(donor => ({
          ...donor,
          donation_count: countMap[donor.id] || 0
        }));

        setDonorsWithCounts(donorsWithCounts);
      } catch (error) {
        console.error('Error in fetchDonationCounts:', error);
        setDonorsWithCounts(donors.map(donor => ({ ...donor, donation_count: 0 })));
      } finally {
        setLoading(false);
      }
    };

    fetchDonationCounts();
  }, [donors]);

  const handleSort = (field: keyof Donor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDonors = [...donorsWithCounts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = async (donorId: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;

    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', donorId);

      if (error) throw error;

      onRefresh();
    } catch (error) {
      console.error('Error deleting donor:', error);
    }
  };

  const calculateEligibility = (lastDonationDate: string | null) => {
    if (!lastDonationDate) {
      return { eligible: true, label: "✅ Eligible" };
    }
    
    const daysSinceLastDonation = differenceInDays(new Date(), new Date(lastDonationDate));
    const eligible = daysSinceLastDonation >= 90;
    
    return {
      eligible,
      label: eligible ? "✅ Eligible" : "❌ Not Eligible"
    };
  };

  const SortableHeader = ({ field, children }: { field: keyof Donor; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 px-2"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </TableHead>
  );

  if (donors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No donors found</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading donation counts...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 px-2">#</TableHead>
            <TableHead className="w-12 px-2">Call</TableHead>
            <SortableHeader field="name">Name</SortableHeader>
            <SortableHeader field="age">Age</SortableHeader>
            <SortableHeader field="phone">Phone</SortableHeader>
            <SortableHeader field="blood_type">Blood</SortableHeader>
            <SortableHeader field="city">City</SortableHeader>
            <TableHead className="min-w-[200px]">Address</TableHead>
            <TableHead>Donations</TableHead>
            <SortableHeader field="last_donation_date">Last Donation</SortableHeader>
            <SortableHeader field="created_at">Registered</SortableHeader>
            <TableHead>Eligibility</TableHead>
            <TableHead className="w-12 px-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDonors.map((donor, index) => {
            const eligibility = calculateEligibility(donor.last_donation_date);
            
            return (
              <TableRow
                key={donor.id}
                className={clickableRows ? "cursor-pointer hover:bg-blue-50" : ""}
                onClick={clickableRows ? () => navigate(`/admin/donor/${donor.id}`) : undefined}
              >
                <TableCell className="px-2 font-medium">{index + 1}</TableCell>
                <TableCell className="px-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${donor.phone}`, '_blank');
                    }}
                    className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300"
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium px-2">{donor.name}</TableCell>
                <TableCell className="px-2">{donor.age}</TableCell>
                <TableCell className="px-2">{donor.phone}</TableCell>
                <TableCell className="px-2">
                  <Badge variant="outline" className="bg-blood/10 text-blood border-blood/20">
                    {donor.blood_type}
                  </Badge>
                </TableCell>
                <TableCell className="px-2">{donor.city}</TableCell>
                <TableCell className="px-2 min-w-[200px]" title={donor.address}>
                  <div className="max-w-[200px] break-words">
                    {donor.address}
                  </div>
                </TableCell>
                <TableCell className="px-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {donor.donation_count}
                  </Badge>
                </TableCell>
                <TableCell className="px-2">
                  {donor.last_donation_date ? 
                    format(new Date(donor.last_donation_date), 'MMM dd, yyyy') : 
                    <span className="text-gray-400">Never</span>
                  }
                </TableCell>
                <TableCell className="px-2">
                  {donor.created_at ? 
                    format(new Date(donor.created_at), 'MMM dd, yyyy') : 
                    <span>-</span>
                  }
                </TableCell>
                <TableCell className="px-2">
                  <Badge 
                    variant={eligibility.eligible ? "default" : "secondary"}
                    className={eligibility.eligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {eligibility.label}
                  </Badge>
                </TableCell>
                <TableCell className="px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/admin/donor/${donor.id}`);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(donor.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonorsTable;
