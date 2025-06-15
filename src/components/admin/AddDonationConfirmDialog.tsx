
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddDonationConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  donorName: string;
  isLoading: boolean;
}

const AddDonationConfirmDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  donorName, 
  isLoading 
}: AddDonationConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Add Donation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to add a new donation entry for <strong>{donorName}</strong>? 
            This will add a new record to their donation history with today's date.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-blood hover:bg-blood-600"
          >
            {isLoading ? "Adding..." : "Confirm Add Donation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddDonationConfirmDialog;
