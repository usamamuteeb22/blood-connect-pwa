
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const validatePhone = (phone: string) => {
  // Simple phone: digits, spaces, dashes, + allowed; min length 10
  return /^[\d\+\-\s]{10,20}$/.test(phone.trim());
};
const validateAddress = (address: string) => address.length > 5 && address.length < 256;

export const useAddDonorForm = (onSuccess: () => void, onOpenChange: (open: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.blood_type ||
        !formData.age ||
        !formData.weight ||
        !formData.city ||
        !formData.address
      ) {
        throw new Error("All required fields must be filled in.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Invalid email address format.");
      }
      if (!validatePhone(formData.phone)) {
        throw new Error("Invalid phone number.");
      }
      if (!validateAddress(formData.address)) {
        throw new Error("Address must be between 6-255 characters.");
      }

      const age = parseInt(formData.age);
      const weight = parseInt(formData.weight);

      if (isNaN(age) || age < 18 || age > 65) throw new Error("Age must be a number between 18 and 65.");
      if (isNaN(weight) || weight < 50) throw new Error("Weight must be at least 50kg.");

      // Get session info
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id || null;

      // Only admin can create new Supabase users
      let finalUserId = userId;
      let authData, authError;
      if (!userId) {
        const res = await supabase.auth.admin.createUser({
          email: formData.email,
          password: "TempPassword123!",
          email_confirm: true,
          user_metadata: {
            full_name: formData.name,
            phone: formData.phone,
            blood_type: formData.blood_type,
            role: "user",
          },
        });
        authData = res.data;
        authError = res.error;
        if (authError) {
          if (authError.message.includes("already registered")) {
            // Proceed: user already exists
          } else {
            throw new Error("Could not register user. Please verify they are not already registered.");
          }
        }
        finalUserId = authData?.user?.id || null;
      }

      if (!finalUserId) throw new Error("No valid user id found for donor record.");

      const { error: dbError } = await supabase.from("donors").insert({
        user_id: finalUserId,
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

      if (dbError) throw new Error("Failed to save donor.");

      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      // Never show technical details to users!
      setErrorMessage(error?.message || "Donor could not be added. Please check your input.");
      console.error("SECURITY: Error adding donor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
    errorMessage,
  };
};

