
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={bloodGroup} onValueChange={setBloodGroup} required>
                      <SelectTrigger id="bloodGroup">
                        <SelectValue placeholder="Select your blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="50"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> To be eligible for blood donation, you must:
                  </p>
                  <ul className="mt-2 text-sm text-amber-800 list-disc pl-5">
                    <li>Be at least 18 years old</li>
                    <li>Weigh at least 50kg</li>
                    <li>Be in good health and feeling well</li>
                    <li>Not have donated blood in the last 3 months</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1" 
                    onClick={() => navigate("/donate")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blood hover:bg-blood-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit & Register as Donor"}
                  </Button>
                </div>
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
