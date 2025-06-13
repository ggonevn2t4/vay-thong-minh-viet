
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoanEligibilityChecker from '@/components/LoanEligibilityChecker';
import LoanSimulator from '@/components/LoanSimulator';
import FeedbackSystem from '@/components/FeedbackSystem';
import CreditProfileOptimizer from '@/components/CreditProfileOptimizer';
import InterestRateNegotiator from '@/components/InterestRateNegotiator';
import SmartLoanTracker from '@/components/SmartLoanTracker';
import PersonalFinanceConsultant from '@/components/PersonalFinanceConsultant';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, TrendingUp, MessageSquare, User, Calculator, BarChart } from 'lucide-react';

const LoanEligibility = () => {
  return (
    <Layout>
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Trung tâm tài chính thông minh</h1>
            <p className="text-lg text-gray-600 mb-6">
              Giải pháp toàn diện để tối ưu hóa tài chính cá nhân và có được khoản vay tốt nhất
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <Link to="/document-checklist">
                <Button variant="outline" className="flex items-center">
                  Xem danh sách giấy tờ cần thiết <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          <Tabs defaultValue="eligibility" className="max-w-6xl mx-auto">
            {/* Mobile-friendly tab layout */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8 h-auto gap-1 bg-white p-1 rounded-lg shadow-sm">
              <TabsTrigger 
                value="eligibility" 
                className="flex flex-col items-center text-xs p-2 h-auto gap-1 data-[state=active]:bg-brand-100"
              >
                <Calculator className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">Đánh giá khả năng</span>
              </TabsTrigger>
              <TabsTrigger 
                value="optimizer" 
                className="flex flex-col items-center text-xs p-2 h-auto gap-1 data-[state=active]:bg-brand-100"
              >
                <TrendingUp className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">Tối ưu hồ sơ</span>
              </TabsTrigger>
              <TabsTrigger 
                value="negotiator" 
                className="flex flex-col items-center text-xs p-2 h-auto gap-1 data-[state=active]:bg-brand-100"
              >
                <Target className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">Đàm phán lãi suất</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tracker" 
                className="flex flex-col items-center text-xs p-2 h-auto gap-1 data-[state=active]:bg-brand-100"
              >
                <BarChart className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">Theo dõi vay</span>
              </TabsTrigger>
              <TabsTrigger 
                value="consultant" 
                className="flex flex-col items-center text-xs p-2 h-auto gap-1 data-[state=active]:bg-brand-100"
              >
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">Tư vấn chuyên sâu</span>
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                className="flex flex-col items-center text-xs p-2 h-auto gap-1 data-[state=active]:bg-brand-100"
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">Góp ý</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="eligibility">
              <LoanEligibilityChecker />
            </TabsContent>
            
            <TabsContent value="optimizer">
              <CreditProfileOptimizer />
            </TabsContent>
            
            <TabsContent value="negotiator">
              <InterestRateNegotiator />
            </TabsContent>
            
            <TabsContent value="tracker">
              <SmartLoanTracker />
            </TabsContent>
            
            <TabsContent value="consultant">
              <PersonalFinanceConsultant />
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="max-w-2xl mx-auto">
                <FeedbackSystem />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Lợi ích của nền tảng tài chính thông minh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Tối ưu hóa hồ sơ tín dụng</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Phân tích chi tiết điểm tín dụng hiện tại</li>
                  <li>Kế hoạch cải thiện từng bước cụ thể</li>
                  <li>Theo dõi tiến độ theo thời gian thực</li>
                  <li>Dự đoán tác động của từng hành động</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Đàm phán lãi suất hiệu quả</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Chiến lược đàm phán được tối ưu</li>
                  <li>Mẫu thư đàm phán chuyên nghiệp</li>
                  <li>Tính toán tiết kiệm cụ thể</li>
                  <li>Theo dõi kết quả đàm phán</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanEligibility;
