
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const RequestForm = () => {
  const { toast } = useToast();
  
  const [bloodType, setBloodType] = useState<string>("");
  const [hospital, setHospital] = useState<string>("");
  const [units, setUnits] = useState<string>("1");
  const [urgency, setUrgency] = useState<string>("medium");
  const [reason, setReason] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // Mock hospitals data
  const hospitals = [
    "City General Hospital",
    "Medical Center",
    "Community Hospital",
    "Regional Medical Center",
    "University Hospital",
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bloodType || !hospital) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulated request submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Blood request submitted",
        description: "Your request has been successfully submitted.",
      });
      
      // Clear form
      setBloodType("");
      setHospital("");
      setUnits("1");
      setUrgency("medium");
      setReason("");
      setPatientName("");
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request Blood</CardTitle>
        <CardDescription>
          Fill out the form below to request blood donation. All request information is kept confidential.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
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
            <Label htmlFor="hospital">Hospital/Medical Facility *</Label>
            <Select value={hospital} onValueChange={setHospital} required>
              <SelectTrigger id="hospital">
                <SelectValue placeholder="Select or enter hospital name" />
              </SelectTrigger>
              <SelectContent>
                {hospitals.map(hospital => (
                  <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="units">Number of Units</Label>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger id="units">
                  <SelectValue placeholder="Select units needed" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(unit => (
                    <SelectItem key={unit} value={unit.toString()}>{unit} unit{unit > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Urgency Level</Label>
              <RadioGroup value={urgency} onValueChange={setUrgency} className="flex space-x-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-green-600">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-amber-600">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-blood">High</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="patientName">Patient Name (Optional)</Label>
            <Input 
              id="patientName" 
              placeholder="Patient name if you're requesting for someone else"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea 
              id="reason" 
              placeholder="Please provide brief details about the need for blood donation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
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

export default RequestForm;
