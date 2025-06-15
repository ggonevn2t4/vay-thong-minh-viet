
import { supabase } from '@/integrations/supabase/client';

/**
 * Clears all Supabase-related authentication keys from browser storage.
 * This helps prevent "limbo" states where old sessions interfere with new ones.
 */
export const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.startsWith('supabase.auth.'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));

  if (typeof sessionStorage !== 'undefined') {
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('sb-') || key.startsWith('supabase.auth.'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  }
};


/**
 * A robust sign-out flow that cleans up local state, signs out from Supabase globally,
 * and forces a page reload to ensure a completely clean state.
 */
export const robustSignOut = async () => {
  try {
    cleanupAuthState();
    // Attempt global sign out to invalidate all sessions for the user.
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.error('Error during global sign out:', error);
      // Still force reload even if sign out fails; cleanupAuthState should handle most cases.
    }
  } catch (error) {
    console.error('Exception during sign out process:', error);
  } finally {
    // Force a full page reload to the auth page to ensure a clean state.
    window.location.href = '/auth';
  }
};
