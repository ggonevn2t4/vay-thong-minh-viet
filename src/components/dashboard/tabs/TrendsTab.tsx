
import TrendsChart from '../charts/TrendsChart';

interface MonthlyData {
  month: string;
  loans: number;
  revenue: number;
  applications: number;
  approvalRate: number;
}

interface TrendsTabProps {
  monthlyData: MonthlyData[];
  chartConfig: any;
}

const TrendsTab = ({ monthlyData, chartConfig }: TrendsTabProps) => {
  return <TrendsChart data={monthlyData} config={chartConfig} />;
};

export default TrendsTab;
