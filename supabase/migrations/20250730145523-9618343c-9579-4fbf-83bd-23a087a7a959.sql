-- Create user roles enum and system
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'agent', 'dealer');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Add verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by UUID REFERENCES auth.users(id),
ADD COLUMN verification_notes TEXT;

-- Create dealers table
CREATE TABLE public.dealer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    business_registration_number TEXT,
    business_type TEXT,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    website_url TEXT,
    description TEXT,
    specialties TEXT[],
    operating_hours JSONB,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    verification_notes TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dealer_profiles
ALTER TABLE public.dealer_profiles ENABLE ROW LEVEL SECURITY;

-- Create companies table for corporate entities
CREATE TABLE public.company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    tax_id TEXT,
    company_type TEXT NOT NULL,
    industry TEXT,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    website_url TEXT,
    description TEXT,
    employee_count INTEGER,
    annual_revenue NUMERIC,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    verification_notes TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on company_profiles
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Update agent_profiles to include verification tracking
ALTER TABLE public.agent_profiles 
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by UUID REFERENCES auth.users(id),
ADD COLUMN verification_notes TEXT;

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.is_admin());

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Update profiles RLS policies to allow admin access
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.is_admin());

-- RLS Policies for dealer_profiles
CREATE POLICY "Anyone can view verified dealers"
ON public.dealer_profiles
FOR SELECT
USING (is_verified = true);

CREATE POLICY "Dealers can manage their own profile"
ON public.dealer_profiles
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all dealer profiles"
ON public.dealer_profiles
FOR ALL
USING (public.is_admin());

-- RLS Policies for company_profiles
CREATE POLICY "Anyone can view verified companies"
ON public.company_profiles
FOR SELECT
USING (is_verified = true);

CREATE POLICY "Companies can manage their own profile"
ON public.company_profiles
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all company profiles"
ON public.company_profiles
FOR ALL
USING (public.is_admin());

-- Update agent_profiles RLS to allow admin access
CREATE POLICY "Admins can view all agent profiles"
ON public.agent_profiles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all agent profiles"
ON public.agent_profiles
FOR UPDATE
USING (public.is_admin());

-- Create verification management functions
CREATE OR REPLACE FUNCTION public.verify_user_profile(
    target_user_id UUID,
    verification_notes_param TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can verify users';
    END IF;
    
    -- Update profile verification
    UPDATE public.profiles
    SET 
        is_verified = true,
        verified_at = now(),
        verified_by = auth.uid(),
        verification_notes = verification_notes_param,
        updated_at = now()
    WHERE user_id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_agent_profile(
    target_user_id UUID,
    verification_notes_param TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can verify agents';
    END IF;
    
    -- Update agent verification
    UPDATE public.agent_profiles
    SET 
        is_verified = true,
        verified_at = now(),
        verified_by = auth.uid(),
        verification_notes = verification_notes_param,
        updated_at = now()
    WHERE user_id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_dealer_profile(
    target_user_id UUID,
    verification_notes_param TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can verify dealers';
    END IF;
    
    -- Update dealer verification
    UPDATE public.dealer_profiles
    SET 
        is_verified = true,
        verified_at = now(),
        verified_by = auth.uid(),
        verification_notes = verification_notes_param,
        updated_at = now()
    WHERE user_id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_company_profile(
    target_user_id UUID,
    verification_notes_param TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can verify companies';
    END IF;
    
    -- Update company verification
    UPDATE public.company_profiles
    SET 
        is_verified = true,
        verified_at = now(),
        verified_by = auth.uid(),
        verification_notes = verification_notes_param,
        updated_at = now()
    WHERE user_id = target_user_id;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_dealer_profiles_updated_at
    BEFORE UPDATE ON public.dealer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
    BEFORE UPDATE ON public.company_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();