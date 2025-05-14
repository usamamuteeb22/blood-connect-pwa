
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(age) < 18 || parseInt(weight) < 50) {
      toast({
        title: "Eligibility Check Failed",
        description: "You must be at least 18 years old and weigh at least 50kg to donate blood.",
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
            age: parseInt(age),
            weight: parseInt(weight),
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
