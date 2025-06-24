
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  lastDonation: string;
  location: string;
  isVerified: boolean;
  isAvailable: boolean;
  isPublicProfile: boolean;
}

interface ProfileFormProps {
  isEditing: boolean;
  userProfile: UserProfile;
  editedProfile: UserProfile;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

const ProfileForm = ({ 
  isEditing, 
  userProfile, 
  editedProfile, 
  onInputChange, 
  onSwitchChange 
}: ProfileFormProps) => {
  return (
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          {isEditing ? (
            <Input 
              id="name"
              name="name"
              value={editedProfile.name}
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
            (checked) => onSwitchChange("isAvailable", checked) : 
            undefined
          }
          disabled={!isEditing}
        />
        <Label htmlFor="isAvailable">Available to donate</Label>
      </div>
    </div>
  );
};

export default ProfileForm;
