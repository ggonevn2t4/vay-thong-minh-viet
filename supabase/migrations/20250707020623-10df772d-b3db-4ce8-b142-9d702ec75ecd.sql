-- Comprehensive Sample Data Setup for System Testing
-- This migration creates realistic sample data across all system components

-- Step 1: Create sample profiles for different user types (without gender for now)
INSERT INTO public.profiles (id, full_name, phone, date_of_birth, employment_type, monthly_income, work_experience_years, kyc_verified) VALUES
-- Customer profiles
('11111111-1111-1111-1111-111111111111', 'Nguyễn Văn An', '0901234567', '1990-05-15', 'employee', 25000000, 5, true),
('22222222-2222-2222-2222-222222222222', 'Trần Thị Bình', '0912345678', '1985-08-20', 'self_employed', 35000000, 8, true),
('33333333-3333-3333-3333-333333333333', 'Lê Hoàng Cường', '0923456789', '1992-12-10', 'employee', 18000000, 3, false),
-- Advisor profiles  
('44444444-4444-4444-4444-444444444444', 'Phạm Thị Dung', '0934567890', '1980-03-25', 'employee', 45000000, 12, true),
('55555555-5555-5555-5555-555555555555', 'Võ Minh Đức', '0945678901', '1983-07-12', 'employee', 50000000, 15, true),
-- Bank employee profile
('66666666-6666-6666-6666-666666666666', 'Đinh Thị Giang', '0956789012', '1988-11-30', 'employee', 40000000, 10, true);

-- Step 2: Assign user roles
INSERT INTO public.user_roles (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'customer'),
('22222222-2222-2222-2222-222222222222', 'customer'),
('33333333-3333-3333-3333-333333333333', 'customer'),
('44444444-4444-4444-4444-444444444444', 'advisor'),
('55555555-5555-5555-5555-555555555555', 'advisor'),
('66666666-6666-6666-6666-666666666666', 'bank_employee');

-- Step 3: Create advisor profiles
INSERT INTO public.advisor_profiles (
  id, user_id, full_name, phone, email, bank_name, branch_name, branch_address,
  job_title, department, bio, specializations, years_experience, 
  current_bank_experience_years, is_verified, availability_status,
  total_clients_helped, success_rate, average_rating, total_reviews
) VALUES
('aaaa1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 
 'Phạm Thị Dung', '0934567890', 'dung.pham@vietcombank.com', 'Vietcombank', 
 'Chi nhánh Cần Thơ', '13A4/3A KV5, Phường An Bình, Quận Ninh Kiều, TP. Cần Thơ',
 'Chuyên viên tín dụng cá nhân', 'Phòng tín dụng', 
 'Chuyên gia tư vấn khoản vay cá nhân với 12 năm kinh nghiệm trong ngành ngân hàng.',
 ARRAY['credit_loan', 'mortgage_loan', 'car_loan'], 12, 8, true, 'available',
 85, 95.5, 4.8, 42),
('bbbb2222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555',
 'Võ Minh Đức', '0945678901', 'duc.vo@techcombank.com', 'Techcombank',
 'Chi nhánh Hùng Vương', 'Số 2 Hùng Vương, Phường An Cư, Quận Ninh Kiều, TP. Cần Thơ',
 'Chuyên viên tín dụng doanh nghiệp', 'Phòng tín dụng doanh nghiệp',
 'Chuyên gia tư vấn vay vốn kinh doanh và thế chấp với 15 năm kinh nghiệm.',
 ARRAY['business_loan', 'mortgage_loan', 'education_loan'], 15, 10, true, 'available',
 120, 92.3, 4.6, 67);

-- Step 4: Create bank employee profile
INSERT INTO public.bank_employee_profiles (
  id, user_id, employee_id, full_name, department, position, 
  branch_name, branch_code, phone, email, is_active
) VALUES
('cccc3333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666',
 'EMP001', 'Đinh Thị Giang', 'Phòng thẩm định tín dụng', 'Trưởng phòng thẩm định',
 'Chi nhánh BIDV Cần Thơ', 'BIDV_CT', '0956789012', 'giang.dinh@bidv.com.vn', true);

-- Step 5: Create sample loan applications with different statuses
INSERT INTO public.loan_applications (
  id, user_id, loan_type, amount, term_months, purpose, product_type,
  monthly_income, employment_type, status, advisor_id, customer_questions,
  property_value, property_address, created_at
) VALUES
-- Approved loan
('dddd1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 'credit_loan', 200000000, 24, 'Kinh doanh cá nhân', 'credit_loan',
 25000000, 'employee', 'approved', '44444444-4444-4444-4444-444444444444',
 '{"loan_purpose_detail": "Mở quán cà phê", "business_experience": "2 năm"}',
 NULL, NULL, now() - interval '15 days'),
-- Pending loan  
('eeee2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
 'mortgage_loan', 1500000000, 180, 'Mua nhà ở', 'mortgage_loan',
 35000000, 'self_employed', 'pending', '55555555-5555-5555-5555-555555555555',
 '{"property_type": "Nhà phố", "property_documents": "Đầy đủ"}',
 2000000000, 'Số 123, Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, TP. Cần Thơ',
 now() - interval '5 days'),
-- Draft loan
('ffff3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
 'auto', 500000000, 60, 'Mua xe ô tô', 'car_loan',
 18000000, 'employee', 'draft', NULL,
 '{"car_brand": "Toyota", "car_model": "Vios", "car_year": "2024"}',
 NULL, NULL, now() - interval '2 days');

-- Step 6: Create bank loan offers
INSERT INTO public.bank_loan_offers (
  id, loan_application_id, bank_name, offered_amount, interest_rate,
  term_months, conditions, requires_cic_check, advisor_id, status
) VALUES
-- Offers for approved loan
('1111aaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddd1111-1111-1111-1111-111111111111',
 'Vietcombank', 200000000, 8.5, 24, 'Yêu cầu bảo lãnh người thân', true,
 '44444444-4444-4444-4444-444444444444', 'accepted'),
('2222bbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddd1111-1111-1111-1111-111111111111',
 'Techcombank', 180000000, 9.2, 24, 'Lãi suất ưu đãi 6 tháng đầu', true,
 '55555555-5555-5555-5555-555555555555', 'declined'),
-- Offers for pending loan
('3333cccc-cccc-cccc-cccc-cccccccccccc', 'eeee2222-2222-2222-2222-222222222222',
 'BIDV', 1400000000, 7.8, 180, 'Thế chấp bất động sản', true,
 '55555555-5555-5555-5555-555555555555', 'pending');

-- Step 7: Create conversations
INSERT INTO public.conversations (
  id, loan_application_id, customer_id, advisor_id, status, last_message_at
) VALUES
('aaaa1111-aaaa-1111-aaaa-111111111111', 'dddd1111-1111-1111-1111-111111111111',
 '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444',
 'active', now() - interval '1 hour'),
('bbbb2222-bbbb-2222-bbbb-222222222222', 'eeee2222-2222-2222-2222-222222222222',
 '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555',
 'active', now() - interval '30 minutes');

-- Step 8: Create sample messages
INSERT INTO public.messages (
  id, conversation_id, sender_id, recipient_id, content, message_type, created_at
) VALUES
-- Conversation 1 messages
('msg11111-1111-1111-1111-111111111111', 'aaaa1111-aaaa-1111-aaaa-111111111111',
 '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444',
 'Chào chị! Em đã gửi hồ sơ vay 200 triệu để kinh doanh cà phê. Em muốn hỏi về lãi suất và thời gian duyệt ạ.',
 'text', now() - interval '2 hours'),
('msg22222-2222-2222-2222-222222222222', 'aaaa1111-aaaa-1111-aaaa-111111111111',
 '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
 'Chào em! Chị đã xem hồ sơ của em rồi. Với hồ sơ hiện tại, em có thể được duyệt với lãi suất 8.5%/năm trong 24 tháng. Thời gian duyệt khoảng 3-5 ngày làm việc.',
 'text', now() - interval '1 hour 45 minutes'),
('msg33333-3333-3333-3333-333333333333', 'aaaa1111-aaaa-1111-aaaa-111111111111',
 '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444',
 'Cảm ơn chị! Vậy em cần bổ sung thêm giấy tờ gì không ạ?',
 'text', now() - interval '1 hour'),
-- Conversation 2 messages  
('msg44444-4444-4444-4444-444444444444', 'bbbb2222-bbbb-2222-bbbb-222222222222',
 '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555',
 'Anh ơi, em gửi hồ sơ vay mua nhà 1.5 tỷ. Em muốn biết tỷ lệ cho vay tối đa và các điều kiện cần thiết.',
 'text', now() - interval '45 minutes'),
('msg55555-5555-5555-5555-555555555555', 'bbbb2222-bbbb-2222-bbbb-222222222222',
 '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222',
 'Chào em! Với bất động sản trị giá 2 tỷ, em có thể vay tối đa 70% = 1.4 tỷ. Em cần bổ sung sổ đỏ và giấy chứng nhận thu nhập.',
 'text', now() - interval '30 minutes');

-- Step 9: Create wallets for users
INSERT INTO public.wallet (id, user_id, balance, points_balance) VALUES
('wallet11-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 50000.00, 100),
('wallet22-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 25000.00, 50),
('wallet33-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 0.00, 25);

-- Step 10: Create points transactions
INSERT INTO public.points_transactions (id, user_id, type, amount, description, reference_id) VALUES
('pts11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'earned', 100, 'Hoàn thành hồ sơ vay', 'dddd1111-1111-1111-1111-111111111111'),
('pts22222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'earned', 50, 'Đăng ký tài khoản', NULL);

-- Step 11: Create AI consultation sessions
INSERT INTO public.ai_consultation_sessions (
  id, user_id, session_type, status, financial_data, ai_analysis, recommendations
) VALUES
('ai111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 'financial_analysis', 'completed',
 '{"monthly_income": 25000000, "monthly_expenses": 15000000, "existing_loans": [], "savings": 50000000}',
 '{"debt_to_income_ratio": 0.0, "savings_ratio": 0.4, "credit_capacity": 180000000}',
 '{"loan_amount_suggestion": 150000000, "term_suggestion": 36, "rate_expectation": "8-9%"}'),
('ai222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
 'loan_optimization', 'active',
 '{"monthly_income": 35000000, "monthly_expenses": 20000000, "existing_loans": [], "property_value": 2000000000}',
 '{"ltv_ratio": 0.75, "affordability_score": 85, "risk_level": "medium"}',
 '{}');

-- Step 12: Create existing loans for optimization testing
INSERT INTO public.existing_loans (
  id, user_id, bank_name, loan_type, current_amount, remaining_amount,
  current_interest_rate, remaining_term_months, monthly_payment, loan_purpose,
  has_promotional_period, promotional_rate, promotional_end_date, post_promotional_rate
) VALUES
('loan1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
 'Sacombank', 'credit_loan', 300000000, 250000000, 6.5, 18, 16500000,
 'Kinh doanh', true, 6.5, (now() + interval '2 months')::date, 12.8);

-- Step 13: Create promotional loan alerts
INSERT INTO public.promotional_loan_alerts (
  id, user_id, existing_loan_id, alert_type, days_until_change,
  current_monthly_payment, future_monthly_payment, monthly_increase, total_cost_increase
) VALUES
('alert111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
 'loan1111-1111-1111-1111-111111111111', 'promotional_ending', 60,
 16500000, 25600000, 9100000, 163800000);

-- Step 14: Create notifications
INSERT INTO public.notifications (
  id, user_id, type, title, message, action_url, data
) VALUES
('notif111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 'loan_approved', 'Hồ sơ vay đã được duyệt', 
 'Chúc mừng! Hồ sơ vay 200 triệu của bạn đã được Vietcombank phê duyệt.',
 '/dashboard', '{"loan_id": "dddd1111-1111-1111-1111-111111111111", "amount": 200000000}'),
('notif222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
 'rate_alert', 'Cảnh báo lãi suất khuyến mãi', 
 'Lãi suất khuyến mãi của khoản vay tại Sacombank sẽ kết thúc sau 60 ngày.',
 '/loan-optimization', '{"loan_id": "loan1111-1111-1111-1111-111111111111"}'),
('notif333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
 'document_required', 'Cần bổ sung hồ sơ', 
 'Bạn cần hoàn thiện hồ sơ KYC để sử dụng đầy đủ tính năng của hệ thống.',
 '/settings', '{}');

-- Update last message times for conversations
UPDATE public.conversations 
SET last_message_at = (
  SELECT MAX(created_at) 
  FROM public.messages 
  WHERE messages.conversation_id = conversations.id
);

-- Update search vectors for messages
UPDATE public.messages 
SET search_vector = to_tsvector('english', content);