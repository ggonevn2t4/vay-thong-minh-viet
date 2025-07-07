import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Settings, 
  Search,
  MessageSquare,
  Crown,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  Pin,
  Archive,
  Bell,
  BellOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  lastSeen: string;
  isOnline: boolean;
}

interface GroupChat {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  memberCount: number;
  lastMessage: {
    content: string;
    sender: string;
    timestamp: string;
  };
  isPrivate: boolean;
  isPinned: boolean;
  isArchived: boolean;
  muteNotifications: boolean;
  members: GroupMember[];
}

const GroupMessagingHub = () => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const [groups] = useState<GroupChat[]>([
    {
      id: '1',
      name: 'Tư vấn vay mua nhà',
      description: 'Nhóm hỗ trợ khách hàng vay mua nhà',
      memberCount: 12,
      lastMessage: {
        content: 'Lãi suất tháng này có ưu đãi đặc biệt...',
        sender: 'Nguyễn Văn A',
        timestamp: '2024-01-16T10:30:00Z'
      },
      isPrivate: false,
      isPinned: true,
      isArchived: false,
      muteNotifications: false,
      members: [
        {
          id: '1',
          name: 'Nguyễn Văn A',
          role: 'owner',
          lastSeen: '2024-01-16T10:30:00Z',
          isOnline: true
        },
        {
          id: '2',
          name: 'Trần Thị B',
          role: 'admin',
          lastSeen: '2024-01-16T09:15:00Z',
          isOnline: true
        }
      ]
    },
    {
      id: '2',
      name: 'Hỗ trợ vay kinh doanh',
      description: 'Tư vấn các gói vay cho doanh nghiệp',
      memberCount: 8,
      lastMessage: {
        content: 'Hồ sơ của anh đã được duyệt...',
        sender: 'Lê Văn C',
        timestamp: '2024-01-16T08:45:00Z'
      },
      isPrivate: true,
      isPinned: false,
      isArchived: false,
      muteNotifications: true,
      members: []
    },
    {
      id: '3',
      name: 'Khách hàng VIP',
      description: 'Nhóm dành cho khách hàng ưu tiên',
      memberCount: 25,
      lastMessage: {
        content: 'Chương trình ưu đãi mới đã ra mắt',
        sender: 'Phạm Thị D',
        timestamp: '2024-01-15T16:20:00Z'
      },
      isPrivate: true,
      isPinned: false,
      isArchived: false,
      muteNotifications: false,
      members: []
    }
  ]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Vui lòng nhập tên nhóm');
      return;
    }

    try {
      // In real app, this would call API to create group
      toast.success('Tạo nhóm thành công!');
      setShowCreateGroup(false);
      setNewGroupName('');
      setNewGroupDescription('');
    } catch (error) {
      toast.error('Không thể tạo nhóm');
    }
  };

  const handleTogglePin = (groupId: string) => {
    toast.success('Đã cập nhật trạng thái ghim');
  };

  const handleToggleMute = (groupId: string) => {
    toast.success('Đã cập nhật thông báo');
  };

  const handleArchiveGroup = (groupId: string) => {
    toast.success('Đã lưu trữ nhóm');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-600 bg-yellow-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Chủ nhóm';
      case 'admin': return 'Quản trị';
      default: return 'Thành viên';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Nhóm chat ({groups.length})
            </CardTitle>
            <Button onClick={() => setShowCreateGroup(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo nhóm mới
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups List */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm nhóm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedGroup?.id === group.id 
                        ? 'bg-purple-50 border-l-purple-500' 
                        : group.isPinned 
                          ? 'border-l-yellow-400' 
                          : 'border-l-transparent'
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={group.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {group.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {group.isPinned && (
                          <Pin className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {group.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {group.isPrivate && (
                              <Badge variant="outline" className="text-xs">Riêng tư</Badge>
                            )}
                            {group.muteNotifications && (
                              <BellOff className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                          {group.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {group.memberCount} thành viên
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(group.lastMessage.timestamp).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          <span className="font-medium">{group.lastMessage.sender}:</span> {group.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Details */}
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <div className="space-y-6">
              {/* Group Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedGroup.avatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                          {selectedGroup.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
                          {selectedGroup.isPinned && (
                            <Pin className="h-4 w-4 text-yellow-500" />
                          )}
                          {selectedGroup.isPrivate && (
                            <Badge variant="outline">Riêng tư</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{selectedGroup.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{selectedGroup.memberCount} thành viên</span>
                          <span>Tạo: 15/01/2024</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePin(selectedGroup.id)}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleMute(selectedGroup.id)}
                      >
                        {selectedGroup.muteNotifications ? (
                          <BellOff className="h-4 w-4" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Group Members */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Thành viên ({selectedGroup.members.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Thêm
                      </Button>
                      <Button size="sm" variant="outline">
                        <UserMinus className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedGroup.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                              member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{member.name}</p>
                              {member.role === 'owner' && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                              <Badge variant="outline" className={getRoleColor(member.role)}>
                                {getRoleLabel(member.role)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {member.isOnline ? 'Đang hoạt động' : 
                               `Hoạt động ${new Date(member.lastSeen).toLocaleDateString('vi-VN')}`}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Mở chat</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Archive className="h-6 w-6" />
                  <span>Lưu trữ</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Cài đặt</span>
                </Button>
              </div>
            </div>
          ) : (
            /* No Group Selected */
            <Card className="border-0 shadow-lg">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Chọn một nhóm để xem chi tiết
                  </h3>
                  <p className="text-gray-500">
                    Nhấp vào nhóm ở bên trái để xem thông tin và thành viên
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Tạo nhóm mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tên nhóm *</label>
                <Input
                  placeholder="Nhập tên nhóm..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Mô tả</label>
                <Textarea
                  placeholder="Mô tả về nhóm..."
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateGroup} className="flex-1">
                  Tạo nhóm
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GroupMessagingHub;