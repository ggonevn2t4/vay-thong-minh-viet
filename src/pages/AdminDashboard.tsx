
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, TrendingUp, DollarSign, FileText, BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DashboardStats } from '@/types/dashboard';
import AdvisorManagement from '@/components/dashboard/AdvisorManagement';
import CustomerManagement from '@/components/dashboard/CustomerManagement';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';

const AdminDashboard = () => {
  const [stats] = useState<DashboardStats>({
    totalUsers: 1250,
    totalAdvisors: 85,
    totalCustomers: 1165,
    activeLoans: 234,
    pendingRequests: 67,
    completedLoans: 892,
    monthlyGrowth: 12.5,
    revenue: 2450000000
  });

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Tư vấn viên",
      value: stats.totalAdvisors.toLocaleString(),
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Khoản vay đang xử lý",
      value: stats.activeLoans.toLocaleString(),
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Doanh thu tháng",
      value: formatCurrency(stats.revenue) + " đ",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển quản trị</h1>
            <p className="text-gray-600 mt-2">Quản lý hệ thống VayThôngMinh</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <TrendingUp className="h-4 w-4 mr-1" />
            Tăng trưởng {stats.monthlyGrowth}% tháng này
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Phân tích
            </TabsTrigger>
            <TabsTrigger value="advisors" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Tư vấn viên
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Khách hàng
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="advisors" className="space-y-6">
            <AdvisorManagement />
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-6">
            <CustomerManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
