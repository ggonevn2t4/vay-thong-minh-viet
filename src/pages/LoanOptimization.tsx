
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import ExistingLoansManager from '@/components/loan-optimization/ExistingLoansManager';
import LoanOptimizationAnalysis from '@/components/loan-optimization/LoanOptimizationAnalysis';
import OptimizationAlerts from '@/components/loan-optimization/OptimizationAlerts';

const LoanOptimization = () => {
  const [activeTab, setActiveTab] = useState('existing-loans');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tối ưu hóa khoản vay hiện tại
          </h1>
          <p className="text-gray-600">
            Quản lý và tối ưu hóa các khoản vay hiện tại của bạn để tiết kiệm chi phí
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="existing-loans" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Khoản vay hiện tại</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Phân tích tối ưu</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Cảnh báo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing-loans" className="space-y-6">
            <ExistingLoansManager />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <LoanOptimizationAnalysis />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <OptimizationAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LoanOptimization;
