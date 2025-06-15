
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AdminPanelHeaderProps {
  onSignOut: () => void;
}

const AdminPanelHeader = ({ onSignOut }: AdminPanelHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blood">OneDrop Admin Panel</h1>
            <p className="text-gray-600">Manage donors and blood requests</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelHeader;
