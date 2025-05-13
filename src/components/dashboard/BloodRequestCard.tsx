
import { Button } from "@/components/ui/button";

interface RequestType {
  id: string;
  requester_id: string;
  donor_id?: string;
  requester_name: string;
  blood_type: string;
  city: string;
  address: string;
  contact: string;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
}

interface BloodRequestCardProps {
  request: RequestType;
  viewMode: "requester" | "donor";
  onApprove?: () => void;
  onReject?: () => void;
}

const BloodRequestCard = ({ 
  request, 
  viewMode, 
  onApprove, 
  onReject 
}: BloodRequestCardProps) => {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blood text-white flex items-center justify-center font-medium">
            {request.blood_type}
          </div>
          <div>
            <h3 className="font-medium">
              {viewMode === "requester" ? "Blood Request" : `Request from ${request.requester_name}`}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          request.status === 'pending' 
            ? 'bg-amber-100 text-amber-800'
            : request.status === 'approved'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Location</p>
          <p>{request.city}</p>
        </div>
        <div>
          <p className="text-gray-500">Contact</p>
          <p>{request.contact}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">Address</p>
          <p>{request.address}</p>
        </div>
      </div>
      
      {viewMode === "donor" && request.status === "pending" && (
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={onReject}>Reject</Button>
          <Button className="bg-blood hover:bg-blood-600" size="sm" onClick={onApprove}>Approve</Button>
        </div>
      )}
    </div>
  );
};

export default BloodRequestCard;
