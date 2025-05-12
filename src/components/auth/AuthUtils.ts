
import type { UserProfile } from '@/types/custom';
import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // This is just a placeholder function
  // In a real implementation, we would fetch the profile from a profiles table
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return null;
    }
    
    return {
      id: data.user.id,
      name: data.user.user_metadata?.full_name || null,
      email: data.user.email,
      avatar_url: data.user.user_metadata?.avatar_url || null,
      blood_type: data.user.user_metadata?.blood_type || null,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
