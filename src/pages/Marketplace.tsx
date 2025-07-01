import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import BankingHeroSection from '@/components/marketplace/BankingHeroSection';
import LoanProductGrid from '@/components/marketplace/LoanProductGrid';
import BankingAdvantages from '@/components/marketplace/BankingAdvantages';
import BankEmployeeDirectory from '@/components/marketplace/BankEmployeeDirectory';
import PageSkeleton from '@/components/ui/page-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEmployeeSelect = (employee: any) => {
    console.log('Selected employee:', employee);
    // TODO: Navigate to conversation or contact flow
  };

  const handleCreateLoanRequest = () => {
    console.log('Create loan request');
    // TODO: Navigate to loan application
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          <BankingHeroSection 
            canCreateLoanRequest={!!user}
            onCreateLoanRequest={handleCreateLoanRequest}
          />
          
          <div className="container mx-auto px-4 py-8">
            <PageSkeleton type="marketplace" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <BankingHeroSection 
          canCreateLoanRequest={!!user}
          onCreateLoanRequest={handleCreateLoanRequest}
        />

        {/* Main Content with Tabs */}
        <div className="container mx-auto px-4 py-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="products" className="text-sm">
                  Sản phẩm vay
                </TabsTrigger>
                <TabsTrigger value="advisors" className="text-sm">
                  Nhân viên ngân hàng
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="products" className="space-y-16">
              <LoanProductGrid />
              <BankingAdvantages />
            </TabsContent>

            <TabsContent value="advisors">
              <BankEmployeeDirectory onSelectEmployee={handleEmployeeSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
