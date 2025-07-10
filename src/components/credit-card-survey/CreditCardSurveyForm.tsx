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
import { ChevronLeft, ChevronRight, Plus, Trash2, Calculator, CreditCard, AlertTriangle } from 'lucide-react';
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
  businessIncome: number;
  rentalIncome: number;
  otherIncome: number;
  
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
  const [desiredCreditLimit, setDesiredCreditLimit] = useState([100000000]); // Default 100 million VNĐ

  // Dynamic form arrays
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  // Calculate total income
  useEffect(() => {
    const salary = watchedValues.monthlySalary || 0;
    const business = watchedValues.businessIncome || 0;
    const rental = watchedValues.rentalIncome || 0;
    const other = watchedValues.otherIncome || 0;
    const total = salary + business + rental + other;
    setCalculatedTotalIncome(total);
    setValue('totalMonthlyIncome' as any, total);
  }, [watchedValues.monthlySalary, watchedValues.businessIncome, watchedValues.rentalIncome, watchedValues.otherIncome, setValue]);

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
        other_income_sources: [
          { source: 'business', amount: data.businessIncome || 0 },
          { source: 'rental', amount: data.rentalIncome || 0 },
          { source: 'other', amount: data.otherIncome || 0 }
        ],
        total_monthly_income: calculatedTotalIncome,
        existing_credit_cards: creditCards,
        existing_loans: loans,
        monthly_expenses: data.monthlyExpenses,
        savings_amount: data.savingsAmount,
        desired_credit_limit: desiredCreditLimit[0],
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
              <h3 className="text-lg font-semibold">1. Thông Tin Cá Nhân Bổ Sung</h3>
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
                <Label>Tình trạng hôn nhân *</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Quốc tịch *</Label>
                <Select defaultValue="vietnam">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vietnam">Việt Nam</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tiền tệ ưa chuộng khi chi tiêu *</Label>
                <Select defaultValue="vnd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vnd">Việt Nam Đồng</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">2. Thông Tin Nghề Nghiệp</h3>
              <p className="text-muted-foreground">Cung cấp thông tin về công việc và thu nhập của bạn</p>
            </div>
            
            <div>
              <Label>Tình trạng nghề nghiệp chính *</Label>
              <Select onValueChange={(value) => setValue('employmentStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaried">Nhân viên lương</SelectItem>
                  <SelectItem value="self-employed">Tự kinh doanh</SelectItem>
                  <SelectItem value="rental">Thu nhập từ cho thuê</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic sections based on employment type */}
            {watchedValues.employmentStatus === 'salaried' && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium mb-4">Thông tin nhân viên lương</h4>
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
              </Card>
            )}

            {watchedValues.employmentStatus === 'self-employed' && (
              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-medium mb-4">Thông tin tự kinh doanh</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Tên doanh nghiệp</Label>
                    <Input
                      id="businessName"
                      placeholder="Cửa hàng XYZ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Loại hình kinh doanh</Label>
                    <Input
                      id="businessType"
                      placeholder="Bán lẻ, Dịch vụ..."
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">3. Thông Tin Tài Chính</h3>
              <p className="text-muted-foreground">Chi tiết về thu nhập và tình hình tài chính</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlySalary">Thu nhập từ lương (VNĐ)</Label>
                <Input
                  id="monthlySalary"
                  type="number"
                  {...register('monthlySalary', { valueAsNumber: true })}
                  placeholder="15,000,000"
                />
              </div>
              
              <div>
                <Label htmlFor="businessIncome">Thu nhập từ kinh doanh (VNĐ)</Label>
                <Input
                  id="businessIncome"
                  type="number"
                  {...register('businessIncome', { valueAsNumber: true })}
                  placeholder="10,000,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rentalIncome">Thu nhập từ cho thuê (VNĐ)</Label>
                <Input
                  id="rentalIncome"
                  type="number"
                  {...register('rentalIncome', { valueAsNumber: true })}
                  placeholder="5,000,000"
                />
              </div>
              
              <div>
                <Label htmlFor="otherIncome">Thu nhập khác (VNĐ)</Label>
                <Input
                  id="otherIncome"
                  type="number"
                  {...register('otherIncome', { valueAsNumber: true })}
                  placeholder="2,000,000"
                />
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-medium">Tổng thu nhập góp hàng tháng (VNĐ):</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {calculatedTotalIncome.toLocaleString('vi-VN')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyExpenses">Chi phí hàng tháng (VNĐ)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  {...register('monthlyExpenses', { valueAsNumber: true })}
                  placeholder="8,000,000"
                />
              </div>
              
              <div>
                <Label htmlFor="savingsAmount">Số tiền tiết kiệm (VNĐ)</Label>
                <Input
                  id="savingsAmount"
                  type="number"
                  {...register('savingsAmount', { valueAsNumber: true })}
                  placeholder="100,000,000"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">4. Thông Tin Tín Dụng</h3>
              <p className="text-muted-foreground">Thông tin về thẻ tín dụng và khoản vay hiện có</p>
            </div>

            <div>
              <Label>Hiện tại bạn đang sử dụng thẻ tín dụng? *</Label>
              <RadioGroup 
                onValueChange={(value) => {
                  if (value === 'no') {
                    setCreditCards([]);
                  }
                }}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-credit-card" />
                  <Label htmlFor="has-credit-card">Có</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-credit-card" />
                  <Label htmlFor="no-credit-card">Không</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Thẻ tín dụng hiện có</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCreditCard}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ
                </Button>
              </div>
              
              {creditCards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có thẻ tín dụng nào</p>
                </div>
              ) : (
                creditCards.map((card, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Ngân hàng</Label>
                          <Select
                            onValueChange={(value) => {
                              const updated = [...creditCards];
                              updated[index].bank = value;
                              setCreditCards(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ngân hàng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vietcombank">Vietcombank</SelectItem>
                              <SelectItem value="techcombank">Techcombank</SelectItem>
                              <SelectItem value="bidv">BIDV</SelectItem>
                              <SelectItem value="vietinbank">VietinBank</SelectItem>
                              <SelectItem value="acb">ACB</SelectItem>
                              <SelectItem value="mb">MB Bank</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Hạn mức (VNĐ)</Label>
                          <Input
                            type="number"
                            placeholder="50,000,000"
                            value={card.limit || ''}
                            onChange={(e) => {
                              const updated = [...creditCards];
                              updated[index].limit = parseFloat(e.target.value) || 0;
                              setCreditCards(updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Dư nợ hiện tại (VNĐ)</Label>
                          <Input
                            type="number"
                            placeholder="10,000,000"
                            value={card.currentBalance || ''}
                            onChange={(e) => {
                              const updated = [...creditCards];
                              updated[index].currentBalance = parseFloat(e.target.value) || 0;
                              setCreditCards(updated);
                            }}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeCreditCard(index)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div>
              <Label>Hiện tại bạn đang có vay cá nhân tại ngân hàng/công ty tài chính? *</Label>
              <RadioGroup 
                onValueChange={(value) => {
                  if (value === 'no') {
                    setLoans([]);
                  }
                }}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="has-loan" />
                  <Label htmlFor="has-loan">Có</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-loan" />
                  <Label htmlFor="no-loan">Không</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Khoản vay hiện có</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLoan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm khoản vay
                </Button>
              </div>
              
              {loans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có khoản vay nào</p>
                </div>
              ) : (
                loans.map((loan, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Loại vay</Label>
                          <Select
                            onValueChange={(value) => {
                              const updated = [...loans];
                              updated[index].type = value;
                              setLoans(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại vay" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="personal">Vay cá nhân</SelectItem>
                              <SelectItem value="home">Vay mua nhà</SelectItem>
                              <SelectItem value="car">Vay mua xe</SelectItem>
                              <SelectItem value="business">Vay kinh doanh</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Số tiền vay (VNĐ)</Label>
                          <Input
                            type="number"
                            placeholder="500,000,000"
                            value={loan.amount || ''}
                            onChange={(e) => {
                              const updated = [...loans];
                              updated[index].amount = parseFloat(e.target.value) || 0;
                              setLoans(updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Trả hàng tháng (VNĐ)</Label>
                          <Input
                            type="number"
                            placeholder="15,000,000"
                            value={loan.monthlyPayment || ''}
                            onChange={(e) => {
                              const updated = [...loans];
                              updated[index].monthlyPayment = parseFloat(e.target.value) || 0;
                              setLoans(updated);
                            }}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeLoan(index)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">5. Yêu Cầu Về Thẻ Tín Dụng</h3>
              <p className="text-muted-foreground">Thông tin về nhu cầu thẻ tín dụng của bạn</p>
            </div>

            <div>
              <Label className="text-base font-medium">Hạn mức thẻ tín dụng mong muốn (VNĐ) *</Label>
              <div className="mt-4 space-y-4">
                <div className="px-4 py-2 bg-muted rounded-lg text-center">
                  <span className="text-2xl font-bold text-primary">
                    {desiredCreditLimit[0].toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <Slider
                  value={desiredCreditLimit}
                  onValueChange={(value) => {
                    setDesiredCreditLimit(value);
                    setValue('desiredCreditLimit', value[0]);
                  }}
                  min={5000000}
                  max={500000000}
                  step={5000000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5 triệu</span>
                  <span>500 triệu</span>
                </div>
                {desiredCreditLimit[0] > 500000000 && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">
                      Hạn mức vượt quá 500 triệu VNĐ có thể khó được phê duyệt
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Mục đích sử dụng thẻ chính</Label>
              <Select onValueChange={(value) => setValue('primaryCardUsage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mục đích" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Chi tiêu hàng ngày</SelectItem>
                  <SelectItem value="shopping">Mua sắm</SelectItem>
                  <SelectItem value="travel">Du lịch</SelectItem>
                  <SelectItem value="business">Kinh doanh</SelectItem>
                  <SelectItem value="emergency">Khẩn cấp</SelectItem>
                  <SelectItem value="online">Thanh toán online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ưu đãi mong muốn (chọn nhiều)</Label>
              <div className="mt-2 space-y-2">
                {[
                  { id: 'cashback', label: 'Hoàn tiền' },
                  { id: 'points', label: 'Tích điểm' },
                  { id: 'discount', label: 'Giảm giá mua sắm' },
                  { id: 'travel', label: 'Ưu đãi du lịch' },
                  { id: 'dining', label: 'Ưu đãi ăn uống' },
                  { id: 'fuel', label: 'Ưu đãi xăng dầu' },
                  { id: 'airport', label: 'Phòng chờ sân bay' },
                  { id: 'insurance', label: 'Bảo hiểm' },
                ].map((benefit) => (
                  <div key={benefit.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={benefit.id}
                      onCheckedChange={(checked) => {
                        const currentBenefits = watchedValues.preferredBenefits || [];
                        if (checked) {
                          setValue('preferredBenefits', [...currentBenefits, benefit.id]);
                        } else {
                          setValue('preferredBenefits', currentBenefits.filter(b => b !== benefit.id));
                        }
                      }}
                    />
                    <Label htmlFor={benefit.id}>{benefit.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Phí thường niên</Label>
              <Select onValueChange={(value) => setValue('annualFeePreference', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức phí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Miễn phí</SelectItem>
                  <SelectItem value="low">Dưới 500,000 VNĐ</SelectItem>
                  <SelectItem value="medium">500,000 - 1,000,000 VNĐ</SelectItem>
                  <SelectItem value="high">Trên 1,000,000 VNĐ</SelectItem>
                  <SelectItem value="flexible">Linh hoạt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="creditHistoryIssues">Bạn có từng gặp vấn đề về tín dụng không?</Label>
              <RadioGroup 
                onValueChange={(value) => setValue('creditHistoryIssues', value === 'yes')}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="credit-issues-yes" />
                  <Label htmlFor="credit-issues-yes">Có</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="credit-issues-no" />
                  <Label htmlFor="credit-issues-no">Không</Label>
                </div>
              </RadioGroup>
            </div>

            {watchedValues.creditHistoryIssues && (
              <div>
                <Label htmlFor="creditHistoryDetails">Chi tiết vấn đề tín dụng</Label>
                <Textarea
                  id="creditHistoryDetails"
                  {...register('creditHistoryDetails')}
                  placeholder="Mô tả chi tiết về vấn đề tín dụng đã gặp..."
                  rows={3}
                />
              </div>
            )}

            <div>
              <Label htmlFor="previousBankRelationships">Ghi chú thêm</Label>
              <Textarea
                id="previousBankRelationships"
                {...register('previousBankRelationships')}
                placeholder="Thông tin bổ sung khác (tùy chọn)..."
                rows={4}
              />
            </div>

            {/* Credit Score Estimation */}
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="text-center">
                <h4 className="font-medium mb-2">Điểm tín dụng ước tính</h4>
                <div className="text-3xl font-bold text-primary mb-2">
                  {estimatedCreditScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  Dựa trên thông tin bạn cung cấp
                </div>
                <Progress 
                  value={(estimatedCreditScore - 300) / 5.5} 
                  className="mt-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>300</span>
                  <span>850</span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Bảng Khảo Sát Thông Tin Khách Hàng</h1>
        <p className="text-muted-foreground">Thông Tin Thẻ Tín Dụng</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Bước {currentStep} / {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}% hoàn thành</span>
        </div>
        <Progress value={progressPercent} className="w-full" />
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Tiếp tục
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Khảo Sát'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditCardSurveyForm;