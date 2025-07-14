import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreditCard {
  bank: string;
  cardType: string;
  creditLimit: number;
  currentDebt: number;
  monthlyPayment: number;
}

interface PersonalLoan {
  bank: string;
  termType: string;
  loanType: string;
  currentDebt: number;
  monthlyPayment: number;
}

interface SurveyData {
  // Loan Amount
  desiredLoanAmount: number;
  
  // Personal Information
  maritalStatus: string;
  homeOwnership: string;
  nationality: string;
  educationLevel: string;
  dependentsChildren: number;
  dependentsAdults: number;
  
  // Employment Information - Applicant
  employmentType: string;
  // Salary Employee fields
  position?: string;
  industry?: string;
  contractType?: string;
  contractTermMonths?: number;
  contractRemainingMonths?: number;
  currentJobMonths?: number;
  industryExperienceMonths?: number;
  salaryPaymentMethod?: string;
  salaryBanks?: string[];
  // Business Owner fields
  businessType?: string;
  businessIndustry?: string;
  businessOperationMonths?: number;
  // Rental fields
  rentalTypes?: string[];
  rentalOperationMonths?: number;
  
  // Financial Information - Applicant
  salaryIncome: number;
  businessIncome: number;
  rentalIncome: number;
  otherIncome: number;
  totalMonthlyIncome: number;
  
  // Credit Information - Applicant
  hasCreditCard: boolean;
  creditCards: CreditCard[];
  hasPersonalLoan: boolean;
  personalLoans: PersonalLoan[];
  
  // Spouse Information (if married)
  spouseNationality?: string;
  spouseEducationLevel?: string;
  spouseEmploymentType?: string;
  spousePosition?: string;
  spouseIndustry?: string;
  spouseContractType?: string;
  spouseContractTermMonths?: number;
  spouseContractRemainingMonths?: number;
  spouseCurrentJobMonths?: number;
  spouseIndustryExperienceMonths?: number;
  spouseSalaryPaymentMethod?: string;
  spouseSalaryBanks?: string[];
  spouseBusinessType?: string;
  spouseBusinessIndustry?: string;
  spouseBusinessOperationMonths?: number;
  spouseRentalTypes?: string[];
  spouseRentalOperationMonths?: number;
  
  // Spouse Financial Information
  spouseSalaryIncome?: number;
  spouseBusinessIncome?: number;
  spouseRentalIncome?: number;
  spouseOtherIncome?: number;
  spouseTotalMonthlyIncome?: number;
  
  // Spouse Credit Information
  spouseHasCreditCard?: boolean;
  spouseCreditCards?: CreditCard[];
  spouseHasPersonalLoan?: boolean;
  spousePersonalLoans?: PersonalLoan[];
}

const ConsumerCreditLoanSurveyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SurveyData>();

  // Watch form values
  const watchedValues = watch();
  const [desiredLoanAmount, setDesiredLoanAmount] = useState([50000000]); // Default 50 million VNĐ
  
  // Dynamic arrays
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [personalLoans, setPersonalLoans] = useState<PersonalLoan[]>([]);
  const [spouseCreditCards, setSpouseCreditCards] = useState<CreditCard[]>([]);
  const [spousePersonalLoans, setSpousePersonalLoans] = useState<PersonalLoan[]>([]);

  // Financial sliders
  const [salaryIncome, setSalaryIncome] = useState([0]);
  const [businessIncome, setBusinessIncome] = useState([0]);
  const [rentalIncome, setRentalIncome] = useState([0]);
  const [otherIncome, setOtherIncome] = useState([0]);
  
  const [spouseSalaryIncome, setSpouseSalaryIncome] = useState([0]);
  const [spouseBusinessIncome, setSpouseBusinessIncome] = useState([0]);
  const [spouseRentalIncome, setSpouseRentalIncome] = useState([0]);
  const [spouseOtherIncome, setSpouseOtherIncome] = useState([0]);

  // Calculate total incomes
  const totalMonthlyIncome = salaryIncome[0] + businessIncome[0] + rentalIncome[0] + otherIncome[0];
  const spouseTotalMonthlyIncome = spouseSalaryIncome[0] + spouseBusinessIncome[0] + spouseRentalIncome[0] + spouseOtherIncome[0];

  const isMarried = watchedValues.maritalStatus === 'married';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const addCreditCard = (isSpouse = false) => {
    const newCard = { bank: '', cardType: '', creditLimit: 0, currentDebt: 0, monthlyPayment: 0 };
    if (isSpouse) {
      setSpouseCreditCards([...spouseCreditCards, newCard]);
    } else {
      setCreditCards([...creditCards, newCard]);
    }
  };

  const removeCreditCard = (index: number, isSpouse = false) => {
    if (isSpouse) {
      setSpouseCreditCards(spouseCreditCards.filter((_, i) => i !== index));
    } else {
      setCreditCards(creditCards.filter((_, i) => i !== index));
    }
  };

  const addPersonalLoan = (isSpouse = false) => {
    const newLoan = { bank: '', termType: '', loanType: '', currentDebt: 0, monthlyPayment: 0 };
    if (isSpouse) {
      setSpousePersonalLoans([...spousePersonalLoans, newLoan]);
    } else {
      setPersonalLoans([...personalLoans, newLoan]);
    }
  };

  const removePersonalLoan = (index: number, isSpouse = false) => {
    if (isSpouse) {
      setSpousePersonalLoans(spousePersonalLoans.filter((_, i) => i !== index));
    } else {
      setPersonalLoans(personalLoans.filter((_, i) => i !== index));
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
        desired_credit_limit: desiredLoanAmount[0],
        marital_status: data.maritalStatus,
        assets: {
          homeOwnership: data.homeOwnership,
          nationality: data.nationality,
          educationLevel: data.educationLevel,
          dependentsChildren: data.dependentsChildren,
          dependentsAdults: data.dependentsAdults
        },
        employment_status: data.employmentType,
        monthly_salary: salaryIncome[0],
        other_income_sources: [
          { source: 'business', amount: businessIncome[0] },
          { source: 'rental', amount: rentalIncome[0] },
          { source: 'other', amount: otherIncome[0] }
        ],
        total_monthly_income: totalMonthlyIncome,
        existing_credit_cards: creditCards,
        existing_loans: personalLoans,
        survey_completed_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('consumer_credit_loan_survey_responses')
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-2xl font-bold text-primary">
            KHẢO SÁT THÔNG TIN VAY TÍN CHẤP
          </CardTitle>
          <p className="text-muted-foreground">
            Hoàn thiện thông tin để nhận được tư vấn phù hợp nhất
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Loan Amount */}
            <Card className="border border-primary/30">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Số tiền mong muốn vay *</Label>
                  <div className="space-y-2">
                    <Slider
                      value={desiredLoanAmount}
                      onValueChange={setDesiredLoanAmount}
                      max={1000000000}
                      min={5000000}
                      step={5000000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>5 triệu</span>
                      <span className="font-semibold text-primary text-lg">
                        {formatCurrency(desiredLoanAmount[0])}
                      </span>
                      <span>1 tỷ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 1. Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  Thông tin cá nhân bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tình trạng hôn nhân hiện tại *</Label>
                    <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Độc thân</SelectItem>
                        <SelectItem value="married">Đã kết hôn</SelectItem>
                        <SelectItem value="divorced">Đã ly hôn</SelectItem>
                        <SelectItem value="widowed">Góa</SelectItem>
                        <SelectItem value="separated">Ly thân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Tình trạng sở hữu nhà *</Label>
                    <Select onValueChange={(value) => setValue('homeOwnership', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_ownership">Không sở hữu</SelectItem>
                        <SelectItem value="ownership">Có sở hữu</SelectItem>
                        <SelectItem value="ownership_installment">Có sở hữu và đang trả góp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Quốc tích *</Label>
                    <Select onValueChange={(value) => setValue('nationality', value)} defaultValue="vietnam">
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
                    <Label>Trình độ học vấn cao nhất *</Label>
                    <Select onValueChange={(value) => setValue('educationLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="below_secondary">Dưới trung cấp</SelectItem>
                        <SelectItem value="secondary">Trung cấp</SelectItem>
                        <SelectItem value="college">Cao đẳng</SelectItem>
                        <SelectItem value="university">Đại học</SelectItem>
                        <SelectItem value="postgraduate">Sau đại học</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Số người phụ thuộc *</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm">Trẻ em</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register('dependentsChildren', { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Người lớn</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register('dependentsAdults', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tổng: {(watchedValues.dependentsChildren || 0) + (watchedValues.dependentsAdults || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Employment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  Thông tin nghề nghiệp chính
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Loại hình nghề nghiệp chính *</Label>
                  <Select onValueChange={(value) => setValue('employmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Làm công ăn lương</SelectItem>
                      <SelectItem value="business_owner">Tự kinh doanh</SelectItem>
                      <SelectItem value="rental">Cho thuê</SelectItem>
                      <SelectItem value="other">Khác (Hưu trí, Nội trợ, Sinh viên, Lao động tự do)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Employee Section */}
                {watchedValues.employmentType === 'employee' && (
                  <Card className="border border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-medium text-blue-800">A. Thông tin làm công ăn lương</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Vị trí công việc *</Label>
                          <Select onValueChange={(value) => setValue('position', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="senior_manager">Quản lý cấp cao</SelectItem>
                              <SelectItem value="middle_manager">Quản lý cấp trung</SelectItem>
                              <SelectItem value="junior_manager">Quản lý sơ cấp</SelectItem>
                              <SelectItem value="specialist">Chuyên viên</SelectItem>
                              <SelectItem value="worker">Lao động giản đơn</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Ngành nghề *</Label>
                          <Select onValueChange={(value) => setValue('industry', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="it">Công nghệ thông tin</SelectItem>
                              <SelectItem value="construction">Xây dựng</SelectItem>
                              <SelectItem value="trade_service">Thương mại - Dịch vụ</SelectItem>
                              <SelectItem value="education">Giáo dục - Đào tạo</SelectItem>
                              <SelectItem value="healthcare">Y tế</SelectItem>
                              <SelectItem value="agriculture">Nông nghiệp</SelectItem>
                              <SelectItem value="manufacturing">Sản xuất - Công nghiệp</SelectItem>
                              <SelectItem value="finance">Tài chính - Ngân hàng</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Loại hợp đồng lao động *</Label>
                        <Select onValueChange={(value) => setValue('contractType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indefinite">Không xác định thời hạn</SelectItem>
                            <SelectItem value="definite">Có xác định thời hạn</SelectItem>
                            <SelectItem value="seasonal">Thời vụ hoặc Không có HĐLĐ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {watchedValues.contractType === 'definite' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Thời hạn hợp đồng</Label>
                            <Select onValueChange={(value) => setValue('contractTermMonths', parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="12">12 tháng</SelectItem>
                                <SelectItem value="24">24 tháng</SelectItem>
                                <SelectItem value="36">36 tháng</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Thời gian còn lại (tháng)</Label>
                            <Input
                              type="number"
                              min="0"
                              {...register('contractRemainingMonths', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Thời gian công tác tại đơn vị hiện tại (tháng)</Label>
                          <Input
                            type="number"
                            min="0"
                            {...register('currentJobMonths', { valueAsNumber: true })}
                          />
                        </div>
                        <div>
                          <Label>Thời gian công tác trong lĩnh vực hiện tại (tháng)</Label>
                          <Input
                            type="number"
                            min="0"
                            {...register('industryExperienceMonths', { valueAsNumber: true })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Hình thức nhận lương *</Label>
                        <RadioGroup onValueChange={(value) => setValue('salaryPaymentMethod', value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash">Tiền mặt</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="transfer" id="transfer" />
                            <Label htmlFor="transfer">Chuyển khoản</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {watchedValues.salaryPaymentMethod === 'transfer' && (
                        <div>
                          <Label>Ngân hàng nhận lương</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {['Vietcombank', 'Techcombank', 'Vietinbank', 'Sacombank', 'VIB', 'BIDV', 'Agribank', 'VPBank', 'PVcombank', 'HDBank', 'TPBank', 'Khác'].map((bank) => (
                              <div key={bank} className="flex items-center space-x-2">
                                <Checkbox id={bank} />
                                <Label htmlFor={bank} className="text-sm">{bank}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Business Owner Section */}
                {watchedValues.employmentType === 'business_owner' && (
                  <Card className="border border-green-200 bg-green-50/50">
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-medium text-green-800">B. Thông tin tự kinh doanh</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Loại hình kinh doanh *</Label>
                          <Select onValueChange={(value) => setValue('businessType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Cá nhân tự kinh doanh</SelectItem>
                              <SelectItem value="household">Hộ kinh doanh</SelectItem>
                              <SelectItem value="llc">Công ty TNHH</SelectItem>
                              <SelectItem value="jsc">Công ty Cổ phần</SelectItem>
                              <SelectItem value="partnership">Công ty Hợp danh</SelectItem>
                              <SelectItem value="cooperative">Hợp tác xã</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Ngành nghề kinh doanh *</Label>
                          <Select onValueChange={(value) => setValue('businessIndustry', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="it">Công nghệ thông tin</SelectItem>
                              <SelectItem value="construction">Xây dựng</SelectItem>
                              <SelectItem value="trade_service">Thương mại - Dịch vụ</SelectItem>
                              <SelectItem value="education">Giáo dục - Đào tạo</SelectItem>
                              <SelectItem value="healthcare">Y tế</SelectItem>
                              <SelectItem value="agriculture">Nông nghiệp</SelectItem>
                              <SelectItem value="manufacturing">Sản xuất - Công nghiệp</SelectItem>
                              <SelectItem value="finance">Tài chính - Ngân hàng</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Thời gian hoạt động kinh doanh (tháng)</Label>
                        <Slider
                          value={[watchedValues.businessOperationMonths || 0]}
                          onValueChange={(value) => setValue('businessOperationMonths', value[0])}
                          max={240}
                          min={0}
                          step={1}
                          className="w-full mt-2"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>0 tháng</span>
                          <span className="font-medium">{watchedValues.businessOperationMonths || 0} tháng</span>
                          <span>240 tháng</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Rental Section */}
                {watchedValues.employmentType === 'rental' && (
                  <Card className="border border-purple-200 bg-purple-50/50">
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-medium text-purple-800">C. Thông tin cho thuê tài sản</h4>
                      
                      <div>
                        <Label>Loại tài sản cho thuê</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="car_rental" />
                            <Label htmlFor="car_rental">Cho thuê Ô tô</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="property_rental" />
                            <Label htmlFor="property_rental">Cho thuê BĐS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="other_rental" />
                            <Label htmlFor="other_rental">Cho thuê khác</Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Thời gian cho thuê trong lĩnh vực (tháng)</Label>
                        <Slider
                          value={[watchedValues.rentalOperationMonths || 0]}
                          onValueChange={(value) => setValue('rentalOperationMonths', value[0])}
                          max={240}
                          min={0}
                          step={1}
                          className="w-full mt-2"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>0 tháng</span>
                          <span className="font-medium">{watchedValues.rentalOperationMonths || 0} tháng</span>
                          <span>240 tháng</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* 3. Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Thông tin tài chính hàng tháng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Thu nhập từ lương</Label>
                    <Slider
                      value={salaryIncome}
                      onValueChange={setSalaryIncome}
                      max={200000000}
                      min={0}
                      step={1000000}
                      className="w-full mt-2"
                    />
                    <p className="text-sm text-center mt-1">{formatCurrency(salaryIncome[0])}</p>
                  </div>
                  
                  <div>
                    <Label>Thu nhập từ kinh doanh</Label>
                    <Slider
                      value={businessIncome}
                      onValueChange={setBusinessIncome}
                      max={200000000}
                      min={0}
                      step={1000000}
                      className="w-full mt-2"
                    />
                    <p className="text-sm text-center mt-1">{formatCurrency(businessIncome[0])}</p>
                  </div>
                  
                  <div>
                    <Label>Thu nhập từ cho thuê</Label>
                    <Slider
                      value={rentalIncome}
                      onValueChange={setRentalIncome}
                      max={200000000}
                      min={0}
                      step={1000000}
                      className="w-full mt-2"
                    />
                    <p className="text-sm text-center mt-1">{formatCurrency(rentalIncome[0])}</p>
                  </div>
                  
                  <div>
                    <Label>Thu nhập khác</Label>
                    <Slider
                      value={otherIncome}
                      onValueChange={setOtherIncome}
                      max={200000000}
                      min={0}
                      step={1000000}
                      className="w-full mt-2"
                    />
                    <p className="text-sm text-center mt-1">{formatCurrency(otherIncome[0])}</p>
                  </div>
                </div>

                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">TỔNG THU NHẬP GỘP HÀNG THÁNG *:</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(totalMonthlyIncome)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* 4. Credit Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  Thông tin tín dụng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Credit Cards */}
                <div>
                  <Label>Hiện tại bạn có sử dụng thẻ tín dụng không? *</Label>
                  <RadioGroup onValueChange={(value) => setValue('hasCreditCard', value === 'yes')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="has_card_yes" />
                      <Label htmlFor="has_card_yes">Có</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="has_card_no" />
                      <Label htmlFor="has_card_no">Không</Label>
                    </div>
                  </RadioGroup>
                </div>

                {watchedValues.hasCreditCard && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Thông tin thẻ tín dụng</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCreditCard()}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm thẻ
                      </Button>
                    </div>

                    {creditCards.map((card, index) => (
                      <Card key={index} className="border border-orange-200 bg-orange-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Thẻ tín dụng #{index + 1}
                            </h5>
                            {creditCards.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeCreditCard(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Ngân hàng phát hành</Label>
                              <Select 
                                onValueChange={(value) => {
                                  const newCards = [...creditCards];
                                  newCards[index].bank = value;
                                  setCreditCards(newCards);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="vietcombank">Vietcombank</SelectItem>
                                  <SelectItem value="bidv">BIDV</SelectItem>
                                  <SelectItem value="vietinbank">Vietinbank</SelectItem>
                                  <SelectItem value="agribank">Agribank</SelectItem>
                                  <SelectItem value="other_bank">Ngân hàng khác</SelectItem>
                                  <SelectItem value="finance_company">Công ty tài chính khác</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Loại thẻ</Label>
                              <Select 
                                onValueChange={(value) => {
                                  const newCards = [...creditCards];
                                  newCards[index].cardType = value;
                                  setCreditCards(newCards);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="visa">Visa</SelectItem>
                                  <SelectItem value="jcb">JCB</SelectItem>
                                  <SelectItem value="mastercard">Mastercard</SelectItem>
                                  <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Hạn mức tín dụng (VNĐ)</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                onChange={(e) => {
                                  const newCards = [...creditCards];
                                  newCards[index].creditLimit = parseInt(e.target.value) || 0;
                                  setCreditCards(newCards);
                                }}
                              />
                            </div>
                            
                            <div>
                              <Label>Dư nợ hiện tại (VNĐ)</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                onChange={(e) => {
                                  const newCards = [...creditCards];
                                  newCards[index].currentDebt = parseInt(e.target.value) || 0;
                                  setCreditCards(newCards);
                                }}
                              />
                            </div>
                            
                            <div>
                              <Label>Số tiền phải trả hàng tháng (VNĐ) *</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                onChange={(e) => {
                                  const newCards = [...creditCards];
                                  newCards[index].monthlyPayment = parseInt(e.target.value) || 0;
                                  setCreditCards(newCards);
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {creditCards.length === 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addCreditCard()}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm thông tin thẻ tín dụng
                      </Button>
                    )}
                  </div>
                )}

                {/* Personal Loans */}
                <div>
                  <Label>Hiện tại bạn có vay cá nhân tại các ngân hàng/Cty tài chính không? *</Label>
                  <RadioGroup onValueChange={(value) => setValue('hasPersonalLoan', value === 'yes')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="has_loan_yes" />
                      <Label htmlFor="has_loan_yes">Có</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="has_loan_no" />
                      <Label htmlFor="has_loan_no">Không</Label>
                    </div>
                  </RadioGroup>
                </div>

                {watchedValues.hasPersonalLoan && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Thông tin vay cá nhân</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPersonalLoan()}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm khoản vay
                      </Button>
                    </div>

                    {personalLoans.map((loan, index) => (
                      <Card key={index} className="border border-red-200 bg-red-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Khoản vay #{index + 1}
                            </h5>
                            {personalLoans.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePersonalLoan(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Tên ngân hàng/Cty tài chính *</Label>
                              <Select 
                                onValueChange={(value) => {
                                  const newLoans = [...personalLoans];
                                  newLoans[index].bank = value;
                                  setPersonalLoans(newLoans);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="vietcombank">Vietcombank</SelectItem>
                                  <SelectItem value="bidv">BIDV</SelectItem>
                                  <SelectItem value="vietinbank">Vietinbank</SelectItem>
                                  <SelectItem value="agribank">Agribank</SelectItem>
                                  <SelectItem value="other_bank">Ngân hàng khác</SelectItem>
                                  <SelectItem value="finance_company">Công ty tài chính khác</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Thời hạn vay</Label>
                              <Select 
                                onValueChange={(value) => {
                                  const newLoans = [...personalLoans];
                                  newLoans[index].termType = value;
                                  setPersonalLoans(newLoans);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="short">Ngắn hạn (≤12 tháng)</SelectItem>
                                  <SelectItem value="medium">Trung hạn (13-60 tháng)</SelectItem>
                                  <SelectItem value="long">Dài hạn (&gt;60 tháng)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Hình thức vay</Label>
                              <Select 
                                onValueChange={(value) => {
                                  const newLoans = [...personalLoans];
                                  newLoans[index].loanType = value;
                                  setPersonalLoans(newLoans);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unsecured">Tín chấp</SelectItem>
                                  <SelectItem value="secured">Thế chấp</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Dư nợ hiện tại (VNĐ)</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                onChange={(e) => {
                                  const newLoans = [...personalLoans];
                                  newLoans[index].currentDebt = parseInt(e.target.value) || 0;
                                  setPersonalLoans(newLoans);
                                }}
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label>Số tiền phải trả hàng tháng (VNĐ) *</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                onChange={(e) => {
                                  const newLoans = [...personalLoans];
                                  newLoans[index].monthlyPayment = parseInt(e.target.value) || 0;
                                  setPersonalLoans(newLoans);
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {personalLoans.length === 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addPersonalLoan()}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm thông tin khoản vay
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Spouse Information (if married) */}
            {isMarried && (
              <>
                <Card className="border-2 border-pink-200">
                  <CardHeader className="bg-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                      Thông tin cá nhân về vợ/chồng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Quốc tịch của vợ/chồng *</Label>
                        <Select onValueChange={(value) => setValue('spouseNationality', value)} defaultValue="vietnam">
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
                        <Label>Trình độ học vấn cao nhất của vợ/chồng *</Label>
                        <Select onValueChange={(value) => setValue('spouseEducationLevel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="below_secondary">Dưới trung cấp</SelectItem>
                            <SelectItem value="secondary">Trung cấp</SelectItem>
                            <SelectItem value="college">Cao đẳng</SelectItem>
                            <SelectItem value="university">Đại học</SelectItem>
                            <SelectItem value="postgraduate">Sau đại học</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-pink-200">
                  <CardHeader className="bg-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                      Thông tin nghề nghiệp của vợ/chồng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <Label>Loại hình nghề nghiệp chính *</Label>
                      <Select onValueChange={(value) => setValue('spouseEmploymentType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Làm công ăn lương</SelectItem>
                          <SelectItem value="business_owner">Tự kinh doanh</SelectItem>
                          <SelectItem value="rental">Cho thuê</SelectItem>
                          <SelectItem value="other">Khác (Hưu trí, Nội trợ, Sinh viên, Lao động tự do)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Similar sections for spouse employment details would go here */}
                  </CardContent>
                </Card>

                <Card className="border-2 border-pink-200">
                  <CardHeader className="bg-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                      Thông tin tài chính của vợ/chồng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Thu nhập từ lương</Label>
                        <Slider
                          value={spouseSalaryIncome}
                          onValueChange={setSpouseSalaryIncome}
                          max={200000000}
                          min={0}
                          step={1000000}
                          className="w-full mt-2"
                        />
                        <p className="text-sm text-center mt-1">{formatCurrency(spouseSalaryIncome[0])}</p>
                      </div>
                      
                      <div>
                        <Label>Thu nhập từ kinh doanh</Label>
                        <Slider
                          value={spouseBusinessIncome}
                          onValueChange={setSpouseBusinessIncome}
                          max={200000000}
                          min={0}
                          step={1000000}
                          className="w-full mt-2"
                        />
                        <p className="text-sm text-center mt-1">{formatCurrency(spouseBusinessIncome[0])}</p>
                      </div>
                      
                      <div>
                        <Label>Thu nhập từ cho thuê</Label>
                        <Slider
                          value={spouseRentalIncome}
                          onValueChange={setSpouseRentalIncome}
                          max={200000000}
                          min={0}
                          step={1000000}
                          className="w-full mt-2"
                        />
                        <p className="text-sm text-center mt-1">{formatCurrency(spouseRentalIncome[0])}</p>
                      </div>
                      
                      <div>
                        <Label>Thu nhập khác</Label>
                        <Slider
                          value={spouseOtherIncome}
                          onValueChange={setSpouseOtherIncome}
                          max={200000000}
                          min={0}
                          step={1000000}
                          className="w-full mt-2"
                        />
                        <p className="text-sm text-center mt-1">{formatCurrency(spouseOtherIncome[0])}</p>
                      </div>
                    </div>

                    <Card className="border-2 border-pink-300 bg-pink-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">TỔNG THU NHẬP GỘP HÀNG THÁNG CỦA VỢ/CHỒNG *:</span>
                          <span className="text-xl font-bold text-pink-600">
                            {formatCurrency(spouseTotalMonthlyIncome)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </>
            )}

            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Hoàn tất khảo sát'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerCreditLoanSurveyForm;