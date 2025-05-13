
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const StandardRequestForm = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [bloodType, setBloodType] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a blood request.",
      });
      navigate("/auth");
      return;
    }
    
    if (!bloodType || !city || !address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Find donors matching the requested blood type
      const { data: donors } = await supabase
        .from('donors')
        .select('id')
        .eq('blood_type', bloodType)
        .eq('city', city);
      
      // Get the first donor (in a real app, you'd show a list to choose from)
      const donorId = donors && donors.length > 0 ? donors[0].id : null;
      
      // Create the blood request
      const { error } = await supabase
        .from('blood_requests')
        .insert([
          {
            requester_id: user!.id,
            donor_id: donorId,
            requester_name: name,
            blood_type: bloodType,
            city,
            address,
            contact,
            status: "pending"
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Request submitted",
        description: "Your blood request has been successfully submitted.",
      });
      
      // Clear form
      setName("");
      setContact("");
      setBloodType("");
      setCity("");
      setAddress("");
      
      // Navigate to dashboard to view request
      navigate("/dashboard");
      
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem submitting your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Standard Blood Request</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="contact">Contact Number *</Label>
            <Input
              id="contact"
              placeholder="Your phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="bloodType">Blood Type Required *</Label>
            <Select value={bloodType} onValueChange={setBloodType} required>
              <SelectTrigger id="bloodType">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="City where blood is needed"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="address">Full Address *</Label>
            <Input
              id="address"
              placeholder="Complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-blood hover:bg-blood-600"
            disabled={isLoading}
          >
            {isLoading ? "Submitting Request..." : "Submit Blood Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StandardRequestForm;
