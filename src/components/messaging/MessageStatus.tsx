
import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read';
  timestamp: string;
  className?: string;
}

const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  timestamp,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-500" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Đang gửi...';
      case 'sent':
        return 'Đã gửi';
      case 'delivered':
        return 'Đã nhận';
      case 'read':
        return 'Đã đọc';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      {getStatusIcon()}
      <span className="text-gray-500">
        {getStatusText()} • {new Date(timestamp).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </div>
  );
};

export default MessageStatus;
