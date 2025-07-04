
import React from 'react';
import { LoanProductType } from '@/types/loan-application-flow';
import LoanProductSelection from './LoanProductSelection';
import AdvisorSelectionStep from './AdvisorSelectionStep';
import OptimizedSurveyForm from './OptimizedSurveyForm';

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

  if (currentStep === 2) {
    return (
      <OptimizedSurveyForm
        formData={formData}
        onUpdateFormData={onUpdateFormData}
        onNext={onNext}
        onBack={onBack}
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
