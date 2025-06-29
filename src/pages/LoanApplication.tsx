
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoanApplicationFlow from '@/components/loan-flow/LoanApplicationFlow';

const LoanApplication = () => {
  console.log('LoanApplication page loaded successfully');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <LoanApplicationFlow />
      </div>
    </Layout>
  );
};

export default LoanApplication;
