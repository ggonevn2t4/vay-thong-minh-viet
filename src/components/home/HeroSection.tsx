
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';

/**
 * Hero section component for the homepage
 * Contains the main value proposition and call-to-action
 * @returns {JSX.Element} The hero section with background and main CTA
 */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOWZhZmIiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Giải pháp thông minh cho{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
              nhu cầu vay vốn của bạn
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Finzy - Giải pháp thông minh giúp sàng lọc và đề xuất các khoản vay từ các ngân hàng hàng đầu Việt Nam dựa trên điều kiện tài chính của bạn
          </p>
          
          {/* CTA Button */}
          <div className="mb-16">
            <Link to="/loan-application">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 text-brand-600" />
              <span className="text-gray-700 font-medium">Bảo mật cao</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Zap className="h-8 w-8 text-brand-600" />
              <span className="text-gray-700 font-medium">Xử lý nhanh</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-8 w-8 text-brand-600" />
              <span className="text-gray-700 font-medium">Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
