
import { Button } from "@/components/ui/button";
import { AlertCircle, Zap } from "lucide-react";

interface RequestFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

const RequestFilters = ({ filter, onFilterChange }: RequestFiltersProps) => {
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        All Requests
      </Button>
      <Button
        variant={filter === "critical" ? "destructive" : "outline"}
        size="sm"
        onClick={() => onFilterChange("critical")}
      >
        <AlertCircle className="w-4 h-4 mr-1" />
        Critical
      </Button>
      <Button
        variant={filter === "needed_today" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("needed_today")}
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        <Zap className="w-4 h-4 mr-1" />
        Needed Today
      </Button>
      <Button
        variant={filter === "normal" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("normal")}
      >
        Normal
      </Button>
      {bloodTypes.map(type => (
        <Button
          key={type}
          variant={filter === type ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(type)}
          className="min-w-[50px]"
        >
          {type}
        </Button>
      ))}
    </div>
  );
};

export default RequestFilters;
