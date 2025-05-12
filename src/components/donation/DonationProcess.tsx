
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DonationProcess = () => {
  // Donation process steps
  const donationProcess = [
    {
      title: "Registration",
      description: "Complete the donor registration form with your personal details",
    },
    {
      title: "Screening",
      description: "Brief health check including blood pressure, pulse, and hemoglobin levels",
    },
    {
      title: "Donation",
      description: "The actual donation takes only 8-10 minutes, with the entire process taking about an hour",
    },
    {
      title: "Refreshments",
      description: "Rest and enjoy light refreshments to help your body recover",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Process</CardTitle>
        <CardDescription>
          What to expect when you donate blood
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {donationProcess.map((step, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blood text-white font-bold mr-4">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationProcess;
