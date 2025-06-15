
// SECURITY: Do NOT store any sensitive admin secrets in this file.
// WARNING: Current admin check only compares email (usamaweb246@gmail.com). 
// For real security, implement a robust admin role in Supabase and use claims-based verification!
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = 'usamaweb246@gmail.com';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        const isAdminUser = currentSession?.user?.email === ADMIN_EMAIL;
        setIsAdmin(isAdminUser);
        
        // Only set loading to false after we've processed the auth state
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      const isAdminUser = currentSession?.user?.email === ADMIN_EMAIL;
      setIsAdmin(isAdminUser);
      setLoading(false);
      
      if (currentSession?.user) {
        console.log("User authenticated:", currentSession.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error("Login failed, user not found.");
      }

      const isAdminUser = data.user.email === ADMIN_EMAIL;

      // Navigation will be handled by the auth state change listener
      setTimeout(() => {
        if (isAdminUser) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 100);
      
    } catch (error: any) {
      console.error("Authentication failed", error.message || "Please check your credentials and try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.name,
            phone: userData.phoneNumber,
            blood_type: userData.bloodType,
            role: userData.role,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Don't navigate immediately after signup as user needs to verify email
      console.log("User signed up successfully");
      
    } catch (error: any) {
      console.error("Registration failed", error.message || "There was a problem creating your account.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      console.error("Sign out failed", error.message || "There was a problem signing you out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
