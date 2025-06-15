
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sendSecureChatRequest } from '@/services/chatService';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'analysis' | 'recommendation' | 'question';
}

interface AIAnalysis {
  creditScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  loanCapacity: number;
  confidence: number;
}

const AIAdvisorySystem = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI tư vấn tài chính. Tôi có thể giúp bạn phân tích khả năng vay, đánh giá hồ sơ và đưa ra lời khuyên phù hợp. Bạn có thể chia sẻ thông tin về thu nhập, chi phí và mục tiêu vay của mình.',
      timestamp: new Date(),
      type: 'question'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      conversationHistory.push({
        role: 'user',
        content: inputMessage
      });

      // System prompt for financial advisory
      const systemPrompt = {
        role: 'system' as const,
        content: `Bạn là chuyên gia tư vấn tài chính chuyên nghiệp tại Việt Nam. Nhiệm vụ của bạn:
        
        1. Phân tích thông tin tài chính của khách hàng
        2. Đánh giá khả năng vay vốn và mức độ rủi ro
        3. Đưa ra lời khuyên cụ thể về:
           - Loại khoản vay phù hợp
           - Mức vay tối đa an toàn
           - Cách cải thiện hồ sơ vay
           - Lãi suất và điều kiện vay ước tính
        
        Luôn:
        - Trả lời bằng tiếng Việt
        - Cung cấp lời khuyên thực tế, có căn cứ
        - Giải thích rõ ràng các khái niệm tài chính
        - Đề xuất các bước cụ thể khách hàng có thể thực hiện
        - Cảnh báo về rủi ro nếu có
        
        Thông tin ngữ cảnh thị trường Việt Nam:
        - Lãi suất vay tiêu dùng: 12-24%/năm
        - Lãi suất vay mua nhà: 8-12%/năm
        - Tỷ lệ thu nhập/nợ an toàn: < 40%
        - Yêu cầu thu nhập tối thiểu: 7-10 triệu/tháng`
      };

      const response = await sendSecureChatRequest([
        systemPrompt,
        ...conversationHistory
      ]);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: 'recommendation'
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simulate AI analysis based on conversation
      if (inputMessage.toLowerCase().includes('thu nhập') || 
          inputMessage.toLowerCase().includes('lương') ||
          inputMessage.toLowerCase().includes('vay')) {
        generateMockAnalysis();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ với tư vấn viên để được hỗ trợ trực tiếp.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalysis = () => {
    const mockAnalysis: AIAnalysis = {
      creditScore: Math.floor(Math.random() * 300) + 400, // 400-700
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      recommendations: [
        'Duy trì thu nhập ổn định trong 6 tháng tới',
        'Giảm tỷ lệ nợ/thu nhập xuống dưới 40%',
        'Chuẩn bị đầy đủ giấy tờ chứng minh thu nhập',
        'Xem xét các ngân hàng có lãi suất ưu đãi'
      ],
      loanCapacity: Math.floor(Math.random() * 500000000) + 100000000, // 100M - 600M VND
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
    };

    setAnalysis(mockAnalysis);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      default: return 'Chưa xác định';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Tư vấn AI thông minh
            </CardTitle>
            <CardDescription>
              Nhận tư vấn tài chính cá nhân hóa từ AI
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI đang phân tích...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Chia sẻ thông tin về thu nhập, chi phí, mục tiêu vay của bạn..."
                className="flex-1 min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Panel */}
      <div className="space-y-4">
        {analysis && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Phân tích AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Điểm tín dụng ước tính</span>
                    <span className="font-bold text-lg">{analysis.creditScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(analysis.creditScore / 700) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mức độ rủi ro</span>
                    <Badge className={getRiskColor(analysis.riskLevel)}>
                      {getRiskText(analysis.riskLevel)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Khả năng vay tối đa</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(analysis.loanCapacity)}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Độ tin cậy</span>
                    <span className="font-semibold">{analysis.confidence}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Khuyến nghị
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bắt đầu phân tích</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Chia sẻ thông tin để nhận phân tích chính xác:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Thu nhập hàng tháng
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Chi phí sinh hoạt
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Nợ hiện tại (nếu có)
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Mục tiêu vay vốn
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAdvisorySystem;
