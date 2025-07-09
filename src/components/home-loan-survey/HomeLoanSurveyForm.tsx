import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calculator, Home, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Loan {
  type: string;
  amount: number;
  monthlyPayment: number;
  remainingTerm: number;
}

interface IncomeSource {
  source: string;
  amount: number;
}

interface Asset {
  type: string;
  value: number;
  description: string;
}

interface HomeLoanSurveyData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  maritalStatus: string;
  numberOfDependents: number;
  
  // Employment and Income
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  workExperienceYears: number;
  monthlySalary: number;
  otherIncomeSources: IncomeSource[];
  
  // Property Information
  propertyType: string;
  propertyLocation: string;
  propertyValue: number;
  downPaymentAmount: number;
  loanAmountNeeded: number;
  loanTermYears: number;
  
  // Financial Information
  existingLoans: Loan[];
  monthlyExpenses: number;
  savingsAmount: number;
  otherAssets: Asset[];
  
  // Preferences
  preferredBanks: string[];
  interestRatePreference: string;
  paymentSchedulePreference: string;
  loanPurpose: string;
  
  // Additional Information
  previousPropertyOwnership: boolean;
  creditHistoryIssues: boolean;
  creditHistoryDetails: string;
}

const HomeLoanSurveyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<HomeLoanSurveyData>();

  const totalSteps = 6;
  const progressPercent = (currentStep / totalSteps) * 100;

  // Watch form values for calculations
  const watchedValues = watch();
  const [calculatedTotalIncome, setCalculatedTotalIncome] = useState(0);
  const [estimatedCreditScore, setEstimatedCreditScore] = useState(0);
  const [loanToValueRatio, setLoanToValueRatio] = useState(0);

  // Dynamic form arrays
  const [loans, setLoans] = useState<Loan[]>([]);
  const [incomeSource, setIncomeSource] = useState<IncomeSource[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);

  // Calculate total income
  useEffect(() => {
    const salary = watchedValues.monthlySalary || 0;
    const otherIncome = incomeSource.reduce((sum, source) => sum + (source.amount || 0), 0);
    setCalculatedTotalIncome(salary + otherIncome);
  }, [watchedValues.monthlySalary, incomeSource]);

  // Calculate loan to value ratio
  useEffect(() => {
    const propertyValue = watchedValues.propertyValue || 0;
    const loanAmount = watchedValues.loanAmountNeeded || 0;
    if (propertyValue > 0) {
      setLoanToValueRatio((loanAmount / propertyValue) * 100);
    }
  }, [watchedValues.propertyValue, watchedValues.loanAmountNeeded]);

  // Calculate estimated credit score
  useEffect(() => {
    const totalIncome = calculatedTotalIncome;
    const totalDebt = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
    const totalAssets = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
    const savings = watchedValues.savingsAmount || 0;
    
    let score = 650; // Base score
    
    if (totalIncome > 50000000) score += 50; // High income
    if (totalDebt / totalIncome < 0.3) score += 50; // Low debt ratio
    if (savings > 200000000) score += 40; // Good savings
    if (totalAssets > 500000000) score += 30; // Good assets
    if (watchedValues.workExperienceYears > 5) score += 20; // Stable employment
    if (loanToValueRatio < 80) score += 30; // Good LTV ratio
    if (watchedValues.creditHistoryIssues) score -= 100; // Credit issues
    
    setEstimatedCreditScore(Math.min(Math.max(score, 300), 850));
  }, [calculatedTotalIncome, loans, assets, watchedValues, loanToValueRatio]);

  const addLoan = () => {
    setLoans([...loans, { type: '', amount: 0, monthlyPayment: 0, remainingTerm: 0 }]);
  };

  const removeLoan = (index: number) => {
    setLoans(loans.filter((_, i) => i !== index));
  };

  const addIncomeSource = () => {
    setIncomeSource([...incomeSource, { source: '', amount: 0 }]);
  };

  const removeIncomeSource = (index: number) => {
    setIncomeSource(incomeSource.filter((_, i) => i !== index));
  };

  const addAsset = () => {
    setAssets([...assets, { type: '', value: 0, description: '' }]);
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: HomeLoanSurveyData) => {
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const surveyData = {
        user_id: userData.user.id,
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth,
        phone_number: data.phoneNumber,
        email: data.email,
        marital_status: data.maritalStatus,
        number_of_dependents: data.numberOfDependents,
        employment_status: data.employmentStatus,
        employer_name: data.employerName,
        job_title: data.jobTitle,
        work_experience_years: data.workExperienceYears,
        monthly_salary: data.monthlySalary,
        other_income_sources: incomeSource,
        total_monthly_income: calculatedTotalIncome,
        property_type: data.propertyType,
        property_location: data.propertyLocation,
        property_value: data.propertyValue,
        down_payment_amount: data.downPaymentAmount,
        loan_amount_needed: data.loanAmountNeeded,
        loan_term_years: data.loanTermYears,
        existing_loans: loans,
        monthly_expenses: data.monthlyExpenses,
        savings_amount: data.savingsAmount,
        other_assets: assets,
        preferred_banks: selectedBanks,
        interest_rate_preference: data.interestRatePreference,
        payment_schedule_preference: data.paymentSchedulePreference,
        loan_purpose: data.loanPurpose,
        previous_property_ownership: data.previousPropertyOwnership,
        credit_history_issues: data.creditHistoryIssues,
        credit_history_details: data.creditHistoryDetails,
        estimated_credit_score: estimatedCreditScore,
        survey_completed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('home_loan_survey_responses')
        .insert(surveyData as any);

      if (error) throw error;

      toast({
        title: "Khảo sát hoàn thành",
        description: "Cảm ơn bạn đã hoàn thành khảo sát vay mua nhà. Chúng tôi sẽ liên hệ sớm với đề xuất phù hợp.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-primary mr-2" />
                <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
              </div>
              <p className="text-muted-foreground">Vui lòng cung cấp thông tin cơ bản của bạn</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                  placeholder="Nhập họ và tên đầy đủ"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth', { required: 'Vui lòng nhập ngày sinh' })}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                <Input
                  id="phoneNumber"
                  {...register('phoneNumber', { required: 'Vui lòng nhập số điện thoại' })}
                  placeholder="0123456789"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tình trạng hôn nhân</Label>
                <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Độc thân</SelectItem>
                    <SelectItem value="married">Đã kết hôn</SelectItem>
                    <SelectItem value="divorced">Đã ly hôn</SelectItem>
                    <SelectItem value="widowed">Góa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="numberOfDependents">Số người phụ thuộc</Label>
                <Input
                  id="numberOfDependents"
                  type="number"
                  {...register('numberOfDependents', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Thông tin việc làm và thu nhập</h3>
              <p className="text-muted-foreground">Cung cấp thông tin về công việc và thu nhập của bạn</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tình trạng việc làm *</Label>
                <Select onValueChange={(value) => setValue('employmentStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Đang làm việc</SelectItem>
                    <SelectItem value="self-employed">Tự kinh doanh</SelectItem>
                    <SelectItem value="unemployed">Thất nghiệp</SelectItem>
                    <SelectItem value="retired">Đã nghỉ hưu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="workExperienceYears">Số năm kinh nghiệm</Label>
                <Input
                  id="workExperienceYears"
                  type="number"
                  {...register('workExperienceYears', { valueAsNumber: true })}
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employerName">Tên công ty</Label>
                <Input
                  id="employerName"
                  {...register('employerName')}
                  placeholder="Công ty ABC"
                />
              </div>
              
              <div>
                <Label htmlFor="jobTitle">Chức vụ</Label>
                <Input
                  id="jobTitle"
                  {...register('jobTitle')}
                  placeholder="Kế toán trưởng"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="monthlySalary">Lương hàng tháng (VNĐ) *</Label>
              <Input
                id="monthlySalary"
                type="number"
                {...register('monthlySalary', { 
                  required: 'Vui lòng nhập lương hàng tháng',
                  valueAsNumber: true 
                })}
                placeholder="30000000"
              />
              {errors.monthlySalary && (
                <p className="text-sm text-destructive mt-1">{errors.monthlySalary.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Nguồn thu nhập khác</Label>
                <Button type="button" variant="outline" size="sm" onClick={addIncomeSource}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm
                </Button>
              </div>
              
              {incomeSource.map((source, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Nguồn thu nhập"
                    value={source.source}
                    onChange={(e) => {
                      const updated = [...incomeSource];
                      updated[index].source = e.target.value;
                      setIncomeSource(updated);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Số tiền"
                    value={source.amount}
                    onChange={(e) => {
                      const updated = [...incomeSource];
                      updated[index].amount = parseFloat(e.target.value) || 0;
                      setIncomeSource(updated);
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeIncomeSource(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5" />
                <span className="font-medium">Tổng thu nhập hàng tháng</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {calculatedTotalIncome.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary mr-2" />
                <h3 className="text-lg font-semibold">Thông tin bất động sản</h3>
              </div>
              <p className="text-muted-foreground">Chi tiết về bất động sản bạn muốn mua</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Loại bất động sản *</Label>
                <Select onValueChange={(value) => setValue('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại BDS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Chung cư</SelectItem>
                    <SelectItem value="house">Nhà riêng</SelectItem>
                    <SelectItem value="villa">Biệt thự</SelectItem>
                    <SelectItem value="townhouse">Nhà phố</SelectItem>
                    <SelectItem value="land">Đất nền</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="propertyLocation">Địa điểm *</Label>
                <Input
                  id="propertyLocation"
                  {...register('propertyLocation', { required: 'Vui lòng nhập địa điểm' })}
                  placeholder="Quận 1, TP.HCM"
                />
                {errors.propertyLocation && (
                  <p className="text-sm text-destructive mt-1">{errors.propertyLocation.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyValue">Giá trị BDS (VNĐ) *</Label>
                <Input
                  id="propertyValue"
                  type="number"
                  {...register('propertyValue', { 
                    required: 'Vui lòng nhập giá trị BDS',
                    valueAsNumber: true 
                  })}
                  placeholder="3000000000"
                />
                {errors.propertyValue && (
                  <p className="text-sm text-destructive mt-1">{errors.propertyValue.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="downPaymentAmount">Số tiền trả trước (VNĐ) *</Label>
                <Input
                  id="downPaymentAmount"
                  type="number"
                  {...register('downPaymentAmount', { 
                    required: 'Vui lòng nhập số tiền trả trước',
                    valueAsNumber: true 
                  })}
                  placeholder="600000000"
                />
                {errors.downPaymentAmount && (
                  <p className="text-sm text-destructive mt-1">{errors.downPaymentAmount.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanAmountNeeded">Số tiền vay cần (VNĐ) *</Label>
                <Input
                  id="loanAmountNeeded"
                  type="number"
                  {...register('loanAmountNeeded', { 
                    required: 'Vui lòng nhập số tiền vay',
                    valueAsNumber: true 
                  })}
                  placeholder="2400000000"
                />
                {errors.loanAmountNeeded && (
                  <p className="text-sm text-destructive mt-1">{errors.loanAmountNeeded.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="loanTermYears">Thời hạn vay (năm)</Label>
                <Select onValueChange={(value) => setValue('loanTermYears', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời hạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 năm</SelectItem>
                    <SelectItem value="10">10 năm</SelectItem>
                    <SelectItem value="15">15 năm</SelectItem>
                    <SelectItem value="20">20 năm</SelectItem>
                    <SelectItem value="25">25 năm</SelectItem>
                    <SelectItem value="30">30 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Mục đích vay</Label>
              <Select onValueChange={(value) => setValue('loanPurpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mục đích" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary_residence">Mua nhà ở</SelectItem>
                  <SelectItem value="investment">Đầu tư</SelectItem>
                  <SelectItem value="second_home">Nhà thứ hai</SelectItem>
                  <SelectItem value="refinance">Tái cấu trúc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Tỷ lệ Loan-to-Value (LTV)</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {loanToValueRatio.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {loanToValueRatio > 80 ? 'LTV cao - có thể cần bảo hiểm' : 'LTV tốt'}
              </p>
            </div>
          </div>
        );

      // Additional steps for financial info, preferences, etc.
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Thông tin tài chính</h3>
              <p className="text-muted-foreground">Chi tiết về khoản vay và tài sản hiện có</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Khoản vay hiện có</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLoan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm khoản vay
                </Button>
              </div>
              
              {loans.map((loan, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Loại vay</Label>
                        <Input
                          placeholder="Vay tiêu dùng"
                          value={loan.type}
                          onChange={(e) => {
                            const updated = [...loans];
                            updated[index].type = e.target.value;
                            setLoans(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Số tiền</Label>
                        <Input
                          type="number"
                          placeholder="100000000"
                          value={loan.amount}
                          onChange={(e) => {
                            const updated = [...loans];
                            updated[index].amount = parseFloat(e.target.value) || 0;
                            setLoans(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Trả hàng tháng</Label>
                        <Input
                          type="number"
                          placeholder="5000000"
                          value={loan.monthlyPayment}
                          onChange={(e) => {
                            const updated = [...loans];
                            updated[index].monthlyPayment = parseFloat(e.target.value) || 0;
                            setLoans(updated);
                          }}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button type="button" variant="outline" size="sm" onClick={() => removeLoan(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyExpenses">Chi phí hàng tháng (VNĐ)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  {...register('monthlyExpenses', { valueAsNumber: true })}
                  placeholder="20000000"
                />
              </div>
              
              <div>
                <Label htmlFor="savingsAmount">Số tiền tiết kiệm (VNĐ)</Label>
                <Input
                  id="savingsAmount"
                  type="number"
                  {...register('savingsAmount', { valueAsNumber: true })}
                  placeholder="500000000"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Tài sản khác</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAsset}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm tài sản
                </Button>
              </div>
              
              {assets.map((asset, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Loại tài sản"
                    value={asset.type}
                    onChange={(e) => {
                      const updated = [...assets];
                      updated[index].type = e.target.value;
                      setAssets(updated);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Giá trị"
                    value={asset.value}
                    onChange={(e) => {
                      const updated = [...assets];
                      updated[index].value = parseFloat(e.target.value) || 0;
                      setAssets(updated);
                    }}
                  />
                  <Input
                    placeholder="Mô tả"
                    value={asset.description}
                    onChange={(e) => {
                      const updated = [...assets];
                      updated[index].description = e.target.value;
                      setAssets(updated);
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeAsset(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Sở thích và yêu cầu</h3>
              <p className="text-muted-foreground">Thông tin về ngân hàng và điều kiện vay ưa thích</p>
            </div>

            <div>
              <Label className="mb-4 block">Ngân hàng ưa thích</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Vietcombank', 'BIDV', 'VietinBank', 'Techcombank', 'MB Bank', 'ACB', 'Sacombank', 'VPBank'].map((bank) => (
                  <div key={bank} className="flex items-center space-x-2">
                    <Checkbox
                      id={bank}
                      checked={selectedBanks.includes(bank)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBanks([...selectedBanks, bank]);
                        } else {
                          setSelectedBanks(selectedBanks.filter(b => b !== bank));
                        }
                      }}
                    />
                    <Label htmlFor={bank} className="text-sm">{bank}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Loại lãi suất ưa thích</Label>
                <Select onValueChange={(value) => setValue('interestRatePreference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại lãi suất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Lãi suất cố định</SelectItem>
                    <SelectItem value="variable">Lãi suất thả nổi</SelectItem>
                    <SelectItem value="mixed">Hỗn hợp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Lịch trả nợ</Label>
                <Select onValueChange={(value) => setValue('paymentSchedulePreference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lịch trả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                    <SelectItem value="quarterly">Hàng quý</SelectItem>
                    <SelectItem value="semi-annual">6 tháng/lần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previousPropertyOwnership"
                  {...register('previousPropertyOwnership')}
                />
                <Label htmlFor="previousPropertyOwnership">Đã từng sở hữu bất động sản</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="creditHistoryIssues"
                  {...register('creditHistoryIssues')}
                />
                <Label htmlFor="creditHistoryIssues">Có vấn đề về lịch sử tín dụng</Label>
              </div>

              {watchedValues.creditHistoryIssues && (
                <div>
                  <Label htmlFor="creditHistoryDetails">Chi tiết vấn đề tín dụng</Label>
                  <Textarea
                    id="creditHistoryDetails"
                    {...register('creditHistoryDetails')}
                    placeholder="Mô tả chi tiết vấn đề tín dụng..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Tóm tắt và xác nhận</h3>
              <p className="text-muted-foreground">Xem lại thông tin trước khi gửi</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Thông tin tài chính
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Thu nhập hàng tháng:</span>
                      <span className="font-medium">{calculatedTotalIncome.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giá trị BDS:</span>
                      <span className="font-medium">{(watchedValues.propertyValue || 0).toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số tiền vay:</span>
                      <span className="font-medium">{(watchedValues.loanAmountNeeded || 0).toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tỷ lệ LTV:</span>
                      <span className="font-medium">{loanToValueRatio.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Điểm tín dụng ước tính</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {estimatedCreditScore}
                    </div>
                    <Badge variant={estimatedCreditScore >= 700 ? "default" : estimatedCreditScore >= 600 ? "secondary" : "destructive"}>
                      {estimatedCreditScore >= 700 ? "Tốt" : estimatedCreditScore >= 600 ? "Khá" : "Cần cải thiện"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Điểm này chỉ mang tính chất tham khảo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Bằng cách gửi biểu mẫu này, bạn đồng ý cho phép chúng tôi liên hệ với các đề xuất vay mua nhà phù hợp.
                  </p>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Hoàn thành khảo sát'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Home className="h-8 w-8 text-primary mr-3" />
              <CardTitle className="text-2xl">Khảo sát vay mua nhà</CardTitle>
            </div>
            <div className="space-y-4">
              <Progress value={progressPercent} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Bước {currentStep} / {totalSteps}
              </p>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {renderStep()}
            </CardContent>

            <div className="flex justify-between p-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Tiếp theo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : null}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default HomeLoanSurveyForm;