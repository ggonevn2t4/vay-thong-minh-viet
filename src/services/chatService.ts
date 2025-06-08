
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendSecureChatRequest = async (messages: ChatMessage[]): Promise<string> => {
  try {
    console.log('Sending secure chat request with', messages.length, 'messages');
    
    const { data, error } = await supabase.functions.invoke('chat-openai', {
      body: { messages }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to call chat function');
    }

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error);
    }

    console.log('Successfully received chat response');
    return data.content;

  } catch (error) {
    console.error('Error in sendSecureChatRequest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error('Lỗi khi gọi API: ' + errorMessage);
    throw error;
  }
};

export const analyzeUserResponseSecure = async (userInput: string): Promise<any> => {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'Bạn là trợ lý phân tích tài chính. Hãy đánh giá phản hồi của người dùng và đánh giá mức độ chân thực, xếp hạng từ 1-10. Phát hiện các dấu hiệu cho thấy người dùng có thể đang cung cấp thông tin không chính xác về tình hình tài chính của họ.'
      },
      {
        role: 'user',
        content: userInput
      }
    ];

    const analysis = await sendSecureChatRequest(messages);
    return {
      analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Lỗi khi phân tích phản hồi:', error);
    return {
      analysis: 'Không thể phân tích phản hồi do lỗi API',
      timestamp: new Date().toISOString()
    };
  }
};

export const predictLoanRepaymentSecure = async (userProfile: any): Promise<any> => {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'Bạn là trợ lý phân tích tài chính. Dựa trên thông tin được cung cấp về người dùng, hãy đánh giá khả năng trả nợ của họ trên thang điểm 1-100, với 100 là khả năng cao nhất. Đồng thời, hãy nêu lý do tại sao bạn đưa ra đánh giá đó.'
      },
      {
        role: 'user',
        content: JSON.stringify(userProfile)
      }
    ];

    const prediction = await sendSecureChatRequest(messages);
    return {
      prediction,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Lỗi khi dự đoán khả năng trả nợ:', error);
    return {
      prediction: 'Không thể dự đoán khả năng trả nợ do lỗi API',
      timestamp: new Date().toISOString()
    };
  }
};
