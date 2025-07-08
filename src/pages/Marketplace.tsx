import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import BankEmployeeDirectory from '@/components/marketplace/BankEmployeeDirectory';
import LoanProductGrid from '@/components/marketplace/LoanProductGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Users } from 'lucide-react';

interface LoanRequest {
  id: string;
  borrowerName: string;
  amount: number;
  purpose: string;
  term: number;
  location: string;
  creditScore: number;
  description: string;
  status: 'open' | 'in_negotiation' | 'approved' | 'closed';
  createdAt: string;
  offers: number;
  assignedAdvisor?: {
    name: string;
    avatar?: string;
    title: string;
  };
}

interface BankOffer {
  id: string;
  bankName: string;
  bankLogo: string;
  loanType: string;
  interestRate: number;
  maxAmount: number;
  minAmount: number;
  term: string;
  requirements: string[];
  processingTime: string;
  location: string;
  rating: number;
  advisor?: {
    name: string;
    avatar?: string;
    title: string;
  };
}

const Marketplace = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  const handleEmployeeSelect = (employee: any) => {
    console.log('Selected employee:', employee);
    // TODO: Navigate to conversation or contact flow
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Marketplace Tài Chính
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Khám phá các sản phẩm tài chính và kết nối với các chuyên gia tư vấn 
              để tìm giải pháp vay vốn phù hợp nhất
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Sản phẩm tài chính
              </TabsTrigger>
              <TabsTrigger value="advisors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tư vấn viên
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Sản Phẩm Tài Chính
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Tìm hiểu và so sánh các sản phẩm vay vốn từ nhiều ngân hàng khác nhau
                </p>
              </div>
              <LoanProductGrid />
            </TabsContent>

            <TabsContent value="advisors" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nhân viên ngân hàng tại khu vực của bạn
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Kết nối trực tiếp với các chuyên gia tư vấn tại ngân hàng
                </p>
              </div>
              <BankEmployeeDirectory onSelectEmployee={handleEmployeeSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
