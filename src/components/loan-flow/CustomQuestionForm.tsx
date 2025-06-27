
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LoanProductType, QuestionField } from '@/types/loan-application-flow';
import { customQuestionForms } from '@/data/loan-products';

interface CustomQuestionFormProps {
  productType: LoanProductType;
  formData: Record<string, any>;
  onUpdateFormData: (data: Record<string, any>) => void;
  onBack: () => void;
  onNext: () => void;
}

const CustomQuestionForm = ({ 
  productType, 
  formData, 
  onUpdateFormData, 
  onBack, 
  onNext 
}: CustomQuestionFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const questionForm = customQuestionForms[productType];

  const handleInputChange = (questionId: string, value: any) => {
    const updatedData = {
      ...formData,
      [questionId]: value
    };
    onUpdateFormData(updatedData);
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    questionForm.questions.forEach((question) => {
      const value = formData[question.id];
      
      if (question.required && (!value || value === '')) {
        newErrors[question.id] = `${question.label} là bắt buộc`;
      }
      
      if (value && question.validation) {
        if (question.type === 'number') {
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

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const renderQuestion = (question: QuestionField) => {
    const value = formData[question.id] || '';
    const hasError = errors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={hasError ? 'border-red-500' : ''}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={hasError ? 'border-red-500' : ''}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className={hasError ? 'border-red-500' : ''}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(selectedValue) => handleInputChange(question.id, selectedValue)}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder="Chọn một tùy chọn" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return null;
    }
  };

  const productName = productType === 'credit_loan' ? 'Vay tín dụng' : 'Vay thế chấp';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Thông tin chi tiết - {productName}
          </CardTitle>
          <p className="text-gray-600 text-center">
            Vui lòng cung cấp thông tin để chúng tôi tư vấn chính xác nhất
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {questionForm.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label htmlFor={question.id} className="font-medium">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderQuestion(question)}
              {errors[question.id] && (
                <p className="text-red-500 text-sm">{errors[question.id]}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button onClick={handleSubmit} className="bg-brand-600 hover:bg-brand-700">
          Tiếp tục
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CustomQuestionForm;
