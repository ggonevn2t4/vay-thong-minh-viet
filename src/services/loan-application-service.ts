
import { supabase } from '@/integrations/supabase/client';
import { SupabaseRawLoanApplication, RawLoanApplicationWithProfile, ReviewData, LoanStatus } from '@/types/loan-applications';

export const fetchLoanApplications = async (): Promise<RawLoanApplicationWithProfile[]> => {
  const { data, error } = await supabase
    .from('loan_applications')
    .select(`
      *,
      profiles:user_id (
        full_name,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Process and filter the data to handle errors and null values
  const processedApplications: RawLoanApplicationWithProfile[] = (data || [])
    .filter((app: SupabaseRawLoanApplication) => {
      // Filter out applications with invalid data
      return app && 
             typeof app === 'object' && 
             app.id &&
             app.amount;
    })
    .map((app: SupabaseRawLoanApplication): RawLoanApplicationWithProfile => {
      // Handle profiles that might be error objects
      let processedProfiles: { full_name: string; phone: string; } | null = null;
      
      if (app.profiles && 
          typeof app.profiles === 'object' && 
          !('error' in app.profiles) && 
          'full_name' in app.profiles && 
          'phone' in app.profiles) {
        processedProfiles = {
          full_name: app.profiles.full_name,
          phone: app.profiles.phone
        };
      }
      
      return {
        ...app,
        profiles: processedProfiles
      };
    });
  
  return processedApplications;
};

export const submitLoanReview = async (
  applicationId: string,
  reviewerId: string,
  reviewData: ReviewData
) => {
  const { error } = await supabase
    .from('loan_application_reviews')
    .insert({
      loan_application_id: applicationId,
      reviewer_id: reviewerId,
      review_status: reviewData.review_status,
      review_notes: reviewData.review_notes,
      approval_amount: reviewData.approval_amount ? parseInt(reviewData.approval_amount) : null,
      approved_interest_rate: reviewData.approved_interest_rate ? parseFloat(reviewData.approved_interest_rate) : null,
      approved_term_months: reviewData.approved_term_months ? parseInt(reviewData.approved_term_months) : null,
      conditions: reviewData.conditions
    });

  if (error) throw error;

  // Update loan application status
  await supabase
    .from('loan_applications')
    .update({ status: reviewData.review_status as any })
    .eq('id', applicationId);
};
