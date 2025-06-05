
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Users, Clock } from 'lucide-react';
import ChatWindow from './ChatWindow';

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: 'customer' | 'advisor';
    title?: string;
  }[];
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  status: 'active' | 'archived';
  loanRequestId?: string;
}

const MessagingInterface = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        participants: [
          {
            id: 'user-1',
            name: 'Trần Minh Tú',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            role: 'advisor',
            title: 'Chuyên gia tư vấn vay mua nhà'
          },
          {
            id: userId || 'current-user',
            name: user?.fullName || 'Bạn',
            role: 'customer'
          }
        ],
        lastMessage: {
          content: 'Tôi sẽ giúp bạn chuẩn bị hồ sơ vay mua nhà. Bạn có thể gửi cho tôi thông tin về thu nhập hiện tại không?',
          timestamp: '2024-01-15T10:30:00Z',
          senderId: 'user-1'
        },
        unreadCount: 2,
        status: 'active',
        loanRequestId: 'LR-001'
      },
      {
        id: 'conv-2',
        participants: [
          {
            id: 'user-2',
            name: 'Lê Văn Đức',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
            role: 'advisor',
            title: 'Chuyên gia tài chính doanh nghiệp'
          },
          {
            id: userId || 'current-user',
            name: user?.fullName || 'Bạn',
            role: 'customer'
          }
        ],
        lastMessage: {
          content: 'Cảm ơn bạn đã chia sẻ kế hoạch kinh doanh. Tôi sẽ xem xét và phản hồi trong ngày hôm nay.',
          timestamp: '2024-01-14T16:45:00Z',
          senderId: 'user-2'
        },
        unreadCount: 0,
        status: 'active',
        loanRequestId: 'LR-002'
      }
    ];
    
    setConversations(mockConversations);
  }, [userId, user]);

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== userId);
  };

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-white">
      {/* Conversation List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-brand-600" />
            Tin nhắn
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {filteredConversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            return (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-white transition-colors ${
                  activeConversation === conversation.id ? 'bg-white border-l-4 border-l-brand-600' : ''
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
                    <AvatarFallback className="bg-brand-600 text-white">
                      {otherParticipant?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-sm text-gray-800 truncate">
                        {otherParticipant?.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    {otherParticipant?.title && (
                      <p className="text-xs text-brand-600 mb-1">{otherParticipant.title}</p>
                    )}
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có cuộc trò chuyện nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {activeConversation ? (
          <ChatWindow
            conversationId={activeConversation}
            conversation={conversations.find(c => c.id === activeConversation)!}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="text-gray-500">
                Chọn cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
