
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus = ({ className }: ConnectionStatusProps) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'connecting'>('online');

  useEffect(() => {
    // Simulate connection status changes
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const statusConfig = {
    online: {
      icon: Wifi,
      text: 'Đã kết nối',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    offline: {
      icon: WifiOff,
      text: 'Mất kết nối',
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    connecting: {
      icon: Clock,
      text: 'Đang kết nối',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${className} flex items-center gap-1 text-xs`}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

export default ConnectionStatus;
