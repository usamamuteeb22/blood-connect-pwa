
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddDonorForm from "./AddDonorForm";

interface AddDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddDonorDialog = ({ open, onOpenChange, onSuccess }: AddDonorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Donor</DialogTitle>
          <DialogDescription>
            Manually add a new donor to the system. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <AddDonorForm onSuccess={onSuccess} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default AddDonorDialog;
