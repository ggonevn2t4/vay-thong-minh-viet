
-- Cập nhật bảng loan_applications để hỗ trợ các loại sản phẩm mới
ALTER TABLE loan_applications 
ADD COLUMN product_type TEXT DEFAULT 'credit_loan',
ADD COLUMN collateral_info JSONB DEFAULT '{}',
ADD COLUMN property_value BIGINT,
ADD COLUMN property_address TEXT,
ADD COLUMN loan_to_value_ratio NUMERIC,
ADD COLUMN advisor_id UUID REFERENCES advisor_profiles(id),
ADD COLUMN customer_questions JSONB DEFAULT '{}',
ADD COLUMN advisor_notes TEXT;

-- Tạo bảng messages để hỗ trợ hệ thống tin nhắn
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng conversations để quản lý cuộc trò chuyện
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID REFERENCES loan_applications(id),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  advisor_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active',
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm RLS cho bảng messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Thêm RLS cho bảng conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = advisor_id);

CREATE POLICY "Customers can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = advisor_id);

-- Thêm trigger để cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Cập nhật các enum types cho product_type
ALTER TYPE loan_type ADD VALUE IF NOT EXISTS 'credit_loan';
ALTER TYPE loan_type ADD VALUE IF NOT EXISTS 'mortgage_loan';
