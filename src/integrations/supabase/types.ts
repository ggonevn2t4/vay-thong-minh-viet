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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employment_type:
        | "employee"
        | "self_employed"
        | "freelancer"
        | "retired"
        | "student"
        | "unemployed"
      loan_status: "draft" | "pending" | "approved" | "rejected" | "reviewing"
      loan_type: "personal" | "mortgage" | "business" | "auto" | "education"
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
    },
  },
} as const
