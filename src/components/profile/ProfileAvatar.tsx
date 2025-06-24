
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";

interface ProfileAvatarProps {
  isVerified: boolean;
}

const ProfileAvatar = ({ isVerified }: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
        <User className="w-16 h-16" />
      </div>
      {isVerified && (
        <Badge className="flex items-center space-x-1 bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
          <Shield className="w-3 h-3 mr-1" />
          <span>Verified Donor</span>
        </Badge>
      )}
    </div>
  );
};

export default ProfileAvatar;
