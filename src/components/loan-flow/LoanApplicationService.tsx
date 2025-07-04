
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LoanProductType } from '@/types/loan-application-flow';

export class LoanApplicationService {
  static mapEmploymentType = (status: string): 'employee' | 'self_employed' | 'freelancer' | 'retired' | 'student' | 'unemployed' => {
    const mapping: Record<string, 'employee' | 'self_employed' | 'freelancer' | 'retired' | 'student' | 'unemployed'> = {
      'Nhân viên công ty': 'employee',
      'Công chức': 'employee',
      'Kinh doanh tự do': 'self_employed',
      'Freelancer': 'freelancer'
    };
    return mapping[status] || 'employee';
  };

  static mapLoanType = (productType: LoanProductType): 'personal' | 'mortgage' | 'business' | 'auto' | 'education' | 'credit_loan' | 'mortgage_loan' => {
    const mapping: Record<LoanProductType, 'personal' | 'mortgage' | 'business' | 'auto' | 'education' | 'credit_loan' | 'mortgage_loan'> = {
      'credit_loan': 'credit_loan',
      'mortgage_loan': 'mortgage_loan',
      'car_loan': 'auto',
      'business_loan': 'business', 
      'education_loan': 'education'
    };
    return mapping[productType] || 'personal';
  };

  static async createLoanApplication(
    userId: string,
    selectedProduct: LoanProductType,
    formData: Record<string, any>,
    advisorId: string
  ) {
    const baseLoanApplicationData = {
      user_id: userId,
      amount: Number(formData.loan_amount || 100000000),
      term_months: Number(formData.loan_term || 12),
      purpose: formData.loan_purpose_detail || formData.loan_purpose || 'Nhu cầu cá nhân',
      product_type: selectedProduct,
      customer_questions: formData,
      monthly_income: Number(formData.monthly_income || 0),
      employment_type: this.mapEmploymentType(formData.employment_status || ''),
      loan_type: this.mapLoanType(selectedProduct),
      advisor_id: advisorId,
      status: 'draft' as 'draft' | 'pending' | 'approved' | 'rejected' | 'reviewing'
    };

    const loanApplicationData = selectedProduct === 'mortgage_loan' 
      ? {
          ...baseLoanApplicationData,
          property_value: Number(formData.property_value || 0),
          property_address: formData.property_address || '',
          collateral_info: {
            property_type: formData.property_type,
            property_documents: formData.property_documents,
            repayment_capacity: formData.repayment_capacity
          }
        }
      : baseLoanApplicationData;

    const { data: loanApp, error: loanError } = await supabase
      .from('loan_applications')
      .insert(loanApplicationData)
      .select()
      .single();

    if (loanError) throw loanError;
    return loanApp;
  }

  static async createConversation(loanApplicationId: string, customerId: string, advisorId: string) {
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        loan_application_id: loanApplicationId,
        customer_id: customerId,
        advisor_id: advisorId,
        status: 'active'
      })
      .select()
      .single();

    if (convError) throw convError;
    return conversation;
  }

  static async sendInitialMessage(
    conversationId: string,
    customerId: string,
    advisorId: string,
    selectedProduct: LoanProductType
  ) {
    const productName = selectedProduct === 'credit_loan' ? 'tín dụng' : 'thế chấp';
    
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: customerId,
        recipient_id: advisorId,
        content: `Chào bạn! Tôi đã gửi yêu cầu vay ${productName} và muốn được tư vấn. Cảm ơn bạn!`,
        message_type: 'text'
      });
  }

  static async completeApplication(
    userId: string,
    selectedProduct: LoanProductType,
    formData: Record<string, any>,
    advisorId: string
  ) {
    try {
      console.log('Creating loan application...', { userId, selectedProduct, formData, advisorId });
      
      // Create loan application
      const loanApplication = await this.createLoanApplication(
        userId,
        selectedProduct,
        formData,
        advisorId
      );

      console.log('Created loan application:', loanApplication);

      // Create conversation
      const conversation = await this.createConversation(
        loanApplication.id,
        userId,
        advisorId
      );

      console.log('Created conversation:', conversation);

      // Send initial message
      await this.sendInitialMessage(
        conversation.id,
        userId,
        advisorId,
        selectedProduct
      );

      console.log('Sent initial message');

      return {
        loanApplication,
        conversation,
        success: true
      };
    } catch (error) {
      console.error('Error completing application:', error);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu vay. Vui lòng thử lại.');
      throw error;
    }
  }
}
