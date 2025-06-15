import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { robustSignOut } from '@/utils/authUtils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleRealtimeInsert, handleRealtimeUpdate } from '@/utils/notificationUtils';
import type { Notification } from '@/types/notification';

type UserRole = 'admin' | 'advisor' | 'customer' | 'bank_employee' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  loading: boolean;
  isLoaded: boolean;
  isPasswordRecovery: boolean;
  signOut: () => Promise<void>;
  clearPasswordRecovery: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const queryClient = useQueryClient();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('customer'); // Default to customer if role fetch fails
      } else {
        setUserRole(data?.role || 'customer');
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        } else if (isPasswordRecovery && event !== 'USER_UPDATED') {
          setIsPasswordRecovery(false);
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isPasswordRecovery]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const queryKey = ['notifications', user.id];

    const handleInsert = (payload: any) => {
      handleRealtimeInsert(payload, (updater) => {
        queryClient.setQueryData<Notification[]>(queryKey, (oldData) => {
            if (typeof updater === 'function') {
                return updater(oldData || []);
            }
            return oldData;
        });
      });
    };

    const handleUpdate = (payload: any) => {
      handleRealtimeUpdate(payload, (updater) => {
        queryClient.setQueryData<Notification[]>(queryKey, (oldData) => {
            if (typeof updater === 'function') {
                return updater(oldData || []);
            }
            return oldData;
        });
      });
    };
    
    const channelName = `notifications-user-${user.id}`;
    const channel = supabase.channel(channelName);

    // This is to prevent re-subscribing on fast re-renders.
    if (channel.state === 'joined' || channel.state === 'joining') {
      return;
    }

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        handleInsert
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        handleUpdate
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to notifications channel: ${channelName}`);
        } else if (status === 'CHANNEL_ERROR' || err) {
          console.error('Notifications subscription error:', err);
          toast.error('Lỗi kết nối thời gian thực cho thông báo.');
        }
      });

    return () => {
      supabase.removeChannel(channel).then(status => {
        console.log(`Unsubscribed from notifications channel: ${channelName}`, status);
      });
    };
  }, [user, queryClient]);

  const signOut = async () => {
    await robustSignOut();
  };

  const clearPasswordRecovery = () => {
    setIsPasswordRecovery(false);
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    isLoaded: !loading,
    isPasswordRecovery,
    signOut,
    clearPasswordRecovery,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
