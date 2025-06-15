
import { supabase } from "@/integrations/supabase/client";
import { DonorFormData } from "@/types/donorForm";
import {
  validatePhone,
  validateAddress,
  validateEmail,
  validateAge,
  validateWeight,
} from "./donorFormValidation";

export const submitDonorForm = async (
  formData: DonorFormData,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void
) => {
  // Only check required fields: name, phone, blood_type, age, city
  if (
    !formData.name ||
    !formData.phone ||
    !formData.blood_type ||
    !formData.age ||
    !formData.city
  ) {
    throw new Error("Name, phone, blood type, age, and city are required fields.");
  }

  // Validate email only if provided
  if (formData.email && !validateEmail(formData.email)) {
    throw new Error("Invalid email address format.");
  }

  if (!validatePhone(formData.phone)) {
    throw new Error("Invalid phone number.");
  }

  // Validate address only if provided
  if (formData.address && !validateAddress(formData.address)) {
    throw new Error("Address must be between 6-255 characters.");
  }

  const ageValidation = validateAge(formData.age);
  if (!ageValidation.isValid) {
    throw new Error("Age must be a number between 18 and 65.");
  }

  const weightValidation = validateWeight(formData.weight);
  if (!weightValidation.isValid) {
    throw new Error("Weight must be at least 50kg if provided.");
  }

  // Get session info
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id || null;

  // Only admin can create new Supabase users
  let finalUserId = userId;
  let authData, authError;
  if (!userId) {
    // Only create auth user if email is provided
    if (formData.email) {
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
  }

  const { error: dbError } = await supabase.from("donors").insert({
    user_id: finalUserId,
    name: formData.name,
    email: formData.email || null,
    phone: formData.phone,
    age: ageValidation.parsedAge!,
    weight: weightValidation.parsedWeight || null,
    blood_type: formData.blood_type,
    city: formData.city,
    address: formData.address || null,
    is_eligible: formData.is_eligible,
    next_eligible_date: new Date().toISOString(),
    latitude: null,
    longitude: null,
  });

  if (dbError) throw new Error("Failed to save donor.");

  onSuccess();
  onOpenChange(false);
};
