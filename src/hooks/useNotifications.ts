import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  userId: string;
  actionUrl?: string;
  data?: Record<string, any>;
}

const formatNotification = (notification: any): Notification => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  type: notification.type as 'info' | 'success' | 'warning' | 'error',
  timestamp: new Date(notification.created_at),
  read: notification.read,
  userId: notification.user_id,
  actionUrl: notification.action_url,
  data: notification.data && typeof notification.data === 'object' && !Array.isArray(notification.data) 
    ? notification.data as Record<string, any> 
    : {}
});

const handleRealtimeInsert = (payload: any, setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>) => {
  const newNotification = formatNotification(payload.new);
  setNotifications(prev => [newNotification, ...prev]);
  toast[newNotification.type](newNotification.title, {
    description: newNotification.message,
  });
};

const handleRealtimeUpdate = (payload: any, setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>) => {
  const updatedNotification = formatNotification(payload.new);
  setNotifications(prev =>
    prev.map(notification =>
      notification.id === updatedNotification.id ? updatedNotification : notification
    )
  );
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const loadNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotifications: Notification[] = data.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as 'info' | 'success' | 'warning' | 'error',
        timestamp: new Date(notification.created_at),
        read: notification.read,
        userId: notification.user_id,
        actionUrl: notification.action_url,
        data: notification.data && typeof notification.data === 'object' && !Array.isArray(notification.data) 
          ? notification.data as Record<string, any> 
          : {}
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Không thể tải thông báo');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );

      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Không thể đánh dấu tất cả đã đọc');
    }
  };

  const removeNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );

      toast.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Error removing notification:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'userId'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          action_url: notification.actionUrl,
          data: notification.data || {}
        }]);

      if (error) throw error;

      // Show toast for new notification
      toast[notification.type](notification.title);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!user) {
      return;
    }

    // Use a consistent channel name for the user
    const channelName = `notifications-user-${user.id}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => handleRealtimeInsert(payload, setNotifications)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => handleRealtimeUpdate(payload, setNotifications)
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to notifications channel: ${channelName}`);
        } else if (status === 'CHANNEL_ERROR' || err) {
          console.error('Notifications subscription error:', err);
          toast.error('Lỗi kết nối thời gian thực cho thông báo.');
        }
      });

    channelRef.current = channel;

    // Cleanup subscription on component unmount or user change
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current).then(status => {
           console.log(`Unsubscribed from notifications channel: ${channelName}`, status);
        });
        channelRef.current = null;
      }
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    createNotification,
    loadNotifications
  };
};
