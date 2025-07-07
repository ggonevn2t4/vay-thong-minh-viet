import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type EmploymentType = 'employee' | 'self_employed' | 'freelancer' | 'retired' | 'student' | 'unemployed';
type LoanType = 'credit_loan' | 'mortgage_loan' | 'auto' | 'business' | 'education';
type LoanStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'reviewing';
type PointsTransactionType = 'purchase' | 'spend' | 'reward' | 'refund' | 'adjustment';

export class SampleDataGenerator {
  
  static async createSampleUserProfile(userId: string, roleType: 'customer' | 'advisor' | 'bank_employee') {
    const profiles = {
      customer: [
        { full_name: 'Nguyễn Văn An', phone: '0901234567', employment_type: 'employee' as EmploymentType, monthly_income: 25000000 },
        { full_name: 'Trần Thị Bình', phone: '0912345678', employment_type: 'self_employed' as EmploymentType, monthly_income: 35000000 },
        { full_name: 'Lê Hoàng Cường', phone: '0923456789', employment_type: 'employee' as EmploymentType, monthly_income: 18000000 }
      ],
      advisor: [
        { full_name: 'Phạm Thị Dung', phone: '0934567890', employment_type: 'employee' as EmploymentType, monthly_income: 45000000 },
        { full_name: 'Võ Minh Đức', phone: '0945678901', employment_type: 'employee' as EmploymentType, monthly_income: 50000000 }
      ],
      bank_employee: [
        { full_name: 'Đinh Thị Giang', phone: '0956789012', employment_type: 'employee' as EmploymentType, monthly_income: 40000000 }
      ]
    };

    const profileData = profiles[roleType][0];
    
    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        work_experience_years: Math.floor(Math.random() * 10) + 3
      });

    if (profileError) throw profileError;

    // Assign role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: roleType });

    if (roleError) throw roleError;

    // Create role-specific data
    if (roleType === 'advisor') {
      await this.createAdvisorProfile(userId);
    } else if (roleType === 'bank_employee') {
      await this.createBankEmployeeProfile(userId);
    } else if (roleType === 'customer') {
      await this.createCustomerWallet(userId);
    }

    return profileData;
  }

  static async createAdvisorProfile(userId: string) {
    const advisorData = {
      user_id: userId,
      full_name: 'Chuyên gia tư vấn',
      bank_name: 'Vietcombank',
      branch_name: 'Chi nhánh Cần Thơ',
      branch_address: '13A4/3A KV5, Phường An Bình, Quận Ninh Kiều, TP. Cần Thơ',
      job_title: 'Chuyên viên tín dụng',
      department: 'Phòng tín dụng',
      bio: 'Chuyên gia tư vấn khoản vay với nhiều năm kinh nghiệm trong ngành ngân hàng.',
      specializations: ['credit_loan', 'mortgage_loan'],
      years_experience: 10,
      current_bank_experience_years: 8,
      is_verified: true,
      availability_status: 'available',
      total_clients_helped: Math.floor(Math.random() * 100) + 20,
      success_rate: 90 + Math.random() * 10,
      average_rating: 4.0 + Math.random(),
      total_reviews: Math.floor(Math.random() * 50) + 10
    };

    const { error } = await supabase
      .from('advisor_profiles')
      .upsert(advisorData);

    if (error) throw error;
  }

  static async createBankEmployeeProfile(userId: string) {
    const employeeData = {
      user_id: userId,
      employee_id: `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      full_name: 'Nhân viên ngân hàng',
      department: 'Phòng thẩm định tín dụng',
      position: 'Chuyên viên thẩm định',
      branch_name: 'Chi nhánh BIDV Cần Thơ',
      branch_code: 'BIDV_CT',
      is_active: true
    };

    const { error } = await supabase
      .from('bank_employee_profiles')
      .upsert(employeeData);

    if (error) throw error;
  }

  static async createCustomerWallet(userId: string) {
    const { error } = await supabase
      .from('wallet')
      .upsert({
        user_id: userId,
        balance: Math.floor(Math.random() * 100000),
        points_balance: Math.floor(Math.random() * 200)
      });

    if (error) throw error;
  }

  static async createSampleLoanApplication(userId: string) {
    const loanTypes = ['credit_loan', 'mortgage_loan', 'auto'] as const;
    const statuses = ['draft', 'pending', 'approved', 'rejected'] as const;
    const employmentTypes: EmploymentType[] = ['employee', 'self_employed', 'freelancer'];
    
    const loanType = loanTypes[Math.floor(Math.random() * loanTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const amounts = [100000000, 200000000, 500000000, 1000000000, 1500000000];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];

    const loanData = {
      user_id: userId,
      loan_type: loanType,
      amount,
      term_months: [12, 24, 36, 60, 120, 180][Math.floor(Math.random() * 6)],
      purpose: loanType === 'credit_loan' ? 'Kinh doanh cá nhân' : 
               loanType === 'mortgage_loan' ? 'Mua nhà ở' : 'Mua xe ô tô',
      product_type: loanType,
      monthly_income: 15000000 + Math.floor(Math.random() * 35000000),
      employment_type: employmentTypes[Math.floor(Math.random() * 3)],
      status,
      customer_questions: {
        loan_purpose_detail: loanType === 'credit_loan' ? 'Mở quán cà phê' : 
                           loanType === 'mortgage_loan' ? 'Mua nhà đầu tiên' : 'Mua xe gia đình'
      }
    };

    // Add property info for mortgage loans via collateral_info instead
    if (loanType === 'mortgage_loan') {
      Object.assign(loanData, {
        property_value: amount * 1.3, // Property worth 30% more than loan
        property_address: 'Số 123, Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, TP. Cần Thơ',
        collateral_info: {
          property_type: 'Nhà phố',
          property_documents: 'Đầy đủ'
        }
      });
    }

    const { data, error } = await supabase
      .from('loan_applications')
      .insert(loanData)
      .select()
      .single();

    if (error) throw error;

    // Create bank offers for approved/pending loans
    if (status === 'approved' || status === 'pending') {
      await this.createBankOffers(data.id, amount);
    }

    return data;
  }

  static async createBankOffers(loanApplicationId: string, amount: number) {
    const banks = ['Vietcombank', 'Techcombank', 'BIDV', 'Sacombank'];
    const numOffers = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numOffers; i++) {
      const bank = banks[i % banks.length];
      const interestRate = 7 + Math.random() * 5; // 7-12%
      const offeredAmount = amount * (0.8 + Math.random() * 0.2); // 80-100% of requested

      await supabase
        .from('bank_loan_offers')
        .insert({
          loan_application_id: loanApplicationId,
          bank_name: bank,
          offered_amount: Math.floor(offeredAmount),
          interest_rate: Math.round(interestRate * 10) / 10,
          term_months: [12, 24, 36, 60][Math.floor(Math.random() * 4)],
          conditions: 'Điều kiện chuẩn của ngân hàng',
          requires_cic_check: Math.random() > 0.3,
          status: ['pending', 'accepted', 'declined'][Math.floor(Math.random() * 3)]
        });
    }
  }

  static async createSampleNotifications(userId: string) {
    const notifications = [
      {
        type: 'loan_approved',
        title: 'Hồ sơ vay đã được duyệt',
        message: 'Chúc mừng! Hồ sơ vay của bạn đã được ngân hàng phê duyệt.',
        action_url: '/dashboard'
      },
      {
        type: 'document_required',
        title: 'Cần bổ sung hồ sơ',
        message: 'Bạn cần bổ sung thêm tài liệu để hoàn thiện hồ sơ vay.',
        action_url: '/ho-so-tai-lieu'
      },
      {
        type: 'rate_alert',
        title: 'Cảnh báo lãi suất',
        message: 'Lãi suất thị trường có biến động, hãy xem xét tối ưu hóa khoản vay.',
        action_url: '/loan-optimization'
      }
    ];

    const notification = notifications[Math.floor(Math.random() * notifications.length)];

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        ...notification,
        data: {}
      });

    if (error) throw error;
  }

  static async createAIConsultationSession(userId: string) {
    const sessionData = {
      user_id: userId,
      session_type: 'financial_analysis',
      status: 'completed',
      financial_data: {
        monthly_income: 25000000,
        monthly_expenses: 15000000,
        existing_loans: [],
        savings: 50000000
      },
      ai_analysis: {
        debt_to_income_ratio: 0.0,
        savings_ratio: 0.4,
        credit_capacity: 180000000
      },
      recommendations: {
        loan_amount_suggestion: 150000000,
        term_suggestion: 36,
        rate_expectation: '8-9%'
      }
    };

    const { error } = await supabase
      .from('ai_consultation_sessions')
      .insert(sessionData);

    if (error) throw error;
  }

  static async setupCompleteUserProfile(userId: string, roleType: 'customer' | 'advisor' | 'bank_employee') {
    try {
      console.log(`Setting up ${roleType} profile for user ${userId}`);
      
      // Create basic profile and role
      await this.createSampleUserProfile(userId, roleType);
      
      if (roleType === 'customer') {
        // Create sample data for customers
        await this.createSampleLoanApplication(userId);
        await this.createSampleNotifications(userId);
        await this.createAIConsultationSession(userId);
        
        // Add points transaction
        await supabase
          .from('points_transactions')
          .insert({
            user_id: userId,
            type: 'reward' as PointsTransactionType,
            amount: 100,
            description: 'Chào mừng thành viên mới',
          });
      }

      toast.success(`Đã tạo thành công dữ liệu mẫu cho ${roleType}!`);
      
    } catch (error) {
      console.error('Error setting up user profile:', error);
      toast.error('Có lỗi xảy ra khi tạo dữ liệu mẫu');
    }
  }
}