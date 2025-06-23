
export interface DonorFormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  weight: string;
  blood_type: string;
  city: string;
  address: string;
  is_eligible: boolean;
  last_donation_date: string;
}

export const initialFormData: DonorFormData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  weight: "",
  blood_type: "",
  city: "",
  address: "",
  is_eligible: true,
  last_donation_date: "",
};
