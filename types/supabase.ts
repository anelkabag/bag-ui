export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
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
      component_downloads: {
        Row: {
          id: string;
          component: string;
          project_id: string;
          user_id: string | null;
          cli_version: string | null;
          os: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          component: string;
          project_id: string;
          user_id?: string | null;
          cli_version?: string | null;
          os?: string | null;
          created_at?: string;
        };
        Update: {
          component?: string;
          project_id?: string;
          user_id?: string | null;
          cli_version?: string | null;
          os?: string | null;
          created_at?: string;
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
};
