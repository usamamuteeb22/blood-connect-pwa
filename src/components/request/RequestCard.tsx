
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface RequestCardProps {
  request: {
    id: string;
    requester_name: string;
    blood_type: string;
    created_at: string;
    reason?: string;
    city: string;
    address: string;
    contact: string;
  };
}

const RequestCard = ({ request }: RequestCardProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center gap-4 mb-3">
        <div className="h-12 w-12 rounded-full bg-blood text-white flex items-center justify-center font-bold text-lg">
          {request.blood_type}
        </div>
        <div>
          <h3 className="font-medium text-lg">{request.requester_name}</h3>
          <p className="text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {request.reason && (
          <div className="col-span-2">
            <h4 className="text-sm text-gray-500">Reason for Request</h4>
            <p>{request.reason}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm text-gray-500">City</h4>
          <p>{request.city}</p>
        </div>
        <div>
          <h4 className="text-sm text-gray-500">Contact</h4>
          <p>{request.contact}</p>
        </div>
        <div className="col-span-2">
          <h4 className="text-sm text-gray-500">Address</h4>
          <p>{request.address}</p>
        </div>
      </div>
      
      {isAuthenticated ? (
        <div className="flex justify-end">
          <Button 
            className="bg-blood hover:bg-blood-600"
            onClick={() => navigate('/dashboard', { state: { activeTab: 'donors' } })}
          >
            I Want to Donate
          </Button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button 
            className="bg-blood hover:bg-blood-600"
            onClick={() => navigate('/auth')}
          >
            Sign In to Donate
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
