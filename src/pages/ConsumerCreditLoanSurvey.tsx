import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ConsumerCreditLoanSurveyForm from '@/components/consumer-credit-survey/ConsumerCreditLoanSurveyForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, FileText, Users, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ConsumerCreditLoanSurvey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    product_type: 'credit_loan',
    customer_questions: {}
  });
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'survey', 'complete'

  const handleStartSurvey = () => {
    setCurrentStep('survey');
  };

  const handleUpdateFormData = (data: Record<string, any>) => {
    setFormData({
      product_type: data.product_type || 'credit_loan',
      customer_questions: data.customer_questions || {},
      ...data
    });
  };

  const handleNext = () => {
    setCurrentStep('complete');
    toast({
      title: "Khảo sát hoàn thành!",
      description: "Chúng tôi sẽ phân tích thông tin và liên hệ với đề xuất vay phù hợp trong 24h.",
    });
  };

  const handleBack = () => {
    if (currentStep === 'survey') {
      setCurrentStep('intro');
    } else {
      navigate(-1);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmitNewSurvey = () => {
    setCurrentStep('intro');
    setFormData({
      product_type: 'credit_loan',
      customer_questions: {}
    });
  };

  if (currentStep === 'intro') {
    return (
      <Layout>
        <div className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 hover:bg-white/50"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>

              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Khảo Sát Vay Tín Chấp - Tiêu Dùng
                    </CardTitle>
                    <p className="text-blue-100 mt-2">
                      Hoàn thành thông tin để nhận đề xuất vay tín chấp phù hợp nhất với nhu cầu của bạn
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Thời gian ước tính: 8-12 phút
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Thông tin cá nhân</h3>
                      <p className="text-sm text-gray-600">Thông tin cơ bản và liên hệ</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <CreditCard className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tình hình tài chính</h3>
                      <p className="text-sm text-gray-600">Thu nhập, chi phí và tài sản</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mục đích vay</h3>
                      <p className="text-sm text-gray-600">Chi tiết về nhu cầu vay vốn</p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Lịch sử tín dụng</h3>
                      <p className="text-sm text-gray-600">Thông tin về các khoản vay hiện có</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                    <h4 className="font-semibold text-yellow-800 mb-2">🔒 Bảo mật thông tin</h4>
                    <p className="text-sm text-yellow-700">
                      Mọi thông tin bạn cung cấp sẽ được mã hóa và bảo mật theo tiêu chuẩn ngân hàng.
                      Chúng tôi cam kết không chia sẻ thông tin cá nhân với bên thứ ba.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Lợi ích khi hoàn thành khảo sát</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Nhận đề xuất lãi suất cạnh tranh từ nhiều ngân hàng</li>
                      <li>• Được tư vấn miễn phí về gói vay phù hợp</li>
                      <li>• Ưu tiên xử lý hồ sơ nhanh chóng</li>
                      <li>• Hỗ trợ hoàn thiện thủ tục vay vốn</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleStartSurvey}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
                    >
                      Bắt đầu khảo sát
                      <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (currentStep === 'survey') {
    return (
      <Layout>
        <div className="py-8 bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <ConsumerCreditLoanSurveyForm />
          </div>
        </div>
      </Layout>
    );
  }

  if (currentStep === 'complete') {
    return (
      <Layout>
        <div className="py-8 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="h-10 w-10 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Khảo sát hoàn thành thành công!
                  </h2>
                  
                  <p className="text-gray-600 mb-8">
                    Cảm ơn bạn đã hoàn thành khảo sát vay tín chấp. Đội ngũ chuyên gia của chúng tôi 
                    sẽ phân tích thông tin và liên hệ với đề xuất vay phù hợp trong vòng 24 giờ.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <h3 className="font-semibold text-blue-800 mb-2">Các bước tiếp theo:</h3>
                    <ul className="text-sm text-blue-700 text-left space-y-1">
                      <li>1. Phân tích hồ sơ và tính toán khả năng vay</li>
                      <li>2. So sánh lãi suất từ các ngân hàng đối tác</li>
                      <li>3. Tư vấn viên liên hệ với đề xuất tốt nhất</li>
                      <li>4. Hỗ trợ hoàn thiện hồ sơ và thủ tục</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleGoToDashboard}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Về Dashboard
                    </Button>
                    <Button
                      onClick={handleSubmitNewSurvey}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                      Khảo sát sản phẩm khác
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
};

export default ConsumerCreditLoanSurvey;