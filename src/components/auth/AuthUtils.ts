
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
  try {
    // First try to get user from auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData.user) {
      return null;
    }
    
    // Then try to get donor profile if available
    const { data: donorData, error: donorError } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    // Create profile from combined data
    return {
      id: authData.user.id,
      name: donorData?.name || authData.user.user_metadata?.full_name || null,
      email: authData.user.email,
      avatar_url: authData.user.user_metadata?.avatar_url || null,
      blood_type: donorData?.blood_type || authData.user.user_metadata?.blood_type || null,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
