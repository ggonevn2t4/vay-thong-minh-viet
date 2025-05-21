
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  location: string;
  text: string;
  rating: number;
  initials: string;
}

const Testimonial = ({ name, location, text, rating, initials }: TestimonialProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all">
      <CardContent className="p-8 relative">
        <div className="absolute -top-2 -left-2 text-5xl text-brand-200">"</div>
        <div className="flex items-center mb-6">
          <div className="h-14 w-14 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-lg text-gray-800">{name}</p>
            <p className="text-gray-500">{location}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4 italic">"{text}"</p>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, index) => (
            <Star 
              key={index}
              className="h-5 w-5" 
              fill={index < rating ? "currentColor" : "none"}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Trần Hưng",
      location: "Hà Nội",
      text: "Nhờ VayThôngMinh, tôi đã tiết kiệm được rất nhiều thời gian tìm kiếm khoản vay. Tôi đã nhận được khoản vay mua nhà với lãi suất tốt nhất!",
      rating: 5,
      initials: "TH"
    },
    {
      name: "Nguyễn Hương",
      location: "TP. Hồ Chí Minh",
      text: "Tôi rất hài lòng với dịch vụ của VayThôngMinh. Nhờ họ, tôi đã biết được mình phù hợp với khoản vay nào và tránh được nhiều rủi ro.",
      rating: 5,
      initials: "NH"
    },
    {
      name: "Phạm Linh",
      location: "Đà Nẵng",
      text: "Tôi đã thử nhiều dịch vụ khác nhưng VayThôngMinh thực sự là tốt nhất. Báo cáo chi tiết giúp tôi hiểu rõ hơn về tình hình tài chính của mình.",
      rating: 5,
      initials: "PL"
    },
    {
      name: "Lê Minh",
      location: "Cần Thơ",
      text: "Dịch vụ tư vấn chuyên nghiệp và nhanh chóng. Chỉ sau 2 ngày tôi đã được ngân hàng phê duyệt khoản vay kinh doanh với điều kiện rất tốt.",
      rating: 4,
      initials: "LM"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-medium mb-2 block">Đánh giá</span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hơn 50.000 khách hàng đã tin tưởng sử dụng dịch vụ của VayThôngMinh
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
