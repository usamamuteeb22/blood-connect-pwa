
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const PasswordSection = () => {
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
  );
};

export default PasswordSection;
