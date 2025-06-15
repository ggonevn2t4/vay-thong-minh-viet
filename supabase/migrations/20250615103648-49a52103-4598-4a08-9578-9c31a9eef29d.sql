
ALTER TABLE public.advisor_profiles
ADD COLUMN date_of_birth DATE,
ADD COLUMN permanent_address TEXT,
ADD COLUMN operating_areas TEXT[],
ADD COLUMN current_bank_experience_years INTEGER,
ADD COLUMN "position" TEXT,
ADD COLUMN processing_priority TEXT[],
ADD COLUMN interest_rate_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN personal_kyc_documents JSONB DEFAULT '[]'::jsonb;

-- Đổi tên cột hiện có để làm rõ hơn cho các tài liệu liên quan đến công việc
ALTER TABLE public.advisor_profiles
RENAME COLUMN verification_documents TO work_kyc_documents;
