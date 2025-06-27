
import React from 'react';
import { LoanProductType } from '@/types/loan-application-flow';
import LoanProductSelection from './LoanProductSelection';
import CustomQuestionForm from './CustomQuestionForm';
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
  if (currentStep === 1) {
    return (
      <LoanProductSelection
        selectedProduct={selectedProduct}
        onSelectProduct={onSelectProduct}
        onNext={onNext}
      />
    );
  }

  if (currentStep === 2 && selectedProduct) {
    return (
      <CustomQuestionForm
        productType={selectedProduct}
        formData={formData}
        onUpdateFormData={onUpdateFormData}
        onBack={onBack}
        onNext={onNext}
      />
    );
  }

  if (currentStep === 3 && selectedProduct) {
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
