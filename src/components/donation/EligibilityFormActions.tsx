
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EligibilityFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const EligibilityFormActions = ({ isLoading, onCancel }: EligibilityFormActionsProps) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4">
      <Button 
        type="button"
        variant="outline"
        className="flex-1" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="flex-1 bg-blood hover:bg-blood-600"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit & Register as Donor"}
      </Button>
    </div>
  );
};

export default EligibilityFormActions;
