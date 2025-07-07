import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Radio, Send, Users, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const MessageBroadcasting = () => {
  const [message, setMessage] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const groups = [
    { id: '1', name: 'Khách hàng VIP', count: 150 },
    { id: '2', name: 'Tư vấn viên', count: 25 },
    { id: '3', name: 'Nhân viên ngân hàng', count: 45 }
  ];

  const handleSend = async () => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    toast.success('Đã gửi tin nhắn thành công');
    setMessage('');
    setSelectedGroups([]);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-orange-600" />
            Phát sóng tin nhắn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nội dung tin nhắn</label>
            <Textarea
              placeholder="Nhập nội dung tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Chọn nhóm người nhận</label>
            <div className="space-y-3">
              {groups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGroups([...selectedGroups, group.id]);
                        } else {
                          setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                        }
                      }}
                    />
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-gray-600">{group.count} người</p>
                    </div>
                  </div>
                  <Badge variant="outline">{group.count}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSend}
            disabled={!message.trim() || selectedGroups.length === 0 || isSending}
            className="w-full"
          >
            {isSending ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gửi tin nhắn
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageBroadcasting;