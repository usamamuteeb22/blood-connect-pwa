
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ProfileHeader = ({ isEditing, onEdit, onCancel, onSave }: ProfileHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your profile and settings</CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={onEdit}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button className="bg-blood hover:bg-blood-600" onClick={onSave}>Save</Button>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default ProfileHeader;
