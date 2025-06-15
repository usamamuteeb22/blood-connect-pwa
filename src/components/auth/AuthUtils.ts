
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
      user_id: authData.user.id,
      full_name: donorData?.name || authData.user.user_metadata?.full_name || null,
      phone: donorData?.phone || authData.user.user_metadata?.phone || null,
      date_of_birth: authData.user.user_metadata?.date_of_birth || null,
      gender: authData.user.user_metadata?.gender || null,
      blood_type: donorData?.blood_type || authData.user.user_metadata?.blood_type || null,
      emergency_contact_name: authData.user.user_metadata?.emergency_contact_name || null,
      emergency_contact_phone: authData.user.user_metadata?.emergency_contact_phone || null,
      medical_conditions: authData.user.user_metadata?.medical_conditions || null,
      preferences: authData.user.user_metadata?.preferences || {},
      created_at: authData.user.created_at,
      updated_at: authData.user.updated_at || authData.user.created_at,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
