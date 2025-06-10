
import { supabase } from '@/integrations/supabase/client';
import { sendSecureChatRequest, ChatMessage } from './chatService';
import { toast } from 'sonner';

export interface FinancialData {
  monthly_income: number;
  monthly_expenses: number;
  existing_debts: number;
  credit_score?: number;
  employment_type: string;
  work_experience_years: number;
  desired_loan_amount: number;
  loan_purpose: string;
  preferred_term_months: number;
}

export interface AIAnalysis {
  risk_score: number;
  debt_to_income_ratio: number;
  affordability_score: number;
  recommendations: string[];
  warnings: string[];
}

export interface LoanOptimization {
  optimal_amount: number;
  optimal_term: number;
  recommended_banks: string[];
  expected_interest_rate_range: { min: number; max: number };
}

export interface BankApprovalPrediction {
  bank_name: string;
  approval_probability: number;
  predicted_interest_rate: number;
  required_documents: string[];
}

export const createConsultationSession = async (
  financialData: FinancialData
): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ai_consultation_sessions')
      .insert({
        user_id: user.id,
        session_type: 'financial_analysis',
        financial_data: financialData,
        status: 'processing'
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating consultation session:', error);
    throw error;
  }
};

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

export const updateConsultationSession = async (
  sessionId: string,
  aiAnalysis: AIAnalysis,
  loanOptimization: LoanOptimization,
  bankPredictions: BankApprovalPrediction[]
) => {
  try {
    const { error } = await supabase
      .from('ai_consultation_sessions')
      .update({
        ai_analysis: aiAnalysis,
        loan_optimization: loanOptimization,
        bank_approval_predictions: bankPredictions,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating consultation session:', error);
    throw error;
  }
};

export const createFinancialAnalysisReport = async (
  sessionId: string,
  aiAnalysis: AIAnalysis
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('financial_analysis_reports')
      .insert({
        user_id: user.id,
        consultation_session_id: sessionId,
        income_analysis: { status: 'analyzed' },
        expense_analysis: { status: 'analyzed' },
        debt_analysis: { debt_to_income_ratio: aiAnalysis.debt_to_income_ratio },
        ai_confidence_score: aiAnalysis.risk_score / 100
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating financial analysis report:', error);
    throw error;
  }
};
