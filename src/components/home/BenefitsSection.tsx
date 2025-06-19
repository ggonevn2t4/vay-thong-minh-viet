
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Tiết kiệm thời gian", 
      description: "Không cần liên hệ nhiều ngân hàng, tất cả thông tin đều có tại một nơi"
    },
    {
      title: "Đề xuất cá nhân hóa", 
      description: "Nhận các đề xuất phù hợp với điều kiện tài chính cụ thể của bạn"
    },
    {
      title: "Minh bạch thông tin", 
      description: "So sánh lãi suất và điều kiện vay từ nhiều ngân hàng khác nhau"
    },
    {
      title: "Bảo mật dữ liệu", 
      description: "Thông tin của bạn được bảo mật và không chia sẻ khi chưa có sự đồng ý"
    },
    {
      title: "Tư vấn chuyên nghiệp", 
      description: "Được hỗ trợ bởi đội ngũ chuyên gia tài chính giàu kinh nghiệm"
    },
    {
      title: "Hoàn toàn miễn phí", 
      description: "Dịch vụ khảo sát và đề xuất cơ bản hoàn toàn miễn phí"
    }
  ];

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
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
