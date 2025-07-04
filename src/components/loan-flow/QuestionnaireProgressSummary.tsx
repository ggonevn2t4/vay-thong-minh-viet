import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface QuestionnaireSummaryProps {
  completionTime: number; // in minutes
  completionPercentage: number;
  creditScoreEstimate?: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendedProducts: string[];
  nextSteps: string[];
}

const QuestionnaireProgressSummary = ({
  completionTime,
  completionPercentage,
  creditScoreEstimate,
  riskLevel,
  recommendedProducts,
  nextSteps
}: QuestionnaireSummaryProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      default: return 'Chưa xác định';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Completion Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-6 w-6" />
            Hoàn thành khảo sát thành công!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completionTime} phút</div>
              <p className="text-sm text-gray-600">Thời gian hoàn thành</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
              <p className="text-sm text-gray-600">Độ hoàn thiện</p>
            </div>
            {creditScoreEstimate && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{creditScoreEstimate}</div>
                <p className="text-sm text-gray-600">Điểm tín dụng ước tính</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Đánh giá rủi ro tín dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Mức độ rủi ro:</p>
              <Badge className={getRiskColor(riskLevel)}>
                {getRiskLabel(riskLevel)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Khả năng phê duyệt:</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress 
                  value={riskLevel === 'low' ? 85 : riskLevel === 'medium' ? 65 : 35} 
                  className="w-24 h-2" 
                />
                <span className="text-sm font-medium">
                  {riskLevel === 'low' ? '85%' : riskLevel === 'medium' ? '65%' : '35%'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Sản phẩm phù hợp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendedProducts.map((product, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{product}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Bước tiếp theo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <AlertTriangle className="h-5 w-5" />
            Gợi ý thông minh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Dựa trên thông tin bạn cung cấp, chúng tôi đề xuất bạn cải thiện điểm tín dụng bằng cách thanh toán đúng hạn các khoản nợ hiện tại.</p>
            <p>• Hãy chuẩn bị đầy đủ giấy tờ để tăng khả năng phê duyệt nhanh chóng.</p>
            <p>• Chúng tôi sẽ kết nối bạn với các tư vấn viên chuyên nghiệp để được hỗ trợ tốt nhất.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnaireProgressSummary;