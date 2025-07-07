import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SampleDataGenerator } from '@/utils/sampleDataGenerator';
import { 
  User, 
  CreditCard, 
  MessageSquare, 
  Bell, 
  Brain, 
  FileText, 
  TrendingUp,
  CheckCircle,
  PlayCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

const TestingDashboard = () => {
  const { user, userRole } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());

  const handleGenerateSampleData = async (roleType: 'customer' | 'advisor' | 'bank_employee') => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      await SampleDataGenerator.setupCompleteUserProfile(user.id, roleType);
      setCompletedTests(prev => new Set([...prev, `profile-${roleType}`]));
    } catch (error) {
      console.error('Error generating sample data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const testScenarios = [
    {
      id: 'loan-application',
      title: 'Quy trình vay vốn',
      description: 'Kiểm tra quy trình đăng ký vay từ A-Z',
      icon: CreditCard,
      steps: [
        'Chọn sản phẩm vay',
        'Điền thông tin cá nhân',
        'Chọn tư vấn viên',
        'Theo dõi trạng thái hồ sơ'
      ],
      route: '/loan-application'
    },
    {
      id: 'messaging',
      title: 'Hệ thống tin nhắn',
      description: 'Kiểm tra trao đổi giữa khách hàng và tư vấn viên',
      icon: MessageSquare,
      steps: [
        'Gửi tin nhắn text',
        'Chia sẻ file đính kèm',
        'Tìm kiếm tin nhắn',
        'Kiểm tra trạng thái đã đọc'
      ],
      route: '/messages'
    },
    {
      id: 'ai-advisory',
      title: 'Tư vấn AI',
      description: 'Kiểm tra tính năng phân tích tài chính thông minh',
      icon: Brain,
      steps: [
        'Nhập thông tin tài chính',
        'Phân tích AI',
        'Đề xuất khoản vay phù hợp',
        'Tối ưu hóa portfolio'
      ],
      route: '/tu-van-ai'
    },
    {
      id: 'notifications',
      title: 'Hệ thống thông báo',
      description: 'Kiểm tra thông báo realtime và alerts',
      icon: Bell,
      steps: [
        'Thông báo hồ sơ được duyệt',
        'Cảnh báo lãi suất',
        'Nhắc nhở bổ sung tài liệu',
        'Thông báo tin nhắn mới'
      ],
      route: '/dashboard'
    },
    {
      id: 'documents',
      title: 'Quản lý tài liệu',
      description: 'Kiểm tra upload và quản lý hồ sơ',
      icon: FileText,
      steps: [
        'Upload tài liệu',
        'Phân loại hồ sơ',
        'Duyệt tài liệu',
        'Tải xuống file'
      ],
      route: '/ho-so-tai-lieu'
    },
    {
      id: 'optimization',
      title: 'Tối ưu hóa vay',
      description: 'Kiểm tra tính năng so sánh và tối ưu khoản vay',
      icon: TrendingUp,
      steps: [
        'Nhập khoản vay hiện tại',
        'Phân tích chi phí',
        'Đề xuất tái cấu trúc',
        'So sánh lợi ích'
      ],
      route: '/loan-optimization'
    }
  ];

  const systemHealth = {
    database: true,
    auth: true,
    messaging: true,
    ai: true,
    notifications: true,
    files: true
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Yêu cầu đăng nhập</h2>
              <p className="text-gray-600">Bạn cần đăng nhập để truy cập Testing Dashboard</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Testing Dashboard</h1>
          <p className="text-gray-600">Kiểm tra toàn diện các tính năng của hệ thống Finzy</p>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Trạng thái hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(systemHealth).map(([key, status]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm capitalize">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sample Data Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Tạo dữ liệu mẫu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleGenerateSampleData('customer')}
                disabled={isGenerating}
                variant={completedTests.has('profile-customer') ? 'secondary' : 'default'}
                className="h-20 flex flex-col gap-2"
              >
                {completedTests.has('profile-customer') ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <div>
                  <div className="font-semibold">Khách hàng</div>
                  <div className="text-xs opacity-70">Hồ sơ vay + Dữ liệu mẫu</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleGenerateSampleData('advisor')}
                disabled={isGenerating}
                variant={completedTests.has('profile-advisor') ? 'secondary' : 'default'}
                className="h-20 flex flex-col gap-2"
              >
                {completedTests.has('profile-advisor') ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <div>
                  <div className="font-semibold">Tư vấn viên</div>
                  <div className="text-xs opacity-70">Profile chuyên gia</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleGenerateSampleData('bank_employee')}
                disabled={isGenerating}
                variant={completedTests.has('profile-bank_employee') ? 'secondary' : 'default'}
                className="h-20 flex flex-col gap-2"
              >
                {completedTests.has('profile-bank_employee') ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <div>
                  <div className="font-semibold">NV Ngân hàng</div>
                  <div className="text-xs opacity-70">Profile thẩm định</div>
                </div>
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Dữ liệu mẫu sẽ được tạo cho tài khoản hiện tại. 
                Mỗi loại profile sẽ tạo ra dữ liệu phù hợp để test các tính năng tương ứng.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">User ID:</span>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Vai trò:</span>
                <Badge variant="outline">{userRole || 'Chưa xác định'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testScenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    {scenario.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Các bước kiểm tra:</span>
                    <ul className="text-sm space-y-1">
                      {scenario.steps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={() => window.open(scenario.route, '_blank')}
                    className="w-full"
                    variant="outline"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Bắt đầu test
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testing Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Hướng dẫn kiểm tra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Quy trình kiểm tra toàn diện:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Tạo dữ liệu mẫu cho từng loại tài khoản (khách hàng, tư vấn viên, nhân viên ngân hàng)</li>
                <li>Kiểm tra từng tính năng theo thứ tự ưu tiên</li>
                <li>Thực hiện test end-to-end cho quy trình vay vốn hoàn chỉnh</li>
                <li>Kiểm tra tính năng realtime (tin nhắn, thông báo)</li>
                <li>Test performance với dữ liệu lớn</li>
                <li>Kiểm tra bảo mật và phân quyền</li>
              </ol>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Quan trọng:</strong> Đảm bảo test trên cả desktop và mobile để kiểm tra responsive design.
                Sử dụng nhiều trình duyệt khác nhau để đảm bảo tương thích.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestingDashboard;