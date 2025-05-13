
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Donate from "./pages/Donate";
import Request from "./pages/Request";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import EligibilityForm from "./components/donation/EligibilityForm";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/donate" element={<Donate />} />
    <Route path="/donate/eligibility" element={<EligibilityForm />} />
    <Route path="/request" element={<Request />} />
    <Route path="/about" element={<About />} />
    
    {/* Protected routes */}
    <Route path="/dashboard" element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    } />
    <Route path="/profile" element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    } />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
