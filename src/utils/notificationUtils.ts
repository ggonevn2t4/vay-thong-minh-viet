
import React from 'react';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification';

export const formatNotification = (notification: any): Notification => ({
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

export const handleRealtimeInsert = (payload: any, setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>) => {
  const newNotification = formatNotification(payload.new);
  setNotifications(prev => [newNotification, ...prev]);
  toast[newNotification.type](newNotification.title, {
    description: newNotification.message,
  });
};

export const handleRealtimeUpdate = (payload: any, setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>) => {
  const updatedNotification = formatNotification(payload.new);
  setNotifications(prev =>
    prev.map(notification =>
      notification.id === updatedNotification.id ? updatedNotification : notification
    )
  );
};
