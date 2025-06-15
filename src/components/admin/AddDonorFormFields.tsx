
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DonorFormData } from "@/types/donorForm";

interface AddDonorFormFieldsProps {
  formData: DonorFormData;
  handleInputChange: (field: string, value: string | boolean) => void;
}

const AddDonorFormFields = ({ formData, handleInputChange }: AddDonorFormFieldsProps) => {
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email - optional */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            min="18"
            max="65"
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="25"
            required
          />
        </div>

        {/* Weight - optional */}
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="50"
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="70"
          />
          <p className="text-xs text-gray-500">Optional - leave empty if unknown</p>
        </div>

        {/* Blood Type */}
        <div className="space-y-2">
          <Label htmlFor="blood_type">Blood Group *</Label>
          <Select value={formData.blood_type} onValueChange={(value) => handleInputChange("blood_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="New York"
            required
          />
        </div>
      </div>

      {/* Address - optional */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="123 Main Street, Apt 4B, New York, NY 10001"
          rows={3}
        />
        <p className="text-xs text-gray-500">Optional - leave empty if unknown</p>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="is_eligible"
          checked={formData.is_eligible}
          onCheckedChange={(checked) => handleInputChange("is_eligible", checked)}
        />
        <Label htmlFor="is_eligible">Active Status</Label>
        <span className="text-sm text-gray-500">
          (Donor is eligible to donate)
        </span>
      </div>
    </>
  );
};

export default AddDonorFormFields;
