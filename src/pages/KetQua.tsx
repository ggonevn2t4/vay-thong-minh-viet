
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Check,
  X,
  Download,
  ChevronRight,
  MessageCircle,
  FileText,
  Info,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const KetQua = () => {
  const location = useLocation();
  const [showChatbot, setShowChatbot] = useState(false);
  
  // Nếu không có state (người dùng vào thẳng trang này), chuyển về trang chủ
  if (!location.state) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy kết quả</h1>
          <p className="mb-8 text-gray-600">Bạn cần hoàn thành khảo sát để xem kết quả đánh giá.</p>
          <Link to="/khao-sat">
            <Button className="bg-brand-600 hover:bg-brand-700">
              Bắt đầu khảo sát
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const { eligibility, score, category, formData, reason } = location.state;
  
  // Danh sách ngân hàng đề xuất (giả lập)
  const recommendedBanks = [
    {
      name: 'Vietcombank',
      logo: '/vietcombank.png',
      interestRate: '7.5% - 9.5%',
      maxAmount: '2,000,000,000 VNĐ',
      maxDuration: '25 năm',
      processingTime: '3-5 ngày làm việc',
      requirements: 'CMND/CCCD, Hợp đồng lao động, Sao kê lương 3 tháng gần nhất',
      benefits: 'Lãi suất thấp, thời gian xét duyệt nhanh, ưu đãi giảm lãi suất cho khách hàng VIP',
      fees: 'Phí trả nợ trước hạn: 2% số tiền trả trước hạn trong 3 năm đầu',
      score: 85,
    },
    {
      name: 'Techcombank',
      logo: '/techcombank.png',
      interestRate: '8.0% - 10.0%',
      maxAmount: '3,000,000,000 VNĐ',
      maxDuration: '30 năm',
      processingTime: '3-7 ngày làm việc',
      requirements: 'CMND/CCCD, Hợp đồng lao động, Sao kê lương 6 tháng gần nhất',
      benefits: 'Giải ngân nhanh, nhiều ưu đãi cho khách hàng mới, miễn phí tất toán khoản vay sau 3 năm',
      fees: 'Phí trả nợ trước hạn: 3% số tiền trả trước hạn trong 2 năm đầu',
      score: 82,
    },
    {
      name: 'TPBank',
      logo: '/tpbank.png',
      interestRate: '8.5% - 11.0%',
      maxAmount: '1,500,000,000 VNĐ',
      maxDuration: '20 năm',
      processingTime: '2-3 ngày làm việc',
      requirements: 'CMND/CCCD, Bảng lương, Xác nhận từ công ty',
      benefits: 'Giải ngân nhanh trong 24h, không cần chứng minh thu nhập với khoản vay nhỏ',
      fees: 'Phí trả nợ trước hạn: 2% số tiền trả trước hạn trong 1 năm đầu',
      score: 79,
    }
  ];
  
  // Không đủ điều kiện vay
  if (!eligibility) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <X className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Không đủ điều kiện vay</h1>
              <p className="text-gray-600">
                Rất tiếc, dựa trên thông tin bạn cung cấp, bạn chưa đủ điều kiện để được giới thiệu khoản vay.
              </p>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Thông tin đánh giá</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Điểm tín dụng của bạn:</span>
                    <span className="text-lg font-semibold">{score}/100 điểm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nguyên nhân:</span>
                    <span className="text-red-500 font-medium">{reason || 'Điểm đánh giá dưới ngưỡng tối thiểu'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Các bước tiếp theo bạn có thể thực hiện</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <span>Cải thiện lịch sử tín dụng bằng cách thanh toán các khoản nợ đúng hạn</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <span>Giảm bớt số dư nợ hiện tại</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <span>Cải thiện tỷ lệ thu nhập so với chi tiêu</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <span>Xây dựng lịch sử tín dụng tốt trong ít nhất 6-12 tháng</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <span>Thử lại sau khi cải thiện các vấn đề nêu trên</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => setShowChatbot(true)}
                    className="flex items-center"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Tư vấn thêm
                  </Button>
                  <Link to="/khao-sat" className="w-full sm:w-auto">
                    <Button className="w-full bg-brand-600 hover:bg-brand-700">
                      Thử lại khảo sát
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
            
            {/* Chatbot */}
            {showChatbot && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Tư vấn với chuyên gia</h3>
                    <button onClick={() => setShowChatbot(false)} className="text-gray-500 hover:text-gray-700">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4 overflow-y-auto flex-grow">
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                      <p className="text-gray-800">Xin chào! Tôi là trợ lý ảo của VayThôngMinh. Rất tiếc về kết quả đánh giá của bạn. Tôi có thể giúp gì để cải thiện tình hình tài chính của bạn?</p>
                    </div>
                    <div className="bg-brand-50 p-3 rounded-lg text-right mb-4">
                      <p className="text-gray-800">Tôi có thể làm gì để cải thiện điểm tín dụng của mình?</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-gray-800">Để cải thiện điểm tín dụng, bạn nên:</p>
                      <ul className="list-disc pl-5 mt-2">
                        <li>Thanh toán các khoản nợ đúng hạn</li>
                        <li>Giảm dư nợ tín dụng hiện có</li>
                        <li>Không mở nhiều thẻ tín dụng cùng lúc</li>
                        <li>Kiểm tra báo cáo tín dụng định kỳ</li>
                        <li>Sử dụng tối đa 30% hạn mức tín dụng</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Nhập câu hỏi của bạn..."
                        className="form-input flex-grow mr-2"
                      />
                      <Button>Gửi</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
  
  // Đủ điều kiện vay
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chúc mừng! Bạn đủ điều kiện để vay vốn</h1>
            <p className="text-gray-600 mb-4">
              Dựa trên thông tin bạn cung cấp, chúng tôi đã đánh giá và giới thiệu những khoản vay phù hợp nhất với bạn.
            </p>
            <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-700 mr-2">Điểm đánh giá của bạn:</span>
              <span className="text-2xl font-bold text-brand-600">{score}/100</span>
            </div>
            <div className="mt-2 flex justify-center">
              <div className="inline-flex items-center bg-brand-50 text-brand-700 rounded-full px-4 py-1">
                <span className="font-medium">Phân khúc {category}</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="recommended" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommended">Đề xuất</TabsTrigger>
              <TabsTrigger value="details">Chi tiết đánh giá</TabsTrigger>
              <TabsTrigger value="report">Báo cáo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommended" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Các ngân hàng phù hợp nhất với bạn</h2>
                
                {recommendedBanks.map((bank, index) => (
                  <Card key={index} className={index === 0 ? "border-brand-600 border-2" : ""}>
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-brand-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-md">
                        Phù hợp nhất
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{bank.name}</CardTitle>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Điểm phù hợp:</span>
                          <span className="font-bold text-brand-600">{bank.score}%</span>
                        </div>
                      </div>
                      <CardDescription>
                        Lãi suất: {bank.interestRate} | Tối đa: {bank.maxAmount}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm">Xem chi tiết</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium">Thời gian vay tối đa:</p>
                                <p className="text-sm text-gray-600">{bank.maxDuration}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Thời gian xử lý:</p>
                                <p className="text-sm text-gray-600">{bank.processingTime}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Yêu cầu hồ sơ:</p>
                                <p className="text-sm text-gray-600">{bank.requirements}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Ưu đãi:</p>
                                <p className="text-sm text-gray-600">{bank.benefits}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Phí khác:</p>
                                <p className="text-sm text-gray-600">{bank.fees}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="w-full sm:w-auto">
                          So sánh chi tiết
                        </Button>
                        <Button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700">
                          Nộp hồ sơ ngay
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết đánh giá</CardTitle>
                  <CardDescription>Phân tích chi tiết khả năng vay vốn của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Tổng điểm: {score}/100</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className={`h-2.5 rounded-full ${
                            score >= 80 ? 'bg-green-500' : 
                            score >= 60 ? 'bg-yellow-500' : 
                            score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>0</span>
                        <span>40</span>
                        <span>60</span>
                        <span>80</span>
                        <span>100</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-red-500">Rủi ro cao</span>
                        <span className="text-orange-500">Rủi ro trung bình</span>
                        <span className="text-yellow-500">Chấp nhận được</span>
                        <span className="text-green-500">Rủi ro thấp</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Độ ổn định thu nhập (20%)</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-brand-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <span className="text-sm font-medium">14/20</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Thu nhập ổn định theo thời gian. Có nguồn thu nhập chính từ công việc toàn thời gian.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Lịch sử tín dụng (25%)</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-brand-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <span className="text-sm font-medium">20/25</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Lịch sử tín dụng tốt. Không có nợ xấu và luôn thanh toán đúng hạn.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Tài sản đảm bảo (20%)</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-brand-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-sm font-medium">12/20</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Có tài sản đảm bảo với giá trị tương đối so với khoản vay yêu cầu.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Khả năng trả nợ (25%)</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-brand-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <span className="text-sm font-medium">20/25</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Tỷ lệ nợ trên thu nhập thấp. Có khả năng tài chính để thanh toán khoản vay hàng tháng.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Các yếu tố khác (10%)</h4>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-brand-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <span className="text-sm font-medium">8/10</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Ổn định việc làm và nơi cư trú. Thời gian làm việc dài tại công ty hiện tại.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="report" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Báo cáo Đánh giá</CardTitle>
                  <CardDescription>Xuất báo cáo chi tiết đánh giá khả năng vay vốn của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-center">
                        <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <h4 className="text-lg font-medium">Xem trước báo cáo đánh giá</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-4">
                          Báo cáo miễn phí bao gồm thông tin cơ bản về đánh giá khả năng vay vốn của bạn
                        </p>
                        <Button variant="outline" className="mb-2 w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Tải báo cáo miễn phí
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-brand-50 rounded-lg p-6 border border-brand-200">
                      <h4 className="text-lg font-semibold text-brand-800 mb-2">Nâng cấp lên báo cáo chi tiết</h4>
                      <p className="text-sm text-brand-600 mb-4">
                        Báo cáo chi tiết bao gồm các thông tin chuyên sâu giúp bạn tối ưu hóa khoản vay
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-800">Chi tiết quy trình vay tại từng ngân hàng</span>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-800">Bảng tính gốc/lãi chi tiết theo từng phương án trả nợ</span>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-800">So sánh chi tiết giữa các ngân hàng (lãi suất, phí, ưu đãi)</span>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-800">Chiến lược tối ưu khoản vay theo tình hình tài chính của bạn</span>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                          <span className="text-sm text-gray-800">Mẫu đơn và hồ sơ cần thiết cho từng ngân hàng</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-brand-800 mb-2">199.000 VNĐ</p>
                        <Button className="w-full bg-brand-600 hover:bg-brand-700">
                          <Download className="mr-2 h-4 w-4" />
                          Mua báo cáo chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Cần hỗ trợ thêm?</h3>
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowChatbot(true)}
                    className="flex items-center"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Trò chuyện với AI
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Đặt lịch tư vấn miễn phí
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Tư vấn với AI</h3>
              <button onClick={() => setShowChatbot(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="text-gray-800">Xin chào! Tôi là trợ lý ảo của VayThôngMinh. Tôi có thể giúp gì cho bạn về các khoản vay được đề xuất?</p>
              </div>
              <div className="bg-brand-50 p-3 rounded-lg text-right mb-4">
                <p className="text-gray-800">Lãi suất 8.5% có phải là cố định không?</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-800">Lãi suất 8.5% là lãi suất ưu đãi ban đầu cho 6-12 tháng đầu tiên, sau đó sẽ được điều chỉnh theo lãi suất thị trường. Thông thường, các ngân hàng áp dụng lãi suất thả nổi sau thời gian ưu đãi, dao động từ 10-12% tùy thuộc vào chính sách của từng ngân hàng.</p>
                <p className="text-gray-800 mt-2">Bạn có thể tham khảo báo cáo chi tiết để biết thêm về cơ cấu lãi suất của từng ngân hàng.</p>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Nhập câu hỏi của bạn..."
                  className="form-input flex-grow mr-2"
                />
                <Button>Gửi</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default KetQua;
