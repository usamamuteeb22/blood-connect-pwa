import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface DonorRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DonorRegistrationDialog = ({ open, onOpenChange }: DonorRegistrationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonorRegistration = async () => {
    if (!user) {
      setError("You must be logged in to register as a donor");
      return;
    }
    
    setIsRegistering(true);
    setError(null);
    
    try {
      // Get user metadata from auth
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error("Failed to fetch user data: " + userError.message);
      }
      
      if (!userData || !userData.user_metadata) {
        throw new Error("User data not available. Please complete your profile first.");
      }
      
      const metadata = userData.user_metadata;
      
      // Check if donor already exists
      const { data: existingDonor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (existingDonor) {
        throw new Error("You are already registered as a blood donor");
      }
      
      // Register as donor
      const { error } = await supabase
        .from('donors')
        .insert([
          {
            user_id: user.id,
            name: metadata.full_name || '',
            email: userData.email,
            phone: metadata.phone || '',
            blood_type: metadata.blood_type || 'O+',
            age: 0, // Default values since we don't have these
            weight: 0,
            city: '',
            address: '',
            next_eligible_date: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString(),
            is_eligible: true
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Registration Successful",
        description: "You are now registered as a blood donor!",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      setError(error.message || "Failed to register as donor.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register as Blood Donor</DialogTitle>
          <DialogDescription>
            Are you sure you want to register as a blood donor? This will make your profile visible to those in need of blood donations.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            className="bg-blood hover:bg-blood-600"
            onClick={handleDonorRegistration}
            disabled={isRegistering}
          >
            {isRegistering ? "Registering..." : "Register Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonorRegistrationDialog;
