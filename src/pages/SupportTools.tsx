
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  FileCheck, 
  Bot, 
  BarChart3, 
  Users, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const SupportTools = () => {
  const tools = [
    {
      title: 'Máy tính khoản vay',
      description: 'Tính toán số tiền vay, lãi suất và thời hạn phù hợp với tình hình tài chính của bạn',
      icon: Calculator,
      href: '/',
      color: 'bg-blue-50 text-blue-600',
      features: ['Tính toán chính xác', 'Nhiều loại khoản vay', 'Kết quả chi tiết']
    },
    {
      title: 'Kiểm tra khả năng vay',
      description: 'Đánh giá khả năng vay vốn dựa trên thu nhập và tình hình tài chính hiện tại',
      icon: CheckCircle,
      href: '/loan-eligibility',
      color: 'bg-green-50 text-green-600',
      features: ['Đánh giá nhanh chóng', 'Tư vấn cải thiện', 'Theo dõi tiến độ']
    },
    {
      title: 'Hồ sơ tài liệu',
      description: 'Danh sách đầy đủ các giấy tờ cần thiết cho từng loại khoản vay',
      icon: FileCheck,
      href: '/document-checklist',
      color: 'bg-purple-50 text-purple-600',
      features: ['Checklist chi tiết', 'Hướng dẫn chuẩn bị', 'Mẫu giấy tờ']
    },
    {
      title: 'Tư vấn AI',
      description: 'Nhận tư vấn tài chính thông minh từ AI để tối ưu hóa kế hoạch vay vốn',
      icon: Bot,
      href: '/ai-advisory',
      color: 'bg-indigo-50 text-indigo-600',
      features: ['Tư vấn 24/7', 'Phân tích chuyên sâu', 'Gợi ý tối ưu']
    },
    {
      title: 'So sánh lãi suất',
      description: 'So sánh lãi suất và điều kiện vay từ nhiều ngân hàng khác nhau',
      icon: BarChart3,
      href: '/so-sanh',
      color: 'bg-orange-50 text-orange-600',
      features: ['So sánh toàn diện', 'Cập nhật thường xuyên', 'Bảng xếp hạng']
    },
    {
      title: 'Liên hệ tư vấn',
      description: 'Kết nối với các chuyên gia tư vấn tài chính có kinh nghiệm',
      icon: Users,
      href: '/advisor-directory',
      color: 'bg-pink-50 text-pink-600',
      features: ['Tư vấn viên chuyên nghiệp', 'Đánh giá từ khách hàng', 'Tư vấn cá nhân hóa']
    }
  ];

  return (
    <Layout>
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Công cụ hỗ trợ vay vốn
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bộ công cụ toàn diện giúp bạn tìm hiểu, tính toán và lựa chọn khoản vay phù hợp nhất
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                      {tool.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-6">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link to={tool.href}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Sử dụng ngay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cần hỗ trợ thêm?
            </h2>
            <p className="text-gray-600 mb-6">
              Đội ngũ tư vấn viên chuyên nghiệp sẵn sàng hỗ trợ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/advisor-directory">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Liên hệ tư vấn viên
                </Button>
              </Link>
              <Link to="/loan-application">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Đăng ký khoản vay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportTools;
