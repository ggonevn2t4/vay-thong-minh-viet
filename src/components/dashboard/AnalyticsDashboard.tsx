
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, Clock } from 'lucide-react';

const AnalyticsDashboard = () => {
  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', loans: 45, revenue: 1200000000 },
    { month: 'Feb', loans: 52, revenue: 1400000000 },
    { month: 'Mar', loans: 48, revenue: 1300000000 },
    { month: 'Apr', loans: 61, revenue: 1650000000 },
    { month: 'May', loans: 55, revenue: 1480000000 },
    { month: 'Jun', loans: 67, revenue: 1800000000 },
  ];

  const loanTypeData = [
    { name: 'Vay tiêu dùng', value: 35, color: '#3B82F6' },
    { name: 'Vay mua nhà', value: 28, color: '#10B981' },
    { name: 'Vay mua xe', value: 22, color: '#F59E0B' },
    { name: 'Vay kinh doanh', value: 15, color: '#EF4444' },
  ];

  const performanceMetrics = [
    {
      title: "Tỷ lệ chuyển đổi",
      value: "23.5%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Thời gian xử lý TB",
      value: "3.2 ngày",
      change: "-0.5 ngày",
      trend: "up",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Tỷ lệ từ chối",
      value: "12.8%",
      change: "-1.2%",
      trend: "up",
      icon: TrendingDown,
      color: "text-orange-600"
    },
    {
      title: "Khách hàng mới",
      value: "156",
      change: "+18",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gray-50`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`text-sm flex items-center mt-1 ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? '↗️' : '↘️'} {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Loans Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng khoản vay theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="loans" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Loan Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ loại khoản vay</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {loanTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {loanTypeData.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`} />
              <Tooltip 
                formatter={(value) => [`${(Number(value) / 1000000000).toFixed(2)} tỷ đ`, 'Doanh thu']}
              />
              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
