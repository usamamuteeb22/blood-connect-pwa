
import { Badge } from "@/components/ui/badge";

interface RecognitionCardProps {
  rank: string;
  bloodType: string;
  badges: string[];
}

const RecognitionCard = ({ rank, bloodType, badges }: RecognitionCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{rank}</span>
        <Badge className="bg-blood">{bloodType}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, i) => (
          <Badge key={i} variant="outline" className="border-blood-200 text-blood-700 bg-blood-50">
            {badge}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecognitionCard;
