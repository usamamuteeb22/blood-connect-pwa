
import { useState } from "react";
import { useDonorFormState } from "./useDonorFormState";
import { submitDonorForm } from "@/utils/donorFormSubmission";

export const useAddDonorForm = (onSuccess: () => void, onOpenChange: (open: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    formData,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    resetForm,
  } = useDonorFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await submitDonorForm(formData, onSuccess, onOpenChange);
      resetForm();
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
