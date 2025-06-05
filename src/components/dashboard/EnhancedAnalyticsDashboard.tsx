
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, Clock, Target, Activity, Zap, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardFilters from './DashboardFilters';
import { useToast } from '@/hooks/use-toast';

const EnhancedAnalyticsDashboard = () => {
  const { data, isLoading, lastRefresh, refreshData } = useDashboardData();
  const { toast } = useToast();
  
  const [dateRange, setDateRange] = useState('6months');
  const [region, setRegion] = useState('all');
  const [loanType, setLoanType] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const handleExport = () => {
    toast({
      title: "Xuất báo cáo thành công",
      description: "Báo cáo đã được tải xuống dưới định dạng PDF",
    });
  };

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

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-96 animate-pulse">
          <CardContent className="pt-6 h-full bg-gray-100 rounded"></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        region={region}
        onRegionChange={setRegion}
        loanType={loanType}
        onLoanTypeChange={setLoanType}
        onRefresh={refreshData}
        onExport={handleExport}
        isLoading={isLoading}
        lastUpdated={lastRefresh}
      />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.performanceMetrics.map((metric, index) => {
          const IconComponent = index === 0 ? Target : index === 1 ? Clock : index === 2 ? Activity : Zap;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full opacity-50"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
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
          );
        })}
      </div>

      {/* Alert for important updates */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Hệ thống đang hoạt động bình thường. Tất cả dữ liệu được cập nhật trong thời gian thực.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
          <TabsTrigger value="trends">Xu hướng</TabsTrigger>
          <TabsTrigger value="advisors">Tư vấn viên</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Xu hướng doanh thu</CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Tăng 12.5%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`} stroke="#6b7280" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        fill="#10B981"
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Loan Types Distribution */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Phân bổ loại khoản vay</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.loanTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.loanTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {data.loanTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium">{item.name}</span>
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
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Tỷ lệ duyệt theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis domain={[60, 80]} tickFormatter={(value) => `${value}%`} stroke="#6b7280" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="approvalRate" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 8, fill: '#3B82F6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Performance Indicators */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Chỉ số hiệu suất</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Mục tiêu doanh thu tháng</span>
                    <span className="font-bold text-green-600">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <p className="text-xs text-gray-500">1.35B / 1.8B VND</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Tỷ lệ giữ chân khách hàng</span>
                    <span className="font-bold text-blue-600">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                  <p className="text-xs text-gray-500">Cao hơn 5% so với kỳ trước</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Hiệu suất tư vấn viên</span>
                    <span className="font-bold text-purple-600">87%</span>
                  </div>
                  <Progress value={87} className="h-3" />
                  <p className="text-xs text-gray-500">Trung bình ngành 82%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Xu hướng đăng ký và duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
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
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Hiệu suất tư vấn viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.advisorPerformance.map((advisor, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{advisor.name}</h4>
                        <p className="text-sm text-gray-600">{advisor.clients} khách hàng</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {advisor.conversion}% chuyển đổi
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Doanh thu tháng</span>
                        <span className="font-bold text-green-600">{(advisor.revenue / 1000000).toFixed(0)}M VND</span>
                      </div>
                      <Progress value={advisor.conversion} className="h-2" />
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Hiệu suất cao
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Khách hàng hài lòng
                        </Badge>
                      </div>
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

export default EnhancedAnalyticsDashboard;
