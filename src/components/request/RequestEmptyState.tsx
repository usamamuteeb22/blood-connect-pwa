
import { Button } from "@/components/ui/button";

interface RequestEmptyStateProps {
  filter: string;
  onCreateRequest: () => void;
}

const RequestEmptyState = ({ filter, onCreateRequest }: RequestEmptyStateProps) => {
  const getEmptyMessage = () => {
    if (filter === "all") return "No blood requests found.";
    if (filter === "needed_today") return "No needed today requests found.";
    return `No ${filter.replace('_', ' ')} requests found.`;
  };

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">{getEmptyMessage()}</p>
      <Button 
        className="bg-blood hover:bg-blood-600"
        onClick={onCreateRequest}
      >
        Create a Request
      </Button>
    </div>
  );
};

export default RequestEmptyState;
