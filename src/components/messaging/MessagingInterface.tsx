
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, Phone, Video, MoreVertical, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  role: 'advisor' | 'customer';
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
}

const MessagingInterface = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - sẽ được thay thế bằng dữ liệu thực từ Supabase
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Nguyễn Văn Advisor',
      role: 'advisor',
      status: 'online',
      lastMessage: 'Tôi sẽ hỗ trợ bạn hoàn thiện hồ sơ vay ngay.',
      lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Trần Thị Customer',
      role: 'customer',
      status: 'offline',
      lastMessage: 'Cảm ơn anh đã tư vấn.',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Lê Minh Advisor',
      role: 'advisor',
      status: 'busy',
      lastMessage: 'Lãi suất hiện tại của ngân hàng A là 8.5%/năm.',
      lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      unreadCount: 1
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      content: 'Chào bạn! Tôi là tư vấn viên sẽ hỗ trợ bạn trong quá trình vay vốn.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      senderId: 'current-user',
      content: 'Chào anh! Tôi muốn vay 500 triệu để mua nhà.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      senderId: '1',
      content: 'Tôi sẽ hỗ trợ bạn hoàn thiện hồ sơ vay ngay. Bạn có thể cung cấp thông tin về thu nhập hiện tại không?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
      status: 'read'
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      content: messageInput,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 1000);

    toast.success('Tin nhắn đã được gửi');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Trực tuyến';
      case 'busy': return 'Bận';
      case 'offline': return 'Ngoại tuyến';
      default: return 'Không xác định';
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days === 1) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  useEffect(() => {
    // Select first contact by default
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Contacts List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Tin nhắn
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{contact.name}</h4>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {contact.lastMessage}
                        </p>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-gray-500 ml-2">
                            {formatMessageTime(contact.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={contact.role === 'advisor' ? 'default' : 'secondary'} className="text-xs">
                          {contact.role === 'advisor' ? 'Tư vấn viên' : 'Khách hàng'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getStatusText(contact.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3">
        {selectedContact ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>
                      {selectedContact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedContact.status)}`}></div>
                      {getStatusText(selectedContact.status)}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === 'current-user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${
                            message.senderId === 'current-user'
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </span>
                          {message.senderId === 'current-user' && (
                            <span className={`text-xs ${
                              message.status === 'read' ? 'text-blue-100' :
                              message.status === 'delivered' ? 'text-blue-200' : 'text-blue-300'
                            }`}>
                              {message.status === 'read' ? '✓✓' :
                               message.status === 'delivered' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-lg mb-2">Chọn cuộc trò chuyện</CardTitle>
              <CardDescription>
                Chọn một liên hệ để bắt đầu trò chuyện
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
