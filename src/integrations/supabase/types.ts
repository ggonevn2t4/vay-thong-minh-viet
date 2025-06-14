export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operating_areas: string[] | null
          permanent_address: string | null
          personal_kyc_documents: Json | null
          phone: string | null
          position: string | null
          processing_priority: string[] | null
          rate_update_frequency: string | null
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
          operating_areas?: string[] | null
          permanent_address?: string | null
          personal_kyc_documents?: Json | null
          phone?: string | null
          position?: string | null
          processing_priority?: string[] | null
          rate_update_frequency?: string | null
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
          operating_areas?: string[] | null
          permanent_address?: string | null
          personal_kyc_documents?: Json | null
          phone?: string | null
          position?: string | null
          processing_priority?: string[] | null
          rate_update_frequency?: string | null
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
      document_requests: {
        Row: {
          advisor_id: string | null
          customer_id: string
          description: string | null
          document_name: string
          document_type: string
          file_url: string | null
          id: string
          loan_application_id: string | null
          notes: string | null
          requested_at: string
          reviewed_at: string | null
          status: string
          uploaded_at: string | null
        }
        Insert: {
          advisor_id?: string | null
          customer_id: string
          description?: string | null
          document_name: string
          document_type: string
          file_url?: string | null
          id?: string
          loan_application_id?: string | null
          notes?: string | null
          requested_at?: string
          reviewed_at?: string | null
          status?: string
          uploaded_at?: string | null
        }
        Update: {
          advisor_id?: string | null
          customer_id?: string
          description?: string | null
          document_name?: string
          document_type?: string
          file_url?: string | null
          id?: string
          loan_application_id?: string | null
          notes?: string | null
          requested_at?: string
          reviewed_at?: string | null
          status?: string
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
      loan_applications: {
        Row: {
          amount: number
          bank_responses: Json | null
          created_at: string | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          id: string
          loan_type: Database["public"]["Enums"]["loan_type"]
          monthly_income: number | null
          purpose: string | null
          status: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_responses?: Json | null
          created_at?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          id?: string
          loan_type: Database["public"]["Enums"]["loan_type"]
          monthly_income?: number | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_responses?: Json | null
          created_at?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          id?: string
          loan_type?: Database["public"]["Enums"]["loan_type"]
          monthly_income?: number | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          date_of_birth: string | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          full_name: string | null
          id: string
          monthly_income: number | null
          phone: string | null
          updated_at: string | null
          work_experience_years: number | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          full_name?: string | null
          id: string
          monthly_income?: number | null
          phone?: string | null
          updated_at?: string | null
          work_experience_years?: number | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          full_name?: string | null
          id?: string
          monthly_income?: number | null
          phone?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_promotional_cost_increase: {
        Args: { loan_id: string }
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
    }
    Enums: {
      app_role: "customer" | "advisor" | "admin" | "bank_employee"
      employment_type:
        | "employee"
        | "self_employed"
        | "freelancer"
        | "retired"
        | "student"
        | "unemployed"
      loan_status: "draft" | "pending" | "approved" | "rejected" | "reviewing"
      loan_type: "personal" | "mortgage" | "business" | "auto" | "education"
      points_transaction_type:
        | "purchase"
        | "spend"
        | "reward"
        | "refund"
        | "adjustment"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "advisor", "admin", "bank_employee"],
      employment_type: [
        "employee",
        "self_employed",
        "freelancer",
        "retired",
        "student",
        "unemployed",
      ],
      loan_status: ["draft", "pending", "approved", "rejected", "reviewing"],
      loan_type: ["personal", "mortgage", "business", "auto", "education"],
      points_transaction_type: [
        "purchase",
        "spend",
        "reward",
        "refund",
        "adjustment",
      ],
    },
  },
} as const
