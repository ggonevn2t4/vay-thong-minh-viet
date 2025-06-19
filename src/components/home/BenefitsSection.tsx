
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center">
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
