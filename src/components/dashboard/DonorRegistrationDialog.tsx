
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DonorRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DonorRegistrationDialog = ({ open, onOpenChange }: DonorRegistrationDialogProps) => {
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDonor, setExistingDonor] = useState<boolean>(false);
  const [checkingExisting, setCheckingExisting] = useState<boolean>(true);

  // Check if user is already a donor when dialog opens
  useEffect(() => {
    const checkExistingDonor = async () => {
      if (!user?.id || !open) {
        setCheckingExisting(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('donors')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing donor:', error);
          setError("Unable to check your registration status.");
        } else if (data) {
          setExistingDonor(true);
          setError("You have already registered as a blood donor. Each user can only register once.");
        } else {
          setExistingDonor(false);
          setError(null);
        }
      } catch (error) {
        console.error('Error checking existing donor:', error);
        setError("Unable to check your registration status.");
      } finally {
        setCheckingExisting(false);
      }
    };
    
    if (open) {
      checkExistingDonor();
    }
  }, [user?.id, open]);

  const handleDonorRegistration = async () => {
    if (!user) {
      setError("You must be logged in to register as a donor");
      return;
    }

    if (existingDonor) {
      setError("You have already registered as a blood donor. Each user can only register once.");
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
      
      // Double-check if donor already exists
      const { data: existingData } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (existingData) {
        setError("You have already registered as a blood donor. Each user can only register once.");
        setExistingDonor(true);
        setIsRegistering(false);
        return;
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
      
      if (error) {
        if (error.code === '23505') {
          setError("You have already registered as a blood donor. Each user can only register once.");
          setExistingDonor(true);
        } else {
          throw error;
        }
        setIsRegistering(false);
        return;
      }
      
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
            {existingDonor 
              ? "You have already registered as a blood donor."
              : "Are you sure you want to register as a blood donor? This will make your profile visible to those in need of blood donations."
            }
          </DialogDescription>
        </DialogHeader>
        
        {checkingExisting ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Checking your registration status...</p>
          </div>
        ) : existingDonor ? (
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Registration Restriction:</strong><br/>
                Each user can only register once as a blood donor to maintain database integrity and prevent duplicate entries.
              </p>
            </div>
          </div>
        ) : null}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {existingDonor ? "Close" : "Cancel"}
          </Button>
          {!existingDonor && !checkingExisting && (
            <Button 
              className="bg-blood hover:bg-blood-600"
              onClick={handleDonorRegistration}
              disabled={isRegistering || existingDonor}
            >
              {isRegistering ? "Registering..." : "Register Now"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonorRegistrationDialog;
