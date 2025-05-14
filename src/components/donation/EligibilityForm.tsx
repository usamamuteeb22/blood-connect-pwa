
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EligibilityFormFields from "@/components/donation/EligibilityFormFields";
import EligibilityNotice from "@/components/donation/EligibilityNotice";
import EligibilityFormActions from "@/components/donation/EligibilityFormActions";

const EligibilityForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits)";
    }
    
    // Validate blood group
    if (!bloodGroup) {
      newErrors.bloodGroup = "Blood group selection is required";
    }
    
    // Validate age
    const ageValue = parseInt(age);
    if (!age) {
      newErrors.age = "Age is required";
    } else if (isNaN(ageValue)) {
      newErrors.age = "Age must be a number";
    } else if (ageValue < 18) {
      newErrors.age = "You must be at least 18 years old to donate blood";
    }
    
    // Validate weight
    const weightValue = parseInt(weight);
    if (!weight) {
      newErrors.weight = "Weight is required";
    } else if (isNaN(weightValue)) {
      newErrors.weight = "Weight must be a number";
    } else if (weightValue < 50) {
      newErrors.weight = "You must weigh at least 50kg to donate blood";
    }
    
    // Validate city
    if (!city.trim()) {
      newErrors.city = "City is required";
    }
    
    // Validate address
    if (!address.trim()) {
      newErrors.address = "Address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Form has validation errors
      toast({
        title: "Form Validation Failed",
        description: "Please correct the highlighted errors to continue.",
        variant: "destructive",
      });
      return;
    }
    
    const ageValue = parseInt(age);
    const weightValue = parseInt(weight);
    
    if (ageValue < 18 || weightValue < 50) {
      let eligibilityError = "";
      if (ageValue < 18 && weightValue < 50) {
        eligibilityError = "You must be at least 18 years old and weigh at least 50kg to donate blood.";
      } else if (ageValue < 18) {
        eligibilityError = "You must be at least 18 years old to donate blood.";
      } else {
        eligibilityError = "You must weigh at least 50kg to donate blood.";
      }
      
      toast({
        title: "Eligibility Check Failed",
        description: eligibilityError,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register user as donor in Supabase
      const { error } = await supabase
        .from('donors')
        .insert([
          { 
            user_id: user?.id || null,
            name, 
            email, 
            phone, 
            blood_type: bloodGroup,
            age: ageValue,
            weight: weightValue,
            city,
            address,
            next_eligible_date: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString(),
            is_eligible: true
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Registration Successful",
        description: "You are now registered as a blood donor!",
      });
      navigate("/donate");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error registering you as a donor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate("/donate");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Blood Donor Eligibility Form</CardTitle>
              <CardDescription className="text-center">
                Complete this form to register as a blood donor and check your eligibility
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <EligibilityFormFields
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  bloodGroup={bloodGroup}
                  setBloodGroup={setBloodGroup}
                  age={age}
                  setAge={setAge}
                  weight={weight}
                  setWeight={setWeight}
                  city={city}
                  setCity={setCity}
                  address={address}
                  setAddress={setAddress}
                  errors={errors}
                />
                
                <EligibilityNotice />
              </CardContent>
              <CardFooter>
                <EligibilityFormActions 
                  isLoading={isLoading}
                  onCancel={handleCancel}
                />
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EligibilityForm;
