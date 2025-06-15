
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get user's name from metadata if available
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-5 mr-2 relative">
              <div className="absolute inset-0 bg-blood rounded-full"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-blood"></div>
            </div>
            <h1 className="text-2xl font-bold text-blood">
              One<span className="text-gray-800">Drop</span>
            </h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blood transition-colors">
            Home
          </Link>
          <Link to="/donate" className="text-gray-700 hover:text-blood transition-colors">
            Donate
          </Link>
          <Link to="/request" className="text-gray-700 hover:text-blood transition-colors">
            Request
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blood transition-colors">
            About
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">{userName}</span>
              <Link to="/dashboard">
                <Button variant="outline" className="border-blood text-blood hover:bg-blood hover:text-white">
                  Dashboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/auth">
                <Button variant="outline" className="border-blood text-blood hover:bg-blood hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-blood hover:bg-blood-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-md p-2 text-gray-700"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 inset-x-0 z-50 animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link to="/" className="text-gray-700 hover:text-blood p-2 transition-colors">
              Home
            </Link>
            <Link to="/donate" className="text-gray-700 hover:text-blood p-2 transition-colors">
              Donate
            </Link>
            <Link to="/request" className="text-gray-700 hover:text-blood p-2 transition-colors">
              Request
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blood p-2 transition-colors">
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="p-2">
                  <span className="font-medium">{userName}</span>
                </div>
                <Link to="/dashboard" className="text-gray-700 hover:text-blood p-2 transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blood p-2 transition-colors">
                  Profile
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-left text-blood hover:text-blood-700 p-2 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/auth">
                  <Button variant="outline" className="w-full border-blood text-blood">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="w-full bg-blood hover:bg-blood-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
