
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface MonthlyData {
  month: string;
  loans: number;
  revenue: number;
  applications: number;
  approvalRate: number;
}

interface RevenueChartProps {
  data: MonthlyData[];
  config: any;
}

const RevenueChart = ({ data, config }: RevenueChartProps) => {
  return (
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
        <ChartContainer config={config} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
  );
};

export default RevenueChart;
