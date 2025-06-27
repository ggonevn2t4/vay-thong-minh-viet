
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Phone, Video } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Conversation {
  id: string;
  loan_application_id?: string;
  customer_id: string;
  advisor_id: string;
  status: string;
  last_message_at: string;
  customer_profile?: {
    full_name: string;
    avatar_url?: string;
  };
  advisor_profile?: {
    full_name: string;
    bank_name: string;
    avatar_url?: string;
  };
  loan_application?: {
    amount: number;
    product_type: string;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  read_at?: string;
  created_at: string;
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

const EnhancedMessagingInterface = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          customer_profile:customer_id (full_name, avatar_url),
          advisor_profile:advisor_id (full_name, bank_name, avatar_url),
          loan_application:loan_application_id (amount, product_type)
        `)
        .or(`customer_id.eq.${user.id},advisor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Lỗi khi tải danh sách cuộc trò chuyện');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:sender_id (full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Lỗi khi tải tin nhắn');
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user.id)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      const recipientId = selectedConversation.customer_id === user.id 
        ? selectedConversation.advisor_id 
        : selectedConversation.customer_id;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          recipient_id: recipientId,
          content: newMessage,
          message_type: 'text'
        });

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setNewMessage('');
      fetchMessages(selectedConversation.id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Lỗi khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    
    if (conversation.customer_id === user.id) {
      return {
        name: conversation.advisor_profile?.full_name || 'Tư vấn viên',
        avatar: conversation.advisor_profile?.avatar_url,
        role: 'advisor',
        bank: conversation.advisor_profile?.bank_name
      };
    } else {
      return {
        name: conversation.customer_profile?.full_name || 'Khách hàng',
        avatar: conversation.customer_profile?.avatar_url,
        role: 'customer'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden bg-white">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-brand-600" />
            Tin nhắn
          </h3>
        </div>
        
        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;

              return (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-white transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-white border-l-4 border-l-brand-600' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                      <AvatarFallback className="bg-brand-600 text-white">
                        {otherParticipant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {otherParticipant.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.last_message_at), { 
                            addSuffix: true, 
                            locale: vi 
                          })}
                        </span>
                      </div>
                      
                      {otherParticipant.bank && (
                        <p className="text-sm text-brand-600">{otherParticipant.bank}</p>
                      )}
                      
                      {conversation.loan_application && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {conversation.loan_application.product_type === 'credit_loan' ? 'Vay tín dụng' : 'Vay thế chấp'} - 
                            {(conversation.loan_application.amount / 1000000).toFixed(0)}M đ
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const otherParticipant = getOtherParticipant(selectedConversation);
                  if (!otherParticipant) return null;
                  
                  return (
                    <>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                        <AvatarFallback className="bg-brand-600 text-white">
                          {otherParticipant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{otherParticipant.name}</h4>
                        {otherParticipant.bank && (
                          <p className="text-sm text-brand-600">{otherParticipant.bank}</p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => {
                const isMyMessage = message.sender_id === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMyMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender_profile?.avatar_url} alt={message.sender_profile?.full_name} />
                        <AvatarFallback className="bg-brand-600 text-white text-xs">
                          {message.sender_profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
                          {formatDistanceToNow(new Date(message.created_at), { 
                            addSuffix: true, 
                            locale: vi 
                          })}
                        </span>
                        {isMyMessage && message.read_at && (
                          <span className="text-blue-500">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMessagingInterface;
