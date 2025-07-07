
import { HeroSection } from '@/components/ui/hero-section';
import { Icons } from '@/components/ui/icons';
import { ArrowRight } from 'lucide-react';

/**
 * Hero section component for the homepage
 * Contains the main value proposition and call-to-action
 * @returns {JSX.Element} The hero section with background and main CTA
 */
const ModernHeroSection = () => {
  return (
    <HeroSection
      badge={{
        text: "Giới thiệu Finzy 2.0",
        action: {
          text: "Tìm hiểu thêm",
          href: "/about",
        },
      }}
      title="Giải pháp thông minh cho nhu cầu vay vốn của bạn"
      description="Finzy - Giải pháp thông minh giúp sàng lọc và đề xuất các khoản vay từ các ngân hàng hàng đầu Việt Nam dựa trên điều kiện tài chính của bạn"
      actions={[
        {
          text: "Bắt đầu ngay",
          href: "/loan-application",
          variant: "default",
          icon: <ArrowRight className="h-5 w-5" />,
        },
        {
          text: "Tư vấn AI",
          href: "/ai-advisory",
          variant: "outline",
        },
      ]}
      image={{
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1248&h=765&fit=crop&crop=center",
        alt: "Finzy Platform Preview",
      }}
    />
  );
};

export default ModernHeroSection;
