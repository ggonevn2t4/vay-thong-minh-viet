
-- Add full-text search capabilities to messages table
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS messages_search_idx ON public.messages USING gin(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION public.update_message_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
DROP TRIGGER IF EXISTS update_message_search_vector_trigger ON public.messages;
CREATE TRIGGER update_message_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_message_search_vector();

-- Update existing messages with search vectors
UPDATE public.messages SET search_vector = to_tsvector('english', COALESCE(content, '')) WHERE search_vector IS NULL;

-- Create function for message search
CREATE OR REPLACE FUNCTION public.search_messages(
  p_conversation_id uuid,
  p_search_query text DEFAULT '',
  p_sender_id uuid DEFAULT NULL,
  p_date_from timestamp with time zone DEFAULT NULL,
  p_date_to timestamp with time zone DEFAULT NULL,
  p_message_type text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  conversation_id uuid,
  sender_id uuid,
  recipient_id uuid,
  content text,
  message_type text,
  read_at timestamp with time zone,
  created_at timestamp with time zone,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.conversation_id,
    m.sender_id,
    m.recipient_id,
    m.content,
    m.message_type,
    m.read_at,
    m.created_at,
    CASE 
      WHEN p_search_query = '' THEN 1.0
      ELSE ts_rank(m.search_vector, plainto_tsquery('english', p_search_query))
    END as rank
  FROM public.messages m
  WHERE 
    m.conversation_id = p_conversation_id
    AND (
      p_search_query = '' OR 
      m.search_vector @@ plainto_tsquery('english', p_search_query)
    )
    AND (p_sender_id IS NULL OR m.sender_id = p_sender_id)
    AND (p_date_from IS NULL OR m.created_at >= p_date_from)
    AND (p_date_to IS NULL OR m.created_at <= p_date_to)
    AND (p_message_type IS NULL OR m.message_type = p_message_type)
  ORDER BY 
    CASE WHEN p_search_query = '' THEN m.created_at ELSE rank END DESC,
    m.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
