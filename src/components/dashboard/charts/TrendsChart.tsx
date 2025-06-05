
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  loans: number;
  revenue: number;
  applications: number;
  approvalRate: number;
}

interface TrendsChartProps {
  data: MonthlyData[];
  config: any;
}

const TrendsChart = ({ data, config }: TrendsChartProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Xu hướng đăng ký và duyệt</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
  );
};

export default TrendsChart;
