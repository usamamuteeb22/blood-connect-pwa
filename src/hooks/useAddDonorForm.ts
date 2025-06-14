
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  weight: "",
  blood_type: "",
  city: "",
  address: "",
  is_eligible: true,
};

export const useAddDonorForm = (onSuccess: () => void, onOpenChange: (open: boolean) => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.blood_type || !formData.age || !formData.weight || !formData.city || !formData.address) {
        throw new Error("Please fill in all required fields");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const age = parseInt(formData.age);
      const weight = parseInt(formData.weight);
      
      if (age < 18 || age > 65) throw new Error("Age must be between 18 and 65");
      if (weight < 50) throw new Error("Weight must be at least 50kg");

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: 'TempPassword123!',
        email_confirm: true,
        user_metadata: {
          full_name: formData.name,
          phone: formData.phone,
          blood_type: formData.blood_type,
          role: 'user'
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        throw authError;
      }

      const userId = authData?.user?.id || null;

      const { error: dbError } = await supabase.from('donors').insert({
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

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: userId 
          ? "Donor has been added successfully. They can log in with their email and password 'TempPassword123!'."
          : "Donor has been added successfully to the database.",
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

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};
