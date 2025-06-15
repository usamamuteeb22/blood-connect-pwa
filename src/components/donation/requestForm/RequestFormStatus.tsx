
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RequestFormStatusProps {
  submitStatus: { type: 'success' | 'error'; message: string } | null;
}

const RequestFormStatus = ({ submitStatus }: RequestFormStatusProps) => {
  if (!submitStatus) return null;

  return (
    <Alert variant={submitStatus.type === 'error' ? 'destructive' : 'default'} className="mb-6">
      <AlertDescription>{submitStatus.message}</AlertDescription>
    </Alert>
  );
};

export default RequestFormStatus;
