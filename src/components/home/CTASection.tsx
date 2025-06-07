
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * Call-to-action section component
 * Displays a prominent CTA to encourage users to start the loan survey
 * @returns {JSX.Element} The CTA section with gradient background
 */
const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-brand-600 via-brand-700 to-brand-800 text-white relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMDAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4xIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAxNDQ0VjBINzIwUTEwODAgMCAxNDQwIDcyMFYxNDQ0SDBaIiBmaWxsPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-10" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-6">
          Bắt đầu tìm kiếm khoản vay phù hợp ngay hôm nay
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-brand-50">
          Chỉ mất vài phút để hoàn thành khảo sát và nhận đề xuất cá nhân hóa từ các ngân hàng hàng đầu Việt Nam
        </p>
        <Link to="/khao-sat">
          <Button className="bg-white text-brand-600 hover:bg-brand-50 text-lg py-6 px-10 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold">
            Bắt đầu khảo sát miễn phí
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
