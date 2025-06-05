
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, RefreshCw, Download } from 'lucide-react';

interface DashboardFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  region: string;
  onRegionChange: (region: string) => void;
  loanType: string;
  onLoanTypeChange: (type: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
  lastUpdated: Date;
}

const DashboardFilters = ({
  dateRange,
  onDateRangeChange,
  region,
  onRegionChange,
  loanType,
  onLoanTypeChange,
  onRefresh,
  onExport,
  isLoading,
  lastUpdated
}: DashboardFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 tháng gần nhất</SelectItem>
                <SelectItem value="12months">12 tháng gần nhất</SelectItem>
                <SelectItem value="ytd">Từ đầu năm</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={onRegionChange}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="north">Miền Bắc</SelectItem>
                <SelectItem value="central">Miền Trung</SelectItem>
                <SelectItem value="south">Miền Nam</SelectItem>
              </SelectContent>
            </Select>

            <Select value={loanType} onValueChange={onLoanTypeChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Loại khoản vay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="consumer">Vay tiêu dùng</SelectItem>
                <SelectItem value="mortgage">Vay mua nhà</SelectItem>
                <SelectItem value="auto">Vay mua xe</SelectItem>
                <SelectItem value="business">Vay kinh doanh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Dữ liệu thời gian thực
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Đồng bộ với hệ thống
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;
