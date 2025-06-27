
import { HeroSection } from '@/components/ui/hero-section-dark';
import { Link } from 'react-router-dom';

const HeroSectionComponent = () => {
  return (
    <HeroSection
      title="Tài chính đơn giản, kết nối an toàn"
      subtitle={{
        regular: "Giải pháp thông minh cho ",
        gradient: "nhu cầu vay vốn của bạn",
      }}
      description="Finzy - Giải pháp thông minh giúp sàng lọc và đề xuất các khoản vay từ các ngân hàng hàng đầu Việt Nam dựa trên điều kiện tài chính của bạn"
      ctaText="Bắt đầu ngay"
      ctaHref="/loan-application"
      gridOptions={{
        angle: 65,
        opacity: 0.3,
        cellSize: 60,
        lightLineColor: "#0284c7",
        darkLineColor: "#0ea5e9",
      }}
    />
  );
};

export default HeroSectionComponent;
