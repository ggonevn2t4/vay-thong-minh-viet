
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TypingIndicator {
  conversation_id: string;
  user_id: string;
  is_typing: boolean;
  last_typing_at: string;
}

export const useTypingIndicator = (conversationId: string) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingIndicator>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isTypingRef = useRef(false);

  // Start typing indicator
  const startTyping = async () => {
    if (!user || !conversationId) return;
    
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      try {
        await supabase.rpc('update_typing_indicator', {
          conv_id: conversationId,
          user_uuid: user.id,
          typing: true
        });
      } catch (error) {
        console.error('Error starting typing indicator:', error);
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  // Stop typing indicator
  const stopTyping = async () => {
    if (!user || !conversationId) return;
    
    if (isTypingRef.current) {
      isTypingRef.current = false;
      try {
        await supabase.rpc('update_typing_indicator', {
          conv_id: conversationId,
          user_uuid: user.id,
          typing: false
        });
      } catch (error) {
        console.error('Error stopping typing indicator:', error);
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Subscribe to typing indicators
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`typing-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const indicator = payload.new as TypingIndicator;
          if (indicator && indicator.user_id !== user?.id) {
            if (indicator.is_typing) {
              setTypingUsers(prev => ({
                ...prev,
                [indicator.user_id]: indicator
              }));
            } else {
              setTypingUsers(prev => {
                const updated = { ...prev };
                delete updated[indicator.user_id];
                return updated;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      stopTyping();
    };
  }, [conversationId, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, []);

  const getTypingUsers = (): TypingIndicator[] => {
    return Object.values(typingUsers).filter(indicator => 
      indicator.is_typing && indicator.user_id !== user?.id
    );
  };

  return {
    startTyping,
    stopTyping,
    getTypingUsers,
    isTyping: isTypingRef.current
  };
};
