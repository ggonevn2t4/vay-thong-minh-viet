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
  const [currentCategoryIndex, setCategoryIndex] = useState(0);
  const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());

  const productType = formData.product_type || 'credit_loan';
  const questionnaire = getQuestionnaireForProduct(productType);
  const currentCategory = questionnaire.categories[currentCategoryIndex];
  const visibleQuestions = getConditionalQuestions(questionnaire, currentFormData.customer_questions || {});
  const categoryQuestions = currentCategory.questions.filter(q => 
    visibleQuestions.some(vq => vq.id === q.id)
  );

  const totalProgress = Math.round(
    ((currentCategoryIndex + (completedCategories.has(currentCategory.id) ? 1 : 0)) / questionnaire.categories.length) * 100
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
      setCompletedCategories(prev => new Set([...prev, currentCategory.id]));
      
      if (currentCategoryIndex < questionnaire.categories.length - 1) {
        setCategoryIndex(currentCategoryIndex + 1);
        toast.success(`Hoàn thành ${currentCategory.name}`);
      } else {
        // All categories completed
        onUpdateFormData(currentFormData);
        const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60);
        toast.success(`Hoàn thành khảo sát trong ${timeSpent} phút!`);
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

    const baseClasses = `transition-all duration-200 ${hasError ? 'border-red-500 ring-red-200' : 'focus:ring-blue-200'}`;

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
                <AlertCircle className="h-4 w-4" />
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
                <AlertCircle className="h-4 w-4" />
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
                <AlertCircle className="h-4 w-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((option: string) => {
                const isChecked = Array.isArray(value) ? value.includes(option) : false;
                return (
                  <div key={option} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
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
                    <Label htmlFor={`${question.id}_${option}`} className="text-sm font-medium cursor-pointer">
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
                <AlertCircle className="h-4 w-4" />
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
                <AlertCircle className="h-4 w-4" />
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
              type="tel"
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
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'email':
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
              type="email"
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
                <AlertCircle className="h-4 w-4" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'id_number':
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
              maxLength={12}
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
            <RadioGroup
              value={value}
              onValueChange={(val) => handleInputChange(question.id, val)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {question.options?.map((option: string) => (
                <div key={option} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`${question.id}_${option}`} />
                  <Label htmlFor={`${question.id}_${option}`} className="text-sm font-medium cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
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
    <div className="max-w-4xl mx-auto">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{questionnaire.title}</h1>
            <p className="text-gray-600 mt-1">{questionnaire.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{questionnaire.estimatedTime}</span>
          </div>
        </div>
        
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
          {questionnaire.categories.map((category, index) => (
            <Badge
              key={category.id}
              variant={
                index === currentCategoryIndex 
                  ? "default" 
                  : completedCategories.has(category.id) 
                    ? "secondary" 
                    : "outline"
              }
              className={`flex items-center gap-1 ${
                index === currentCategoryIndex ? 'bg-blue-600' : ''
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              {completedCategories.has(category.id) && (
                <CheckCircle className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Current category form */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
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
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-6"
            >
              {currentCategoryIndex === questionnaire.categories.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedSurveyForm;