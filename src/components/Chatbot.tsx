
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendChatRequest, getOpenAIKey, setOpenAIKey } from '@/services/openaiService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Message {
  content: string;
  type: 'user' | 'bot';
}

interface ChatbotProps {
  initialMessage?: string;
}

const Chatbot = ({ initialMessage = "Xin chào! Tôi là trợ lý ảo của VayThôngMinh. Tôi có thể giúp gì cho bạn?" }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { content: initialMessage, type: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Cuộn xuống cuối cùng khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Kiểm tra API key khi khởi động
  useEffect(() => {
    const savedKey = getOpenAIKey();
    if (!savedKey) {
      // Nếu không có API key, hiển thị dialog yêu cầu nhập key
      setShowApiKeyDialog(true);
    }
  }, []);
  
  // Xử lý lưu API key
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setOpenAIKey(apiKey.trim());
      setShowApiKeyDialog(false);
      toast.success('API key đã được lưu');
    } else {
      toast.error('Vui lòng nhập API key hợp lệ');
    }
  };
  
  // Danh sách câu hỏi và trả lời mẫu
  const faqResponses: Record<string, string> = {
    'lãi suất': 'Lãi suất vay tại các ngân hàng đối tác của chúng tôi dao động từ 7.5% đến 12% tùy thuộc vào loại khoản vay, thời hạn vay và hồ sơ tín dụng của bạn.',
    'thời gian': 'Thời gian xử lý hồ sơ vay thường từ 3-7 ngày làm việc. Một số ngân hàng có dịch vụ phê duyệt nhanh trong 24h cho các khoản vay nhỏ.',
    'hồ sơ': 'Hồ sơ cơ bản thường bao gồm: CMND/CCCD, sổ hộ khẩu/KT3, hợp đồng lao động, sao kê lương 3-6 tháng gần nhất, và các giấy tờ liên quan đến tài sản đảm bảo (nếu có).',
    'điều kiện': 'Điều kiện vay cơ bản bao gồm: tuổi từ 18-65, có thu nhập ổn định, không có nợ xấu nhóm 2 trở lên, và đáp ứng các yêu cầu cụ thể của từng ngân hàng.',
    'phí': 'Các loại phí có thể phát sinh khi vay gồm: phí thẩm định (0.1-0.5% giá trị khoản vay), phí trả nợ trước hạn (1-3% số tiền trả trước), phí bảo hiểm khoản vay (tùy chọn).',
    'bảo mật': 'Chúng tôi cam kết bảo mật thông tin cá nhân của bạn theo quy định của pháp luật. Thông tin chỉ được chia sẻ với ngân hàng khi bạn đồng ý nộp hồ sơ vay.',
    'báo cáo': 'Báo cáo miễn phí bao gồm đánh giá cơ bản về khả năng vay vốn và danh sách ngân hàng đề xuất. Báo cáo chi tiết (có phí) bao gồm phân tích chuyên sâu về các phương án vay tối ưu và tính toán chi tiết.'
  };
  
  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    // Thêm tin nhắn của người dùng
    setMessages([...messages, { content: inputValue, type: 'user' }]);
    
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Kiểm tra từ khóa trong FAQ trước
      let foundInFaq = false;
      let botResponse = '';
      
      // Kiểm tra từ khóa trong tin nhắn của người dùng
      for (const [keyword, response] of Object.entries(faqResponses)) {
        if (userInput.toLowerCase().includes(keyword)) {
          botResponse = response;
          foundInFaq = true;
          break;
        }
      }
      
      // Nếu không tìm thấy trong FAQ, sử dụng OpenAI API
      if (!foundInFaq) {
        if (getOpenAIKey()) {
          // Chuẩn bị tin nhắn cho OpenAI API
          const chatMessages = [
            {
              role: "system",
              content: "Bạn là trợ lý ảo của VayThôngMinh, một nền tảng so sánh và tư vấn các khoản vay. Hãy trả lời các câu hỏi của người dùng về vay vốn, điều kiện vay, lãi suất, và các vấn đề liên quan đến tài chính cá nhân một cách ngắn gọn, chính xác và hữu ích. Trả lời bằng tiếng Việt. Giữ câu trả lời ngắn gọn dưới 3 câu."
            },
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: "user",
              content: userInput
            }
          ];
          
          botResponse = await sendChatRequest(chatMessages as Array<{role: string, content: string}>);
        } else {
          // Không có API key
          botResponse = "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng cung cấp API key cho OpenAI hoặc liên hệ với nhân viên tư vấn qua số hotline 1900 1234 để được hỗ trợ.";
          setShowApiKeyDialog(true);
        }
      }
      
      // Thêm phản hồi của bot sau một khoảng thời gian ngắn để tạo hiệu ứng đang nhập
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { content: botResponse, type: 'bot' }]);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Lỗi khi xử lý tin nhắn:', error);
      setMessages(prevMessages => [...prevMessages, { 
        content: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.", 
        type: 'bot' 
      }]);
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  if (!isOpen) {
    return (
      <button
        className="fixed bottom-6 right-6 bg-brand-600 text-white rounded-full p-4 shadow-lg hover:bg-brand-700 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }
  
  return (
    <>
      <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col z-50 max-h-[70vh]">
        <div className="bg-brand-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-medium">Tư vấn viên VayThôngMinh</h3>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-brand-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 max-h-[50vh]">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`mb-3 ${message.type === 'user' ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-brand-100 text-gray-800' 
                    : 'bg-gray-100 text-gray-800'
                } max-w-[85%]`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-3">
              <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-800">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Đang trả lời...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t">
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="form-input flex-grow mr-2 text-sm"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              className="bg-brand-600 hover:bg-brand-700" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            <button 
              className="underline hover:text-brand-600" 
              onClick={() => setShowApiKeyDialog(true)}
            >
              Cài đặt API Key
            </button> | Trợ lý AI có thể trả lời các câu hỏi cơ bản về vay vốn
          </div>
        </div>
      </div>
      
      {/* Dialog nhập API key */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cài đặt API Key OpenAI</DialogTitle>
            <DialogDescription>
              Nhập API key của bạn để kết nối với dịch vụ OpenAI. API key sẽ được lưu trên trình duyệt của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input 
                id="apiKey" 
                type="password" 
                placeholder="sk-..." 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
              />
            </div>
            <div className="text-sm text-gray-500">
              Để có được API key, hãy truy cập <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">trang quản lý API của OpenAI</a> và tạo một key mới.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>Hủy</Button>
            <Button onClick={handleSaveApiKey}>Lưu API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
