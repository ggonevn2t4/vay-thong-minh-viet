import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { LoanApplicationFormData } from '@/types/loan-application-flow';
import { 
  getQuestionnaireForProduct, 
  getConditionalQuestions, 
  validateQuestionResponse,
  OptimizedQuestion,
  OptimizedQuestionForm
} from '@/data/optimized-loan-questionnaires';
import { toast } from 'sonner';

interface OptimizedSurveyFormProps {
  formData: Record<string, any>;
  onUpdateFormData: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const OptimizedSurveyForm = ({ formData, onUpdateFormData, onNext, onBack }: OptimizedSurveyFormProps) => {
  const [currentFormData, setCurrentFormData] = useState(formData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());

  const productType = formData.product_type || 'credit_loan';
  const questionnaire = getQuestionnaireForProduct(productType);
  const visibleQuestions = getConditionalQuestions(questionnaire, currentFormData.customer_questions || {});

  // Calculate progress based on completed questions
  const totalRequiredQuestions = visibleQuestions.filter(q => q.required).length;
  const completedRequiredQuestions = visibleQuestions.filter(q => 
    q.required && currentFormData.customer_questions?.[q.id] !== undefined && 
    currentFormData.customer_questions?.[q.id] !== '' && 
    currentFormData.customer_questions?.[q.id] !== null
  ).length;
  const totalProgress = totalRequiredQuestions > 0 ? Math.round((completedRequiredQuestions / totalRequiredQuestions) * 100) : 0;

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

  const validateAllQuestions = () => {
    const newErrors: Record<string, string> = {};
    
    visibleQuestions.forEach(question => {
      const value = currentFormData.customer_questions?.[question.id];
      const validation = validateQuestionResponse(question, value);
      
      if (!validation.isValid) {
        newErrors[question.id] = validation.message!;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateAllQuestions()) {
      onUpdateFormData(currentFormData);
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60);
      toast.success(`Hoàn thành khảo sát trong ${timeSpent} phút!`);
      onNext();
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc và kiểm tra lại các lỗi");
    }
  };

  const renderCompactQuestionField = (question: OptimizedQuestion) => {
    const value = currentFormData.customer_questions?.[question.id] || '';
    const hasError = errors[question.id];

    const baseClasses = `transition-all duration-200 text-sm ${hasError ? 'border-red-500 ring-red-200' : 'focus:ring-blue-200'}`;

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label htmlFor={question.id} className="text-xs font-medium text-gray-700 leading-tight">
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
              className={`${baseClasses} h-8 px-2`}
            />
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label htmlFor={question.id} className="text-xs font-medium text-gray-700 leading-tight">
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
              className={`${baseClasses} h-8 px-2`}
            />
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label htmlFor={question.id} className="text-xs font-medium text-gray-700 leading-tight">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Select value={value} onValueChange={(val) => handleInputChange(question.id, val)}>
              <SelectTrigger className={`${baseClasses} h-8`}>
                <SelectValue placeholder="Chọn..." />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50 max-h-60">
                {question.options?.map((option: string) => (
                  <SelectItem key={option} value={option} className="hover:bg-gray-100 text-sm">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label className="text-xs font-medium text-gray-700 leading-tight">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <div className="space-y-1">
              {question.options?.slice(0, 4).map((option: string) => {
                const isChecked = Array.isArray(value) ? value.includes(option) : false;
                return (
                  <div key={option} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50">
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
                      className="h-3 w-3"
                    />
                    <Label htmlFor={`${question.id}_${option}`} className="text-xs cursor-pointer">
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
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
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label htmlFor={question.id} className="text-xs font-medium text-gray-700 leading-tight">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Input
              id={question.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={`${baseClasses} h-8 px-2`}
            />
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'slider':
        const sliderValue = Array.isArray(value) ? value : [value || question.sliderConfig?.min || 0];
        return (
          <div key={question.id} className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <div className="space-y-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg border">
                <span className="text-lg font-semibold text-blue-700">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sliderValue[0])}
                </span>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={(newValue) => handleInputChange(question.id, newValue[0])}
                min={question.sliderConfig?.min || 0}
                max={question.sliderConfig?.max || 1000000000}
                step={question.sliderConfig?.step || 1000000}
                className="w-full"
              />
              {question.sliderConfig?.marks && (
                <div className="flex justify-between text-xs text-gray-500">
                  {question.sliderConfig.marks.map((mark) => (
                    <span key={mark.value}>{mark.label}</span>
                  ))}
                </div>
              )}
            </div>
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'currency':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label htmlFor={question.id} className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <div className="relative">
              <Input
                id={question.id}
                type="number"
                placeholder={question.placeholder}
                value={value}
                onChange={(e) => handleInputChange(question.id, Number(e.target.value))}
                className={`${baseClasses} pr-12`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                VNĐ
              </span>
            </div>
            {value && (
              <p className="text-sm text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
              </p>
            )}
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'phone':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label htmlFor={question.id} className="text-xs font-medium text-gray-700 leading-tight">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Input
              id={question.id}
              type="tel"
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={`${baseClasses} h-8 px-2`}
            />
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'email':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label htmlFor={question.id} className="text-xs font-medium text-gray-700 leading-tight">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <Input
              id={question.id}
              type="email"
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={`${baseClasses} h-8 px-2`}
            />
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'id_number':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{question.icon}</span>
              <Label htmlFor={question.id} className="text-xs font-medium text-gray-700 leading-tight">
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
              className={`${baseClasses} h-8 px-2`}
              maxLength={12}
            />
            {hasError && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={question.id} className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{question.icon}</span>
              <Label className="text-sm font-semibold text-gray-700">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <RadioGroup value={value} onValueChange={(val) => handleInputChange(question.id, val)}>
              <div className="grid grid-cols-1 gap-3">
                {question.options?.map((option: string) => (
                  <div key={option} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={`${question.id}_${option}`} />
                    <Label htmlFor={`${question.id}_${option}`} className="text-sm font-medium cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {question.helpText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {question.helpText}
              </p>
            )}
            {hasError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{questionnaire.title}</h1>
            <p className="text-gray-600 text-sm">{questionnaire.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{questionnaire.estimatedTime}</span>
            </div>
            <div className="text-sm font-medium text-blue-600">
              {totalProgress}% hoàn thành
            </div>
          </div>
        </div>
        
        {/* Compact Progress bar */}
        <Progress value={totalProgress} className="w-full h-1.5" />
      </div>

      {/* Compact single form layout */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6">
          {/* Category tabs as headers */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
            {questionnaire.categories.map((category) => {
              const categoryQuestions = category.questions.filter(q => 
                visibleQuestions.some(vq => vq.id === q.id)
              );
              if (categoryQuestions.length === 0) return null;
              
              const completedInCategory = categoryQuestions.filter(q => 
                currentFormData.customer_questions?.[q.id] !== undefined && 
                currentFormData.customer_questions?.[q.id] !== '' && 
                currentFormData.customer_questions?.[q.id] !== null
              ).length;
              
              return (
                <div key={category.id} className="text-center p-3 bg-gray-50 rounded-lg border">
                  <div className="text-lg mb-1">{category.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{category.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {completedInCategory}/{categoryQuestions.length}
                  </div>
                </div>
              );
            })}
          </div>

          {/* All questions in a compact grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionnaire.categories.map((category) => {
              const categoryQuestions = category.questions.filter(q => 
                visibleQuestions.some(vq => vq.id === q.id)
              );

              if (categoryQuestions.length === 0) return null;

              return categoryQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  {renderCompactQuestionField(question)}
                </div>
              ));
            })}
          </div>
        </div>

        {/* Compact Submit section */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-gray-600 text-center sm:text-right">
                Đã hoàn thành {completedRequiredQuestions}/{totalRequiredQuestions} câu hỏi bắt buộc
              </div>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-8"
                disabled={totalProgress < 100}
              >
                Hoàn thành khảo sát
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedSurveyForm;