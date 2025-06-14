
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, X, MessageCircle, FileText, TrendingUp, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'loan_application' | 'advisor_match' | 'message' | 'document_update' | 'rate_change';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedId?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-001',
      type: 'advisor_match',
      title: 'Tư vấn viên mới ứng tuyển',
      content: 'Trần Minh Tú đã ứng tuyển cho yêu cầu vay mua nhà của bạn',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      actionRequired: true,
      relatedId: 'LR-001'
    },
    {
      id: 'notif-002',
      type: 'message',
      title: 'Tin nhắn mới',
      content: 'Bạn có tin nhắn mới từ tư vấn viên Nguyễn Thị Hương',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      actionRequired: false,
      relatedId: 'msg-001'
    },
    {
      id: 'notif-003',
      type: 'rate_change',
      title: 'Thay đổi lãi suất',
      content: 'Lãi suất vay mua nhà tại Vietcombank đã giảm 0.2%',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: true,
      actionRequired: false
    },
    {
      id: 'notif-004',
      type: 'document_update',
      title: 'Tài liệu được xác minh',
      content: 'Giấy tờ thu nhập của bạn đã được xác minh thành công',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: true,
      actionRequired: false,
      relatedId: 'doc-001'
    },
    {
      id: 'notif-005',
      type: 'loan_application',
      title: 'Cập nhật đơn vay',
      content: 'Đơn vay của bạn đã chuyển sang trạng thái "Đang xem xét"',
      timestamp: '2024-01-13T11:30:00Z',
      isRead: true,
      actionRequired: false,
      relatedId: 'LA-001'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'loan_application':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'advisor_match':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'document_update':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'rate_change':
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="p-4 border-b bg-brand-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-800">Thông báo</h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="mt-2 text-xs"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className={`text-sm font-medium text-gray-800 ${
                          !notification.isRead ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.timestamp), { 
                            addSuffix: true, 
                            locale: vi 
                          })}
                        </span>
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            Cần hành động
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có thông báo nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
