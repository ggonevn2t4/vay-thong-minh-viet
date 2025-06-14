
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, DollarSign } from 'lucide-react';

interface MarketplaceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  amountFilter: string;
  setAmountFilter: (value: string) => void;
  activeTab: string;
}

const MarketplaceFilters = ({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  amountFilter,
  setAmountFilter,
  activeTab
}: MarketplaceFiltersProps) => {
  return (
    <Card className="mb-8 shadow-lg border-0">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên, mục đích vay, ngân hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-gray-200 focus:border-brand-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[200px] h-12 border-gray-200">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khu vực</SelectItem>
                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                <SelectItem value="TP.HCM">TP.HCM</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
            
            {activeTab === 'requests' && (
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger className="w-full sm:w-[220px] h-12 border-gray-200">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Mức vay" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức vay</SelectItem>
                  <SelectItem value="under_100m">Dưới 100 triệu</SelectItem>
                  <SelectItem value="100m_500m">100 - 500 triệu</SelectItem>
                  <SelectItem value="over_500m">Trên 500 triệu</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceFilters;
