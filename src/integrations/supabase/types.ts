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
      kanban_columns: {
        Row: {
          created_at: string
          id: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      kanban_items: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          author: string | null
          column_id: string | null
          comments: Json | null
          content: string | null
          created_at: string
          deleted: boolean | null
          description: string | null
          due_date: string | null
          icon: string | null
          id: string
          image: string | null
          media: Json | null
          order_index: number
          priority: string | null
          progress: number | null
          related_items: string[] | null
          source_info: string | null
          status: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          author?: string | null
          column_id?: string | null
          comments?: Json | null
          content?: string | null
          created_at?: string
          deleted?: boolean | null
          description?: string | null
          due_date?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          media?: Json | null
          order_index: number
          priority?: string | null
          progress?: number | null
          related_items?: string[] | null
          source_info?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          author?: string | null
          column_id?: string | null
          comments?: Json | null
          content?: string | null
          created_at?: string
          deleted?: boolean | null
          description?: string | null
          due_date?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          media?: Json | null
          order_index?: number
          priority?: string | null
          progress?: number | null
          related_items?: string[] | null
          source_info?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "kanban_items_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "kanban_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          content_type: string | null
          created_at: string
          effective_date: string
          file_path: string
          filename: string
          id: string
          metadata: Json | null
          provider_name: string
          size: number | null
          status: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          effective_date: string
          file_path: string
          filename: string
          id?: string
          metadata?: Json | null
          provider_name: string
          size?: number | null
          status?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          effective_date?: string
          file_path?: string
          filename?: string
          id?: string
          metadata?: Json | null
          provider_name?: string
          size?: number | null
          status?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          content_type: string | null
          created_at: string | null
          delivery_date: string | null
          file_path: string
          filename: string
          id: string
          metadata: Json | null
          size: number | null
          status: string | null
          stock_id: string | null
          updated_at: string | null
          user_id: string | null
          vendor_name: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          delivery_date?: string | null
          file_path: string
          filename: string
          id?: string
          metadata?: Json | null
          size?: number | null
          status?: string | null
          stock_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          delivery_date?: string | null
          file_path?: string
          filename?: string
          id?: string
          metadata?: Json | null
          size?: number | null
          status?: string | null
          stock_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_name?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
