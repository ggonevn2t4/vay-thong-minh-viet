
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialProps {
  /** Customer's full name */
  name: string;
  /** Customer's location/city */
  location: string;
  /** Testimonial text content */
  text: string;
  /** Rating out of 5 stars */
  rating: number;
  /** Customer's initials for avatar */
  initials: string;
}

/**
 * Individual testimonial card component
 * @param {TestimonialProps} props - The testimonial data
 * @returns {JSX.Element} A styled testimonial card
 */
const Testimonial = ({ name, location, text, rating, initials }: TestimonialProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all">
      <CardContent className="p-8 relative">
        {/* Decorative quote mark */}
        <div className="absolute -top-2 -left-2 text-5xl text-brand-200">"</div>
        
        {/* Customer info */}
        <div className="flex items-center mb-6">
          <div className="h-14 w-14 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
          <div className="ml-4">
            <p className="font-semibold text-lg text-gray-800">{name}</p>
            <p className="text-gray-500">{location}</p>
          </div>
        </div>
        
        {/* Testimonial text */}
        <p className="text-gray-600 mb-4 italic">"{text}"</p>
        
        {/* Star rating */}
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

/**
 * Customer testimonials data
 */
const TESTIMONIALS = [
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

/**
 * Testimonials section component
 * Displays customer reviews and ratings in a grid layout
 * @returns {JSX.Element} The complete testimonials section
 */
const Testimonials = () => {
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
          {TESTIMONIALS.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
