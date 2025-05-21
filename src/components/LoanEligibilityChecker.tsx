import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, FileText } from 'lucide-react';

const eligibilitySchema = z.object({
  monthlyIncome: z.string().min(1, {
    message: "Vui lòng nhập thu nhập hàng tháng",
  }).transform(val => Number(val)),
  employmentType: z.enum(["full-time", "part-time", "self-employed", "retired", "unemployed"], {
    required_error: "Vui lòng chọn loại hình công việc",
  }),
  hasExistingLoan: z.boolean().default(false),
  creditScore: z.string().transform(val => Number(val)),
  age: z.string().min(1, {
    message: "Vui lòng nhập tuổi của bạn",
  }).transform(val => Number(val)),
  hasSavings: z.boolean().default(false),
});

type EligibilityFormValues = z.infer<typeof eligibilitySchema>;

const LoanEligibilityChecker = () => {
  const { toast } = useToast();
  const [result, setResult] = useState<{
    eligible: boolean;
    message: string;
    score: number;
    recommendations: string[];
  } | null>(null);
  
  const form = useForm<EligibilityFormValues>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      monthlyIncome: "",
      employmentType: "full-time",
      hasExistingLoan: false,
      creditScore: "650",
      age: "",
      hasSavings: false,
    },
  });
  
  const onSubmit = (values: EligibilityFormValues) => {
    // Calculate eligibility score
    let score = 0;
    const recommendations: string[] = [];
    
    // Income factor (0-40 points)
    if (values.monthlyIncome >= 20000000) score += 40;
    else if (values.monthlyIncome >= 15000000) score += 30;
    else if (values.monthlyIncome >= 10000000) score += 20;
    else if (values.monthlyIncome >= 7000000) score += 10;
    else recommendations.push("Tăng thu nhập hoặc tìm việc làm thêm để cải thiện khả năng vay");
    
    // Employment type (0-20 points)
    switch (values.employmentType) {
      case "full-time": score += 20; break;
      case "part-time": score += 10; break;
      case "self-employed": score += 15; break;
      case "retired": score += 10; break;
      case "unemployed": 
        score += 0; 
        recommendations.push("Tìm việc làm ổn định để tăng khả năng được vay");
        break;
    }
    
    // Existing loans (-10 or 0 points)
    if (values.hasExistingLoan) {
      score -= 10;
      recommendations.push("Giảm các khoản nợ hiện tại trước khi vay thêm");
    }
    
    // Credit score (0-20 points)
    if (values.creditScore >= 800) score += 20;
    else if (values.creditScore >= 700) score += 15;
    else if (values.creditScore >= 650) score += 10;
    else if (values.creditScore >= 600) score += 5;
    else recommendations.push("Cải thiện điểm tín dụng bằng cách thanh toán đúng hạn các khoản vay và hóa đơn");
    
    // Age factor (0-10 points)
    if (values.age >= 25 && values.age <= 55) score += 10;
    else if (values.age >= 22 && values.age < 25) score += 5;
    else if (values.age > 55 && values.age <= 65) score += 5;
    else recommendations.push("Tuổi nằm ngoài khoảng tối ưu cho khoản vay");
    
    // Savings (0 or 10 points)
    if (values.hasSavings) score += 10;
    else recommendations.push("Tạo một khoản tiết kiệm để tăng khả năng được duyệt vay");
    
    // Determine eligibility
    const eligible = score >= 50;
    let message = "";
    
    if (score >= 80) {
      message = "Bạn có khả năng cao được phê duyệt khoản vay với lãi suất tốt.";
    } else if (score >= 50) {
      message = "Bạn có khả năng được phê duyệt khoản vay nhưng lãi suất có thể cao hơn.";
    } else {
      message = "Bạn có thể gặp khó khăn trong việc được phê duyệt khoản vay tại thời điểm này.";
    }
    
    setResult({
      eligible,
      message,
      score,
      recommendations: recommendations.length ? recommendations : ["Hồ sơ của bạn đã rất tốt!"],
    });
    
    toast({
      title: "Đã hoàn tất đánh giá",
      description: "Kết quả đánh giá đã được hiển thị bên dưới.",
    });
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8 border-brand-200">
        <CardHeader className="bg-brand-50">
          <CardTitle className="text-2xl text-brand-700">Kiểm tra khả năng vay vốn</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn dưới đây để nhận đánh giá nhanh về khả năng vay vốn
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thu nhập hàng tháng (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ví dụ: 10000000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhập tổng thu nhập hàng tháng của bạn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuổi</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ví dụ: 30"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nhập tuổi hiện tại của bạn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại hình công việc</FormLabel>
                      <div className="relative">
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="full-time">Toàn thời gian</option>
                          <option value="part-time">Bán thời gian</option>
                          <option value="self-employed">Tự kinh doanh</option>
                          <option value="retired">Đã nghỉ hưu</option>
                          <option value="unemployed">Thất nghiệp</option>
                        </select>
                      </div>
                      <FormDescription>
                        Chọn loại hình công việc hiện tại của bạn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="creditScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điểm tín dụng (ước tính)</FormLabel>
                      <div className="relative">
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="850">Rất tốt (800-850)</option>
                          <option value="750">Tốt (700-799)</option>
                          <option value="650">Khá (650-699)</option>
                          <option value="600">Trung bình (600-649)</option>
                          <option value="550">Dưới trung bình (&lt;600)</option>
                        </select>
                      </div>
                      <FormDescription>
                        Chọn mức đánh giá tín dụng gần nhất với tình hình của bạn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasExistingLoan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Bạn hiện có khoản vay đang trả góp
                        </FormLabel>
                        <FormDescription>
                          Chọn nếu bạn đang có khoản vay cần trả góp hàng tháng
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasSavings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Bạn có khoản tiết kiệm
                        </FormLabel>
                        <FormDescription>
                          Chọn nếu bạn có tài khoản tiết kiệm với số dư đáng kể
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto">
                  Kiểm tra khả năng vay
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card className={`border-2 ${result.eligible ? 'border-green-500' : 'border-amber-500'} shadow-lg`}>
          <CardHeader className={`${result.eligible ? 'bg-green-50' : 'bg-amber-50'}`}>
            <div className="flex items-center space-x-2">
              {result.eligible ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <FileText className="h-6 w-6 text-amber-600" />
              )}
              <CardTitle className={`${result.eligible ? 'text-green-700' : 'text-amber-700'}`}>
                {result.eligible ? 'Bạn có khả năng được vay!' : 'Khả năng vay hạn chế'}
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Điểm đánh giá: <span className="font-semibold">{result.score}/100</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{result.message}</p>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Khuyến nghị:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
            
            {result.eligible && (
              <div className="bg-green-50 p-4 rounded-md mt-4">
                <h3 className="font-medium text-green-800 mb-2">Các bước tiếp theo:</h3>
                <ol className="list-decimal pl-5 space-y-1 text-green-700">
                  <li>Hoàn thành khảo sát chi tiết để nhận đề xuất khoản vay phù hợp nhất</li>
                  <li>Chuẩn bị hồ sơ vay vốn theo yêu cầu của ngân hàng</li>
                  <li>Liên hệ với chuyên viên tư vấn để được hướng dẫn chi tiết</li>
                </ol>
              </div>
            )}
            
            {!result.eligible && (
              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <h3 className="font-medium text-blue-800 mb-2">Chúng tôi vẫn có thể giúp bạn:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Tham khảo danh sách các ngân hàng có điều kiện vay dễ dàng hơn</li>
                  <li>Tư vấn miễn phí về cách cải thiện hồ sơ vay vốn</li>
                  <li>Đăng ký nhận thông báo khi có chương trình vay ưu đãi</li>
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-2">
            <Button variant="outline" onClick={() => setResult(null)}>
              Kiểm tra lại
            </Button>
            <Button
              className={result.eligible ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => {
                toast({
                  title: "Đã đăng ký tư vấn",
                  description: "Chuyên viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.",
                });
              }}
            >
              Đăng ký tư vấn miễn phí
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default LoanEligibilityChecker;
