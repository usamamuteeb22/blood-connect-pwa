
// Custom type definitions for the application

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  blood_type: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_conditions: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Donor {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  blood_type: string;
  age: number;
  weight: number;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  next_eligible_date: string;
  is_eligible: boolean;
  availability: boolean;
  created_at: string;
}

export interface BloodRequest {
  id: string;
  requester_id: string;
  donor_id?: string | null;
  requester_name: string;
  blood_type: string;
  reason: string;
  city: string;
  address: string;
  contact: string;
  status: "pending" | "approved" | "rejected" | "completed";
  urgency_level: "low" | "normal" | "high" | "critical";
  needed_by: string | null;
  units_needed: number;
  hospital_name: string | null;
  doctor_name: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  completed_at: string | null;
}

export interface Donation {
  id: string;
  donor_id: string;
  request_id: string | null;
  recipient_name: string;
  recipient_contact: string | null;
  blood_type: string;
  units_donated: number;
  city: string;
  hospital_name: string | null;
  donation_date: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "request_received" | "request_approved" | "request_rejected" | "donation_scheduled" | "donation_reminder" | "system_alert";
  title: string;
  message: string;
  is_read: boolean;
  related_id: string | null;
  related_type: "blood_request" | "donation" | "donor" | "general" | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Extended interfaces for joined data
export interface BloodRequestWithDonor extends BloodRequest {
  donor_name?: string | null;
  donor_phone?: string | null;
  donor_email?: string | null;
  donor_is_eligible?: boolean | null;
  donor_next_eligible_date?: string | null;
}

export interface DonationWithDetails extends Donation {
  donor_name?: string;
  donor_phone?: string;
  request_details?: BloodRequest;
}

export interface DonorWithStats extends Donor {
  total_donations?: number;
  total_requests_received?: number;
  donor_since?: string;
}
