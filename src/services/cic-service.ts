
import { supabase } from '@/integrations/supabase/client';
import { CICCheckRequest, CustomerCICHistory, BankLoanOffer, CustomerWarning, CICImpactResult } from '@/types/cic';

export const cicService = {
  // Check CIC impact for a customer
  async checkCICImpact(customerId: string): Promise<CICImpactResult> {
    const { data, error } = await supabase.rpc('check_cic_impact_and_warn', {
      customer_uuid: customerId
    });

    if (error) throw error;
    return data as CICImpactResult;
  },

  // Create a CIC check request
  async createCICRequest(request: Omit<CICCheckRequest, 'id' | 'created_at' | 'updated_at'>): Promise<CICCheckRequest> {
    const { data, error } = await supabase
      .from('cic_check_requests')
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as CICCheckRequest['status'],
      cic_report_data: data.cic_report_data as Record<string, any>
    };
  },

  // Get customer's CIC check requests
  async getCICRequests(customerId: string): Promise<CICCheckRequest[]> {
    const { data, error } = await supabase
      .from('cic_check_requests')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as CICCheckRequest['status'],
      cic_report_data: item.cic_report_data as Record<string, any>
    }));
  },

  // Get customer's CIC history
  async getCICHistory(customerId: string): Promise<CustomerCICHistory[]> {
    const { data, error } = await supabase
      .from('customer_cic_history')
      .select('*')
      .eq('customer_id', customerId)
      .order('check_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get customer warnings
  async getCustomerWarnings(customerId: string): Promise<CustomerWarning[]> {
    const { data, error } = await supabase
      .from('customer_warnings')
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_acknowledged', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      warning_type: item.warning_type as CustomerWarning['warning_type'],
      severity: item.severity as CustomerWarning['severity']
    }));
  },

  // Acknowledge a warning
  async acknowledgeWarning(warningId: string): Promise<void> {
    const { error } = await supabase
      .from('customer_warnings')
      .update({ 
        is_acknowledged: true, 
        acknowledged_at: new Date().toISOString() 
      })
      .eq('id', warningId);

    if (error) throw error;
  },

  // Generate bank offers for a loan application
  async generateBankOffers(applicationId: string): Promise<any> {
    const { data, error } = await supabase.rpc('generate_bank_offers', {
      application_id: applicationId
    });

    if (error) throw error;
    return data;
  },

  // Get bank offers for a loan application
  async getBankOffers(applicationId: string): Promise<BankLoanOffer[]> {
    const { data, error } = await supabase
      .from('bank_loan_offers')
      .select('*')
      .eq('loan_application_id', applicationId)
      .order('interest_rate', { ascending: true });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as BankLoanOffer['status']
    }));
  },

  // Update bank offer status
  async updateOfferStatus(offerId: string, status: 'accepted' | 'declined'): Promise<void> {
    const { error } = await supabase
      .from('bank_loan_offers')
      .update({ status })
      .eq('id', offerId);

    if (error) throw error;
  }
};
