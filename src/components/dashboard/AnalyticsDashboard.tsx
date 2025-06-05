
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, Clock, Target, Activity, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalyticsDashboard = () => {
  // Enhanced mock data for charts
  const monthlyData = [
    { month: 'Jan', loans: 45, revenue: 1200000000, applications: 89, approvalRate: 67 },
    { month: 'Feb', loans: 52, revenue: 1400000000, applications: 95, approvalRate: 71 },
    { month: 'Mar', loans: 48, revenue: 1300000000, applications: 87, approvalRate: 69 },
    { month: 'Apr', loans: 61, revenue: 1650000000, applications: 112, approvalRate: 74 },
    { month: 'May', loans: 55, revenue: 1480000000, applications: 98, approvalRate: 72 },
    { month: 'Jun', loans: 67, revenue: 1800000000, applications: 125, approvalRate: 76 },
  ];

  const loanTypeData = [
    { name: 'Vay tiêu dùng', value: 35, amount: 2400000000, color: '#3B82F6' },
    { name: 'Vay mua nhà', value: 28, amount: 4200000000, color: '#10B981' },
    { name: 'Vay mua xe', value: 22, amount: 1800000000, color: '#F59E0B' },
    { name: 'Vay kinh doanh', value: 15, amount: 3100000000, color: '#EF4444' },
  ];

  const advisorPerformance = [
    { name: 'Nguyễn Thị Lan', clients: 45, conversion: 82, revenue: 850000000 },
    { name: 'Trần Văn Minh', clients: 38, conversion: 76, revenue: 720000000 },
    { name: 'Lê Thị Hoa', clients: 42, conversion: 79, revenue: 790000000 },
    { name: 'Phạm Văn Đức', clients: 35, conversion: 73, revenue: 650000000 },
  ];

  const performanceMetrics = [
    {
      title: "Tỷ lệ chuyển đổi",
      value: "23.5%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      description: "Tăng so với tháng trước"
    },
    {
      title: "Thời gian xử lý TB",
      value: "3.2 ngày",
      change: "-0.5 ngày",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      description: "Cải thiện hiệu suất"
    },
    {
      title: "Điểm hài lòng KH",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: Activity,
      color: "text-purple-600",
      description: "Phản hồi tích cực"
    },
    {
      title: "Tăng trưởng tháng",
      value: "12.5%",
      change: "+3.2%",
      trend: "up",
      icon: Zap,
      color: "text-orange-600",
      description: "Vượt mục tiêu"
    }
  ];

  const chartConfig = {
    loans: {
      label: "Khoản vay",
      color: "#3B82F6",
    },
    revenue: {
      label: "Doanh thu",
      color: "#10B981",
    },
    applications: {
      label: "Đơn đăng ký",
      color: "#F59E0B",
    },
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200">
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
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
          <TabsTrigger value="trends">Xu hướng</TabsTrigger>
          <TabsTrigger value="advisors">Tư vấn viên</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Loan Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bổ loại khoản vay</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
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
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {loanTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <Badge variant="secondary">{item.value}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Approval Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ duyệt theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[60, 80]} tickFormatter={(value) => `${value}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="approvalRate" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Performance Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Chỉ số hiệu suất</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Mục tiêu doanh thu tháng</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">1.35B / 1.8B VND</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tỷ lệ giữ chân khách hàng</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Cao hơn 5% so với kỳ trước</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Hiệu suất tư vấn viên</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Trung bình ngành 82%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng đăng ký và duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="applications" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="loans" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất tư vấn viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advisorPerformance.map((advisor, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{advisor.name}</h4>
                        <p className="text-sm text-gray-600">{advisor.clients} khách hàng</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {advisor.conversion}% chuyển đổi
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Doanh thu tháng</span>
                        <span className="font-medium">{(advisor.revenue / 1000000).toFixed(0)}M VND</span>
                      </div>
                      <Progress value={advisor.conversion} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
