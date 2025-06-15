
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BankEmployeeDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trang dành cho nhân viên ngân hàng</h1>
          <p className="text-lg text-gray-600 mt-2">Quản lý các hoạt động liên quan đến khoản vay.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Duyệt đơn vay</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Xem và xử lý các đơn xin vay mới.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quản lý khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tra cứu thông tin và lịch sử vay của khách hàng.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo & Thống kê</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Theo dõi hiệu suất và các chỉ số quan trọng.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BankEmployeeDashboard;
