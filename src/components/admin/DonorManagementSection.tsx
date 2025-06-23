
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DonorSearchFilters from "./DonorSearchFilters";
import DonorsTable from "./DonorsTable";
import AddDonorDialog from "./AddDonorDialog";
import DonorFilters from "./DonorFilters";
import type { Donor } from "@/types/custom";

interface DonorManagementSectionProps {
  donors: Donor[];
  filteredDonors: Donor[];
  searchQuery: { field: string; value: string };
  setSearchQuery: (q: { field: string; value: string }) => void;
  locationQuery: { city: string; address: string };
  setLocationQuery: (q: { city: string; address: string }) => void;
  bloodGroupFilter: string;
  setBloodGroupFilter: (bloodGroup: string) => void;
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  downloadLoading: boolean;
  onRefresh: () => void;
  onDownloadDonations: () => void;
}

const DonorManagementSection = ({
  donors,
  filteredDonors,
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  bloodGroupFilter,
  setBloodGroupFilter,
  showAddDialog,
  setShowAddDialog,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  downloadLoading,
  onRefresh,
  onDownloadDonations,
}: DonorManagementSectionProps) => {
  return (
    <>
      <Card>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-semibold">Donors Management</h2>
              <span className="text-sm text-gray-600">Search and manage all registered donors.</span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-blood hover:bg-blood-600 flex items-center gap-2"
              >
                + Add Donor
              </Button>
            </div>
          </div>

          {/* Advanced Search Filters */}
          <DonorSearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            bloodGroupFilter={bloodGroupFilter}
            setBloodGroupFilter={setBloodGroupFilter}
          />

          {/* Date Range Filter & Download */}
          <DonorFilters
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onDownloadDonations={onDownloadDonations}
            downloadLoading={downloadLoading}
          />

          {/* Results Info + CSV export */}
          <div className="flex flex-wrap items-center justify-between">
            <p className="text-xs text-gray-600">
              Showing {filteredDonors.length} of {donors.length} donors
            </p>
            {/* Export CSV/Excel */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => import('@/utils/exportUtils').then(m => m.exportToCSV(filteredDonors, 'donors'))}>Export CSV</Button>
              <Button variant="outline" size="sm" onClick={() => import('@/utils/exportUtils').then(m => m.exportToExcel(filteredDonors, 'donors'))}>Export Excel</Button>
            </div>
          </div>

          {/* Donor Table */}
          <DonorsTable 
            donors={filteredDonors}
            onRefresh={onRefresh}
            clickableRows
          />
        </div>
      </Card>

      {/* Add Donor Dialog */}
      <AddDonorDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={onRefresh}
      />
    </>
  );
};

export default DonorManagementSection;
