-- Rename dealer_profiles table to broker_profiles
ALTER TABLE public.dealer_profiles RENAME TO broker_profiles;

-- Update the verify_dealer_profile function to verify_broker_profile
DROP FUNCTION IF EXISTS public.verify_dealer_profile(uuid, text);

CREATE OR REPLACE FUNCTION public.verify_broker_profile(target_user_id uuid, verification_notes_param text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can verify brokers';
    END IF;
    
    -- Update broker verification
    UPDATE public.broker_profiles
    SET 
        is_verified = true,
        verified_at = now(),
        verified_by = auth.uid(),
        verification_notes = verification_notes_param,
        updated_at = now()
    WHERE user_id = target_user_id;
END;
$function$;

-- Update app_role enum to replace 'dealer' with 'broker'
ALTER TYPE public.app_role RENAME TO app_role_old;
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'agent', 'broker');

-- Update user_roles table to use new enum
ALTER TABLE public.user_roles 
ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE public.app_role 
USING role::text::public.app_role;

-- Update any existing 'dealer' roles to 'broker'
UPDATE public.user_roles SET role = 'broker' WHERE role::text = 'dealer';

-- Drop old enum
DROP TYPE public.app_role_old;