
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Donor } from "@/types/custom";

interface DashboardHeaderProps {
  user: User | null;
  userDonor: Donor | null;
  onRegisterClick: () => void;
}

const DashboardHeader = ({ user, userDonor, onRegisterClick }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.user_metadata?.full_name || user?.email || "User"}
        </p>
      </div>
      <div className="flex space-x-2 mt-4 md:mt-0">
        <Button variant="outline">View Notifications</Button>
        {!userDonor ? (
          <Button 
            className="bg-blood hover:bg-blood-600"
            onClick={onRegisterClick}
          >
            Register as Donor
          </Button>
        ) : (
          <Button className="bg-blood hover:bg-blood-600">Find Donors</Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
