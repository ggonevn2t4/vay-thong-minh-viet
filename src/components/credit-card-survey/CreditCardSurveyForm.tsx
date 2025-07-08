import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calculator, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreditCard {
  bank: string;
  limit: number;
  currentBalance: number;
  monthlyPayment: number;
}

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

interface SurveyData {
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
  
  // Financial Information
  existingCreditCards: CreditCard[];
  existingLoans: Loan[];
  monthlyExpenses: number;
  savingsAmount: number;
  
  // Credit Card Preferences
  desiredCreditLimit: number;
  primaryCardUsage: string;
  preferredBenefits: string[];
  annualFeePreference: string;
  
  // Additional Information
  previousBankRelationships: string;
  creditHistoryIssues: boolean;
  creditHistoryDetails: string;
}

const CreditCardSurveyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SurveyData>();

  const totalSteps = 5;
  const progressPercent = (currentStep / totalSteps) * 100;

  // Watch form values for calculations
  const watchedValues = watch();
  const [calculatedTotalIncome, setCalculatedTotalIncome] = useState(0);
  const [estimatedCreditScore, setEstimatedCreditScore] = useState(0);

  // Dynamic form arrays
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [incomeSource, setIncomeSource] = useState<IncomeSource[]>([]);

  // Calculate total income
  useEffect(() => {
    const salary = watchedValues.monthlySalary || 0;
    const otherIncome = incomeSource.reduce((sum, source) => sum + (source.amount || 0), 0);
    setCalculatedTotalIncome(salary + otherIncome);
  }, [watchedValues.monthlySalary, incomeSource]);

  // Calculate estimated credit score
  useEffect(() => {
    const totalIncome = calculatedTotalIncome;
    const totalDebt = creditCards.reduce((sum, card) => sum + (card.currentBalance || 0), 0) +
                     loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
    const expenses = watchedValues.monthlyExpenses || 0;
    const savings = watchedValues.savingsAmount || 0;
    
    let score = 650; // Base score
    
    if (totalIncome > 50000000) score += 50; // High income
    if (totalDebt / totalIncome < 0.3) score += 50; // Low debt ratio
    if (savings > 100000000) score += 30; // Good savings
    if (watchedValues.workExperienceYears > 5) score += 20; // Stable employment
    if (watchedValues.creditHistoryIssues) score -= 100; // Credit issues
    
    setEstimatedCreditScore(Math.min(Math.max(score, 300), 850));
  }, [calculatedTotalIncome, creditCards, loans, watchedValues]);

  const addCreditCard = () => {
    setCreditCards([...creditCards, { bank: '', limit: 0, currentBalance: 0, monthlyPayment: 0 }]);
  };

  const removeCreditCard = (index: number) => {
    setCreditCards(creditCards.filter((_, i) => i !== index));
  };

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

  const onSubmit = async (data: SurveyData) => {
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
        existing_credit_cards: creditCards,
        existing_loans: loans,
        monthly_expenses: data.monthlyExpenses,
        savings_amount: data.savingsAmount,
        desired_credit_limit: data.desiredCreditLimit,
        primary_card_usage: data.primaryCardUsage,
        preferred_benefits: data.preferredBenefits,
        annual_fee_preference: data.annualFeePreference,
        previous_bank_relationships: data.previousBankRelationships,
        credit_history_issues: data.creditHistoryIssues,
        credit_history_details: data.creditHistoryDetails,
        estimated_credit_score: estimatedCreditScore,
        survey_completed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('credit_card_survey_responses')
        .insert(surveyData as any);

      if (error) throw error;

      toast({
        title: "Khảo sát hoàn thành",
        description: "Cảm ơn bạn đã hoàn thành khảo sát. Chúng tôi sẽ liên hệ sớm với đề xuất phù hợp.",
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
              <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
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
                  placeholder="Nhân viên kế toán"
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
                placeholder="15000000"
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
              <h3 className="text-lg font-semibold">Thông tin tài chính hiện tại</h3>
              <p className="text-muted-foreground">Chi tiết về thẻ tín dụng và khoản vay hiện có</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Thẻ tín dụng hiện có</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCreditCard}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ
                </Button>
              </div>
              
              {creditCards.map((card, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Ngân hàng</Label>
                        <Input
                          placeholder="Vietcombank"
                          value={card.bank}
                          onChange={(e) => {
                            const updated = [...creditCards];
                            updated[index].bank = e.target.value;
                            setCreditCards(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Hạn mức</Label>
                        <Input
                          type="number"
                          placeholder="50000000"
                          value={card.limit}
                          onChange={(e) => {
                            const updated = [...creditCards];
                            updated[index].limit = parseFloat(e.target.value) || 0;
                            setCreditCards(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Dư nợ hiện tại</Label>
                        <Input
                          type="number"
                          placeholder="10000000"
                          value={card.currentBalance}
                          onChange={(e) => {
                            const updated = [...creditCards];
                            updated[index].currentBalance = parseFloat(e.target.value) || 0;
                            setCreditCards(updated);
                          }}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button type="button" variant="outline" size="sm" onClick={() => removeCreditCard(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Các khoản vay hiện có</Label>
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
                        <Select onValueChange={(value) => {
                          const updated = [...loans];
                          updated[index].type = value;
                          setLoans(updated);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Vay mua nhà</SelectItem>
                            <SelectItem value="car">Vay mua xe</SelectItem>
                            <SelectItem value="personal">Vay cá nhân</SelectItem>
                            <SelectItem value="business">Vay kinh doanh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Số tiền vay</Label>
                        <Input
                          type="number"
                          placeholder="500000000"
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
                <Label htmlFor="monthlyExpenses">Chi tiêu hàng tháng (VNĐ)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  {...register('monthlyExpenses', { valueAsNumber: true })}
                  placeholder="10000000"
                />
              </div>
              
              <div>
                <Label htmlFor="savingsAmount">Số tiền tiết kiệm (VNĐ)</Label>
                <Input
                  id="savingsAmount"
                  type="number"
                  {...register('savingsAmount', { valueAsNumber: true })}
                  placeholder="100000000"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Nhu cầu thẻ tín dụng</h3>
              <p className="text-muted-foreground">Cho chúng tôi biết về nhu cầu thẻ tín dụng của bạn</p>
            </div>

            <div>
              <Label>Hạn mức tín dụng mong muốn: {watchedValues.desiredCreditLimit?.toLocaleString('vi-VN') || '0'} VNĐ</Label>
              <div className="mt-2">
                <Slider
                  value={[watchedValues.desiredCreditLimit || 5000000]}
                  onValueChange={(value) => setValue('desiredCreditLimit', value[0])}
                  max={200000000}
                  min={5000000}
                  step={1000000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>5 triệu</span>
                  <span>200 triệu</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Mục đích sử dụng chính</Label>
              <RadioGroup onValueChange={(value) => setValue('primaryCardUsage', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shopping" id="shopping" />
                  <Label htmlFor="shopping">Mua sắm hàng ngày</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="travel" id="travel" />
                  <Label htmlFor="travel">Du lịch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">Kinh doanh</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emergency" id="emergency" />
                  <Label htmlFor="emergency">Khẩn cấp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cashback" id="cashback" />
                  <Label htmlFor="cashback">Tích điểm/Hoàn tiền</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Ưu đãi mong muốn (có thể chọn nhiều)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'Hoàn tiền mua sắm',
                  'Tích điểm bay',
                  'Miễn phí phòng chờ sân bay', 
                  'Ưu đãi nhà hàng',
                  'Bảo hiểm du lịch',
                  'Miễn phí rút tiền ATM',
                  'Lãi suất 0% trả góp',
                  'Quà tặng chào mừng'
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Checkbox
                      id={benefit}
                      onCheckedChange={(checked) => {
                        const current = watchedValues.preferredBenefits || [];
                        if (checked) {
                          setValue('preferredBenefits', [...current, benefit]);
                        } else {
                          setValue('preferredBenefits', current.filter(b => b !== benefit));
                        }
                      }}
                    />
                    <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Phí thường niên</Label>
              <RadioGroup onValueChange={(value) => setValue('annualFeePreference', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-fee" id="no-fee" />
                  <Label htmlFor="no-fee">Miễn phí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low-fee" id="low-fee" />
                  <Label htmlFor="low-fee">Phí thấp (dưới 1 triệu/năm)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium-fee" id="medium-fee" />
                  <Label htmlFor="medium-fee">Phí trung bình (1-3 triệu/năm)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high-fee" id="high-fee" />
                  <Label htmlFor="high-fee">Không quan tâm phí nếu ưu đãi tốt</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Thông tin bổ sung và xem lại</h3>
              <p className="text-muted-foreground">Kiểm tra lại thông tin và hoàn thành khảo sát</p>
            </div>

            <div>
              <Label htmlFor="previousBankRelationships">Mối quan hệ với ngân hàng</Label>
              <Textarea
                id="previousBankRelationships"
                {...register('previousBankRelationships')}
                placeholder="Bạn đã từng sử dụng dịch vụ của ngân hàng nào? Trải nghiệm như thế nào?"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="creditHistoryIssues"
                  onCheckedChange={(checked) => setValue('creditHistoryIssues', !!checked)}
                />
                <Label htmlFor="creditHistoryIssues">Tôi đã từng có vấn đề về tín dụng</Label>
              </div>
              
              {watchedValues.creditHistoryIssues && (
                <Textarea
                  {...register('creditHistoryDetails')}
                  placeholder="Vui lòng mô tả chi tiết về vấn đề tín dụng (trễ hạn thanh toán, nợ xấu, v.v.)"
                  rows={3}
                />
              )}
            </div>

            {/* Credit Score Estimation */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">Điểm tín dụng ước tính</span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {estimatedCreditScore}
                  </div>
                  <Badge variant={estimatedCreditScore >= 700 ? "default" : estimatedCreditScore >= 600 ? "secondary" : "destructive"}>
                    {estimatedCreditScore >= 700 ? "Tốt" : estimatedCreditScore >= 600 ? "Khá" : "Cần cải thiện"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Dựa trên thông tin bạn cung cấp
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt thông tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Họ tên:</span>
                    <p>{watchedValues.fullName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Thu nhập tháng:</span>
                    <p>{calculatedTotalIncome.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <span className="font-medium">Hạn mức mong muốn:</span>
                    <p>{(watchedValues.desiredCreditLimit || 0).toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <span className="font-medium">Số thẻ hiện có:</span>
                    <p>{creditCards.length} thẻ</p>
                  </div>
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
    <div className="py-8 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Khảo sát thẻ tín dụng
              </CardTitle>
              <div className="space-y-4">
                <Progress value={progressPercent} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  Bước {currentStep} / {totalSteps}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                {renderStep()}
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Quay lại
                  </Button>
                  
                  {currentStep === totalSteps ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Hoàn thành khảo sát'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                    >
                      Tiếp theo
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreditCardSurveyForm;