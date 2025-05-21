
// Dịch vụ tích hợp OpenAI API
// Lưu ý: Trong môi trường thực tế, API key nên được lưu trữ an toàn ở phía backend

import { toast } from 'sonner';

// Biến lưu API key mặc định
let apiKey = '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';

export const setOpenAIKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('openai_api_key', key);
};

export const getOpenAIKey = () => {
  if (!apiKey) {
    // Thử lấy từ localStorage nếu có
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      apiKey = savedKey;
    }
  }
  return apiKey;
};

export const clearOpenAIKey = () => {
  apiKey = '';
  localStorage.removeItem('openai_api_key');
};

// Hàm kiểm tra API key có hợp lệ không
export const validateOpenAIKey = async (key: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return true;
    } else {
      console.error('API key không hợp lệ');
      return false;
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra API key:', error);
    return false;
  }
};

// Hàm gửi yêu cầu đến API OpenAI
export const sendChatRequest = async (messages: Array<{role: string, content: string}>): Promise<string> => {
  const key = getOpenAIKey();
  if (!key) {
    toast.error('Vui lòng cung cấp API key OpenAI');
    throw new Error('API key chưa được cung cấp');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Lỗi khi gọi API OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Lỗi khi gọi API OpenAI:', error);
    toast.error('Đã xảy ra lỗi khi gọi API: ' + (error as Error).message);
    throw error;
  }
};

// Phân tích phản hồi từ người dùng
export const analyzeUserResponse = async (userInput: string): Promise<any> => {
  try {
    const prompt = [
      {
        role: 'system',
        content: 'Bạn là trợ lý phân tích tài chính. Hãy đánh giá phản hồi của người dùng và đánh giá mức độ chân thực, xếp hạng từ 1-10. Phát hiện các dấu hiệu cho thấy người dùng có thể đang cung cấp thông tin không chính xác về tình hình tài chính của họ.'
      },
      {
        role: 'user',
        content: userInput
      }
    ];

    const analysis = await sendChatRequest(prompt);
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

// Dự đoán khả năng trả nợ
export const predictLoanRepayment = async (userProfile: any): Promise<any> => {
  try {
    const prompt = [
      {
        role: 'system',
        content: 'Bạn là trợ lý phân tích tài chính. Dựa trên thông tin được cung cấp về người dùng, hãy đánh giá khả năng trả nợ của họ trên thang điểm 1-100, với 100 là khả năng cao nhất. Đồng thời, hãy nêu lý do tại sao bạn đưa ra đánh giá đó.'
      },
      {
        role: 'user',
        content: JSON.stringify(userProfile)
      }
    ];

    const prediction = await sendChatRequest(prompt);
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
