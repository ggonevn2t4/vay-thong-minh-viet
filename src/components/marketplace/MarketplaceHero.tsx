
import { Button } from '@/components/ui/button';
import { Users, DollarSign, TrendingUp } from 'lucide-react';

interface MarketplaceHeroProps {
  canCreateLoanRequest: boolean;
  onCreateLoanRequest: () => void;
}

const MarketplaceHero = ({ canCreateLoanRequest, onCreateLoanRequest }: MarketplaceHeroProps) => {
  return (
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

          {canCreateLoanRequest && (
            <div className="mt-8">
              <Button
                onClick={onCreateLoanRequest}
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
  );
};

export default MarketplaceHero;
