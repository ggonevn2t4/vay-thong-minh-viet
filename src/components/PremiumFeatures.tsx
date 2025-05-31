
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Star, Shield, Zap, Phone, Calendar, FileText, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const PremiumFeatures = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const premiumPlans: PremiumPlan[] = [
    {
      id: 'basic',
      name: 'Gói Cơ bản',
      price: 299000,
      duration: '/tháng',
      features: [
        'Tối ưu hóa hồ sơ tín dụng cơ bản',
        'So sánh lãi suất từ 5 ngân hàng',
        'Theo dõi 3 đơn vay',
        'Hỗ trợ email trong giờ hành chính',
        'Báo cáo tín dụng hàng tháng'
      ]
    },
    {
      id: 'professional',
      name: 'Gói Chuyên nghiệp',
      price: 599000,
      duration: '/tháng',
      features: [
        'Tất cả tính năng gói Cơ bản',
        'Tư vấn 1-1 với chuyên gia (2h/tháng)',
        'So sánh từ 10+ ngân hàng',
        'Đàm phán lãi suất chuyên nghiệp',
        'Theo dõi không giới hạn đơn vay',
        'Hỗ trợ 24/7 qua hotline',
        'Báo cáo chi tiết tuần'
      ],
      popular: true,
      savings: 'Tiết kiệm trung bình 15 triệu/năm'
    },
    {
      id: 'enterprise',
      name: 'Gói Doanh nghiệp',
      price: 999000,
      duration: '/tháng',
      features: [
        'Tất cả tính năng gói Chuyên nghiệp',
        'Tư vấn không giới hạn',
        'Quản lý tài chính gia đình/DN',
        'Lập kế hoạch đầu tư cá nhân hóa',
        'Ưu tiên cao trong đàm phán',
        'Chuyên gia riêng được phân công',
        'Báo cáo theo yêu cầu'
      ],
      savings: 'Tiết kiệm trung bình 30 triệu/năm'
    }
  ];

  const exclusiveServices = [
    {
      id: 'credit-repair',
      title: 'Dịch vụ sửa chữa tín dụng',
      description: 'Khôi phục điểm tín dụng trong 3-6 tháng',
      price: 2500000,
      icon: <Shield className="h-6 w-6" />,
      features: [
        'Phân tích chi tiết báo cáo tín dụng',
        'Khiếu nại thông tin sai lệch',
        'Đàm phán với các tổ chức tín dụng',
        'Theo dõi tiến độ hàng tuần'
      ]
    },
    {
      id: 'loan-concierge',
      title: 'Dịch vụ concierge vay vốn',
      description: 'Hỗ trợ toàn trình từ A-Z',
      price: 5000000,
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Chuẩn bị hồ sơ chuyên nghiệp',
        'Đại diện đàm phán với ngân hàng',
        'Tối ưu hóa điều khoản hợp đồng',
        'Đảm bảo lãi suất tốt nhất thị trường'
      ]
    },
    {
      id: 'investment-advisory',
      title: 'Tư vấn đầu tư cá nhân hóa',
      description: 'Kế hoạch đầu tư phù hợp với mục tiêu',
      price: 3000000,
      icon: <TrendingUp className="h-6 w-6" />,
      features: [
        'Phân tích hồ sơ rủi ro cá nhân',
        'Thiết kế danh mục đầu tư tối ưu',
        'Theo dõi và điều chỉnh định kỳ',
        'Báo cáo hiệu suất chi tiết'
      ]
    }
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Đăng ký thành công",
      description: "Chúng tôi sẽ liên hệ để xác nhận và kích hoạt gói dịch vụ",
    });
  };

  const handleServiceRequest = (serviceId: string) => {
    toast({
      title: "Đã gửi yêu cầu",
      description: "Chuyên gia sẽ liên hệ tư vấn trong 24h",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Crown className="mr-2 h-6 w-6 text-yellow-500" />
            Gói dịch vụ Premium
          </CardTitle>
          <CardDescription>
            Nâng cao trải nghiệm với các tính năng độc quyền và hỗ trợ chuyên sâu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plans">Gói đăng ký</TabsTrigger>
              <TabsTrigger value="services">Dịch vụ độc quyền</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {premiumPlans.map((plan) => (
                  <div key={plan.id} className={`relative p-6 border rounded-lg ${
                    plan.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white">
                          <Star className="mr-1 h-3 w-3" />
                          Phổ biến nhất
                        </Badge>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600">
                        {plan.price.toLocaleString('vi-VN')} VND
                        <span className="text-lg font-normal text-gray-600">{plan.duration}</span>
                      </div>
                      {plan.savings && (
                        <p className="text-sm text-green-600 font-medium mt-2">{plan.savings}</p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Zap className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {selectedPlan === plan.id ? 'Đã đăng ký' : 'Đăng ký ngay'}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Đảm bảo hiệu quả 100%</h3>
                  <p className="mb-4">
                    Nếu không hài lòng trong 30 ngày đầu, chúng tôi hoàn tiền 100%
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="secondary">
                      <Phone className="mr-2 h-4 w-4" />
                      Tư vấn miễn phí
                    </Button>
                    <Button variant="outline" className="text-gray-800">
                      <Calendar className="mr-2 h-4 w-4" />
                      Đặt lịch demo
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exclusiveServices.map((service) => (
                  <div key={service.id} className="p-6 border rounded-lg bg-white">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-bold">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      {service.price.toLocaleString('vi-VN')} VND
                    </div>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Zap className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={() => handleServiceRequest(service.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Yêu cầu tư vấn
                    </Button>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2">Cam kết chất lượng</h3>
                    <p className="text-yellow-700">
                      Tất cả dịch vụ đều được thực hiện bởi các chuyên gia có chứng chỉ quốc tế 
                      và được bảo đảm kết quả. Nếu không đạt được mục tiêu đề ra, chúng tôi sẽ 
                      tiếp tục hỗ trợ miễn phí đến khi thành công.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumFeatures;
