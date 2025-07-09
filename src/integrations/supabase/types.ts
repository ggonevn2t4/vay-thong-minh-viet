export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      advisor_profiles: {
        Row: {
          achievements: string[] | null
          availability_status: string | null
          avatar_url: string | null
          average_rating: number | null
          bank_employee_id: string | null
          bank_name: string
          bio: string | null
          branch_address: string | null
          branch_name: string | null
          certifications: string[] | null
          client_testimonials: Json | null
          created_at: string
          current_bank_experience_years: number | null
          date_of_birth: string | null
          department: string | null
          email: string | null
          full_name: string
          id: string
          interest_rate_details: Json | null
          is_verified: boolean | null
          job_title: string | null
          languages: string[] | null
          last_rate_update: string | null
          loan_types: Json | null
          location: string | null
          operating_areas: string[] | null
          permanent_address: string | null
          personal_kyc_documents: Json | null
          phone: string | null
          position: string | null
          processing_priority: string[] | null
          rate_update_frequency: string | null
          service_area: string[] | null
          specializations: string[] | null
          success_rate: number | null
          total_clients_helped: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          work_kyc_documents: Json | null
          working_hours: Json | null
          years_experience: number | null
        }
        Insert: {
          achievements?: string[] | null
          availability_status?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bank_employee_id?: string | null
          bank_name: string
          bio?: string | null
          branch_address?: string | null
          branch_name?: string | null
          certifications?: string[] | null
          client_testimonials?: Json | null
          created_at?: string
          current_bank_experience_years?: number | null
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          full_name: string
          id?: string
          interest_rate_details?: Json | null
          is_verified?: boolean | null
          job_title?: string | null
          languages?: string[] | null
          last_rate_update?: string | null
          loan_types?: Json | null
          location?: string | null
          operating_areas?: string[] | null
          permanent_address?: string | null
          personal_kyc_documents?: Json | null
          phone?: string | null
          position?: string | null
          processing_priority?: string[] | null
          rate_update_frequency?: string | null
          service_area?: string[] | null
          specializations?: string[] | null
          success_rate?: number | null
          total_clients_helped?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          work_kyc_documents?: Json | null
          working_hours?: Json | null
          years_experience?: number | null
        }
        Update: {
          achievements?: string[] | null
          availability_status?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bank_employee_id?: string | null
          bank_name?: string
          bio?: string | null
          branch_address?: string | null
          branch_name?: string | null
          certifications?: string[] | null
          client_testimonials?: Json | null
          created_at?: string
          current_bank_experience_years?: number | null
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          full_name?: string
          id?: string
          interest_rate_details?: Json | null
          is_verified?: boolean | null
          job_title?: string | null
          languages?: string[] | null
          last_rate_update?: string | null
          loan_types?: Json | null
          location?: string | null
          operating_areas?: string[] | null
          permanent_address?: string | null
          personal_kyc_documents?: Json | null
          phone?: string | null
          position?: string | null
          processing_priority?: string[] | null
          rate_update_frequency?: string | null
          service_area?: string[] | null
          specializations?: string[] | null
          success_rate?: number | null
          total_clients_helped?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          work_kyc_documents?: Json | null
          working_hours?: Json | null
          years_experience?: number | null
        }
        Relationships: []
      }
      ai_consultation_sessions: {
        Row: {
          ai_analysis: Json | null
          bank_approval_predictions: Json | null
          created_at: string
          financial_data: Json | null
          id: string
          loan_optimization: Json | null
          recommendations: Json | null
          risk_assessment: Json | null
          session_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          bank_approval_predictions?: Json | null
          created_at?: string
          financial_data?: Json | null
          id?: string
          loan_optimization?: Json | null
          recommendations?: Json | null
          risk_assessment?: Json | null
          session_type?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          bank_approval_predictions?: Json | null
          created_at?: string
          financial_data?: Json | null
          id?: string
          loan_optimization?: Json | null
          recommendations?: Json | null
          risk_assessment?: Json | null
          session_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      application_workflow_stages: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          loan_application_id: string
          notes: string | null
          stage_data: Json | null
          stage_name: string
          stage_status: string
          started_at: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          loan_application_id: string
          notes?: string | null
          stage_data?: Json | null
          stage_name: string
          stage_status?: string
          started_at?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          loan_application_id?: string
          notes?: string | null
          stage_data?: Json | null
          stage_name?: string
          stage_status?: string
          started_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_workflow_stages_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_employee_profiles: {
        Row: {
          branch_code: string
          branch_name: string
          created_at: string | null
          department: string
          email: string | null
          employee_id: string
          full_name: string
          hire_date: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          phone: string | null
          position: string
          supervisor_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branch_code: string
          branch_name: string
          created_at?: string | null
          department: string
          email?: string | null
          employee_id: string
          full_name: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          phone?: string | null
          position: string
          supervisor_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branch_code?: string
          branch_name?: string
          created_at?: string | null
          department?: string
          email?: string | null
          employee_id?: string
          full_name?: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          phone?: string | null
          position?: string
          supervisor_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_employee_profiles_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "bank_employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_loan_offers: {
        Row: {
          advisor_id: string | null
          bank_employee_notes: string | null
          bank_name: string
          comparison_highlights: Json | null
          conditions: string | null
          created_at: string
          customer_questions: Json | null
          customer_responses: Json | null
          id: string
          interest_rate: number
          loan_application_id: string
          offer_advantages: Json | null
          offer_expires_at: string | null
          offer_type: string | null
          offered_amount: number
          processing_time_days: number | null
          required_documents: Json | null
          requires_cic_check: boolean | null
          status: string
          term_months: number
          updated_at: string
        }
        Insert: {
          advisor_id?: string | null
          bank_employee_notes?: string | null
          bank_name: string
          comparison_highlights?: Json | null
          conditions?: string | null
          created_at?: string
          customer_questions?: Json | null
          customer_responses?: Json | null
          id?: string
          interest_rate: number
          loan_application_id: string
          offer_advantages?: Json | null
          offer_expires_at?: string | null
          offer_type?: string | null
          offered_amount: number
          processing_time_days?: number | null
          required_documents?: Json | null
          requires_cic_check?: boolean | null
          status?: string
          term_months: number
          updated_at?: string
        }
        Update: {
          advisor_id?: string | null
          bank_employee_notes?: string | null
          bank_name?: string
          comparison_highlights?: Json | null
          conditions?: string | null
          created_at?: string
          customer_questions?: Json | null
          customer_responses?: Json | null
          id?: string
          interest_rate?: number
          loan_application_id?: string
          offer_advantages?: Json | null
          offer_expires_at?: string | null
          offer_type?: string | null
          offered_amount?: number
          processing_time_days?: number | null
          required_documents?: Json | null
          requires_cic_check?: boolean | null
          status?: string
          term_months?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_loan_offers_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          last_activity: string | null
          session_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          session_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          session_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      cic_check_requests: {
        Row: {
          approved_at: string | null
          bank_name: string
          cic_report_data: Json | null
          cic_score: number | null
          completed_at: string | null
          created_at: string
          customer_id: string
          id: string
          loan_application_id: string | null
          requested_at: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          bank_name: string
          cic_report_data?: Json | null
          cic_score?: number | null
          completed_at?: string | null
          created_at?: string
          customer_id: string
          id?: string
          loan_application_id?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          bank_name?: string
          cic_report_data?: Json | null
          cic_score?: number | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          loan_application_id?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cic_check_requests_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      company_bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string | null
          bank_code: string | null
          bank_name: string
          branch_name: string | null
          created_at: string
          currency: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type?: string | null
          bank_code?: string | null
          bank_name: string
          branch_name?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string | null
          bank_code?: string | null
          bank_name?: string
          branch_name?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          advisor_id: string | null
          conversation_metadata: Json | null
          conversation_type: string | null
          created_at: string | null
          customer_id: string
          id: string
          last_message_at: string | null
          loan_application_id: string | null
          priority_level: string | null
          status: string | null
          updated_at: string | null
          workflow_stage: string | null
        }
        Insert: {
          advisor_id?: string | null
          conversation_metadata?: Json | null
          conversation_type?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          last_message_at?: string | null
          loan_application_id?: string | null
          priority_level?: string | null
          status?: string | null
          updated_at?: string | null
          workflow_stage?: string | null
        }
        Update: {
          advisor_id?: string | null
          conversation_metadata?: Json | null
          conversation_type?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          last_message_at?: string | null
          loan_application_id?: string | null
          priority_level?: string | null
          status?: string | null
          updated_at?: string | null
          workflow_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_card_survey_responses: {
        Row: {
          annual_fee_preference: string | null
          assets: Json | null
          created_at: string
          credit_history_details: string | null
          credit_history_issues: boolean | null
          date_of_birth: string | null
          desired_credit_limit: number | null
          email: string | null
          employer_name: string | null
          employment_status: string
          estimated_credit_score: number | null
          existing_credit_cards: Json | null
          existing_loans: Json | null
          full_name: string
          id: string
          job_title: string | null
          marital_status: string | null
          monthly_expenses: number | null
          monthly_salary: number | null
          number_of_dependents: number | null
          other_income_sources: Json | null
          phone_number: string
          preferred_benefits: Json | null
          previous_bank_relationships: string | null
          primary_card_usage: string | null
          recommended_products: Json | null
          risk_assessment: Json | null
          savings_amount: number | null
          survey_completed_at: string | null
          total_monthly_income: number | null
          updated_at: string
          user_id: string
          work_experience_years: number | null
        }
        Insert: {
          annual_fee_preference?: string | null
          assets?: Json | null
          created_at?: string
          credit_history_details?: string | null
          credit_history_issues?: boolean | null
          date_of_birth?: string | null
          desired_credit_limit?: number | null
          email?: string | null
          employer_name?: string | null
          employment_status: string
          estimated_credit_score?: number | null
          existing_credit_cards?: Json | null
          existing_loans?: Json | null
          full_name: string
          id?: string
          job_title?: string | null
          marital_status?: string | null
          monthly_expenses?: number | null
          monthly_salary?: number | null
          number_of_dependents?: number | null
          other_income_sources?: Json | null
          phone_number: string
          preferred_benefits?: Json | null
          previous_bank_relationships?: string | null
          primary_card_usage?: string | null
          recommended_products?: Json | null
          risk_assessment?: Json | null
          savings_amount?: number | null
          survey_completed_at?: string | null
          total_monthly_income?: number | null
          updated_at?: string
          user_id: string
          work_experience_years?: number | null
        }
        Update: {
          annual_fee_preference?: string | null
          assets?: Json | null
          created_at?: string
          credit_history_details?: string | null
          credit_history_issues?: boolean | null
          date_of_birth?: string | null
          desired_credit_limit?: number | null
          email?: string | null
          employer_name?: string | null
          employment_status?: string
          estimated_credit_score?: number | null
          existing_credit_cards?: Json | null
          existing_loans?: Json | null
          full_name?: string
          id?: string
          job_title?: string | null
          marital_status?: string | null
          monthly_expenses?: number | null
          monthly_salary?: number | null
          number_of_dependents?: number | null
          other_income_sources?: Json | null
          phone_number?: string
          preferred_benefits?: Json | null
          previous_bank_relationships?: string | null
          primary_card_usage?: string | null
          recommended_products?: Json | null
          risk_assessment?: Json | null
          savings_amount?: number | null
          survey_completed_at?: string | null
          total_monthly_income?: number | null
          updated_at?: string
          user_id?: string
          work_experience_years?: number | null
        }
        Relationships: []
      }
      customer_bank_employee_matching: {
        Row: {
          assigned_at: string | null
          assignment_type: string | null
          bank_employee_id: string
          created_at: string | null
          customer_id: string
          id: string
          loan_application_id: string
          matching_criteria: Json | null
          matching_score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assignment_type?: string | null
          bank_employee_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          loan_application_id: string
          matching_criteria?: Json | null
          matching_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assignment_type?: string | null
          bank_employee_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          loan_application_id?: string
          matching_criteria?: Json | null
          matching_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_bank_employee_matching_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_cic_history: {
        Row: {
          bank_name: string
          check_date: string
          created_at: string
          customer_id: string
          id: string
          impact_score: number | null
          purpose: string | null
        }
        Insert: {
          bank_name: string
          check_date?: string
          created_at?: string
          customer_id: string
          id?: string
          impact_score?: number | null
          purpose?: string | null
        }
        Update: {
          bank_name?: string
          check_date?: string
          created_at?: string
          customer_id?: string
          id?: string
          impact_score?: number | null
          purpose?: string | null
        }
        Relationships: []
      }
      customer_credit_assessments: {
        Row: {
          assessment_date: string | null
          assessment_notes: string | null
          assessor_id: string
          created_at: string | null
          credit_score: number | null
          customer_id: string
          debt_to_income_ratio: number | null
          employment_verification_status: string | null
          id: string
          income_verification_status: string | null
          recommended_interest_rate: number | null
          recommended_loan_amount: number | null
          risk_level: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_notes?: string | null
          assessor_id: string
          created_at?: string | null
          credit_score?: number | null
          customer_id: string
          debt_to_income_ratio?: number | null
          employment_verification_status?: string | null
          id?: string
          income_verification_status?: string | null
          recommended_interest_rate?: number | null
          recommended_loan_amount?: number | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessment_notes?: string | null
          assessor_id?: string
          created_at?: string | null
          credit_score?: number | null
          customer_id?: string
          debt_to_income_ratio?: number | null
          employment_verification_status?: string | null
          id?: string
          income_verification_status?: string | null
          recommended_interest_rate?: number | null
          recommended_loan_amount?: number | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_warnings: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          customer_id: string
          id: string
          is_acknowledged: boolean | null
          message: string
          severity: string
          warning_type: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_acknowledged?: boolean | null
          message: string
          severity?: string
          warning_type: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_acknowledged?: boolean | null
          message?: string
          severity?: string
          warning_type?: string
        }
        Relationships: []
      }
      document_downloads: {
        Row: {
          attachment_id: string
          count: number
          created_at: string
          id: string
          last_downloaded_at: string
        }
        Insert: {
          attachment_id: string
          count?: number
          created_at?: string
          id?: string
          last_downloaded_at?: string
        }
        Update: {
          attachment_id?: string
          count?: number
          created_at?: string
          id?: string
          last_downloaded_at?: string
        }
        Relationships: []
      }
      document_requests: {
        Row: {
          advisor_id: string | null
          auto_generated: boolean | null
          customer_id: string
          description: string | null
          document_category: string | null
          document_name: string
          document_type: string
          file_url: string | null
          id: string
          legal_review_required: boolean | null
          loan_application_id: string | null
          notes: string | null
          priority_level: string | null
          requested_at: string
          reviewed_at: string | null
          status: string
          template_used: string | null
          uploaded_at: string | null
        }
        Insert: {
          advisor_id?: string | null
          auto_generated?: boolean | null
          customer_id: string
          description?: string | null
          document_category?: string | null
          document_name: string
          document_type: string
          file_url?: string | null
          id?: string
          legal_review_required?: boolean | null
          loan_application_id?: string | null
          notes?: string | null
          priority_level?: string | null
          requested_at?: string
          reviewed_at?: string | null
          status?: string
          template_used?: string | null
          uploaded_at?: string | null
        }
        Update: {
          advisor_id?: string | null
          auto_generated?: boolean | null
          customer_id?: string
          description?: string | null
          document_category?: string | null
          document_name?: string
          document_type?: string
          file_url?: string | null
          id?: string
          legal_review_required?: boolean | null
          loan_application_id?: string | null
          notes?: string | null
          priority_level?: string | null
          requested_at?: string
          reviewed_at?: string | null
          status?: string
          template_used?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          content_type: string | null
          description: string | null
          file_path: string
          file_size: number | null
          id: string
          name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content_type?: string | null
          description?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content_type?: string | null
          description?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      existing_loans: {
        Row: {
          additional_info: Json | null
          bank_name: string
          created_at: string
          current_amount: number
          current_interest_rate: number
          has_promotional_period: boolean | null
          id: string
          loan_purpose: string | null
          loan_type: string
          monthly_payment: number
          original_loan_date: string | null
          post_promotional_rate: number | null
          promotional_end_date: string | null
          promotional_rate: number | null
          remaining_amount: number
          remaining_term_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_info?: Json | null
          bank_name: string
          created_at?: string
          current_amount: number
          current_interest_rate: number
          has_promotional_period?: boolean | null
          id?: string
          loan_purpose?: string | null
          loan_type: string
          monthly_payment: number
          original_loan_date?: string | null
          post_promotional_rate?: number | null
          promotional_end_date?: string | null
          promotional_rate?: number | null
          remaining_amount: number
          remaining_term_months: number
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_info?: Json | null
          bank_name?: string
          created_at?: string
          current_amount?: number
          current_interest_rate?: number
          has_promotional_period?: boolean | null
          id?: string
          loan_purpose?: string | null
          loan_type?: string
          monthly_payment?: number
          original_loan_date?: string | null
          post_promotional_rate?: number | null
          promotional_end_date?: string | null
          promotional_rate?: number | null
          remaining_amount?: number
          remaining_term_months?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_analysis_reports: {
        Row: {
          ai_confidence_score: number | null
          consultation_session_id: string | null
          created_at: string
          credit_score_factors: Json | null
          debt_analysis: Json | null
          expense_analysis: Json | null
          id: string
          improvement_suggestions: Json | null
          income_analysis: Json | null
          loan_capacity: Json | null
          optimal_loan_structure: Json | null
          user_id: string
        }
        Insert: {
          ai_confidence_score?: number | null
          consultation_session_id?: string | null
          created_at?: string
          credit_score_factors?: Json | null
          debt_analysis?: Json | null
          expense_analysis?: Json | null
          id?: string
          improvement_suggestions?: Json | null
          income_analysis?: Json | null
          loan_capacity?: Json | null
          optimal_loan_structure?: Json | null
          user_id: string
        }
        Update: {
          ai_confidence_score?: number | null
          consultation_session_id?: string | null
          created_at?: string
          credit_score_factors?: Json | null
          debt_analysis?: Json | null
          expense_analysis?: Json | null
          id?: string
          improvement_suggestions?: Json | null
          income_analysis?: Json | null
          loan_capacity?: Json | null
          optimal_loan_structure?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_analysis_reports_consultation_session_id_fkey"
            columns: ["consultation_session_id"]
            isOneToOne: false
            referencedRelation: "ai_consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_assessments: {
        Row: {
          ai_analysis: string | null
          assessment_data: Json | null
          created_at: string | null
          credit_score: number | null
          debt_to_income_ratio: number | null
          id: string
          loan_application_id: string | null
          recommendations: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          assessment_data?: Json | null
          created_at?: string | null
          credit_score?: number | null
          debt_to_income_ratio?: number | null
          id?: string
          loan_application_id?: string | null
          recommendations?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          assessment_data?: Json | null
          created_at?: string | null
          credit_score?: number | null
          debt_to_income_ratio?: number | null
          id?: string
          loan_application_id?: string | null
          recommendations?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_assessments_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_rate_alerts: {
        Row: {
          alert_threshold: number
          bank_name: string
          created_at: string
          current_rate: number
          id: string
          is_active: boolean | null
          last_triggered: string | null
          loan_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_threshold: number
          bank_name: string
          created_at?: string
          current_rate: number
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          loan_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_threshold?: number
          bank_name?: string
          created_at?: string
          current_rate?: number
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          loan_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_articles: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          id: string
          is_published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          document_type: string
          file_name: string
          file_url: string
          id: string
          uploaded_at: string | null
          user_id: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_url: string
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_document_sharing: {
        Row: {
          access_expires_at: string | null
          access_granted_at: string | null
          bank_employee_id: string | null
          created_at: string | null
          customer_id: string
          document_type: string
          document_url: string
          download_count: number | null
          id: string
          last_accessed_at: string | null
          loan_application_id: string
          sharing_permissions: Json | null
          sharing_status: string | null
          updated_at: string | null
        }
        Insert: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          bank_employee_id?: string | null
          created_at?: string | null
          customer_id: string
          document_type: string
          document_url: string
          download_count?: number | null
          id?: string
          last_accessed_at?: string | null
          loan_application_id: string
          sharing_permissions?: Json | null
          sharing_status?: string | null
          updated_at?: string | null
        }
        Update: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          bank_employee_id?: string | null
          created_at?: string | null
          customer_id?: string
          document_type?: string
          document_url?: string
          download_count?: number | null
          id?: string
          last_accessed_at?: string | null
          loan_application_id?: string
          sharing_permissions?: Json | null
          sharing_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_document_sharing_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_application_reviews: {
        Row: {
          approval_amount: number | null
          approved_interest_rate: number | null
          approved_term_months: number | null
          conditions: string | null
          created_at: string | null
          documents_requested: Json | null
          id: string
          loan_application_id: string
          review_notes: string | null
          review_status: string
          reviewed_at: string | null
          reviewer_id: string
          updated_at: string | null
        }
        Insert: {
          approval_amount?: number | null
          approved_interest_rate?: number | null
          approved_term_months?: number | null
          conditions?: string | null
          created_at?: string | null
          documents_requested?: Json | null
          id?: string
          loan_application_id: string
          review_notes?: string | null
          review_status: string
          reviewed_at?: string | null
          reviewer_id: string
          updated_at?: string | null
        }
        Update: {
          approval_amount?: number | null
          approved_interest_rate?: number | null
          approved_term_months?: number | null
          conditions?: string | null
          created_at?: string | null
          documents_requested?: Json | null
          id?: string
          loan_application_id?: string
          review_notes?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_application_reviews_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          advisor_id: string | null
          advisor_notes: string | null
          amount: number
          application_stage: string | null
          bank_matching_criteria: Json | null
          bank_responses: Json | null
          collateral_info: Json | null
          created_at: string | null
          customer_education_completed: boolean | null
          customer_priority_score: number | null
          customer_questions: Json | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          final_selected_offer_id: string | null
          id: string
          legal_documents_shared: boolean | null
          legal_documents_shared_at: string | null
          loan_to_value_ratio: number | null
          loan_type: Database["public"]["Enums"]["loan_type"]
          monthly_income: number | null
          offer_comparison_data: Json | null
          offers_generated_at: string | null
          product_type: string | null
          property_address: string | null
          property_value: number | null
          purpose: string | null
          status: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
          total_offers_count: number | null
          updated_at: string | null
          user_id: string
          workflow_status: string | null
        }
        Insert: {
          advisor_id?: string | null
          advisor_notes?: string | null
          amount: number
          application_stage?: string | null
          bank_matching_criteria?: Json | null
          bank_responses?: Json | null
          collateral_info?: Json | null
          created_at?: string | null
          customer_education_completed?: boolean | null
          customer_priority_score?: number | null
          customer_questions?: Json | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          final_selected_offer_id?: string | null
          id?: string
          legal_documents_shared?: boolean | null
          legal_documents_shared_at?: string | null
          loan_to_value_ratio?: number | null
          loan_type: Database["public"]["Enums"]["loan_type"]
          monthly_income?: number | null
          offer_comparison_data?: Json | null
          offers_generated_at?: string | null
          product_type?: string | null
          property_address?: string | null
          property_value?: number | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
          total_offers_count?: number | null
          updated_at?: string | null
          user_id: string
          workflow_status?: string | null
        }
        Update: {
          advisor_id?: string | null
          advisor_notes?: string | null
          amount?: number
          application_stage?: string | null
          bank_matching_criteria?: Json | null
          bank_responses?: Json | null
          collateral_info?: Json | null
          created_at?: string | null
          customer_education_completed?: boolean | null
          customer_priority_score?: number | null
          customer_questions?: Json | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          final_selected_offer_id?: string | null
          id?: string
          legal_documents_shared?: boolean | null
          legal_documents_shared_at?: string | null
          loan_to_value_ratio?: number | null
          loan_type?: Database["public"]["Enums"]["loan_type"]
          monthly_income?: number | null
          offer_comparison_data?: Json | null
          offers_generated_at?: string | null
          product_type?: string | null
          property_address?: string | null
          property_value?: number | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months?: number
          total_offers_count?: number | null
          updated_at?: string | null
          user_id?: string
          workflow_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_conversations: {
        Row: {
          advisor_id: string
          created_at: string
          customer_id: string
          id: string
          last_message_at: string | null
          loan_application_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          advisor_id: string
          created_at?: string
          customer_id: string
          id?: string
          last_message_at?: string | null
          loan_application_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          last_message_at?: string | null
          loan_application_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_conversations_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_optimization_alerts: {
        Row: {
          alert_data: Json | null
          alert_type: string
          created_at: string
          existing_loan_id: string
          id: string
          is_active: boolean | null
          read_at: string | null
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_data?: Json | null
          alert_type: string
          created_at?: string
          existing_loan_id: string
          id?: string
          is_active?: boolean | null
          read_at?: string | null
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_data?: Json | null
          alert_type?: string
          created_at?: string
          existing_loan_id?: string
          id?: string
          is_active?: boolean | null
          read_at?: string | null
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_optimization_alerts_existing_loan_id_fkey"
            columns: ["existing_loan_id"]
            isOneToOne: false
            referencedRelation: "existing_loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_optimization_analysis: {
        Row: {
          ai_confidence_score: number | null
          alternative_offers: Json | null
          consultation_session_id: string | null
          created_at: string
          current_loan_cost: Json | null
          existing_loan_id: string
          id: string
          optimization_recommendations: Json | null
          potential_savings: Json | null
          recommended_actions: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          ai_confidence_score?: number | null
          alternative_offers?: Json | null
          consultation_session_id?: string | null
          created_at?: string
          current_loan_cost?: Json | null
          existing_loan_id: string
          id?: string
          optimization_recommendations?: Json | null
          potential_savings?: Json | null
          recommended_actions?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          ai_confidence_score?: number | null
          alternative_offers?: Json | null
          consultation_session_id?: string | null
          created_at?: string
          current_loan_cost?: Json | null
          existing_loan_id?: string
          id?: string
          optimization_recommendations?: Json | null
          potential_savings?: Json | null
          recommended_actions?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_optimization_analysis_consultation_session_id_fkey"
            columns: ["consultation_session_id"]
            isOneToOne: false
            referencedRelation: "ai_consultation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_optimization_analysis_existing_loan_id_fkey"
            columns: ["existing_loan_id"]
            isOneToOne: false
            referencedRelation: "existing_loans"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          content_type: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          message_id: string
        }
        Insert: {
          content_type: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          message_id: string
        }
        Update: {
          content_type?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          message_type: string | null
          read_at: string | null
          recipient_id: string
          search_vector: unknown | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id: string
          search_vector?: unknown | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string
          search_vector?: unknown | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_comparisons: {
        Row: {
          comparison_name: string
          created_at: string
          id: string
          loan_amount: number
          loan_purpose: string | null
          loan_term_months: number
          offers: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          comparison_name: string
          created_at?: string
          id?: string
          loan_amount: number
          loan_purpose?: string | null
          loan_term_months: number
          offers?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          comparison_name?: string
          created_at?: string
          id?: string
          loan_amount?: number
          loan_purpose?: string | null
          loan_term_months?: number
          offers?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_comparisons_detailed: {
        Row: {
          comparison_criteria: Json | null
          comparison_notes: string | null
          created_at: string | null
          customer_id: string
          customer_preferences: Json | null
          customer_selected_offer_id: string | null
          id: string
          legal_review_status: string | null
          loan_application_id: string
          offers_data: Json
          recommended_offer_id: string | null
          shared_with_legal: boolean | null
          updated_at: string | null
        }
        Insert: {
          comparison_criteria?: Json | null
          comparison_notes?: string | null
          created_at?: string | null
          customer_id: string
          customer_preferences?: Json | null
          customer_selected_offer_id?: string | null
          id?: string
          legal_review_status?: string | null
          loan_application_id: string
          offers_data?: Json
          recommended_offer_id?: string | null
          shared_with_legal?: boolean | null
          updated_at?: string | null
        }
        Update: {
          comparison_criteria?: Json | null
          comparison_notes?: string | null
          created_at?: string | null
          customer_id?: string
          customer_preferences?: Json | null
          customer_selected_offer_id?: string | null
          id?: string
          legal_review_status?: string | null
          loan_application_id?: string
          offers_data?: Json
          recommended_offer_id?: string | null
          shared_with_legal?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_comparisons_detailed_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      points_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: Database["public"]["Enums"]["points_transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: Database["public"]["Enums"]["points_transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: Database["public"]["Enums"]["points_transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          current_address_city: string | null
          current_address_district: string | null
          current_address_street: string | null
          current_address_ward: string | null
          date_of_birth: string | null
          email: string | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          id_back_photo_url: string | null
          id_expiry_date: string | null
          id_front_photo_url: string | null
          id_issue_date: string | null
          id_issuing_authority: string | null
          id_never_expires: boolean | null
          id_number: string | null
          id_type: Database["public"]["Enums"]["id_type"] | null
          kyc_verified: boolean | null
          kyc_verified_at: string | null
          monthly_income: number | null
          old_id_number: string | null
          permanent_address_city: string | null
          permanent_address_district: string | null
          permanent_address_street: string | null
          permanent_address_ward: string | null
          phone: string | null
          portrait_photo_url: string | null
          updated_at: string | null
          work_experience_years: number | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          current_address_city?: string | null
          current_address_district?: string | null
          current_address_street?: string | null
          current_address_ward?: string | null
          date_of_birth?: string | null
          email?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          id_back_photo_url?: string | null
          id_expiry_date?: string | null
          id_front_photo_url?: string | null
          id_issue_date?: string | null
          id_issuing_authority?: string | null
          id_never_expires?: boolean | null
          id_number?: string | null
          id_type?: Database["public"]["Enums"]["id_type"] | null
          kyc_verified?: boolean | null
          kyc_verified_at?: string | null
          monthly_income?: number | null
          old_id_number?: string | null
          permanent_address_city?: string | null
          permanent_address_district?: string | null
          permanent_address_street?: string | null
          permanent_address_ward?: string | null
          phone?: string | null
          portrait_photo_url?: string | null
          updated_at?: string | null
          work_experience_years?: number | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          current_address_city?: string | null
          current_address_district?: string | null
          current_address_street?: string | null
          current_address_ward?: string | null
          date_of_birth?: string | null
          email?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          id_back_photo_url?: string | null
          id_expiry_date?: string | null
          id_front_photo_url?: string | null
          id_issue_date?: string | null
          id_issuing_authority?: string | null
          id_never_expires?: boolean | null
          id_number?: string | null
          id_type?: Database["public"]["Enums"]["id_type"] | null
          kyc_verified?: boolean | null
          kyc_verified_at?: string | null
          monthly_income?: number | null
          old_id_number?: string | null
          permanent_address_city?: string | null
          permanent_address_district?: string | null
          permanent_address_street?: string | null
          permanent_address_ward?: string | null
          phone?: string | null
          portrait_photo_url?: string | null
          updated_at?: string | null
          work_experience_years?: number | null
        }
        Relationships: []
      }
      promotional_loan_alerts: {
        Row: {
          alert_data: Json | null
          alert_type: string
          created_at: string
          current_monthly_payment: number | null
          days_until_change: number | null
          existing_loan_id: string
          future_monthly_payment: number | null
          id: string
          is_active: boolean | null
          is_read: boolean | null
          monthly_increase: number | null
          read_at: string | null
          total_cost_increase: number | null
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_data?: Json | null
          alert_type: string
          created_at?: string
          current_monthly_payment?: number | null
          days_until_change?: number | null
          existing_loan_id: string
          future_monthly_payment?: number | null
          id?: string
          is_active?: boolean | null
          is_read?: boolean | null
          monthly_increase?: number | null
          read_at?: string | null
          total_cost_increase?: number | null
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_data?: Json | null
          alert_type?: string
          created_at?: string
          current_monthly_payment?: number | null
          days_until_change?: number | null
          existing_loan_id?: string
          future_monthly_payment?: number | null
          id?: string
          is_active?: boolean | null
          is_read?: boolean | null
          monthly_increase?: number | null
          read_at?: string | null
          total_cost_increase?: number | null
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotional_loan_alerts_existing_loan_id_fkey"
            columns: ["existing_loan_id"]
            isOneToOne: false
            referencedRelation: "existing_loans"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notification_tokens: {
        Row: {
          created_at: string
          device_type: string
          id: string
          is_active: boolean
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type: string
          id?: string
          is_active?: boolean
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string
          id?: string
          is_active?: boolean
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      typing_indicators: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_typing: boolean
          last_typing_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_typing?: boolean
          last_typing_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_typing?: boolean
          last_typing_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          created_at: string
          id: string
          last_seen: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_seen?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_seen?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          points_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          points_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          points_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          status: string
          transaction_type: string
          updated_at: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_notifications: {
        Row: {
          acknowledged_at: string | null
          action_required: boolean | null
          action_url: string | null
          created_at: string | null
          id: string
          loan_application_id: string
          message: string
          notification_type: string
          read_at: string | null
          recipient_id: string
          title: string
          workflow_stage: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          action_required?: boolean | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          loan_application_id: string
          message: string
          notification_type: string
          read_at?: string | null
          recipient_id: string
          title: string
          workflow_stage?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          action_required?: boolean | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          loan_application_id?: string
          message?: string
          notification_type?: string
          read_at?: string | null
          recipient_id?: string
          title?: string
          workflow_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_notifications_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_promotional_cost_increase: {
        Args: { loan_id: string }
        Returns: Json
      }
      check_cic_impact_and_warn: {
        Args: { customer_uuid: string }
        Returns: Json
      }
      cleanup_old_typing_indicators: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_bank_offers: {
        Args: { application_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      search_messages: {
        Args: {
          p_conversation_id: string
          p_search_query?: string
          p_sender_id?: string
          p_date_from?: string
          p_date_to?: string
          p_message_type?: string
        }
        Returns: {
          id: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          message_type: string
          read_at: string
          created_at: string
          rank: number
        }[]
      }
      update_typing_indicator: {
        Args: { conv_id: string; user_uuid: string; typing: boolean }
        Returns: undefined
      }
      update_user_presence: {
        Args: { user_uuid: string; new_status: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "customer" | "advisor" | "admin" | "bank_employee"
      application_stage_enum:
        | "draft"
        | "submitted"
        | "under_review"
        | "offers_pending"
        | "offers_received"
        | "customer_reviewing"
        | "legal_review"
        | "approved"
        | "rejected"
        | "completed"
      employment_type:
        | "employee"
        | "self_employed"
        | "freelancer"
        | "retired"
        | "student"
        | "unemployed"
      gender_type: "nam" | "nu" | "khac"
      id_type: "cccd" | "cmnd"
      loan_status: "draft" | "pending" | "approved" | "rejected" | "reviewing"
      loan_type:
        | "personal"
        | "mortgage"
        | "business"
        | "auto"
        | "education"
        | "credit_loan"
        | "mortgage_loan"
      points_transaction_type:
        | "purchase"
        | "spend"
        | "reward"
        | "refund"
        | "adjustment"
      workflow_stage_enum:
        | "initiated"
        | "survey_completed"
        | "employee_matched"
        | "offers_received"
        | "offers_compared"
        | "legal_shared"
        | "final_selection"
        | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "advisor", "admin", "bank_employee"],
      application_stage_enum: [
        "draft",
        "submitted",
        "under_review",
        "offers_pending",
        "offers_received",
        "customer_reviewing",
        "legal_review",
        "approved",
        "rejected",
        "completed",
      ],
      employment_type: [
        "employee",
        "self_employed",
        "freelancer",
        "retired",
        "student",
        "unemployed",
      ],
      gender_type: ["nam", "nu", "khac"],
      id_type: ["cccd", "cmnd"],
      loan_status: ["draft", "pending", "approved", "rejected", "reviewing"],
      loan_type: [
        "personal",
        "mortgage",
        "business",
        "auto",
        "education",
        "credit_loan",
        "mortgage_loan",
      ],
      points_transaction_type: [
        "purchase",
        "spend",
        "reward",
        "refund",
        "adjustment",
      ],
      workflow_stage_enum: [
        "initiated",
        "survey_completed",
        "employee_matched",
        "offers_received",
        "offers_compared",
        "legal_shared",
        "final_selection",
        "completed",
      ],
    },
  },
} as const
