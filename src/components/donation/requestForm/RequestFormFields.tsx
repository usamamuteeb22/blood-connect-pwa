
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { RequestFormValues, bloodTypes, urgencyLevels } from "./types";

interface RequestFormFieldsProps {
  control: Control<RequestFormValues>;
}

const RequestFormFields = ({ control }: RequestFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
        name="urgencyLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Request Urgency</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
        control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
    </>
  );
};

export default RequestFormFields;
