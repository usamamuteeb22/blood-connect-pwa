
import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import DonorTableHeader from "./DonorTableHeader";
import DonorTableRow from "./DonorTableRow";
import { useDonorTableLogic } from "@/hooks/useDonorTableLogic";
import type { Donor } from "@/types/custom";

interface DonorsTableProps {
  donors: Donor[];
  onRefresh: () => void;
  clickableRows?: boolean;
}

const DonorsTable = ({ donors, onRefresh, clickableRows }: DonorsTableProps) => {
  const {
    sortField,
    sortDirection,
    sortedDonors,
    loading,
    handleSort,
    handleDelete
  } = useDonorTableLogic(donors);

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
        <DonorTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <TableBody>
          {sortedDonors.map((donor, index) => (
            <DonorTableRow
              key={donor.id}
              donor={donor}
              index={index}
              clickableRows={clickableRows}
              onDelete={(donorId) => handleDelete(donorId, onRefresh)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonorsTable;
