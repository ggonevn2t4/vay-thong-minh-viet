
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoanProductSelectionGrid, { LoanProduct } from './LoanProductSelectionGrid';
import LoanApplicationSteps from './LoanApplicationSteps';
import BasicInformationSurvey from './BasicInformationSurvey';
import LegalInformationSurvey from './LegalInformationSurvey';
import EnhancedAdvisorSelectionStep from './EnhancedAdvisorSelectionStep';
import LoanApplicationProgress from './LoanApplicationProgress';
import { LoanApplicationService } from './LoanApplicationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type ApplicationStep = 'product-selection' | 'basic-survey' | 'advisor-selection' | 'legal-survey' | 'completion';

interface LoanApplicationFlowProps {
  fromMarketplace?: boolean;
  selectedProduct?: string;
}

const LoanApplicationFlow: React.FC<LoanApplicationFlowProps> = ({
  fromMarketplace = false,
  selectedProduct
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('product-selection');
  const [selectedLoanProduct, setSelectedLoanProduct] = useState<LoanProduct | null>(null);
  const [basicSurveyData, setBasicSurveyData] = useState<any>({
    product_type: 'credit_loan',
    customer_questions: {}
  });
  const [legalSurveyData, setLegalSurveyData] = useState<any>({
    product_type: 'credit_loan',
    customer_questions: {}
  });
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationResult, setApplicationResult] = useState<any>(null);

  // Handle state from navigation
  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedProduct) {
      setSelectedLoanProduct(state.selectedProduct);
      setCurrentStep('basic-survey');
    }
  }, [location.state]);

  const handleProductSelect = (product: LoanProduct) => {
    console.log('Selected product:', product);
    setSelectedLoanProduct(product);
    setBasicSurveyData(prev => ({
      ...prev,
      product_type: product.productType
    }));
    setLegalSurveyData(prev => ({
      ...prev,
      product_type: product.productType
    }));
    setCurrentStep('basic-survey');
    toast.success(`Đã chọn sản phẩm: ${product.name}`);
  };

  const handleBasicSurveyComplete = (data: any) => {
    console.log('Basic survey completed:', data);
    setBasicSurveyData(data);
    setCurrentStep('advisor-selection');
  };

  const handleLegalSurveyComplete = (data: any) => {
    console.log('Legal survey completed:', data);
    setLegalSurveyData(data);
    setCurrentStep('completion');
  };

  const handleAdvisorSelect = async (advisorId: string, advisorInfo?: any) => {
    if (!user || !selectedLoanProduct || !basicSurveyData) {
      toast.error('Thiếu thông tin cần thiết để hoàn thành yêu cầu');
      return;
    }

    console.log('Selected advisor ID:', advisorId);
    
    // Store advisor info and move to legal survey
    setSelectedAdvisor(advisorInfo || { id: advisorId, full_name: 'Tư vấn viên', bank_name: 'Ngân hàng' });
    setCurrentStep('legal-survey');
    toast.success('Đã chọn tư vấn viên! Vui lòng hoàn thành thông tin pháp lý.');
  };

  const handleCompleteApplication = async () => {
    if (!user || !selectedLoanProduct || !basicSurveyData || !selectedAdvisor) {
      toast.error('Thiếu thông tin cần thiết để hoàn thành yêu cầu');
      return;
    }

    setIsSubmitting(true);

    try {
      // Merge basic and legal survey data
      const combinedSurveyData = {
        ...basicSurveyData,
        customer_questions: {
          ...basicSurveyData.customer_questions,
          ...legalSurveyData.customer_questions
        }
      };

      // Complete the application through the service
      const result = await LoanApplicationService.completeApplication(
        user.id,
        selectedLoanProduct.productType,
        combinedSurveyData,
        selectedAdvisor.id
      );

      setApplicationResult(result);
      toast.success('Yêu cầu vay đã được gửi thành công!');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackStep = () => {
    switch (currentStep) {
      case 'basic-survey':
        setCurrentStep('product-selection');
        setSelectedLoanProduct(null);
        break;
      case 'advisor-selection':
        setCurrentStep('basic-survey');
        break;
      case 'legal-survey':
        setCurrentStep('advisor-selection');
        setSelectedAdvisor(null);
        break;
      case 'completion':
        setCurrentStep('legal-survey');
        break;
      default:
        navigate('/');
    }
  };

  const getStepNumber = (): number => {
    switch (currentStep) {
      case 'product-selection': return 1;
      case 'basic-survey': return 2;
      case 'advisor-selection': return 3;
      case 'legal-survey': return 4;
      case 'completion': return 5;
      default: return 1;
    }
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 'product-selection': return 'Chọn sản phẩm vay';
      case 'basic-survey': return 'Thông tin cơ bản';
      case 'advisor-selection': return 'Chọn tư vấn viên';
      case 'legal-survey': return 'Thông tin pháp lý';
      case 'completion': return 'Hoàn thành';
      default: return 'Đăng ký khoản vay';
    }
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Yêu cầu đăng nhập</h3>
          <p className="text-gray-600 mb-4">
            Bạn cần đăng nhập để sử dụng tính năng này
          </p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Đăng nhập
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {currentStep !== 'product-selection' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackStep}
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{getStepTitle()}</h1>
              <p className="text-gray-600">
                Bước {getStepNumber()}/5: {getStepTitle()}
              </p>
            </div>
          </div>
        </div>
        
        <LoanApplicationProgress currentStep={getStepNumber()} totalSteps={5} />
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {currentStep === 'product-selection' && (
          <LoanProductSelectionGrid
            onSelectProduct={handleProductSelect}
            fromMarketplace={fromMarketplace}
            selectedProduct={selectedProduct}
          />
        )}

        {currentStep === 'basic-survey' && selectedLoanProduct && (
          <BasicInformationSurvey
            formData={basicSurveyData}
            onUpdateFormData={setBasicSurveyData}
            onNext={() => handleBasicSurveyComplete(basicSurveyData)}
            onBack={handleBackStep}
          />
        )}

        {currentStep === 'advisor-selection' && (
          <EnhancedAdvisorSelectionStep
            selectedProductType={selectedLoanProduct?.productType || 'credit_loan'}
            onSelectAdvisor={handleAdvisorSelect}
            onBack={handleBackStep}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'legal-survey' && selectedLoanProduct && (
          <LegalInformationSurvey
            formData={legalSurveyData}
            onUpdateFormData={setLegalSurveyData}
            onNext={() => {
              handleLegalSurveyComplete(legalSurveyData);
              handleCompleteApplication();
            }}
            onBack={handleBackStep}
            advisorInfo={selectedAdvisor}
          />
        )}

        {currentStep === 'completion' && applicationResult && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✓</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Yêu cầu vay đã được gửi thành công!
              </h3>
              <p className="text-gray-600">
                Tư vấn viên sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Thông tin yêu cầu:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Sản phẩm: {selectedLoanProduct?.name}</p>
                <p>• Mã đơn: {applicationResult.loanApplication.id.slice(0, 8)}</p>
                <p>• Trạng thái: Đang chờ xử lý</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                Xem dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/messages')}>
                Tin nhắn với tư vấn viên
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationFlow;
