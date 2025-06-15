
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification';
import * as notificationService from '@/services/notificationService';

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const queryKey = ['notifications', user?.id];

  const { data: notifications = [], isLoading } = useQuery<Notification[], Error>({
    queryKey: queryKey,
    queryFn: () => {
        if (!user) return Promise.resolve([]);
        return notificationService.getNotifications(user.id);
    },
    enabled: !!user,
  });

  const { mutate: markAsRead } = useMutation<Notification, Error, string>({
    mutationFn: notificationService.markNotificationAsRead,
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData<Notification[]>(queryKey, (oldData) =>
        oldData?.map(n => n.id === updatedNotification.id ? updatedNotification : n) || []
      );
    },
    onError: () => {
      toast.error('Không thể đánh dấu đã đọc');
    },
  });

  const { mutate: markAllAsRead } = useMutation<Notification[], Error, void>({
    mutationFn: () => {
        if (!user) throw new Error("User not authenticated");
        return notificationService.markAllNotificationsAsRead(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
    },
    onError: () => {
      toast.error('Không thể đánh dấu tất cả đã đọc');
    },
  });

  const { mutate: removeNotification } = useMutation<string, Error, string>({
    mutationFn: notificationService.deleteNotification,
    onSuccess: (removedNotificationId) => {
      queryClient.setQueryData<Notification[]>(queryKey, (oldData) =>
        oldData?.filter(n => n.id !== removedNotificationId) || []
      );
      toast.success('Đã xóa thông báo');
    },
    onError: () => {
      toast.error('Không thể xóa thông báo');
    },
  });

  const { mutateAsync: createNotification } = useMutation<Notification, Error, notificationService.CreateNotificationPayload>({
    mutationFn: (newNotification) => {
        if (!user) throw new Error("User not authenticated");
        return notificationService.createNotification(newNotification, user.id);
    },
    onError: (error) => {
        console.error('Error creating notification:', error);
        toast.error('Không thể tạo thông báo');
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    createNotification,
  };
};
