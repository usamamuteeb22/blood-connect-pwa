
import { useState } from "react";
import { DonorFormData, initialFormData } from "@/types/donorForm";

export const useDonorFormState = () => {
  const [formData, setFormData] = useState<DonorFormData>(initialFormData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrorMessage(null);
  };

  return {
    formData,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    resetForm,
  };
};
