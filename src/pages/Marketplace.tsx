import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import BankingHeroSection from '@/components/marketplace/BankingHeroSection';
import LoanProductGrid from '@/components/marketplace/LoanProductGrid';
import BankingAdvantages from '@/components/marketplace/BankingAdvantages';
import LoanApplicationCTA from '@/components/marketplace/LoanApplicationCTA';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import MarketplaceTabs from '@/components/marketplace/MarketplaceTabs';
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
  const { user, userRole } = useAuth();
  const isSignedIn = !!user;
  const canCreateLoanRequest = isSignedIn && userRole === 'customer';
  
  // Set default tab based on user role
  const getDefaultTab = () => {
    if (userRole === 'customer') return 'offers';
    if (userRole === 'advisor') return 'requests';
    return 'requests'; // default for guests
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Update active tab when user role changes
  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [userRole]);

  // ... keep existing code (loanRequests and bankOffers state)
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

  // ... keep existing code (filtered data logic)
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

  const handleCreateLoanRequest = () => {
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          <BankingHeroSection 
            canCreateLoanRequest={canCreateLoanRequest}
            onCreateLoanRequest={handleCreateLoanRequest}
          />
          
          <div className="container mx-auto px-4 py-8">
            <PageSkeleton type="marketplace" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <BankingHeroSection 
          canCreateLoanRequest={canCreateLoanRequest}
          onCreateLoanRequest={handleCreateLoanRequest}
        />

        <LoanProductGrid />
        
        <BankingAdvantages />

        <LoanApplicationCTA 
          canCreateLoanRequest={canCreateLoanRequest}
          onCreateLoanRequest={handleCreateLoanRequest}
        />

        {/* Existing Marketplace Tabs for role-based content */}
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gray-50 rounded-2xl p-8">
            <MarketplaceFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              amountFilter={amountFilter}
              setAmountFilter={setAmountFilter}
              activeTab={activeTab}
            />

            <MarketplaceTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredRequests={filteredRequests}
              filteredOffers={filteredOffers}
              canCreateLoanRequest={canCreateLoanRequest}
              onCreateLoanRequest={handleCreateLoanRequest}
              userRole={userRole}
            />
          </div>
        </div>

        {canCreateLoanRequest && (
          <CreateLoanRequestModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={(newRequest) => {
              setLoanRequests(prev => [newRequest, ...prev]);
              setIsCreateModalOpen(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;
