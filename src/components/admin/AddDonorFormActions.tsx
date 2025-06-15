
import { Button } from "@/components/ui/button";

interface AddDonorFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const AddDonorFormActions = ({ isLoading, onCancel }: AddDonorFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-blood hover:bg-blood-600"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Donor"}
      </Button>
    </div>
  );
};

export default AddDonorFormActions;
