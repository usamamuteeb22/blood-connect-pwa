
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import PasswordSection from "./PasswordSection";

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
  
  return (
    <Card className="w-full">
      <ProfileHeader
        isEditing={isEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
      />
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-1 max-w-[400px] mx-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <TabsContent value="profile" className="mt-0 space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <ProfileAvatar isVerified={userProfile.isVerified} />
              
              <ProfileForm
                isEditing={isEditing}
                userProfile={userProfile}
                editedProfile={editedProfile}
                onInputChange={handleInputChange}
                onSwitchChange={handleSwitchChange}
              />
            </div>
            
            <Separator />
            
            <PasswordSection />
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
