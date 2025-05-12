
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmergencyRequestProps {
  onEmergencyRequest: () => void;
}

const EmergencyRequest = ({ onEmergencyRequest }: EmergencyRequestProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Requests</CardTitle>
        <CardDescription>For critical and urgent blood needs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          For life-threatening situations requiring immediate blood transfusion, please use our emergency channel.
        </p>
        <Button 
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={onEmergencyRequest}
        >
          Emergency Request
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmergencyRequest;
