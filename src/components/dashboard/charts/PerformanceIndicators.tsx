
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const PerformanceIndicators = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Chỉ số hiệu suất</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Mục tiêu doanh thu tháng</span>
            <span className="font-bold text-green-600">75%</span>
          </div>
          <Progress value={75} className="h-3" />
          <p className="text-xs text-gray-500">1.35B / 1.8B VND</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Tỷ lệ giữ chân khách hàng</span>
            <span className="font-bold text-blue-600">92%</span>
          </div>
          <Progress value={92} className="h-3" />
          <p className="text-xs text-gray-500">Cao hơn 5% so với kỳ trước</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Hiệu suất tư vấn viên</span>
            <span className="font-bold text-purple-600">87%</span>
          </div>
          <Progress value={87} className="h-3" />
          <p className="text-xs text-gray-500">Trung bình ngành 82%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceIndicators;
