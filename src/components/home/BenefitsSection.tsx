
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FeaturesSectionWithHoverEffects } from '@/components/ui/feature-section-with-hover-effects';

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-medium mb-2 block">Lợi ích khi sử dụng</span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Tại sao chọn VayThôngMinh?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Chúng tôi giúp bạn tiết kiệm thời gian và công sức bằng cách cung cấp thông tin chi tiết và đề xuất chính xác
          </p>
        </div>
        
        <FeaturesSectionWithHoverEffects />
        
        <div className="mt-16 text-center">
          <Link to="/khao-sat">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white py-6 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transition-all font-semibold">
              Bắt đầu khảo sát miễn phí
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
