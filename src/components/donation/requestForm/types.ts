
import * as z from "zod";

export const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const urgencyLevels = [
  { value: "normal", label: "Normal" },
  { value: "critical", label: "Critical" },
  { value: "needed_today", label: "Needed Today" }
];

export const requestFormSchema = z.object({
  bloodType: z.string().min(1, "Blood type is required"),
  reason: z.string().min(5, "Reason is required and must be at least 5 characters"),
  hospitalName: z.string().min(3, "Hospital name is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  contactName: z.string().min(3, "Contact name is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  urgencyLevel: z.string().min(1, "Request urgency is required"),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;
