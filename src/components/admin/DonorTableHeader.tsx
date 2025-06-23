
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Donor } from "@/types/custom";

interface DonorTableHeaderProps {
  sortField: keyof Donor;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Donor) => void;
}

const DonorTableHeader = ({ sortField, sortDirection, onSort }: DonorTableHeaderProps) => {
  const SortableHeader = ({ field, children }: { field: keyof Donor; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 px-2"
      onClick={() => onSort(field)}
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

  return (
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
  );
};

export default DonorTableHeader;
