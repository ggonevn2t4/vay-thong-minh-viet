import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

/**
 * Founder section component
 * Displays information about the company founder and co-founder
 * @returns {JSX.Element} The founder section with photos and descriptions
 */
const FounderSection = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lời từ Founder & Co-founder</h2>
            <p className="text-lg text-gray-600">
              Câu chuyện và tầm nhìn của những người sáng lập Finzy
            </p>
          </div>
          
          {/* Founder Card */}
          <Card className="overflow-hidden shadow-lg mb-8">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Founder Photo */}
                <div className="md:w-1/3 bg-gradient-to-br from-brand-50 to-brand-100">
                  <div className="h-64 md:h-full flex items-center justify-center p-8">
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
                      <img alt="Lê Cao Thái - Founder & CEO" className="w-full h-full object-cover" src="/lovable-uploads/7e3fec87-b5c9-4fbe-836c-0ef15392bfea.jpg" />
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

          {/* Co-founder Card */}
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Co-founder Photo */}
                <div className="md:w-1/3 bg-gradient-to-br from-brand-50 to-brand-100">
                  <div className="h-64 md:h-full flex items-center justify-center p-8">
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
                      <img src="/lovable-uploads/48ab54bd-523b-426b-969f-e8344d2841fc.png" alt="Cao Nhật Quang - Co-founder & CTO" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                
                {/* Co-founder Content */}
                <div className="md:w-2/3 p-8 md:p-12">
                  <div className="flex items-start mb-6">
                    <Quote className="h-8 w-8 text-brand-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        "Với nền tảng công nghệ vững chắc và kinh nghiệm trong việc xây dựng hệ thống quy mô lớn, 
                        tôi cam kết đưa Finzy trở thành nền tảng tài chính thông minh và an toàn nhất cho người Việt."
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Cao Nhật Quang</h3>
                    <p className="text-brand-600 font-medium mb-2">Co-founder & CTO</p>
                    <p className="text-gray-600 text-sm">
                      Đồng sáng lập và CTO của Finzy, chuyên gia công nghệ với kinh nghiệm phát triển sản phẩm fintech
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default FounderSection;