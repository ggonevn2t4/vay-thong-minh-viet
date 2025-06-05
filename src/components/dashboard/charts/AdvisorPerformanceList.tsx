
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AdvisorData {
  name: string;
  clients: number;
  conversion: number;
  revenue: number;
}

interface AdvisorPerformanceListProps {
  advisors: AdvisorData[];
}

const AdvisorPerformanceList = ({ advisors }: AdvisorPerformanceListProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Hiệu suất tư vấn viên</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {advisors.map((advisor, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{advisor.name}</h4>
                  <p className="text-sm text-gray-600">{advisor.clients} khách hàng</p>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  {advisor.conversion}% chuyển đổi
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Doanh thu tháng</span>
                  <span className="font-bold text-green-600">{(advisor.revenue / 1000000).toFixed(0)}M VND</span>
                </div>
                <Progress value={advisor.conversion} className="h-2" />
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Hiệu suất cao
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Khách hàng hài lòng
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvisorPerformanceList;
