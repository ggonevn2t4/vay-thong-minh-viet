
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, User, MessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFilters {
  senderId?: string;
  dateFrom?: string;
  dateTo?: string;
  messageType?: string;
}

interface MessageSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClear: () => void;
  isSearching: boolean;
  searchQuery: string;
  filters: SearchFilters;
  participants: Array<{ id: string; name: string; role: string }>;
}

const MessageSearch: React.FC<MessageSearchProps> = ({
  onSearch,
  onClear,
  isSearching,
  searchQuery,
  filters,
  participants
}) => {
  const [query, setQuery] = useState(searchQuery);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(query, localFilters);
  };

  const handleClear = () => {
    setQuery('');
    setLocalFilters({});
    onClear();
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => 
    localFilters[key as keyof SearchFilters]
  );

  const getFilterBadges = () => {
    const badges = [];
    
    if (localFilters.senderId) {
      const participant = participants.find(p => p.id === localFilters.senderId);
      badges.push(
        <Badge key="sender" variant="secondary" className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {participant?.name || 'Unknown'}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => setLocalFilters(prev => ({ ...prev, senderId: undefined }))}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (localFilters.messageType) {
      badges.push(
        <Badge key="type" variant="secondary" className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {localFilters.messageType === 'text' ? 'Text' : 'File'}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => setLocalFilters(prev => ({ ...prev, messageType: undefined }))}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (localFilters.dateFrom || localFilters.dateTo) {
      badges.push(
        <Badge key="date" variant="secondary" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Date Range
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => setLocalFilters(prev => ({ 
              ...prev, 
              dateFrom: undefined, 
              dateTo: undefined 
            }))}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    return badges;
  };

  return (
    <div className="p-4 border-b bg-white space-y-3">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm tin nhắn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="pl-10"
          />
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={hasActiveFilters ? 'bg-brand-50 border-brand-200' : ''}
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {Object.keys(localFilters).filter(key => localFilters[key as keyof SearchFilters]).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Bộ lọc tìm kiếm</h4>
              
              {/* Sender Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Người gửi</label>
                <Select
                  value={localFilters.senderId || ''}
                  onValueChange={(value) => 
                    setLocalFilters(prev => ({ 
                      ...prev, 
                      senderId: value || undefined 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {participants.map(participant => (
                      <SelectItem key={participant.id} value={participant.id}>
                        {participant.name} ({participant.role === 'advisor' ? 'Tư vấn viên' : 'Khách hàng'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Loại tin nhắn</label>
                <Select
                  value={localFilters.messageType || ''}
                  onValueChange={(value) => 
                    setLocalFilters(prev => ({ 
                      ...prev, 
                      messageType: value || undefined 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value="text">Tin nhắn văn bản</SelectItem>
                    <SelectItem value="file">Tin nhắn có file</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Khoảng thời gian</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Từ ngày</label>
                    <Input
                      type="date"
                      value={localFilters.dateFrom || ''}
                      onChange={(e) => 
                        setLocalFilters(prev => ({ 
                          ...prev, 
                          dateFrom: e.target.value || undefined 
                        }))
                      }
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Đến ngày</label>
                    <Input
                      type="date"
                      value={localFilters.dateTo || ''}
                      onChange={(e) => 
                        setLocalFilters(prev => ({ 
                          ...prev, 
                          dateTo: e.target.value || undefined 
                        }))
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setLocalFilters({})}>
                  Xóa bộ lọc
                </Button>
                <Button size="sm" onClick={() => setShowFilters(false)}>
                  Áp dụng
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={handleSearch} disabled={isSearching} size="sm">
          {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
        </Button>

        {(query || hasActiveFilters) && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {getFilterBadges()}
        </div>
      )}
    </div>
  );
};

export default MessageSearch;
