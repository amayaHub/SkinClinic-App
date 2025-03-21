export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: number
          name: string
          description: string
          duration: string
          image: string
          price: number
          benefits: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          duration: string
          image: string
          price?: number
          benefits: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          duration?: string
          image?: string
          price?: number
          benefits?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          age: number | null
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
          birth_date: string | null
        }
        Insert: {
          id: string
          email?: string | null
          age?: number | null
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          birth_date?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          age?: number | null
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          birth_date?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          service_id: number
          scheduled_for: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          closed: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: number
          scheduled_for: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          closed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: number
          scheduled_for?: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}