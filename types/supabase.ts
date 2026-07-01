export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          plan?: string | null;
          subscription_plan?: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          plan?: string | null;
          subscription_plan?: string | null;
        };
        Update: {
          email?: string;
          username?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          plan?: string | null;
          subscription_plan?: string | null;
        };
      };
    };
    Functions: {
      [key: string]: never;
    };
    Enums: {
      [key: string]: never;
    };
  };
}
