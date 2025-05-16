
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EligibilityCriteriaProps {
  onFullEligibilityCheck: () => void;
}

const EligibilityCriteria = ({ onFullEligibilityCheck }: EligibilityCriteriaProps) => {
  const eligibilityCriteria = [
    { text: "You must be at least 18 years old", icon: <Check className="h-4 w-4" /> },
    { text: "You must weigh at least 110 pounds (50 kg)", icon: <Check className="h-4 w-4" /> },
    { text: "You must be in good health and feeling well", icon: <Check className="h-4 w-4" /> },
    { text: "You must not have donated blood in the last 8 weeks", icon: <Check className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Criteria</CardTitle>
        <CardDescription>
          Check if you're eligible to donate blood
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {eligibilityCriteria.map((criterion, index) => (
            <li key={index} className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 mr-3">
                {criterion.icon}
              </span>
              <span>{criterion.text}</span>
            </li>
          ))}
        </ul>
        <Button 
          className="w-full mt-6 bg-blood hover:bg-blood-600"
          onClick={onFullEligibilityCheck}
        >
          Become a Donor
        </Button>
      </CardContent>
    </Card>
  );
};

export default EligibilityCriteria;
