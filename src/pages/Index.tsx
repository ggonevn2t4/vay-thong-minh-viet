import React from 'react';
import Layout from '@/components/layout/Layout';
import LoanCalculator from "@/components/LoanCalculator";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import HeroSection from '@/components/home/HeroSection';
import PartnersSection from '@/components/home/PartnersSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown, Check, Info, MessageCircle, FileText, ArrowRight, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  // Các bước thực hiện
  const steps = [
    {
      title: "Điền khảo sát",
      description: "Hoàn thành mẫu khảo sát ngắn về thông tin tài chính của bạn",
      icon: "FileText"
    },
    {
      title: "Nhận đánh giá",
      description: "Hệ thống AI phân tích và xếp hạng hồ sơ vay vốn của bạn",
      icon: "Check"
    },
    {
      title: "Xem đề xuất",
      description: "Nhận danh sách các ngân hàng phù hợp với điều kiện của bạn",
      icon: "Info"
    },
    {
      title: "Nhận tư vấn",
      description: "Trò chuyện với chuyên viên tư vấn để được hỗ trợ thêm",
      icon: "MessageCircle"
    }
  ];
  
  // Các lợi ích của dịch vụ
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
  
  // Component để hiển thị icon
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "FileText":
        return <FileText className="h-6 w-6" />;
      case "Check":
        return <Check className="h-6 w-6" />;
      case "Info":
        return <Info className="h-6 w-6" />;
      case "MessageCircle":
        return <MessageCircle className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  
  // Add a section to display the loan calculator
  const calculatorSection = (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <LoanCalculator />
        </div>
      </div>
    </section>
  );
  
  // Add new features section
  const newFeatures = (
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
  
  return (
    <Layout>
      <HeroSection />
      
      <PartnersSection />
      
      {/* Các bước thực hiện - Redesigned with modern cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-brand-600 font-medium mb-2 block">Dễ dàng & Nhanh chóng</span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Quy trình đơn giản</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Chỉ với 4 bước đơn giản, bạn có thể nhận được đề xuất khoản vay phù hợp nhất với nhu cầu của mình
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-50 text-brand-600 mb-6">
                  {getIcon(step.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="mt-6 inline-flex items-center justify-center h-8 w-8 rounded-full bg-brand-600 text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Add the new features section here */}
      {newFeatures}
      
      {/* Lợi ích - New card grid with hover effects */}
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
      
      {/* Testimonials - Use our new component */}
      <Testimonials />
      
      {/* Contact Form - Add our new component */}
      <ContactForm />
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-brand-600 via-brand-700 to-brand-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMDAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4xIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAxNDQ0VjBINzIwUTEwODAgMCAxNDQwIDcyMFYxNDQ0SDBaIiBmaWxsPSJ1cmwoI2EpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Bắt đầu tìm kiếm khoản vay phù hợp ngay hôm nay</h2>
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
      
      {/* Add a section to display the loan calculator */}
      {calculatorSection}
    </Layout>
  );
};

export default Index;
