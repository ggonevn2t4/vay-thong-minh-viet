
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleRealtimeInsert, handleRealtimeUpdate } from '@/utils/notificationUtils';
import type { Notification } from '@/types/notification';

export const useNotificationSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
};
