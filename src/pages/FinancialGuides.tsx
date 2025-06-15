
import Layout from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, HelpCircle } from "lucide-react";

const guides = [
  {
    title: "Hướng dẫn vay mua nhà cho người mới bắt đầu",
    description:
      "Tìm hiểu quy trình, điều kiện và những lưu ý quan trọng khi vay vốn ngân hàng để sở hữu ngôi nhà mơ ước của bạn.",
    tags: ["Vay mua nhà", "Bất động sản", "Người mới bắt đầu"],
  },
  {
    title: "5 chiến lược quản lý nợ thông minh",
    description:
      "Khám phá các phương pháp hiệu quả để kiểm soát và thoát khỏi nợ nần, giúp bạn đạt được tự do tài chính.",
    tags: ["Quản lý nợ", "Tài chính cá nhân"],
  },
  {
    title: "Xây dựng điểm tín dụng tốt: Chìa khóa vàng cho mọi khoản vay",
    description:
      "Điểm tín dụng ảnh hưởng thế nào đến khả năng vay vốn của bạn? Học cách xây dựng và duy trì một lịch sử tín dụng lành mạnh.",
    tags: ["Điểm tín dụng", "CIC", "Vay vốn"],
  },
  {
    title: "So sánh các loại hình cho vay phổ biến hiện nay",
    description:
      "Vay tín chấp, vay thế chấp, vay thấu chi... Đâu là lựa chọn phù hợp với nhu cầu và điều kiện của bạn?",
    tags: ["Các loại hình vay", "So sánh", "Kiến thức cơ bản"],
  },
  {
    title: "Hiểu về lãi suất vay: Cố định vs. Thả nổi",
    description:
      "Phân tích ưu và nhược điểm của từng loại lãi suất để bạn có thể đưa ra lựa chọn tốt nhất cho khoản vay của mình.",
    tags: ["Lãi suất", "Kiến thức cơ bản"],
  },
  {
    title: "Mẹo chuẩn bị hồ sơ vay vốn thành công 100%",
    description:
      "Bí quyết chuẩn bị một bộ hồ sơ đầy đủ, minh bạch và thuyết phục để tăng tỷ lệ được duyệt vay từ các tổ chức tín dụng.",
    tags: ["Hồ sơ vay", "Mẹo", "Tỷ lệ duyệt"],
  },
];

const faqs = [
  {
    question: "Làm thế nào để cải thiện điểm tín dụng của tôi?",
    answer:
      "Để cải thiện điểm tín dụng, bạn nên thanh toán các hóa đơn đúng hạn, giữ số dư nợ trên thẻ tín dụng ở mức thấp, tránh mở quá nhiều tài khoản mới cùng lúc và thường xuyên kiểm tra báo cáo tín dụng của mình để phát hiện sai sót.",
  },
  {
    question: "Sự khác biệt giữa lãi suất cố định và lãi suất thả nổi là gì?",
    answer:
      "Lãi suất cố định không thay đổi trong suốt thời hạn vay, giúp bạn dễ dàng lập kế hoạch tài chính. Lãi suất thả nổi có thể thay đổi theo biến động thị trường, có thể thấp hơn ban đầu nhưng cũng có rủi ro tăng cao sau này.",
  },
  {
    question: "Tôi cần chuẩn bị những giấy tờ gì khi đi vay vốn?",
    answer:
      "Các giấy tờ cơ bản thường bao gồm CMND/CCCD, sổ hộ khẩu/giấy xác nhận tạm trú, giấy tờ chứng minh thu nhập (hợp đồng lao động, sao kê lương), và giấy tờ chứng minh mục đích vay (hợp đồng mua bán nhà/xe...). Yêu cầu cụ thể có thể khác nhau tùy ngân hàng và loại khoản vay.",
  },
  {
    question: "Vay tín chấp và vay thế chấp khác nhau như thế nào?",
    answer:
      "Vay tín chấp dựa trên uy tín cá nhân và không cần tài sản đảm bảo, lãi suất thường cao hơn. Vay thế chấp yêu cầu có tài sản đảm bảo (như nhà đất, xe cộ), thường có hạn mức vay cao hơn và lãi suất ưu đãi hơn.",
  },
];


const FinancialGuidesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex items-center gap-4">
          <BookOpen className="h-10 w-10 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold">Kiến thức tài chính</h1>
            <p className="text-muted-foreground">
              Hướng dẫn và bài viết giúp bạn đưa ra quyết định tài chính thông
              minh.
            </p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Bài viết nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card
                key={index}
                className="flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg leading-snug">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {guide.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {guide.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-6 w-6 text-brand-600" />
            <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </Layout>
  );
};

export default FinancialGuidesPage;
