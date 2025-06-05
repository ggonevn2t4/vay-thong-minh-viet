
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, Calendar, FileText, Calculator, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageQuickActionsProps {
  conversationId: string;
  participantRole: 'advisor' | 'customer';
  loanRequestId?: string;
}

const MessageQuickActions = ({ conversationId, participantRole, loanRequestId }: MessageQuickActionsProps) => {
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: "Tính năng đang phát triển",
      description: `${action} sẽ sớm được ra mắt.`,
    });
  };

  const quickActions = [
    {
      id: 'schedule-call',
      label: 'Đặt lịch gọi',
      icon: Phone,
      description: 'Lên lịch cuộc gọi tư vấn',
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      id: 'video-meeting',
      label: 'Họp video',
      icon: Video,
      description: 'Bắt đầu cuộc họp video',
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      id: 'send-docs',
      label: 'Gửi tài liệu',
      icon: FileText,
      description: 'Chia sẻ tài liệu cần thiết',
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    {
      id: 'loan-calculator',
      label: 'Tính toán khoản vay',
      icon: Calculator,
      description: 'Mở công cụ tính toán',
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  ];

  return (
    <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">Hành động nhanh</h3>
          {loanRequestId && (
            <Badge variant="secondary" className="bg-brand-100 text-brand-700 text-xs">
              {loanRequestId}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.label)}
              className={`${action.color} border-0 h-auto py-3 px-2 flex flex-col items-center gap-1 transition-all duration-200`}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs font-medium text-center leading-tight">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-brand-200">
          <Button 
            size="sm" 
            className="w-full bg-brand-600 hover:bg-brand-700 text-xs py-2"
            onClick={() => handleQuickAction('Gửi đề xuất')}
          >
            <Send className="h-3 w-3 mr-1" />
            Gửi đề xuất chính thức
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageQuickActions;
