
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

const StandardRequestForm = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [bloodType, setBloodType] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    // Validate contact
    if (!contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10,}$/.test(contact.replace(/[^\d]/g, ''))) {
      newErrors.contact = "Please enter a valid contact number (at least 10 digits)";
    }
    
    // Validate blood type
    if (!bloodType) {
      newErrors.bloodType = "Blood type is required";
    }
    
    // Validate city
    if (!city.trim()) {
      newErrors.city = "City is required";
    }
    
    // Validate address
    if (!address.trim()) {
      newErrors.address = "Complete address is required";
    }

    // Validate reason
    if (!reason.trim()) {
      newErrors.reason = "Reason for request is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");
    
    if (!isAuthenticated) {
      setSubmitError("Please sign in to submit a blood request.");
      return;
    }
    
    if (!validateForm()) {
      setSubmitError("Please correct the highlighted errors to continue.");
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
            reason,
            status: "pending"
          }
        ]);
      
      if (error) throw error;
      
      setSuccessMessage("Your blood request has been successfully submitted.");
      
      // Clear form
      setName("");
      setContact("");
      setBloodType("");
      setCity("");
      setAddress("");
      setReason("");
      setErrors({});
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error: any) {
      setSubmitError(error.message || "There was a problem submitting your request.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Standard Blood Request</CardTitle>
      </CardHeader>
      
      {submitError && (
        <div className="px-6">
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        </div>
      )}
      
      {successMessage && (
        <div className="px-6">
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Full Name *</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="contact" className={errors.contact ? "text-destructive" : ""}>Contact Number *</Label>
            <Input
              id="contact"
              placeholder="Your phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className={errors.contact ? "border-destructive" : ""}
            />
            {errors.contact && <p className="text-sm font-medium text-destructive">{errors.contact}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="bloodType" className={errors.bloodType ? "text-destructive" : ""}>Blood Type Required *</Label>
            <Select value={bloodType} onValueChange={setBloodType} required>
              <SelectTrigger id="bloodType" className={errors.bloodType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bloodType && <p className="text-sm font-medium text-destructive">{errors.bloodType}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason" className={errors.reason ? "text-destructive" : ""}>Reason for Request *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide the reason for your blood request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className={errors.reason ? "border-destructive" : ""}
            />
            {errors.reason && <p className="text-sm font-medium text-destructive">{errors.reason}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="city" className={errors.city ? "text-destructive" : ""}>City *</Label>
            <Input
              id="city"
              placeholder="City where blood is needed"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && <p className="text-sm font-medium text-destructive">{errors.city}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="address" className={errors.address ? "text-destructive" : ""}>Full Address *</Label>
            <Input
              id="address"
              placeholder="Complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-sm font-medium text-destructive">{errors.address}</p>}
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
