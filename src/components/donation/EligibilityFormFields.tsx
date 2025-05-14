
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormMessage } from "@/components/ui/form";

interface EligibilityFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  bloodGroup: string;
  setBloodGroup: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  errors?: Record<string, string>;
}

const EligibilityFormFields = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  bloodGroup,
  setBloodGroup,
  age,
  setAge,
  weight,
  setWeight,
  city,
  setCity,
  address,
  setAddress,
  errors = {}
}: EligibilityFormFieldsProps) => {
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>Phone Number</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="bloodGroup" className={errors.bloodGroup ? "text-destructive" : ""}>Blood Group</Label>
        <Select 
          value={bloodGroup} 
          onValueChange={setBloodGroup} 
          required
        >
          <SelectTrigger 
            id="bloodGroup"
            className={errors.bloodGroup ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select your blood type" />
          </SelectTrigger>
          <SelectContent>
            {bloodTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bloodGroup && <p className="text-sm font-medium text-destructive">{errors.bloodGroup}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="age" className={errors.age ? "text-destructive" : ""}>Age (years)</Label>
        <Input
          id="age"
          type="number"
          min="18"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className={errors.age ? "border-destructive" : ""}
        />
        {errors.age && <p className="text-sm font-medium text-destructive">{errors.age}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight" className={errors.weight ? "text-destructive" : ""}>Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          min="50"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className={errors.weight ? "border-destructive" : ""}
        />
        {errors.weight && <p className="text-sm font-medium text-destructive">{errors.weight}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city" className={errors.city ? "text-destructive" : ""}>City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className={errors.city ? "border-destructive" : ""}
        />
        {errors.city && <p className="text-sm font-medium text-destructive">{errors.city}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address" className={errors.address ? "text-destructive" : ""}>Full Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className={errors.address ? "border-destructive" : ""}
        />
        {errors.address && <p className="text-sm font-medium text-destructive">{errors.address}</p>}
      </div>
    </div>
  );
};

export default EligibilityFormFields;
