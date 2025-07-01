
-- Create user presence table for online/offline status tracking
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away')),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index to ensure one presence record per user
CREATE UNIQUE INDEX idx_user_presence_user_id ON public.user_presence(user_id);

-- Create typing indicators table
CREATE TABLE public.typing_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  is_typing BOOLEAN NOT NULL DEFAULT false,
  last_typing_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index for typing indicators
CREATE UNIQUE INDEX idx_typing_indicators_conversation_user ON public.typing_indicators(conversation_id, user_id);

-- Create push notification tokens table
CREATE TABLE public.push_notification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('ios', 'android', 'web')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_push_tokens_user_id ON public.push_notification_tokens(user_id);
CREATE INDEX idx_push_tokens_active ON public.push_notification_tokens(is_active);

-- Enable RLS on all new tables
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_presence
CREATE POLICY "Users can view all presence status"
  ON public.user_presence
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own presence"
  ON public.user_presence
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for typing_indicators
CREATE POLICY "Users can view typing indicators in their conversations"
  ON public.typing_indicators
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.customer_id = auth.uid() OR c.advisor_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own typing indicators"
  ON public.typing_indicators
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for push_notification_tokens
CREATE POLICY "Users can manage their own push tokens"
  ON public.push_notification_tokens
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for all new tables
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;
ALTER TABLE public.typing_indicators REPLICA IDENTITY FULL;
ALTER TABLE public.push_notification_tokens REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.push_notification_tokens;

-- Create function to update user presence
CREATE OR REPLACE FUNCTION public.update_user_presence(user_uuid UUID, new_status TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_presence (user_id, status)
  VALUES (user_uuid, new_status)
  ON CONFLICT (user_id)
  DO UPDATE SET
    status = new_status,
    last_seen = now(),
    updated_at = now();
END;
$$;

-- Create function to update typing indicator
CREATE OR REPLACE FUNCTION public.update_typing_indicator(conv_id UUID, user_uuid UUID, typing BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.typing_indicators (conversation_id, user_id, is_typing)
  VALUES (conv_id, user_uuid, typing)
  ON CONFLICT (conversation_id, user_id)
  DO UPDATE SET
    is_typing = typing,
    last_typing_at = now(),
    updated_at = now();
    
  -- Clean up old typing indicators (older than 10 seconds)
  DELETE FROM public.typing_indicators
  WHERE conversation_id = conv_id
    AND user_id != user_uuid
    AND last_typing_at < now() - INTERVAL '10 seconds';
END;
$$;

-- Create function to clean up old typing indicators
CREATE OR REPLACE FUNCTION public.cleanup_old_typing_indicators()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.typing_indicators
  WHERE last_typing_at < now() - INTERVAL '10 seconds';
END;
$$;
