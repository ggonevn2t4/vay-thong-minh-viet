import React, { useState, useEffect, useRef } from 'react';
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
import FileUpload from './FileUpload';
import MessageAttachment from './MessageAttachment';
import MessageSearch from './MessageSearch';
import SearchResultHighlight from './SearchResultHighlight';
import TypingIndicator from './TypingIndicator';
import UserPresenceIndicator from './UserPresenceIndicator';
import ConnectionStatus from './ConnectionStatus';
import MessageStatus from './MessageStatus';
import { useMessageSearch } from '@/hooks/useMessageSearch';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useUserPresence } from '@/hooks/useUserPresence';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface Conversation {
  id: string;
  loan_application_id?: string;
  customer_id: string;
  advisor_id: string;
  status: string;
  last_message_at: string;
  customer_profile?: {
    full_name: string;
  } | null;
  advisor_profile?: {
    full_name: string;
    bank_name: string;
    avatar_url?: string;
  } | null;
  loan_application?: {
    amount: number;
    product_type: string;
  } | null;
}

interface MessageAttachmentData {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
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
  } | null;
  attachments?: MessageAttachmentData[];
}

const EnhancedMessagingInterface = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachmentData[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize real-time hooks
  const { startTyping, stopTyping, getTypingUsers } = useTypingIndicator(selectedConversation?.id || '');
  const { isOnline } = useUserPresence();
  const { registerPushNotifications, sendLocalNotification } = usePushNotifications();

  const {
    searchResults,
    isSearching,
    searchQuery,
    searchFilters,
    searchMessages,
    clearSearch
  } = useMessageSearch();

  // Register push notifications on mount
  useEffect(() => {
    registerPushNotifications();
  }, []);

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!selectedConversation) return;

    const channel = supabase
      .channel(`messages-${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_id !== user?.id) {
            // Show notification for new messages from others
            sendLocalNotification(
              `Tin nhắn mới từ ${newMessage.sender_profile?.full_name || 'Người dùng'}`,
              {
                body: newMessage.content,
                icon: '/favicon.ico'
              }
            );
          }
          fetchMessages(selectedConversation.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        },
        () => {
          fetchMessages(selectedConversation.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`customer_id.eq.${user.id},advisor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const conversationsWithProfiles = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          const { data: customerProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', conversation.customer_id)
            .maybeSingle();

          const { data: advisorProfile } = await supabase
            .from('advisor_profiles')
            .select('full_name, bank_name, avatar_url')
            .eq('user_id', conversation.advisor_id)
            .maybeSingle();

          const { data: loanApplication } = conversation.loan_application_id
            ? await supabase
                .from('loan_applications')
                .select('amount, product_type')
                .eq('id', conversation.loan_application_id)
                .maybeSingle()
            : { data: null };

          return {
            ...conversation,
            customer_profile: customerProfile,
            advisor_profile: advisorProfile,
            loan_application: loanApplication,
          };
        })
      );

      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Lỗi khi tải danh sách cuộc trò chuyện');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesWithProfiles = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', message.sender_id)
            .maybeSingle();

          const { data: attachments } = await supabase
            .from('message_attachments')
            .select('*')
            .eq('message_id', message.id);

          return {
            ...message,
            sender_profile: senderProfile,
            attachments: attachments || [],
          };
        })
      );

      setMessages(messagesWithProfiles);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Start typing indicator when user starts typing
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleInputBlur = () => {
    // Stop typing indicator when input loses focus
    stopTyping();
  };

  const handleFileUploaded = (attachment: MessageAttachmentData) => {
    setPendingAttachments(prev => [...prev, attachment]);
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && pendingAttachments.length === 0) || !selectedConversation || !user) return;

    setSending(true);
    stopTyping(); // Stop typing indicator when sending
    
    try {
      const recipientId = selectedConversation.customer_id === user.id 
        ? selectedConversation.advisor_id 
        : selectedConversation.customer_id;

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          recipient_id: recipientId,
          content: newMessage.trim() || 'File attachment',
          message_type: pendingAttachments.length > 0 ? 'file' : 'text'
        })
        .select()
        .single();

      if (messageError) throw messageError;

      if (pendingAttachments.length > 0) {
        const attachmentRecords = pendingAttachments.map(attachment => ({
          message_id: messageData.id,
          file_name: attachment.file_name,
          file_path: attachment.file_path,
          file_size: attachment.file_size,
          content_type: attachment.content_type
        }));

        const { error: attachmentError } = await supabase
          .from('message_attachments')
          .insert(attachmentRecords);

        if (attachmentError) throw attachmentError;
      }

      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setNewMessage('');
      setPendingAttachments([]);
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
        id: conversation.advisor_id,
        name: conversation.advisor_profile?.full_name || 'Tư vấn viên',
        avatar: conversation.advisor_profile?.avatar_url,
        role: 'advisor',
        bank: conversation.advisor_profile?.bank_name
      };
    } else {
      return {
        id: conversation.customer_id,
        name: conversation.customer_profile?.full_name || 'Khách hàng',
        avatar: undefined,
        role: 'customer'
      };
    }
  };

  const handleSearch = async (query: string, filters: any) => {
    if (!selectedConversation) return;
    
    if (!query && !Object.keys(filters).some(key => filters[key])) {
      clearSearch();
      return;
    }
    
    await searchMessages(selectedConversation.id, query, filters);
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSearch(false);
  };

  const getSearchParticipants = () => {
    if (!selectedConversation) return [];
    
    const participants = [];
    
    if (selectedConversation.customer_profile) {
      participants.push({
        id: selectedConversation.customer_id,
        name: selectedConversation.customer_profile.full_name || 'Khách hàng',
        role: 'customer'
      });
    }
    
    if (selectedConversation.advisor_profile) {
      participants.push({
        id: selectedConversation.advisor_id,
        name: selectedConversation.advisor_profile.full_name || 'Tư vấn viên',
        role: 'advisor'
      });
    }
    
    return participants;
  };

  const displayedMessages = searchResults.length > 0 ? searchResults : messages;
  const typingUsers = getTypingUsers();

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
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-brand-600" />
              Tin nhắn
            </h3>
            <ConnectionStatus />
          </div>
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
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                        <AvatarFallback className="bg-brand-600 text-white">
                          {otherParticipant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        <UserPresenceIndicator userId={otherParticipant.id} />
                      </div>
                    </div>
                    
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
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                          <AvatarFallback className="bg-brand-600 text-white">
                            {otherParticipant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          <UserPresenceIndicator userId={otherParticipant.id} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{otherParticipant.name}</h4>
                        <div className="flex items-center gap-2">
                          {otherParticipant.bank && (
                            <p className="text-sm text-brand-600">{otherParticipant.bank}</p>
                          )}
                          <UserPresenceIndicator userId={otherParticipant.id} showText />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={showSearch ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    setShowSearch(!showSearch);
                    if (showSearch) {
                      handleClearSearch();
                    }
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  {searchResults.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {searchResults.length}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Component */}
            {showSearch && (
              <MessageSearch
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isSearching={isSearching}
                searchQuery={searchQuery}
                filters={searchFilters}
                participants={getSearchParticipants()}
              />
            )}

            {/* Search Results Info */}
            {searchResults.length > 0 && (
              <div className="px-4 py-2 bg-blue-50 border-b text-sm text-blue-700">
                Tìm thấy {searchResults.length} tin nhắn phù hợp
                {searchQuery && (
                  <span> cho từ khóa "{searchQuery}"</span>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {displayedMessages.map((message) => {
                const isMyMessage = message.sender_id === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMyMessage && (
                      <Avatar className="h-8 w-8">
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
                        {message.content && (
                          <SearchResultHighlight
                            text={message.content}
                            searchQuery={searchQuery}
                            className="text-sm"
                          />
                        )}
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => (
                              <MessageAttachment
                                key={attachment.id}
                                attachment={attachment}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Message Status */}
                      {isMyMessage && (
                        <div className="flex justify-end mt-1">
                          <MessageStatus
                            status={message.read_at ? 'read' : 'sent'}
                            timestamp={message.created_at}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicators */}
              {typingUsers.map((typingUser) => {
                const otherParticipant = getOtherParticipant(selectedConversation);
                if (typingUser.user_id === otherParticipant?.id) {
                  return (
                    <TypingIndicator
                      key={typingUser.user_id}
                      userName={otherParticipant.name}
                      userAvatar={otherParticipant.avatar}
                    />
                  );
                }
                return null;
              })}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {!showSearch && (
              <div className="p-4 border-t bg-white">
                {pendingAttachments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {pendingAttachments.map((attachment, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded-lg">
                        <MessageAttachment attachment={attachment} />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <FileUpload
                    onFileUploaded={handleFileUploaded}
                    disabled={sending}
                  />
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={handleInputBlur}
                    className="flex-1"
                    disabled={!isOnline}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={(!newMessage.trim() && pendingAttachments.length === 0) || sending || !isOnline}
                    className="bg-brand-600 hover:bg-brand-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {!isOnline && (
                  <p className="text-xs text-red-500 mt-1">
                    Bạn đang offline. Kết nối lại để gửi tin nhắn.
                  </p>
                )}
              </div>
            )}
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
