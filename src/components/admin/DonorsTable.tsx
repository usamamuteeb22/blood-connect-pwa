
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Donor } from "@/types/custom"; // Force usage from central types

interface DonorsTableProps {
  donors: Donor[];
  onRefresh: () => void;
  clickableRows?: boolean;
}

const DonorsTable = ({ donors, onRefresh, clickableRows }: DonorsTableProps & { clickableRows?: boolean }) => {
  const [sortField, setSortField] = useState<keyof Donor>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Donor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDonors = [...donors].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleToggleStatus = async (donorId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('donors')
        .update({ is_eligible: !currentStatus })
        .eq('id', donorId);

      if (error) throw error;

      onRefresh();
    } catch (error) {
      console.error('Error updating donor status:', error);
    }
  };

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

  const SortableHeader = ({ field, children }: { field: keyof Donor; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50"
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

  const navigate = useNavigate();

  if (donors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No donors found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Call</TableHead>
            <SortableHeader field="name">Full Name</SortableHeader>
            <SortableHeader field="email">Email</SortableHeader>
            <SortableHeader field="age">Age</SortableHeader>
            <SortableHeader field="phone">Phone</SortableHeader>
            <SortableHeader field="blood_type">Blood Group</SortableHeader>
            <SortableHeader field="city">City</SortableHeader>
            <TableHead>Address</TableHead>
            <SortableHeader field="created_at">Date Registered</SortableHeader>
            <SortableHeader field="is_eligible">Status</SortableHeader>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDonors.map((donor) => (
            <TableRow
              key={donor.id}
              className={clickableRows ? "cursor-pointer hover:bg-blue-50" : ""}
              onClick={clickableRows ? () => navigate(`/admin/donor/${donor.id}`) : undefined}
            >
              <TableCell>
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
              <TableCell className="font-medium">{donor.name}</TableCell>
              <TableCell>{donor.email}</TableCell>
              <TableCell>{donor.age}</TableCell>
              <TableCell>{donor.phone}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blood/10 text-blood border-blood/20">
                  {donor.blood_type}
                </Badge>
              </TableCell>
              <TableCell>{donor.city}</TableCell>
              <TableCell className="max-w-32 truncate" title={donor.address}>
                {donor.address}
              </TableCell>
              <TableCell>
                {/* created_at is optional! */}
                {donor.created_at ? 
                  format(new Date(donor.created_at), 'MMM dd, yyyy') : 
                  <span>-</span>
                }
              </TableCell>
              <TableCell>
                <Badge 
                  variant={donor.is_eligible ? "default" : "secondary"}
                  className={donor.is_eligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {donor.is_eligible ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
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
                        handleToggleStatus(donor.id, donor.is_eligible);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {donor.is_eligible ? 'Inactive' : 'Activate'}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonorsTable;
