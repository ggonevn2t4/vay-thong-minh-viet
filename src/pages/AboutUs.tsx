
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, Shield } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Tận tâm với khách hàng",
      description: "Chúng tôi luôn đặt lợi ích của khách hàng lên hàng đầu và cung cấp dịch vụ tư vấn miễn phí, chính xác nhất."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Minh bạch & Chính xác",
      description: "Thông tin về lãi suất, điều kiện vay và quy trình được cung cấp một cách rõ ràng, minh bạch."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Chuyên nghiệp",
      description: "Đội ngũ tư vấn viên có kinh nghiệm nhiều năm trong lĩnh vực tài chính ngân hàng."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bảo mật thông tin",
      description: "Cam kết bảo vệ tuyệt đối thông tin cá nhân và tài chính của khách hàng."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Về VayThôngMinh</h1>
            <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto">
              Nền tảng so sánh và tư vấn khoản vay hàng đầu Việt Nam, giúp bạn tìm được giải pháp tài chính phù hợp nhất
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-lg text-gray-600 mb-8">
                VayThôngMinh được thành lập với sứ mệnh democratize việc tiếp cận các sản phẩm tài chính. 
                Chúng tôi tin rằng mọi người đều có quyền được tiếp cận thông tin minh bạch về các khoản vay 
                và nhận được tư vấn chuyên nghiệp để đưa ra quyết định tài chính đúng đắn.
              </p>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tầm nhìn 2030</h3>
                <p className="text-gray-600">
                  Trở thành nền tảng công nghệ tài chính hàng đầu Đông Nam Á, kết nối hàng triệu người dân 
                  với các giải pháp vay vốn tối ưu thông qua công nghệ AI và big data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Giá trị cốt lõi</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những giá trị này định hướng mọi hoạt động và quyết định của chúng tôi
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center text-brand-600 mb-4">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Đội ngũ lãnh đạo</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những chuyên gia hàng đầu với hơn 15 năm kinh nghiệm trong lĩnh vực tài chính và công nghệ
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-brand-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nguyễn Văn A</h3>
                  <p className="text-brand-600 font-medium mb-2">CEO & Founder</p>
                  <p className="text-gray-600 text-sm">
                    Cựu Giám đốc Khối Bán lẻ tại Vietcombank, 12 năm kinh nghiệm ngành ngân hàng
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-brand-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-12 w-12 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Trần Thị B</h3>
                  <p className="text-brand-600 font-medium mb-2">CTO</p>
                  <p className="text-gray-600 text-sm">
                    Cựu Senior Engineer tại Grab, chuyên gia về AI và machine learning
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-brand-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-12 w-12 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lê Văn C</h3>
                  <p className="text-brand-600 font-medium mb-2">Head of Business</p>
                  <p className="text-gray-600 text-sm">
                    Cựu Giám đốc Kinh doanh tại Techcombank, 10 năm kinh nghiệm phát triển sản phẩm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-brand-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-brand-100">Khách hàng tin tưởng</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-brand-100">Ngân hàng đối tác</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15 tỷ+</div>
                <div className="text-brand-100">VNĐ đã hỗ trợ vay</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-brand-100">Tỷ lệ hài lòng</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sẵn sàng bắt đầu?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Hãy để chúng tôi giúp bạn tìm được khoản vay phù hợp nhất. Hoàn toàn miễn phí và không ràng buộc.
            </p>
            <div className="space-x-4">
              <a href="/khao-sat" className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                Bắt đầu khảo sát
              </a>
              <a href="/lien-he" className="inline-flex items-center px-6 py-3 border border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors">
                Liên hệ tư vấn
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutUs;
