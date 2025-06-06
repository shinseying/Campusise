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
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          addressee_id: string | null
          created_at: string | null
          id: string
          is_starred: boolean | null
          requester_id: string | null
          status: Database["public"]["Enums"]["friendship_status"] | null
          updated_at: string | null
        }
        Insert: {
          addressee_id?: string | null
          created_at?: string | null
          id?: string
          is_starred?: boolean | null
          requester_id?: string | null
          status?: Database["public"]["Enums"]["friendship_status"] | null
          updated_at?: string | null
        }
        Update: {
          addressee_id?: string | null
          created_at?: string | null
          id?: string
          is_starred?: boolean | null
          requester_id?: string | null
          status?: Database["public"]["Enums"]["friendship_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chats: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          message_type: string | null
          sender_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          message_type?: string | null
          sender_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          message_type?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_chats_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_chats_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["member_role"] | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["member_role"] | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["member_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          conditions: string | null
          created_at: string | null
          creator_id: string | null
          current_members: number | null
          department: string | null
          description: string | null
          group_type: Database["public"]["Enums"]["group_type"]
          id: string
          max_members: number | null
          name: string
          university: string | null
          updated_at: string | null
        }
        Insert: {
          conditions?: string | null
          created_at?: string | null
          creator_id?: string | null
          current_members?: number | null
          department?: string | null
          description?: string | null
          group_type: Database["public"]["Enums"]["group_type"]
          id?: string
          max_members?: number | null
          name: string
          university?: string | null
          updated_at?: string | null
        }
        Update: {
          conditions?: string | null
          created_at?: string | null
          creator_id?: string | null
          current_members?: number | null
          department?: string | null
          description?: string | null
          group_type?: Database["public"]["Enums"]["group_type"]
          id?: string
          max_members?: number | null
          name?: string
          university?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          images: string[] | null
          is_read: boolean | null
          message_type: Database["public"]["Enums"]["message_type"]
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_read?: boolean | null
          message_type: Database["public"]["Enums"]["message_type"]
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_read?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"]
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          board_type: Database["public"]["Enums"]["board_type"]
          comments_count: number | null
          content: string
          created_at: string | null
          department: string | null
          dislikes_count: number | null
          id: string
          images: string[] | null
          is_anonymous: boolean | null
          likes_count: number | null
          title: string
          university: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          board_type: Database["public"]["Enums"]["board_type"]
          comments_count?: number | null
          content: string
          created_at?: string | null
          department?: string | null
          dislikes_count?: number | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          title: string
          university?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          board_type?: Database["public"]["Enums"]["board_type"]
          comments_count?: number | null
          content?: string
          created_at?: string | null
          department?: string | null
          dislikes_count?: number | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          title?: string
          university?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          department: string
          display_name: string
          id: string
          profile_image_url: string | null
          student_id: string | null
          university: string
          updated_at: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          department: string
          display_name: string
          id: string
          profile_image_url?: string | null
          student_id?: string | null
          university: string
          updated_at?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          department?: string
          display_name?: string
          id?: string
          profile_image_url?: string | null
          student_id?: string | null
          university?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          classroom: string | null
          course_name: string
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          professor: string | null
          semester: string | null
          start_time: string
          updated_at: string | null
          user_id: string | null
          year: number | null
        }
        Insert: {
          classroom?: string | null
          course_name: string
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          professor?: string | null
          semester?: string | null
          start_time: string
          updated_at?: string | null
          user_id?: string | null
          year?: number | null
        }
        Update: {
          classroom?: string | null
          course_name?: string
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          professor?: string | null
          semester?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      board_type: "international" | "campus" | "department"
      friendship_status: "pending" | "accepted" | "rejected" | "blocked"
      group_type: "public" | "conditional"
      member_role: "admin" | "moderator" | "member"
      message_type: "dm" | "anonymous"
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
      board_type: ["international", "campus", "department"],
      friendship_status: ["pending", "accepted", "rejected", "blocked"],
      group_type: ["public", "conditional"],
      member_role: ["admin", "moderator", "member"],
      message_type: ["dm", "anonymous"],
    },
  },
} as const
