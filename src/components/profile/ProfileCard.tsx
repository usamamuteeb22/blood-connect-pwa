
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProfileCard = () => {
  const { user } = useAuth();
  
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    lastDonation: new Date().toISOString().split('T')[0],
    location: "",
    isVerified: false,
    isAvailable: true,
    isPublicProfile: true,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [donorId, setDonorId] = useState<string | null>(null);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        // Get user metadata
        const { data: { user: userData } } = await supabase.auth.getUser();
        
        if (userData) {
          setUserProfile({
            name: userData.user_metadata?.full_name || "",
            email: userData.email || "",
            phone: userData.user_metadata?.phone || "",
            bloodType: userData.user_metadata?.blood_type || "",
            lastDonation: new Date().toISOString().split('T')[0],
            location: userData.user_metadata?.city || "",
            isVerified: false,
            isAvailable: true,
            isPublicProfile: true,
          });
          
          setEditedProfile({
            name: userData.user_metadata?.full_name || "",
            email: userData.email || "",
            phone: userData.user_metadata?.phone || "",
            bloodType: userData.user_metadata?.blood_type || "",
            lastDonation: new Date().toISOString().split('T')[0],
            location: userData.user_metadata?.city || "",
            isVerified: false,
            isAvailable: true,
            isPublicProfile: true,
          });
          
          // Check if user is registered as donor
          const { data: donorData } = await supabase
            .from('donors')
            .select('id, is_eligible')
            .eq('user_id', userData.id)
            .single();
          
          if (donorData) {
            setDonorId(donorData.id);
            setUserProfile(prev => ({ ...prev, isAvailable: donorData.is_eligible }));
            setEditedProfile(prev => ({ ...prev, isAvailable: donorData.is_eligible }));
          }
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(userProfile);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    
    // Update donor eligibility if donor exists
    if (donorId && userProfile.isAvailable !== editedProfile.isAvailable) {
      await supabase
        .from('donors')
        .update({ is_eligible: editedProfile.isAvailable })
        .eq('id', donorId);
    }
    
    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        full_name: editedProfile.name,
        phone: editedProfile.phone,
        blood_type: editedProfile.bloodType,
        city: editedProfile.location
      }
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditedProfile({ ...editedProfile, [name]: checked });
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordError("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordChangeOpen(false);
        alert("Password updated successfully");
      }
    } catch (err: any) {
      setPasswordError(err.message);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your profile and settings</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={handleEdit}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button className="bg-blood hover:bg-blood-600" onClick={handleSave}>Save</Button>
            </div>
          )}
        </div>
      </CardHeader>
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-1 max-w-[400px] mx-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <TabsContent value="profile" className="mt-0 space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User className="w-16 h-16" />
                </div>
                {userProfile.isVerified && (
                  <Badge className="flex items-center space-x-1 bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    <span>Verified Donor</span>
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name"
                        name="name"
                        value={editedProfile.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium">{userProfile.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    {isEditing ? (
                      <Input 
                        id="bloodType"
                        name="bloodType"
                        value={editedProfile.bloodType}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium">{userProfile.bloodType}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={editedProfile.email}
                        disabled
                      />
                    ) : (
                      <p className="text-sm font-medium">{userProfile.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input 
                        id="phone"
                        name="phone"
                        value={editedProfile.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium">{userProfile.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input 
                        id="location"
                        name="location"
                        value={editedProfile.location}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium">{userProfile.location}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch 
                    id="isAvailable"
                    checked={isEditing ? editedProfile.isAvailable : userProfile.isAvailable}
                    onCheckedChange={isEditing ? 
                      (checked) => handleSwitchChange("isAvailable", checked) : 
                      undefined
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="isAvailable">Available to donate</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4 pt-4">
              <h3 className="font-medium text-lg">Account Security</h3>
              
              {isPasswordChangeOpen ? (
                <div className="space-y-4 p-4 border rounded-md">
                  <h4 className="text-md font-medium">Change Password</h4>
                  
                  {passwordError && (
                    <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" onClick={() => setIsPasswordChangeOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleChangePassword} className="bg-blood hover:bg-blood-600">
                      Update Password
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsPasswordChangeOpen(true)}
                  >
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-blood">
                    Delete Account
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
