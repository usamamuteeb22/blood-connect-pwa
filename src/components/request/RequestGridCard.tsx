
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, MapPin, Zap } from "lucide-react";
import { BloodRequestWithDonor } from "@/types/custom";

interface RequestGridCardProps {
  request: BloodRequestWithDonor;
  onRespond: (request: BloodRequestWithDonor) => void;
}

const RequestGridCard = ({ request, onRespond }: RequestGridCardProps) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'needed_today': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'needed_today': return <Zap className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'Critical';
      case 'needed_today': return 'Needed Today';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${getUrgencyColor(request.urgency_level)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {request.blood_type}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{request.requester_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`${getUrgencyColor(request.urgency_level)} text-xs`}>
                {getUrgencyLabel(request.urgency_level)}
              </Badge>
              {getUrgencyIcon(request.urgency_level)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4" />
          <span>{request.city}</span>
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Reason: </span>
          <span className="text-gray-700">{request.reason}</span>
        </div>

        <div className="text-sm">
          <span className="font-medium">Units needed: </span>
          <span className="text-gray-700">{request.units_needed}</span>
        </div>

        {request.needed_by && (
          <div className="text-sm">
            <span className="font-medium">Needed by: </span>
            <span className="text-gray-700">{new Date(request.needed_by).toLocaleDateString()}</span>
          </div>
        )}

        {request.hospital_name && (
          <div className="text-sm">
            <span className="font-medium">Hospital: </span>
            <span className="text-gray-700">{request.hospital_name}</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Posted {new Date(request.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          className="flex-1 bg-red-600 hover:bg-red-700"
          onClick={() => onRespond(request)}
        >
          Respond to Request
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => window.open(`tel:${request.contact}`, '_blank')}
        >
          Call
        </Button>
      </div>
    </div>
  );
};

export default RequestGridCard;
