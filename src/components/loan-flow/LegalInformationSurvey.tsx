import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, FileText, Shield, AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';
import { LoanProductType } from '@/types/loan-application-flow';
import { 
  getQuestionnaireForProduct, 
  getConditionalQuestions, 
  validateQuestionResponse,
  OptimizedQuestion
} from '@/data/optimized-loan-questionnaires';
import { toast } from 'sonner';

interface LegalInformationSurveyProps {
  formData: Record<string, any>;
  onUpdateFormData: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
  advisorInfo?: {
    full_name: string;
    bank_name: string;
  };
}

const LegalInformationSurvey = ({ 
  formData, 
  onUpdateFormData, 
  onNext, 
  onBack, 
  advisorInfo 
}: LegalInformationSurveyProps) => {
  const [currentFormData, setCurrentFormData] = useState(formData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentCategoryIndex, setCategoryIndex] = useState(0);

  const productType = formData.product_type || 'credit_loan';
  const questionnaire = getQuestionnaireForProduct(productType);
  
  // Filter only legal/sensitive categories for legal information stage
  const legalCategories = questionnaire.categories.filter(category => 
    ['legal_info', 'sensitive_info', 'document_upload', 'final_verification'].includes(category.id)
  );
  
  const currentCategory = legalCategories[currentCategoryIndex];
  const visibleQuestions = getConditionalQuestions(questionnaire, currentFormData.customer_questions || {});
  const categoryQuestions = currentCategory ? currentCategory.questions.filter(q => 
    visibleQuestions.some(vq => vq.id === q.id)
  ) : [];

  const totalProgress = Math.round(
    ((currentCategoryIndex + 1) / legalCategories.length) * 100
  );

  const handleInputChange = (questionId: string, value: any) => {
    const updatedData = {
      ...currentFormData,
      customer_questions: {
        ...currentFormData.customer_questions,
        [questionId]: value
      }
    };
    setCurrentFormData(updatedData);
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentCategory = () => {
    const newErrors: Record<string, string> = {};
    
    categoryQuestions.forEach(question => {
      const value = currentFormData.customer_questions?.[question.id];
      const validation = validateQuestionResponse(question, value);
      
      if (!validation.isValid) {
        newErrors[question.id] = validation.message!;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextCategory = () => {
    if (validateCurrentCategory()) {
      if (currentCategoryIndex < legalCategories.length - 1) {
        setCategoryIndex(currentCategoryIndex + 1);
        toast.success(`Hoàn thành ${currentCategory.name}`);
      } else {
        // All legal categories completed
        onUpdateFormData(currentFormData);
        toast.success('Hoàn thành thông tin pháp lý!');
        onNext();
      }
    }
  };

  const handlePreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      setCategoryIndex(currentCategoryIndex - 1);
    } else {
      onBack();
    }
  };

  const renderQuestionField = (question: OptimizedQuestion) => {
    const value = currentFormData.customer_questions?.[question.id] || '';
    const hasError = errors[question.id];

    const baseClasses = `transition-all duration-200 ${hasError ? 'border-red-500 ring-red-200' : 'focus:ring-green-200'}`;

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label htmlFor={question.id} className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Input
              id={question.id}
              type="text"
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={baseClasses}
            />
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label htmlFor={question.id} className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Input
              id={question.id}
              type="number"
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={baseClasses}
            />
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label htmlFor={question.id} className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Select value={value} onValueChange={(val) => handleInputChange(question.id, val)}>
              <SelectTrigger className={baseClasses}>
                <SelectValue placeholder="Chọn một tùy chọn" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {question.options?.map((option: string) => (
                  <SelectItem key={option} value={option} className="hover:bg-gray-100">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {question.options?.map((option: string) => {
                const isChecked = Array.isArray(value) ? value.includes(option) : false;
                return (
                  <div key={option} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                    <Checkbox
                      id={`${question.id}_${option}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const currentArray = Array.isArray(value) ? value : [];
                        if (checked) {
                          handleInputChange(question.id, [...currentArray, option]);
                        } else {
                          handleInputChange(question.id, currentArray.filter((item: string) => item !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`${question.id}_${option}`} className="text-sm font-medium cursor-pointer leading-relaxed">
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label htmlFor={question.id} className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Textarea
              id={question.id}
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={baseClasses}
              rows={4}
            />
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label htmlFor={question.id} className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Input
              id={question.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={baseClasses}
            />
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Handle case where there are no legal categories
  if (legalCategories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Không cần thông tin pháp lý bổ sung</h3>
            <p className="text-gray-600 mb-6">
              Loại sản phẩm vay này không yêu cầu thông tin pháp lý bổ sung.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onBack}>
                Quay lại
              </Button>
              <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
                Tiếp tục
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thông tin pháp lý</h1>
            <p className="text-gray-600 mt-1">
              Hoàn thành thông tin pháp lý để tư vấn viên có thể hỗ trợ tốt nhất
            </p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Giai đoạn 2/2
          </Badge>
        </div>

        {/* Advisor info */}
        {advisorInfo && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Tư vấn viên đã chọn:</strong> {advisorInfo.full_name} - {advisorInfo.bank_name}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Tiến độ</span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="w-full h-2" />
        </div>

        {/* Category navigation */}
        <div className="flex flex-wrap gap-2 mt-4">
          {legalCategories.map((category, index) => (
            <Badge
              key={category.id}
              variant={
                index === currentCategoryIndex 
                  ? "default" 
                  : index < currentCategoryIndex 
                    ? "secondary" 
                    : "outline"
              }
              className={`flex items-center gap-1 ${
                index === currentCategoryIndex ? 'bg-green-600' : ''
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Current category form */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              {currentCategory.icon}
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">{currentCategory.name}</CardTitle>
              <p className="text-gray-600 text-sm">{currentCategory.description}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-8">
            {categoryQuestions.map(renderQuestionField)}
          </div>
          
          <div className="flex justify-between pt-8 mt-8 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousCategory}
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {currentCategoryIndex === 0 ? 'Quay lại' : 'Mục trước'}
            </Button>
            
            <Button
              onClick={handleNextCategory}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-6"
            >
              {currentCategoryIndex === legalCategories.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalInformationSurvey;