
import { useState, useEffect } from 'react';
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

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications for demo - will be replaced with Supabase data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Khoản vay được phê duyệt',
      message: 'Khoản vay #12345 đã được ngân hàng ABC phê duyệt với lãi suất 8.5%/năm',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      userId: user?.id || '',
      actionUrl: '/loan-applications'
    },
    {
      id: '2',
      title: 'Tài liệu cần bổ sung',
      message: 'Vui lòng bổ sung bảng lương 3 tháng gần nhất cho hồ sơ vay #12346',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      userId: user?.id || '',
      actionUrl: '/document-checklist'
    },
    {
      id: '3',
      title: 'Lãi suất giảm',
      message: 'Ngân hàng DEF vừa giảm lãi suất vay mua nhà xuống 7.8%/năm',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      userId: user?.id || '',
      actionUrl: '/loan-comparison'
    },
    {
      id: '4',
      title: 'Kết thúc khuyến mãi',
      message: 'Lãi suất khuyến mãi của khoản vay #12344 sẽ kết thúc sau 7 ngày',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      read: false,
      userId: user?.id || '',
      actionUrl: '/loan-optimization'
    },
    {
      id: '5',
      title: 'Tin nhắn mới',
      message: 'Bạn có tin nhắn mới từ tư vấn viên Nguyễn Văn A',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      userId: user?.id || '',
      actionUrl: '/messages'
    }
  ];

  const loadNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;

      // For now, use mock data
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Không thể tải thông báo');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Update in Supabase
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ read: true, read_at: new Date().toISOString() })
      //   .eq('id', notificationId);

      // if (error) throw error;

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
    try {
      // TODO: Update all in Supabase
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ read: true, read_at: new Date().toISOString() })
      //   .eq('user_id', user?.id)
      //   .eq('read', false);

      // if (error) throw error;

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
      // TODO: Delete from Supabase
      // const { error } = await supabase
      //   .from('notifications')
      //   .delete()
      //   .eq('id', notificationId);

      // if (error) throw error;

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
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
        userId: user.id
      };

      // TODO: Insert into Supabase
      // const { error } = await supabase
      //   .from('notifications')
      //   .insert([{
      //     ...newNotification,
      //     user_id: user.id,
      //     created_at: newNotification.timestamp.toISOString()
      //   }]);

      // if (error) throw error;

      setNotifications(prev => [newNotification, ...prev]);
      
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

  // Subscribe to real-time notifications (when Supabase is implemented)
  useEffect(() => {
    if (!user) return;

    // TODO: Set up real-time subscription
    // const subscription = supabase
    //   .channel('notifications')
    //   .on('postgres_changes', 
    //     {
    //       event: 'INSERT',
    //       schema: 'public',
    //       table: 'notifications',
    //       filter: `user_id=eq.${user.id}`
    //     },
    //     (payload) => {
    //       const newNotification = payload.new as any;
    //       setNotifications(prev => [newNotification, ...prev]);
    //       toast[newNotification.type](newNotification.title);
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
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
