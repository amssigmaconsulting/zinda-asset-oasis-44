-- Fix security warnings by updating functions with proper search_path
CREATE OR REPLACE FUNCTION public.update_agent_profiles_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix search_path for existing function
CREATE OR REPLACE FUNCTION public.handle_new_agent_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only create agent profile if user metadata indicates agent role
  IF NEW.raw_user_meta_data ->> 'user_type' = 'agent' THEN
    INSERT INTO public.agent_profiles (
      user_id, 
      name, 
      email,
      phone,
      specialties,
      languages,
      location,
      bio
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
      NEW.email,
      NEW.raw_user_meta_data ->> 'phone',
      CASE 
        WHEN NEW.raw_user_meta_data ->> 'specialties' IS NOT NULL 
        THEN string_to_array(NEW.raw_user_meta_data ->> 'specialties', ',')
        ELSE ARRAY[]::TEXT[]
      END,
      CASE 
        WHEN NEW.raw_user_meta_data ->> 'languages' IS NOT NULL 
        THEN string_to_array(NEW.raw_user_meta_data ->> 'languages', ',')
        ELSE ARRAY[]::TEXT[]
      END,
      NEW.raw_user_meta_data ->> 'location',
      NEW.raw_user_meta_data ->> 'bio'
    );
  END IF;
  RETURN NEW;
END;
$$;