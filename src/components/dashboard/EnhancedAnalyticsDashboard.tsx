
import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';
import DashboardFilters from './DashboardFilters';
import PerformanceMetricsGrid from './charts/PerformanceMetricsGrid';
import SystemAlert from './charts/SystemAlert';
import DashboardTabs from './DashboardTabs';
import DashboardSkeleton from './DashboardSkeleton';

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
    return <DashboardSkeleton />;
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

      <SystemAlert />

      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        data={data}
        chartConfig={chartConfig}
      />
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
