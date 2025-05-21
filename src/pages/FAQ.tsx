
import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquareQuestion, HelpCircle, ListOrdered, ListX } from 'lucide-react';

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h1>
            <p className="text-gray-600">Tìm hiểu thêm về các khoản vay và dịch vụ tư vấn tài chính của chúng tôi</p>
          </div>
          
          <Tabs defaultValue="general" className="w-full mb-10">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Câu hỏi chung</span>
              </TabsTrigger>
              <TabsTrigger value="loans" className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4" />
                <span>Các loại khoản vay</span>
              </TabsTrigger>
              <TabsTrigger value="apply" className="flex items-center gap-2">
                <MessageSquareQuestion className="h-4 w-4" />
                <span>Quy trình đăng ký</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <ListX className="h-4 w-4" />
                <span>Thanh toán</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Câu hỏi chung</CardTitle>
                  <CardDescription>
                    Tìm hiểu thêm về VayThôngMinh và các dịch vụ của chúng tôi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        VayThôngMinh là gì và làm thế nào để tôi sử dụng dịch vụ này?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>VayThôngMinh là nền tảng so sánh khoản vay trực tuyến hàng đầu Việt Nam, giúp bạn tìm kiếm và so sánh các khoản vay từ nhiều ngân hàng và tổ chức tài chính khác nhau. Để sử dụng dịch vụ của chúng tôi:</p>
                        <ol className="list-decimal list-inside mt-2 ml-4 space-y-1">
                          <li>Hoàn thành khảo sát nhanh trên trang web của chúng tôi</li>
                          <li>Xem các đề xuất khoản vay phù hợp với nhu cầu của bạn</li>
                          <li>So sánh các lựa chọn và lựa chọn khoản vay tốt nhất</li>
                          <li>Hoàn thành đơn đăng ký trực tuyến hoặc được kết nối với đại diện ngân hàng</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        VayThôngMinh có thu phí sử dụng dịch vụ không?
                      </AccordionTrigger>
                      <AccordionContent>
                        Không, dịch vụ so sánh và tư vấn của VayThôngMinh hoàn toàn miễn phí cho người dùng. Chúng tôi nhận hoa hồng từ các đối tác ngân hàng khi họ cấp khoản vay thành công cho khách hàng được giới thiệu từ chúng tôi. Điều này đảm bảo rằng chúng tôi luôn đặt lợi ích của khách hàng lên hàng đầu và giới thiệu những sản phẩm phù hợp nhất.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Thông tin cá nhân của tôi có được bảo mật không?
                      </AccordionTrigger>
                      <AccordionContent>
                        Chúng tôi rất coi trọng việc bảo mật thông tin của khách hàng. Mọi thông tin cá nhân bạn cung cấp đều được mã hóa và bảo vệ theo tiêu chuẩn bảo mật ngành tài chính. Chúng tôi chỉ chia sẻ thông tin của bạn với đối tác ngân hàng khi bạn đồng ý đăng ký khoản vay. Bạn có thể đọc thêm về chính sách bảo mật của chúng tôi tại trang Chính sách Bảo mật.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="loans" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Các loại khoản vay</CardTitle>
                  <CardDescription>
                    Tìm hiểu về các loại khoản vay và đặc điểm của từng loại
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Có những loại khoản vay nào và tôi nên chọn loại nào?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>Các loại khoản vay phổ biến bao gồm:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                          <li><strong>Vay tín chấp:</strong> Khoản vay không cần tài sản đảm bảo, thường có lãi suất cao hơn.</li>
                          <li><strong>Vay thế chấp:</strong> Khoản vay có tài sản đảm bảo (nhà, xe), thường có lãi suất thấp hơn và hạn mức cao hơn.</li>
                          <li><strong>Vay mua nhà:</strong> Khoản vay dài hạn (10-35 năm) để mua, xây hoặc sửa chữa nhà.</li>
                          <li><strong>Vay mua xe:</strong> Khoản vay trung hạn (5-8 năm) để mua xe ô tô.</li>
                          <li><strong>Vay kinh doanh:</strong> Khoản vay cho mục đích kinh doanh, có thể là tín chấp hoặc thế chấp.</li>
                        </ul>
                        <p className="mt-2">Việc lựa chọn loại khoản vay phù hợp phụ thuộc vào nhu cầu, khả năng tài chính và tài sản hiện có của bạn. Hãy sử dụng công cụ khảo sát của chúng tôi để nhận được tư vấn chi tiết.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Lãi suất cố định và lãi suất thả nổi là gì?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p><strong>Lãi suất cố định:</strong> Lãi suất không thay đổi trong suốt thời hạn vay hoặc trong một khoảng thời gian nhất định. Ưu điểm là khoản trả hàng tháng không thay đổi, dễ lập kế hoạch tài chính.</p>
                        <p className="mt-2"><strong>Lãi suất thả nổi:</strong> Lãi suất thay đổi theo thị trường, thường được tính bằng lãi suất cơ bản cộng thêm một biên độ. Ưu điểm là có thể được hưởng lợi nếu lãi suất thị trường giảm, nhưng cũng có rủi ro tăng nếu lãi suất thị trường tăng.</p>
                        <p className="mt-2">Việc lựa chọn loại lãi suất nào phụ thuộc vào dự đoán về xu hướng lãi suất thị trường và khả năng chịu rủi ro của bạn.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Tôi có thể vay tối đa bao nhiêu?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>Hạn mức vay tối đa phụ thuộc vào nhiều yếu tố:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>Thu nhập của bạn</li>
                          <li>Lịch sử tín dụng</li>
                          <li>Các khoản nợ hiện tại</li>
                          <li>Giá trị tài sản đảm bảo (nếu là khoản vay thế chấp)</li>
                          <li>Chính sách của ngân hàng</li>
                        </ul>
                        <p className="mt-2">Thông thường, các ngân hàng sẽ cấp khoản vay không vượt quá 30-50% thu nhập hàng tháng của bạn để đảm bảo khả năng trả nợ. Đối với vay thế chấp, có thể vay được 70-80% giá trị tài sản.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="apply" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quy trình đăng ký</CardTitle>
                  <CardDescription>
                    Tìm hiểu về quy trình đăng ký vay và các giấy tờ cần chuẩn bị
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Quy trình đăng ký vay diễn ra như thế nào?
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside space-y-2">
                          <li><strong>Hoàn thành khảo sát:</strong> Cung cấp thông tin cơ bản về nhu cầu vay và tình trạng tài chính</li>
                          <li><strong>Xem xét các đề xuất:</strong> So sánh các khoản vay được đề xuất dựa trên thông tin của bạn</li>
                          <li><strong>Chọn sản phẩm:</strong> Lựa chọn khoản vay phù hợp nhất với nhu cầu của bạn</li>
                          <li><strong>Hoàn thiện hồ sơ:</strong> Cung cấp các giấy tờ cần thiết theo yêu cầu của ngân hàng</li>
                          <li><strong>Thẩm định:</strong> Ngân hàng thẩm định hồ sơ, tài sản đảm bảo (nếu có) và năng lực tài chính</li>
                          <li><strong>Phê duyệt:</strong> Nhận kết quả phê duyệt khoản vay</li>
                          <li><strong>Giải ngân:</strong> Ký kết hợp đồng và nhận tiền vay</li>
                        </ol>
                        <p className="mt-2">Toàn bộ quy trình thường mất từ 3-7 ngày làm việc đối với vay tín chấp và 7-14 ngày đối với vay thế chấp.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Tôi cần chuẩn bị những giấy tờ gì để đăng ký vay?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p><strong>Giấy tờ cơ bản (áp dụng cho mọi loại khoản vay):</strong></p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>CMND/CCCD/Hộ chiếu còn hiệu lực</li>
                          <li>Sổ hộ khẩu/KT3/Giấy xác nhận cư trú</li>
                          <li>Bằng chứng thu nhập (Sao kê lương, hợp đồng lao động, xác nhận lương)</li>
                        </ul>
                        
                        <p className="mt-3"><strong>Đối với vay thế chấp, bổ sung thêm:</strong></p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>Giấy tờ chứng minh quyền sở hữu tài sản</li>
                          <li>Giấy tờ liên quan đến tài sản (Giấy chứng nhận quyền sử dụng đất, sở hữu nhà)</li>
                          <li>Hợp đồng mua bán/chuyển nhượng tài sản (nếu có)</li>
                        </ul>
                        
                        <p className="mt-3"><strong>Đối với vay kinh doanh, bổ sung thêm:</strong></p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>Giấy phép kinh doanh/Giấy đăng ký doanh nghiệp</li>
                          <li>Báo cáo tài chính 1-2 năm gần nhất</li>
                          <li>Hóa đơn VAT, chứng từ kinh doanh</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Điểm tín dụng và lịch sử tín dụng ảnh hưởng thế nào đến việc vay?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>Điểm tín dụng và lịch sử tín dụng có ảnh hưởng rất lớn đến khả năng được duyệt vay và lãi suất bạn nhận được:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                          <li><strong>Lịch sử tín dụng tốt:</strong> Tăng khả năng được duyệt vay với lãi suất thấp hơn</li>
                          <li><strong>Lịch sử tín dụng xấu:</strong> Có thể bị từ chối vay hoặc phải chấp nhận lãi suất cao hơn</li>
                        </ul>
                        <p className="mt-2">Các yếu tố ảnh hưởng đến điểm tín dụng bao gồm: lịch sử thanh toán đúng hạn, số lượng khoản vay hiện tại, mức độ sử dụng hạn mức tín dụng, và các khoản nợ xấu (nếu có).</p>
                        <p className="mt-2">Tại Việt Nam, thông tin tín dụng được quản lý bởi Trung tâm Thông tin Tín dụng Quốc gia (CIC). Bạn có thể yêu cầu báo cáo tín dụng của mình từ CIC để nắm được tình trạng tín dụng hiện tại.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thanh toán</CardTitle>
                  <CardDescription>
                    Tìm hiểu về các phương thức thanh toán và xử lý nợ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Các phương thức thanh toán khoản vay?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>Có nhiều phương thức thanh toán khoản vay khác nhau:</p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                          <li><strong>Thanh toán trực tuyến:</strong> Qua Internet Banking, Mobile Banking</li>
                          <li><strong>Thanh toán qua ví điện tử:</strong> MoMo, ZaloPay, VNPay, v.v.</li>
                          <li><strong>Thanh toán tại quầy giao dịch ngân hàng:</strong> Nộp tiền mặt hoặc chuyển khoản</li>
                          <li><strong>Thanh toán qua ATM:</strong> Nộp tiền tại ATM có chức năng nộp tiền</li>
                          <li><strong>Thanh toán tự động:</strong> Đăng ký trích nợ tự động từ tài khoản ngân hàng</li>
                        </ul>
                        <p className="mt-2">Phương thức thanh toán trích nợ tự động là tiện lợi nhất vì giúp bạn không bị quên thời hạn thanh toán.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Tôi có thể trả nợ trước hạn không và có phí phạt không?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>Hầu hết các ngân hàng đều cho phép khách hàng trả nợ trước hạn, tuy nhiên thường sẽ có phí phạt trả nợ trước hạn. Mức phí này thường từ 1-5% số tiền trả trước tùy theo chính sách của mỗi ngân hàng và thời gian còn lại của khoản vay.</p>
                        
                        <p className="mt-2">Lý do ngân hàng thu phí trả nợ trước hạn là vì họ đã lập kế hoạch dòng tiền dựa trên thời hạn khoản vay ban đầu. Khi bạn trả nợ sớm, họ mất đi khoản lãi dự kiến.</p>
                        
                        <p className="mt-2">Một số trường hợp có thể được miễn hoặc giảm phí trả nợ trước hạn:</p>
                        <ul className="list-disc list-inside mt-2 ml-4">
                          <li>Đã vay được một khoảng thời gian nhất định (thường là 12-24 tháng)</li>
                          <li>Trả một phần nhỏ (dưới một ngưỡng nhất định)</li>
                          <li>Khoản vay áp dụng lãi suất thả nổi</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Tôi nên làm gì nếu gặp khó khăn trong việc trả nợ?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>Nếu bạn đang gặp khó khăn trong việc trả nợ, điều quan trọng nhất là chủ động liên hệ với ngân hàng càng sớm càng tốt, không nên chờ đến khi đã trễ hạn thanh toán. Các biện pháp có thể áp dụng:</p>
                        
                        <ol className="list-decimal list-inside mt-2 ml-4 space-y-2">
                          <li><strong>Cơ cấu lại khoản nợ:</strong> Kéo dài thời gian trả nợ để giảm số tiền phải trả hàng tháng</li>
                          <li><strong>Ân hạn tạm thời:</strong> Một số ngân hàng cho phép tạm hoãn trả gốc, chỉ trả lãi trong một khoảng thời gian</li>
                          <li><strong>Giảm lãi suất:</strong> Đàm phán để được giảm lãi suất trong thời gian khó khăn</li>
                          <li><strong>Hợp nhất các khoản nợ:</strong> Nếu có nhiều khoản vay, có thể hợp nhất lại thành một khoản với điều kiện tốt hơn</li>
                        </ol>
                        
                        <p className="mt-2">Việc chủ động liên hệ ngân hàng trước khi trễ hạn sẽ thể hiện thiện chí của bạn và có khả năng nhận được các biện pháp hỗ trợ thuận lợi hơn.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-10 bg-brand-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Vẫn còn thắc mắc?</h2>
            <p className="mb-4">Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, hãy liên hệ với chúng tôi qua các kênh sau:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Gọi đến hotline: <strong>1900 1234</strong> (8:00 - 17:30, Thứ 2 - Thứ 6)</li>
              <li>Email: <strong>info@vaythongminh.vn</strong></li>
              <li>Chat trực tuyến với trợ lý ảo của chúng tôi</li>
            </ul>
          </div>
          
          <div className="mt-10 text-center">
            <h3 className="text-lg font-medium mb-4">Bạn đã sẵn sàng tìm kiếm khoản vay phù hợp?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/khao-sat">
                <Button className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">Bắt đầu khảo sát miễn phí</Button>
              </Link>
              <Link to="/so-sanh">
                <Button variant="outline" className="w-full sm:w-auto">So sánh các khoản vay</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
