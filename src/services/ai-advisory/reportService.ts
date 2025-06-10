
import { supabase } from '@/integrations/supabase/client';
import { AIAnalysis } from './types';

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
        income_analysis: { status: 'analyzed' } as any,
        expense_analysis: { status: 'analyzed' } as any,
        debt_analysis: { debt_to_income_ratio: aiAnalysis.debt_to_income_ratio } as any,
        ai_confidence_score: aiAnalysis.risk_score / 100
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating financial analysis report:', error);
    throw error;
  }
};
