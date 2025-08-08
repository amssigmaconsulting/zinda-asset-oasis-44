-- Create agent profiles table
CREATE TABLE public.agent_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialties TEXT[],
  languages TEXT[],
  location TEXT,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  profile_image_url TEXT,
  license_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for agent profiles
CREATE POLICY "Agents can view all profiles" 
ON public.agent_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Agents can create their own profile" 
ON public.agent_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents can update their own profile" 
ON public.agent_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Agents can delete their own profile" 
ON public.agent_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_agent_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agent_profiles_updated_at
BEFORE UPDATE ON public.agent_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_agent_profiles_updated_at();

-- Create function to handle new agent registration
CREATE OR REPLACE FUNCTION public.handle_new_agent_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new agent users
CREATE TRIGGER on_auth_user_created_agent
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_agent_user();