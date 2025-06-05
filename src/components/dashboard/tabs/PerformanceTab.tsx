
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ApprovalRateChart from '../charts/ApprovalRateChart';
import PerformanceIndicators from '../charts/PerformanceIndicators';

interface MonthlyData {
  month: string;
  loans: number;
  revenue: number;
  applications: number;
  approvalRate: number;
}

interface PerformanceTabProps {
  monthlyData: MonthlyData[];
  chartConfig: any;
}

const PerformanceTab = ({ monthlyData, chartConfig }: PerformanceTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ApprovalRateChart data={monthlyData} config={chartConfig} />
      <PerformanceIndicators />
    </div>
  );
};

export default PerformanceTab;
