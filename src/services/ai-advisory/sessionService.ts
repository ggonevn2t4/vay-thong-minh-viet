
import { supabase } from '@/integrations/supabase/client';
import { FinancialData, AIAnalysis, LoanOptimization, BankApprovalPrediction } from './types';

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
        financial_data: financialData as any,
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
        ai_analysis: aiAnalysis as any,
        loan_optimization: loanOptimization as any,
        bank_approval_predictions: bankPredictions as any,
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
