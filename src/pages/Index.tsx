
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { ArrowDown, Check, Info, MessageCircle, FileText } from 'lucide-react';

const Index = () => {
  // Các đối tác ngân hàng
  const partners = [
    "Vietcombank", "BIDV", "Agribank", "VIB", 
    "Techcombank", "TPBank", "MBBank", "VPBank"
  ];
  
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
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Tìm khoản vay phù hợp nhất với bạn trong vài phút
              </h1>
              <p className="text-xl mb-8 text-brand-50">
                Giải pháp thông minh giúp sàng lọc và đề xuất các khoản vay từ các ngân hàng hàng đầu Việt Nam dựa trên điều kiện tài chính của bạn
              </p>
              <div className="space-x-4">
                <Link to="/khao-sat">
                  <Button className="bg-white text-brand-600 hover:bg-brand-50 text-lg py-6 px-8">
                    Bắt đầu ngay
                  </Button>
                </Link>
                <Link to="/gioi-thieu">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg py-6 px-8">
                    Tìm hiểu thêm
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium text-gray-800">Số liệu của chúng tôi</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-brand-50 rounded-lg">
                    <p className="text-3xl font-bold text-brand-700">10+</p>
                    <p className="text-gray-600">Ngân hàng đối tác</p>
                  </div>
                  <div className="text-center p-4 bg-brand-50 rounded-lg">
                    <p className="text-3xl font-bold text-brand-700">50k+</p>
                    <p className="text-gray-600">Khách hàng</p>
                  </div>
                  <div className="text-center p-4 bg-brand-50 rounded-lg">
                    <p className="text-3xl font-bold text-brand-700">95%</p>
                    <p className="text-gray-600">Tỷ lệ hài lòng</p>
                  </div>
                  <div className="text-center p-4 bg-brand-50 rounded-lg">
                    <p className="text-3xl font-bold text-brand-700">5.000+</p>
                    <p className="text-gray-600">Khoản vay thành công</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 flex justify-center">
          <ArrowDown className="h-8 w-8 text-white animate-bounce" />
        </div>
      </section>
      
      {/* Đối tác ngân hàng */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Các ngân hàng đối tác</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi hợp tác với các ngân hàng hàng đầu Việt Nam để mang đến cho bạn nhiều lựa chọn vay vốn đa dạng
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="py-4 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-lg font-medium text-gray-800">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Các bước thực hiện */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Quy trình đơn giản</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chỉ với 4 bước đơn giản, bạn có thể nhận được đề xuất khoản vay phù hợp nhất với nhu cầu của mình
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-brand-100 text-brand-600 mb-4">
                  {getIcon(step.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="mt-4 text-brand-600 font-medium">Bước {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Lợi ích */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Tại sao chọn VayThôngMinh?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi giúp bạn tiết kiệm thời gian và công sức bằng cách cung cấp thông tin chi tiết và đề xuất chính xác
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/khao-sat">
              <Button className="bg-brand-600 hover:bg-brand-700 text-white py-6 px-8 text-lg">
                Bắt đầu khảo sát miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Đánh giá của khách hàng */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hơn 50.000 khách hàng đã tin tưởng sử dụng dịch vụ của VayThôngMinh
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">TH</div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">Trần Hưng</p>
                  <p className="text-sm text-gray-500">Hà Nội</p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                "Nhờ VayThôngMinh, tôi đã tiết kiệm được rất nhiều thời gian tìm kiếm khoản vay. Tôi đã nhận được khoản vay mua nhà với lãi suất tốt nhất!"
              </p>
              <div className="flex text-yellow-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">NH</div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">Nguyễn Hương</p>
                  <p className="text-sm text-gray-500">TP. Hồ Chí Minh</p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                "Tôi rất hài lòng với dịch vụ của VayThôngMinh. Nhờ họ, tôi đã biết được mình phù hợp với khoản vay nào và tránh được nhiều rủi ro."
              </p>
              <div className="flex text-yellow-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">PL</div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">Phạm Linh</p>
                  <p className="text-sm text-gray-500">Đà Nẵng</p>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                "Tôi đã thử nhiều dịch vụ khác nhưng VayThôngMinh thực sự là tốt nhất. Báo cáo chi tiết giúp tôi hiểu rõ hơn về tình hình tài chính của mình."
              </p>
              <div className="flex text-yellow-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bắt đầu tìm kiếm khoản vay phù hợp ngay hôm nay</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-brand-50">
            Chỉ mất vài phút để hoàn thành khảo sát và nhận đề xuất cá nhân hóa từ các ngân hàng hàng đầu Việt Nam
          </p>
          <Link to="/khao-sat">
            <Button className="bg-white text-brand-600 hover:bg-brand-50 text-lg py-6 px-8">
              Bắt đầu khảo sát miễn phí
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
