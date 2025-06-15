
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, DollarSign, FileText, Activity, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const SystemAnalytics = () => {
  // Mock data for charts
  const monthlyData = [
    { month: 'T1', users: 120, loans: 45, revenue: 2500000 },
    { month: 'T2', users: 150, loans: 60, revenue: 3200000 },
    { month: 'T3', users: 180, loans: 75, revenue: 4100000 },
    { month: 'T4', users: 220, loans: 90, revenue: 4800000 },
    { month: 'T5', users: 280, loans: 110, revenue: 5500000 },
    { month: 'T6', users: 320, loans: 130, revenue: 6200000 },
  ];

  const loanTypeData = [
    { name: 'Vay thế chấp', value: 45, color: '#3B82F6' },
    { name: 'Vay tín chấp', value: 30, color: '#10B981' },
    { name: 'Vay tiêu dùng', value: 20, color: '#F59E0B' },
    { name: 'Vay mua xe', value: 5, color: '#EF4444' },
  ];

  const performanceData = [
    { metric: 'Tỷ lệ duyệt vay', value: 68, target: 70 },
    { metric: 'Thời gian xử lý TB', value: 3.2, target: 3.0 },
    { metric: 'Độ hài lòng KH', value: 4.6, target: 4.5 },
    { metric: 'Tỷ lệ chuyển đổi', value: 15.8, target: 18.0 },
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Hệ thống xử lý hồ sơ đang chậm', time: '10 phút trước' },
    { id: 2, type: 'info', message: 'Cập nhật lãi suất từ 3 ngân hàng', time: '1 giờ trước' },
    { id: 3, type: 'error', message: 'Lỗi kết nối API ngân hàng ABC', time: '2 giờ trước' },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Phân tích hệ thống</h1>
            <p className="text-gray-600">Theo dõi hiệu suất và hoạt động của hệ thống</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% so với tháng trước
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-brand-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Khoản vay được duyệt</p>
                    <p className="text-2xl font-bold text-gray-900">456</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% so với tháng trước
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900">6.2B VND</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15% so với tháng trước
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Uptime hệ thống</p>
                    <p className="text-2xl font-bold text-gray-900">99.8%</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <Activity className="h-3 w-3 mr-1" />
                      Ổn định
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
              <TabsTrigger value="trends">Xu hướng</TabsTrigger>
              <TabsTrigger value="alerts">Cảnh báo</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tăng trưởng người dùng</CardTitle>
                    <CardDescription>Số lượng người dùng mới theo tháng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố loại vay</CardTitle>
                    <CardDescription>Tỷ lệ các loại khoản vay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={loanTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {loanTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo tháng</CardTitle>
                  <CardDescription>Tổng doanh thu từ các khoản vay</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value/1000000}M`} />
                      <Tooltip formatter={(value) => [`${value?.toLocaleString()} VND`, 'Doanh thu']} />
                      <Bar dataKey="revenue" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">{item.metric}</h3>
                        <span className={`text-sm px-2 py-1 rounded ${
                          item.value >= item.target 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.value >= item.target ? 'Đạt mục tiêu' : 'Chưa đạt'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Hiện tại: {item.value}{item.metric.includes('Thời gian') ? ' ngày' : item.metric.includes('Độ hài lòng') ? '/5' : '%'}</span>
                          <span>Mục tiêu: {item.target}{item.metric.includes('Thời gian') ? ' ngày' : item.metric.includes('Độ hài lòng') ? '/5' : '%'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.value >= item.target ? 'bg-green-600' : 'bg-red-600'
                            }`}
                            style={{ 
                              width: `${Math.min((item.value / item.target) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng hoạt động</CardTitle>
                  <CardDescription>So sánh các chỉ số quan trọng theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#3B82F6" name="Người dùng" />
                      <Line type="monotone" dataKey="loans" stroke="#10B981" name="Khoản vay" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Cảnh báo hệ thống
                  </CardTitle>
                  <CardDescription>Các thông báo và cảnh báo quan trọng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.type === 'error' 
                            ? 'border-red-500 bg-red-50' 
                            : alert.type === 'warning'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`font-medium ${
                            alert.type === 'error' 
                              ? 'text-red-800' 
                              : alert.type === 'warning'
                              ? 'text-yellow-800'
                              : 'text-blue-800'
                          }`}>
                            {alert.message}
                          </p>
                          <span className="text-sm text-gray-600">{alert.time}</span>
                        </div>
                      </div>
                    ))}
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

export default SystemAnalytics;
