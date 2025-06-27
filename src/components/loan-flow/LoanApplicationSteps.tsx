
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoanProductType } from '@/types/loan-application-flow';
import LoanProductSelection from './LoanProductSelection';
import AdvisorSelectionStep from './AdvisorSelectionStep';

interface LoanApplicationStepsProps {
  currentStep: number;
  selectedProduct: LoanProductType | null;
  formData: Record<string, any>;
  onSelectProduct: (productType: LoanProductType) => void;
  onUpdateFormData: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
  onSelectAdvisor: (advisorId: string) => void;
}

const LoanApplicationSteps = ({
  currentStep,
  selectedProduct,
  formData,
  onSelectProduct,
  onUpdateFormData,
  onNext,
  onBack,
  onSelectAdvisor
}: LoanApplicationStepsProps) => {
  const navigate = useNavigate();

  if (currentStep === 1) {
    return (
      <LoanProductSelection
        selectedProduct={selectedProduct}
        onSelectProduct={onSelectProduct}
        onNext={() => {
          // Chuyển hướng đến trang khảo sát thay vì next step
          navigate('/khao-sat');
        }}
      />
    );
  }

  if (currentStep === 2 && selectedProduct) {
    return (
      <AdvisorSelectionStep
        selectedProductType={selectedProduct}
        onSelectAdvisor={onSelectAdvisor}
        onBack={onBack}
      />
    );
  }

  return null;
};

export default LoanApplicationSteps;
