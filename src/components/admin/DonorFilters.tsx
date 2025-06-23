
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

interface DonorFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDownloadDonations: () => void;
  downloadLoading: boolean;
}

const DonorFilters = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDownloadDonations,
  downloadLoading,
}: DonorFiltersProps) => {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-40"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="end-date">End Date</Label>
        <Input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-40"
        />
      </div>
      
      <Button
        onClick={onDownloadDonations}
        disabled={downloadLoading}
        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {downloadLoading ? "Downloading..." : "Download Donations (Excel)"}
      </Button>
    </div>
  );
};

export default DonorFilters;
