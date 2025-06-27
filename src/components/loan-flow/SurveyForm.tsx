
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LoanApplicationFormData } from '@/types/loan-application-flow';
import { customQuestionForms } from '@/data/loan-products';

interface SurveyFormProps {
  formData: Record<string, any>;
  onUpdateFormData: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SurveyForm = ({ formData, onUpdateFormData, onNext, onBack }: SurveyFormProps) => {
  const [currentFormData, setCurrentFormData] = useState(formData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Determine which form to show based on product type
  const productType = formData.product_type || 'credit_loan';
  const questionForm = customQuestionForms[productType];

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    questionForm.questions.forEach(question => {
      if (question.required) {
        const value = currentFormData.customer_questions?.[question.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[question.id] = `${question.label} là bắt buộc`;
        }
      }
      
      // Validate number fields
      if (question.type === 'number' && question.validation) {
        const value = currentFormData.customer_questions?.[question.id];
        if (value !== undefined && value !== '') {
          const numValue = Number(value);
          if (question.validation.min && numValue < question.validation.min) {
            newErrors[question.id] = `Giá trị tối thiểu là ${question.validation.min.toLocaleString()}`;
          }
          if (question.validation.max && numValue > question.validation.max) {
            newErrors[question.id] = `Giá trị tối đa là ${question.validation.max.toLocaleString()}`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdateFormData(currentFormData);
      onNext();
    }
  };

  const renderQuestionField = (question: any) => {
    const value = currentFormData.customer_questions?.[question.id] || '';
    const hasError = errors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={question.id}
              type="text"
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <p className="text-red-500 text-sm">{hasError}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={question.id}
              type="number"
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <p className="text-red-500 text-sm">{hasError}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(question.id, val)}>
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder="Chọn một tùy chọn" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-red-500 text-sm">{hasError}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={question.id}
              placeholder={question.placeholder}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={hasError ? 'border-red-500' : ''}
              rows={4}
            />
            {hasError && (
              <p className="text-red-500 text-sm">{hasError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!questionForm) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không tìm thấy form khảo sát cho sản phẩm này.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Khảo sát thông tin chi tiết
          </CardTitle>
          <p className="text-gray-600 text-center">
            Vui lòng cung cấp thông tin để chúng tôi có thể tư vấn tốt nhất cho bạn
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {questionForm.questions.map(renderQuestionField)}
            
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              
              <Button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 flex items-center gap-2"
              >
                Tiếp tục
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyForm;
