import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Search, 
  Filter,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

const MobileOptimizations = ({ children }: MobileOptimizationsProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-optimized">
      {children}
    </div>
  );
};

// Mobile-optimized Card Component
export const MobileCard = ({ 
  title, 
  subtitle, 
  status, 
  amount, 
  date, 
  onClick 
}: {
  title: string;
  subtitle?: string;
  status?: string;
  amount?: string;
  date?: string;
  onClick?: () => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow touch-manipulation"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3">
            {status && (
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          {amount && (
            <span className="font-medium text-green-600">{amount}</span>
          )}
          {date && (
            <span className="text-muted-foreground">{date}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Mobile-optimized Filter Sheet
export const MobileFilterSheet = ({ 
  children, 
  onApply, 
  onClear 
}: {
  children: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Filter className="h-4 w-4 mr-2" />
          Bộ lọc
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4 overflow-y-auto">
          {children}
        </div>
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClear} className="flex-1">
            Xóa bộ lọc
          </Button>
          <Button onClick={onApply} className="flex-1">
            Áp dụng
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Mobile-optimized Contact Card
export const MobileContactCard = ({
  name,
  phone,
  email,
  location,
  role,
  onCall,
  onMessage,
  onViewProfile
}: {
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  role?: string;
  onCall?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium">{name}</h3>
            {role && (
              <Badge variant="outline" className="text-xs">
                {role}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            {onCall && phone && (
              <Button size="sm" className="flex-1" onClick={onCall}>
                <Phone className="h-4 w-4 mr-1" />
                Gọi
              </Button>
            )}
            {onMessage && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onMessage}>
                Nhắn tin
              </Button>
            )}
            {onViewProfile && (
              <Button variant="outline" size="sm" onClick={onViewProfile}>
                Chi tiết
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Mobile-optimized Stats Grid
export const MobileStatsGrid = ({ 
  stats 
}: {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
  }>;
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-3 text-center">
            {stat.icon && (
              <div className="mb-2 flex justify-center">
                {stat.icon}
              </div>
            )}
            <div className={`text-lg font-bold ${stat.color || 'text-foreground'}`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Touch-optimized button sizes
export const TouchButton = ({ 
  children, 
  className = '', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button 
      className={`min-h-[44px] touch-manipulation ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MobileOptimizations;