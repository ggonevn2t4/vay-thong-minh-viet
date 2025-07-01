
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useUserPresence } from '@/hooks/useUserPresence';

interface UserPresenceIndicatorProps {
  userId: string;
  showText?: boolean;
  className?: string;
}

const UserPresenceIndicator: React.FC<UserPresenceIndicatorProps> = ({
  userId,
  showText = false,
  className = ''
}) => {
  const { getUserPresence } = useUserPresence();
  const presence = getUserPresence(userId);

  if (!presence) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Đang hoạt động';
      case 'away':
        return 'Vắng mặt';
      case 'offline':
      default:
        return 'Không hoạt động';
    }
  };

  if (showText) {
    return (
      <Badge
        variant="outline"
        className={`text-xs ${className}`}
      >
        <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(presence.status)}`} />
        {getStatusText(presence.status)}
      </Badge>
    );
  }

  return (
    <div
      className={`w-3 h-3 rounded-full border-2 border-white ${getStatusColor(presence.status)} ${className}`}
      title={getStatusText(presence.status)}
    />
  );
};

export default UserPresenceIndicator;
