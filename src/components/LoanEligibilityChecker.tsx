
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

interface EligibilityFormData {
  monthlyIncome: number;
  age: number;
  creditHistory: string;
  employmentType: string;
  existingDebts: number;
  loanAmount: number;
  loanTerm: number;
}

const LoanEligibilityChecker = () => {
  const { toast } = useToast();
  const [eligibilityScore, setEligibilityScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const [formData, setFormData] = useState<EligibilityFormData>({
    monthlyIncome: 0,
    age: 30,
    creditHistory: 'good',
    employmentType: 'full-time',
    existingDebts: 0,
    loanAmount: 100000000,
    loanTerm: 10
  });
  
  const handleInputChange = (field: keyof EligibilityFormData, value: string | number) => {
    // For numeric fields, ensure we're setting numbers not strings
    if (field === 'monthlyIncome' || field === 'age' || field === 'existingDebts' || 
        field === 'loanAmount' || field === 'loanTerm') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const calculateEligibility = () => {
    // Base score starts at 50
    let score = 50;
    
    // Income factor (higher income = higher score)
    score += Math.min(30, formData.monthlyIncome / 10000000);
    
    // Age factor (25-40 is ideal range)
    if (formData.age >= 25 && formData.age <= 40) {
      score += 10;
    } else if (formData.age > 40 && formData.age <= 55) {
      score += 5;
    } else if (formData.age > 55) {
      score -= 10;
    }
    
    // Credit history
    if (formData.creditHistory === 'excellent') {
      score += 15;
    } else if (formData.creditHistory === 'good') {
      score += 10;
    } else if (formData.creditHistory === 'fair') {
      score += 0;
    } else if (formData.creditHistory === 'poor') {
      score -= 15;
    }
    
    // Employment type
    if (formData.employmentType === 'full-time') {
      score += 10;
    } else if (formData.employmentType === 'part-time') {
      score += 5;
    } else if (formData.employmentType === 'self-employed') {
      score += 7;
    } else if (formData.employmentType === 'unemployed') {
      score -= 20;
    }
    
    // Debt to income ratio
    const debtToIncomeRatio = formData.existingDebts / (formData.monthlyIncome + 0.01);
    if (debtToIncomeRatio <= 0.2) {
      score += 15;
    } else if (debtToIncomeRatio <= 0.4) {
      score += 7;
    } else if (debtToIncomeRatio <= 0.6) {
      score += 0;
    } else {
      score -= 15;
    }
    
    // Loan amount to income ratio
    const loanToIncomeRatio = formData.loanAmount / (formData.monthlyIncome * 12 + 0.01);
    if (loanToIncomeRatio <= 3) {
      score += 10;
    } else if (loanToIncomeRatio <= 5) {
      score += 5;
    } else if (loanToIncomeRatio <= 7) {
      score += 0;
    } else {
      score -= 10;
    }
    
    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));
    
    setEligibilityScore(score);
    setShowResults(true);
    
    // Show toast notification
    toast({
      title: `Điểm đánh giá: ${score.toFixed(0)}/100`,
      description: getScoreMessage(score),
    });
  };
  
  const getScoreMessage = (score: number) => {
    if (score >= 80) {
      return "Khả năng vay vốn rất cao. Bạn có thể đủ điều kiện cho nhiều gói vay ưu đãi.";
    } else if (score >= 65) {
      return "Khả năng vay vốn khá tốt. Bạn có thể đủ điều kiện cho các gói vay thông thường.";
    } else if (score >= 50) {
      return "Khả năng vay vốn trung bình. Bạn có thể cần cải thiện một số yếu tố.";
    } else {
      return "Khả năng vay vốn thấp. Bạn nên cải thiện tình hình tài chính trước khi vay.";
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 65) return "bg-lime-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="bg-brand-50">
          <CardTitle className="text-2xl text-brand-700">Kiểm tra khả năng vay vốn</CardTitle>
          <CardDescription>
            Hoàn thành thông tin bên dưới để đánh giá nhanh khả năng vay vốn của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!showResults ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="monthlyIncome">Thu nhập hàng tháng (VND)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="Nhập thu nhập hàng tháng"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="age">Tuổi</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Nhập tuổi của bạn"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    min={18}
                    max={70}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="creditHistory">Lịch sử tín dụng</Label>
                  <Select 
                    value={formData.creditHistory} 
                    onValueChange={(value) => handleInputChange('creditHistory', value)}
                  >
                    <SelectTrigger id="creditHistory">
                      <SelectValue placeholder="Chọn lịch sử tín dụng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Xuất sắc - Luôn trả nợ đúng hạn</SelectItem>
                      <SelectItem value="good">Tốt - Hiếm khi trễ hạn</SelectItem>
                      <SelectItem value="fair">Trung bình - Đôi khi trễ hạn</SelectItem>
                      <SelectItem value="poor">Kém - Thường xuyên trễ hạn</SelectItem>
                      <SelectItem value="none">Chưa có lịch sử tín dụng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="employmentType">Loại hình công việc</Label>
                  <Select 
                    value={formData.employmentType} 
                    onValueChange={(value) => handleInputChange('employmentType', value)}
                  >
                    <SelectTrigger id="employmentType">
                      <SelectValue placeholder="Chọn loại hình công việc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Toàn thời gian</SelectItem>
                      <SelectItem value="part-time">Bán thời gian</SelectItem>
                      <SelectItem value="self-employed">Tự kinh doanh</SelectItem>
                      <SelectItem value="contract">Hợp đồng ngắn hạn</SelectItem>
                      <SelectItem value="unemployed">Đang không có việc làm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="existingDebts">Nợ hiện tại (VND)</Label>
                  <Input
                    id="existingDebts"
                    type="number"
                    placeholder="Nhập số nợ hiện tại"
                    value={formData.existingDebts}
                    onChange={(e) => handleInputChange('existingDebts', e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="loanAmount">Số tiền muốn vay (VND)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="Nhập số tiền muốn vay"
                    value={formData.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="loanTerm">Thời hạn vay (năm)</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    placeholder="Nhập thời hạn vay"
                    value={formData.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    min={1}
                    max={30}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={calculateEligibility} className="w-full md:w-auto">
                  Đánh giá khả năng vay <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center p-6">
                <h3 className="text-xl font-medium mb-2">Kết quả đánh giá khả năng vay vốn</h3>
                <div className="relative mx-auto w-48 h-48 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{eligibilityScore?.toFixed(0)}</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-brand-600"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * (eligibilityScore || 0)) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                </div>
                
                <div className="mb-6">
                  <p className="text-xl font-medium">
                    {eligibilityScore && eligibilityScore >= 65 ? (
                      <span className="flex items-center justify-center text-green-600">
                        <CheckCircle className="mr-2 h-5 w-5" /> 
                        {eligibilityScore >= 80 ? "Rất cao" : "Khá tốt"}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center text-amber-600">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        {eligibilityScore && eligibilityScore >= 50 ? "Trung bình" : "Thấp"}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600 mt-2">{getScoreMessage(eligibilityScore || 0)}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-medium">Mức thu nhập hàng tháng</p>
                    <p className="text-gray-600">
                      {formData.monthlyIncome.toLocaleString('vi-VN')} VND
                      {formData.monthlyIncome < 5000000 && (
                        <span className="text-red-500 block mt-1">
                          ⚠️ Thu nhập thấp có thể ảnh hưởng tới khả năng vay vốn
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Tỷ lệ nợ/thu nhập</p>
                    <p className="text-gray-600">
                      {((formData.existingDebts / (formData.monthlyIncome + 0.01)) * 100).toFixed(1)}%
                      {(formData.existingDebts / (formData.monthlyIncome + 0.01)) > 0.4 && (
                        <span className="text-red-500 block mt-1">
                          ⚠️ Tỷ lệ nợ/thu nhập cao có thể ảnh hưởng tới khả năng vay vốn
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Khả năng chi trả hàng tháng</p>
                    <p className="text-gray-600">
                      Ước tính: {((formData.loanAmount / (formData.loanTerm * 12)) * 1.1).toLocaleString('vi-VN')} VND
                      {((formData.loanAmount / (formData.loanTerm * 12)) * 1.1) > (formData.monthlyIncome * 0.5) && (
                        <span className="text-red-500 block mt-1">
                          ⚠️ Khoản vay vượt quá 50% thu nhập hàng tháng
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 flex flex-col md:flex-row gap-4 justify-between">
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Đánh giá lại
                </Button>
                <Button>
                  Xem gợi ý khoản vay phù hợp
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanEligibilityChecker;
