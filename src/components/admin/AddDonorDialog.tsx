
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddDonorDialog = ({ open, onOpenChange, onSuccess }: AddDonorDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    weight: "",
    blood_type: "",
    city: "",
    address: "",
    is_eligible: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      weight: "",
      blood_type: "",
      city: "",
      address: "",
      is_eligible: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.blood_type || 
          !formData.age || !formData.weight || !formData.city || !formData.address) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate age and weight
      const age = parseInt(formData.age);
      const weight = parseInt(formData.weight);
      
      if (age < 18 || age > 65) {
        throw new Error("Age must be between 18 and 65");
      }
      
      if (weight < 50) {
        throw new Error("Weight must be at least 50kg");
      }

      // Create a user account for this donor first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: 'TempPassword123!', // Temporary password - user should reset
        email_confirm: true,
        user_metadata: {
          full_name: formData.name,
          phone: formData.phone,
          blood_type: formData.blood_type,
          role: 'user'
        }
      });

      if (authError) {
        // If user already exists, try to find them
        if (authError.message.includes('already registered')) {
          const { data: existingUsers, error: fetchError } = await supabase
            .from('auth.users')
            .select('id')
            .eq('email', formData.email)
            .single();
            
          if (fetchError) {
            throw new Error(`User with email ${formData.email} already exists. Please use a different email or update the existing user.`);
          }
        } else {
          throw authError;
        }
      }

      const userId = authData?.user?.id;
      if (!userId) {
        throw new Error("Failed to create user account");
      }

      // Insert donor into database with the actual user ID
      const { error } = await supabase
        .from('donors')
        .insert({
          user_id: userId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: age,
          weight: weight,
          blood_type: formData.blood_type,
          city: formData.city,
          address: formData.address,
          is_eligible: formData.is_eligible,
          next_eligible_date: new Date().toISOString(),
          latitude: null,
          longitude: null,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Donor has been added successfully. They can log in with their email and password 'TempPassword123!' (they should change this).",
      });

      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding donor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add donor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Donor</DialogTitle>
          <DialogDescription>
            Manually add a new donor to the system. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="65"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="25"
                required
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                min="50"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="70"
                required
              />
            </div>

            {/* Blood Type */}
            <div className="space-y-2">
              <Label htmlFor="blood_type">Blood Group *</Label>
              <Select value={formData.blood_type} onValueChange={(value) => handleInputChange("blood_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="New York"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="123 Main Street, Apt 4B, New York, NY 10001"
              rows={3}
              required
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_eligible"
              checked={formData.is_eligible}
              onCheckedChange={(checked) => handleInputChange("is_eligible", checked)}
            />
            <Label htmlFor="is_eligible">Active Status</Label>
            <span className="text-sm text-gray-500">
              (Donor is eligible to donate)
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDonorDialog;
