
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white pt-24 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMDAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4xIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAxNDQ0VjBINzIwUTEwODAgMCAxNDQwIDcyMFYxNDQ0SDBaIiBmaWxsPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Tìm khoản vay phù hợp với bạn trong vài phút
            </h1>
            <p className="text-xl mb-10 text-brand-50 max-w-xl">
              Giải pháp thông minh giúp sàng lọc và đề xuất các khoản vay từ các ngân hàng hàng đầu Việt Nam dựa trên điều kiện tài chính của bạn
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/khao-sat">
                <Button className="bg-white text-brand-600 hover:bg-brand-50 text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold">
                  Bắt đầu ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/gioi-thieu">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg py-6 px-8 rounded-full transition-all">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-10">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-white/20 transform rotate-1 hover:rotate-0 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-medium text-white">Số liệu của chúng tôi</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
                  <p className="text-4xl font-bold text-white">10+</p>
                  <p className="text-brand-100">Ngân hàng đối tác</p>
                </div>
                <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
                  <p className="text-4xl font-bold text-white">50k+</p>
                  <p className="text-brand-100">Khách hàng</p>
                </div>
                <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
                  <p className="text-4xl font-bold text-white">95%</p>
                  <p className="text-brand-100">Tỷ lệ hài lòng</p>
                </div>
                <div className="text-center p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
                  <p className="text-4xl font-bold text-white">5.000+</p>
                  <p className="text-brand-100">Khoản vay thành công</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-4 flex justify-center animate-bounce">
        <ArrowDown className="h-8 w-8 text-white" />
      </div>
    </section>
  );
};

export default HeroSection;
