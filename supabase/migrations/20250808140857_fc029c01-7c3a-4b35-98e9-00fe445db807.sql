-- Create listing_loves table to track user loves for listings
CREATE TABLE public.listing_loves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(listing_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.listing_loves ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listing_loves
CREATE POLICY "Users can love listings" 
ON public.listing_loves 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own loves" 
ON public.listing_loves 
FOR DELETE 
USING (auth.uid() = user_id);

-- Anyone can view loves for public listing analytics
CREATE POLICY "Anyone can view listing loves" 
ON public.listing_loves 
FOR SELECT 
USING (true);

-- Create function to get listing love analytics
CREATE OR REPLACE FUNCTION public.get_listing_loves(listing_id_param uuid)
RETURNS TABLE(
  total_loves bigint,
  user_loves json
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Get total loves count
  SELECT count(*) INTO total_loves
  FROM public.listing_loves 
  WHERE listing_loves.listing_id = listing_id_param;
  
  -- Get user loves with profile info
  WITH love_data AS (
    SELECT 
      ll.user_id,
      ll.created_at,
      COALESCE(p.first_name || ' ' || p.last_name, ap.name, dp.contact_person, cp.contact_person) as lover_name,
      COALESCE(p.avatar_url, ap.profile_image_url, dp.profile_image_url, cp.logo_url) as avatar_url
    FROM public.listing_loves ll
    LEFT JOIN public.profiles p ON ll.user_id = p.user_id
    LEFT JOIN public.agent_profiles ap ON ll.user_id = ap.user_id
    LEFT JOIN public.dealer_profiles dp ON ll.user_id = dp.user_id
    LEFT JOIN public.company_profiles cp ON ll.user_id = cp.user_id
    WHERE ll.listing_id = listing_id_param
    ORDER BY ll.created_at DESC
  )
  SELECT json_agg(
    json_build_object(
      'user_id', user_id,
      'name', lover_name,
      'avatar_url', avatar_url,
      'loved_at', created_at
    )
  ) INTO user_loves
  FROM love_data;
  
  RETURN QUERY SELECT 
    get_listing_loves.total_loves,
    COALESCE(get_listing_loves.user_loves, '[]'::json) as user_loves;
END;
$$;