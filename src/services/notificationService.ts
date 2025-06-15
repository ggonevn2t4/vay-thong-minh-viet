
import { supabase } from '@/integrations/supabase/client';
import type { Notification } from '@/types/notification';
import { formatNotification } from '@/utils/notificationUtils';

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];
  return data.map(formatNotification);
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return formatNotification(data);
};

export const markAllNotificationsAsRead = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('read', false)
    .select();

  if (error) throw error;
  if (!data) return [];
  return data.map(formatNotification);
};

export const deleteNotification = async (notificationId: string): Promise<string> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
  return notificationId;
};

export type CreateNotificationPayload = Omit<Notification, 'id' | 'timestamp' | 'read' | 'userId'>;

export const createNotification = async (notification: CreateNotificationPayload, userId: string): Promise<Notification> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      action_url: notification.actionUrl,
      data: notification.data || {}
    }])
    .select()
    .single();

  if (error) throw error;
  return formatNotification(data);
};
