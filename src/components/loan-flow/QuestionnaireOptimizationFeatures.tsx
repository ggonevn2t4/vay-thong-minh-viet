import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Target, 
  Shield, 
  Brain, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LoanProductType } from '@/types/loan-application-flow';

interface OptimizationFeaturesProps {
  productType: LoanProductType;
  estimatedTime?: string;
}

const QuestionnaireOptimizationFeatures = ({ productType, estimatedTime }: OptimizationFeaturesProps) => {
  const getProductFeatures = (type: LoanProductType) => {
    switch (type) {
      case 'credit_loan':
        return {
          title: 'Khảo sát Thẻ Tín Dụng Thông Minh',
          description: 'Được tối ưu hóa để đánh giá chính xác khả năng tín dụng và đề xuất thẻ phù hợp',
          specialFeatures: [
            'Phân tích hành vi sử dụng thẻ',
            'Đánh giá khả năng chi tiêu',
            'Dự đoán mức hạn mức phù hợp',
            'Tối ưu hóa lãi suất'
          ],
          icon: '💳',
          color: 'blue'
        };
      case 'mortgage_loan':
        return {
          title: 'Khảo sát Vay Mua Nhà Chuyên Sâu',
          description: 'Đánh giá toàn diện khả năng tài chính và tài sản để vay mua bất động sản',
          specialFeatures: [
            'Phân tích tỷ lệ LTV tối ưu',
            'Đánh giá khả năng trả nợ dài hạn',
            'Tính toán DTI ratio',
            'Dự báo biến động lãi suất'
          ],
          icon: '🏠',
          color: 'green'
        };
      case 'car_loan':
        return {
          title: 'Khảo sát Vay Mua Xe Nhanh Chóng',
          description: 'Quy trình tối ưu để đánh giá nhanh nhu cầu vay xe và khả năng trả nợ',
          specialFeatures: [
            'Đánh giá giá trị xe',
            'Tính toán mức vay tối đa',
            'Đề xuất thời hạn phù hợp',
            'So sánh lãi suất các hãng'
          ],
          icon: '🚗',
          color: 'purple'
        };
      default:
        return {
          title: 'Khảo sát Thông Minh',
          description: 'Được tối ưu hóa cho từng loại sản phẩm vay',
          specialFeatures: [
            'Phân tích rủi ro thông minh',
            'Đề xuất cá nhân hóa',
            'Quy trình tối ưu',
            'Kết quả chính xác'
          ],
          icon: '💰',
          color: 'gray'
        };
    }
  };

  const features = getProductFeatures(productType);

  const optimizationBenefits = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Nhanh chóng & Hiệu quả',
      description: 'Giảm 50% thời gian điền form với câu hỏi thông minh',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: 'Câu hỏi có điều kiện',
      description: 'Chỉ hiển thị câu hỏi liên quan đến tình huống của bạn',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: 'AI phân tích thông minh',
      description: 'Đánh giá tự động điểm tín dụng và khả năng vay',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Bảo mật cao',
      description: 'Mã hóa dữ liệu và tuân thủ chuẩn bảo mật ngân hàng',
      color: 'text-green-600 bg-green-100'
    }
  ];

  const smartFeatures = [
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      title: 'Phân tích điểm tín dụng',
      description: 'Ước tính điểm tín dụng dựa trên thông tin cung cấp'
    },
    {
      icon: <Users className="h-5 w-5 text-green-600" />,
      title: 'Kết nối tự động',
      description: 'Kết nối với tư vấn viên phù hợp nhất'
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-600" />,
      title: 'Đề xuất cá nhân hóa',
      description: 'Gợi ý sản phẩm dựa trên profile tài chính'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Feature Highlight */}
      <Card className={`border-${features.color}-200 bg-${features.color}-50`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-${features.color}-600 rounded-lg flex items-center justify-center text-white text-2xl`}>
              {features.icon}
            </div>
            <div>
              <CardTitle className={`text-${features.color}-900`}>{features.title}</CardTitle>
              <p className={`text-${features.color}-700 text-sm`}>{features.description}</p>
            </div>
            {estimatedTime && (
              <Badge className={`bg-${features.color}-600 text-white`}>
                <Clock className="h-3 w-3 mr-1" />
                {estimatedTime}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {features.specialFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 text-${features.color}-600`} />
                <span className={`text-sm text-${features.color}-800`}>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Benefits */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Tối ưu hóa trải nghiệm khảo sát
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizationBenefits.map((benefit, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${benefit.color}`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Smart Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Tính năng thông minh
        </h3>
        <div className="space-y-3">
          {smartFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {feature.icon}
              <div>
                <span className="font-medium text-gray-900">{feature.title}</span>
                <span className="text-gray-600 ml-2">- {feature.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Sẵn sàng bắt đầu?</h4>
              <p className="text-blue-700 text-sm">
                Hoàn thành khảo sát thông minh và nhận đề xuất cá nhân hóa ngay lập tức
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnaireOptimizationFeatures;