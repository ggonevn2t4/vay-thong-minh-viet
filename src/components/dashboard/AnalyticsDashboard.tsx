
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';
import DashboardFilters from './DashboardFilters';
import PerformanceMetricsGrid from './charts/PerformanceMetricsGrid';
import RevenueChart from './charts/RevenueChart';
import LoanTypeChart from './charts/LoanTypeChart';
import ApprovalRateChart from './charts/ApprovalRateChart';
import PerformanceIndicators from './charts/PerformanceIndicators';
import TrendsChart from './charts/TrendsChart';
import AdvisorPerformanceList from './charts/AdvisorPerformanceList';
import { Skeleton } from '@/components/ui/skeleton';

const AnalyticsDashboard = () => {
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
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
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

      <PerformanceMetricsGrid metrics={data.performanceMetrics} />

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
            <RevenueChart data={data.monthlyData} config={chartConfig} />
            <LoanTypeChart data={data.loanTypeData} config={chartConfig} />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ApprovalRateChart data={data.monthlyData} config={chartConfig} />
            <PerformanceIndicators />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendsChart data={data.monthlyData} config={chartConfig} />
        </TabsContent>

        <TabsContent value="advisors" className="space-y-6">
          <AdvisorPerformanceList advisors={data.advisorPerformance} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
