import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Filter, X, Search } from 'lucide-react';

interface CustomerFiltersProps {
  onFiltersChange: (filters: CustomerFilters) => void;
  totalCustomers: number;
  filteredCount: number;
}

export interface CustomerFilters {
  search: string;
  riskLevel: string[];
  creditScoreRange: [number, number];
  incomeRange: [number, number];
  loanStatus: string[];
  employmentType: string[];
  hasActiveLoans: boolean | null;
  joinedDateRange: string;
}

const CustomerFilters = ({ onFiltersChange, totalCustomers, filteredCount }: CustomerFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    riskLevel: [],
    creditScoreRange: [300, 850],
    incomeRange: [0, 100000000],
    loanStatus: [],
    employmentType: [],
    hasActiveLoans: null,
    joinedDateRange: 'all'
  });

  const updateFilters = (newFilters: Partial<CustomerFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const defaultFilters: CustomerFilters = {
      search: '',
      riskLevel: [],
      creditScoreRange: [300, 850],
      incomeRange: [0, 100000000],
      loanStatus: [],
      employmentType: [],
      hasActiveLoans: null,
      joinedDateRange: 'all'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(amount);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.riskLevel.length > 0) count++;
    if (filters.creditScoreRange[0] !== 300 || filters.creditScoreRange[1] !== 850) count++;
    if (filters.incomeRange[0] !== 0 || filters.incomeRange[1] !== 100000000) count++;
    if (filters.loanStatus.length > 0) count++;
    if (filters.employmentType.length > 0) count++;
    if (filters.hasActiveLoans !== null) count++;
    if (filters.joinedDateRange !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Bộ lọc khách hàng</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredCount}/{totalCustomers} khách hàng
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Thu gọn' : 'Mở rộng'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, số điện thoại, email..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Risk Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mức độ rủi ro</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'low', label: 'Thấp', color: 'bg-green-100 text-green-800' },
                  { value: 'medium', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'high', label: 'Cao', color: 'bg-red-100 text-red-800' }
                ].map(({ value, label, color }) => (
                  <Badge
                    key={value}
                    variant={filters.riskLevel.includes(value) ? 'default' : 'outline'}
                    className={`cursor-pointer ${filters.riskLevel.includes(value) ? color : ''}`}
                    onClick={() => updateFilters({ 
                      riskLevel: toggleArrayFilter(filters.riskLevel, value) 
                    })}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Credit Score Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Điểm tín dụng: {filters.creditScoreRange[0]} - {filters.creditScoreRange[1]}
              </label>
              <Slider
                value={filters.creditScoreRange}
                onValueChange={(value) => updateFilters({ creditScoreRange: value as [number, number] })}
                min={300}
                max={850}
                step={10}
                className="w-full"
              />
            </div>

            {/* Income Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Thu nhập: {formatCurrency(filters.incomeRange[0])} - {formatCurrency(filters.incomeRange[1])}
              </label>
              <Slider
                value={filters.incomeRange}
                onValueChange={(value) => updateFilters({ incomeRange: value as [number, number] })}
                min={0}
                max={100000000}
                step={1000000}
                className="w-full"
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại việc làm</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  'full_time',
                  'part_time', 
                  'freelancer',
                  'business_owner',
                  'unemployed'
                ].map(type => (
                  <Badge
                    key={type}
                    variant={filters.employmentType.includes(type) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => updateFilters({ 
                      employmentType: toggleArrayFilter(filters.employmentType, type) 
                    })}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Loan Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái vay</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'approved', label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
                  { value: 'pending', label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'rejected', label: 'Từ chối', color: 'bg-red-100 text-red-800' },
                  { value: 'reviewing', label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800' }
                ].map(({ value, label, color }) => (
                  <Badge
                    key={value}
                    variant={filters.loanStatus.includes(value) ? 'default' : 'outline'}
                    className={`cursor-pointer ${filters.loanStatus.includes(value) ? color : ''}`}
                    onClick={() => updateFilters({ 
                      loanStatus: toggleArrayFilter(filters.loanStatus, value) 
                    })}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Loans Filter */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Có khoản vay đang hoạt động</label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={filters.hasActiveLoans === true}
                  onCheckedChange={(checked) => updateFilters({ 
                    hasActiveLoans: checked ? true : null 
                  })}
                />
                <span className="text-sm text-muted-foreground">Có</span>
              </div>
            </div>

            {/* Joined Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thời gian tham gia</label>
              <Select 
                value={filters.joinedDateRange} 
                onValueChange={(value) => updateFilters({ joinedDateRange: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Xóa tất cả bộ lọc
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerFilters;