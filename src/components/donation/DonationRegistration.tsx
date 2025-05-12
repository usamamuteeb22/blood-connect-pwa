
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DonationRegistrationProps {
  onFindDonationCenters: () => void;
  onScheduleDonation: () => void;
}

const DonationRegistration = ({ 
  onFindDonationCenters, 
  onScheduleDonation 
}: DonationRegistrationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register for Donation</CardTitle>
        <CardDescription>
          Schedule your blood donation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Ready to donate? Register here and we'll help you schedule your donation at a nearby blood bank or donation center.
        </p>
        <div className="flex space-x-3">
          <Button 
            className="flex-1 bg-blood hover:bg-blood-600"
            onClick={onFindDonationCenters}
          >
            Find Donation Centers
          </Button>
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={onScheduleDonation}
          >
            Schedule Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationRegistration;
