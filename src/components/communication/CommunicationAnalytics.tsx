import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, MessageSquare, Clock, Target } from 'lucide-react';

const CommunicationAnalytics = () => {
  const analytics = {
    totalMessages: 1250,
    responseTime: 15,
    satisfactionRate: 94,
    activeConversations: 28
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Phân tích hoạt động giao tiếp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{analytics.totalMessages}</div>
              <div className="text-sm text-blue-700">Tổng tin nhắn</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{analytics.responseTime}m</div>
              <div className="text-sm text-green-700">Thời gian phản hồi</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{analytics.satisfactionRate}%</div>
              <div className="text-sm text-purple-700">Độ hài lòng</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{analytics.activeConversations}</div>
              <div className="text-sm text-orange-700">Cuộc trò chuyện</div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="font-semibold">Hiệu suất theo thời gian</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Biểu đồ phân tích chi tiết</p>
                <p className="text-sm">Dữ liệu cập nhật theo thời gian thực</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationAnalytics;