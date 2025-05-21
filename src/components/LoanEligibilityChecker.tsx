
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, AlertCircle, CheckCircle, Building, Briefcase, BadgePercent, Info } from 'lucide-react';
import { 
  EnhancedEligibilityFormData,
  calculateEnhancedEligibility,
  getBankMatchScores,
  getLoanEligibilityCategory,
  getScoreMessage,
  formatVND,
  showLoanWarning
} from '@/utils/enhancedLoanEligibility';

// Component for displaying bank scores
const BankMatchingScore = ({ bankScore }: { 
  bankScore: {bank: any, matchScore: number, interestRate: number | null}
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{bankScore.bank.name}</span>
      <div className="flex items-center">
        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
          <div 
            className={`h-2 rounded-full ${
              bankScore.matchScore >= 80 ? 'bg-green-500' : 
              bankScore.matchScore >= 65 ? 'bg-lime-500' : 
              bankScore.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${bankScore.matchScore}%` }}
          />
        </div>
        <span className="text-sm font-medium">{bankScore.matchScore}%</span>
      </div>
    </div>
  );
};

const LoanEligibilityChecker = () => {
  const { toast } = useToast();
  const [eligibilityScore, setEligibilityScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [bankScores, setBankScores] = useState<{bank: any, matchScore: number, interestRate: number | null}[]>([]);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  
  const [formData, setFormData] = useState<EnhancedEligibilityFormData>({
    monthlyIncome: 10000000,
    age: 30,
    creditHistory: 'good',
    employmentType: 'full-time',
    existingDebts: 0,
    loanAmount: 100000000,
    loanTerm: 10,
    // Enhanced fields
    occupation: 'other',
    yearsEmployed: 2,
    collateralValue: 0,
    hasCoBorrower: false,
    dependents: 0,
    loanPurpose: 'home',
    housingType: 'rent',
    monthlyExpenses: 3000000,
    previousLoans: 0,
    previousLoansRepaid: 0
  });
  
  const handleInputChange = (field: keyof EnhancedEligibilityFormData, value: string | number | boolean) => {
    // For numeric fields, ensure we're setting numbers not strings
    if (field === 'monthlyIncome' || field === 'age' || field === 'existingDebts' || 
        field === 'loanAmount' || field === 'loanTerm' || field === 'yearsEmployed' || 
        field === 'collateralValue' || field === 'dependents' || field === 'monthlyExpenses' ||
        field === 'previousLoans' || field === 'previousLoansRepaid') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const calculateEligibility = () => {
    // Calculate enhanced eligibility score
    const score = calculateEnhancedEligibility(formData);
    
    // Get bank matching scores
    const matchingBanks = getBankMatchScores(formData, score);
    
    setEligibilityScore(score);
    setBankScores(matchingBanks);
    setShowResults(true);
    
    // Show warnings if needed
    showLoanWarning(formData);
    
    // Show toast notification
    toast({
      title: `Điểm đánh giá: ${score.toFixed(0)}/100`,
      description: getScoreMessage(score),
    });
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
              {/* Basic Information */}
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

                <div className="space-y-3">
                  <Label htmlFor="loanPurpose">Mục đích vay</Label>
                  <Select 
                    value={formData.loanPurpose} 
                    onValueChange={(value) => handleInputChange('loanPurpose', value)}
                  >
                    <SelectTrigger id="loanPurpose">
                      <SelectValue placeholder="Chọn mục đích vay" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Mua nhà/căn hộ</SelectItem>
                      <SelectItem value="business">Kinh doanh</SelectItem>
                      <SelectItem value="education">Học tập</SelectItem>
                      <SelectItem value="vehicle">Mua xe</SelectItem>
                      <SelectItem value="medical">Chi phí y tế</SelectItem>
                      <SelectItem value="travel">Du lịch</SelectItem>
                      <SelectItem value="wedding">Đám cưới</SelectItem>
                      <SelectItem value="personal">Tiêu dùng cá nhân</SelectItem>
                      <SelectItem value="investment">Đầu tư</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Show/Hide Advanced Options */}
              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAdvancedForm(!showAdvancedForm)}
                  className="w-full"
                >
                  {showAdvancedForm ? 'Ẩn thông tin chi tiết' : 'Hiển thị thông tin chi tiết'}
                </Button>
              </div>
              
              {/* Advanced Information */}
              {showAdvancedForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <Label htmlFor="occupation">Ngành nghề</Label>
                    <Select 
                      value={formData.occupation} 
                      onValueChange={(value) => handleInputChange('occupation', value)}
                    >
                      <SelectTrigger id="occupation">
                        <SelectValue placeholder="Chọn ngành nghề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">Cơ quan nhà nước</SelectItem>
                        <SelectItem value="finance">Tài chính/Ngân hàng</SelectItem>
                        <SelectItem value="technology">Công nghệ</SelectItem>
                        <SelectItem value="healthcare">Y tế</SelectItem>
                        <SelectItem value="education">Giáo dục</SelectItem>
                        <SelectItem value="retail">Bán lẻ</SelectItem>
                        <SelectItem value="manufacturing">Sản xuất</SelectItem>
                        <SelectItem value="construction">Xây dựng</SelectItem>
                        <SelectItem value="business">Kinh doanh</SelectItem>
                        <SelectItem value="service">Dịch vụ</SelectItem>
                        <SelectItem value="international">Công ty đa quốc gia</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="yearsEmployed">Số năm làm việc</Label>
                    <Input
                      id="yearsEmployed"
                      type="number"
                      placeholder="Nhập số năm làm việc"
                      value={formData.yearsEmployed}
                      onChange={(e) => handleInputChange('yearsEmployed', e.target.value)}
                      min={0}
                      step={0.5}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="collateralValue">Giá trị tài sản đảm bảo (VND) (nếu có)</Label>
                    <Input
                      id="collateralValue"
                      type="number"
                      placeholder="Nhập giá trị tài sản đảm bảo"
                      value={formData.collateralValue}
                      onChange={(e) => handleInputChange('collateralValue', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="hasCoBorrower">Có người đồng vay</Label>
                    <Select 
                      value={formData.hasCoBorrower ? "true" : "false"} 
                      onValueChange={(value) => handleInputChange('hasCoBorrower', value === "true")}
                    >
                      <SelectTrigger id="hasCoBorrower">
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Có</SelectItem>
                        <SelectItem value="false">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="dependents">Số người phụ thuộc</Label>
                    <Input
                      id="dependents"
                      type="number"
                      placeholder="Nhập số người phụ thuộc"
                      value={formData.dependents}
                      onChange={(e) => handleInputChange('dependents', e.target.value)}
                      min={0}
                      max={10}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="housingType">Loại hình nhà ở</Label>
                    <Select 
                      value={formData.housingType} 
                      onValueChange={(value) => handleInputChange('housingType', value)}
                    >
                      <SelectTrigger id="housingType">
                        <SelectValue placeholder="Chọn loại hình nhà ở" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="own-outright">Sở hữu hoàn toàn</SelectItem>
                        <SelectItem value="own-mortgage">Đang trả góp</SelectItem>
                        <SelectItem value="rent">Đi thuê</SelectItem>
                        <SelectItem value="living-with-family">Sống cùng gia đình</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="monthlyExpenses">Chi phí hàng tháng (VND)</Label>
                    <Input
                      id="monthlyExpenses"
                      type="number"
                      placeholder="Nhập chi phí hàng tháng"
                      value={formData.monthlyExpenses}
                      onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="previousLoans">Số khoản vay trước đây</Label>
                    <Input
                      id="previousLoans"
                      type="number"
                      placeholder="Nhập số khoản vay trước đây"
                      value={formData.previousLoans}
                      onChange={(e) => handleInputChange('previousLoans', e.target.value)}
                      min={0}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="previousLoansRepaid">Số khoản vay đã trả hết</Label>
                    <Input
                      id="previousLoansRepaid"
                      type="number"
                      placeholder="Nhập số khoản vay đã trả hết"
                      value={formData.previousLoansRepaid}
                      onChange={(e) => handleInputChange('previousLoansRepaid', e.target.value)}
                      min={0}
                      max={formData.previousLoans}
                    />
                  </div>
                </div>
              )}
              
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
                      {formatVND(formData.monthlyIncome)}
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
                      {((formData.existingDebts / (formData.monthlyIncome * 12 + 0.01)) * 100).toFixed(1)}%
                      {(formData.existingDebts / (formData.monthlyIncome * 12 + 0.01)) > 0.4 && (
                        <span className="text-red-500 block mt-1">
                          ⚠️ Tỷ lệ nợ/thu nhập cao có thể ảnh hưởng tới khả năng vay vốn
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Ngân hàng phù hợp nhất</p>
                    <div className="space-y-2">
                      {bankScores.slice(0, 3).map((bankScore, index) => (
                        <BankMatchingScore key={index} bankScore={bankScore} />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Lãi suất dự kiến</p>
                    <div className="text-gray-600">
                      {bankScores.length > 0 && bankScores[0].interestRate ? (
                        <div>
                          <p>
                            <span className="font-semibold">{bankScores[0].bank.name}: </span> 
                            <span className="text-brand-700 font-medium">{bankScores[0].interestRate.toFixed(2)}%/năm</span>
                          </p>
                          <p className="text-xs mt-1 text-gray-500">
                            <Info className="h-3 w-3 inline mr-1" />
                            Đây là lãi suất thực tế dự kiến dựa trên hồ sơ của bạn, không phải lãi suất quảng cáo
                          </p>
                        </div>
                      ) : (
                        <p>Chưa thể xác định lãi suất dựa trên thông tin hiện tại</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Khả năng chi trả hàng tháng</p>
                    <p className="text-gray-600">
                      {bankScores.length > 0 && bankScores[0].interestRate ? (
                        <span>
                          Ước tính: {formatVND(
                            (formData.loanAmount * (bankScores[0].interestRate || 10) / 100 / 12) + 
                            (formData.loanAmount / (formData.loanTerm * 12))
                          )}
                        </span>
                      ) : (
                        <span>
                          Ước tính: {formatVND((formData.loanAmount / (formData.loanTerm * 12)) * 1.1)}
                        </span>
                      )}
                      {((formData.loanAmount / (formData.loanTerm * 12)) * 1.1) > (formData.monthlyIncome * 0.4) && (
                        <span className="text-red-500 block mt-1">
                          ⚠️ Khoản vay vượt quá 40% thu nhập hàng tháng, có thể gặp khó khăn khi chi trả
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Các ngân hàng phù hợp nhất</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bankScores.slice(0, 2).map((bankScore, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${index === 0 ? 'border-brand-200 bg-brand-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{bankScore.bank.name}</h5>
                            <p className="text-sm text-gray-600">Mức lãi suất thực: 
                              <span className="font-medium ml-1">
                                {bankScore.interestRate ? `${bankScore.interestRate.toFixed(2)}%` : 'N/A'}
                              </span>
                            </p>
                          </div>
                          <div className="bg-white px-2 py-1 rounded-full border border-gray-200 text-xs font-medium">
                            {bankScore.matchScore}% phù hợp
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Thời gian xử lý:</span>
                            <span className="font-medium">{bankScore.bank.processingTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Giá trị khoản vay tối đa:</span>
                            <span className="font-medium">
                              {formatVND(Math.min(formData.monthlyIncome * 12 * 5, 3000000000))}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Button 
                            variant={index === 0 ? "default" : "outline"} 
                            className="w-full"
                            size="sm"
                          >
                            {index === 0 ? 'Xem chi tiết và ứng dụng' : 'Xem chi tiết'}
                          </Button>
                        </div>
                      </div>
                    ))}
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
