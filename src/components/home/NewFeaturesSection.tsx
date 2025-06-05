
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, FileCheck, ArrowRight } from 'lucide-react';

const NewFeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-brand-600 font-medium mb-2 block">Công cụ hỗ trợ</span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Các công cụ hữu ích</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Sử dụng các công cụ giúp bạn đưa ra quyết định tài chính thông minh hơn
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Kiểm tra khả năng vay</h3>
              <p className="text-gray-600 mb-6">
                Công cụ đánh giá nhanh khả năng bạn được chấp nhận khoản vay dựa trên thông tin tài chính cá nhân.
              </p>
              <Link to="/loan-eligibility">
                <Button className="w-full">
                  Kiểm tra ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Danh sách giấy tờ vay vốn</h3>
              <p className="text-gray-600 mb-6">
                Tổng hợp đầy đủ các giấy tờ cần thiết cho từng loại khoản vay giúp bạn chuẩn bị hồ sơ dễ dàng.
              </p>
              <Link to="/document-checklist">
                <Button className="w-full">
                  Xem danh sách
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NewFeaturesSection;
