import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { Search, Filter, MapPin, Clock, User, Building, TrendingUp, Users, DollarSign } from 'lucide-react';
import LoanRequestCard from '@/components/marketplace/LoanRequestCard';
import BankOfferCard from '@/components/marketplace/BankOfferCard';
import CreateLoanRequestModal from '@/components/marketplace/CreateLoanRequestModal';
import PageSkeleton from '@/components/ui/page-skeleton';

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
  assignedAdvisor?: {
    name: string;
    avatar?: string;
    title: string;
  };
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
  advisor?: {
    name: string;
    avatar?: string;
    title: string;
  };
}

const Marketplace = () => {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      status: 'in_negotiation',
      createdAt: '2024-01-15',
      offers: 3,
      assignedAdvisor: {
        name: 'Trần Minh Tú',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        title: 'Chuyên gia tư vấn vay mua nhà'
      }
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
      status: 'open',
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
      status: 'approved',
      createdAt: '2024-01-12',
      offers: 2,
      assignedAdvisor: {
        name: 'Phạm Hoàng Nam',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        title: 'Tư vấn viên vay tiêu dùng'
      }
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
      rating: 4.5,
      advisor: {
        name: 'Nguyễn Thị Hoa',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5b96d2a?w=100&h=100&fit=crop&crop=face',
        title: 'Chuyên gia vay mua nhà'
      }
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
      rating: 4.7,
      advisor: {
        name: 'Lê Văn Đức',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
        title: 'Chuyên gia tài chính doanh nghiệp'
      }
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
      rating: 4.3,
      advisor: {
        name: 'Vũ Minh Châu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
        title: 'Tư vấn viên vay cá nhân'
      }
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Marketplace Vay Vốn
                </h1>
                <p className="text-xl mb-8 text-brand-100">
                  Kết nối người vay và tư vấn viên chuyên nghiệp một cách hiệu quả, 
                  nhanh chóng và minh bạch
                </p>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-8">
            <PageSkeleton type="marketplace" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Marketplace Vay Vốn
              </h1>
              <p className="text-xl mb-8 text-brand-100">
                Kết nối người vay và tư vấn viên chuyên nghiệp một cách hiệu quả, 
                nhanh chóng và minh bạch
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold">1,200+</span>
                  </div>
                  <p className="text-brand-100">Người dùng đã tham gia</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold">50 tỷ+</span>
                  </div>
                  <p className="text-brand-100">Giá trị khoản vay đã kết nối</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-8 w-8 mr-2" />
                    <span className="text-3xl font-bold">95%</span>
                  </div>
                  <p className="text-brand-100">Tỷ lệ thành công</p>
                </div>
              </div>

              {isSignedIn && (
                <div className="mt-8">
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    size="lg"
                    className="bg-white text-brand-600 hover:bg-brand-50 px-8 py-3 text-lg font-semibold"
                  >
                    Đăng yêu cầu vay ngay
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Search and Filters */}
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

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-gray-100 p-1">
                <TabsTrigger value="requests" className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:text-brand-600">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Yêu cầu vay</span>
                  <Badge variant="secondary" className="ml-1 bg-brand-100 text-brand-700">
                    {filteredRequests.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="offers" className="flex items-center gap-2 h-10 data-[state=active]:bg-white data-[state=active]:text-brand-600">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Sản phẩm ngân hàng</span>
                  <Badge variant="secondary" className="ml-1 bg-brand-100 text-brand-700">
                    {filteredOffers.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="requests" className="mt-6">
              {filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRequests.map((request) => (
                    <LoanRequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Không tìm thấy yêu cầu vay
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  {isSignedIn && (
                    <Button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-brand-600 hover:bg-brand-700"
                    >
                      Đăng yêu cầu vay mới
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="offers" className="mt-6">
              {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOffers.map((offer) => (
                    <BankOfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Không tìm thấy sản phẩm ngân hàng
                  </h3>
                  <p className="text-gray-500">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
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
      </div>
    </Layout>
  );
};

export default Marketplace;
