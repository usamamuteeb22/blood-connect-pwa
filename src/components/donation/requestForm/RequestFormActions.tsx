
import { Button } from "@/components/ui/button";

interface RequestFormActionsProps {
  isSubmitting: boolean;
}

const RequestFormActions = ({ isSubmitting }: RequestFormActionsProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-blood hover:bg-blood-600"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting..." : "Submit Blood Request"}
    </Button>
  );
};

export default RequestFormActions;
