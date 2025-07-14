
import React from 'react';
import Layout from '@/components/layout/Layout';
import OnePageLoanApplicationForm from '@/components/loan-flow/OnePageLoanApplicationForm';

const LoanApplication = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Đăng ký khoản vay</h1>
        <OnePageLoanApplicationForm />
      </div>
    </Layout>
  );
};

export default LoanApplication;
