import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getQuestionnaireForProduct, getConditionalQuestions, validateQuestionResponse, OptimizedQuestion } from '@/data/optimized-loan-questionnaires';
import { LoanApplicationService } from './LoanApplicationService';

const DEFAULT_PRODUCT_TYPE = 'credit_loan';

const OnePageLoanApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({
    product_type: DEFAULT_PRODUCT_TYPE,
    customer_questions: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy tất cả câu hỏi cho sản phẩm tín dụng
  const questionnaire = getQuestionnaireForProduct(DEFAULT_PRODUCT_TYPE);
  const allQuestions = questionnaire.categories.flatMap(cat => cat.questions);
  const visibleQuestions = getConditionalQuestions(questionnaire, formData.customer_questions || {});

  // Render từng trường theo loại
  const renderQuestionField = (question: OptimizedQuestion) => {
    const value = formData.customer_questions?.[question.id] || '';
    const hasError = errors[question.id];
    switch (question.type) {
      case 'text':
      case 'email':
      case 'id_number':
      case 'phone':
        return (
          <div key={question.id} className="space-y-1">
            <Label htmlFor={question.id}>{question.label}{question.required && <span className="text-red-500 ml-1">*</span>}</Label>
            <Input
              id={question.id}
              type={question.type === 'email' ? 'email' : 'text'}
              placeholder={question.placeholder}
              value={value}
              onChange={e => handleInputChange(question.id, e.target.value)}
            />
            {hasError && <p className="text-red-500 text-sm">{hasError}</p>}
          </div>
        );
      case 'number':
      case 'currency':
        return (
          <div key={question.id} className="space-y-1">
            <Label htmlFor={question.id}>{question.label}{question.required && <span className="text-red-500 ml-1">*</span>}</Label>
            <Input
              id={question.id}
              type="number"
              placeholder={question.placeholder}
              value={value}
              onChange={e => handleInputChange(question.id, e.target.value)}
            />
            {hasError && <p className="text-red-500 text-sm">{hasError}</p>}
          </div>
        );
      case 'date':
        return (
          <div key={question.id} className="space-y-1">
            <Label htmlFor={question.id}>{question.label}{question.required && <span className="text-red-500 ml-1">*</span>}</Label>
            <Input
              id={question.id}
              type="date"
              value={value}
              onChange={e => handleInputChange(question.id, e.target.value)}
            />
            {hasError && <p className="text-red-500 text-sm">{hasError}</p>}
          </div>
        );
      case 'select':
        return (
          <div key={question.id} className="space-y-1">
            <Label>{question.label}{question.required && <span className="text-red-500 ml-1">*</span>}</Label>
            <Select value={value} onValueChange={val => handleInputChange(question.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder={question.placeholder || 'Chọn...'} />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && <p className="text-red-500 text-sm">{hasError}</p>}
          </div>
        );
      case 'checkbox':
        return (
          <div key={question.id} className="space-y-1">
            <Label>{question.label}{question.required && <span className="text-red-500 ml-1">*</span>}</Label>
            <div className="flex flex-wrap gap-2">
              {question.options?.map(opt => (
                <label key={opt} className="flex items-center gap-1">
                  <Checkbox
                    checked={Array.isArray(value) ? value.includes(opt) : false}
                    onCheckedChange={checked => handleCheckboxChange(question.id, opt, checked)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {hasError && <p className="text-red-500 text-sm">{hasError}</p>}
          </div>
        );
      case 'textarea':
        return (
          <div key={question.id} className="space-y-1">
            <Label htmlFor={question.id}>{question.label}{question.required && <span className="text-red-500 ml-1">*</span>}</Label>
            <Textarea
              id={question.id}
              placeholder={question.placeholder}
              value={value}
              onChange={e => handleInputChange(question.id, e.target.value)}
            />
            {hasError && <p className="text-red-500 text-sm">{hasError}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      customer_questions: {
        ...prev.customer_questions,
        [questionId]: value,
      },
    }));
    setErrors(prev => ({ ...prev, [questionId]: '' }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setFormData((prev: any) => {
      const current = prev.customer_questions?.[questionId] || [];
      let updated;
      if (checked) {
        updated = [...current, option];
      } else {
        updated = current.filter((o: string) => o !== option);
      }
      return {
        ...prev,
        customer_questions: {
          ...prev.customer_questions,
          [questionId]: updated,
        },
      };
    });
    setErrors(prev => ({ ...prev, [questionId]: '' }));
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    visibleQuestions.forEach(q => {
      const value = formData.customer_questions?.[q.id];
      const validation = validateQuestionResponse(q, value);
      if (!validation.isValid) {
        newErrors[q.id] = validation.message || 'Trường này là bắt buộc';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Bạn cần đăng nhập để gửi đơn vay.');
      navigate('/auth');
      return;
    }
    if (!validateAll()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Tạm thời chọn advisorId mặc định (có thể cho chọn ở cuối form nếu muốn)
      const advisorId = null;
      const result = await LoanApplicationService.completeApplication(
        user.id,
        DEFAULT_PRODUCT_TYPE,
        formData.customer_questions,
        advisorId
      );
      toast.success('Gửi đơn vay thành công!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi đơn vay.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Đăng ký vay tín dụng (1 trang)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {visibleQuestions.map(renderQuestionField)}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi đơn vay'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default OnePageLoanApplicationForm; 