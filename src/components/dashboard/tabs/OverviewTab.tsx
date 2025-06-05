
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import RevenueChart from '../charts/RevenueChart';
import LoanTypeChart from '../charts/LoanTypeChart';

interface MonthlyData {
  month: string;
  loans: number;
  revenue: number;
  applications: number;
  approvalRate: number;
}

interface LoanTypeData {
  name: string;
  value: number;
  amount: number;
  color: string;
}

interface OverviewTabProps {
  monthlyData: MonthlyData[];
  loanTypeData: LoanTypeData[];
  chartConfig: any;
}

const OverviewTab = ({ monthlyData, loanTypeData, chartConfig }: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RevenueChart data={monthlyData} config={chartConfig} />
      <LoanTypeChart data={loanTypeData} config={chartConfig} />
    </div>
  );
};

export default OverviewTab;
