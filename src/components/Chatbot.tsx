
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Cuộn xuống cuối cùng khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
  
  const handleSend = () => {
    if (inputValue.trim() === '') return;
    
    // Thêm tin nhắn của người dùng
    setMessages([...messages, { content: inputValue, type: 'user' }]);
    
    // Tìm kiếm câu trả lời phù hợp
    const userInput = inputValue.toLowerCase();
    let botResponse = 'Xin lỗi, tôi không có thông tin về vấn đề này. Bạn có thể liên hệ với nhân viên tư vấn qua số hotline 1900 1234 để được hỗ trợ.';
    
    // Kiểm tra từ khóa trong tin nhắn của người dùng
    for (const [keyword, response] of Object.entries(faqResponses)) {
      if (userInput.includes(keyword)) {
        botResponse = response;
        break;
      }
    }
    
    // Phản hồi sau một khoảng thời gian ngắn để tạo hiệu ứng đang nhập
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { content: botResponse, type: 'bot' }]);
    }, 800);
    
    setInputValue('');
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
          />
          <Button onClick={handleSend} className="bg-brand-600 hover:bg-brand-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Trợ lý AI có thể trả lời các câu hỏi cơ bản về vay vốn
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
