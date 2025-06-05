
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { Search, Filter, MapPin, Clock, User, Building } from 'lucide-react';
import LoanRequestCard from '@/components/marketplace/LoanRequestCard';
import BankOfferCard from '@/components/marketplace/BankOfferCard';
import CreateLoanRequestModal from '@/components/marketplace/CreateLoanRequestModal';

interface LoanRequest {
  id: string;
  borrowerName: string;
  amount: number;
  purpose: string;
  term: number;
  location: string;
  creditScore: number;
  description: string;
  status: 'open' | 'in_negotiation' | 'approved' | 'closed';
  createdAt: string;
  offers: number;
}

interface BankOffer {
  id: string;
  bankName: string;
  bankLogo: string;
  loanType: string;
  interestRate: number;
  maxAmount: number;
  minAmount: number;
  term: string;
  requirements: string[];
  processingTime: string;
  location: string;
  rating: number;
}

const Marketplace = () => {
  const { isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([
    {
      id: 'LR-001',
      borrowerName: 'Nguyễn Văn An',
      amount: 200000000,
      purpose: 'Mua nhà',
      term: 240,
      location: 'Hà Nội',
      creditScore: 750,
      description: 'Cần vay để mua căn hộ đầu tiên, có thu nhập ổn định và lịch sử tín dụng tốt.',
      status: 'open',
      createdAt: '2024-01-15',
      offers: 3
    },
    {
      id: 'LR-002',
      borrowerName: 'Trần Thị Bình',
      amount: 500000000,
      purpose: 'Kinh doanh',
      term: 60,
      location: 'TP.HCM',
      creditScore: 720,
      description: 'Mở rộng cửa hàng kinh doanh thời trang, đã có 5 năm kinh nghiệm.',
      status: 'in_negotiation',
      createdAt: '2024-01-10',
      offers: 5
    },
    {
      id: 'LR-003',
      borrowerName: 'Lê Minh Cường',
      amount: 150000000,
      purpose: 'Mua xe',
      term: 36,
      location: 'Đà Nẵng',
      creditScore: 680,
      description: 'Cần mua xe để phục vụ công việc kinh doanh vận tải.',
      status: 'open',
      createdAt: '2024-01-12',
      offers: 2
    }
  ]);

  const [bankOffers, setBankOffers] = useState<BankOffer[]>([
    {
      id: 'BO-001',
      bankName: 'Ngân hàng Vietcombank',
      bankLogo: '🏦',
      loanType: 'Vay mua nhà',
      interestRate: 8.5,
      maxAmount: 3000000000,
      minAmount: 100000000,
      term: '5-30 năm',
      requirements: ['Thu nhập tối thiểu 15 triệu/tháng', 'Có tài sản đảm bảo', 'Lịch sử tín dụng tốt'],
      processingTime: '7-14 ngày',
      location: 'Toàn quốc',
      rating: 4.5
    },
    {
      id: 'BO-002',
      bankName: 'Ngân hàng Techcombank',
      bankLogo: '💳',
      loanType: 'Vay kinh doanh',
      interestRate: 10.2,
      maxAmount: 5000000000,
      minAmount: 50000000,
      term: '1-7 năm',
      requirements: ['Doanh nghiệp hoạt động tối thiểu 2 năm', 'Doanh thu ổn định', 'Kế hoạch kinh doanh rõ ràng'],
      processingTime: '5-10 ngày',
      location: 'Hà Nội, TP.HCM',
      rating: 4.7
    },
    {
      id: 'BO-003',
      bankName: 'Ngân hàng BIDV',
      bankLogo: '🏛️',
      loanType: 'Vay tín chấp',
      interestRate: 12.5,
      maxAmount: 500000000,
      minAmount: 10000000,
      term: '6 tháng - 5 năm',
      requirements: ['Thu nhập tối thiểu 8 triệu/tháng', 'Công việc ổn định', 'Không nợ xấu'],
      processingTime: '3-7 ngày',
      location: 'Toàn quốc',
      rating: 4.3
    }
  ]);

  const filteredRequests = loanRequests.filter(request => {
    const matchesSearch = request.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || request.location === locationFilter;
    const matchesAmount = amountFilter === 'all' || 
                         (amountFilter === 'under_100m' && request.amount < 100000000) ||
                         (amountFilter === '100m_500m' && request.amount >= 100000000 && request.amount <= 500000000) ||
                         (amountFilter === 'over_500m' && request.amount > 500000000);
    
    return matchesSearch && matchesLocation && matchesAmount;
  });

  const filteredOffers = bankOffers.filter(offer => {
    const matchesSearch = offer.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || 
                           offer.location === 'Toàn quốc' || 
                           offer.location.includes(locationFilter);
    
    return matchesSearch && matchesLocation;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Marketplace Vay Vốn</h1>
            <p className="text-gray-600">Kết nối người vay và nhân viên ngân hàng một cách hiệu quả</p>
          </div>
          {isSignedIn && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 md:mt-0 bg-brand-600 hover:bg-brand-700"
            >
              Đăng yêu cầu vay
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, mục đích vay..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
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
                  <SelectTrigger className="w-full md:w-[200px]">
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
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Yêu cầu vay ({filteredRequests.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Sản phẩm ngân hàng ({filteredOffers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <LoanRequestCard key={request.id} request={request} />
              ))}
            </div>
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy yêu cầu vay nào phù hợp.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <BankOfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            {filteredOffers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy sản phẩm ngân hàng nào phù hợp.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CreateLoanRequestModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(newRequest) => {
            setLoanRequests(prev => [newRequest, ...prev]);
            setIsCreateModalOpen(false);
          }}
        />
      </div>
    </Layout>
  );
};

export default Marketplace;
