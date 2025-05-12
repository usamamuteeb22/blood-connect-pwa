
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfileCard = () => {
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (123) 456-7890",
    bloodType: "A+",
    lastDonation: "2023-04-15",
    location: "New York City, NY",
    isVerified: true,
    isAvailable: true,
    isPublicProfile: true,
    isLocationVisible: true,
    receiveNotifications: true,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(userProfile);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditedProfile({ ...editedProfile, [name]: checked });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your profile and privacy settings</CardDescription>
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 max-w-[400px] mx-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
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
                        onChange={handleInputChange}
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
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="lastDonation">Last Donation Date</Label>
                    {isEditing ? (
                      <Input 
                        id="lastDonation"
                        name="lastDonation"
                        type="date"
                        value={editedProfile.lastDonation}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium">{userProfile.lastDonation}</p>
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
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">Donation History</h3>
                  <p className="text-sm text-gray-500">Your past donation records</p>
                </div>
                <Button variant="outline" className="text-sm">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">April 15, 2023</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Check className="w-3 h-3 mr-1" /> Complete
                    </Badge>
                  </div>
                  <p className="font-medium">City General Hospital</p>
                  <p className="text-sm text-gray-500">Blood Type: A+</p>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">January 10, 2023</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Check className="w-3 h-3 mr-1" /> Complete
                    </Badge>
                  </div>
                  <p className="font-medium">Medical Center</p>
                  <p className="text-sm text-gray-500">Blood Type: A+</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublicProfile">Public Profile</Label>
                    <p className="text-sm text-gray-500">Allow others to view your profile</p>
                  </div>
                  <Switch 
                    id="isPublicProfile"
                    checked={isEditing ? editedProfile.isPublicProfile : userProfile.isPublicProfile}
                    onCheckedChange={isEditing ? 
                      (checked) => handleSwitchChange("isPublicProfile", checked) : 
                      undefined
                    }
                    disabled={!isEditing}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isLocationVisible">Location Visibility</Label>
                    <p className="text-sm text-gray-500">Show your location to potential recipients</p>
                  </div>
                  <Switch 
                    id="isLocationVisible"
                    checked={isEditing ? editedProfile.isLocationVisible : userProfile.isLocationVisible}
                    onCheckedChange={isEditing ? 
                      (checked) => handleSwitchChange("isLocationVisible", checked) : 
                      undefined
                    }
                    disabled={!isEditing}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="receiveNotifications">Notifications</Label>
                    <p className="text-sm text-gray-500">Receive alerts about nearby blood requests</p>
                  </div>
                  <Switch 
                    id="receiveNotifications"
                    checked={isEditing ? editedProfile.receiveNotifications : userProfile.receiveNotifications}
                    onCheckedChange={isEditing ? 
                      (checked) => handleSwitchChange("receiveNotifications", checked) : 
                      undefined
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="font-medium text-lg">Account Security</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start text-blood">
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        {!isEditing && activeTab === "profile" && (
          <Button variant="outline" className="text-blood border-blood hover:bg-blood-50">
            Download Medical Certificate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
