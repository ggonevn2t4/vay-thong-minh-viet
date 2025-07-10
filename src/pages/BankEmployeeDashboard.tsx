
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoanApplicationsTab from '@/components/dashboard/bank-employee/LoanApplicationsTab';
import EnhancedCustomerManagement from '@/components/dashboard/enhanced/EnhancedCustomerManagement';
import ReportsTab from '@/components/dashboard/bank-employee/ReportsTab';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { FileText, Users, BarChart3, Settings } from 'lucide-react';

const BankEmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');

  return (
    <ProtectedRoute requiredRole="bank_employee">
      <Layout>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Nhân viên Ngân hàng</h1>
            <p className="text-lg text-gray-600 mt-2">Quản lý đơn vay và khách hàng</p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Đơn vay
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Khách hàng
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Báo cáo
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Cài đặt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <LoanApplicationsTab />
            </TabsContent>

            <TabsContent value="customers">
              <EnhancedCustomerManagement />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt hệ thống</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Thông báo</h4>
                      <p className="text-sm text-gray-600">Cấu hình thông báo và cảnh báo hệ thống</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Quy trình duyệt</h4>
                      <p className="text-sm text-gray-600">Thiết lập quy trình duyệt đơn vay tự động</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Báo cáo tùy chỉnh</h4>
                      <p className="text-sm text-gray-600">Tạo và lên lịch báo cáo định kỳ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default BankEmployeeDashboard;
