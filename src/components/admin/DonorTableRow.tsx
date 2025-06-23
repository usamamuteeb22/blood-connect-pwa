
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
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

  const eligibility = calculateEligibility(donor.last_donation_date);

  return (
    <TableRow
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
                onDelete(donor.id);
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
};

export default DonorTableRow;
