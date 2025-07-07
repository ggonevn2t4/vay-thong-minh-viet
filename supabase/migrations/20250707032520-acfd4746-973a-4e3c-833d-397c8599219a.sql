-- Bước 1: Cải thiện Database Schema cho workflow mới

-- 1. Cải thiện bảng loan_applications với các trường mới
ALTER TABLE public.loan_applications 
ADD COLUMN IF NOT EXISTS application_stage text DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS customer_priority_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS bank_matching_criteria jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS legal_documents_shared boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS legal_documents_shared_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS offer_comparison_data jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS final_selected_offer_id uuid,
ADD COLUMN IF NOT EXISTS workflow_status text DEFAULT 'initiated';

-- 2. Tạo bảng application_workflow_stages để track workflow
CREATE TABLE IF NOT EXISTS public.application_workflow_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  stage_status text NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, skipped
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  stage_data jsonb DEFAULT '{}',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Cải thiện bảng bank_loan_offers với thêm thông tin
ALTER TABLE public.bank_loan_offers 
ADD COLUMN IF NOT EXISTS offer_type text DEFAULT 'standard', -- standard, premium, promotional
ADD COLUMN IF NOT EXISTS processing_time_days integer,
ADD COLUMN IF NOT EXISTS required_documents jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS offer_advantages jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS comparison_highlights jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS bank_employee_notes text,
ADD COLUMN IF NOT EXISTS customer_questions jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS customer_responses jsonb DEFAULT '[]';

-- 4. Tạo bảng customer_bank_employee_matching
CREATE TABLE IF NOT EXISTS public.customer_bank_employee_matching (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  bank_employee_id uuid NOT NULL,
  matching_score numeric DEFAULT 0,
  matching_criteria jsonb DEFAULT '{}',
  assignment_type text DEFAULT 'automatic', -- automatic, manual, requested
  assigned_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active', -- active, inactive, completed
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. Tạo bảng offer_comparisons_detailed 
CREATE TABLE IF NOT EXISTS public.offer_comparisons_detailed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  offers_data jsonb NOT NULL DEFAULT '[]',
  comparison_criteria jsonb DEFAULT '{}',
  customer_preferences jsonb DEFAULT '{}',
  recommended_offer_id uuid,
  customer_selected_offer_id uuid,
  comparison_notes text,
  shared_with_legal boolean DEFAULT false,
  legal_review_status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 6. Cải thiện bảng document_requests cho legal document flow
ALTER TABLE public.document_requests 
ADD COLUMN IF NOT EXISTS document_category text DEFAULT 'general', -- general, legal, financial, identity
ADD COLUMN IF NOT EXISTS legal_review_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS priority_level text DEFAULT 'normal', -- low, normal, high, urgent
ADD COLUMN IF NOT EXISTS template_used text,
ADD COLUMN IF NOT EXISTS auto_generated boolean DEFAULT false;

-- 7. Tạo bảng legal_document_sharing
CREATE TABLE IF NOT EXISTS public.legal_document_sharing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  bank_employee_id uuid,
  document_type text NOT NULL,
  document_url text NOT NULL,
  sharing_permissions jsonb DEFAULT '{}',
  access_granted_at timestamp with time zone DEFAULT now(),
  access_expires_at timestamp with time zone,
  download_count integer DEFAULT 0,
  last_accessed_at timestamp with time zone,
  sharing_status text DEFAULT 'active', -- active, revoked, expired
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. Cải thiện bảng conversations với thêm metadata
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS conversation_type text DEFAULT 'general', -- general, offer_discussion, legal_review, document_request
ADD COLUMN IF NOT EXISTS workflow_stage text,
ADD COLUMN IF NOT EXISTS priority_level text DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS conversation_metadata jsonb DEFAULT '{}';

-- 9. Tạo bảng workflow_notifications
CREATE TABLE IF NOT EXISTS public.workflow_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL,
  notification_type text NOT NULL, -- stage_completed, offer_received, document_requested, etc.
  title text NOT NULL,
  message text NOT NULL,
  workflow_stage text,
  action_required boolean DEFAULT false,
  action_url text,
  read_at timestamp with time zone,
  acknowledged_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 10. Tạo indexes cho performance
CREATE INDEX IF NOT EXISTS idx_application_workflow_stages_loan_app_id ON public.application_workflow_stages(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_application_workflow_stages_status ON public.application_workflow_stages(stage_status);
CREATE INDEX IF NOT EXISTS idx_customer_bank_matching_loan_app_id ON public.customer_bank_employee_matching(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_customer_bank_matching_status ON public.customer_bank_employee_matching(status);
CREATE INDEX IF NOT EXISTS idx_offer_comparisons_loan_app_id ON public.offer_comparisons_detailed(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_legal_document_sharing_loan_app_id ON public.legal_document_sharing(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_legal_document_sharing_status ON public.legal_document_sharing(sharing_status);
CREATE INDEX IF NOT EXISTS idx_workflow_notifications_recipient ON public.workflow_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_workflow_notifications_read ON public.workflow_notifications(read_at);

-- 11. Enable RLS cho tất cả bảng mới
ALTER TABLE public.application_workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_bank_employee_matching ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_comparisons_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_document_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_notifications ENABLE ROW LEVEL SECURITY;

-- 12. Tạo RLS policies cho application_workflow_stages
CREATE POLICY "Users can view workflow stages for their applications" ON public.application_workflow_stages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.loan_applications 
    WHERE id = application_workflow_stages.loan_application_id 
    AND (user_id = auth.uid() OR advisor_id = auth.uid())
  )
);

CREATE POLICY "System can manage workflow stages" ON public.application_workflow_stages
FOR ALL USING (true) WITH CHECK (true);

-- 13. Tạo RLS policies cho customer_bank_employee_matching
CREATE POLICY "Users can view their matching records" ON public.customer_bank_employee_matching
FOR SELECT USING (
  customer_id = auth.uid() OR 
  bank_employee_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.loan_applications 
    WHERE id = customer_bank_employee_matching.loan_application_id 
    AND advisor_id = auth.uid()
  )
);

CREATE POLICY "System can manage matching records" ON public.customer_bank_employee_matching
FOR ALL USING (true) WITH CHECK (true);

-- 14. Tạo RLS policies cho offer_comparisons_detailed
CREATE POLICY "Users can manage their offer comparisons" ON public.offer_comparisons_detailed
FOR ALL USING (customer_id = auth.uid()) WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Bank employees can view offer comparisons" ON public.offer_comparisons_detailed
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.customer_bank_employee_matching 
    WHERE loan_application_id = offer_comparisons_detailed.loan_application_id 
    AND bank_employee_id = auth.uid()
  )
);

-- 15. Tạo RLS policies cho legal_document_sharing
CREATE POLICY "Users can manage their legal document sharing" ON public.legal_document_sharing
FOR ALL USING (
  customer_id = auth.uid() OR 
  bank_employee_id = auth.uid()
) WITH CHECK (
  customer_id = auth.uid() OR 
  bank_employee_id = auth.uid()
);

-- 16. Tạo RLS policies cho workflow_notifications
CREATE POLICY "Users can view their workflow notifications" ON public.workflow_notifications
FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their workflow notifications" ON public.workflow_notifications
FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "System can create workflow notifications" ON public.workflow_notifications
FOR INSERT WITH CHECK (true);

-- 17. Tạo triggers cho updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_application_workflow_stages_updated_at
  BEFORE UPDATE ON public.application_workflow_stages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_customer_bank_matching_updated_at
  BEFORE UPDATE ON public.customer_bank_employee_matching
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_offer_comparisons_detailed_updated_at
  BEFORE UPDATE ON public.offer_comparisons_detailed
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_legal_document_sharing_updated_at
  BEFORE UPDATE ON public.legal_document_sharing
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 18. Tạo enum types cho workflow
DO $$ BEGIN
  CREATE TYPE public.workflow_stage_enum AS ENUM (
    'initiated', 'survey_completed', 'employee_matched', 
    'offers_received', 'offers_compared', 'legal_shared', 
    'final_selection', 'completed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.application_stage_enum AS ENUM (
    'draft', 'submitted', 'under_review', 'offers_pending', 
    'offers_received', 'customer_reviewing', 'legal_review', 
    'approved', 'rejected', 'completed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;