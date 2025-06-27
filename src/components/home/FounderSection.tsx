
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

/**
 * Founder section component
 * Displays information about the company founder
 * @returns {JSX.Element} The founder section with photo and description
 */
const FounderSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lời từ Founder</h2>
            <p className="text-lg text-gray-600">
              Câu chuyện và tầm nhìn của người sáng lập Finzy
            </p>
          </div>
          
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Founder Photo */}
                <div className="md:w-1/3 bg-gradient-to-br from-brand-50 to-brand-100">
                  <div className="h-64 md:h-full flex items-center justify-center p-8">
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
                      <img 
                        src="/lovable-uploads/8767c56b-d1a5-49e2-ae33-dc8c6c27602c.png" 
                        alt="Lê Cao Thái - Founder & CEO"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Founder Content */}
                <div className="md:w-2/3 p-8 md:p-12">
                  <div className="flex items-start mb-6">
                    <Quote className="h-8 w-8 text-brand-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        "Tôi tin rằng mọi người đều có quyền được tiếp cận thông tin minh bạch về các sản phẩm tài chính. 
                        Finzy ra đời với sứ mệnh đơn giản hóa quá trình tìm kiếm và so sánh các khoản vay, 
                        giúp người Việt đưa ra quyết định tài chính thông minh hơn."
                      </p>
                      <p className="text-gray-600 mb-6">
                        "Với kinh nghiệm nhiều năm trong lĩnh vực công nghệ và tài chính, tôi mong muốn xây dựng 
                        một nền tảng không chỉ kết nối khách hàng với các ngân hàng, mà còn mang lại giá trị thực sự 
                        thông qua tư vấn AI và dịch vụ cá nhân hóa."
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Lê Cao Thái</h3>
                    <p className="text-brand-600 font-medium mb-2">Founder & CEO</p>
                    <p className="text-gray-600 text-sm">
                      Nhà sáng lập và CEO của Finzy, với tầm nhìn kiến tạo nền tảng công nghệ tài chính hàng đầu Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
