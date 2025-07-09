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
import { ChevronLeft, ChevronRight, Plus, Trash2, Calculator, Car, Shield } from 'lucide-react';
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

interface CarLoanSurveyData {
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
  
  // Car Information
  carType: string;
  carBrand: string;
  carModel: string;
  carValue: number;
  downPaymentAmount: number;
  loanAmountNeeded: number;
  loanTermYears: number;
  
  // Financial Information
  existingLoans: Loan[];
  monthlyExpenses: number;
  savingsAmount: number;
  currentVehicleInfo: any;
  
  // Preferences
  preferredBanks: string[];
  interestRatePreference: string;
  paymentSchedulePreference: string;
  insuranceRequirement: string;
  
  // Additional Information
  drivingExperienceYears: number;
  previousCarLoans: boolean;
  creditHistoryIssues: boolean;
  creditHistoryDetails: string;
}

const CarLoanSurveyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CarLoanSurveyData>();

  const totalSteps = 5;
  const progressPercent = (currentStep / totalSteps) * 100;

  // Watch form values for calculations
  const watchedValues = watch();
  const [calculatedTotalIncome, setCalculatedTotalIncome] = useState(0);
  const [estimatedCreditScore, setEstimatedCreditScore] = useState(0);
  const [loanToValueRatio, setLoanToValueRatio] = useState(0);

  // Dynamic form arrays
  const [loans, setLoans] = useState<Loan[]>([]);
  const [incomeSource, setIncomeSource] = useState<IncomeSource[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);

  // Calculate total income
  useEffect(() => {
    const salary = watchedValues.monthlySalary || 0;
    const otherIncome = incomeSource.reduce((sum, source) => sum + (source.amount || 0), 0);
    setCalculatedTotalIncome(salary + otherIncome);
  }, [watchedValues.monthlySalary, incomeSource]);

  // Calculate loan to value ratio
  useEffect(() => {
    const carValue = watchedValues.carValue || 0;
    const loanAmount = watchedValues.loanAmountNeeded || 0;
    if (carValue > 0) {
      setLoanToValueRatio((loanAmount / carValue) * 100);
    }
  }, [watchedValues.carValue, watchedValues.loanAmountNeeded]);

  // Calculate estimated credit score
  useEffect(() => {
    const totalIncome = calculatedTotalIncome;
    const totalDebt = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
    const savings = watchedValues.savingsAmount || 0;
    
    let score = 650; // Base score
    
    if (totalIncome > 30000000) score += 50; // Good income for car loan
    if (totalDebt / totalIncome < 0.4) score += 50; // Low debt ratio
    if (savings > 100000000) score += 30; // Good savings
    if (watchedValues.workExperienceYears > 3) score += 20; // Stable employment
    if (watchedValues.drivingExperienceYears > 5) score += 15; // Experienced driver
    if (loanToValueRatio < 80) score += 25; // Good LTV ratio
    if (watchedValues.creditHistoryIssues) score -= 100; // Credit issues
    if (watchedValues.previousCarLoans) score += 10; // Previous experience
    
    setEstimatedCreditScore(Math.min(Math.max(score, 300), 850));
  }, [calculatedTotalIncome, loans, watchedValues, loanToValueRatio]);

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

  const onSubmit = async (data: CarLoanSurveyData) => {
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
        car_type: data.carType,
        car_brand: data.carBrand,
        car_model: data.carModel,
        car_value: data.carValue,
        down_payment_amount: data.downPaymentAmount,
        loan_amount_needed: data.loanAmountNeeded,
        loan_term_years: data.loanTermYears,
        existing_loans: loans,
        monthly_expenses: data.monthlyExpenses,
        savings_amount: data.savingsAmount,
        preferred_banks: selectedBanks,
        interest_rate_preference: data.interestRatePreference,
        payment_schedule_preference: data.paymentSchedulePreference,
        insurance_requirement: data.insuranceRequirement,
        driving_experience_years: data.drivingExperienceYears,
        previous_car_loans: data.previousCarLoans,
        credit_history_issues: data.creditHistoryIssues,
        credit_history_details: data.creditHistoryDetails,
        estimated_credit_score: estimatedCreditScore,
        survey_completed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('car_loan_survey_responses')
        .insert(surveyData as any);

      if (error) throw error;

      toast({
        title: "Khảo sát hoàn thành",
        description: "Cảm ơn bạn đã hoàn thành khảo sát vay ô tô. Chúng tôi sẽ liên hệ sớm với đề xuất phù hợp.",
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
                <Car className="h-8 w-8 text-primary mr-2" />
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

            <div>
              <Label htmlFor="drivingExperienceYears">Số năm kinh nghiệm lái xe *</Label>
              <Input
                id="drivingExperienceYears"
                type="number"
                {...register('drivingExperienceYears', { 
                  required: 'Vui lòng nhập số năm lái xe',
                  valueAsNumber: true 
                })}
                placeholder="5"
                min="0"
              />
              {errors.drivingExperienceYears && (
                <p className="text-sm text-destructive mt-1">{errors.drivingExperienceYears.message}</p>
              )}
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
                    <SelectItem value="student">Sinh viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="workExperienceYears">Số năm kinh nghiệm</Label>
                <Input
                  id="workExperienceYears"
                  type="number"
                  {...register('workExperienceYears', { valueAsNumber: true })}
                  placeholder="3"
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
                  placeholder="Nhân viên kinh doanh"
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
                placeholder="20000000"
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
                <Car className="h-8 w-8 text-primary mr-2" />
                <h3 className="text-lg font-semibold">Thông tin xe ô tô</h3>
              </div>
              <p className="text-muted-foreground">Chi tiết về xe bạn muốn mua</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Loại xe *</Label>
                <Select onValueChange={(value) => setValue('carType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Xe mới</SelectItem>
                    <SelectItem value="used">Xe cũ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="carBrand">Hãng xe *</Label>
                <Select onValueChange={(value) => setValue('carBrand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hãng xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="hyundai">Hyundai</SelectItem>
                    <SelectItem value="kia">Kia</SelectItem>
                    <SelectItem value="mazda">Mazda</SelectItem>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="chevrolet">Chevrolet</SelectItem>
                    <SelectItem value="vinfast">VinFast</SelectItem>
                    <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="carModel">Mẫu xe *</Label>
              <Input
                id="carModel"
                {...register('carModel', { required: 'Vui lòng nhập mẫu xe' })}
                placeholder="VD: Vios, City, Accent..."
              />
              {errors.carModel && (
                <p className="text-sm text-destructive mt-1">{errors.carModel.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carValue">Giá trị xe (VNĐ) *</Label>
                <Input
                  id="carValue"
                  type="number"
                  {...register('carValue', { 
                    required: 'Vui lòng nhập giá trị xe',
                    valueAsNumber: true 
                  })}
                  placeholder="800000000"
                />
                {errors.carValue && (
                  <p className="text-sm text-destructive mt-1">{errors.carValue.message}</p>
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
                  placeholder="200000000"
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
                  placeholder="600000000"
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
                    <SelectItem value="1">1 năm</SelectItem>
                    <SelectItem value="2">2 năm</SelectItem>
                    <SelectItem value="3">3 năm</SelectItem>
                    <SelectItem value="4">4 năm</SelectItem>
                    <SelectItem value="5">5 năm</SelectItem>
                    <SelectItem value="6">6 năm</SelectItem>
                    <SelectItem value="7">7 năm</SelectItem>
                    <SelectItem value="8">8 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5" />
                <span className="font-medium">Tỷ lệ Loan-to-Value (LTV)</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {loanToValueRatio.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {loanToValueRatio > 85 ? 'LTV cao - có thể cần thêm điều kiện' : 'LTV tốt'}
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Thông tin tài chính</h3>
              <p className="text-muted-foreground">Chi tiết về khoản vay và sở thích</p>
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
                          placeholder="50000000"
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
                          placeholder="2000000"
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
                  placeholder="15000000"
                />
              </div>
              
              <div>
                <Label htmlFor="savingsAmount">Số tiền tiết kiệm (VNĐ)</Label>
                <Input
                  id="savingsAmount"
                  type="number"
                  {...register('savingsAmount', { valueAsNumber: true })}
                  placeholder="200000000"
                />
              </div>
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
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Yêu cầu bảo hiểm</Label>
                <Select onValueChange={(value) => setValue('insuranceRequirement', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại bảo hiểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Bảo hiểm toàn diện</SelectItem>
                    <SelectItem value="basic">Bảo hiểm cơ bản</SelectItem>
                    <SelectItem value="none">Không yêu cầu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previousCarLoans"
                  {...register('previousCarLoans')}
                />
                <Label htmlFor="previousCarLoans">Đã từng vay mua xe</Label>
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

      case 5:
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
                    <Car className="h-5 w-5" />
                    Thông tin xe và vay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hãng xe:</span>
                      <span className="font-medium">{watchedValues.carBrand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mẫu xe:</span>
                      <span className="font-medium">{watchedValues.carModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giá trị xe:</span>
                      <span className="font-medium">{(watchedValues.carValue || 0).toLocaleString('vi-VN')} VNĐ</span>
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
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Điểm tín dụng ước tính
                  </CardTitle>
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
                    Bằng cách gửi biểu mẫu này, bạn đồng ý cho phép chúng tôi liên hệ với các đề xuất vay ô tô phù hợp.
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Car className="h-8 w-8 text-primary mr-3" />
              <CardTitle className="text-2xl">Khảo sát vay ô tô</CardTitle>
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

export default CarLoanSurveyForm;