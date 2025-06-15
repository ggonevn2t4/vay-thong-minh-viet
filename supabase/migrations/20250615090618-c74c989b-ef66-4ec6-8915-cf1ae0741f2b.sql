
-- Phase 2: Performance Optimization - Step 1: Add Database Indexes

-- Index for `documents` table to speed up fetching user-specific documents, ordered by upload date.
CREATE INDEX IF NOT EXISTS idx_documents_user_id_uploaded_at ON public.documents (user_id, uploaded_at DESC);

-- Index for `chat_sessions` table
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions (user_id);

-- Indexes for `document_requests` table to speed up queries for customers and advisors.
CREATE INDEX IF NOT EXISTS idx_document_requests_customer_id ON public.document_requests (customer_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_advisor_id ON public.document_requests (advisor_id);

-- Index for `financial_assessments` table
CREATE INDEX IF NOT EXISTS idx_financial_assessments_user_id ON public.financial_assessments (user_id);

-- Index for `knowledge_articles` table to speed up fetching articles by author.
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_author_id ON public.knowledge_articles (author_id);

-- Index for `loan_applications` table
CREATE INDEX IF NOT EXISTS idx_loan_applications_user_id ON public.loan_applications (user_id);

-- Index for `notifications` table to speed up fetching user-specific notifications, ordered by creation date.
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON public.notifications (user_id, created_at DESC);

-- Index for `offer_comparisons` table
CREATE INDEX IF NOT EXISTS idx_offer_comparisons_user_id ON public.offer_comparisons (user_id);

-- Index for `wallet` table to speed up lookups.
CREATE INDEX IF NOT EXISTS idx_wallet_user_id ON public.wallet (user_id);

-- Index for `wallet_transactions` table to speed up joins with the `wallet` table.
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions (wallet_id);
