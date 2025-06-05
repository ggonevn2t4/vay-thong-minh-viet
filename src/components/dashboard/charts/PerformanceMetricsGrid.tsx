
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, Clock, Activity, Zap } from 'lucide-react';

interface PerformanceMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  description: string;
}

interface PerformanceMetricsGridProps {
  metrics: PerformanceMetric[];
}

const PerformanceMetricsGrid = ({ metrics }: PerformanceMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = index === 0 ? Target : index === 1 ? Clock : index === 2 ? Activity : Zap;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full opacity-50"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gray-50`}>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`text-sm flex items-center mt-1 ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? '↗️' : '↘️'} {metric.change}
              </div>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PerformanceMetricsGrid;
