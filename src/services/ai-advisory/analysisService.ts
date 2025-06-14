
import { sendSecureChatRequest, ChatMessage } from '../chatService';
import { FinancialData, AIAnalysis, LoanOptimization, BankApprovalPrediction } from './types';

export const analyzeFinancialData = async (
  financialData: FinancialData
): Promise<AIAnalysis> => {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia phân tích tài chính AI. Hãy phân tích dữ liệu tài chính và trả về kết quả dưới dạng JSON với cấu trúc:
        {
          "risk_score": số từ 1-100 (1 = rủi ro thấp, 100 = rủi ro cao),
          "debt_to_income_ratio": tỷ lệ nợ/thu nhập,
          "affordability_score": điểm khả năng chi trả từ 1-100,
          "recommendations": ["khuyến nghị 1", "khuyến nghị 2"],
          "warnings": ["cảnh báo 1", "cảnh báo 2"]
        }`
      },
      {
        role: 'user',
        content: JSON.stringify(financialData)
      }
    ];

    const response = await sendSecureChatRequest(messages);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    throw error;
  }
};

export const optimizeLoanStructure = async (
  financialData: FinancialData,
  aiAnalysis: AIAnalysis
): Promise<LoanOptimization> => {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia tối ưu hóa khoản vay. Dựa trên dữ liệu tài chính và phân tích AI, hãy đề xuất cấu trúc khoản vay tối ưu dưới dạng JSON:
        {
          "optimal_amount": số tiền vay tối ưu,
          "optimal_term": thời hạn tối ưu (tháng),
          "recommended_banks": ["ngân hàng 1", "ngân hàng 2"],
          "expected_interest_rate_range": {"min": lãi suất thấp nhất, "max": lãi suất cao nhất}
        }`
      },
      {
        role: 'user',
        content: JSON.stringify({ financialData, aiAnalysis })
      }
    ];

    const response = await sendSecureChatRequest(messages);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error optimizing loan structure:', error);
    throw error;
  }
};

export const predictBankApprovals = async (
  financialData: FinancialData,
  loanOptimization: LoanOptimization
): Promise<BankApprovalPrediction[]> => {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia dự đoán phê duyệt ngân hàng. Hãy dự đoán khả năng phê duyệt của các ngân hàng Việt Nam dưới dạng JSON array:
        [
          {
            "bank_name": "tên ngân hàng",
            "approval_probability": xác suất phê duyệt từ 0-100,
            "predicted_interest_rate": lãi suất dự kiến,
            "required_documents": ["giấy tờ 1", "giấy tờ 2"]
          }
        ]`
      },
      {
        role: 'user',
        content: JSON.stringify({ financialData, loanOptimization })
      }
    ];

    const response = await sendSecureChatRequest(messages);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error predicting bank approvals:', error);
    throw error;
  }
};
