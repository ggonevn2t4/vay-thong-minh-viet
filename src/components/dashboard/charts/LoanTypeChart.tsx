
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface LoanTypeData {
  name: string;
  value: number;
  amount: number;
  color: string;
}

interface LoanTypeChartProps {
  data: LoanTypeData[];
  config: any;
}

const LoanTypeChart = ({ data, config }: LoanTypeChartProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Phân bổ loại khoản vay</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
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
  );
};

export default LoanTypeChart;
