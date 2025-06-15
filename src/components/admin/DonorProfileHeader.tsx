
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DonorProfileHeaderProps {
  onBack: () => void;
}

const DonorProfileHeader = ({ onBack }: DonorProfileHeaderProps) => {
  return (
    <div className="mb-4">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
    </div>
  );
};

export default DonorProfileHeader;
