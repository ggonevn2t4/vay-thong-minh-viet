
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  loans: number;
  revenue: number;
  applications: number;
  approvalRate: number;
}

interface ApprovalRateChartProps {
  data: MonthlyData[];
  config: any;
}

const ApprovalRateChart = ({ data, config }: ApprovalRateChartProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Tỷ lệ duyệt theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
  );
};

export default ApprovalRateChart;
