
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  FinancialData,
  AIAnalysis,
  LoanOptimization,
  BankApprovalPrediction,
  createConsultationSession,
  analyzeFinancialData,
  optimizeLoanStructure,
  predictBankApprovals,
  updateConsultationSession,
  createFinancialAnalysisReport
} from '@/services/aiAdvisoryService';
import AIAdvisoryForm from './AIAdvisoryForm';

interface AIAdvisorySystemProps {
  initialData?: Partial<FinancialData>;
}

const AIAdvisorySystem = ({ initialData }: AIAdvisorySystemProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    aiAnalysis: AIAnalysis;
    loanOptimization: LoanOptimization;
    bankPredictions: BankApprovalPrediction[];
  } | null>(null);

  const handleAnalyze = async (financialData: FinancialData) => {
    setIsAnalyzing(true);
    try {
      toast.info('Đang khởi tạo phiên tư vấn AI...');
      
      // Tạo phiên tư vấn
      const sessionId = await createConsultationSession(financialData);
      
      toast.info('Đang phân tích dữ liệu tài chính...');
      
      // Phân tích dữ liệu tài chính
      const aiAnalysis = await analyzeFinancialData(financialData);
      
      toast.info('Đang tối ưu hóa cấu trúc khoản vay...');
      
      // Tối ưu hóa khoản vay
      const loanOptimization = await optimizeLoanStructure(financialData, aiAnalysis);
      
      toast.info('Đang dự đoán phê duyệt ngân hàng...');
      
      // Dự đoán phê duyệt ngân hàng
      const bankPredictions = await predictBankApprovals(financialData, loanOptimization);
      
      // Cập nhật phiên tư vấn
      await updateConsultationSession(sessionId, aiAnalysis, loanOptimization, bankPredictions);
      
      // Tạo báo cáo phân tích
      await createFinancialAnalysisReport(sessionId, aiAnalysis);
      
      setAnalysisResult({
        aiAnalysis,
        loanOptimization,
        bankPredictions
      });
      
      toast.success('Phân tích hoàn tất! Kết quả đã được lưu vào hệ thống.');
      
    } catch (error) {
      console.error('Error during AI analysis:', error);
      toast.error('Có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 30) return 'Rủi ro thấp';
    if (score <= 70) return 'Rủi ro trung bình';
    return 'Rủi ro cao';
  };

  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Hệ thống AI Tư vấn Thông minh
          </h1>
          <p className="text-gray-600">
            Phân tích tài chính và tối ưu hóa khoản vay bằng AI
          </p>
        </div>

        <AIAdvisoryForm 
          onSubmit={handleAnalyze}
          isLoading={isAnalyzing}
          initialData={initialData}
        />

        {isAnalyzing && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                <span className="text-lg">Đang phân tích dữ liệu của bạn...</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>• Phân tích thu nhập và chi phí</p>
                <p>• Đánh giá rủi ro tín dụng</p>
                <p>• Tối ưu hóa cấu trúc khoản vay</p>
                <p>• Dự đoán phê duyệt ngân hàng</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const { aiAnalysis, loanOptimization, bankPredictions } = analysisResult;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Kết quả Phân tích AI
        </h1>
        <p className="text-gray-600">
          Báo cáo chi tiết về tình hình tài chính và khuyến nghị khoản vay
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analysis">Phân tích</TabsTrigger>
          <TabsTrigger value="optimization">Tối ưu hóa</TabsTrigger>
          <TabsTrigger value="predictions">Dự đoán</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Điểm Rủi ro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getRiskColor(aiAnalysis.risk_score)}`}>
                    {aiAnalysis.risk_score}
                  </div>
                  <Badge variant="outline" className={getRiskColor(aiAnalysis.risk_score)}>
                    {getRiskLabel(aiAnalysis.risk_score)}
                  </Badge>
                  <Progress value={aiAnalysis.risk_score} className="mt-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tỷ lệ Nợ/Thu nhập</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-600">
                    {(aiAnalysis.debt_to_income_ratio * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {aiAnalysis.debt_to_income_ratio < 0.3 ? 'Tốt' : 
                     aiAnalysis.debt_to_income_ratio < 0.5 ? 'Trung bình' : 'Cao'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Khả năng Chi trả</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {aiAnalysis.affordability_score}
                  </div>
                  <Progress value={aiAnalysis.affordability_score} className="mt-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Khuyến nghị
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  Cảnh báo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiAnalysis.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 text-brand-600 mr-2" />
                Cấu trúc Khoản vay Tối ưu
              </CardTitle>
              <CardDescription>
                Đề xuất dựa trên phân tích AI về tình hình tài chính của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-brand-50 rounded-lg">
                  <h3 className="font-medium text-brand-800">Số tiền vay tối ưu</h3>
                  <p className="text-2xl font-bold text-brand-600">
                    {loanOptimization.optimal_amount.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
                <div className="p-4 bg-brand-50 rounded-lg">
                  <h3 className="font-medium text-brand-800">Thời hạn tối ưu</h3>
                  <p className="text-2xl font-bold text-brand-600">
                    {loanOptimization.optimal_term} tháng
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Dự kiến Lãi suất</h3>
                <p className="text-lg font-semibold text-green-600">
                  {loanOptimization.expected_interest_rate_range.min}% - {loanOptimization.expected_interest_rate_range.max}%
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Ngân hàng Đề xuất</h3>
                <div className="flex flex-wrap gap-2">
                  {loanOptimization.recommended_banks.map((bank, index) => (
                    <Badge key={index} variant="secondary">
                      {bank}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dự đoán Phê duyệt Ngân hàng</CardTitle>
              <CardDescription>
                Xác suất phê duyệt và điều kiện dự kiến từ các ngân hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankPredictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-lg">{prediction.bank_name}</h3>
                      <Badge 
                        variant={prediction.approval_probability > 70 ? "default" : 
                                prediction.approval_probability > 40 ? "secondary" : "destructive"}
                      >
                        {prediction.approval_probability}% khả năng phê duyệt
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Lãi suất dự kiến</p>
                        <p className="font-medium">{prediction.predicted_interest_rate}%/năm</p>
                      </div>
                      <div>
                        <Progress value={prediction.approval_probability} className="mt-2" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Giấy tờ cần thiết:</p>
                      <div className="flex flex-wrap gap-1">
                        {prediction.required_documents.map((doc, docIndex) => (
                          <Badge key={docIndex} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button 
          onClick={() => setAnalysisResult(null)}
          variant="outline"
        >
          Phân tích lại
        </Button>
      </div>
    </div>
  );
};

export default AIAdvisorySystem;
