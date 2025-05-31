
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, User, Calendar, FileText, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConsultationSession {
  id: string;
  date: string;
  consultant: string;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  recommendations: string[];
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'behind' | 'ahead';
}

const PersonalFinanceConsultant = () => {
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [consultationRequest, setConsultationRequest] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [consultationHistory] = useState<ConsultationSession[]>([
    {
      id: '1',
      date: '2024-01-10',
      consultant: 'Nguyễn Văn An',
      topic: 'Tối ưu hóa danh mục đầu tư',
      status: 'completed',
      notes: 'Đã thảo luận về chiến lược đầu tư dài hạn và phân bổ tài sản',
      recommendations: [
        'Đa dạng hóa danh mục với 60% cổ phiếu, 30% trái phiếu, 10% vàng',
        'Tăng đóng góp quỹ hưu trí lên 15% thu nhập',
        'Xem xét đầu tư quỹ index fund'
      ]
    },
    {
      id: '2',
      date: '2024-01-20',
      consultant: 'Trần Thị Minh',
      topic: 'Lập kế hoạch mua nhà',
      status: 'scheduled',
      notes: '',
      recommendations: []
    }
  ]);

  const [financialGoals] = useState<FinancialGoal[]>([
    {
      id: '1',
      title: 'Mua nhà đầu tiên',
      targetAmount: 2000000000,
      currentAmount: 800000000,
      deadline: '2025-12-31',
      priority: 'high',
      status: 'on-track'
    },
    {
      id: '2',
      title: 'Quỹ giáo dục con em',
      targetAmount: 500000000,
      currentAmount: 150000000,
      deadline: '2030-06-30',
      priority: 'medium',
      status: 'behind'
    },
    {
      id: '3',
      title: 'Quỹ nghỉ hưu',
      targetAmount: 5000000000,
      currentAmount: 1200000000,
      deadline: '2040-12-31',
      priority: 'high',
      status: 'ahead'
    }
  ]);

  const consultationTopics = [
    { id: 'debt-management', label: 'Quản lý nợ' },
    { id: 'investment-planning', label: 'Kế hoạch đầu tư' },
    { id: 'retirement-planning', label: 'Lập kế hoạch hưu trí' },
    { id: 'home-buying', label: 'Mua nhà' },
    { id: 'education-funding', label: 'Quỹ giáo dục' },
    { id: 'insurance-planning', label: 'Bảo hiểm' },
    { id: 'tax-optimization', label: 'Tối ưu thuế' },
    { id: 'emergency-fund', label: 'Quỹ khẩn cấp' },
  ];

  const scheduleConsultation = () => {
    if (!selectedTopic || !selectedDate || !selectedTime || !consultationRequest) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin để đặt lịch tư vấn",
      });
      return;
    }

    toast({
      title: "Đặt lịch thành công",
      description: "Chúng tôi sẽ liên hệ xác nhận lịch tư vấn trong 24h",
    });

    // Reset form
    setSelectedTopic('');
    setConsultationRequest('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'ahead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Tư vấn tài chính cá nhân
          </CardTitle>
          <CardDescription>
            Nhận tư vấn chuyên sâu từ các chuyên gia tài chính để tối ưu hóa kế hoạch tài chính của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">Đặt lịch tư vấn</TabsTrigger>
              <TabsTrigger value="history">Lịch sử tư vấn</TabsTrigger>
              <TabsTrigger value="goals">Mục tiêu tài chính</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="topic">Chủ đề tư vấn</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chủ đề cần tư vấn" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Ngày mong muốn</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Thời gian mong muốn</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                      <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                      <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                      <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                      <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="request">Nội dung cần tư vấn</Label>
                <Textarea
                  id="request"
                  placeholder="Mô tả chi tiết tình hình tài chính và những vấn đề bạn muốn được tư vấn..."
                  value={consultationRequest}
                  onChange={(e) => setConsultationRequest(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={scheduleConsultation} className="w-full md:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Đặt lịch tư vấn
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {consultationHistory.map((session) => (
                <div key={session.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{session.topic}</h4>
                      <p className="text-sm text-gray-600">
                        Tư vấn viên: {session.consultant}
                      </p>
                      <p className="text-sm text-gray-600">
                        Ngày: {new Date(session.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status === 'completed' ? 'Đã hoàn thành' :
                       session.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hủy'}
                    </Badge>
                  </div>

                  {session.notes && (
                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-1">Ghi chú:</h5>
                      <p className="text-sm text-gray-600">{session.notes}</p>
                    </div>
                  )}

                  {session.recommendations.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-2">Khuyến nghị:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {session.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Xem báo cáo
                    </Button>
                    {session.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        Đổi lịch
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Mục tiêu tài chính của bạn</h4>
                <Button variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Thêm mục tiêu mới
                </Button>
              </div>

              <div className="space-y-4">
                {financialGoals.map((goal) => {
                  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
                  const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={goal.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{goal.title}</h4>
                          <p className="text-sm text-gray-600">
                            {goal.currentAmount.toLocaleString('vi-VN')} / {goal.targetAmount.toLocaleString('vi-VN')} VND
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority === 'high' ? 'Ưu tiên cao' :
                             goal.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                          </Badge>
                          <Badge className={getGoalStatusColor(goal.status)}>
                            {goal.status === 'on-track' ? 'Đúng kế hoạch' :
                             goal.status === 'behind' ? 'Chậm tiến độ' : 'Vượt kế hoạch'}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tiến độ</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              goal.status === 'ahead' ? 'bg-blue-500' :
                              goal.status === 'on-track' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Hạn: {new Date(goal.deadline).toLocaleDateString('vi-VN')}
                          {daysRemaining > 0 && ` (còn ${daysRemaining} ngày)`}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            Cập nhật
                          </Button>
                          <Button size="sm">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalFinanceConsultant;
