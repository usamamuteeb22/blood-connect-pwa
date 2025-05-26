
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UserRole = "donor" | "recipient" | "hospital";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const { signIn, signUp } = useAuth();
  
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("donor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (mode === "signup") {
      if (!name.trim()) {
        newErrors.name = "Full name is required";
      }
      
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }
      
      if (!bloodType) {
        newErrors.bloodType = "Blood type is required";
      }
      
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        const userData = {
          name,
          phoneNumber,
          bloodType,
          role: selectedRole
        };
        await signUp(email, password, userData);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const roleOptions: { value: UserRole; label: string }[] = [
    { value: "donor", label: "Donor" },
    { value: "recipient", label: "Recipient" },
    { value: "hospital", label: "Hospital" },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === "signin" 
            ? "Enter your credentials to access your account" 
            : "Join OneDrop to start saving lives today"}
        </CardDescription>
      </CardHeader>
      
      {error && (
        <div className="px-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <Tabs defaultValue={mode} onValueChange={(value) => setMode(value as "signin" | "signup")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={fieldErrors.email ? "text-destructive" : ""}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErrors.email ? "border-destructive" : ""}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-destructive">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={fieldErrors.password ? "text-destructive" : ""}>Password</Label>
                  <a href="#" className="text-xs text-blood hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldErrors.password ? "border-destructive" : ""}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-destructive">{fieldErrors.password}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-blood hover:bg-blood-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={fieldErrors.name ? "text-destructive" : ""}>Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldErrors.name ? "border-destructive" : ""}
                />
                {fieldErrors.name && (
                  <p className="text-sm text-destructive">{fieldErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className={fieldErrors.email ? "text-destructive" : ""}>Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErrors.email ? "border-destructive" : ""}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-destructive">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className={fieldErrors.phoneNumber ? "text-destructive" : ""}>Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (123) 456-7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className={fieldErrors.phoneNumber ? "border-destructive" : ""}
                />
                {fieldErrors.phoneNumber && (
                  <p className="text-sm text-destructive">{fieldErrors.phoneNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType" className={fieldErrors.bloodType ? "text-destructive" : ""}>Blood Type</Label>
                <Select value={bloodType} onValueChange={setBloodType} required>
                  <SelectTrigger id="bloodType" className={fieldErrors.bloodType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.bloodType && (
                  <p className="text-sm text-destructive">{fieldErrors.bloodType}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Register as</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((role) => (
                    <Button
                      key={role.value}
                      type="button"
                      variant={selectedRole === role.value ? "default" : "outline"}
                      className={`${
                        selectedRole === role.value 
                          ? "bg-blood hover:bg-blood-600" 
                          : "border-blood text-blood hover:bg-blood-50"
                      }`}
                      onClick={() => setSelectedRole(role.value)}
                    >
                      {role.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className={fieldErrors.password ? "text-destructive" : ""}>Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldErrors.password ? "border-destructive" : ""}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-destructive">{fieldErrors.password}</p>
                )}
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blood hover:bg-blood-600"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{" "}
                <a href="/terms" className="text-blood hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blood hover:underline">
                  Privacy Policy
                </a>
              </p>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
