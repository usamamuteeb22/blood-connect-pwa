
// Custom type definitions for the application

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  blood_type: string | null;
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
  created_at?: string;
}

export interface BloodRequest {
  id: string;
  requester_id: string;
  donor_id?: string | null;
  requester_name: string;
  blood_type: string;
  city: string;
  address: string;
  contact: string;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  request_id: string;
  recipient_name: string;
  blood_type: string;
  city: string;
  date: string;
  status: "completed";
}

// Any other custom types can be added here
