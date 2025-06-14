
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building, Search } from 'lucide-react';
import LoanRequestCard from './LoanRequestCard';
import BankOfferCard from './BankOfferCard';

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

interface MarketplaceTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredRequests: LoanRequest[];
  filteredOffers: BankOffer[];
  canCreateLoanRequest: boolean;
  onCreateLoanRequest: () => void;
}

const MarketplaceTabs = ({
  activeTab,
  setActiveTab,
  filteredRequests,
  filteredOffers,
  canCreateLoanRequest,
  onCreateLoanRequest
}: MarketplaceTabsProps) => {
  return (
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
            {canCreateLoanRequest && (
              <Button 
                onClick={onCreateLoanRequest}
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
  );
};

export default MarketplaceTabs;
