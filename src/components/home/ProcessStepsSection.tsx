
import { FileText, Check, Info, MessageCircle } from 'lucide-react';

const ProcessStepsSection = () => {
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
  );
};

export default ProcessStepsSection;
