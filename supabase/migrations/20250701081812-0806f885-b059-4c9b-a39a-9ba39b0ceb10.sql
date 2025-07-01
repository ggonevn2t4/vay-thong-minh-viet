
-- Create message_attachments table for storing file attachments in messages
CREATE TABLE public.message_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  content_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for message_attachments
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for message_attachments - users can view attachments if they can view the message
CREATE POLICY "Users can view message attachments" 
ON public.message_attachments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.messages m 
    WHERE m.id = message_attachments.message_id 
    AND (auth.uid() = m.sender_id OR auth.uid() = m.recipient_id)
  )
);

-- Users can insert attachments if they can send the message
CREATE POLICY "Users can create message attachments" 
ON public.message_attachments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.messages m 
    WHERE m.id = message_attachments.message_id 
    AND auth.uid() = m.sender_id
  )
);

-- Create storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', false);

-- Create storage policies for message attachments
CREATE POLICY "Users can upload message attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view message attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'message-attachments' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.message_attachments ma
      JOIN public.messages m ON ma.message_id = m.id
      WHERE ma.file_path = name
      AND (auth.uid() = m.sender_id OR auth.uid() = m.recipient_id)
    )
  )
);

CREATE POLICY "Users can download message attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'message-attachments' AND
  EXISTS (
    SELECT 1 FROM public.message_attachments ma
    JOIN public.messages m ON ma.message_id = m.id
    WHERE ma.file_path = name
    AND (auth.uid() = m.sender_id OR auth.uid() = m.recipient_id)
  )
);
