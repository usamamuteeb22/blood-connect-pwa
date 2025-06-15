
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";

interface DonationHistoryCardProps {
  donations: any[];
}

const DonationHistoryCard = ({ donations }: DonationHistoryCardProps) => {
  return (
    <Card>
      <CardContent>
        <div className="py-2 font-semibold">
          Donation History ({donations.length} total)
        </div>
        {donations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No donations recorded yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map(donation => (
                <TableRow key={donation.id}>
                  <TableCell>{format(new Date(donation.date), "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell>{donation.recipient_name}</TableCell>
                  <TableCell>{donation.blood_type}</TableCell>
                  <TableCell>{donation.city}</TableCell>
                  <TableCell className="capitalize text-green-600 font-medium">
                    {donation.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationHistoryCard;
