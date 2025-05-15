
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Donor } from "@/types/custom";

interface DashboardHeaderProps {
  user: User | null;
  userDonor: Donor | null;
  onRegisterClick: () => void;
}

const DashboardHeader = ({ 
  user
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.user_metadata?.full_name || user?.email || "User"}
        </p>
      </div>
      {/* Removed notification and donor register buttons */}
    </div>
  );
};

export default DashboardHeader;
