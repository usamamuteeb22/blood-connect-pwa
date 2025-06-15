
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
import { toast } from "sonner";

const StandardRequestForm = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    bloodType: "",
    city: "",
    address: "",
    reason: "",
    urgencyLevel: "normal" as "low" | "normal" | "high" | "critical",
    unitsNeeded: 1,
    neededBy: "",
    hospitalName: "",
    doctorName: "",
    additionalNotes: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyLevels = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10,}$/.test(formData.contact.replace(/[^\d]/g, ''))) {
      newErrors.contact = "Please enter a valid contact number (at least 10 digits)";
    }
    if (!formData.bloodType) newErrors.bloodType = "Blood type is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Complete address is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason for request is required";
    if (formData.unitsNeeded < 1) newErrors.unitsNeeded = "Units needed must be at least 1";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to submit a blood request.");
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please correct the highlighted errors to continue.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Find donors matching the requested blood type and city
      const { data: donors } = await supabase
        .from('donors')
        .select('id, name')
        .eq('blood_type', formData.bloodType)
        .eq('city', formData.city)
        .eq('is_eligible', true)
        .limit(1);
      
      // Get the first available donor
      const donorId = donors && donors.length > 0 ? donors[0].id : null;
      
      // Create the blood request with all new fields
      const requestData = {
        requester_id: user!.id,
        donor_id: donorId,
        requester_name: formData.name,
        blood_type: formData.bloodType,
        reason: formData.reason,
        city: formData.city,
        address: formData.address,
        contact: formData.contact,
        status: "pending" as const,
        urgency_level: formData.urgencyLevel,
        units_needed: formData.unitsNeeded,
        needed_by: formData.neededBy || null,
        hospital_name: formData.hospitalName || null,
        doctor_name: formData.doctorName || null,
        additional_notes: formData.additionalNotes || null
      };
      
      const { error } = await supabase
        .from('blood_requests')
        .insert([requestData]);
      
      if (error) throw error;
      
      // Create notification for the donor if one was found
      if (donorId) {
        const { data: donorUser } = await supabase
          .from('donors')
          .select('user_id, name')
          .eq('id', donorId)
          .single();
          
        if (donorUser) {
          await supabase
            .from('notifications')
            .insert([{
              user_id: donorUser.user_id,
              type: "request_received",
              title: "New Blood Request",
              message: `You have received a new ${formData.bloodType} blood request from ${formData.name} in ${formData.city}.`,
              related_type: "blood_request"
            }]);
        }
      }
      
      // Log activity
      await supabase
        .from('activity_logs')
        .insert([{
          user_id: user!.id,
          action: "blood_request_created",
          entity_type: "blood_request",
          details: {
            blood_type: formData.bloodType,
            city: formData.city,
            urgency_level: formData.urgencyLevel
          }
        }]);
      
      toast.success("Your blood request has been successfully submitted.");
      
      // Clear form
      setFormData({
        name: "",
        contact: "",
        bloodType: "",
        city: "",
        address: "",
        reason: "",
        urgencyLevel: "normal",
        unitsNeeded: 1,
        neededBy: "",
        hospitalName: "",
        doctorName: "",
        additionalNotes: ""
      });
      setErrors({});
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast.error(error.message || "There was a problem submitting your request.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Standard Blood Request</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Full Name *</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                required
                className={errors.contact ? "border-destructive" : ""}
              />
              {errors.contact && <p className="text-sm font-medium text-destructive">{errors.contact}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="bloodType" className={errors.bloodType ? "text-destructive" : ""}>Blood Type Required *</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)} required>
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
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select value={formData.urgencyLevel} onValueChange={(value: any) => handleInputChange("urgencyLevel", value)}>
                <SelectTrigger id="urgencyLevel">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="unitsNeeded">Units Needed</Label>
              <Input
                id="unitsNeeded"
                type="number"
                min="1"
                value={formData.unitsNeeded}
                onChange={(e) => handleInputChange("unitsNeeded", parseInt(e.target.value) || 1)}
                className={errors.unitsNeeded ? "border-destructive" : ""}
              />
              {errors.unitsNeeded && <p className="text-sm font-medium text-destructive">{errors.unitsNeeded}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="neededBy">Needed By (Optional)</Label>
              <Input
                id="neededBy"
                type="date"
                value={formData.neededBy}
                onChange={(e) => handleInputChange("neededBy", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city" className={errors.city ? "text-destructive" : ""}>City *</Label>
              <Input
                id="city"
                placeholder="City where blood is needed"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && <p className="text-sm font-medium text-destructive">{errors.city}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason" className={errors.reason ? "text-destructive" : ""}>Reason for Request *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide the reason for your blood request"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              required
              className={errors.reason ? "border-destructive" : ""}
            />
            {errors.reason && <p className="text-sm font-medium text-destructive">{errors.reason}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="address" className={errors.address ? "text-destructive" : ""}>Full Address *</Label>
            <Input
              id="address"
              placeholder="Complete address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-sm font-medium text-destructive">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="hospitalName">Hospital Name (Optional)</Label>
              <Input
                id="hospitalName"
                placeholder="Hospital or medical facility"
                value={formData.hospitalName}
                onChange={(e) => handleInputChange("hospitalName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="doctorName">Doctor Name (Optional)</Label>
              <Input
                id="doctorName"
                placeholder="Attending physician"
                value={formData.doctorName}
                onChange={(e) => handleInputChange("doctorName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any additional information or special requirements"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
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
