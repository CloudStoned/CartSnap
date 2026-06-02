import { supabase } from '@/lib/supabase/client';

/**
 * Fetches the user settings configuration for the specified user.
 */
export async function fetchUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is code for "0 rows returned"
    console.error('Error fetching user settings:', error);
  }
  return data;
}

/**
 * Upserts the user settings preferences (e.g. budget limit, currency signifier, sound).
 */
export async function upsertUserSettings(
  userId: string,
  settings: { budget_limit?: number; currency?: string; sound_enabled?: boolean }
) {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user settings:', error);
    throw error;
  }
  return data;
}
