
import { useState, useRef, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type: 'text' | 'image' | 'document';
  status: 'sent' | 'delivered' | 'read';
}

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

interface ChatWindowProps {
  conversationId: string;
  conversation: Conversation;
}

const ChatWindow = ({ conversationId, conversation }: ChatWindowProps) => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participants.find(p => p.id !== userId);

  // Mock messages data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        content: 'Chào bạn! Tôi đã xem yêu cầu vay mua nhà của bạn. Bạn có thể cho tôi biết thêm về tình hình tài chính hiện tại không?',
        senderId: otherParticipant?.id || 'other',
        timestamp: '2024-01-15T09:00:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg-2',
        content: 'Chào anh! Hiện tại em đang làm việc tại một công ty IT với mức lương 25 triệu/tháng. Em có tiết kiệm được khoảng 300 triệu và muốn vay thêm 2 tỷ để mua căn hộ.',
        senderId: userId || 'me',
        timestamp: '2024-01-15T09:05:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg-3',
        content: 'Tuyệt vời! Với mức lương và tiết kiệm như vậy, bạn có khả năng vay tốt. Bạn đã có căn hộ cụ thể nào chưa? Tôi cần thông tin về giá trị bất động sản để tư vấn gói vay phù hợp nhất.',
        senderId: otherParticipant?.id || 'other',
        timestamp: '2024-01-15T09:10:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg-4',
        content: 'Em đang xem một căn hộ 2PN ở Hà Đông, giá khoảng 2.3 tỷ. Anh có thể tư vấn em nên vay bao nhiều % và chọn ngân hàng nào không ạ?',
        senderId: userId || 'me',
        timestamp: '2024-01-15T10:15:00Z',
        type: 'text',
        status: 'delivered'
      },
      {
        id: 'msg-5',
        content: 'Tôi sẽ giúp bạn chuẩn bị hồ sơ vay mua nhà. Bạn có thể gửi cho tôi thông tin về thu nhập hiện tại không?',
        senderId: otherParticipant?.id || 'other',
        timestamp: '2024-01-15T10:30:00Z',
        type: 'text',
        status: 'sent'
      }
    ];
    
    setMessages(mockMessages);
  }, [conversationId, userId, otherParticipant]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: userId || 'me',
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate advisor response after a delay
    setTimeout(() => {
      const response: Message = {
        id: `msg-${Date.now() + 1}`,
        content: 'Cảm ơn bạn đã cung cấp thông tin. Tôi sẽ xem xét và phản hồi sớm nhất có thể.',
        senderId: otherParticipant?.id || 'other',
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'sent'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
            <AvatarFallback className="bg-brand-600 text-white">
              {otherParticipant?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-800">{otherParticipant?.name}</h3>
            <p className="text-sm text-brand-600">{otherParticipant?.title}</p>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Đang hoạt động
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loan Request Info */}
      {conversation.loanRequestId && (
        <div className="p-3 bg-brand-50 border-b">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-brand-100 text-brand-700">
              Yêu cầu vay: {conversation.loanRequestId}
            </Badge>
            <span className="text-gray-600">Vay mua nhà - 200 triệu đ</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => {
          const isMyMessage = message.senderId === userId;
          const participant = conversation.participants.find(p => p.id === message.senderId);
          
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
            >
              {!isMyMessage && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant?.avatar} alt={participant?.name} />
                  <AvatarFallback className="bg-brand-600 text-white text-xs">
                    {participant?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${isMyMessage ? 'order-1' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    isMyMessage
                      ? 'bg-brand-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                  isMyMessage ? 'justify-end' : 'justify-start'
                }`}>
                  <span>
                    {formatDistanceToNow(new Date(message.timestamp), { 
                      addSuffix: true, 
                      locale: vi 
                    })}
                  </span>
                  {isMyMessage && (
                    <span className={`${message.status === 'read' ? 'text-blue-500' : ''}`}>
                      {getStatusIcon(message.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
              <AvatarFallback className="bg-brand-600 text-white text-xs">
                {otherParticipant?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white p-3 rounded-lg rounded-bl-sm border">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
