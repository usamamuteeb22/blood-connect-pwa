
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Donor } from "@/types/custom";

interface DonorDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDonor: Donor | null;
  onSendRequest: () => void;
}

const DonorDetailsDialog = ({ 
  open, 
  onOpenChange, 
  selectedDonor, 
  onSendRequest 
}: DonorDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Donor Information</DialogTitle>
        </DialogHeader>
        
        {selectedDonor && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-md p-4 text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blood text-white text-xl font-semibold mb-2">
                {selectedDonor.blood_type}
              </div>
              <h3 className="font-semibold text-lg">{selectedDonor.name}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <p className="text-gray-500">Phone:</p>
                <p className="font-medium">{selectedDonor.phone}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-gray-500">Email:</p>
                <p className="font-medium">{selectedDonor.email}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-gray-500">City:</p>
                <p className="font-medium">{selectedDonor.city}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-gray-500">Address:</p>
                <p className="font-medium">{selectedDonor.address}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button className="bg-blood hover:bg-blood-600" onClick={onSendRequest}>
                Request Blood
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonorDetailsDialog;
