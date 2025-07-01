
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPresence {
  user_id: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
}

export const useUserPresence = () => {
  const { user } = useAuth();
  const [userPresences, setUserPresences] = useState<Record<string, UserPresence>>({});
  const [isOnline, setIsOnline] = useState(true);

  // Update user's own presence status
  const updatePresence = async (status: 'online' | 'offline' | 'away') => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('update_user_presence', {
        user_uuid: user.id,
        new_status: status
      });
      
      if (error) {
        console.error('Error updating presence:', error);
      }
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  // Set user online when component mounts
  useEffect(() => {
    if (user) {
      updatePresence('online');
    }
  }, [user]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (user) updatePresence('online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (user) updatePresence('offline');
    };

    const handleBeforeUnload = () => {
      if (user) updatePresence('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  // Subscribe to presence updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          const presence = payload.new as UserPresence;
          if (presence) {
            setUserPresences(prev => ({
              ...prev,
              [presence.user_id]: presence
            }));
          }
        }
      )
      .subscribe();

    // Fetch initial presence data
    const fetchPresences = async () => {
      const { data, error } = await supabase
        .from('user_presence')
        .select('*');
      
      if (data && !error) {
        const presenceMap = data.reduce((acc, presence) => {
          acc[presence.user_id] = presence;
          return acc;
        }, {} as Record<string, UserPresence>);
        setUserPresences(presenceMap);
      }
    };

    fetchPresences();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Update presence to away after 5 minutes of inactivity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (user && isOnline) {
        updatePresence('online');
        inactivityTimer = setTimeout(() => {
          updatePresence('away');
        }, 5 * 60 * 1000); // 5 minutes
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [user, isOnline]);

  const getUserPresence = (userId: string): UserPresence | null => {
    return userPresences[userId] || null;
  };

  const isUserOnline = (userId: string): boolean => {
    const presence = getUserPresence(userId);
    return presence?.status === 'online';
  };

  return {
    userPresences,
    updatePresence,
    getUserPresence,
    isUserOnline,
    isOnline
  };
};
