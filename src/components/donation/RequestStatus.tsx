
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RequestStatusProps {
  onViewPastRequests: () => void;
}

const RequestStatus = ({ onViewPastRequests }: RequestStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Status</CardTitle>
        <CardDescription>Track your ongoing blood requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 mb-4">You don't have any active blood requests</p>
          <Button 
            variant="outline"
            onClick={onViewPastRequests}
          >
            View Past Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestStatus;
