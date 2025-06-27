import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LoanProductSelection from './LoanProductSelection';
import CustomQuestionForm from './CustomQuestionForm';
import AdvisorSelectionStep from './AdvisorSelectionStep';
import { LoanProductType, LoanApplicationFormData } from '@/types/loan-application-flow';

const LoanApplicationFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<LoanProductType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleProductSelection = (productType: LoanProductType) => {
    setSelectedProduct(productType);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFormDataUpdate = (data: Record<string, any>) => {
    setFormData(data);
  };

  const handleAdvisorSelection = async (advisorId: string) => {
    if (!user || !selectedProduct) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      return;
    }

    setLoading(true);
    try {
      // Map employment status to valid enum values
      const mapEmploymentType = (status: string): 'employee' | 'self_employed' | 'freelancer' | 'retired' | 'student' | 'unemployed' => {
        const mapping: Record<string, 'employee' | 'self_employed' | 'freelancer' | 'retired' | 'student' | 'unemployed'> = {
          'Nhân viên công ty': 'employee',
          'Công chức': 'employee',
          'Kinh doanh tự do': 'self_employed',
          'Freelancer': 'freelancer'
        };
        return mapping[status] || 'employee';
      };

      // Create base loan application data
      const baseLoanApplicationData = {
        user_id: user.id,
        amount: Number(formData.loan_amount || 100000000),
        term_months: Number(formData.loan_term || 12),
        purpose: formData.loan_purpose_detail || formData.loan_purpose || 'Nhu cầu cá nhân',
        product_type: selectedProduct,
        customer_questions: formData,
        monthly_income: Number(formData.monthly_income || 0),
        employment_type: mapEmploymentType(formData.employment_status || ''),
        loan_type: (selectedProduct === 'credit_loan' ? 'tin_dung' : 'the_chap') as 'tin_dung' | 'the_chap',
        advisor_id: advisorId,
        status: 'draft' as 'draft' | 'pending' | 'approved' | 'rejected' | 'reviewing'
      };

      // Add mortgage-specific data if needed
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

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          loan_application_id: loanApp.id,
          customer_id: user.id,
          advisor_id: advisorId,
          status: 'active'
        })
        .select()
        .single();

      if (convError) throw convError;

      // Send initial system message
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          recipient_id: advisorId,
          content: `Chào bạn! Tôi đã gửi yêu cầu vay ${selectedProduct === 'credit_loan' ? 'tín dụng' : 'thế chấp'} và muốn được tư vấn. Cảm ơn bạn!`,
          message_type: 'text'
        });

      toast.success('Đã gửi yêu cầu vay thành công! Bạn sẽ được chuyển đến trang tin nhắn.');
      
      // Navigate to messages page
      setTimeout(() => {
        navigate('/messages');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating loan application:', error);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu vay');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý yêu cầu vay của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-brand-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Bước {currentStep}/3: {
                  currentStep === 1 ? 'Chọn sản phẩm' :
                  currentStep === 2 ? 'Điền thông tin' :
                  'Chọn tư vấn viên'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && (
          <LoanProductSelection
            selectedProduct={selectedProduct}
            onSelectProduct={handleProductSelection}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && selectedProduct && (
          <CustomQuestionForm
            productType={selectedProduct}
            formData={formData}
            onUpdateFormData={handleFormDataUpdate}
            onBack={handleBackStep}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 3 && selectedProduct && (
          <AdvisorSelectionStep
            selectedProductType={selectedProduct}
            onSelectAdvisor={handleAdvisorSelection}
            onBack={handleBackStep}
          />
        )}
      </div>
    </div>
  );
};

export default LoanApplicationFlow;
