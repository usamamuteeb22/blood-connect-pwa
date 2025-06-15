
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const requestFormSchema = z.object({
  bloodType: z.string().min(1, "Blood type is required"),
  reason: z.string().min(5, "Reason is required and must be at least 5 characters"),
  hospitalName: z.string().min(3, "Hospital name is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  contactName: z.string().min(3, "Contact name is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  isCritical: z.boolean().default(false),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

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
      isCritical: false,
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
        status: "pending",
      });

      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: data.isCritical 
          ? 'Your urgent blood request has been submitted successfully. We will prioritize notifying donors immediately.'
          : 'Your blood request has been submitted successfully. We will notify you when donors respond.'
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
        {submitStatus && (
          <Alert variant={submitStatus.type === 'error' ? 'destructive' : 'default'} className="mb-6">
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Blood Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Request</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide the reason for your blood request"
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hospitalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hospital name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact person's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isCritical"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-red-600">
                      Critical, Needed Today
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Check this box if this is an urgent request that needs immediate attention
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-blood hover:bg-blood-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Blood Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;
