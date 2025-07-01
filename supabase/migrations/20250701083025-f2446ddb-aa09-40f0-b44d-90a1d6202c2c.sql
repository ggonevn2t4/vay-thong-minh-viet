
-- Create document downloads tracking table
CREATE TABLE public.document_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attachment_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  last_downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_document_downloads_attachment_id ON public.document_downloads(attachment_id);

-- Enable RLS
ALTER TABLE public.document_downloads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view and insert download tracking
CREATE POLICY "Allow authenticated users to track downloads"
  ON public.document_downloads
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
