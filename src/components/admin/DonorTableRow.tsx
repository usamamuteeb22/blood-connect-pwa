
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import type { Donor } from "@/types/custom";

interface DonorWithDonationCount extends Donor {
  donation_count: number;
}

interface DonorTableRowProps {
  donor: DonorWithDonationCount;
  index: number;
  clickableRows?: boolean;
  onDelete: (donorId: string) => void;
}

const DonorTableRow = ({ donor, index, clickableRows, onDelete }: DonorTableRowProps) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    if (clickableRows) {
      navigate(`/admin/donor/${donor.id}`);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getEligibilityStatus = () => {
    if (!donor.last_donation_date) {
      return { status: 'Eligible', variant: 'default' as const };
    }
    
    try {
      const lastDonationDate = new Date(donor.last_donation_date);
      const daysSinceLastDonation = differenceInDays(new Date(), lastDonationDate);
      
      if (daysSinceLastDonation >= 56) { // 8 weeks = 56 days
        return { status: 'Eligible', variant: 'default' as const };
      } else {
        const daysUntilEligible = 56 - daysSinceLastDonation;
        return { 
          status: `${daysUntilEligible} days`, 
          variant: 'secondary' as const 
        };
      }
    } catch {
      return { status: 'Unknown', variant: 'secondary' as const };
    }
  };

  const eligibility = getEligibilityStatus();

  return (
    <TableRow 
      className={clickableRows ? "cursor-pointer hover:bg-gray-50" : ""}
      onClick={handleRowClick}
    >
      <TableCell className="font-medium px-2 text-sm">{index + 1}</TableCell>
      <TableCell className="px-2">
        <a 
          href={`tel:${donor.phone}`}
          className="text-blue-600 hover:text-blue-800 p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="h-4 w-4" />
        </a>
      </TableCell>
      <TableCell className="font-medium px-2 text-sm max-w-[150px] truncate">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          {donor.name}
        </div>
      </TableCell>
      <TableCell className="px-2 text-sm">{donor.age}</TableCell>
      <TableCell className="px-2 text-sm font-mono">{donor.phone}</TableCell>
      <TableCell className="px-2">
        <Badge variant="outline" className="text-xs">
          {donor.blood_type}
        </Badge>
      </TableCell>
      <TableCell className="px-2 text-sm">{donor.city}</TableCell>
      <TableCell className="px-2 text-sm max-w-[200px] truncate">
        {donor.address || 'N/A'}
      </TableCell>
      <TableCell className="px-2 text-center">
        <Badge variant="secondary" className="text-xs">
          {donor.donation_count}
        </Badge>
      </TableCell>
      <TableCell className="px-2 text-sm">
        {formatDate(donor.last_donation_date)}
      </TableCell>
      <TableCell className="px-2 text-sm">
        {formatDate(donor.created_at)}
      </TableCell>
      <TableCell className="px-2">
        <Badge variant={eligibility.variant} className="text-xs">
          {eligibility.status}
        </Badge>
      </TableCell>
      <TableCell className="px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(donor.id);
          }}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default DonorTableRow;
