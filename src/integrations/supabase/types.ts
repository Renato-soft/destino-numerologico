export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      advanced_reports: {
        Row: {
          created_at: string
          edited_sections: Json | null
          finalized_at: string | null
          generated_at: string | null
          id: string
          pdf_url: string | null
          sections: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          edited_sections?: Json | null
          finalized_at?: string | null
          generated_at?: string | null
          id?: string
          pdf_url?: string | null
          sections?: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          edited_sections?: Json | null
          finalized_at?: string | null
          generated_at?: string | null
          id?: string
          pdf_url?: string | null
          sections?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_notifications: {
        Row: {
          actor_name: string
          created_at: string
          id: string
          post_id: string
          post_preview: string
          read: boolean
          type: string
          user_id: string
          vibration: number | null
        }
        Insert: {
          actor_name: string
          created_at?: string
          id?: string
          post_id: string
          post_preview?: string
          read?: boolean
          type: string
          user_id: string
          vibration?: number | null
        }
        Update: {
          actor_name?: string
          created_at?: string
          id?: string
          post_id?: string
          post_preview?: string
          read?: boolean
          type?: string
          user_id?: string
          vibration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          personal_year: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          personal_year?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          personal_year?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
          vibration: number
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
          vibration: number
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
          vibration?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reason: string
          reporter_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason: string
          reporter_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          content: string
          created_at: string
          id: string
          report_date: string
          sent_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          report_date: string
          sent_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          report_date?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feature_schedule: {
        Row: {
          created_at: string
          enabled: boolean
          feature_key: string
          feature_label: string
          id: string
          unlock_after_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feature_key: string
          feature_label: string
          id?: string
          unlock_after_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feature_key?: string
          feature_label?: string
          id?: string
          unlock_after_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      numerology_maps: {
        Row: {
          computed_at: string
          created_at: string
          cycles_json: Json
          destiny_expression: number
          id: string
          life_path: number
          narrative_text: string | null
          pdf_url: string | null
          personal_month: number | null
          personal_year: number
          personal_year_reference: number
          personality: number
          raw_calculations_json: Json
          soul: number
          user_id: string
        }
        Insert: {
          computed_at?: string
          created_at?: string
          cycles_json?: Json
          destiny_expression: number
          id?: string
          life_path: number
          narrative_text?: string | null
          pdf_url?: string | null
          personal_month?: number | null
          personal_year: number
          personal_year_reference: number
          personality: number
          raw_calculations_json?: Json
          soul: number
          user_id: string
        }
        Update: {
          computed_at?: string
          created_at?: string
          cycles_json?: Json
          destiny_expression?: number
          id?: string
          life_path?: number
          narrative_text?: string | null
          pdf_url?: string | null
          personal_month?: number | null
          personal_year?: number
          personal_year_reference?: number
          personality?: number
          raw_calculations_json?: Json
          soul?: number
          user_id?: string
        }
        Relationships: []
      }
      pay_per_use_purchases: {
        Row: {
          created_at: string
          id: string
          product_id: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string
          id: string
          storage_path: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          storage_path: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          storage_path?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pillar_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      pillar_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          exercise_completed: boolean
          id: string
          meditation_completed: boolean
          pillar_index: number
          started_at: string | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          exercise_completed?: boolean
          id?: string
          meditation_completed?: boolean
          pillar_index: number
          started_at?: string | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          exercise_completed?: boolean
          id?: string
          meditation_completed?: boolean
          pillar_index?: number
          started_at?: string | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string
          cognome: string
          created_at: string
          id: string
          language: string
          nome: string
          onboarding_completed: boolean | null
          residence_state: string | null
          sesso: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          whatsapp_consent_at: string | null
          whatsapp_notification_time: string | null
          whatsapp_notifications_enabled: boolean | null
          whatsapp_phone: string | null
        }
        Insert: {
          birth_date: string
          cognome: string
          created_at?: string
          id?: string
          language?: string
          nome: string
          onboarding_completed?: boolean | null
          residence_state?: string | null
          sesso?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          whatsapp_consent_at?: string | null
          whatsapp_notification_time?: string | null
          whatsapp_notifications_enabled?: boolean | null
          whatsapp_phone?: string | null
        }
        Update: {
          birth_date?: string
          cognome?: string
          created_at?: string
          id?: string
          language?: string
          nome?: string
          onboarding_completed?: boolean | null
          residence_state?: string | null
          sesso?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_consent_at?: string | null
          whatsapp_notification_time?: string | null
          whatsapp_notifications_enabled?: boolean | null
          whatsapp_phone?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          activated_at: string | null
          created_at: string
          description: string | null
          duration_hours: number
          id: string
          is_active: boolean
          services: string[]
          title: string
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number
          id?: string
          is_active?: boolean
          services?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number
          id?: string
          is_active?: boolean
          services?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_promotions: {
        Row: {
          claimed_at: string
          created_at: string
          expires_at: string
          id: string
          promotion_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          created_at?: string
          expires_at: string
          id?: string
          promotion_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          promotion_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_promotions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_service_overrides: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          service_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          service_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          service_key?: string
          user_id?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
