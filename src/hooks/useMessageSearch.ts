
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SearchFilters {
  senderId?: string;
  dateFrom?: string;
  dateTo?: string;
  messageType?: string;
}

interface SearchResult {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  read_at?: string;
  created_at: string;
  rank: number;
}

export const useMessageSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const searchMessages = useCallback(async (
    conversationId: string,
    query: string,
    filters: SearchFilters = {}
  ) => {
    setIsSearching(true);
    setSearchQuery(query);
    setSearchFilters(filters);

    try {
      // Build the RPC call parameters
      const params: any = {
        p_conversation_id: conversationId,
        p_search_query: query
      };

      if (filters.senderId) {
        params.p_sender_id = filters.senderId;
      }

      if (filters.dateFrom) {
        params.p_date_from = new Date(filters.dateFrom).toISOString();
      }

      if (filters.dateTo) {
        // Set to end of day for the "to" date
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        params.p_date_to = toDate.toISOString();
      }

      if (filters.messageType) {
        params.p_message_type = filters.messageType;
      }

      const { data, error } = await supabase.rpc('search_messages', params);

      if (error) {
        console.error('Search error:', error);
        toast.error('Lỗi khi tìm kiếm tin nhắn');
        return;
      }

      setSearchResults(data || []);
      
      if (query && data && data.length === 0) {
        toast.info('Không tìm thấy tin nhắn nào phù hợp');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Lỗi khi tìm kiếm tin nhắn');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchQuery('');
    setSearchFilters({});
  }, []);

  return {
    searchResults,
    isSearching,
    searchQuery,
    searchFilters,
    searchMessages,
    clearSearch
  };
};
