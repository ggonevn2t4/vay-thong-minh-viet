
import React from 'react';

interface LoanApplicationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const LoanApplicationProgress = ({ currentStep, totalSteps }: LoanApplicationProgressProps) => {
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Chọn sản phẩm';
      case 2:
        return 'Khảo sát thông tin';
      case 3:
        return 'Chọn tư vấn viên';
      default:
        return '';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center items-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          return (
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
              {step < totalSteps && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-brand-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Bước {currentStep}/{totalSteps}: {getStepTitle(currentStep)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationProgress;
