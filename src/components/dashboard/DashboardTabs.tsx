
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './tabs/OverviewTab';
import PerformanceTab from './tabs/PerformanceTab';
import TrendsTab from './tabs/TrendsTab';
import AdvisorsTab from './tabs/AdvisorsTab';

interface DashboardData {
  monthlyData: Array<{
    month: string;
    loans: number;
    revenue: number;
    applications: number;
    approvalRate: number;
  }>;
  loanTypeData: Array<{
    name: string;
    value: number;
    amount: number;
    color: string;
  }>;
  advisorPerformance: Array<{
    name: string;
    clients: number;
    conversion: number;
    revenue: number;
  }>;
  performanceMetrics: Array<{
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: any;
    color: string;
    description: string;
  }>;
  lastUpdated: Date;
}

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  data: DashboardData;
  chartConfig: any;
}

const DashboardTabs = ({ activeTab, onTabChange, data, chartConfig }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
        <TabsTrigger value="trends">Xu hướng</TabsTrigger>
        <TabsTrigger value="advisors">Tư vấn viên</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OverviewTab 
          monthlyData={data.monthlyData} 
          loanTypeData={data.loanTypeData} 
          chartConfig={chartConfig} 
        />
      </TabsContent>

      <TabsContent value="performance" className="space-y-6">
        <PerformanceTab 
          monthlyData={data.monthlyData} 
          chartConfig={chartConfig} 
        />
      </TabsContent>

      <TabsContent value="trends" className="space-y-6">
        <TrendsTab 
          monthlyData={data.monthlyData} 
          chartConfig={chartConfig} 
        />
      </TabsContent>

      <TabsContent value="advisors" className="space-y-6">
        <AdvisorsTab 
          advisorPerformance={data.advisorPerformance} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
