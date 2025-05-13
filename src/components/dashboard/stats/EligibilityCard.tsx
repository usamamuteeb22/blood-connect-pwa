
import { Progress } from "@/components/ui/progress";

interface EligibilityCardProps {
  eligibilityProgress: number;
  nextEligibleDate: string;
}

const EligibilityCard = ({ eligibilityProgress, nextEligibleDate }: EligibilityCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Eligibility</span>
        <span className="text-sm font-medium">{eligibilityProgress}%</span>
      </div>
      <Progress value={eligibilityProgress} className="h-2" />
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-500">Next eligible date</span>
        <span className="text-sm font-medium">{nextEligibleDate}</span>
      </div>
    </div>
  );
};

export default EligibilityCard;
