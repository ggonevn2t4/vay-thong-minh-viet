
-- Tạo enum cho giới tính
CREATE TYPE public.gender_type AS ENUM ('nam', 'nu', 'khac');

-- Tạo enum cho loại giấy tờ tùy thân
CREATE TYPE public.id_type AS ENUM ('cccd', 'cmnd');

-- Cập nhật bảng profiles để thêm các trường thông tin chi tiết
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender gender_type,
ADD COLUMN IF NOT EXISTS permanent_address_city text,
ADD COLUMN IF NOT EXISTS permanent_address_district text,
ADD COLUMN IF NOT EXISTS permanent_address_ward text,
ADD COLUMN IF NOT EXISTS permanent_address_street text,
ADD COLUMN IF NOT EXISTS current_address_city text,
ADD COLUMN IF NOT EXISTS current_address_district text,
ADD COLUMN IF NOT EXISTS current_address_ward text,
ADD COLUMN IF NOT EXISTS current_address_street text,
ADD COLUMN IF NOT EXISTS id_number text,
ADD COLUMN IF NOT EXISTS id_type id_type,
ADD COLUMN IF NOT EXISTS id_issue_date date,
ADD COLUMN IF NOT EXISTS id_expiry_date date,
ADD COLUMN IF NOT EXISTS id_never_expires boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS id_issuing_authority text,
ADD COLUMN IF NOT EXISTS old_id_number text,
ADD COLUMN IF NOT EXISTS id_front_photo_url text,
ADD COLUMN IF NOT EXISTS id_back_photo_url text,
ADD COLUMN IF NOT EXISTS portrait_photo_url text,
ADD COLUMN IF NOT EXISTS kyc_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS kyc_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS email text;

-- Tạo bảng lưu trữ file upload cho KYC
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL, -- 'id_front', 'id_back', 'portrait'
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now(),
  verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  verified_by uuid
);

-- Enable RLS cho bảng kyc_documents
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho kyc_documents
CREATE POLICY "Users can manage their own KYC documents"
  ON public.kyc_documents
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tạo storage bucket cho KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Tạo policy cho storage bucket
CREATE POLICY "Users can upload their own KYC documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own KYC documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own KYC documents"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own KYC documents"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
