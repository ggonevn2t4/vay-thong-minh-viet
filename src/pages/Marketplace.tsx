import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import BankEmployeeDirectory from '@/components/marketplace/BankEmployeeDirectory';

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
              Marketplace Tư Vấn Viên
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Kết nối với các chuyên gia tư vấn tài chính và nhân viên ngân hàng chuyên nghiệp 
              để được hỗ trợ tốt nhất cho nhu cầu vay vốn của bạn
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <BankEmployeeDirectory onSelectEmployee={handleEmployeeSelect} />
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
