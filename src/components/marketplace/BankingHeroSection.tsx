
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, CheckCircle } from 'lucide-react';

interface BankingHeroSectionProps {
  canCreateLoanRequest: boolean;
  onCreateLoanRequest: () => void;
}

const BankingHeroSection = ({ canCreateLoanRequest, onCreateLoanRequest }: BankingHeroSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Vay
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Lãi suất cạnh tranh, thủ tục đơn giản tối ưu!
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Vay tiêu dùng có tài sản bảo đảm</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Vay mua ô tô</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Vay mua nhà & đất ở</span>
              </div>
            </div>

            {canCreateLoanRequest && (
              <Button 
                onClick={onCreateLoanRequest}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Gọi ý sản phẩm vay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Right Content - Family Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&crop=center"
                alt="Gia đình hạnh phúc"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-600" />
            <span>1900 54 54 13</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Tư vấn 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingHeroSection;
