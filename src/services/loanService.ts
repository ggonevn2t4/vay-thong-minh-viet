
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type LoanApplication = Database['public']['Tables']['loan_applications']['Row'];
type LoanApplicationInsert = Database['public']['Tables']['loan_applications']['Insert'];
type LoanApplicationUpdate = Database['public']['Tables']['loan_applications']['Update'];

export const loanService = {
  async createLoanApplication(application: LoanApplicationInsert): Promise<LoanApplication> {
    const { data, error } = await supabase
      .from('loan_applications')
      .insert(application)
      .select()
      .single();

    if (error) {
      console.error('Error creating loan application:', error);
      throw error;
    }

    return data;
  },

  async getUserLoanApplications(userId: string): Promise<LoanApplication[]> {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching loan applications:', error);
      throw error;
    }

    return data || [];
  },

  async updateLoanApplication(
    id: string, 
    updates: LoanApplicationUpdate
  ): Promise<LoanApplication> {
    const { data, error } = await supabase
      .from('loan_applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating loan application:', error);
      throw error;
    }

    return data;
  },

  async getLoanApplication(id: string): Promise<LoanApplication | null> {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching loan application:', error);
      throw error;
    }

    return data;
  }
};
