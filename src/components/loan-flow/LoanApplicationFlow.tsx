
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoanProductType } from '@/types/loan-application-flow';
import LoanApplicationProgress from './LoanApplicationProgress';
import LoanApplicationSteps from './LoanApplicationSteps';
import { LoanApplicationService } from './LoanApplicationService';

const LoanApplicationFlow = () => {
  console.log('LoanApplicationFlow component loaded');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<LoanProductType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleProductSelection = (productType: LoanProductType) => {
    console.log('Product selected:', productType);
    setSelectedProduct(productType);
    setFormData(prev => ({ ...prev, product_type: productType }));
  };

  const handleNextStep = () => {
    console.log('Moving to next step. Current step:', currentStep);
    setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    console.log('Moving to previous step. Current step:', currentStep);
    setCurrentStep(prev => prev - 1);
  };

  const handleFormDataUpdate = (data: Record<string, any>) => {
    console.log('Form data updated:', data);
    setFormData(data);
  };

  const handleAdvisorSelection = async (advisorId: string) => {
    if (!user || !selectedProduct) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      return;
    }

    setLoading(true);
    try {
      const loanApp = await LoanApplicationService.createLoanApplication(
        user.id,
        selectedProduct,
        formData,
        advisorId
      );

      const conversation = await LoanApplicationService.createConversation(
        loanApp.id,
        user.id,
        advisorId
      );

      await LoanApplicationService.sendInitialMessage(
        conversation.id,
        user.id,
        advisorId,
        selectedProduct
      );

      toast.success('Đã gửi yêu cầu vay thành công! Bạn sẽ được chuyển đến trang tin nhắn.');
      
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
        <LoanApplicationProgress currentStep={currentStep} totalSteps={3} />
        
        <LoanApplicationSteps
          currentStep={currentStep}
          selectedProduct={selectedProduct}
          formData={formData}
          onSelectProduct={handleProductSelection}
          onUpdateFormData={handleFormDataUpdate}
          onNext={handleNextStep}
          onBack={handleBackStep}
          onSelectAdvisor={handleAdvisorSelection}
        />
      </div>
    </div>
  );
};

export default LoanApplicationFlow;
