
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { FinancialData } from '@/services/aiAdvisoryService';

const formSchema = z.object({
  monthly_income: z.number().min(1000000, 'Thu nhập tối thiểu 1,000,000 VNĐ'),
  monthly_expenses: z.number().min(0, 'Chi phí phải lớn hơn 0'),
  existing_debts: z.number().min(0, 'Nợ hiện tại phải lớn hơn hoặc bằng 0'),
  credit_score: z.number().min(300).max(850).optional(),
  employment_type: z.string().min(1, 'Vui lòng chọn loại hình công việc'),
  work_experience_years: z.number().min(0, 'Kinh nghiệm làm việc phải lớn hơn hoặc bằng 0'),
  desired_loan_amount: z.number().min(10000000, 'Số tiền vay tối thiểu 10,000,000 VNĐ'),
  loan_purpose: z.string().min(10, 'Vui lòng mô tả mục đích vay ít nhất 10 ký tự'),
  preferred_term_months: z.number().min(6).max(360, 'Thời hạn vay từ 6 đến 360 tháng')
});

interface AIAdvisoryFormProps {
  onSubmit: (data: FinancialData) => void;
  isLoading: boolean;
  initialData?: Partial<FinancialData>;
}

const AIAdvisoryForm = ({ onSubmit, isLoading, initialData }: AIAdvisoryFormProps) => {
  const form = useForm<FinancialData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthly_income: initialData?.monthly_income || 0,
      monthly_expenses: initialData?.monthly_expenses || 0,
      existing_debts: initialData?.existing_debts || 0,
      credit_score: initialData?.credit_score || undefined,
      employment_type: initialData?.employment_type || '',
      work_experience_years: initialData?.work_experience_years || 0,
      desired_loan_amount: initialData?.desired_loan_amount || 0,
      loan_purpose: initialData?.loan_purpose || '',
      preferred_term_months: initialData?.preferred_term_months || 12
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin Tài chính</CardTitle>
        <CardDescription>
          Cung cấp thông tin chính xác để AI có thể phân tích tốt nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="monthly_income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thu nhập hàng tháng (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15000000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Thu nhập ròng sau thuế
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthly_expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi phí sinh hoạt hàng tháng (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="8000000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Tổng chi phí cố định và sinh hoạt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="existing_debts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng nợ hiện tại (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Bao gồm thẻ tín dụng, vay tiêu dùng, v.v.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credit_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm tín dụng (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="700"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Nếu biết điểm tín dụng của bạn (300-850)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại hình công việc</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại hình công việc" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employee">Nhân viên công ty</SelectItem>
                        <SelectItem value="self_employed">Tự kinh doanh</SelectItem>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                        <SelectItem value="retired">Đã nghỉ hưu</SelectItem>
                        <SelectItem value="student">Sinh viên</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work_experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số năm kinh nghiệm làm việc</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Tổng số năm kinh nghiệm trong nghề
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desired_loan_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền muốn vay (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Số tiền bạn muốn vay
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_term_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời hạn vay mong muốn (tháng)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thời hạn vay" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="12">12 tháng</SelectItem>
                        <SelectItem value="24">24 tháng</SelectItem>
                        <SelectItem value="36">36 tháng</SelectItem>
                        <SelectItem value="48">48 tháng</SelectItem>
                        <SelectItem value="60">60 tháng</SelectItem>
                        <SelectItem value="84">84 tháng</SelectItem>
                        <SelectItem value="120">120 tháng</SelectItem>
                        <SelectItem value="180">180 tháng</SelectItem>
                        <SelectItem value="240">240 tháng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="loan_purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mục đích vay</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết mục đích sử dụng khoản vay..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả càng chi tiết càng giúp AI phân tích chính xác hơn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-brand-600 hover:bg-brand-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                'Bắt đầu Phân tích AI'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AIAdvisoryForm;
