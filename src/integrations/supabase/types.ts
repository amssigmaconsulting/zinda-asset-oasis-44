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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      affiliate_applications: {
        Row: {
          additional_info: string | null
          audience: string | null
          created_at: string
          email: string
          expected_referrals: string | null
          experience: string | null
          full_name: string
          id: string
          phone: string
          referral_methods: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          additional_info?: string | null
          audience?: string | null
          created_at?: string
          email: string
          expected_referrals?: string | null
          experience?: string | null
          full_name: string
          id?: string
          phone: string
          referral_methods?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          additional_info?: string | null
          audience?: string | null
          created_at?: string
          email?: string
          expected_referrals?: string | null
          experience?: string | null
          full_name?: string
          id?: string
          phone?: string
          referral_methods?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      agent_profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          experience_years: number | null
          id: string
          is_verified: boolean | null
          languages: string[] | null
          license_number: string | null
          location: string | null
          name: string
          phone: string | null
          profile_image_url: string | null
          rating: number | null
          specialties: string[] | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          experience_years?: number | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          license_number?: string | null
          location?: string | null
          name: string
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          experience_years?: number | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          license_number?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          auction_listing_id: string
          bid_amount: number
          bidder_id: string
          created_at: string
          id: string
        }
        Insert: {
          auction_listing_id: string
          bid_amount: number
          bidder_id: string
          created_at?: string
          id?: string
        }
        Update: {
          auction_listing_id?: string
          bid_amount?: number
          bidder_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_listing_id_fkey"
            columns: ["auction_listing_id"]
            isOneToOne: false
            referencedRelation: "auction_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_listings: {
        Row: {
          auction_end_time: string
          bid_increment: number
          created_at: string
          current_bid: number
          highest_bidder_id: string | null
          id: string
          property_listing_id: string | null
          starting_bid: number
          status: string
          total_bids: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auction_end_time: string
          bid_increment?: number
          created_at?: string
          current_bid: number
          highest_bidder_id?: string | null
          id?: string
          property_listing_id?: string | null
          starting_bid: number
          status?: string
          total_bids?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auction_end_time?: string
          bid_increment?: number
          created_at?: string
          current_bid?: number
          highest_bidder_id?: string | null
          id?: string
          property_listing_id?: string | null
          starting_bid?: number
          status?: string
          total_bids?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_listings_property_listing_id_fkey"
            columns: ["property_listing_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_auction_property_listing"
            columns: ["property_listing_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_profiles: {
        Row: {
          address: string | null
          business_registration_number: string | null
          business_type: string | null
          company_name: string
          contact_person: string
          created_at: string
          description: string | null
          email: string
          id: string
          is_verified: boolean
          operating_hours: Json | null
          phone: string | null
          profile_image_url: string | null
          specialties: string[] | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          is_verified?: boolean
          operating_hours?: Json | null
          phone?: string | null
          profile_image_url?: string | null
          specialties?: string[] | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          is_verified?: boolean
          operating_hours?: Json | null
          phone?: string | null
          profile_image_url?: string | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          address: string
          annual_revenue: number | null
          company_name: string
          company_type: string
          contact_person: string
          created_at: string
          description: string | null
          email: string
          employee_count: number | null
          id: string
          industry: string | null
          is_verified: boolean
          logo_url: string | null
          phone: string | null
          registration_number: string
          tax_id: string | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
          website_url: string | null
        }
        Insert: {
          address: string
          annual_revenue?: number | null
          company_name: string
          company_type: string
          contact_person: string
          created_at?: string
          description?: string | null
          email: string
          employee_count?: number | null
          id?: string
          industry?: string | null
          is_verified?: boolean
          logo_url?: string | null
          phone?: string | null
          registration_number: string
          tax_id?: string | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string
          annual_revenue?: number | null
          company_name?: string
          company_type?: string
          contact_person?: string
          created_at?: string
          description?: string | null
          email?: string
          employee_count?: number | null
          id?: string
          industry?: string | null
          is_verified?: boolean
          logo_url?: string | null
          phone?: string | null
          registration_number?: string
          tax_id?: string | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          stripe_session_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          stripe_session_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          stripe_session_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listing_loves: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: []
      }
      listing_views: {
        Row: {
          id: string
          listing_id: string
          viewed_at: string
          viewer_ip: string | null
          viewer_user_id: string | null
        }
        Insert: {
          id?: string
          listing_id: string
          viewed_at?: string
          viewer_ip?: string | null
          viewer_user_id?: string | null
        }
        Update: {
          id?: string
          listing_id?: string
          viewed_at?: string
          viewer_ip?: string | null
          viewer_user_id?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_verified: boolean
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          is_verified?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_verified?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      property_listings: {
        Row: {
          bathrooms: number | null
          bedrooms: number | null
          condition: string | null
          created_at: string
          description: string | null
          fuel_type: string | null
          id: string
          images: string[] | null
          listing_purpose: string
          location: string
          make: string | null
          mileage: string | null
          model: string | null
          price: number
          property_type: string
          square_feet: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
          year: number | null
        }
        Insert: {
          bathrooms?: number | null
          bedrooms?: number | null
          condition?: string | null
          created_at?: string
          description?: string | null
          fuel_type?: string | null
          id?: string
          images?: string[] | null
          listing_purpose?: string
          location: string
          make?: string | null
          mileage?: string | null
          model?: string | null
          price: number
          property_type: string
          square_feet?: number | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          year?: number | null
        }
        Update: {
          bathrooms?: number | null
          bedrooms?: number | null
          condition?: string | null
          created_at?: string
          description?: string | null
          fuel_type?: string | null
          id?: string
          images?: string[] | null
          listing_purpose?: string
          location?: string
          make?: string | null
          mileage?: string | null
          model?: string | null
          price?: number
          property_type?: string
          square_feet?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      retailer_profiles: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_verified: boolean
          last_name: string
          monthly_volume: string
          phone: string | null
          product_categories: string | null
          state: string
          store_name: string
          store_type: string
          updated_at: string
          user_id: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_verified?: boolean
          last_name: string
          monthly_volume: string
          phone?: string | null
          product_categories?: string | null
          state: string
          store_name: string
          store_type: string
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_verified?: boolean
          last_name?: string
          monthly_volume?: string
          phone?: string | null
          product_categories?: string | null
          state?: string
          store_name?: string
          store_type?: string
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_agent_dashboard_analytics: {
        Args: { agent_user_id: string }
        Returns: {
          active_listings: number
          listings_this_month: number
          total_inquiries: number
          total_listings: number
          total_views: number
        }[]
      }
      get_listing_analytics: {
        Args: { listing_id_param: string }
        Returns: {
          daily_views: Json
          total_views: number
          unique_viewers: number
          views_this_month: number
          views_this_week: number
        }[]
      }
      get_listing_loves: {
        Args: { listing_id_param: string }
        Returns: {
          total_loves: number
          user_loves: Json
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_sufficient_credits: {
        Args: { required_credits: number; user_id_param: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_credits: {
        Args: {
          amount_param: number
          description_param?: string
          stripe_session_id_param?: string
          transaction_type_param: string
          user_id_param: string
        }
        Returns: undefined
      }
      verify_agent_profile: {
        Args: { target_user_id: string; verification_notes_param?: string }
        Returns: undefined
      }
      verify_broker_profile: {
        Args: { target_user_id: string; verification_notes_param?: string }
        Returns: undefined
      }
      verify_company_profile: {
        Args: { target_user_id: string; verification_notes_param?: string }
        Returns: undefined
      }
      verify_retailer_profile: {
        Args: { target_user_id: string; verification_notes_param?: string }
        Returns: undefined
      }
      verify_user_profile: {
        Args: { target_user_id: string; verification_notes_param?: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "agent" | "broker"
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
      app_role: ["admin", "user", "agent", "broker"],
    },
  },
} as const
