import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EligibilityFormFields from "@/components/donation/EligibilityFormFields";
import EligibilityNotice from "@/components/donation/EligibilityNotice";
import EligibilityFormActions from "@/components/donation/EligibilityFormActions";

// Reverse geocoding function using OpenCage API (free tier available)
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using OpenCage Geocoding API (you can also use Google Maps Geocoding API)
    // For production, you'd need to add your API key
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_API_KEY&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const components = data.results[0].components;
      return components.city || components.town || components.village || components.county || 'Unknown City';
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback: extract city from form input
    return 'Unknown City';
  }
};

const EligibilityForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(coords);
        
        // Try to get city from coordinates
        try {
          const detectedCity = await reverseGeocode(coords.lat, coords.lng);
          if (detectedCity !== 'Unknown City') {
            setCity(detectedCity);
          }
        } catch (error) {
          console.error('Failed to get city from coordinates:', error);
        }
        
        setLocationLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  // Auto-fetch location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);
  
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
    setSubmitError("");
    setSuccessMessage("");
    
    if (!validateForm()) {
      setSubmitError("Please correct the highlighted errors to continue.");
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
      
      setSubmitError(eligibilityError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register user as donor in Supabase with accurate location data
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
            city: city.trim(),
            address,
            latitude: currentPosition?.lat || null,
            longitude: currentPosition?.lng || null,
            next_eligible_date: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString(),
            is_eligible: true,
            availability: true
          }
        ]);
      
      if (error) throw error;
      
      setSuccessMessage("You are now registered as a blood donor!");
      
      // Navigate to donate page after a short delay
      setTimeout(() => {
        navigate("/donate");
      }, 2000);
    } catch (error: any) {
      setSubmitError(error.message || "There was an error registering you as a donor.");
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
            
            {!currentPosition && (
              <div className="px-6">
                <Alert>
                  <AlertDescription className="flex items-center justify-between">
                    <span>
                      {locationLoading 
                        ? "Getting your location..." 
                        : "Enable location access to help others find you as a donor"
                      }
                    </span>
                    {!locationLoading && (
                      <Button 
                        onClick={getCurrentLocation} 
                        variant="outline" 
                        size="sm"
                        className="ml-2"
                      >
                        Enable Location
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {currentPosition && (
              <div className="px-6">
                <Alert>
                  <AlertDescription>
                    ✅ Location detected: {currentPosition.lat.toFixed(4)}, {currentPosition.lng.toFixed(4)}
                    {city && ` (${city})`}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
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
