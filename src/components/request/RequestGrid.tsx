
import { BloodRequestWithDonor } from "@/types/custom";
import RequestGridCard from "./RequestGridCard";

interface RequestGridProps {
  requests: BloodRequestWithDonor[];
  onRespond: (request: BloodRequestWithDonor) => void;
}

const RequestGrid = ({ requests, onRespond }: RequestGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <RequestGridCard
          key={request.id}
          request={request}
          onRespond={onRespond}
        />
      ))}
    </div>
  );
};

export default RequestGrid;
