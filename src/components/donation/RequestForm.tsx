
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RequestFormValues, requestFormSchema } from "./requestForm/types";
import RequestFormFields from "./requestForm/RequestFormFields";
import RequestFormActions from "./requestForm/RequestFormActions";
import RequestFormStatus from "./requestForm/RequestFormStatus";

const RequestForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      bloodType: "",
      reason: "",
      hospitalName: "",
      city: "",
      address: "",
      contactName: user ? user.user_metadata?.full_name || "" : "",
      contactPhone: user ? user.user_metadata?.phone || "" : "",
      urgencyLevel: "normal",
    },
  });

  const onSubmit = async (data: RequestFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Create request in database
      const { error } = await supabase.from("blood_requests").insert({
        requester_id: user ? user.id : null,
        requester_name: data.contactName,
        blood_type: data.bloodType,
        reason: data.reason,
        city: data.city,
        address: `${data.hospitalName}, ${data.address}`,
        contact: data.contactPhone,
        urgency_level: data.urgencyLevel,
        status: "pending",
      });

      if (error) throw error;

      const getSuccessMessage = (urgency: string) => {
        switch (urgency) {
          case 'critical':
            return 'Your critical blood request has been submitted successfully. We will prioritize notifying donors immediately.';
          case 'needed_today':
            return 'Your urgent blood request has been submitted successfully. We will notify donors for immediate response.';
          default:
            return 'Your blood request has been submitted successfully. We will notify you when donors respond.';
        }
      };

      setSubmitStatus({
        type: 'success',
        message: getSuccessMessage(data.urgencyLevel)
      });

      form.reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'There was a problem submitting your request. Please try again.'
      });
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <RequestFormStatus submitStatus={submitStatus} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RequestFormFields control={form.control} />
            <RequestFormActions isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;
