
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Phone } from 'lucide-react';

interface LoanApplicationCTAProps {
  canCreateLoanRequest: boolean;
  onCreateLoanRequest: () => void;
}

const LoanApplicationCTA = ({ canCreateLoanRequest, onCreateLoanRequest }: LoanApplicationCTAProps) => {
  return (
    <div className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              Tài xế để đảng<br />
              Ngập tràn ưu đãi
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>Lãi suất ưu đãi, cạnh tranh</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>Mức vay lên tới 100% giá trị xe</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>Thủ tục đơn giản, phê duyệt nhanh chóng</span>
              </div>
            </div>

            {canCreateLoanRequest && (
              <Button 
                onClick={onCreateLoanRequest}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
              >
                Đăng ký ngay
              </Button>
            )}
          </div>

          {/* Right Content - Professional Woman */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop&crop=center"
                alt="Tư vấn viên chuyên nghiệp"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Contact */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Phone className="h-6 w-6" />
            <span className="text-2xl font-bold">1900 54 54 13</span>
          </div>
          <p className="text-green-100">Kết nối với chúng tôi</p>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationCTA;
