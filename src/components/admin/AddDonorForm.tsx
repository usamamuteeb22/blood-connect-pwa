
import { useAddDonorForm } from "@/hooks/useAddDonorForm";
import AddDonorFormFields from "./AddDonorFormFields";
import AddDonorFormActions from "./AddDonorFormActions";

interface AddDonorFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

const AddDonorForm = ({ onSuccess, onOpenChange }: AddDonorFormProps) => {
  const { formData, isLoading, handleInputChange, handleSubmit, errorMessage } = useAddDonorForm(onSuccess, onOpenChange);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <AddDonorFormFields 
        formData={formData}
        handleInputChange={handleInputChange}
      />

      <AddDonorFormActions 
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </form>
  );
};

export default AddDonorForm;
