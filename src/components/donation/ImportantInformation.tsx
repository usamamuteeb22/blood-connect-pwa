
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ImportantInformation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Important Information</CardTitle>
        <CardDescription>
          What you need to know before donating
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Before Donation</h3>
          <p className="text-sm text-gray-600">
            Drink plenty of fluids, eat a healthy meal, and get adequate sleep the night before.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-2">During Donation</h3>
          <p className="text-sm text-gray-600">
            The process is safe and supervised by healthcare professionals. It takes about 8-10 minutes.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-2">After Donation</h3>
          <p className="text-sm text-gray-600">
            Rest for 10-15 minutes, have a snack and drink, and avoid strenuous activities for 24 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportantInformation;
